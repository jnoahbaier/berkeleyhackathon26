import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Body, Button, Caption, Card, Heading, Pill, Screen, Title } from "../src/components/ui";
import { api } from "../src/lib/api";
import { useSession } from "../src/lib/session";
import { colors, spacing } from "../src/theme/theme";

const LAST_GUILD = "babel.lastGuild";

export default function Home() {
  const { user, profile, signOut } = useSession();
  const router = useRouter();
  const [lastGuild, setLastGuild] = useState<{ id: string; name: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const raw = await AsyncStorage.getItem(LAST_GUILD);
        if (!raw) return setLastGuild(null);
        const saved = JSON.parse(raw);
        try {
          const { guild } = await api.getGuild(saved.id);
          setLastGuild({ id: guild.id, name: guild.name });
        } catch {
          setLastGuild(null);
        }
      })();
    }, [])
  );

  const tasteCount =
    (profile?.favorite_books?.length ?? 0) +
    (profile?.favorite_movies?.length ?? 0) +
    (profile?.favorite_games?.length ?? 0) +
    (profile?.hobbies?.length ?? 0) +
    (profile?.interests?.length ?? 0);

  return (
    <Screen>
      <Title>Goodnight, {user?.display_name} 🌙</Title>
      <Body dim style={{ marginBottom: spacing.lg }}>
        Start a new month-long story with friends, or join one with an invite code.
      </Body>

      {lastGuild ? (
        <Card>
          <Pill text="Continue" tone="accent" />
          <Heading>{lastGuild.name}</Heading>
          <Button title="Open story" onPress={() => router.push(`/guild/${lastGuild.id}`)} />
        </Card>
      ) : null}

      <Card>
        <Heading>Start a guild</Heading>
        <Body dim>Pick your vibe and invite 1-3 friends. You become the first character.</Body>
        <View style={{ height: spacing.sm }} />
        <Button title="Create a new story" onPress={() => router.push("/guild/create")} />
      </Card>

      <Card>
        <Heading>Join friends</Heading>
        <Body dim>Got a 6-letter invite code from a friend? Hop into their guild.</Body>
        <View style={{ height: spacing.sm }} />
        <Button title="Enter invite code" variant="ghost" onPress={() => router.push("/guild/join")} />
      </Card>

      <Pressable onPress={() => router.push("/onboarding")} style={{ marginTop: spacing.md }}>
        <Caption style={{ color: colors.primary }}>
          Edit reading profile{tasteCount ? ` (${tasteCount} tastes)` : " — add your favorites"}
        </Caption>
      </Pressable>
      <Pressable
        onPress={async () => {
          await signOut();
          router.replace("/");
        }}
        style={{ marginTop: spacing.md }}
      >
        <Caption>Sign out</Caption>
      </Pressable>
    </Screen>
  );
}
