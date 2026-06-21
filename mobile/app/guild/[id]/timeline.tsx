import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Body, Caption, Card, Heading, Loading, Pill, Screen } from "../../../src/components/ui";
import { api, Chapter } from "../../../src/lib/api";
import { colors, font, spacing } from "../../../src/theme/theme";

export default function Timeline() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  useEffect(() => {
    if (id) api.getChapters(id).then((r) => setChapters(r.chapters)).catch(() => setChapters([]));
  }, [id]);

  if (!chapters) return <Loading label="Recalling the tale…" />;

  return (
    <Screen>
      <Heading>How you got here</Heading>
      <Caption style={{ marginBottom: spacing.md }}>
        Every chapter, and the choices that bent the story.
      </Caption>
      {chapters.map((ch) => {
        const decided = ch.choices.filter((c) => c.submitted_at);
        return (
          <Card key={ch.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
              <Pill text={`Night ${ch.idx + 1}`} tone="accent" />
              {ch.status === "resolved" ? <Pill text="resolved" tone="success" /> : <Pill text="tonight" />}
            </View>
            <Body style={{ fontWeight: "700", marginBottom: spacing.xs }}>{ch.title}</Body>
            <Body dim style={{ fontSize: font.small, lineHeight: 20 }}>
              {ch.shared_text.replace(/\n+/g, " ").slice(0, 200)}
              {ch.shared_text.length > 200 ? "…" : ""}
            </Body>

            {decided.length > 0 && (
              <View style={{ marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: spacing.sm }}>
                {decided.map((c) => {
                  const opt = c.options.find((o) => o.id === c.selected_option);
                  const label = c.custom_text || opt?.label || "—";
                  return (
                    <Body key={c.id} style={{ fontSize: font.small, marginBottom: 4 }}>
                      <Body style={{ fontSize: font.small, color: colors.accent }}>{c.character_name ?? "Someone"}</Body>
                      {`  ${c.auto_filled ? "(auto) " : ""}${label}`}
                    </Body>
                  );
                })}
              </View>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}
