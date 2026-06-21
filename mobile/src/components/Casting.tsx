import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StepHead } from "./SetupParts";
import { Tag } from "./ds";
import { Avatar, Button, Field, SegmentedControl } from "./ui";
import { Guild } from "../lib/api";
import { colors, fonts, gradients, radius, shadow, space } from "../theme/theme";

const TASTES = [
  "The Lord of the Rings",
  "Dune",
  "The Witcher",
  "Studio Ghibli",
  "Disco Elysium",
  "Le Guin",
  "Mistborn",
  "Hollow Knight",
  "Brooklyn 99",
  "Murakami",
];

export function Casting({
  guild,
  meId,
  onClaim,
  onAdvance,
  advancing,
  onBack,
}: {
  guild: Guild;
  meId: string;
  onClaim: (characterId: string) => Promise<void>;
  onAdvance: () => void;
  advancing: boolean;
  onBack?: () => void;
}) {
  const [pickedTastes, setPickedTastes] = useState<string[]>(["The Lord of the Rings", "Disco Elysium", "Studio Ghibli"]);
  const [trait, setTrait] = useState<"loyal" | "cunning" | "reckless">("loyal");
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const myChar = guild.members.find((m) => m.user_id === meId)?.character ?? null;
  const claimedCount = guild.members.filter((m) => m.character).length;
  const everyoneChosen = claimedCount >= guild.members.length;
  const isHost = guild.created_by === meId;

  const toggleTaste = (t: string) =>
    setPickedTastes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const claim = async (id: string) => {
    setClaimingId(id);
    try {
      await onClaim(id);
    } finally {
      setClaimingId(null);
    }
  };

  const traitWord = trait === "loyal" ? "loyal" : trait === "cunning" ? "cunning" : "reckless";

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: space[10] }}>
      <StepHead
        step={2}
        total={2}
        title="Now — who are you, inside it?"
        subtitle="Your favourites quietly shape your character and the world you wake in."
        onBack={onBack}
      />

      <View style={{ gap: space[7] }}>
        <View style={{ flexDirection: "row", gap: space[4], alignItems: "center", backgroundColor: colors.surfaceCard, borderRadius: radius.lg, padding: space[5], ...shadow.sm }}>
          <Avatar name={myChar?.name ?? "You"} seat={2} size={56} />
          <View style={{ flex: 1 }}>
            <Field placeholder="Name your character" value={myChar?.name ?? ""} editable={false} />
          </View>
        </View>

        <View>
          <Text style={{ fontFamily: fonts.sans.bold, fontSize: 15, color: colors.textStrong, marginBottom: space[2] }}>
            Your taste profile
          </Text>
          <Text style={{ fontFamily: fonts.sans.regular, fontSize: 13, color: colors.textMuted, marginBottom: space[4] }}>
            Books, films, games — pick what's yours.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9 }}>
            {TASTES.map((t) => (
              <Tag key={t} selected={pickedTastes.includes(t)} onPress={() => toggleTaste(t)}>
                {t}
              </Tag>
            ))}
          </View>
        </View>

        <View>
          <Text style={{ fontFamily: fonts.sans.bold, fontSize: 15, color: colors.textStrong, marginBottom: space[4] }}>
            At your core, you are…
          </Text>
          <SegmentedControl
            options={[
              { value: "loyal" as const, label: "Loyal" },
              { value: "cunning" as const, label: "Cunning" },
              { value: "reckless" as const, label: "Reckless" },
            ]}
            value={trait}
            onChange={setTrait}
          />
        </View>

        <LinearGradient
          colors={gradients.dusk.colors}
          locations={gradients.dusk.locations}
          start={gradients.dusk.start}
          end={gradients.dusk.end}
          style={{ borderRadius: radius.lg, padding: space[5] }}
        >
          <Text style={{ fontFamily: fonts.mono.medium, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase", color: "rgba(40,32,22,0.6)", marginBottom: space[2] }}>
            Talegate will weave
          </Text>
          <Text style={{ fontFamily: fonts.serif.regular, fontSize: 17, lineHeight: 26, color: colors.textStrong }}>
            A <Text style={{ fontFamily: fonts.serif.semibold }}>{traitWord}</Text> wanderer with a mapmaker's eye and a soft spot for lost things — at home in slow, painted worlds.
          </Text>
        </LinearGradient>

        <View>
          <Text style={{ fontFamily: fonts.sans.bold, fontSize: 15, color: colors.textStrong, marginBottom: space[4] }}>
            Choose who you'll play
          </Text>
          <View style={{ gap: space[3] }}>
            {guild.cast.map((c, i) => {
              const seat = ((i % 4) + 1) as 1 | 2 | 3 | 4;
              const mine = c.user_id === meId;
              const taken = !!c.user_id && !mine;
              return (
                <View
                  key={c.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: space[4],
                    padding: space[4],
                    borderRadius: radius.lg,
                    borderWidth: 1.5,
                    borderColor: mine ? colors.brand : colors.borderHairline,
                    backgroundColor: mine ? colors.brandTint : colors.surfaceCard,
                    opacity: taken ? 0.55 : 1,
                  }}
                >
                  <Avatar name={c.name} seat={seat} active={mine} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.sans.bold, fontSize: 16, color: colors.textStrong }}>{c.name}</Text>
                    <Text style={{ fontFamily: fonts.serif.italic, fontSize: 14.5, color: colors.textSecondary }}>{c.role}</Text>
                  </View>
                  {!taken && !mine ? (
                    <Button title="Claim" size="sm" full={false} onPress={() => claim(c.id)} loading={claimingId === c.id} />
                  ) : mine ? (
                    <Text style={{ fontFamily: fonts.sans.semibold, fontSize: 13, color: colors.brand }}>You</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {isHost ? (
          <Button
            variant="accent"
            size="lg"
            title={everyoneChosen ? "Weave the first chapter" : "Everyone must choose first"}
            onPress={onAdvance}
            loading={advancing}
            disabled={!everyoneChosen}
            iconLeft={<Sparkles size={19} color={colors.textOnAccent} strokeWidth={2} />}
          />
        ) : (
          <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14, color: colors.textMuted, textAlign: "center" }}>
            {everyoneChosen ? "Waiting for the host to weave the first chapter…" : "Pick a character above to join the story."}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
