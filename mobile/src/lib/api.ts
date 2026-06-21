import Constants from "expo-constants";

/**
 * Resolve the backend base URL.
 *
 * On a phone, "localhost" points at the phone itself, so we reuse the Expo dev
 * server host (your laptop's LAN IP) and swap in the server port. You can also
 * hardcode `extra.apiUrl` in app.json or set EXPO_PUBLIC_API_URL.
 */
const SERVER_PORT = 4000;

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  const c = Constants as unknown as {
    expoConfig?: { hostUri?: string; extra?: { apiUrl?: string } };
    expoGoConfig?: { debuggerHost?: string };
    linkingUri?: string;
  };
  const hostUri = c.expoConfig?.hostUri || c.expoGoConfig?.debuggerHost || c.linkingUri;

  if (hostUri) {
    const host = String(hostUri).split("://").pop()!.split(":")[0].split("/")[0];
    if (host) return `http://${host}:${SERVER_PORT}`;
  }
  const extra = (Constants.expoConfig?.extra ?? {}) as { apiUrl?: string };
  return extra.apiUrl ?? `http://localhost:${SERVER_PORT}`;
}

export const API_URL = resolveBaseUrl();

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

// ---- Types ----------------------------------------------------------------
export type User = { id: string; display_name: string; created_at: string };
export type Profile = {
  user_id: string;
  favorite_books: string[];
  favorite_movies: string[];
  favorite_games: string[];
  hobbies: string[];
  interests: string[];
};
/** A character a player has claimed (pre-defined by the chronicle). */
export type Character = {
  id: string;
  name: string;
  role: string;
  traits: string;
  blurb?: string | null;
};
export type Member = {
  user_id: string;
  display_name: string;
  character: Character | null;
  profile: Profile | null;
  joined_at: string;
};
/** A seat in the chronicle's cast + who (if anyone) claimed it. */
export type CastMember = {
  id: string;
  name: string;
  role: string;
  blurb: string | null;
  traits: string | null;
  user_id: string | null;
  claimed_by_name: string | null;
  is_npc: boolean;
};
export type Option = { id: string; label: string; hint?: string | null };
export type DecisionType = "casting" | "none" | "individual" | "group";
export type Choice = {
  id: string;
  chapter_id: string;
  user_id: string;
  character_name: string | null;
  kind?: "individual" | "group";
  prompt: string;
  options: Option[];
  selected_option: string | null;
  custom_text: string | null;
  submitted_at: string | null;
  auto_filled: boolean;
};
export type Chapter = {
  id: string;
  guild_id: string;
  idx: number;
  title: string;
  shared_text: string;
  audio_url: string | null;
  decision_type: DecisionType;
  status: string;
  released_at: string;
  choices: Choice[];
};
export type ChronicleCharacter = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  traits: string;
};
export type Chronicle = {
  id: string;
  title: string;
  author?: string;
  blurb: string;
  sample?: string;
  setting: string;
  tone: string;
  tint: string;
  characters: ChronicleCharacter[];
};
export type Guild = {
  id: string;
  name: string;
  invite_code: string;
  chronicle_id: string | null;
  player_count: number;
  pages_per_night: number;
  release_time: string;
  current_chapter_index: number;
  status: "lobby" | "active";
  story_bible: {
    chronicle_id?: string;
    title: string;
    setting: string;
    tone: string;
    world_state: string;
  } | null;
  created_by: string;
  members: Member[];
  cast: CastMember[];
  chapters: {
    id: string;
    idx: number;
    title: string;
    status: string;
    decision_type: DecisionType;
    released_at: string;
  }[];
  current_chapter: Chapter | null;
};

// ---- Endpoints ------------------------------------------------------------
export const api = {
  health: () => request<{ ok: boolean; ai: string }>("/api/health"),
  chronicles: () => request<{ chronicles: Chronicle[] }>("/api/chronicles"),

  createUser: (display_name: string) =>
    request<{ user: User }>("/api/users", {
      method: "POST",
      body: JSON.stringify({ display_name }),
    }),
  getUser: (id: string) => request<{ user: User; profile: Profile | null }>(`/api/users/${id}`),
  saveProfile: (id: string, profile: Partial<Profile>) =>
    request<{ profile: Profile }>(`/api/users/${id}/profile`, {
      method: "PUT",
      body: JSON.stringify(profile),
    }),

  createGuild: (body: {
    name: string;
    player_count: number;
    pages_per_night: number;
    release_time?: string;
    chronicle_id?: string | null;
    created_by: string;
  }) => request<{ guild: Guild }>("/api/guilds", { method: "POST", body: JSON.stringify(body) }),
  joinGuild: (invite_code: string, user_id: string) =>
    request<{ guild: Guild }>("/api/guilds/join", {
      method: "POST",
      body: JSON.stringify({ invite_code, user_id }),
    }),
  getGuild: (id: string) => request<{ guild: Guild }>(`/api/guilds/${id}`),
  getChapters: (id: string) => request<{ chapters: Chapter[] }>(`/api/guilds/${id}/chapters`),
  claimCharacter: (guildId: string, user_id: string, character_id: string) =>
    request<{ guild: Guild }>(`/api/guilds/${guildId}/claim`, {
      method: "POST",
      body: JSON.stringify({ user_id, character_id }),
    }),
  startStory: (id: string) =>
    request<{ guild: Guild }>(`/api/guilds/${id}/start`, { method: "POST" }),
  advance: (id: string) =>
    request<{ guild: Guild }>(`/api/guilds/${id}/advance`, { method: "POST" }),

  submitChoice: (chapterId: string, body: { user_id: string; selected_option: string; custom_text?: string }) =>
    request<{ choice: Choice }>(`/api/chapters/${chapterId}/choices`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
