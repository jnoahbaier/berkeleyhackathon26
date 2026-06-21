import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Body, Caption, Card, Label, Loading, Pill, Reading, Screen, Title } from "../../../src/components/ui";
import { api, Chapter } from "../../../src/lib/api";
import { colors, space, text as type } from "../../../src/theme/theme";

export default function Timeline() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  useEffect(() => {
    if (id) api.getChapters(id).then((r) => setChapters(r.chapters)).catch(() => setChapters([]));
  }, [id]);

  if (!chapters) return <Loading label="Recalling the tale…" />;

  return (
    <Screen>
      <Label style={{ marginBottom: space[3] }}>The story so far</Label>
      <Title style={{ marginBottom: space[3] }}>How you got here</Title>
      <Reading style={{ marginBottom: space[7] }}>
        Every chapter, and the choices that bent the story.
      </Reading>

      <View style={{ gap: space[4] }}>
        {chapters.map((ch) => {
          const decided = ch.choices.filter((c) => c.submitted_at);
          return (
            <Card key={ch.id}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space[3] }}>
                <Label>Night {ch.idx + 1}</Label>
                {ch.status === "resolved" ? (
                  <Pill text="resolved" tone="success" />
                ) : (
                  <Pill text="tonight" tone="accent" />
                )}
              </View>
              <Text style={[type.serifDisplay, { marginBottom: space[2] }]}>{ch.title}</Text>
              <Reading style={{ color: colors.textBody }}>
                {ch.shared_text.replace(/\n+/g, " ").slice(0, 200)}
                {ch.shared_text.length > 200 ? "…" : ""}
              </Reading>

              {decided.length > 0 && (
                <View style={{ marginTop: space[5], borderTopWidth: 1, borderTopColor: colors.borderHairline, paddingTop: space[4], gap: space[2] }}>
                  {decided.map((c) => {
                    const opt = c.options.find((o) => o.id === c.selected_option);
                    const label = c.custom_text || opt?.label || "—";
                    return (
                      <Body key={c.id} style={{ fontSize: 14 }}>
                        <Text style={{ fontFamily: type.h4.fontFamily, color: colors.accent }}>
                          {c.character_name ?? "Someone"}
                        </Text>
                        <Text style={{ color: colors.textSecondary }}>
                          {`  ${c.auto_filled ? "(auto) " : ""}${label}`}
                        </Text>
                      </Body>
                    );
                  })}
                </View>
              )}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
