import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Body, Button, Caption, Field, Loading, Screen, Title } from "../src/components/ui";
import { useSession } from "../src/lib/session";
import { colors, spacing } from "../src/theme/theme";

export default function Welcome() {
  const { user, hydrated, signIn } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) router.replace("/home");
  }, [hydrated, user]);

  if (!hydrated || user) return <Loading label="Waking the library..." />;

  const onContinue = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await signIn(name.trim());
      router.replace("/onboarding");
    } catch (e: any) {
      setError(e.message ?? "Could not connect to the server");
      setBusy(false);
    }
  };

  return (
    <Screen scroll={false} contentStyle={{ justifyContent: "center" }}>
      <View style={{ marginBottom: spacing.xl }}>
        <Title>Babel</Title>
        <Body dim>
          A shared bedtime story for friends who live far apart. Form a guild, read the same
          chapter each night, and shape the tale together.
        </Body>
      </View>
      <Field
        label="What should your friends call you?"
        placeholder="e.g. Alex"
        value={name}
        onChangeText={setName}
        autoFocus
        onSubmitEditing={onContinue}
      />
      {error ? <Caption style={{ color: colors.danger, marginBottom: spacing.sm }}>{error}</Caption> : null}
      <Button title="Begin" onPress={onContinue} loading={busy} disabled={!name.trim()} />
    </Screen>
  );
}
