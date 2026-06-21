import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { customAlphabet, nanoid } from "nanoid";

import { db } from "./db.js";
import { CHRONICLES, chronicleById, chronicleSummary } from "./chronicles.js";
import { generateNextChapter, usingMock, provider } from "./ai.js";

const PORT = process.env.PORT || 4000;
const inviteCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

// A decision lands roughly every N nights after casting. Tunable: lower = more
// frequent decisions (livelier demo), higher = closer to the "every ~5 days"
// cadence. Decisions alternate individual → group → individual → …
const DECISION_EVERY = 3;

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
// Decision schedule
// ---------------------------------------------------------------------------
/** What the chapter at this index asks of the players. */
function directiveForIndex(idx) {
  if (idx <= 0) return "casting";
  if (idx % DECISION_EVERY !== 0) return "none";
  const decisionNumber = idx / DECISION_EVERY; // 1, 2, 3, …
  return decisionNumber % 2 === 1 ? "individual" : "group";
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

/** Full cast = chronicle roster + who (if anyone) claimed each seat. */
function castFor(guild) {
  const roster = guild.story_bible?.characters ?? [];
  const casting = guild.current_chapter_index <= 0;
  return roster.map((c) => {
    const claimer = c.user_id ? db.find("users", (u) => u.id === c.user_id) : null;
    return {
      id: c.id,
      name: c.name,
      role: c.role,
      blurb: c.blurb ?? null,
      traits: c.traits ?? null,
      user_id: c.user_id ?? null,
      claimed_by_name: claimer?.display_name ?? null,
      // Unclaimed seats only become NPCs once casting is over.
      is_npc: !c.user_id && !casting,
    };
  });
}

function chapterView(chapter) {
  if (!chapter) return null;
  const choices = db.filter("choices", (c) => c.chapter_id === chapter.id);
  return { ...chapter, decision_type: chapter.decision_type ?? "none", choices };
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
    cast: castFor(guild),
    chapters: chapters.map((c) => ({
      id: c.id,
      idx: c.idx,
      title: c.title,
      status: c.status,
      decision_type: c.decision_type ?? "none",
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

app.get("/api/chronicles", (_req, res) => {
  res.json({ chronicles: CHRONICLES.map(chronicleSummary) });
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
  const { name, player_count, pages_per_night, release_time, chronicle_id, created_by } =
    req.body ?? {};
  if (!created_by || !db.find("users", (u) => u.id === created_by))
    return res.status(400).json({ error: "valid created_by required" });

  const chronicle = chronicleById(chronicle_id) ?? CHRONICLES[0];

  const guild = db.insert("guilds", {
    id: nanoid(),
    name: name?.trim() || chronicle.title,
    invite_code: inviteCode(),
    chronicle_id: chronicle.id,
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
  if (req.body?.pages_per_night != null)
    patch.pages_per_night = Math.min(Math.max(Number(req.body.pages_per_night) || 2, 1), 6);
  const updated = db.update("guilds", (g) => g.id === guild.id, patch);
  const out = serializeGuild(updated);
  emitGuild(guild.id, "guild:update", out);
  res.json({ guild: out });
});

// ---------------------------------------------------------------------------
// Claim a character (first-come-first-serve, on the casting night)
// ---------------------------------------------------------------------------
app.post("/api/guilds/:id/claim", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  const { user_id, character_id } = req.body ?? {};

  if (guild.status !== "active" || guild.current_chapter_index !== 0)
    return res.status(409).json({ error: "Casting is closed" });

  const member = db.find(
    "guild_members",
    (m) => m.guild_id === guild.id && m.user_id === user_id
  );
  if (!member) return res.status(404).json({ error: "You are not in this guild" });

  const roster = guild.story_bible?.characters ?? [];
  const target = roster.find((c) => c.id === character_id);
  if (!target) return res.status(404).json({ error: "No such character" });
  if (target.user_id && target.user_id !== user_id)
    return res.status(409).json({ error: "That character is already taken" });

  // First-come-first-serve: free any seat this user held, then take the new one.
  for (const c of roster) if (c.user_id === user_id) c.user_id = null;
  target.user_id = user_id;

  db.update("guilds", (g) => g.id === guild.id, {
    story_bible: { ...guild.story_bible, characters: roster },
  });
  db.update("guild_members", (m) => m.id === member.id, {
    character: { id: target.id, name: target.name, role: target.role, traits: target.traits, blurb: target.blurb ?? null },
  });

  const out = serializeGuild(db.find("guilds", (g) => g.id === guild.id));
  emitGuild(guild.id, "guild:update", out);
  res.json({ guild: out });
});

// ---------------------------------------------------------------------------
// Start story  ->  seat the fixed opening chapter; players then claim roles
// ---------------------------------------------------------------------------
app.post("/api/guilds/:id/start", (req, res) => {
  const guild = findGuildOr404(req, res);
  if (!guild) return;
  if (guild.status !== "lobby")
    return res.status(409).json({ error: "Story already started" });

  const members = db.filter("guild_members", (m) => m.guild_id === guild.id);
  if (members.length < 2)
    return res.status(400).json({ error: "Need at least 2 players to begin" });

  const chronicle = chronicleById(guild.chronicle_id) ?? CHRONICLES[0];

  db.update("guilds", (g) => g.id === guild.id, {
    chronicle_id: chronicle.id,
    status: "active",
    current_chapter_index: 0,
    story_bible: {
      chronicle_id: chronicle.id,
      title: chronicle.title,
      setting: chronicle.setting,
      tone: chronicle.tone,
      world_state: `Setting: ${chronicle.setting}. The opening chapter has just been read; the friends are about to choose who they'll be.`,
      characters: chronicle.characters.map((c) => ({ ...c, user_id: null })),
    },
  });

  // The fixed Chapter 1 — identical for every guild. No decisions; this is the
  // casting night (read, then claim a character).
  createChapter(guild.id, 0, chronicle.first_chapter, "casting");

  const out = serializeGuild(db.find("guilds", (g) => g.id === guild.id));
  emitGuild(guild.id, "guild:update", out);
  emitGuild(guild.id, "chapter:new", out.current_chapter);
  res.json({ guild: out });
});

// ---------------------------------------------------------------------------
// Submit a choice / cast a vote
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

  const decisionType = current.decision_type ?? "none";

  // On the casting night, everyone must have claimed a character first.
  if (decisionType === "casting") {
    const unseated = members.filter((m) => !m.character);
    if (unseated.length)
      return res.status(400).json({ error: "Everyone must pick a character first" });
  }

  // Gather what happened this chapter.
  let decisions = [];
  let groupDecision = null;

  if (decisionType === "individual") {
    decisions = members
      .filter((m) => m.character)
      .map((m) => {
        const choice = db.find(
          "choices",
          (c) => c.chapter_id === current.id && c.user_id === m.user_id
        );
        let selected = choice?.selected_option;
        let autoFilled = false;
        if (choice && !choice.submitted_at) {
          selected = choice.options?.[0]?.id ?? null;
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
        };
      });
  } else if (decisionType === "group") {
    groupDecision = tallyGroupVote(current);
  }

  const chronicle = chronicleById(guild.chronicle_id) ?? CHRONICLES[0];
  const cast = castFor(guild).map((c) => ({
    id: c.id,
    name: c.name,
    role: c.role,
    traits: c.traits,
    user_id: c.user_id,
  }));
  const playerCharacters = cast
    .filter((c) => c.user_id)
    .map((c) => ({ user_id: c.user_id, character_name: c.name }));

  const newIdx = guild.current_chapter_index + 1;
  const directive = directiveForIndex(newIdx);

  try {
    const next = await generateNextChapter({
      chronicle,
      guild,
      cast,
      playerCharacters,
      prevChapterText: current.shared_text,
      decisions,
      groupDecision,
      directive,
      nightNumber: newIdx + 1,
    });

    db.update("chapters", (c) => c.id === current.id, { status: "resolved" });
    db.update("guilds", (g) => g.id === guild.id, {
      current_chapter_index: newIdx,
      story_bible: { ...(guild.story_bible ?? {}), world_state: next.world_state },
    });

    const chapter = createChapter(guild.id, newIdx, next, directive);
    persistDecisions(chapter.id, next, members, directive);

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
function createChapter(guildId, idx, payload, decisionType) {
  return db.insert("chapters", {
    id: nanoid(),
    guild_id: guildId,
    idx,
    title: payload.title ?? `Chapter ${idx + 1}`,
    shared_text: payload.shared_text ?? "",
    audio_url: null,
    decision_type: decisionType ?? "none",
    status: "released",
    released_at: new Date().toISOString(),
  });
}

/** Create the per-player choice rows for the new chapter, based on directive. */
function persistDecisions(chapterId, next, members, directive) {
  const players = members.filter((m) => m.character);

  if (directive === "individual") {
    const byUser = new Map((next.decisions ?? []).map((d) => [d.user_id, d]));
    for (const m of players) {
      const d = byUser.get(m.user_id);
      db.insert("choices", {
        id: nanoid(),
        chapter_id: chapterId,
        user_id: m.user_id,
        character_name: m.character?.name ?? null,
        kind: "individual",
        prompt: d?.prompt ?? `What does ${m.character?.name ?? "your character"} do?`,
        options: normalizeOptions(d?.options),
        selected_option: null,
        custom_text: null,
        submitted_at: null,
        auto_filled: false,
      });
    }
  } else if (directive === "group") {
    const prompt = next.group?.prompt ?? "What should the guild do?";
    const options = normalizeOptions(next.group?.options);
    for (const m of players) {
      db.insert("choices", {
        id: nanoid(),
        chapter_id: chapterId,
        user_id: m.user_id,
        character_name: m.character?.name ?? null,
        kind: "group",
        prompt,
        options,
        selected_option: null,
        custom_text: null,
        submitted_at: null,
        auto_filled: false,
      });
    }
  }
  // "none" / "casting": no choice rows.
}

function normalizeOptions(options) {
  const list = (options ?? []).map((o) => ({
    id: o.id || nanoid(6),
    label: o.label,
    hint: o.hint ?? null,
  }));
  return list.length
    ? list
    : [
        { id: nanoid(6), label: "Press on", hint: null },
        { id: nanoid(6), label: "Hold back", hint: null },
      ];
}

/** Majority vote among players for a group-decision chapter. */
function tallyGroupVote(chapter) {
  const choices = db.filter("choices", (c) => c.chapter_id === chapter.id);
  const options = choices[0]?.options ?? [];
  const prompt = choices[0]?.prompt ?? "The guild's decision";
  const tally = new Map();
  for (const c of choices) {
    if (c.submitted_at && c.selected_option)
      tally.set(c.selected_option, (tally.get(c.selected_option) ?? 0) + 1);
  }
  let winnerId = options[0]?.id ?? null;
  let best = -1;
  for (const [id, n] of tally) {
    if (n > best) {
      best = n;
      winnerId = id;
    }
  }
  const winner = options.find((o) => o.id === winnerId);
  return {
    prompt,
    option_id: winnerId,
    label: winner?.label ?? "stay the course",
    votes: best < 0 ? 0 : best,
  };
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
