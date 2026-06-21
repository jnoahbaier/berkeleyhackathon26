import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "../../src/components/ds";
import { Avatar, Body, Button, Caption, Card, Label, Loading } from "../../src/components/ui";
import { useSession } from "../../src/lib/session";
import { useCurrentGuild } from "../../src/lib/useCurrentGuild";
import { colors, fonts, guildSeats, shadow, space, text as type } from "../../src/theme/theme";

const HEARTH_PLACEHOLDER = [
  { who: "Mara", seat: 1 as const, text: "i am NOT letting the gate have the lantern, are you insane" },
  { who: "Kai", seat: 4 as const, text: "whoever picks betrayal we are no longer friends" },
  { who: "Iris", seat: 3 as const, text: "river. trust me. (i read ahead. i didn't. but trust me.)" },
];

export default function GuildTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const { guild, loading } = useCurrentGuild();

  if (loading) return <Loading label="Finding your friends…" />;

  if (!guild) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgApp, paddingTop: insets.top + 66, paddingHorizontal: space[6] }}>
        <Text style={[type.label, { marginBottom: space[3] }]}>Your friends</Text>
        <Text style={type.h1}>No tale yet</Text>
        <Body dim style={{ marginTop: space[3], marginBottom: space[7] }}>
          Create a tale or join friends with an invite code to gather your friends here.
        </Body>
        <Button title="Create a new tale" onPress={() => router.push("/guild/create")} size="lg" />
        <View style={{ height: space[4] }} />
        <Button title="Enter invite code" variant="secondary" onPress={() => router.push("/guild/join")} size="lg" />
      </View>
    );
  }

  const night = guild.current_chapter ? guild.current_chapter.idx + 1 : 1;
  const taleTitle = guild.story_bible?.title ?? guild.name;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: insets.top + 66, paddingHorizontal: space[6], paddingBottom: space[5] }}>
          <Text style={[type.label, { marginBottom: space[3] }]}>Your friends</Text>
          <Text style={type.h1}>{guild.name}</Text>
          <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14.5, color: colors.textSecondary, marginTop: space[2] }}>
            Reading <Text style={{ fontFamily: fonts.sans.semibold, color: colors.textBody }}>{taleTitle}</Text>
            {guild.status === "active" ? ` · Night ${night} of 30` : " · in the lobby"}
          </Text>
        </View>

        <View style={{ paddingHorizontal: space[5], gap: space[5] }}>
          <Card elevation="sm" pad={6}>
            {guild.members.map((m, i) => {
              const seat = ((i % 4) + 1) as 1 | 2 | 3 | 4;
              const isYou = m.user_id === user?.id;
              const displayName = isYou ? "You" : m.character?.name ?? m.display_name;
              const role = m.character?.role ?? "Awaiting a character";
              return (
                <View
                  key={m.user_id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: space[4],
                    paddingVertical: space[4],
                    paddingHorizontal: space[4],
                    borderBottomWidth: i < guild.members.length - 1 ? 1 : 0,
                    borderBottomColor: colors.borderHairline,
                  }}
                >
                  <Avatar name={displayName} seat={seat} size={46} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.sans.bold, fontSize: 16, color: colors.textStrong }}>{displayName}</Text>
                    <Text style={{ fontFamily: fonts.serif.italic, fontSize: 14.5, color: colors.textSecondary, marginTop: 1 }}>
                      {role}
                    </Text>
                  </View>
                  {isYou ? <Badge tone="brand">You</Badge> : null}
                </View>
              );
            })}
          </Card>

          <View>
            <Text style={[type.label, { marginHorizontal: space[2], marginBottom: space[4] }]}>The Hearth</Text>
            <View style={{ gap: space[4] }}>
              {HEARTH_PLACEHOLDER.map((m, i) => (
                <View key={i} style={{ flexDirection: "row", gap: space[3], alignItems: "flex-end" }}>
                  <Avatar name={m.who} seat={m.seat} size={30} />
                  <View
                    style={{
                      backgroundColor: colors.surfaceCard,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      borderBottomRightRadius: 18,
                      borderBottomLeftRadius: 6,
                      paddingVertical: 10,
                      paddingHorizontal: space[4],
                      maxWidth: 270,
                      ...shadow.sm,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.sans.bold, fontSize: 11, color: guildSeats[m.seat - 1].solid, marginBottom: 2 }}>
                      {m.who}
                    </Text>
                    <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14.5, lineHeight: 20, color: colors.textBody }}>
                      {m.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Caption style={{ marginTop: space[4], marginHorizontal: space[2] }}>
              Friends chat is a preview — messages will sync live in a future release.
            </Caption>
          </View>

          {guild.status !== "lobby" ? (
            <Button title="Open tonight's chapter" variant="accent" size="lg" onPress={() => router.push(`/guild/${guild.id}`)} />
          ) : (
            <Button title="Enter the lobby" size="lg" onPress={() => router.push(`/guild/${guild.id}`)} />
          )}

          <View style={{ borderTopWidth: 1, borderTopColor: colors.borderHairline, paddingTop: space[5], gap: space[4] }}>
            <Text style={type.label}>More friend groups</Text>
            <Button title="Create a new tale" variant="secondary" size="md" onPress={() => router.push("/guild/create")} />
            <Button title="Enter invite code" variant="ghost" size="md" onPress={() => router.push("/guild/join")} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
