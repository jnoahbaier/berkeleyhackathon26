import { nanoid } from "nanoid";

/**
 * Story generation via Anthropic Claude.
 *
 * Uses forced tool-use to guarantee schema-valid JSON (Claude returns the
 * structured object as the tool input). Falls back to a deterministic mock
 * generator whenever no API key is set or the API call fails, so the app is
 * always demoable.
 */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const API_KEY = process.env.ANTHROPIC_API_KEY;
const ENDPOINT = "https://api.anthropic.com/v1/messages";

export const usingMock = !API_KEY;
export const provider = usingMock ? "mock" : `claude (${MODEL})`;

// ---------------------------------------------------------------------------
// JSON schemas (standard JSON Schema, used as tool input_schema).
// ---------------------------------------------------------------------------
const choiceArraySchema = {
  type: "array",
  description: "Exactly one decision per player, addressed to their character.",
  items: {
    type: "object",
    properties: {
      user_id: { type: "string", description: "Must match a provided user_id exactly." },
      character_name: { type: "string" },
      prompt: { type: "string" },
      options: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Short unique id for this option." },
            label: { type: "string" },
            hint: { type: "string" },
          },
          required: ["id", "label"],
        },
      },
    },
    required: ["user_id", "character_name", "prompt", "options"],
  },
};

const bibleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    setting: { type: "string" },
    tone: { type: "string" },
    world_state: {
      type: "string",
      description: "A running summary of the world, factions, and where things stand.",
    },
    characters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          name: { type: "string" },
          role: { type: "string" },
          traits: { type: "string" },
          arc: { type: "string" },
        },
        required: ["user_id", "name", "role", "traits", "arc"],
      },
    },
    chapter: {
      type: "object",
      properties: {
        title: { type: "string" },
        shared_text: { type: "string" },
        choices: choiceArraySchema,
      },
      required: ["title", "shared_text", "choices"],
    },
  },
  required: ["title", "setting", "tone", "world_state", "characters", "chapter"],
};

const nextChapterSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    shared_text: { type: "string" },
    world_state: { type: "string" },
    choices: choiceArraySchema,
  },
  required: ["title", "shared_text", "world_state", "choices"],
};

// ---------------------------------------------------------------------------
// Low level Claude call (forced tool use -> structured JSON)
// ---------------------------------------------------------------------------
async function callClaude({ system, prompt, tool, maxTokens = 2048 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        temperature: 1,
        system,
        tools: [tool],
        tool_choice: { type: "tool", name: tool.name },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Anthropic ${res.status}: ${body.slice(0, 400)}`);
    }
    const data = await res.json();
    const block = data?.content?.find((b) => b.type === "tool_use");
    if (!block?.input) throw new Error("Claude returned no tool_use block");
    return block.input;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------
const STORYTELLER_SYSTEM = `You are the Loremaster of "Babel", a shared bedtime-story engine for a small group of close friends who live far apart and read the same chapter each night.

Rules:
- Write vivid, emotionally warm prose at a relaxing bedtime pace. Literary, present-day style.
- It is ONE shared story. Every player's character lives in the same world and the chapters reference each other's characters by name.
- Themes the friends love: loyalty, love, betrayal, reunion, sacrifice. Lean into relationships.
- Be concise and evocative. Keep each chapter to about 'pagesPerNight' x 120 words (a tight bedtime read), and do NOT exceed it. Quality over quantity.
- ALWAYS produce exactly one decision per player, addressed to that player's own character, with 2-3 distinct, meaningful options. Keep each option label under 12 words and each hint under 8 words.
- Use the EXACT user_id values you are given when assigning characters and choices. Never invent user_ids.
- Return your answer ONLY by calling the provided tool with structured fields.`;

// Generous output ceiling so the structured JSON never truncates mid-field.
// The system prompt keeps prose concise, so actual output (and latency) stays
// well below these caps; this is just a safety net for verbose generations.
function tokenBudget(pages, extra = 0) {
  return Math.min(2400 + pages * 300 + extra, 5000);
}

function profilesBlock(members) {
  return members
    .map((m) => {
      const p = m.profile ?? {};
      const list = (arr) => (arr && arr.length ? arr.join(", ") : "—");
      return `- user_id: ${m.user_id}
  name: ${m.display_name}
  favorite_books: ${list(p.favorite_books)}
  favorite_movies: ${list(p.favorite_movies)}
  favorite_games: ${list(p.favorite_games)}
  hobbies: ${list(p.hobbies)}
  interests: ${list(p.interests)}`;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function generateBible({ guild, members, archetype }) {
  const pages = guild.pages_per_night;
  if (usingMock) return mockBible({ guild, members, archetype });

  const prompt = `Create the opening of a one-month-long shared story for ${members.length} friends.

ARCHETYPE / SETTING: ${archetype.name} — ${archetype.blurb}
pagesPerNight: ${pages}

THE PLAYERS (craft a character for each, inspired by their tastes):
${profilesBlock(members)}

Produce:
1. A story title, setting, tone, and an initial world_state summary.
2. One character per player (use their exact user_id). Make the character resonate with that player's favorites.
3. Chapter 1 (the shared opening scene, ~${pages} pages) that introduces the world and brings the characters together.
4. One decision for each player's character to make tonight.`;

  try {
    return await callClaude({
      system: STORYTELLER_SYSTEM,
      prompt,
      tool: {
        name: "save_story_opening",
        description: "Save the story bible, characters, and opening chapter.",
        input_schema: bibleSchema,
      },
      maxTokens: tokenBudget(pages, members.length * 160 + 400),
    });
  } catch (err) {
    console.error("[ai] generateBible failed, using mock:", err.message);
    return mockBible({ guild, members, archetype });
  }
}

export async function generateNextChapter({ guild, members, archetype, prevChapter, decisions }) {
  const pages = guild.pages_per_night;
  if (usingMock) return mockNextChapter({ guild, members, prevChapter, decisions });

  const decisionBlock = decisions
    .map(
      (d) =>
        `- ${d.character_name} (user_id ${d.user_id}) chose: "${d.choiceLabel}"${
          d.custom_text ? ` (player note: ${d.custom_text})` : ""
        }`
    )
    .join("\n");

  const prompt = `Continue the shared story. This is night ${guild.current_chapter_index + 2}.

SETTING: ${archetype.name}
pagesPerNight: ${pages}

CURRENT WORLD STATE:
${guild.story_bible?.world_state ?? "(none yet)"}

PREVIOUS CHAPTER:
${prevChapter.shared_text}

WHAT EACH PLAYER DECIDED LAST NIGHT:
${decisionBlock}

Write the NEXT shared chapter (~${pages} pages) that weaves EVERY player's decision into one coherent continuation — show consequences, let their threads collide, and escalate the relationships (loyalty, love, betrayal). Then update the world_state summary and give each player a fresh decision.`;

  try {
    return await callClaude({
      system: STORYTELLER_SYSTEM,
      prompt,
      tool: {
        name: "write_next_chapter",
        description: "Write the next shared chapter and the new per-player decisions.",
        input_schema: nextChapterSchema,
      },
      maxTokens: tokenBudget(pages, members.length * 120 + 300),
    });
  } catch (err) {
    console.error("[ai] generateNextChapter failed, using mock:", err.message);
    return mockNextChapter({ guild, members, prevChapter, decisions });
  }
}

// ---------------------------------------------------------------------------
// Mock generators (deterministic-ish, character + choice aware) so the app is
// fully demoable without an ANTHROPIC_API_KEY.
// ---------------------------------------------------------------------------
const ROLE_SETS = {
  medieval_fantasy: ["the exiled knight", "the hedge-witch", "the thief-turned-spy", "the young heir"],
  space_opera: ["the ship's captain", "the rogue engineer", "the diplomat", "the AI-touched pilot"],
  noir_mystery: ["the tired detective", "the lounge singer", "the forger", "the rookie reporter"],
  cozy_slice_of_life: ["the baker", "the bookshop owner", "the wandering musician", "the new arrival"],
  post_apocalyptic: ["the scavenger", "the medic", "the radio operator", "the reluctant leader"],
  high_school_drama: ["the dreamer", "the captain", "the artist", "the new kid"],
};

function mockBible({ guild, members, archetype }) {
  const roles = ROLE_SETS[archetype.id] ?? ROLE_SETS.medieval_fantasy;
  const characters = members.map((m, i) => ({
    user_id: m.user_id,
    name: m.display_name,
    role: roles[i % roles.length],
    traits: "loyal, curious, hiding one secret",
    arc: "will be tested by the people they trust most",
  }));

  const names = characters.map((c) => `${c.name}, ${c.role}`).join("; ");
  const shared_text = `The night the lanterns of ${archetype.name.toLowerCase()} guttered low, the friends who had drifted apart were pulled back toward a single point.\n\n${names}.\n\nNone of them had planned to return. Yet here they were, summoned by the same trembling letter, the same impossible rumor. The fire crackled. Somewhere beyond the walls, something old was waking, and it knew their names.\n\nThey had one night to decide who they would be to one another — again.`;

  return {
    title: `The ${archetype.name} of Babel`,
    setting: archetype.name,
    tone: "warm, intimate, slow-burning with rising stakes",
    world_state: `Setting: ${archetype.name}. ${members.length} old friends reunited under a shared omen. Trust is high but untested. No betrayals yet.`,
    characters,
    chapter: {
      title: "Chapter 1 — The Summons",
      shared_text,
      choices: characters.map((c) => mockChoice(c)),
    },
  };
}

function mockChoice(character) {
  return {
    user_id: character.user_id,
    character_name: character.name,
    prompt: `As the fire dies, what does ${character.name} do?`,
    options: [
      { id: nanoid(6), label: "Share the secret you've been carrying", hint: "Builds trust, exposes you" },
      { id: nanoid(6), label: "Keep it hidden and watch the others", hint: "Safer, but distance grows" },
      { id: nanoid(6), label: "Slip outside toward the waking thing", hint: "Bold, dangerous" },
    ],
  };
}

function mockNextChapter({ guild, members, prevChapter, decisions }) {
  const consequences = decisions
    .map((d) => `${d.character_name} chose to ${d.choiceLabel.toLowerCase()}.`)
    .join(" ");

  const shared_text = `Dawn came grey and uncertain.\n\n${consequences}\n\nWhat none of them expected was how their choices would tangle. A confession met a held tongue; a bold step into the dark left someone behind to wonder. By the time the sun cleared the ridge, the shape of their fellowship had quietly changed — and a new danger had noticed the gap between them.\n\nTonight, each of them must answer for what they did.`;

  return {
    title: `Chapter ${guild.current_chapter_index + 2}`,
    shared_text,
    world_state: `${guild.story_bible?.world_state ?? ""}\nNight ${
      guild.current_chapter_index + 1
    }: ${consequences} Tensions rising.`.trim(),
    choices: (members ?? []).map((m) =>
      mockChoice({ user_id: m.user_id, name: m.character?.name ?? m.display_name })
    ),
  };
}
