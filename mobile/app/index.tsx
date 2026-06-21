import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Wordmark from "../assets/brand/talegate-wordmark.svg";
import { Body, Button, Caption, Field, GradientHero, Loading, Reading } from "../src/components/ui";
import { useSession } from "../src/lib/session";
import { colors, space } from "../src/theme/theme";

export default function Welcome() {
  const { user, hydrated, signIn } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) router.replace("/(tabs)/tonight");
  }, [hydrated, user]);

  if (!hydrated || user) return <Loading label="Waking the library…" />;

  const onContinue = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await signIn(name.trim());
      router.replace("/(tabs)/tonight");
    } catch (e: any) {
      setError(e.message ?? "Could not connect to the server");
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgApp }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GradientHero kicker="a reading club for your friends" style={{ paddingBottom: space[10] }}>
          <View style={{ marginTop: space[4], marginBottom: space[5] }}>
            <Wordmark width={232} height={60} />
          </View>
          <Reading style={{ color: colors.textBody }}>
            A shared bedtime story for friends who live far apart. Gather your friends, read the same chapter
            each night, and shape the tale together.
          </Reading>
        </GradientHero>

        <View style={{ flex: 1, padding: space[6], justifyContent: "flex-end" }}>
          <Body dim style={{ marginBottom: space[5] }}>
            Each night you cross the gate into the story together.
          </Body>
          <Field
            label="What should your friends call you?"
            placeholder="e.g. Alex"
            value={name}
            onChangeText={setName}
            autoFocus
            onSubmitEditing={onContinue}
            returnKeyType="go"
          />
          {error ? (
            <Caption style={{ color: colors.danger, marginBottom: space[3] }}>{error}</Caption>
          ) : null}
          <Button title="Begin" onPress={onContinue} loading={busy} disabled={!name.trim()} size="lg" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
