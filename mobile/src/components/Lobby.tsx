import { Text, View } from "react-native";
import { Badge } from "./ds";
import { Guild } from "../lib/api";
import { colors, fonts, radius, space, text as type } from "../theme/theme";
import { Avatar, Body, Button, Caption, Card, Label } from "./ui";

export function Lobby({
  guild,
  meId,
  onStart,
  starting,
}: {
  guild: Guild;
  meId: string;
  onStart: () => void;
  starting: boolean;
}) {
  const isHost = guild.created_by === meId;
  const canStart = guild.members.length >= 2;
  const slots = Array.from({ length: guild.player_count });

  return (
    <View style={{ gap: space[5] }}>
      <Card elevation="lg" style={{ alignItems: "center" }}>
        <Label style={{ marginBottom: space[3] }}>Invite code · share it</Label>
        <Text
          style={{
            fontFamily: fonts.mono.semibold,
            fontSize: 40,
            letterSpacing: 10,
            color: colors.accent,
          }}
        >
          {guild.invite_code}
        </Text>
        <Caption style={{ marginTop: space[3] }}>Friends enter this on the join screen.</Caption>
      </Card>

      <Label>{`Your friends · ${guild.members.length} of ${guild.player_count}`}</Label>
      <Card elevation="sm" pad={6}>
        {slots.map((_, i) => {
          const m = guild.members[i];
          const seat = ((i % 4) + 1) as 1 | 2 | 3 | 4;
          if (m) {
            return (
              <View
                key={m.user_id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space[4],
                  paddingVertical: space[4],
                  paddingHorizontal: space[4],
                  borderBottomWidth: i < slots.length - 1 ? 1 : 0,
                  borderBottomColor: colors.borderHairline,
                }}
              >
                <Avatar name={m.display_name} seat={seat} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.sans.bold, fontSize: 16, color: colors.textStrong }}>
                    {m.display_name}
                    {m.user_id === guild.created_by ? " · host" : ""}
                  </Text>
                  <Caption style={{ marginTop: 2 }}>{tasteSummary(m) || "no tastes added yet"}</Caption>
                </View>
                {m.user_id === meId ? <Badge tone="brand">You</Badge> : null}
              </View>
            );
          }
          return (
            <View
              key={`slot-${i}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: space[4],
                paddingVertical: space[4],
                paddingHorizontal: space[4],
                borderBottomWidth: i < slots.length - 1 ? 1 : 0,
                borderBottomColor: colors.borderHairline,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: radius.pill,
                  borderWidth: 1.5,
                  borderColor: colors.borderStrong,
                  borderStyle: "dashed",
                }}
              />
              <Caption style={{ fontSize: 15 }}>Waiting for a friend…</Caption>
            </View>
          );
        })}
      </Card>

      {isHost ? (
        <>
          <Button
            title={canStart ? "Begin the story" : "Need at least 2 players"}
            onPress={onStart}
            loading={starting}
            disabled={!canStart}
            size="lg"
            variant="accent"
          />
          {starting ? (
            <Caption style={{ textAlign: "center" }}>Weaving your world from everyone's tastes…</Caption>
          ) : null}
        </>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Badge tone="lit" dot>Waiting for the host to begin</Badge>
        </View>
      )}
    </View>
  );
}

function tasteSummary(m: Guild["members"][number]): string {
  const p = m.profile;
  if (!p) return "";
  return [...(p.favorite_books ?? []), ...(p.favorite_games ?? []), ...(p.favorite_movies ?? [])]
    .slice(0, 3)
    .join(" · ");
}
