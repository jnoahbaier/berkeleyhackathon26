import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { StepHead } from "../../src/components/SetupParts";
import { Button, Caption, Field } from "../../src/components/ui";
import { api } from "../../src/lib/api";
import { useSession } from "../../src/lib/session";
import { colors, fonts, space } from "../../src/theme/theme";

export default function JoinGuild() {
  const { user } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const join = async () => {
    if (!user || !code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { guild } = await api.joinGuild(code.trim().toUpperCase(), user.id);
      await AsyncStorage.setItem("babel.lastGuild", JSON.stringify({ id: guild.id, name: guild.name }));
      router.replace(`/guild/${guild.id}`);
    } catch (e: any) {
      setError(e.message ?? "Could not join");
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <ScrollView contentContainerStyle={{ paddingBottom: space[11] }} keyboardShouldPersistTaps="handled">
        <StepHead
          step={1}
          total={1}
          title="Cross into their tale."
          subtitle="Ask your friend for the 6-letter code shown on their friends screen."
          onBack={() => router.back()}
        />
        <View style={{ paddingHorizontal: space[5] }}>
          <Field
            label="Invite code"
            placeholder="ABC123"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            style={{
              letterSpacing: 10,
              fontSize: 30,
              textAlign: "center",
              fontFamily: fonts.mono.medium,
              paddingVertical: 18,
            }}
          />
          {error ? <Caption style={{ color: colors.danger, marginBottom: space[3] }}>{error}</Caption> : null}
          <Button title="Join your friends" onPress={join} loading={busy} disabled={code.length < 4} size="lg" />
        </View>
      </ScrollView>
    </View>
  );
}
