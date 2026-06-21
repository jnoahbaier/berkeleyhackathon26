import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  colors,
  fonts,
  gradients,
  guildSeats,
  radius,
  shadow,
  space,
  text as type,
} from "../theme/theme";

/* ============================================================
   Screen — parchment canvas with generous, airy padding.
   ============================================================ */
export function Screen({
  children,
  scroll = true,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[
        { padding: space[6], paddingBottom: space[10] },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, padding: space[6] }, contentStyle]}>{children}</View>
  );
  return <SafeAreaView style={styles.screen}>{inner}</SafeAreaView>;
}

/* ============================================================
   Typography — maps to the design-system type presets.
   ============================================================ */
export function Title({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.h1, style]}>{children}</Text>;
}
export function Heading({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.h2, style]}>{children}</Text>;
}
export function Body({
  children,
  dim,
  style,
}: {
  children: React.ReactNode;
  dim?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[type.body, dim && { color: colors.textSecondary }, style]}>{children}</Text>;
}
export function Caption({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.bodySm, { color: colors.textMuted }, style]}>{children}</Text>;
}
/** Mono metadata label — UPPERCASE, wide tracking (CHAPTER 04 · NIGHT 12). */
export function Label({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.label, style]}>{children}</Text>;
}
/** Story / reading voice (Newsreader serif). */
export function Reading({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.read, style]}>{children}</Text>;
}

/* ============================================================
   Card — soft, big-radius surface with warm low-opacity lift.
   Mirrors design-system/components/surfaces/Card.jsx.
   ============================================================ */
type Elevation = "flat" | "sm" | "md" | "lg";

export function Card({
  children,
  elevation = "md",
  pad = 20,
  onNight = false,
  interactive = false,
  onPress,
  style,
}: {
  children: React.ReactNode;
  elevation?: Elevation;
  pad?: number;
  onNight?: boolean;
  interactive?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const base: ViewStyle = {
    backgroundColor: onNight ? colors.nightCard : colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: onNight ? 1 : 0,
    borderColor: onNight ? colors.nightBorder : "transparent",
    padding: pad,
    ...(elevation === "flat" ? shadow.none : shadow[elevation]),
  };

  if (interactive || onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          base,
          pressed && { transform: [{ translateY: -2 }], ...shadow.lg },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

/* ============================================================
   Button — pill, soft 0.97 press, calm easing.
   Mirrors design-system/components/core/Button.jsx.
   ============================================================ */
type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BTN_SIZES: Record<ButtonSize, { height: number; padX: number; font: number; gap: number }> = {
  sm: { height: 36, padX: space[5], font: 14, gap: 7 },
  md: { height: 46, padX: 22, font: 16, gap: 8 },
  lg: { height: 56, padX: 28, font: 18, gap: 10 },
};

export function Button({
  title,
  children,
  onPress,
  variant = "primary",
  size = "md",
  full = true,
  loading,
  disabled,
  iconLeft,
  iconRight,
  onNight = false,
  style,
}: {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onNight?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const isDisabled = disabled || loading;
  const s = BTN_SIZES[size];

  const fill: Record<ButtonVariant, { bg: string; fg: string; pressed: string; border?: string }> = {
    primary: { bg: colors.brand, fg: colors.textOnBrand, pressed: colors.brandPressed },
    accent: { bg: colors.accent, fg: colors.textOnAccent, pressed: colors.accentPressed },
    secondary: {
      bg: onNight ? colors.nightCard : colors.surfaceCard,
      fg: onNight ? colors.nightText : colors.textStrong,
      pressed: onNight ? colors.nightRaised : colors.surfaceSunk,
      border: onNight ? colors.nightBorder : colors.borderStrong,
    },
    ghost: {
      bg: "transparent",
      fg: onNight ? colors.nightText : colors.brand,
      pressed: onNight ? "rgba(255,255,255,0.06)" : colors.brandTint,
    },
    danger: { bg: colors.danger, fg: colors.textOnBrand, pressed: "#A8412F" },
  };
  const v = fill[variant];
  const hasShadow = variant === "primary" || variant === "accent" || variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        {
          height: s.height,
          paddingHorizontal: s.padX,
          gap: s.gap,
          alignSelf: full ? "stretch" : "flex-start",
          backgroundColor: pressed && !isDisabled ? v.pressed : v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border ?? "transparent",
        },
        hasShadow && !isDisabled && shadow.sm,
        pressed && !isDisabled && { transform: [{ scale: 0.97 }] },
        isDisabled && { opacity: 0.45 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {iconLeft}
          <Text
            style={{
              fontFamily: fonts.sans.semibold,
              fontSize: s.font,
              letterSpacing: -0.1,
              color: v.fg,
            }}
          >
            {title ?? children}
          </Text>
          {iconRight}
        </>
      )}
    </Pressable>
  );
}

/* ============================================================
   Form field — sunken warm well, hairline border, big radius.
   ============================================================ */
export function Field({ label, style, ...props }: TextInputProps & { label?: string }) {
  return (
    <View style={{ marginBottom: space[5] }}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textPlaceholder}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

/** Comma / enter based tag input that stores a string[]. */
export function TagInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = React.useState("");
  const commit = () => {
    const parts = draft
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  };
  return (
    <View style={{ marginBottom: space[5] }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commit}
        onBlur={commit}
        returnKeyType="done"
        blurOnSubmit={false}
      />
      {value.length > 0 && (
        <View style={styles.tagWrap}>
          {value.map((t, i) => (
            <Pressable key={`${t}-${i}`} onPress={() => onChange(value.filter((_, j) => j !== i))}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{t}  ×</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/* ============================================================
   Pill / Badge — small status chip.
   ============================================================ */
export function Pill({
  text: label,
  tone = "default",
}: {
  text: string;
  tone?: "default" | "success" | "accent" | "brand";
}) {
  const tones = {
    default: { bg: colors.surfaceSunk, border: colors.borderHairline, fg: colors.textSecondary },
    success: { bg: colors.successTint, border: colors.success, fg: colors.success },
    accent: { bg: colors.accentTint, border: colors.accent, fg: colors.accent },
    brand: { bg: colors.brandTint, border: colors.brand, fg: colors.brand },
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: tones.bg, borderColor: tones.border }]}>
      <Text style={[styles.pillText, { color: tones.fg }]}>{label}</Text>
    </View>
  );
}

/* ============================================================
   Avatar — guild-seat tinted initials.
   ============================================================ */
export function Avatar({
  name,
  seat,
  size = 46,
  active,
  ring = false,
}: {
  name: string;
  seat?: 1 | 2 | 3 | 4;
  size?: number;
  active?: boolean;
  /** White hairline ring — used when avatars overlap (AvatarStack). */
  ring?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const seatColor = seat ? guildSeats[seat - 1] : null;
  const borderColor = active ? colors.success : ring ? colors.bgApp : "transparent";
  const borderWidth = active ? 2 : ring ? 2 : 0;
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: seatColor ? seatColor.soft : colors.brandTint,
          borderColor,
          borderWidth,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: fonts.sans.bold,
          fontSize: size * 0.34,
          color: seatColor ? seatColor.solid : colors.brand,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.brand} size="large" />
      {label ? (
        <Body dim style={{ marginTop: space[5] }}>
          {label}
        </Body>
      ) : null}
    </View>
  );
}

/* ============================================================
   GradientHero — the signature dusk gradient behind bold type.
   Bleeds under the status bar; carries a mono kicker + display.
   ============================================================ */
export function GradientHero({
  top,
  kicker,
  title,
  subtitle,
  children,
  safeTop = true,
  style,
}: {
  top?: React.ReactNode;
  kicker?: string;
  title?: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  safeTop?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={gradients.dusk.colors}
      locations={gradients.dusk.locations}
      start={gradients.dusk.start}
      end={gradients.dusk.end}
      style={[
        {
          paddingTop: (safeTop ? insets.top : 0) + space[7],
          paddingHorizontal: space[6],
          paddingBottom: space[9],
        },
        style,
      ]}
    >
      {top}
      {kicker ? (
        <Text style={[type.label, { color: "rgba(40,32,22,0.62)", marginBottom: space[3] }]}>{kicker}</Text>
      ) : null}
      {typeof title === "string" ? <Text style={type.displayLg}>{title}</Text> : title}
      {subtitle ? (
        <Text style={[type.body, { color: colors.textBody, marginTop: space[3] }]}>{subtitle}</Text>
      ) : null}
      {children}
    </LinearGradient>
  );
}

/* ============================================================
   StepDots — onboarding progress (candle = done, hairline = todo).
   ============================================================ */
export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", gap: space[2] }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 5,
            borderRadius: radius.pill,
            backgroundColor: i < step ? colors.accent : colors.borderHairline,
          }}
        />
      ))}
    </View>
  );
}

/* ============================================================
   SegmentedControl — sunken track, raised active pill.
   Mirrors design-system/components/forms/SegmentedControl.jsx.
   ============================================================ */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segment, style]}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ============================================================
   SelectChip — rounded, selectable tag (tastes, vibes, options).
   ============================================================ */
export function SelectChip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  btn: {
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: space[2],
  },
  fieldLabel: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: space[3],
  },
  input: {
    backgroundColor: colors.surfaceSunk,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    paddingHorizontal: space[5],
    paddingVertical: 13,
    color: colors.textStrong,
    fontFamily: fonts.sans.regular,
    fontSize: 16,
  },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: space[3], gap: space[3] },
  tag: {
    backgroundColor: colors.brandTint,
    borderRadius: radius.pill,
    paddingHorizontal: space[4],
    paddingVertical: 6,
  },
  tagText: { fontFamily: fonts.sans.medium, color: colors.brand, fontSize: 14 },
  pill: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: space[4],
    paddingVertical: 5,
  },
  pillText: { fontFamily: fonts.sans.semibold, fontSize: 13 },
  avatar: { alignItems: "center", justifyContent: "center" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", padding: space[10] },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSunk,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemActive: { backgroundColor: colors.surfaceCard, ...shadow.xs },
  segmentText: { fontFamily: fonts.sans.medium, fontSize: 14, color: colors.textSecondary },
  segmentTextActive: { fontFamily: fonts.sans.semibold, color: colors.textStrong },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: space[5],
    paddingVertical: 9,
  },
  chipSelected: { borderColor: colors.brand, backgroundColor: colors.brandTint },
  chipText: { fontFamily: fonts.sans.medium, fontSize: 14, color: colors.textSecondary },
  chipTextSelected: { fontFamily: fonts.sans.semibold, color: colors.brand },
});
