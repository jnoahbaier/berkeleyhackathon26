import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { customAlphabet, nanoid } from "nanoid";

import { db } from "./db.js";
import { ARCHETYPES, archetypeById, suggestArchetype } from "./archetypes.js";
import { generateBible, generateNextChapter, usingMock, provider } from "./ai.js";

const PORT = process.env.PORT || 4000;
const inviteCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("guild:join", (guildId) => {
    if (guildId) socket.join(`guild:${guildId}`);
  });
  socket.on("guild:leave", (guildId) => {
    if (guildId) socket.leave(`guild:${guildId}`);
  });
});

function emitGuild(guildId, event, payload) {
  io.to(`guild:${guildId}`).emit(event, payload);
}

// ---------------------------------------------------------------------------
// Serializers
// ---------------------------------------------------------------------------
function profileFor(userId) {
  return db.find("profiles", (p) => p.user_id === userId) ?? null;
}

function memberView(m) {
  const user = db.find("users", (u) => u.id === m.user_id);
  return {
    user_id: m.user_id,
    display_name: user?.display_name ?? "Player",
    character: m.character ?? null,
    profile: profileFor(m.user_id),
    joined_at: m.joined_at,
  };
}

function chapterView(chapter) {
  if (!chapter) return null;
  const choices = db.filter("choices", (c) => c.chapter_id === chapter.id);
  return { ...chapter, choices };
}

function serializeGuild(guild) {
  const members = db
    .filter("guild_members", (m) => m.guild_id === guild.id)
    .map(memberView);
  const chapters = db
    .filter("chapters", (c) => c.guild_id === guild.id)
    .sort((a, b) => a.idx - b.idx);
  const current = chapters.find((c) => c.idx === guild.current_chapter_index);
  return {
    ...guild,
    members,
    chapters: chapters.map((c) => ({
      id: c.id,
      idx: c.idx,
      title: c.title,
      status: c.status,
      released_at: c.released_at,
    })),
    current_chapter: chapterView(current),
  };
}

function findGuildOr404(req, res) {
  const guild = db.find("guilds", (g) => g.id === req.params.id);
  if (!guild) {
    res.status(404).json({ error: "Guild not found" });
    return null;
  }
  return guild;
}

// ---------------------------------------------------------------------------
// Health / meta
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ai: usingMock ? "mock" : "claude", provider });
});

app.get("/api/archetypes", (_req, res) => {
  res.json({ archetypes: ARCHETYPES });
});

// ---------------------------------------------------------------------------
// Users + profiles  (lightweight identity: a device gets a user id, no password)
// ---------------------------------------------------------------------------
app.post("/api/users", (req, res) => {
  const { display_name } = req.body ?? {};
  if (!display_name?.trim()) return res.status(400).json({ error: "display_name required" });
  const user = db.insert("users", {
    id: nanoid(),
    display_name: display_name.trim(),
    created_at: new Date().toISOString(),
  });
  res.json({ user });
});

app.get("/api/users/:id", (req, res) => {
  const user = db.find("users", (u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user, profile: profileFor(user.id) });
});

app.put("/api/users/:id/profile", (req, res) => {
  const user = db.find("users", (u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const fields = ["favorite_books", "favorite_movies", "favorite_games", "hobbies", "interests"];
  const patch = { user_id: user.id };
  for (const f of fields) patch[f] = Array.isArray(req.body?.[f]) ? req.body[f] : [];

  const existing = profileFor(user.id);
  const profile = existing
    ? db.update("profiles", (p) => p.user_id === user.id, patch)
    : db.insert("profiles", patch);
  res.json({ profile });
});

// ---------------------------------------------------------------------------
// Guilds
// ---------------------------------------------------------------------------
app.post("/api/guilds", (req, res) => {
  const { name, player_count, pages_per_night, release_time, archetype, created_by } =
    req.body ?? {};
  if (!created_by || !db.find("users", (u) => u.id === created_by))
    return res.status(400).json({ error: "valid created_by required" });

  const guild = db.insert("guilds", {
    id: nanoid(),
    name: name?.trim() || "Our Story",
    invite_code: inviteCode(),
    archetype: archetype ?? null,
    player_count: Math.min(Math.max(Number(player_count) || 2, 2), 4),
    pages_per_night: Math.min(Math.max(Number(pages_per_night) || 2, 1), 6),
    release_time: release_time || "22:00",
    current_chapter_index: -1,
    status: "lobby",
    story_bible: null,
    created_by,
    created_at: new Date().toISOString(),
  });

  db.insert("guild_members", {
    id: nanoid(),
    guild_id: guild.id,
    user_id: created_by,
    character: null,
    joined_at: new Date().toISOString(),
  });

  res.json({ guild: serializeGuild(guild) });
});

app.post("/api/guilds/join", (req, res) => {
  const { invite_code, user_id } = req.body ?? {};
  const guild = db.find(
    "guilds",
    (g) => g.invite_code === String(invite_code || "").toUpperCase()
  );
  if (!guild) return res.status(404).json({ error: "No guild with that code" });
  if (!db.find("users", (u) => u.id === user_id))
    return res.status(400).json({ error: "valid user_id required" });

  const members = db.filter("guild_members", (m) => m.guild_id === guild.id);
  const already = members.find((m) => m.user_id === user_id);
  if (!already) {
    if (members.length >= guild.player_count)
      return res.status(409).json({ error: "Guild is full" });
    if (guild.status !== "lobby")
      return res.status(409).json({ error: "Story already started" });
    db.insert("guild_members", {
      id: nanoid(),
      guild_id: guild.id,
      user_id,
      character: null,
      joined_at: new Date().toISOString(),
    });
  }
  const out = serializeGuild(guild);
  emitGuild(guild.id, "guild:update", out);
  res.json({ guild: out });
});

app.get("/api/guilds/:id", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  res.json({ guild: serializeGuild(guild) });
});

// Full chapter history (with choices) for the "story so far" timeline
app.get("/api/guilds/:id/chapters", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  const chapters = db
    .filter("chapters", (c) => c.guild_id === guild.id)
    .sort((a, b) => a.idx - b.idx)
    .map(chapterView);
  res.json({ chapters });
});

app.patch("/api/guilds/:id", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  const patch = {};
  if (typeof req.body?.name === "string") patch.name = req.body.name.trim();
  if (typeof req.body?.archetype === "string") patch.archetype = req.body.archetype;
  if (req.body?.pages_per_night != null)
    patch.pages_per_night = Math.min(Math.max(Number(req.body.pages_per_night) || 2, 1), 6);
  const updated = db.update("guilds", (g) => g.id === guild.id, patch);
  const out = serializeGuild(updated);
  emitGuild(guild.id, "guild:update", out);
  res.json({ guild: out });
});

app.patch("/api/guilds/:id/members/:userId/character", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  const member = db.update(
    "guild_members",
    (m) => m.guild_id === guild.id && m.user_id === req.params.userId,
    { character: req.body?.character ?? null }
  );
  if (!member) return res.status(404).json({ error: "Member not found" });
  const out = serializeGuild(guild);
  emitGuild(guild.id, "guild:update", out);
  res.json({ guild: out });
});

// Suggest an archetype from the combined player profiles
app.get("/api/guilds/:id/suggested-archetype", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  const profiles = db
    .filter("guild_members", (m) => m.guild_id === guild.id)
    .map((m) => profileFor(m.user_id))
    .filter(Boolean);
  res.json(suggestArchetype(profiles));
});

// ---------------------------------------------------------------------------
// Start story  ->  generate bible + chapter 1
// ---------------------------------------------------------------------------
app.post("/api/guilds/:id/start", async (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  if (guild.status !== "lobby")
    return res.status(409).json({ error: "Story already started" });

  const members = db
    .filter("guild_members", (m) => m.guild_id === guild.id)
    .map((m) => ({ ...m, ...memberView(m) }));
  if (members.length < 2)
    return res.status(400).json({ error: "Need at least 2 players to begin" });

  let archetype = archetypeById(guild.archetype);
  if (!archetype) {
    const profiles = members.map((m) => m.profile).filter(Boolean);
    archetype = suggestArchetype(profiles).archetype;
    db.update("guilds", (g) => g.id === guild.id, { archetype: archetype.id });
  }

  try {
    const bible = await generateBible({ guild, members, archetype });

    for (const ch of bible.characters ?? []) {
      db.update(
        "guild_members",
        (m) => m.guild_id === guild.id && m.user_id === ch.user_id,
        { character: { name: ch.name, role: ch.role, traits: ch.traits, arc: ch.arc } }
      );
    }

    db.update("guilds", (g) => g.id === guild.id, {
      status: "active",
      current_chapter_index: 0,
      story_bible: {
        title: bible.title,
        setting: bible.setting,
        tone: bible.tone,
        world_state: bible.world_state,
      },
    });

    const chapter = createChapter(guild.id, 0, bible.chapter);
    persistChoices(chapter.id, bible.chapter.choices, members);

    const out = serializeGuild(db.find("guilds", (g) => g.id === guild.id));
    emitGuild(guild.id, "guild:update", out);
    emitGuild(guild.id, "chapter:new", out.current_chapter);
    res.json({ guild: out });
  } catch (err) {
    console.error("start failed", err);
    res.status(500).json({ error: "Failed to generate the story" });
  }
});

// ---------------------------------------------------------------------------
// Submit a choice
// ---------------------------------------------------------------------------
app.post("/api/chapters/:chapterId/choices", (req, res) => {
  const { user_id, selected_option, custom_text } = req.body ?? {};
  const chapter = db.find("chapters", (c) => c.id === req.params.chapterId);
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });

  const choice = db.update(
    "choices",
    (c) => c.chapter_id === chapter.id && c.user_id === user_id,
    {
      selected_option: selected_option ?? null,
      custom_text: custom_text ?? null,
      submitted_at: new Date().toISOString(),
      auto_filled: false,
    }
  );
  if (!choice) return res.status(404).json({ error: "No choice slot for this player" });

  emitGuild(chapter.guild_id, "choice:update", choiceStatus(chapter));
  res.json({ choice });
});

// ---------------------------------------------------------------------------
// Advance the night  ->  resolve current chapter + generate the next one
// ---------------------------------------------------------------------------
app.post("/api/guilds/:id/advance", async (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  if (guild.status !== "active")
    return res.status(409).json({ error: "Story is not active" });

  const current = db.find(
    "chapters",
    (c) => c.guild_id === guild.id && c.idx === guild.current_chapter_index
  );
  if (!current) return res.status(400).json({ error: "No active chapter" });

  const members = db
    .filter("guild_members", (m) => m.guild_id === guild.id)
    .map((m) => ({ ...m, ...memberView(m) }));

  // Collect decisions, auto-filling anyone who didn't submit (keeps the guild aligned).
  const decisions = members.map((m) => {
    const choice = db.find(
      "choices",
      (c) => c.chapter_id === current.id && c.user_id === m.user_id
    );
    let selected = choice?.selected_option;
    let autoFilled = false;
    if (!choice?.submitted_at) {
      selected = choice?.options?.[0]?.id ?? null;
      autoFilled = true;
      db.update(
        "choices",
        (c) => c.chapter_id === current.id && c.user_id === m.user_id,
        { selected_option: selected, submitted_at: new Date().toISOString(), auto_filled: true }
      );
    }
    const opt = choice?.options?.find((o) => o.id === selected);
    return {
      user_id: m.user_id,
      character_name: m.character?.name ?? m.display_name,
      choiceLabel: choice?.custom_text || opt?.label || "do nothing and wait",
      custom_text: choice?.custom_text ?? null,
      auto_filled: autoFilled,
    };
  });

  const archetype = archetypeById(guild.archetype) ?? ARCHETYPES[0];

  try {
    const next = await generateNextChapter({
      guild,
      members,
      archetype,
      prevChapter: current,
      decisions,
    });

    db.update("chapters", (c) => c.id === current.id, { status: "resolved" });

    const newIdx = guild.current_chapter_index + 1;
    db.update("guilds", (g) => g.id === guild.id, {
      current_chapter_index: newIdx,
      story_bible: { ...(guild.story_bible ?? {}), world_state: next.world_state },
    });

    const chapter = createChapter(guild.id, newIdx, next);
    persistChoices(chapter.id, next.choices, members);

    const out = serializeGuild(db.find("guilds", (g) => g.id === guild.id));
    emitGuild(guild.id, "guild:update", out);
    emitGuild(guild.id, "chapter:new", out.current_chapter);
    res.json({ guild: out });
  } catch (err) {
    console.error("advance failed", err);
    res.status(500).json({ error: "Failed to generate the next chapter" });
  }
});

// ---------------------------------------------------------------------------
// Helpers used by start/advance
// ---------------------------------------------------------------------------
function createChapter(guildId, idx, payload) {
  return db.insert("chapters", {
    id: nanoid(),
    guild_id: guildId,
    idx,
    title: payload.title ?? `Chapter ${idx + 1}`,
    shared_text: payload.shared_text ?? "",
    audio_url: null,
    status: "released",
    released_at: new Date().toISOString(),
  });
}

function persistChoices(chapterId, choices, members) {
  const memberIds = new Set(members.map((m) => m.user_id));
  for (const c of choices ?? []) {
    if (!memberIds.has(c.user_id)) continue;
    db.insert("choices", {
      id: nanoid(),
      chapter_id: chapterId,
      user_id: c.user_id,
      character_name: c.character_name ?? null,
      prompt: c.prompt ?? "What do you do?",
      options: (c.options ?? []).map((o) => ({
        id: o.id || nanoid(6),
        label: o.label,
        hint: o.hint ?? null,
      })),
      selected_option: null,
      custom_text: null,
      submitted_at: null,
      auto_filled: false,
    });
  }
}

function choiceStatus(chapter) {
  const choices = db.filter("choices", (c) => c.chapter_id === chapter.id);
  return {
    chapter_id: chapter.id,
    total: choices.length,
    submitted: choices.filter((c) => c.submitted_at).map((c) => c.user_id),
  };
}

server.listen(PORT, () => {
  console.log(`Babel server on http://localhost:${PORT}  (AI: ${provider})`);
});
