import { useState } from "react";
import { Pressable, View } from "react-native";
import { Guild } from "../lib/api";
import { colors, font, radius, spacing } from "../theme/theme";
import { Body, Button, Caption, Card, Heading, Pill } from "./ui";

export function StoryNight({
  guild,
  meId,
  onSubmit,
  onAdvance,
  submitting,
  advancing,
}: {
  guild: Guild;
  meId: string;
  onSubmit: (optionId: string, customText?: string) => void;
  onAdvance: () => void;
  submitting: boolean;
  advancing: boolean;
}) {
  const chapter = guild.current_chapter!;
  const myChoice = chapter.choices.find((c) => c.user_id === meId);
  const myMember = guild.members.find((m) => m.user_id === meId);
  const [picked, setPicked] = useState<string | null>(null);
  const [narrating, setNarrating] = useState(false);

  const submittedCount = chapter.choices.filter((c) => c.submitted_at).length;
  const everyone = chapter.choices.length;
  const allIn = submittedCount === everyone && everyone > 0;
  const iSubmitted = !!myChoice?.submitted_at;

  return (
    <View>
      <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm, flexWrap: "wrap" }}>
        <Pill text={`Night ${chapter.idx + 1}`} tone="accent" />
        {guild.story_bible?.setting ? <Pill text={guild.story_bible.setting} /> : null}
        {myMember?.character?.role ? <Pill text={`You: ${myMember.character.role}`} /> : null}
      </View>

      <Heading>{chapter.title}</Heading>

      <Pressable onPress={() => setNarrating((v) => !v)} style={styles.audioBtn}>
        <Body style={{ color: colors.primary, fontWeight: "700" }}>
          {narrating ? "❚❚  Narrating… (preview)" : "▶  Listen (audio coming soon)"}
        </Body>
      </Pressable>

      <Card>
        {chapter.shared_text.split("\n").filter(Boolean).map((para, i) => (
          <Body key={i} style={{ fontSize: font.reading, lineHeight: 30, marginBottom: spacing.sm }}>
            {para}
          </Body>
        ))}
      </Card>

      <Heading>Your move</Heading>
      {myChoice ? (
        <>
          <Body dim style={{ marginBottom: spacing.sm }}>{myChoice.prompt}</Body>
          {myChoice.options.map((opt) => {
            const isPicked = (iSubmitted ? myChoice.selected_option : picked) === opt.id;
            return (
              <Pressable key={opt.id} disabled={iSubmitted} onPress={() => setPicked(opt.id)}>
                <View
                  style={[
                    styles.option,
                    isPicked && { borderColor: colors.primary, backgroundColor: "rgba(139,123,240,0.12)" },
                  ]}
                >
                  <Body style={{ fontWeight: "700", color: isPicked ? colors.primary : colors.text }}>{opt.label}</Body>
                  {opt.hint ? <Caption style={{ marginTop: 2 }}>{opt.hint}</Caption> : null}
                </View>
              </Pressable>
            );
          })}
          {iSubmitted ? (
            <Pill text="Choice locked in for tonight ✓" tone="success" />
          ) : (
            <Button
              title="Lock in my choice"
              onPress={() => picked && onSubmit(picked)}
              disabled={!picked}
              loading={submitting}
              style={{ marginTop: spacing.sm }}
            />
          )}
        </>
      ) : (
        <Caption>No decision for you this chapter — sit tight.</Caption>
      )}

      <View style={{ height: spacing.lg }} />
      <Heading>Around the campfire</Heading>
      <Caption style={{ marginBottom: spacing.sm }}>
        {submittedCount}/{everyone} friends have decided tonight
      </Caption>
      {guild.members.map((m) => {
        const c = chapter.choices.find((ch) => ch.user_id === m.user_id);
        const done = !!c?.submitted_at;
        return (
          <View key={m.user_id} style={styles.waitRow}>
            <Body style={{ flex: 1 }}>
              {m.character?.name ?? m.display_name}
              {m.user_id === meId ? " (you)" : ""}
            </Body>
            {done ? (
              <Pill text={c?.auto_filled ? "auto ✓" : "decided ✓"} tone="success" />
            ) : (
              <Caption style={{ color: colors.accent }}>deciding…</Caption>
            )}
          </View>
        );
      })}

      <View style={{ height: spacing.lg }} />
      <Button
        title={allIn ? "Advance to tomorrow night" : "Advance the night (auto-fills the rest)"}
        onPress={onAdvance}
        loading={advancing}
        variant={allIn ? "accent" : "ghost"}
      />
      <Caption style={{ textAlign: "center", marginTop: spacing.sm }}>
        Demo fast-forward. In production this releases automatically at {guild.release_time}.
      </Caption>
    </View>
  );
}

const styles = {
  audioBtn: {
    alignSelf: "flex-start" as const,
    marginBottom: spacing.sm,
    paddingVertical: 6,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  waitRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
};
