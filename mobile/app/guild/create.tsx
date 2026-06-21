import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Body, Button, Caption, Card, Field, Heading, Screen } from "../../src/components/ui";
import { api, Archetype } from "../../src/lib/api";
import { useSession } from "../../src/lib/session";
import { colors, font, radius, spacing } from "../../src/theme/theme";

function Stepper({ value, min, max, onChange, suffix }: { value: number; min: number; max: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.sm }}>
      <Pressable onPress={() => onChange(Math.max(min, value - 1))} style={stepBtn}>
        <Body>−</Body>
      </Pressable>
      <Body style={{ fontSize: font.heading, fontWeight: "700", minWidth: 90, textAlign: "center" }}>
        {value} {suffix}
      </Body>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))} style={stepBtn}>
        <Body>+</Body>
      </Pressable>
    </View>
  );
}
const stepBtn = {
  width: 44,
  height: 44,
  borderRadius: radius.pill,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  backgroundColor: colors.bgElevated,
  borderWidth: 1,
  borderColor: colors.cardBorder,
};

export default function CreateGuild() {
  const { user } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [players, setPlayers] = useState(2);
  const [pages, setPages] = useState(2);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.archetypes().then((r) => setArchetypes(r.archetypes)).catch(() => {});
  }, []);

  const create = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const { guild } = await api.createGuild({
        name: name.trim() || "Our Story",
        player_count: players,
        pages_per_night: pages,
        archetype: selected,
        created_by: user.id,
      });
      await AsyncStorage.setItem("babel.lastGuild", JSON.stringify({ id: guild.id, name: guild.name }));
      router.replace(`/guild/${guild.id}`);
    } catch (e: any) {
      setError(e.message ?? "Could not create guild");
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Field label="Guild / story name" placeholder="The Long-Distance Few" value={name} onChangeText={setName} />

      <Card>
        <Heading>Players</Heading>
        <Body dim>How many friends, including you? This also sets the nightly reading length, so everyone stays in sync.</Body>
        <Stepper value={players} min={2} max={4} onChange={setPlayers} suffix={players === 1 ? "player" : "players"} />
      </Card>

      <Card>
        <Heading>Pages per night</Heading>
        <Body dim>Each chapter is about this long. Short keeps the guild aligned for the next day's chat.</Body>
        <Stepper value={pages} min={1} max={6} onChange={setPages} suffix={pages === 1 ? "page" : "pages"} />
      </Card>

      <Heading>Vibe</Heading>
      <Body dim style={{ marginBottom: spacing.sm }}>
        Pick a setting, or leave it to Babel — it'll choose one from everyone's tastes.
      </Body>
      {archetypes.map((a) => {
        const active = selected === a.id;
        return (
          <Pressable key={a.id} onPress={() => setSelected(active ? null : a.id)}>
            <View
              style={{
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.cardBorder,
                backgroundColor: active ? "rgba(139,123,240,0.12)" : colors.card,
                borderRadius: radius.md,
                padding: spacing.md,
                marginBottom: spacing.sm,
              }}
            >
              <Body style={{ fontWeight: "700", color: active ? colors.primary : colors.text }}>{a.name}</Body>
              <Caption style={{ marginTop: 2 }}>{a.blurb}</Caption>
            </View>
          </Pressable>
        );
      })}

      {error ? <Caption style={{ color: colors.danger, marginVertical: spacing.sm }}>{error}</Caption> : null}
      <Button title="Create guild" onPress={create} loading={busy} style={{ marginTop: spacing.md }} />
    </Screen>
  );
}
