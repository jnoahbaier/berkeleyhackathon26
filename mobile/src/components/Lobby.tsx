import { View } from "react-native";
import { Guild } from "../lib/api";
import { colors, font, radius, spacing } from "../theme/theme";
import { Avatar, Body, Button, Caption, Card, Heading, Pill } from "./ui";

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
    <View>
      <Card style={{ alignItems: "center" }}>
        <Caption>Invite code — share with your friends</Caption>
        <Body style={{ fontSize: 38, fontWeight: "800", letterSpacing: 8, color: colors.accent, marginTop: spacing.xs }}>
          {guild.invite_code}
        </Body>
      </Card>

      <Heading>The guild ({guild.members.length}/{guild.player_count})</Heading>
      {slots.map((_, i) => {
        const m = guild.members[i];
        if (m) {
          return (
            <Card key={m.user_id} style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Avatar name={m.display_name} active />
              <View style={{ flex: 1 }}>
                <Body style={{ fontWeight: "700" }}>
                  {m.display_name}
                  {m.user_id === meId ? "  (you)" : ""}
                  {m.user_id === guild.created_by ? "  · host" : ""}
                </Body>
                <Caption>
                  {tasteSummary(m) || "no tastes added yet"}
                </Caption>
              </View>
            </Card>
          );
        }
        return (
          <View
            key={`slot-${i}`}
            style={{
              borderWidth: 1,
              borderColor: colors.cardBorder,
              borderStyle: "dashed",
              borderRadius: radius.md,
              padding: spacing.md,
              marginBottom: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View style={{ width: 46, height: 46, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.cardBorder, borderStyle: "dashed" }} />
            <Caption style={{ fontSize: font.body }}>Waiting for a friend…</Caption>
          </View>
        );
      })}

      <View style={{ marginTop: spacing.sm }}>
        {isHost ? (
          <>
            <Button
              title={canStart ? "Begin the story" : "Need at least 2 players"}
              onPress={onStart}
              loading={starting}
              disabled={!canStart}
            />
            {starting ? <Caption style={{ textAlign: "center", marginTop: spacing.sm }}>Weaving your world from everyone's tastes…</Caption> : null}
          </>
        ) : (
          <Pill text="Waiting for the host to begin" tone="accent" />
        )}
      </View>
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
