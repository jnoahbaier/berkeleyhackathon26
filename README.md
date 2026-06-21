# Babel

**A shared bedtime story for friends who live far apart.**

2-4 friends form a *guild*, read the same chapter each night, and each make a
choice for their own character. An LLM (Anthropic Claude) weaves everyone's
divergent choices into a single shared next chapter. Over ~a month the story
grows together so that when friends text or meet, they're all on the same page —
literally. Inspired by book clubs, Spotify Blend, and choose-your-own-adventure.

Built for the Berkeley AI Hackathon, Summer 2026.

---

## How it works

```
Story bible + world state (per guild)
        │
        ▼
  Tonight's chapter  ──►  each player makes ONE choice for their character
        │                         │
        │                         ▼
        │             all submitted OR deadline (auto-fills stragglers)
        │                         │
        ▼                         ▼
  Gemini merges every choice into the next shared chapter + updates world state
```

- **One shared chapter per night.** Length scales with the player count, so
  everyone reads roughly the same amount and stays aligned.
- **Stay-in-sync mechanism.** The next chapter is gated on everyone submitting,
  or a nightly deadline. Anyone who didn't choose gets a sensible default so the
  guild never drifts apart — no one is left needing a recap.
- **Personalized worlds.** The setting/archetype and each character are seeded
  from the players' profiles (favorite books, movies, games, hobbies).
- **Demo fast-forward.** An "Advance the night" button resolves the chapter
  immediately so you can show several nights in a 3-minute demo.

## Repo layout

| Path        | What it is                                                            |
| ----------- | --------------------------------------------------------------------- |
| `server/`   | Node + Express + Socket.IO backend, Claude integration, JSON store    |
| `mobile/`   | Expo (React Native + TypeScript + Expo Router) app                    |

### Architecture note

The plan called for Supabase. For a live two-phone hackathon demo this backend
instead runs **locally** (Express + Socket.IO + a JSON-file store) so it boots
with zero cloud setup — both phones already need to be on your laptop's network
for Expo anyway. The data model (`users`, `profiles`, `guilds`,
`guild_members`, `chapters`, `choices`) and the two AI flows (`generate-bible`,
`generate-chapter`) mirror the plan exactly, so Supabase/Postgres can be swapped
in later without touching the app.

---

## Quick start

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # optional: add ANTHROPIC_API_KEY for real stories
npm start                 # http://localhost:4000
```

Without an `ANTHROPIC_API_KEY` the server runs in **mock mode**: fully
functional, deterministic placeholder stories that still react to each player's
choices. Add a key (and optionally `ANTHROPIC_MODEL`, default
`claude-sonnet-4-6`) to get real generated stories.

Optional shortcut: `npm run seed` creates a demo guild with two players and
prints an invite code.

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** (or press `i` / `a` for a simulator). The app
auto-discovers the backend at your laptop's LAN IP on port `4000`. To override,
set `EXPO_PUBLIC_API_URL` or edit `extra.apiUrl` in `mobile/app.json`.

> Both phones and your laptop must be on the same Wi-Fi.

---

## Two-phone demo script

1. **Both phones:** open the app, enter a name, add a few favorite
   books/games (these shape the story).
2. **Phone A:** Home → *Create a new story* → pick players = 2, a vibe (or leave
   it to Babel) → *Create guild*. Note the 6-letter invite code.
3. **Phone B:** Home → *Enter invite code* → type the code → join. Phone A's
   lobby updates live.
4. **Phone A (host):** *Begin the story*. Claude writes the world, a character
   for each player, and Chapter 1. Both phones show the same chapter.
5. **Both phones:** read tonight's chapter, each pick a *different* choice and
   *lock it in*. Watch the "around the campfire" list update live on both
   devices as each friend decides.
6. **Either phone:** *Advance to tomorrow night*. Claude merges both choices into
   Chapter 2 — it appears on both phones, visibly reflecting what each of you
   chose.
7. Tap **Story so far** to show the branching timeline of chapters and choices.

---

## Roadmap (mentioned in the pitch, stubbed for later)

- Audio / ASMR narration (TTS) — `chapters.audio_url` and a play button are
  already wired as placeholders.
- Real Kindle integration + true scheduled 10pm nightly release (currently a
  deadline + manual advance).
- Persistent cross-story character arcs ("you've killed before…").
- Cloud backend (Supabase/Postgres) for play across networks.
