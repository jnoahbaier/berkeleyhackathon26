import { nanoid } from "nanoid";

/**
 * Story generation via Anthropic Claude.
 *
 * Chapter 1 of every chronicle is hand-authored (see chronicles.js) and never
 * touches the model. From Chapter 2 onward this module continues the book from
 * the claimed characters and the guild's decisions.
 *
 * A "directive" controls what the night asks of the players:
 *   - "none"        → pure reading, no decision tonight
 *   - "individual"  → one decision per PLAYER character
 *   - "group"       → a single dilemma the whole guild votes on
 *
 * Characters nobody claimed are non-player side characters; the narrator drives
 * them with sensible defaults so they feel like they were always part of the
 * world. Forced tool-use guarantees schema-valid JSON. A deterministic mock
 * keeps the app fully demoable with no API key.
 */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const API_KEY = process.env.ANTHROPIC_API_KEY;
const ENDPOINT = "https://api.anthropic.com/v1/messages";

export const usingMock = !API_KEY;
export const provider = usingMock ? "mock" : `claude (${MODEL})`;

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const optionItems = {
  type: "object",
  properties: {
    id: { type: "string", description: "Short unique id for this option." },
    label: { type: "string", description: "The action, under 12 words." },
    hint: { type: "string", description: "A short consequence tease, under 8 words." },
  },
  required: ["id", "label"],
};

const individualDecisionSchema = {
  type: "array",
  description: "Exactly one decision per PLAYER character. Do NOT create decisions for non-player characters.",
  items: {
    type: "object",
    properties: {
      user_id: { type: "string", description: "Must exactly match a provided player user_id." },
      character_name: { type: "string" },
      prompt: { type: "string", description: "Addressed to that character, second person." },
      options: { type: "array", items: optionItems },
    },
    required: ["user_id", "character_name", "prompt", "options"],
  },
};

const groupDecisionSchema = {
  type: "object",
  description: "A single dilemma the whole guild votes on together.",
  properties: {
    prompt: { type: "string", description: "The shared question facing the group." },
    options: { type: "array", items: optionItems },
  },
  required: ["prompt", "options"],
};

function chapterSchema(directive) {
  const properties = {
    title: { type: "string" },
    shared_text: { type: "string", description: "The night's chapter prose." },
    world_state: { type: "string", description: "Updated running summary of the world and where things stand." },
  };
  const required = ["title", "shared_text", "world_state"];
  if (directive === "individual") {
    properties.decisions = individualDecisionSchema;
    required.push("decisions");
  } else if (directive === "group") {
    properties.group = groupDecisionSchema;
    required.push("group");
  }
  return { type: "object", properties, required };
}

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
// Prompt building
// ---------------------------------------------------------------------------
const STORYTELLER_SYSTEM = `You are the Loremaster of "Talegate", a shared bedtime-story engine for a small group of close friends who live far apart and read the same chapter each night.

The book has a fixed cast of central characters. Some are played by the friends; the rest are non-player side characters that YOU control with natural, in-character defaults — they should feel like they were always part of the world, never like absent players.

Rules:
- Write vivid, emotionally warm prose at a relaxing bedtime pace. Close third person that follows the named cast. Literary but unfussy.
- It is ONE shared story. Reference characters by name. Player characters drive the plot; let non-player characters react believably around them.
- Themes the friends love: loyalty, love, betrayal, reunion, sacrifice. Lean into relationships.
- Be concise and evocative. Keep each chapter to about 'pagesPerNight' x 120 words and do NOT exceed it. Quality over quantity.
- Honor the DECISION DIRECTIVE exactly:
  * none → end on a quiet beat or a question; create NO decisions.
  * individual → create EXACTLY one decision per player character (use their exact user_id), each with 2-3 distinct, meaningful options. Never create decisions for non-player characters.
  * group → create EXACTLY one shared dilemma the whole guild votes on, with 2-3 options.
- Keep every option label under 12 words and every hint under 8 words.
- Return your answer ONLY by calling the provided tool.`;

function tokenBudget(pages, extra = 0) {
  return Math.min(2400 + pages * 300 + extra, 5000);
}

function castBlock(cast) {
  return cast
    .map((c) => {
      const who = c.user_id ? `PLAYER (user_id ${c.user_id})` : "non-player (you control them)";
      return `- ${c.name} — ${c.role} [${who}]\n  ${c.traits}`;
    })
    .join("\n");
}

function directiveLine(directive, playerCount) {
  if (directive === "individual")
    return `DECISION DIRECTIVE: individual — end the chapter by giving EACH of the ${playerCount} player character(s) their own decision.`;
  if (directive === "group")
    return "DECISION DIRECTIVE: group — end the chapter on ONE dilemma the whole guild must vote on together.";
  return "DECISION DIRECTIVE: none — no decision tonight; this is a pure reading night.";
}

function whatHappenedBlock({ decisions, groupDecision }) {
  if (groupDecision)
    return `LAST NIGHT THE GUILD COLLECTIVELY CHOSE:\n- "${groupDecision.label}"`;
  if (decisions && decisions.length)
    return (
      "WHAT EACH PLAYER DID LAST NIGHT:\n" +
      decisions.map((d) => `- ${d.character_name}: "${d.choiceLabel}"`).join("\n")
    );
  return "LAST NIGHT: the characters simply lived the previous chapter; no decisions were made.";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function generateNextChapter({
  chronicle,
  guild,
  cast,
  playerCharacters,
  prevChapterText,
  decisions,
  groupDecision,
  directive,
  nightNumber,
}) {
  const pages = guild.pages_per_night;
  if (usingMock)
    return mockNextChapter({ chronicle, cast, playerCharacters, decisions, groupDecision, directive, nightNumber });

  const prompt = `Continue the shared story "${chronicle.title}". This is night ${nightNumber}.

SETTING: ${chronicle.setting}
TONE: ${chronicle.tone}
pagesPerNight: ${pages}

THE CAST:
${castBlock(cast)}

CURRENT WORLD STATE:
${guild.story_bible?.world_state ?? "(the opening chapter has just been read)"}

PREVIOUS CHAPTER:
${prevChapterText}

${whatHappenedBlock({ decisions, groupDecision })}

${directiveLine(directive, playerCharacters.length)}

Write the NEXT shared chapter (~${pages} pages) that flows naturally from the previous one and weaves in what happened. Show consequences, let relationships deepen or fracture, and keep non-player characters present and believable. Then update the world_state summary${
    directive === "none" ? "." : " and produce the required decision(s)."
  }`;

  try {
    return await callClaude({
      system: STORYTELLER_SYSTEM,
      prompt,
      tool: {
        name: "write_next_chapter",
        description: "Write the next shared chapter (and any decisions the directive requires).",
        input_schema: chapterSchema(directive),
      },
      maxTokens: tokenBudget(pages, playerCharacters.length * 140 + 400),
    });
  } catch (err) {
    console.error("[ai] generateNextChapter failed, using mock:", err.message);
    return mockNextChapter({ chronicle, cast, playerCharacters, decisions, groupDecision, directive, nightNumber });
  }
}

// ---------------------------------------------------------------------------
// Mock generator (deterministic, cast + decision aware) so the app is fully
// demoable without an ANTHROPIC_API_KEY.
// ---------------------------------------------------------------------------
function mockOptions(set) {
  return set.map((o) => ({ id: nanoid(6), label: o.label, hint: o.hint }));
}

function mockNextChapter({ chronicle, cast, playerCharacters, decisions, groupDecision, directive, nightNumber }) {
  const players = cast.filter((c) => c.user_id);
  const npcs = cast.filter((c) => !c.user_id);

  const recap = groupDecision
    ? `Together they had chosen to ${groupDecision.label.toLowerCase()}, and ${chronicle.setting.split(" — ")[0]} would not soon forget it.`
    : decisions && decisions.length
    ? decisions.map((d) => `${d.character_name} chose to ${d.choiceLabel.toLowerCase()}.`).join(" ")
    : "The night before still hung over them like woodsmoke.";

  const npcLine = npcs.length
    ? ` Around them, ${npcs.map((n) => n.name).join(" and ")} kept to old habits — steady, watchful, exactly as they had always been.`
    : "";

  const shared_text = [
    `Night ${nightNumber} came slow and grey.`,
    `${recap}${npcLine}`,
    `${players.map((p) => p.name).join(", ") || "The guild"} felt the shape of the story bend around what had been done — a confession here, a held tongue there — and somewhere ahead, a new pressure gathered that none of them had chosen but all of them would have to answer.`,
    directive === "none"
      ? "Tonight there was nothing to decide. There was only the road, and each other, and the quiet."
      : "By the time the light failed, a choice was waiting.",
  ].join("\n\n");

  const out = {
    title: `Chapter ${nightNumber} — ${["The Turning", "Threadbare", "What the Dark Keeps", "Closer", "The Reckoning"][nightNumber % 5]}`,
    shared_text,
    world_state: `${guildWorldSeed(chronicle)} Night ${nightNumber}: ${recap} Tensions rising.`,
  };

  if (directive === "individual") {
    out.decisions = playerCharacters.map((pc) => ({
      user_id: pc.user_id,
      character_name: pc.character_name,
      prompt: `The moment turns to ${pc.character_name}. What do they do?`,
      options: mockOptions([
        { label: "Trust the others with the truth", hint: "Builds the bond, costs you cover" },
        { label: "Keep your own counsel for now", hint: "Safer, but distance grows" },
        { label: "Act alone, before anyone can object", hint: "Bold, dangerous" },
      ]),
    }));
  } else if (directive === "group") {
    out.group = {
      prompt: "The guild must decide together — which way now?",
      options: mockOptions([
        { label: "Press forward into the unknown", hint: "Bold, irreversible" },
        { label: "Hold here and fortify", hint: "Safe, but time is short" },
        { label: "Split the difference and scout first", hint: "Cautious, slower" },
      ]),
    };
  }

  return out;
}

function guildWorldSeed(chronicle) {
  return `Setting: ${chronicle.setting}.`;
}
