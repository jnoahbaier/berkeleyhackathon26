import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Casting } from "../../../src/components/Casting";
import { IconButton } from "../../../src/components/ds";
import { Lobby } from "../../../src/components/Lobby";
import { Reader } from "../../../src/components/Reader";
import { Body, Caption, Loading } from "../../../src/components/ui";
import { api, Guild } from "../../../src/lib/api";
import { useSession } from "../../../src/lib/session";
import { subscribeToGuild } from "../../../src/lib/socket";
import { colors, space } from "../../../src/theme/theme";

export default function GuildScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/tonight");
  };
  const [guild, setGuild] = useState<Guild | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const reloading = useRef(false);

  const reload = useCallback(async () => {
    if (!id || reloading.current) return;
    reloading.current = true;
    try {
      const { guild } = await api.getGuild(id);
      setGuild(guild);
      await AsyncStorage.setItem("babel.lastGuild", JSON.stringify({ id: guild.id, name: guild.name }));
    } catch (e: any) {
      setError(e.message ?? "Could not load your tale");
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
  }, [id, reload]);

  const isCasting = guild?.status === "active" && guild.current_chapter?.decision_type === "casting";
  const isActiveStory = guild?.status === "active" && !isCasting;

  useEffect(() => {
    if (isActiveStory) setReaderOpen(true);
  }, [isActiveStory, guild?.current_chapter?.id]);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgApp, padding: space[6], justifyContent: "center" }}>
        <Body style={{ color: colors.danger }}>{error}</Body>
        <Pressable onPress={reload} style={{ marginTop: space[5] }}>
          <Caption style={{ color: colors.brand }}>Tap to retry</Caption>
        </Pressable>
        <Pressable onPress={goBack} style={{ marginTop: space[4] }}>
          <Caption style={{ color: colors.textMuted }}>Go back</Caption>
        </Pressable>
      </View>
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

  const submit = async (optionId: string) => {
    const chapter = guild?.current_chapter;
    if (!chapter || !user) return;
    setSubmitting(true);
    try {
      await api.submitChoice(chapter.id, { user_id: user.id, selected_option: optionId });
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
      setReaderOpen(true);
    } catch (e: any) {
      setError(e.message ?? "Could not advance");
    } finally {
      setAdvancing(false);
    }
  };

  const claim = async (characterId: string) => {
    if (!user) return;
    try {
      const { guild: g } = await api.claimCharacter(guild.id, user.id, characterId);
      setGuild(g);
    } catch (e: any) {
      setError(e.message ?? "Could not claim that character");
    }
  };

  const title = guild.story_bible?.title ?? guild.name;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <Stack.Screen
        options={{
          title,
          headerShown: false,
        }}
      />

      {guild.status === "lobby" ? (
        <>
          <View style={{ paddingTop: insets.top + space[2], paddingHorizontal: space[5], paddingBottom: space[2] }}>
            <IconButton variant="plain" size="sm" onPress={goBack}>
              <ArrowLeft size={18} color={colors.textStrong} strokeWidth={1.9} />
            </IconButton>
          </View>
          <ScrollView contentContainerStyle={{ padding: space[5], paddingTop: space[3], paddingBottom: space[11] }} showsVerticalScrollIndicator={false}>
            <Lobby guild={guild} meId={user.id} onStart={start} starting={starting} />
          </ScrollView>
        </>
      ) : isCasting ? (
        <Casting guild={guild} meId={user.id} onClaim={claim} onAdvance={advance} advancing={advancing} onBack={goBack} />
      ) : null}

      {isActiveStory && guild.current_chapter ? (
        <Reader
          guild={guild}
          meId={user.id}
          visible={readerOpen}
          onClose={() => {
            setReaderOpen(false);
            router.replace("/(tabs)/tonight");
          }}
          onSubmit={submit}
          onAdvance={advance}
          submitting={submitting}
          advancing={advancing}
        />
      ) : null}
    </View>
  );
}
