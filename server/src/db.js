import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

/**
 * Lightweight JSON-file backed store.
 *
 * The shape mirrors the relational model from the plan so it can be swapped for
 * Postgres/Supabase later without changing call sites:
 *   users, profiles, guilds, guild_members, chapters, choices
 *
 * It is intentionally simple (single process, whole-file writes) which is more
 * than enough for a 2-4 player hackathon demo.
 */
const EMPTY = {
  users: [],
  profiles: [],
  guilds: [],
  guild_members: [],
  chapters: [],
  choices: [],
};

function load() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return { ...structuredClone(EMPTY), ...JSON.parse(raw) };
  } catch {
    return structuredClone(EMPTY);
  }
}

let state = load();

function persist() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

export const db = {
  /** Reset the entire store (used by seed script). */
  reset() {
    state = structuredClone(EMPTY);
    persist();
  },

  raw() {
    return state;
  },

  // ---- generic helpers -------------------------------------------------
  insert(table, row) {
    state[table].push(row);
    persist();
    return row;
  },

  find(table, predicate) {
    return state[table].find(predicate);
  },

  filter(table, predicate) {
    return state[table].filter(predicate);
  },

  update(table, predicate, patch) {
    const row = state[table].find(predicate);
    if (!row) return null;
    Object.assign(row, patch);
    persist();
    return row;
  },

  remove(table, predicate) {
    const before = state[table].length;
    state[table] = state[table].filter((r) => !predicate(r));
    if (state[table].length !== before) persist();
  },
};
