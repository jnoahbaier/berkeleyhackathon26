import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Check, GitFork, Headphones, Pause, Users, Vote } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Choice, Guild } from "../lib/api";
import { colors, fonts, gradients, radius, shadow, space, text as type } from "../theme/theme";
import { Avatar, Body, Button, Caption, Label, Pill } from "./ui";

const LETTERS = ["A", "B", "C", "D", "E"];

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
  const decision = chapter.decision_type;
  const myMember = guild.members.find((m) => m.user_id === meId);
  const isHost = guild.created_by === meId;
  const paras = chapter.shared_text.split("\n").filter(Boolean);
  const [narrating, setNarrating] = useState(false);
  const nextNight = chapter.idx + 2;

  return (
    <View>
      <View style={{ flexDirection: "row", gap: space[3], marginBottom: space[5], flexWrap: "wrap" }}>
        <Pill text={`Night ${chapter.idx + 1}`} tone="accent" />
        {guild.story_bible?.setting ? <Pill text={shortSetting(guild.story_bible.setting)} /> : null}
        {myMember?.character?.role ? <Pill text={`You: ${myMember.character.name}`} tone="brand" /> : null}
      </View>

      {/* Night reading surface — the literary voice */}
      <View style={{ borderRadius: radius.lg, overflow: "hidden", marginBottom: space[6], ...shadow.lg }}>
        <LinearGradient
          colors={gradients.night.colors}
          locations={gradients.night.locations}
          start={gradients.night.start}
          end={gradients.night.end}
          style={{ padding: space[6] }}
        >
          <Text style={[type.label, { color: colors.accentHover, textAlign: "center", marginBottom: space[5] }]}>
            · {chapter.title} ·
          </Text>
          {paras.map((para, i) => (
            <Text
              key={i}
              style={[type.read, { color: colors.nightText, marginBottom: i === paras.length - 1 ? 0 : space[4] }]}
            >
              {para}
            </Text>
          ))}

          <Pressable
            onPress={() => setNarrating((v) => !v)}
            style={{ flexDirection: "row", alignItems: "center", gap: space[3], alignSelf: "flex-start", marginTop: space[6], paddingVertical: space[2] }}
          >
            {narrating ? <Pause size={18} strokeWidth={2} color={colors.accentHover} /> : <Headphones size={18} strokeWidth={2} color={colors.accentHover} />}
            <Text style={{ fontFamily: fonts.sans.semibold, color: colors.accentHover, fontSize: 14 }}>
              {narrating ? "Narrating… (preview)" : "Listen instead"}
            </Text>
          </Pressable>
        </LinearGradient>
      </View>

      {decision === "individual" ? (
        <IndividualDecision guild={guild} meId={meId} onSubmit={onSubmit} submitting={submitting} />
      ) : decision === "group" ? (
        <GroupDecision guild={guild} meId={meId} onSubmit={onSubmit} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], marginBottom: space[4] }}>
          <Pill text="A quiet night" tone="default" />
          <Caption style={{ flex: 1 }}>No decision tonight — just read and rest.</Caption>
        </View>
      )}

      {/* Advance — host drives the night forward */}
      <View style={{ height: space[7] }} />
      {isHost ? (
        <Button
          title={decision === "none" || decision === "casting" ? `Continue to night ${nextNight}` : `Resolve & advance to night ${nextNight}`}
          onPress={onAdvance}
          loading={advancing}
          variant={decision === "none" ? "secondary" : "primary"}
          size="lg"
          iconLeft={
            decision === "none" ? (
              <ArrowRight size={18} strokeWidth={2} color={colors.textStrong} />
            ) : (
              <GitFork size={18} strokeWidth={2} color={colors.textOnBrand} />
            )
          }
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <Pill text="Waiting for the host to turn the page" tone="accent" />
        </View>
      )}
      <Caption style={{ textAlign: "center", marginTop: space[4] }}>
        Demo fast-forward. In production this releases automatically at {guild.release_time}.
      </Caption>
    </View>
  );
}

/* ---- Individual: each player decides for their own character ---- */
function IndividualDecision({
  guild,
  meId,
  onSubmit,
  submitting,
}: {
  guild: Guild;
  meId: string;
  onSubmit: (optionId: string) => void;
  submitting: boolean;
}) {
  const chapter = guild.current_chapter!;
  const myChoice = chapter.choices.find((c) => c.user_id === meId);
  const iSubmitted = !!myChoice?.submitted_at;
  const [picked, setPicked] = useState<string | null>(null);
  const submittedCount = chapter.choices.filter((c) => c.submitted_at).length;

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], marginBottom: space[3] }}>
        <Vote size={18} strokeWidth={2} color={colors.brand} />
        <Label>Your word</Label>
      </View>
      {myChoice ? (
        <>
          <Text style={[type.serifDisplay, { marginBottom: space[1] }]}>{myChoice.prompt}</Text>
          <Caption style={{ marginBottom: space[4] }}>
            {iSubmitted ? "Sealed for tonight." : "Choose — your word locks at release."}
          </Caption>
          <View style={{ gap: space[3], marginBottom: space[5] }}>
            {myChoice.options.map((opt, i) => {
              const isPicked = (iSubmitted ? myChoice.selected_option : picked) === opt.id;
              return (
                <OptionRow
                  key={opt.id}
                  letter={LETTERS[i]}
                  label={opt.label}
                  hint={opt.hint}
                  selected={isPicked}
                  dim={iSubmitted && !isPicked}
                  disabled={iSubmitted}
                  onPress={() => setPicked(opt.id)}
                />
              );
            })}
          </View>
          {iSubmitted ? (
            <View style={{ alignItems: "center", marginBottom: space[2] }}>
              <Pill text="Your word is sealed ✓" tone="success" />
            </View>
          ) : (
            <Button
              title="Seal my word"
              onPress={() => picked && onSubmit(picked)}
              disabled={!picked}
              loading={submitting}
              variant="accent"
              size="lg"
              iconLeft={<Check size={19} strokeWidth={2.4} color={colors.textOnAccent} />}
            />
          )}
        </>
      ) : (
        <Caption>No decision for you this chapter — sit tight.</Caption>
      )}

      <View style={{ height: space[7] }} />
      <Roster guild={guild} meId={meId} caption={`${submittedCount} of ${chapter.choices.length} chose`} />
    </View>
  );
}

/* ---- Group: the whole guild votes on one dilemma ---- */
function GroupDecision({
  guild,
  meId,
  onSubmit,
}: {
  guild: Guild;
  meId: string;
  onSubmit: (optionId: string) => void;
}) {
  const chapter = guild.current_chapter!;
  const myVote = chapter.choices.find((c) => c.user_id === meId);
  const options = myVote?.options ?? chapter.choices[0]?.options ?? [];
  const prompt = myVote?.prompt ?? chapter.choices[0]?.prompt ?? "Your friends must decide.";
  const votedCount = chapter.choices.filter((c) => c.submitted_at).length;

  const tally = (optId: string) =>
    chapter.choices.filter((c) => c.submitted_at && c.selected_option === optId).length;

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], marginBottom: space[3] }}>
        <Users size={18} strokeWidth={2} color={colors.brand} />
        <Label>A group decision · vote together</Label>
      </View>
      <Text style={[type.serifDisplay, { marginBottom: space[1] }]}>{prompt}</Text>
      <Caption style={{ marginBottom: space[4] }}>
        Majority wins. Tap to vote — you can change it until the host advances.
      </Caption>
      <View style={{ gap: space[3], marginBottom: space[5] }}>
        {options.map((opt, i) => {
          const count = tally(opt.id);
          const mine = myVote?.selected_option === opt.id && !!myVote?.submitted_at;
          return (
            <OptionRow
              key={opt.id}
              letter={LETTERS[i]}
              label={opt.label}
              hint={opt.hint}
              selected={mine}
              trailing={count > 0 ? `${count}` : undefined}
              onPress={() => onSubmit(opt.id)}
            />
          );
        })}
      </View>
      <Roster guild={guild} meId={meId} caption={`${votedCount} of ${chapter.choices.length} voted`} showVote />
    </View>
  );
}

/* ---- Shared bits ---- */
function OptionRow({
  letter,
  label,
  hint,
  selected,
  dim,
  disabled,
  trailing,
  onPress,
}: {
  letter?: string;
  label: string;
  hint?: string | null;
  selected?: boolean;
  dim?: boolean;
  disabled?: boolean;
  trailing?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space[4],
          borderWidth: 1,
          borderColor: selected ? colors.brand : colors.borderHairline,
          backgroundColor: selected ? colors.brandTint : colors.surfaceCard,
          borderRadius: radius.md,
          padding: space[5],
          opacity: dim ? 0.5 : 1,
          ...(selected ? shadow.none : shadow.xs),
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.pill,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected ? colors.brand : colors.surfaceSunk,
          }}
        >
          <Text style={{ fontFamily: fonts.mono.semibold, fontSize: 13, color: selected ? colors.textOnBrand : colors.textSecondary }}>
            {trailing ?? letter ?? "•"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.h4, { color: selected ? colors.brand : colors.textStrong }]}>{label}</Text>
          {hint ? <Caption style={{ marginTop: 2 }}>{hint}</Caption> : null}
        </View>
      </View>
    </Pressable>
  );
}

function Roster({
  guild,
  meId,
  caption,
  showVote,
}: {
  guild: Guild;
  meId: string;
  caption: string;
  showVote?: boolean;
}) {
  const chapter = guild.current_chapter!;
  return (
    <View>
      <Label style={{ marginBottom: space[2] }}>Your friends · {caption}</Label>
      {guild.members.map((m, i) => {
        const c = chapter.choices.find((ch) => ch.user_id === m.user_id);
        const done = !!c?.submitted_at;
        const seat = ((i % 4) + 1) as 1 | 2 | 3 | 4;
        const votedOpt = showVote && done ? c?.options.find((o) => o.id === c.selected_option) : null;
        return (
          <View
            key={m.user_id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space[4],
              paddingVertical: space[3],
              borderBottomWidth: i < guild.members.length - 1 ? 1 : 0,
              borderBottomColor: colors.borderHairline,
            }}
          >
            <Avatar name={m.character?.name ?? m.display_name} seat={seat} size={36} active={done} />
            <View style={{ flex: 1 }}>
              <Body>
                {m.character?.name ?? m.display_name}
                {m.user_id === meId ? " (you)" : ""}
              </Body>
              {votedOpt ? <Caption>voted: {votedOpt.label}</Caption> : null}
            </View>
            {done ? (
              <Pill text={c?.auto_filled ? "auto ✓" : showVote ? "voted ✓" : "chose ✓"} tone="success" />
            ) : (
              <Caption style={{ color: colors.accent }}>{showVote ? "deciding…" : "deciding…"}</Caption>
            )}
          </View>
        );
      })}
    </View>
  );
}

function shortSetting(setting: string): string {
  const head = setting.split(/[—-]/)[0].trim();
  return head.length > 28 ? head.slice(0, 27) + "…" : head;
}
