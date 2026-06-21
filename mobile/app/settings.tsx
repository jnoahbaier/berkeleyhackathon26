import { useRouter } from "expo-router";
import { ChevronRight, Globe, LogOut, Moon, X } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../src/components/ds";
import { Body, Button, Caption, Card, Label, SegmentedControl } from "../src/components/ui";
import { useSession } from "../src/lib/session";
import { colors, fonts, space, text as type } from "../src/theme/theme";

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useSession();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/tonight");
  };

  const onSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + space[5], paddingHorizontal: space[6], paddingBottom: insets.bottom + space[10] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space[6] }}>
          <Text style={type.h1}>Settings</Text>
          <IconButton variant="plain" size="sm" onPress={close}>
            <X size={18} color={colors.textStrong} strokeWidth={1.9} />
          </IconButton>
        </View>

        {/* Appearance */}
        <Label style={{ marginBottom: space[3] }}>Appearance</Label>
        <Card elevation="sm" pad={space[6]} style={{ marginBottom: space[6] }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], marginBottom: space[4] }}>
            <Moon size={18} color={colors.brand} strokeWidth={1.9} />
            <Body style={{ flex: 1 }}>Theme</Body>
          </View>
          <SegmentedControl
            options={[
              { value: "light" as const, label: "Light" },
              { value: "dark" as const, label: "Dark" },
              { value: "system" as const, label: "System" },
            ]}
            value={theme}
            onChange={setTheme}
          />
          <Caption style={{ marginTop: space[3] }}>Dark mode is coming soon — this is a preview.</Caption>
        </Card>

        {/* Language */}
        <Label style={{ marginBottom: space[3] }}>Language</Label>
        <Card elevation="sm" pad={space[6]} style={{ marginBottom: space[6] }}>
          <Row icon={<Globe size={18} color={colors.brand} strokeWidth={1.9} />} title="Language" value="English" />
        </Card>

        {/* Account */}
        <Label style={{ marginBottom: space[3] }}>Account</Label>
        <Card elevation="sm" pad={space[6]} style={{ marginBottom: space[6] }}>
          {user ? (
            <Body dim style={{ marginBottom: space[4] }}>
              Signed in as <Text style={{ fontFamily: fonts.sans.semibold, color: colors.textStrong }}>{user.display_name}</Text>
            </Body>
          ) : null}
          <Button
            title="Continue with Google"
            variant="secondary"
            size="md"
            onPress={() => {}}
          />
          <Caption style={{ marginTop: space[3] }}>Google sign-in is a placeholder for now.</Caption>
        </Card>

        {user ? (
          <Button
            title="Sign out"
            variant="ghost"
            size="md"
            onPress={onSignOut}
            iconLeft={<LogOut size={18} color={colors.danger} strokeWidth={1.9} />}
          />
        ) : null}

        <Text
          style={{
            fontFamily: fonts.mono.regular,
            fontSize: 11,
            color: colors.textMuted,
            textAlign: "center",
            marginTop: space[6],
          }}
        >
          Talegate · talegate.club
        </Text>
      </ScrollView>
    </View>
  );
}

function Row({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
      {icon}
      <Body style={{ flex: 1 }}>{title}</Body>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14.5, color: colors.textSecondary }}>{value}</Text>
        <ChevronRight size={17} color={colors.textMuted} strokeWidth={1.9} />
      </View>
    </View>
  );
}
