/**
 * Talegate design tokens — ported 1:1 from the TaleGate.club Design System
 * (`design-system/tokens/*.css`). Do not invent new colors, fonts, radii, or
 * shadows here; mirror the source tokens and prefer the semantic aliases in
 * components.
 *
 * Mood: dusk. Warm parchment by day, deep indigo night for reading. One brand
 * indigo, one candle-amber accent, big soft macOS-Tahoe corners.
 */
import type { TextStyle, ViewStyle } from "react-native";

/* ============================================================
   RAW SCALES (tokens/colors.css)
   ============================================================ */
export const palette = {
  // Warm neutrals (ink on parchment)
  ink900: "#16140F",
  ink700: "#3B362D",
  ink500: "#6B6457",
  ink400: "#8C8474",
  ink300: "#B6AE9D",
  ink200: "#D8D0C1",

  parchment: "#FAF6EF",
  parchmentDeep: "#F4EEE2",
  paper: "#FFFFFF",
  paperSunk: "#F2ECE1",
  line: "#E7DFD1",
  lineStrong: "#D8CFBD",

  // Brand · Talegate Indigo (twilight)
  indigo800: "#2A2563",
  indigo700: "#322C7A",
  indigo600: "#423AA0",
  indigo500: "#5B50C9",
  indigo300: "#A59CEC",
  indigo100: "#DDD9F4",
  indigo50: "#ECEAF8",

  // Accent · Candle Amber (the glow)
  candle700: "#C0741F",
  candle600: "#D9892C",
  candle500: "#E89B3C",
  candle400: "#F2B566",
  candle100: "#F9E3C4",
  candle50: "#FBEFDD",

  // Night · reading surfaces
  night900: "#131120",
  night800: "#1C1930",
  night700: "#272340",
  night600: "#37325A",
  nightText: "#EDE7DA",
  nightSoft: "#C3BCD0",
  nightMuted: "#847D99",

  // Guild seats · up to 4 characters
  guild1: "#C9756B", // clay rose
  guild2: "#5E8C7D", // sage teal
  guild3: "#6B7FC9", // periwinkle
  guild4: "#D9A441", // old gold
  guild1Soft: "#F4DDD9",
  guild2Soft: "#D9E7E1",
  guild3Soft: "#DDE3F5",
  guild4Soft: "#F5E7C8",

  // Status
  success600: "#4F8A5B",
  success50: "#E6F1E8",
  warning600: "#D9892C",
  warning50: "#FBEFDD",
  danger600: "#C5523F", // betrayal / destructive
  danger50: "#F7E3DF",

  // Dusk gradient stops (the hero motif)
  duskSage: "#BFCDAE",
  duskPeach: "#F4D2A6",
  duskLilac: "#D8C3E8",
} as const;

/** Four character seats, indexable by 1–4. */
export const guildSeats = [
  { solid: palette.guild1, soft: palette.guild1Soft },
  { solid: palette.guild2, soft: palette.guild2Soft },
  { solid: palette.guild3, soft: palette.guild3Soft },
  { solid: palette.guild4, soft: palette.guild4Soft },
] as const;

/**
 * Gradient stop arrays for use with expo-linear-gradient
 * (`colors` + optional `locations`). Angles from the CSS are approximated by
 * start/end points where noted.
 */
export const gradients = {
  // --gradient-dusk (~176deg, sage→wheat→peach→lilac)
  dusk: {
    colors: ["#C3D0B4", "#E7D6B6", "#F4D2A6", "#DDC6EA"] as const,
    locations: [0, 0.42, 0.64, 1] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  // --gradient-night (168deg, indigo→plum→amber-glow)
  night: {
    colors: ["#1A1730", "#2A2350", "#5A3F6E", "#B9752F"] as const,
    locations: [0, 0.46, 0.78, 1] as const,
    start: { x: 0.1, y: 0 },
    end: { x: 0.9, y: 1 },
  },
  // --gradient-glow (radial amber); RN linear fallback, fade downward
  glow: {
    colors: ["rgba(242,181,102,0.55)", "rgba(242,181,102,0)"] as const,
    locations: [0, 0.6] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
} as const;

/* ============================================================
   SEMANTIC ALIASES (prefer these in components)
   ============================================================ */
export const colors = {
  // --- semantic surfaces / text / brand (tokens/colors.css) ---
  bgApp: palette.parchment,
  bgAlt: palette.parchmentDeep,
  surfaceCard: palette.paper,
  surfaceSunk: palette.paperSunk,
  borderHairline: palette.line,
  borderStrong: palette.lineStrong,

  textStrong: palette.ink900,
  textBody: palette.ink700,
  textSecondary: palette.ink500,
  textMuted: palette.ink400,
  textPlaceholder: palette.ink300,
  textOnBrand: "#FFFFFF",
  textOnAccent: "#3B2A10",
  textOnNight: palette.nightText,

  brand: palette.indigo600,
  brandHover: palette.indigo500,
  brandPressed: palette.indigo700,
  brandTint: palette.indigo50,

  accent: palette.candle500,
  accentHover: palette.candle400,
  accentTint: palette.candle50,
  accentPressed: palette.candle600,

  focusRing: palette.indigo500,

  // --- night reading surfaces ---
  nightBg: palette.night900,
  nightRaised: palette.night800,
  nightCard: palette.night700,
  nightBorder: palette.night600,
  nightText: palette.nightText,
  nightSoft: palette.nightSoft,
  nightMuted: palette.nightMuted,

  // --- status ---
  success: palette.success600,
  successTint: palette.success50,
  warning: palette.warning600,
  warningTint: palette.warning50,
  danger: palette.danger600,
  dangerTint: palette.danger50,

  overlay: "rgba(8,6,14,0.6)",

  /* ---- Backward-compatible keys (legacy bedtime theme) ----
     Kept so screens not yet ported keep rendering; mapped onto the
     Talegate palette. Prefer the semantic aliases above for new work. */
  bg: palette.parchment,
  bgElevated: palette.paperSunk,
  card: palette.paper,
  cardBorder: palette.line,
  primary: palette.indigo600,
  primaryDim: palette.indigo500,
  text: palette.ink900,
  textDim: palette.ink500,
  textFaint: palette.ink400,
} as const;

/* ============================================================
   TYPOGRAPHY (tokens/typography.css + tokens/fonts.css)
   In RN each weight is a distinct loaded family; set fontFamily,
   not fontWeight, to pick a weight.
   ============================================================ */
export const fonts = {
  sans: {
    regular: "SchibstedGrotesk_400Regular",
    medium: "SchibstedGrotesk_500Medium",
    semibold: "SchibstedGrotesk_600SemiBold",
    bold: "SchibstedGrotesk_700Bold",
    extrabold: "SchibstedGrotesk_800ExtraBold",
  },
  serif: {
    regular: "Newsreader_400Regular",
    medium: "Newsreader_500Medium",
    semibold: "Newsreader_600SemiBold",
    italic: "Newsreader_400Regular_Italic",
    semiboldItalic: "Newsreader_600SemiBold_Italic",
  },
  mono: {
    regular: "GeistMono_400Regular",
    medium: "GeistMono_500Medium",
    semibold: "GeistMono_600SemiBold",
  },
} as const;

export const fontSize = {
  display2xl: 64,
  displayXl: 52,
  displayLg: 40,
  h1: 32,
  h2: 26,
  h3: 21,
  h4: 18,
  lg: 18,
  base: 16,
  sm: 14,
  xs: 13,
  readXl: 26,
  readLg: 22,
  read: 20,
  label: 12,
  labelSm: 11,
} as const;

export const leading = {
  tight: 1.04,
  snug: 1.18,
  normal: 1.4,
  relaxed: 1.6,
  reading: 1.75,
} as const;

/** Tracking in em (multiply by fontSize for RN letterSpacing in px). */
export const tracking = {
  tight: -0.02,
  snug: -0.011,
  normal: 0,
  label: 0.14,
} as const;

const lh = (size: number, ratio: number) => Math.round(size * ratio);
const ls = (size: number, em: number) => Math.round(size * em * 100) / 100;

/**
 * Ready-to-spread text presets mirroring base.css utility classes
 * (.babel-display-*, .babel-h*, .babel-reading, .babel-body, .babel-label).
 */
export const text = {
  display2xl: {
    fontFamily: fonts.sans.bold,
    fontSize: fontSize.display2xl,
    lineHeight: lh(fontSize.display2xl, leading.tight),
    letterSpacing: ls(fontSize.display2xl, tracking.tight),
    color: colors.textStrong,
  },
  displayXl: {
    fontFamily: fonts.sans.bold,
    fontSize: fontSize.displayXl,
    lineHeight: lh(fontSize.displayXl, leading.tight),
    letterSpacing: ls(fontSize.displayXl, tracking.tight),
    color: colors.textStrong,
  },
  displayLg: {
    fontFamily: fonts.sans.bold,
    fontSize: fontSize.displayLg,
    lineHeight: lh(fontSize.displayLg, leading.snug),
    letterSpacing: ls(fontSize.displayLg, tracking.tight),
    color: colors.textStrong,
  },
  h1: {
    fontFamily: fonts.sans.bold,
    fontSize: fontSize.h1,
    lineHeight: lh(fontSize.h1, leading.snug),
    letterSpacing: ls(fontSize.h1, tracking.snug),
    color: colors.textStrong,
  },
  h2: {
    fontFamily: fonts.sans.semibold,
    fontSize: fontSize.h2,
    lineHeight: lh(fontSize.h2, leading.snug),
    letterSpacing: ls(fontSize.h2, tracking.snug),
    color: colors.textStrong,
  },
  h3: {
    fontFamily: fonts.sans.semibold,
    fontSize: fontSize.h3,
    lineHeight: lh(fontSize.h3, leading.normal),
    color: colors.textStrong,
  },
  h4: {
    fontFamily: fonts.sans.semibold,
    fontSize: fontSize.h4,
    lineHeight: lh(fontSize.h4, leading.normal),
    color: colors.textStrong,
  },
  bodyLg: {
    fontFamily: fonts.sans.regular,
    fontSize: fontSize.lg,
    lineHeight: lh(fontSize.lg, leading.relaxed),
    color: colors.textBody,
  },
  body: {
    fontFamily: fonts.sans.regular,
    fontSize: fontSize.base,
    lineHeight: lh(fontSize.base, leading.relaxed),
    color: colors.textBody,
  },
  bodySm: {
    fontFamily: fonts.sans.regular,
    fontSize: fontSize.sm,
    lineHeight: lh(fontSize.sm, leading.normal),
    color: colors.textBody,
  },
  bodyXs: {
    fontFamily: fonts.sans.regular,
    fontSize: fontSize.xs,
    lineHeight: lh(fontSize.xs, leading.normal),
    color: colors.textBody,
  },
  // Story / reading voice (Newsreader serif)
  serifDisplay: {
    fontFamily: fonts.serif.semibold,
    fontSize: fontSize.readXl,
    lineHeight: lh(fontSize.readXl, leading.snug),
    letterSpacing: ls(fontSize.readXl, tracking.snug),
    color: colors.textStrong,
  },
  readXl: {
    fontFamily: fonts.serif.regular,
    fontSize: fontSize.readXl,
    lineHeight: lh(fontSize.readXl, leading.reading),
    color: colors.textBody,
  },
  readLg: {
    fontFamily: fonts.serif.regular,
    fontSize: fontSize.readLg,
    lineHeight: lh(fontSize.readLg, leading.reading),
    color: colors.textBody,
  },
  read: {
    fontFamily: fonts.serif.regular,
    fontSize: fontSize.read,
    lineHeight: lh(fontSize.read, leading.reading),
    color: colors.textBody,
  },
  // Mono metadata labels — UPPERCASE, wide tracking
  label: {
    fontFamily: fonts.mono.medium,
    fontSize: fontSize.label,
    lineHeight: lh(fontSize.label, leading.normal),
    letterSpacing: ls(fontSize.label, tracking.label),
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  labelSm: {
    fontFamily: fonts.mono.medium,
    fontSize: fontSize.labelSm,
    lineHeight: lh(fontSize.labelSm, leading.normal),
    letterSpacing: ls(fontSize.labelSm, tracking.label),
    textTransform: "uppercase",
    color: colors.textMuted,
  },
} satisfies Record<string, TextStyle>;

/* ============================================================
   SPACING / RADII / SHADOWS (tokens/spacing.css)
   ============================================================ */
/** 4px-grid spacing scale (space-0 … space-13). */
export const space = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 20,
  7: 24,
  8: 32,
  9: 40,
  10: 48,
  11: 64,
  12: 80,
  13: 96,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  x2l: 44,
  pill: 999,
} as const;

/**
 * Soft, warm-tinted, low-opacity shadows (tokens/spacing.css). RN can't do
 * multi-layer shadows, so these approximate the largest CSS layer; `elevation`
 * drives Android. Shadow color is the warm ink used across the CSS shadows.
 */
const SHADOW_INK = "#1F1A10";
export const shadow = {
  none: {} as ViewStyle,
  xs: {
    shadowColor: SHADOW_INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: SHADOW_INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: SHADOW_INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  lg: {
    shadowColor: SHADOW_INK,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
  },
  xl: {
    shadowColor: SHADOW_INK,
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.14,
    shadowRadius: 70,
    elevation: 18,
  },
  // Candle glow for focal/active brand elements at night
  glow: {
    shadowColor: palette.candle500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 36,
    elevation: 12,
  },
} satisfies Record<string, ViewStyle>;

/** Glass / blur fills (tokens/spacing.css). */
export const glass = {
  fill: "rgba(255,255,255,0.62)",
  fillNight: "rgba(28,25,48,0.62)",
  blur: 20,
} as const;

/** Calm bedtime motion (tokens/spacing.css). */
export const motion = {
  durFast: 140,
  durBase: 240,
  durSlow: 420,
  durDrift: 900,
} as const;

export const layout = {
  readerMeasure: 560, // ~38rem comfortable reading column
  phoneW: 390,
} as const;

/* ============================================================
   BACKWARD-COMPAT EXPORTS (legacy `spacing` / `font`)
   ============================================================ */
export const spacing = {
  xs: space[2], // 4
  sm: space[3], // 8
  md: space[5], // 16
  lg: space[7], // 24
  xl: space[8], // 32
} as const;

export const font = {
  title: fontSize.h1,
  heading: fontSize.h2,
  subheading: fontSize.h4,
  body: fontSize.base,
  small: fontSize.xs,
  reading: fontSize.read,
} as const;
