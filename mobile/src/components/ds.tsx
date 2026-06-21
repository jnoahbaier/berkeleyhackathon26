/**
 * Talegate design-system primitives (React Native port).
 *
 * Mirrors `design-system/components/**` 1:1 in spirit — same tones, radii,
 * fonts, and shadows, expressed with the tokens in `theme.ts`. These compose
 * with the base widgets in `ui.tsx` (Screen, Button, Card, Avatar, …).
 */
import { LinearGradient } from "expo-linear-gradient";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  colors,
  fonts,
  guildSeats,
  radius,
  shadow,
  space,
} from "../theme/theme";
import { Avatar } from "./ui";

/* ============================================================
   Badge — small mono status pill (Lit · 10:00 PM, You, Night 12).
   ============================================================ */
export type BadgeTone = "neutral" | "brand" | "lit" | "success" | "danger" | "night";

const CANDLE_700 = "#C0741F"; // candle-700 — readable amber ink on accent tint

const BADGE_TONES: Record<BadgeTone, { bg: string; fg: string; dot: string }> = {
  neutral: { bg: colors.surfaceSunk, fg: colors.textSecondary, dot: colors.textMuted },
  brand: { bg: colors.brandTint, fg: colors.brandPressed, dot: colors.brand },
  lit: { bg: colors.accentTint, fg: CANDLE_700, dot: colors.accent },
  success: { bg: colors.successTint, fg: colors.success, dot: colors.success },
  danger: { bg: colors.dangerTint, fg: colors.danger, dot: colors.danger },
  night: { bg: colors.nightCard, fg: colors.nightText, dot: colors.brandHover },
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  style,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = BADGE_TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      {dot ? <View style={[styles.badgeDot, { backgroundColor: t.dot }]} /> : null}
      <Text style={[styles.badgeText, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

/* ============================================================
   IconButton — glassy circular key-cap (help / profile / scan).
   ============================================================ */
type IconButtonVariant = "glass" | "solid" | "brand" | "plain";
type IconButtonSize = "sm" | "md" | "lg";

const ICON_SIZES: Record<IconButtonSize, number> = { sm: 36, md: 44, lg: 54 };

export function IconButton({
  children,
  size = "md",
  variant = "glass",
  onNight = false,
  disabled = false,
  onPress,
  style,
}: {
  children: React.ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  onNight?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const dim = ICON_SIZES[size];
  const variants: Record<IconButtonVariant, ViewStyle> = {
    glass: {
      backgroundColor: onNight ? "rgba(28,25,48,0.62)" : "rgba(255,255,255,0.62)",
      borderWidth: 1,
      borderColor: onNight ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.7)",
      ...shadow.sm,
    },
    solid: { backgroundColor: colors.textStrong, ...shadow.md },
    brand: { backgroundColor: colors.brand, ...shadow.sm },
    plain: {
      backgroundColor: onNight ? colors.nightCard : colors.surfaceCard,
      borderWidth: 1,
      borderColor: onNight ? colors.nightBorder : colors.borderHairline,
    },
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: dim,
          height: dim,
          borderRadius: radius.pill,
          alignItems: "center",
          justifyContent: "center",
        },
        variants[variant],
        pressed && !disabled && { transform: [{ scale: 0.92 }] },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

/* ============================================================
   AvatarStack — overlapping guild seats with optional +N overflow.
   ============================================================ */
export function AvatarStack({
  members,
  size = 38,
  max = 4,
  style,
}: {
  members: { name: string; seat?: 1 | 2 | 3 | 4 }[];
  size?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  const overlap = Math.round(size * 0.32);
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {shown.map((m, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: i }}>
          <Avatar name={m.name} seat={m.seat ?? (((i % 4) + 1) as 1 | 2 | 3 | 4)} size={size} ring />
        </View>
      ))}
      {extra > 0 ? (
        <View
          style={{
            marginLeft: -overlap,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.surfaceSunk,
            borderWidth: 2,
            borderColor: colors.bgApp,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: fonts.sans.semibold, fontSize: size * 0.34, color: colors.textSecondary }}>
            +{extra}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* ============================================================
   Tag — selectable taste / genre chip.
   ============================================================ */
export function Tag({
  children,
  selected = false,
  onPress,
  style,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tag,
        selected ? styles.tagSelected : null,
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{children}</Text>
    </Pressable>
  );
}

/* ============================================================
   GuildDots — alignment indicator. Filled seat = ready/chosen.
   ============================================================ */
export function GuildDots({
  members,
  label,
  size = 26,
  onNight = false,
  style,
}: {
  members: { name: string; seat?: 1 | 2 | 3 | 4; done?: boolean }[];
  label?: string;
  size?: number;
  onNight?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const doneCount = members.filter((m) => m.done).length;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: space[4] }, style]}>
      <View style={{ flexDirection: "row", gap: 7 }}>
        {members.map((m, i) => {
          const seat = m.seat ?? (((i % 4) + 1) as 1 | 2 | 3 | 4);
          const c = guildSeats[seat - 1].solid;
          return (
            <View
              key={i}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: m.done ? c : "transparent",
                borderWidth: 2,
                borderColor: m.done ? c : onNight ? colors.nightBorder : colors.borderStrong,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sans.bold,
                  fontSize: size * 0.4,
                  color: m.done ? "#fff" : onNight ? colors.nightMuted : colors.textPlaceholder,
                }}
              >
                {(m.name || "?")[0].toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>
      <Text
        style={{
          fontFamily: fonts.mono.medium,
          fontSize: 11,
          letterSpacing: 0.9,
          textTransform: "uppercase",
          color: onNight ? colors.nightMuted : colors.textMuted,
        }}
      >
        {label ?? `${doneCount} of ${members.length} ready`}
      </Text>
    </View>
  );
}

/* ============================================================
   ProgressTrack — month-long tale progress (Night X of 30).
   ============================================================ */
export function ProgressTrack({
  value,
  total = 30,
  label,
  onNight = false,
  style,
}: {
  value: number;
  total?: number;
  label?: string;
  onNight?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const pct = Math.max(0, Math.min(100, (value / total) * 100));
  return (
    <View style={style}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: space[3] }}>
        <Text style={[styles.trackLabel, { color: onNight ? colors.nightMuted : colors.textMuted }]}>
          {label ?? "Progress"}
        </Text>
        <Text style={[styles.trackLabel, { color: onNight ? colors.nightSoft : colors.textSecondary }]}>
          {value} / {total}
        </Text>
      </View>
      <View
        style={{
          height: 8,
          borderRadius: radius.pill,
          backgroundColor: onNight ? colors.nightCard : colors.surfaceSunk,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={[colors.accent, colors.accentHover]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: `${pct}%`, height: "100%", borderRadius: radius.pill }}
        />
      </View>
    </View>
  );
}

/* ============================================================
   Choice — an in-story decision option (lives on the night reader).
   ============================================================ */
export function Choice({
  letter,
  children,
  meta,
  flavor = "default",
  selected = false,
  onPress,
  style,
}: {
  letter?: string;
  children: React.ReactNode;
  meta?: string;
  flavor?: "default" | "betrayal";
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const accent = flavor === "betrayal" ? colors.danger : colors.accent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: space[4],
          padding: space[5],
          backgroundColor: colors.nightRaised,
          borderWidth: 1.5,
          borderColor: selected ? accent : colors.nightBorder,
          borderRadius: radius.lg,
        },
        selected && {
          shadowColor: accent,
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
        },
        pressed && !selected && { transform: [{ translateY: -1 }] },
        style,
      ]}
    >
      {letter ? (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.pill,
            marginTop: 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected ? accent : colors.nightCard,
            borderWidth: 1,
            borderColor: selected ? accent : colors.nightBorder,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.mono.semibold,
              fontSize: 13,
              color: selected ? colors.textOnAccent : colors.nightSoft,
            }}
          >
            {letter}
          </Text>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.serif.regular, fontSize: 19, lineHeight: 27, color: colors.nightText }}>
          {children}
        </Text>
        {meta ? (
          <Text
            style={{
              marginTop: 6,
              fontFamily: fonts.mono.medium,
              fontSize: 11,
              letterSpacing: 0.9,
              textTransform: "uppercase",
              color: flavor === "betrayal" ? colors.danger : colors.nightMuted,
            }}
          >
            {meta}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/* ============================================================
   Stepper — increment / decrement a guild hyperparameter.
   ============================================================ */
export function Stepper({
  value,
  min = 2,
  max = 4,
  suffix = "",
  onChange,
  style,
}: {
  value: number;
  min?: number;
  max?: number;
  suffix?: string;
  onChange: (n: number) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: space[5] }, style]}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={atMin}
        style={[styles.stepBtn, atMin && { opacity: 0.4 }]}
      >
        <Minus size={20} strokeWidth={2.2} color={colors.textStrong} />
      </Pressable>
      <View style={{ minWidth: 64, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontFamily: fonts.sans.bold, fontSize: 34, letterSpacing: -0.7, color: colors.textStrong }}>
          {value}
        </Text>
        {suffix ? (
          <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14, color: colors.textMuted, marginLeft: 6 }}>
            {suffix}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={atMax}
        style={[styles.stepBtn, atMax && { opacity: 0.4 }]}
      >
        <Plus size={20} strokeWidth={2.2} color={colors.textStrong} />
      </Pressable>
    </View>
  );
}

/* ============================================================
   StoryCover — gradient-and-type book cover for the Shelf.
   ============================================================ */
export type CoverGenre = "medieval" | "scifi" | "noir" | "cosy" | "horror" | "myth";
type CoverSize = "sm" | "md" | "lg";

const COVER_GRADIENTS: Record<CoverGenre, [string, string, string]> = {
  medieval: ["#3d4a3a", "#6b6b3f", "#c79a4e"],
  scifi: ["#16203a", "#2a3f6e", "#6db5c9"],
  noir: ["#1a1822", "#3a3550", "#8a7fa6"],
  cosy: ["#7a4a3a", "#c98a5e", "#f2cda0"],
  horror: ["#1c1414", "#3f2526", "#a04f3f"],
  myth: ["#2a2350", "#5a3f6e", "#e89b3c"],
};

const COVER_DIMS: Record<CoverSize, { w: number; h: number; title: number; pad: number }> = {
  sm: { w: 116, h: 168, title: 17, pad: 12 },
  md: { w: 156, h: 224, title: 21, pad: 15 },
  lg: { w: 208, h: 300, title: 27, pad: 19 },
};

function normalizeGenre(g?: string): CoverGenre {
  const k = (g ?? "").toLowerCase();
  if (k in COVER_GRADIENTS) return k as CoverGenre;
  if (k.includes("sci")) return "scifi";
  if (k.includes("medi")) return "medieval";
  if (k.includes("cos")) return "cosy";
  if (k.includes("noir")) return "noir";
  if (k.includes("hor")) return "horror";
  return "myth";
}

export function StoryCover({
  title,
  author,
  genre,
  size = "md",
  selected = false,
  onPress,
  style,
}: {
  title: string;
  author?: string;
  genre?: string;
  size?: CoverSize;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const d = COVER_DIMS[size];
  const g = normalizeGenre(genre);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: d.w,
          height: d.h,
          borderRadius: radius.md,
          overflow: "hidden",
          ...shadow.md,
        },
        selected && { borderWidth: 3, borderColor: colors.accent },
        pressed && { transform: [{ translateY: -4 }], ...shadow.lg },
        style,
      ]}
    >
      <LinearGradient
        colors={COVER_GRADIENTS[g]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, padding: d.pad, justifyContent: "space-between" }}
      >
        <Text
          style={{
            fontFamily: fonts.mono.medium,
            fontSize: 10,
            letterSpacing: 1.3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {g}
        </Text>
        <View>
          <Text
            style={{
              fontFamily: fonts.serif.semibold,
              fontSize: d.title,
              lineHeight: d.title * 1.1,
              letterSpacing: -0.2,
              color: "#fff",
            }}
          >
            {title}
          </Text>
          {author ? (
            <Text style={{ fontFamily: fonts.sans.regular, fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 5 }}>
              {author}
            </Text>
          ) : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/* ============================================================
   Sheet — bottom sheet modal with grab handle + scrim.
   ============================================================ */
export function Sheet({
  visible,
  onClose,
  children,
  onNight = false,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onNight?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: onNight ? "rgba(8,6,14,0.6)" : "rgba(20,16,10,0.42)" }]} />
        </Pressable>
        <View
          style={{
            backgroundColor: onNight ? colors.nightRaised : colors.surfaceCard,
            borderTopLeftRadius: radius.x2l,
            borderTopRightRadius: radius.x2l,
            paddingTop: space[4],
            paddingHorizontal: space[7],
            paddingBottom: insets.bottom + space[7],
            borderTopWidth: onNight ? 1 : 0,
            borderTopColor: colors.nightBorder,
            ...shadow.xl,
          }}
        >
          <View
            style={{
              width: 40,
              height: 5,
              borderRadius: radius.pill,
              backgroundColor: onNight ? colors.nightBorder : colors.borderStrong,
              alignSelf: "center",
              marginBottom: space[5],
            }}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  tag: {
    height: 38,
    paddingHorizontal: space[5],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  tagSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  tagText: { fontFamily: fonts.sans.medium, fontSize: 14, color: colors.textBody },
  tagTextSelected: { fontFamily: fonts.sans.semibold, color: colors.textOnBrand },
  trackLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
