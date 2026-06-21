---
name: talegate-design
description: Use this skill to generate well-branded interfaces and assets for Talegate — a shared bedtime-story app for long-distance friends (guilds of 2–4 read one month-long, choice-driven tale together). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping or production.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Talegate's mood is **dusk**: warm parchment by day, deep indigo "night" for reading; one twilight-indigo brand colour, one candle-amber accent; big soft macOS-Tahoe corners; bold Schibsted Grotesk display, literary Newsreader serif for story, Geist Mono for labels. Voice is an intimate bedtime narrator (serif, in-story) plus a warm, plain product voice (sans, talks to "you" and "your guild"). Sentence case; near-zero emoji beyond a 🌙 garnish.

Key files:
- `styles.css` — global entry; link it to inherit all tokens and fonts.
- `tokens/` — colors, typography, spacing/radii/shadows, fonts.
- `guidelines/*.card.html` — foundation specimens.
- `components/` — React primitives (Button, IconButton, Badge, Tag, Avatar, AvatarStack, Card, StoryCover, Sheet, Input, SegmentedControl, Stepper, Choice, ProgressTrack, GuildDots). Each has a `.prompt.md`.
- `ui_kits/babel-app/` — interactive recreation of the phone app.
- `assets/` — Talegate logo/mark.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
