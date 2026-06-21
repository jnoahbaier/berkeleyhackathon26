import { useRouter } from "expo-router";
import { BookOpen, Headphones, KeyRound, MessageCircle, Settings, Sparkles } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import {
  AvatarStack,
  Badge,
  GuildDots,
  IconButton,
  ProgressTrack,
} from "../../src/components/ds";
import { Body, Button, Caption, Card, GradientHero, Heading, Label } from "../../src/components/ui";
import { Guild } from "../../src/lib/api";
import { useCurrentGuild } from "../../src/lib/useCurrentGuild";
import { colors, fonts, guildSeats, space, text as type } from "../../src/theme/theme";

const TALE_NIGHTS = 30;

function greeting() {
  const h = new Date().getHours();
  return h >= 21 || h < 5 ? "Goodnight." : h >= 17 ? "Good evening." : "Hello.";
}

export default function Tonight() {
  const router = useRouter();
  const { guild, loading } = useCurrentGuild();

  const chapter = guild?.current_chapter ?? null;
  const isActive = guild?.status === "active" && chapter && chapter.decision_type !== "casting";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <GradientHero
          top={
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: space[6] }}>
              <IconButton variant="glass" size="sm" onPress={() => router.push("/settings")}>
                <Settings size={19} color={colors.textStrong} strokeWidth={1.9} />
              </IconButton>
            </View>
          }
          title={
            <Text style={[type.displayLg, { letterSpacing: -0.95, lineHeight: 42 }]}>
              {greeting()}
              {"\n"}
              {guild ? "Your friends are gathering." : "Gather your friends."}
            </Text>
          }
        />

        <View style={{ paddingHorizontal: space[5], marginTop: -space[4], gap: space[5] }}>
          {loading ? (
            <Card elevation="sm">
              <Caption>Waking the library…</Caption>
            </Card>
          ) : !guild ? (
            <EmptyState onCreate={() => router.push("/guild/create")} onJoin={() => router.push("/guild/join")} />
          ) : isActive ? (
            <>
              <TonightChapterCard guild={guild} onRead={() => router.push(`/guild/${guild.id}`)} />
              <GuildCard guild={guild} onOpen={() => router.push("/(tabs)/guild")} />
              <View style={{ flexDirection: "row", gap: space[4] }}>
                <Card elevation="sm" pad={16} interactive onPress={() => router.push(`/guild/${guild.id}`)} style={{ flex: 1 }}>
                  <Headphones size={22} color={colors.brand} strokeWidth={1.9} />
                  <Text style={smallCardTitle}>Listen instead</Text>
                  <Text style={smallCardSub}>{Math.round(guild.pages_per_night * 1.4)} min, narrated</Text>
                </Card>
                <Card elevation="sm" pad={16} interactive onPress={() => router.push("/(tabs)/guild")} style={{ flex: 1 }}>
                  <MessageCircle size={22} color={guildSeats[0].solid} strokeWidth={1.9} />
                  <Text style={smallCardTitle}>The Hearth</Text>
                  <Text style={smallCardSub}>Friends chat</Text>
                </Card>
              </View>
            </>
          ) : (
            <LobbyCard guild={guild} onOpen={() => router.push(`/guild/${guild.id}`)} />
          )}

          {!loading && guild ? (
            <MoreGroups onCreate={() => router.push("/guild/create")} onJoin={() => router.push("/guild/join")} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function TonightChapterCard({ guild, onRead }: { guild: Guild; onRead: () => void }) {
  const ch = guild.current_chapter!;
  const night = ch.idx + 1;
  const teaser = ch.shared_text.split("\n").filter(Boolean)[0] ?? "Tonight the gate is watching.";
  const taleTitle = guild.story_bible?.title ?? guild.name;
  return (
    <Card elevation="lg" pad={20}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space[4] }}>
        <Badge tone="lit" dot>{`Lit · ${guild.release_time}`}</Badge>
        <Text style={[type.label, { letterSpacing: 1.1 }]}>{`${guild.pages_per_night} ${guild.pages_per_night === 1 ? "page" : "pages"}`}</Text>
      </View>
      <Text style={[type.label, { color: colors.accentPressed, marginBottom: space[2] }]}>
        {`Chapter ${night} · ${taleTitle}`}
      </Text>
      <Text style={{ fontFamily: fonts.serif.semibold, fontSize: 25, lineHeight: 30, letterSpacing: -0.25, color: colors.textStrong, marginBottom: space[2] }}>
        {ch.title}
      </Text>
      <Text style={{ fontFamily: fonts.serif.regular, fontSize: 16, lineHeight: 25, color: colors.textSecondary, marginBottom: space[5] }} numberOfLines={3}>
        {teaser}
      </Text>
      <ProgressTrack value={night} total={TALE_NIGHTS} label={taleTitle} />
      <View style={{ height: space[5] }} />
      <Button
        variant="accent"
        size="lg"
        full
        title="Read tonight's chapter"
        onPress={onRead}
        iconLeft={<BookOpen size={19} color={colors.textOnAccent} strokeWidth={2} />}
      />
    </Card>
  );
}

function GuildCard({ guild, onOpen }: { guild: Guild; onOpen: () => void }) {
  const ch = guild.current_chapter;
  const members = guild.members.map((m, i) => ({
    name: m.character?.name ?? m.display_name,
    seat: (((i % 4) + 1) as 1 | 2 | 3 | 4),
    done: !!ch?.choices.find((c) => c.user_id === m.user_id && c.submitted_at),
  }));
  const readingNow = members.length - members.filter((m) => m.done).length;
  return (
    <Card elevation="sm" pad={18} interactive onPress={onOpen}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontFamily: fonts.sans.bold, fontSize: 16, color: colors.textStrong }}>{guild.name}</Text>
          <Text style={{ fontFamily: fonts.sans.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            {`${Math.max(readingNow, 0)} reading now`}
          </Text>
        </View>
        <AvatarStack members={members} size={38} />
      </View>
      <View style={{ height: space[4] }} />
      <View style={{ borderTopWidth: 1, borderTopColor: colors.borderHairline, paddingTop: space[4] }}>
        <GuildDots members={members} />
      </View>
    </Card>
  );
}

function LobbyCard({ guild, onOpen }: { guild: Guild; onOpen: () => void }) {
  return (
    <Card elevation="lg">
      <Label style={{ marginBottom: space[3] }}>your friends are gathering</Label>
      <Heading style={{ marginBottom: space[2] }}>{guild.name}</Heading>
      <Body dim style={{ marginBottom: space[5] }}>
        Friends are still arriving. Step into the lobby to begin the tale when everyone's here.
      </Body>
      <Button
        title="Enter the lobby"
        size="lg"
        onPress={onOpen}
        iconLeft={<Sparkles size={19} color={colors.textOnBrand} strokeWidth={2} />}
      />
    </Card>
  );
}

function MoreGroups({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <Card elevation="sm" pad={18}>
      <Label style={{ marginBottom: space[3] }}>More friend groups</Label>
      <Body dim style={{ marginBottom: space[4] }}>
        You can read with as many groups as you like. Start a new tale or join one with an invite code.
      </Body>
      <Button
        title="Create a new tale"
        size="md"
        onPress={onCreate}
        iconLeft={<Sparkles size={18} color={colors.textOnBrand} strokeWidth={2} />}
      />
      <View style={{ height: space[3] }} />
      <Button
        title="Enter invite code"
        variant="secondary"
        size="md"
        onPress={onJoin}
        iconLeft={<KeyRound size={18} color={colors.textStrong} strokeWidth={2} />}
      />
    </Card>
  );
}

function EmptyState({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <>
      <Card elevation="lg">
        <Label style={{ marginBottom: space[3] }}>Start a tale</Label>
        <Heading style={{ marginBottom: space[2] }}>Gather your friends</Heading>
        <Body dim style={{ marginBottom: space[5] }}>
          Pick a tale and invite 1–3 friends. You become the first character.
        </Body>
        <Button
          title="Create a new tale"
          size="lg"
          onPress={onCreate}
          iconLeft={<Sparkles size={19} color={colors.textOnBrand} strokeWidth={2} />}
        />
      </Card>
      <Card elevation="sm">
        <Label style={{ marginBottom: space[3] }}>Join friends</Label>
        <Heading style={{ marginBottom: space[2] }}>Got an invite code?</Heading>
        <Body dim style={{ marginBottom: space[5] }}>
          Enter the 6-letter code a friend shared to hop into their friend group.
        </Body>
        <Button
          title="Enter invite code"
          variant="secondary"
          size="lg"
          onPress={onJoin}
          iconLeft={<KeyRound size={18} color={colors.textStrong} strokeWidth={2} />}
        />
      </Card>
    </>
  );
}

const smallCardTitle = {
  fontFamily: fonts.sans.semibold,
  fontSize: 14,
  color: colors.textStrong,
  marginTop: space[4],
} as const;
const smallCardSub = {
  fontFamily: fonts.sans.regular,
  fontSize: 12.5,
  color: colors.textMuted,
  marginTop: 2,
} as const;
