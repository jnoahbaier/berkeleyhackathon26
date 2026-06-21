import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, space, text as type } from "../theme/theme";
import { IconButton } from "./ds";
import { Reading } from "./ui";

export function StepHead({
  step,
  total,
  title,
  subtitle,
  onBack,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + space[9], paddingHorizontal: space[6], paddingBottom: space[2] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4], marginBottom: space[6] }}>
        {onBack ? (
          <IconButton variant="plain" size="sm" onPress={onBack}>
            <ArrowLeft size={18} color={colors.textStrong} strokeWidth={1.9} />
          </IconButton>
        ) : (
          <View style={{ width: 36 }} />
        )}
        <View style={{ flex: 1, flexDirection: "row", gap: 6 }}>
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
      </View>
      <Text style={[type.label, { marginBottom: space[3] }]}>{`Step ${step} of ${total}`}</Text>
      <Text style={{ fontFamily: fonts.sans.bold, fontSize: 28, lineHeight: 30, letterSpacing: -0.56, color: colors.textStrong }}>
        {title}
      </Text>
      {subtitle ? <Reading style={{ marginTop: space[3], color: colors.textSecondary }}>{subtitle}</Reading> : null}
    </View>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontFamily: fonts.sans.bold, fontSize: 15, color: colors.textStrong, marginBottom: space[3] }}>
      {children}
    </Text>
  );
}

export function FormSubLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontFamily: fonts.sans.regular, fontSize: 13, color: colors.textMuted, marginBottom: space[4], marginTop: -space[2] }}>
      {children}
    </Text>
  );
}

export function FormRow({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[4] }}>
      <View style={{ flex: 1 }}>
        <FormLabel>{label}</FormLabel>
        {sublabel ? <FormSubLabel>{sublabel}</FormSubLabel> : null}
      </View>
      {children}
    </View>
  );
}
