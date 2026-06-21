import { LinearGradient } from "expo-linear-gradient";
import { ALargeSmall, Check, ChevronDown, GitFork } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Choice as ChoiceOption, GuildDots, IconButton } from "./ds";
import { Button } from "./ui";
import { Guild } from "../lib/api";
import { colors, fonts, gradients, layout, radius, space, text as type } from "../theme/theme";

const LETTERS = ["A", "B", "C", "D", "E"];

type Phase = "read" | "choose" | "sealed";

export function Reader({
  guild,
  meId,
  visible,
  onClose,
  onSubmit,
  onAdvance,
  submitting,
  advancing,
}: {
  guild: Guild;
  meId: string;
  visible: boolean;
  onClose: () => void;
  onSubmit: (optionId: string) => void;
  onAdvance?: () => void;
  submitting?: boolean;
  advancing?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const chapter = guild.current_chapter!;
  const paras = chapter.shared_text.split("\n").filter(Boolean);
  const night = chapter.idx + 1;
  const myChoice = chapter.choices.find((c) => c.user_id === meId);
  const iSubmitted = !!myChoice?.submitted_at;
  const hasDecision = chapter.decision_type === "individual" || chapter.decision_type === "group";
  const isHost = guild.created_by === meId;

  const [phase, setPhase] = useState<Phase>(iSubmitted ? "sealed" : "read");
  const [picked, setPicked] = useState<string | null>(myChoice?.selected_option ?? null);

  const dots = guild.members.map((m, i) => ({
    name: m.character?.name ?? m.display_name,
    seat: ((i % 4) + 1) as 1 | 2 | 3 | 4,
    done: !!chapter.choices.find((c) => c.user_id === m.user_id && c.submitted_at),
  }));
  const submittedCount = chapter.choices.filter((c) => c.submitted_at).length;

  const seal = async () => {
    if (!picked) return;
    await onSubmit(picked);
    setPhase("sealed");
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.nightBg }}>
        <LinearGradient
          colors={gradients.glow.colors}
          locations={gradients.glow.locations}
          start={gradients.glow.start}
          end={gradients.glow.end}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320, opacity: 0.5 }}
          pointerEvents="none"
        />

        {/* Top bar */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            paddingTop: insets.top + space[4],
            paddingHorizontal: space[5],
            paddingBottom: space[4],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton variant="plain" size="sm" onNight onPress={onClose}>
            <ChevronDown size={20} color={colors.nightText} strokeWidth={1.9} />
          </IconButton>
          <Text style={[type.label, { color: colors.nightMuted }]}>{`Chapter ${night} · Night ${night}`}</Text>
          <IconButton variant="plain" size="sm" onNight>
            <ALargeSmall size={20} color={colors.nightText} strokeWidth={1.9} />
          </IconButton>
        </View>

        {/* Reading column */}
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 108,
            paddingHorizontal: 26,
            paddingBottom: 220,
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[type.label, { color: colors.accentHover, textAlign: "center", marginBottom: space[5] }]}>
            {`· ${chapter.title} ·`}
          </Text>
          {paras.map((para, i) => (
            <View key={i} style={{ maxWidth: layout.readerMeasure, width: "100%", marginBottom: 22 }}>
              {i === 0 ? (
                <Text style={{ fontFamily: fonts.serif.regular, fontSize: 20, lineHeight: 36, color: colors.nightText }}>
                  <Text
                    style={{
                      fontFamily: fonts.serif.semibold,
                      fontSize: 58,
                      lineHeight: 50,
                      color: colors.accent,
                    }}
                  >
                    {para[0]}
                  </Text>
                  {para.slice(1)}
                </Text>
              ) : (
                <Text style={{ fontFamily: fonts.serif.regular, fontSize: 20, lineHeight: 36, color: colors.nightText }}>
                  {para}
                </Text>
              )}
            </View>
          ))}
          {hasDecision ? (
            <Text style={[type.label, { color: colors.nightMuted, textAlign: "center", marginTop: space[3] }]}>
              — your word is needed —
            </Text>
          ) : null}
        </ScrollView>

        {/* Phase 1 — read CTA */}
        {phase === "read" && hasDecision && !iSubmitted ? (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: space[9],
              paddingBottom: insets.bottom + space[7],
              paddingHorizontal: space[6],
            }}
          >
            <LinearGradient
              colors={["rgba(19,17,32,0)", colors.nightBg]}
              style={{ ...{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } }}
              pointerEvents="none"
            />
            <Button
              variant="accent"
              size="lg"
              full
              title="The night forks — choose"
              onPress={() => setPhase("choose")}
              iconLeft={<GitFork size={19} color={colors.textOnAccent} strokeWidth={2} />}
            />
          </View>
        ) : null}

        {/* Phase 2 & 3 — choice sheet */}
        {(phase === "choose" || phase === "sealed") && hasDecision ? (
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, justifyContent: "flex-end" }}>
            <Pressable style={{ flex: 1 }} onPress={() => phase === "choose" && setPhase("read")} />
            <View
              style={{
                backgroundColor: colors.nightRaised,
                borderTopLeftRadius: radius.x2l,
                borderTopRightRadius: radius.x2l,
                borderTopWidth: 1,
                borderTopColor: colors.nightBorder,
                paddingTop: space[4],
                paddingHorizontal: space[5],
                paddingBottom: insets.bottom + space[7],
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 5,
                  borderRadius: radius.pill,
                  backgroundColor: colors.nightBorder,
                  alignSelf: "center",
                  marginBottom: space[5],
                }}
              />
              {phase === "choose" && myChoice ? (
                <>
                  <Text style={{ fontFamily: fonts.serif.semibold, fontSize: 22, color: colors.nightText, marginBottom: space[2] }}>
                    {myChoice.prompt}
                  </Text>
                  <Text style={[type.label, { color: colors.nightMuted, marginBottom: space[5] }]}>
                    {`Your word locks at ${guild.release_time}`}
                  </Text>
                  <View style={{ gap: space[3], marginBottom: space[5] }}>
                    {myChoice.options.map((opt, i) => (
                      <ChoiceOption
                        key={opt.id}
                        letter={LETTERS[i]}
                        flavor={opt.hint?.toLowerCase().includes("betray") ? "betrayal" : "default"}
                        meta={opt.hint ?? undefined}
                        selected={picked === opt.id}
                        onPress={() => setPicked(opt.id)}
                      >
                        {opt.label}
                      </ChoiceOption>
                    ))}
                  </View>
                  <Button
                    variant="accent"
                    size="lg"
                    full
                    title="Seal my word"
                    disabled={!picked}
                    loading={submitting}
                    onPress={seal}
                  />
                </>
              ) : (
                <>
                  <View style={{ alignItems: "center", paddingVertical: space[2] }}>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: colors.accent,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: space[4],
                      }}
                    >
                      <Check size={28} color={colors.textOnAccent} strokeWidth={2.6} />
                    </View>
                    <Text style={{ fontFamily: fonts.serif.semibold, fontSize: 22, color: colors.nightText, marginBottom: space[2] }}>
                      Your word is sealed.
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.serif.regular,
                        fontSize: 16,
                        lineHeight: 24,
                        color: colors.nightSoft,
                        textAlign: "center",
                        maxWidth: 300,
                        marginBottom: space[5],
                      }}
                    >
                      The others have until {guild.release_time}. Tomorrow night, the road answers.
                    </Text>
                  </View>
                  <View style={{ backgroundColor: colors.nightCard, borderRadius: radius.lg, padding: space[5], marginBottom: space[5] }}>
                    <GuildDots members={dots} onNight label={`${submittedCount} of ${guild.members.length} have chosen`} />
                  </View>
                  <Button variant="secondary" onNight size="lg" full title="Goodnight" onPress={onClose} />
                  {isHost && onAdvance ? (
                    <View style={{ marginTop: space[3] }}>
                      <Button
                        variant="ghost"
                        onNight
                        size="lg"
                        full
                        title={`Advance to night ${night + 1}`}
                        loading={advancing}
                        onPress={onAdvance}
                      />
                    </View>
                  ) : null}
                </>
              )}
            </View>
          </View>
        ) : null}

        {/* No decision — quiet close */}
        {!hasDecision ? (
          <View style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + space[7], paddingHorizontal: space[6] }}>
            <Button variant="secondary" onNight size="lg" full title="Goodnight" onPress={onClose} />
            {isHost && onAdvance ? (
              <View style={{ marginTop: space[3] }}>
                <Button variant="ghost" onNight size="lg" full title={`Continue to night ${night + 1}`} loading={advancing} onPress={onAdvance} />
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
