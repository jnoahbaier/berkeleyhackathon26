import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Body, Button, Caption, Field, Screen, Title } from "../../src/components/ui";
import { api } from "../../src/lib/api";
import { useSession } from "../../src/lib/session";
import { colors, spacing } from "../../src/theme/theme";

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
    <Screen>
      <Title>Join a guild</Title>
      <Body dim style={{ marginBottom: spacing.lg }}>
        Ask your friend for the 6-letter code shown on their guild screen.
      </Body>
      <Field
        label="Invite code"
        placeholder="ABC123"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
        value={code}
        onChangeText={(t) => setCode(t.toUpperCase())}
        style={{ letterSpacing: 6, fontSize: 24, textAlign: "center" } as any}
      />
      {error ? <Caption style={{ color: colors.danger, marginBottom: spacing.sm }}>{error}</Caption> : null}
      <Button title="Join" onPress={join} loading={busy} disabled={code.length < 4} />
    </Screen>
  );
}
