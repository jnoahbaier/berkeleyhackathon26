# Talegate — Design System

> **Talegate** is a shared bedtime-story app for long-distance friends. 2–4 friends form a **guild**, pick a story from a curated shelf, build their own character, and then read the *same* chapter every night. Each player makes choices — on their phone by day or their Kindle at night — and the story bends around them. Stories run about **one month**, like a book club you live inside. The point isn't the app; it's the 10pm text thread and the "you'll never guess what my character did" when you finally see each other in person.

*Brand name: **Talegate** — tale + gate. Each night you cross a threshold into the story together; "open the gate" is the core ritual (and the flagship tale is literally "The Ember Gate"). The tone is Hearthstone-cosy meets fireside fantasy. Ships as **talegate.club** — a reading **club** for your guild. (Earlier explorations: Babel, Talefire, Ember, Tavern.)*

---

## Sources & provenance

This system was built for the **2026 Berkeley AI Hackathon**. The attached resources were near-empty stubs, so the brand below is an original direction derived from the product brief + one inspiration image. Re-explore these if you have access:

- **GitHub:** `jnoahbaier/berkeleyhackathon26` — https://github.com/jnoahbaier/berkeleyhackathon26 (currently only a stub README; check back as the team commits code, then lift real component values).
- **Inspiration image:** `uploads/design_insipration.png` — a clean iOS concept: soft sage→peach→lilac dusk gradient, bold near-black grotesque headline ("Hi Peter, How can I help you today?"), glassy circular icon buttons, rounded white "key" cards. Talegate borrows its calm, airy, rounded, **macOS-Tahoe / Golden Gate** sensibility.
- **Design intent (user):** "modern, minimalistic, very clean, round corners like the new macOS Tahoe / Golden Gate."

> ⚠️ **Font substitution flag:** licensed binaries weren't provided, so the three families load from **Google Fonts** (Schibsted Grotesk, Newsreader, Geist Mono — all genuine, not stand-ins). If you have self-hosted/licensed copies, drop them in `assets/fonts/` and swap the `@import`s in `tokens/fonts.css` for local `@font-face` rules.
> ⚠️ **No product code existed yet** — the UI kit screens are an original interpretation of the brief, not a recreation of shipped screens. Treat them as the proposed product, and reconcile with real code as it lands.

---

## The product, in five surfaces

1. **The Shelf** — a curated, Netflix-style carousel of ~10 hand-picked story archetypes with real cover art (medieval, sci-fi, noir, cosy, horror…). You browse with your guild and pick one, like choosing a book together at a store.
2. **Guild & onboarding** — invite 2–4 friends, set the **cadence** (pages/night) and **tone**, and let the engine read everyone's *taste profile* (favourite books, films, games, hobbies) to seed the world.
3. **Character creation** — each player forges their own character inside the chosen world; the story morphs to fit the guild.
4. **The Reader** — the nightly chapter, released to everyone at 10pm. Calm, serif, night-friendly. Read or listen.
5. **Choices & the Hearth** — make your character's decision; see the guild's group-chat reactions and where everyone is in tonight's pages.

**The alignment mechanism** (a core idea): everyone should read *roughly* the same amount each night so they can talk in person. Talegate paces by **chapter beats, not raw pages** — the nightly release is a fixed "beat," choices lock at a soft deadline, and a stragglers' **one-line recap** catches up anyone who fell asleep early without spoiling those ahead. The cadence (pages/beat per night) is a guild hyperparameter set at onboarding.

---

## Content fundamentals — how Talegate talks

Talegate's voice is a **warm, literary narrator who is also your friend** — think a cosy dungeon master at bedtime. Two registers, kept distinct:

- **Story voice (serif, Newsreader):** second-person, present tense, evocative but unfussy. *"The lantern gutters. Mara waits for your word — the gate, or the river?"* Never breaks character. No UI words.
- **Product voice (sans, Schibsted Grotesk):** plain, friendly, a little wry. Talks to **you** ("Your guild is waiting", "You read 6 of tonight's 8 pages"). Uses **we** sparingly for the app itself.

Rules of thumb:
- **Casing:** Sentence case everywhere — buttons, headings, nav. No Title Case Buttons. Mono labels are the one exception: `UPPERCASE` with wide tracking (`CHAPTER 04 · NIGHT 12`).
- **Tone:** Intimate, unhurried, never hustle-y. It's a bedtime ritual, not a productivity app — copy should feel like dimmed lights. Favour short lines. *"Goodnight. Tomorrow, the road forks."*
- **People:** "you" and "your guild." Friends are **guildmates**; the group is a **guild**; a story run is a **tale** or **chapter**; the nightly drop is **tonight's chapter**.
- **Numbers/stats:** minimal and meaningful — "Night 12 of 30", "3 of 4 chose." Never vanity metrics. No streak-shaming.
- **Emoji:** essentially none in product chrome. The one sanctioned warm touch is a small **🌙 / candle** motif used as brand garnish, not inline in sentences. Reactions in the Hearth (group chat) are user content and may include emoji — that's people, not the brand.
- **Examples:**
  - Empty shelf: *"No tale yet. Pick one tonight — your guild reads at 10."*
  - Choice locked: *"Your word is sealed. The others have until 10pm."*
  - Recap: *"Last night, in one breath: the bridge fell, and you let the stranger live."*
  - Notification: *"Tonight's chapter is lit. 🌙"*

---

## Visual foundations

**Overall mood:** *dusk.* Warm parchment by day, deep indigo night for reading. Airy, generous whitespace, big soft corners, almost no hard edges. Minimal but never cold — there's always a little candle-warmth.

### Color
- **Neutrals are warm**, not grey. Text is a warm near-black `--ink-900 #16140F` on **parchment `--parchment #FAF6EF`**; cards are pure white. Borders are warm hairlines `--line #E7DFD1`.
- **One brand colour:** **Talegate Indigo `--indigo-600 #423AA0`** — a twilight violet for primary actions, links, active states.
- **One accent:** **Candle Amber `--candle-500 #E89B3C`** — the glow. Used for highlights, the "lit" state of tonight's chapter, focal warmth. Never for large fills.
- **Night surfaces** for the reader: `--night-900 #131120` ground, warm paper text `--night-text #EDE7DA`, indigo + amber as the only accents.
- **Guild palette:** four character seats — clay rose, sage teal, periwinkle, old gold — each with a soft tint. Used for avatars, choice attribution, "who's read" dots.
- **Destructive = `--danger-600 #C5523F`**, framed in-story as *betrayal*.

### Gradients & backgrounds
- The signature **Dusk gradient** (`--gradient-dusk`, sage→wheat→peach→lilac, ~176°) is the hero motif — launch screen, story headers, the Shelf backdrop. Soft and diffuse, like the inspiration. Use it large and quiet behind bold black type; never as a button fill.
- **Night gradient** (`--gradient-night`, indigo→plum→amber-glow) backs the reader's chapter intro and the splash.
- **Candle glow** (`--gradient-glow`, radial amber) sits behind focal art (a chosen cover, an active character).
- Backgrounds are **gradients and flat warm fills** — no photography in chrome, no busy textures. Story **cover art** is the place for rich imagery (see Iconography → cover art).
- Avoid: harsh full-saturation gradients, blue-purple "AI" gradients, neon. Talegate's gradients are desaturated and warm.

### Type (see `tokens/typography.css`)
- **Schibsted Grotesk** — UI & display. Bold, tight, editorial. Big headlines go heavy and near-black with negative tracking (the inspiration's "Hi Peter" energy).
- **Newsreader** — reading & literary display. The story's voice; warm serif with real italics. Reading column ~38rem, line-height 1.75.
- **Geist Mono** — metadata only: chapter/night labels, timestamps, counts. Uppercase, wide tracking, muted.
- Scale is display-led: `64 / 52 / 40` display, `32 / 26 / 21` headings, `16` base, reading at `20`.

### Shape, depth & motion
- **Corners are big and soft** — cards `--radius-lg 26px` to `--radius-xl 34px`, sheets `44px`, buttons pill or `18px`. This is the macOS-Tahoe signature; nothing sharp.
- **Shadows are soft, warm-tinted, low-opacity** and diffuse (`--shadow-md/lg/xl`). Cards lift gently; they don't punch. Circular glass buttons use an inset highlight (`--shadow-glass`) like the inspiration's key-caps.
- **Glass & blur:** translucent `--glass-fill` + `--blur-glass` for floating bars, the bottom tab bar, and over-gradient chrome. Used sparingly, where content scrolls beneath.
- **Borders:** mostly hairline `1px` warm lines; raised surfaces often have *no* border and lean on shadow instead.
- **Motion is calm — bedtime easing.** Gentle ease-out (`--ease-soft`), 140–420ms. A single soft settle (`--ease-bounce`) for things that "arrive" (tonight's chapter unlocking). Gradients/glows drift slowly (~900ms). No springy, snappy, or attention-grabbing animation. Respect `prefers-reduced-motion`.
- **Hover:** lighten/raise (brand → `--brand-hover`, card lifts `2–4px` with a larger shadow). **Press:** scale down ~`0.97` and deepen colour (`--brand-pressed`); never a hard outline.
- **Focus:** a soft 2px `--focus-ring` (indigo) halo, never removed.

---

## Iconography

- **System:** [**Lucide**](https://lucide.dev) — clean, rounded, consistent 2px-stroke open icons that match Talegate's soft geometry. Loaded from CDN (`lucide@latest`); no icon binaries shipped. Stroke `1.75–2`, `currentColor`, sized `20–24` in UI.
- **Why Lucide:** its rounded line-caps and calm weight echo the inspiration's question-mark / profile / scan glyphs. If the eventual codebase standardises on a different set, swap here and document it.
- **Brand glyph:** the Talegate **luminous gateway** mark (`assets/talegate-mark.svg`) — a rounded archway glowing from within, with a path leading through it (cross the threshold into the tale). Used as app icon and loading mark; the `talegate.club` wordmark sets the `.club` in candle amber. A small **🌙 moon / candle** is the only sanctioned emoji-ish garnish, used decoratively (notifications, the "lit" state), never inline in prose.
- **Cover art:** the Shelf's ~10 stories want real, rich cover illustrations (one per archetype). None were provided, so the kit renders **gradient-and-type covers** as a deliberate placeholder treatment — tasteful, on-brand, and clearly swappable. **Replace these with commissioned cover art** for production; that imagery should be warm, painterly, slightly desaturated, with a unifying dusk tint.
- **No hand-drawn one-off SVG icons** beyond the brand mark. Reach for Lucide first.

---

## Index — what's in this system

**Foundations**
- `styles.css` — global entry (import-only). Consumers link this.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css` · `base.css`
- `guidelines/*.card.html` — foundation specimen cards (Type, Colors, Spacing, Brand) shown in the Design System tab.

**Brand assets** — `assets/`
- `talegate-mark.svg`, `talegate-wordmark.svg`, `talegate-wordmark-night.svg`

**Components** — `components/` (React primitives; see each `*.prompt.md`)
- `core/` — Button, IconButton, Badge, Tag, Avatar, AvatarStack
- `surfaces/` — Card, StoryCover, Sheet
- `forms/` — Input, SegmentedControl, Stepper, Choice
- `feedback/` — ProgressTrack, GuildDots

**UI kit** — `ui_kits/babel-app/`
- A click-through of the phone app: the Shelf, guild onboarding, character creation, the Reader, and a nightly choice + Hearth. `index.html` is the interactive demo.

**Skill**
- `SKILL.md` — makes this folder usable as a downloadable Claude Agent Skill.

---

## Using the tokens (quick start)

```css
@import "styles.css"; /* or link it in HTML */

.tonight-card {
  background: var(--surface-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  color: var(--text-strong);
  font-family: var(--font-sans);
}
.chapter-body {
  font-family: var(--font-serif);
  font-size: var(--text-read);
  line-height: var(--leading-reading);
  max-width: var(--reader-measure);
}
```

Prefer **semantic aliases** (`--surface-card`, `--text-body`, `--brand`, `--accent`) over raw scale values in components — they carry intent and survive re-theming.
