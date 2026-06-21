# Talegate App — UI kit

An interactive, high-fidelity recreation of the **Talegate** phone app: the shared bedtime-story product. Open `index.html` and tap through a full loop.

> ⚠️ No shipped product code existed at build time (the hackathon repo was a stub), so this kit is an **original interpretation of the brief**, not a recreation of real screens. Reconcile with production code as it lands.

## Flow (all interactive)
1. **Tonight** (home) — dusk-gradient greeting, tonight's *lit* chapter card, guild alignment dots, "Read tonight's chapter" → the reader.
2. **Shelf** — the curated 10-tale catalog: featured pick + genre carousels of `StoryCover`s. Tap any cover → **story detail sheet** → "Start a new tale".
3. **Guild setup** (step 1/2) — invite guildmates, set the **pages-per-night** cadence and **player count** hyperparameters, read/listen, starting tone.
4. **Character creation** (step 2/2) — name your character, pick a **taste profile** (favourite books/films/games), choose a core trait; Talegate previews what it'll weave.
5. **The Reader** — night mode: serif chapter with a drop-cap, then **the nightly choice** (incl. a "betrayal" option) → seal your word → the guild alignment confirmation.
6. **Guild** tab — character roster and **the Hearth** (group-chat reactions).

## Files
- `index.html` — entry; loads the DS bundle + screens, renders the phone with a side pitch.
- `frame.jsx` — device frame, status bar, glass tab bar, the Lucide `Icon` helper, and shared mock data (`window.BABEL`).
- `home.jsx` — `TonightScreen`, `GuildScreen`.
- `shelf.jsx` — `ShelfScreen`, `DetailSheet`.
- `setup.jsx` — `SetupScreen`, `CharacterScreen`.
- `reader.jsx` — `ReaderScreen` (the night reader + choice).
- `app.jsx` — the router shell.

## Composition
Screens compose the design-system primitives from `window.BabelDesignSystem_2e9b76` (Button, IconButton, Badge, Tag, Avatar, AvatarStack, Card, StoryCover, Input, SegmentedControl, Stepper, Choice, ProgressTrack, GuildDots). Icons are **Lucide** via CDN. Story covers use the gradient-and-type placeholder treatment — swap for commissioned art in production.
