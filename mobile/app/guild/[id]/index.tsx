import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lobby } from "../../../src/components/Lobby";
import { StoryNight } from "../../../src/components/StoryNight";
import { Body, Caption, Loading, Screen } from "../../../src/components/ui";
import { api, Guild } from "../../../src/lib/api";
import { useSession } from "../../../src/lib/session";
import { subscribeToGuild } from "../../../src/lib/socket";
import { colors, spacing } from "../../../src/theme/theme";

export default function GuildScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const router = useRouter();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const reloading = useRef(false);

  const reload = useCallback(async () => {
    if (!id || reloading.current) return;
    reloading.current = true;
    try {
      const { guild } = await api.getGuild(id);
      setGuild(guild);
      await AsyncStorage.setItem("babel.lastGuild", JSON.stringify({ id: guild.id, name: guild.name }));
    } catch (e: any) {
      setError(e.message ?? "Could not load guild");
    } finally {
      reloading.current = false;
    }
  }, [id]);

  useEffect(() => {
    reload();
    if (!id) return;
    const unsub = subscribeToGuild(id, {
      onGuildUpdate: () => reload(),
      onChapterNew: () => reload(),
      onChoiceUpdate: () => reload(),
    });
    return unsub;
  }, [id]);

  if (error) {
    return (
      <Screen>
        <Body style={{ color: colors.danger }}>{error}</Body>
        <Pressable onPress={reload} style={{ marginTop: spacing.md }}>
          <Caption style={{ color: colors.primary }}>Tap to retry</Caption>
        </Pressable>
      </Screen>
    );
  }
  if (!guild || !user) return <Loading label="Opening the story…" />;

  const start = async () => {
    setStarting(true);
    try {
      const { guild: g } = await api.startStory(guild.id);
      setGuild(g);
    } catch (e: any) {
      setError(e.message ?? "Could not start");
    } finally {
      setStarting(false);
    }
  };

  const submit = async (optionId: string, customText?: string) => {
    const chapter = guild?.current_chapter;
    if (!chapter || !user) return;
    setSubmitting(true);
    try {
      await api.submitChoice(chapter.id, { user_id: user.id, selected_option: optionId, custom_text: customText });
      await reload();
    } catch (e: any) {
      setError(e.message ?? "Could not submit");
    } finally {
      setSubmitting(false);
    }
  };

  const advance = async () => {
    setAdvancing(true);
    try {
      const { guild: g } = await api.advance(guild.id);
      setGuild(g);
    } catch (e: any) {
      setError(e.message ?? "Could not advance");
    } finally {
      setAdvancing(false);
    }
  };

  const title = guild.story_bible?.title ?? guild.name;

  return (
    <Screen>
      <Stack.Screen
        options={{
          title,
          headerRight: () =>
            guild.status === "active" ? (
              <Pressable onPress={() => router.push(`/guild/${guild.id}/timeline`)}>
                <Caption style={{ color: colors.primary, fontWeight: "700" }}>Story so far</Caption>
              </Pressable>
            ) : null,
        }}
      />
      {guild.status === "lobby" ? (
        <Lobby guild={guild} meId={user.id} onStart={start} starting={starting} />
      ) : (
        <StoryNight
          guild={guild}
          meId={user.id}
          onSubmit={submit}
          onAdvance={advance}
          submitting={submitting}
          advancing={advancing}
        />
      )}
    </Screen>
  );
}
