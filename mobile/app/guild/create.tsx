import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Plus, Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StepHead, FormRow } from "../../src/components/SetupParts";
import { Avatar, Button, Caption, Field, SegmentedControl } from "../../src/components/ui";
import { Stepper, StoryCover, type CoverGenre } from "../../src/components/ds";
import { api, Chronicle } from "../../src/lib/api";
import { useSession } from "../../src/lib/session";
import { colors, fonts, space } from "../../src/theme/theme";

/** Map a chronicle's tone to a book-cover genre (mirrors the Shelf). */
function chronicleGenre(c: Chronicle): CoverGenre {
  const t = c.tone.toLowerCase();
  if (t.includes("space") || t.includes("sci")) return "scifi";
  if (t.includes("cosy") || t.includes("cozy")) return "cosy";
  if (t.includes("noir")) return "noir";
  if (t.includes("horror") || t.includes("dread")) return "horror";
  if (t.includes("myth")) return "myth";
  return "medieval";
}

export default function CreateGuild() {
  const { user } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [players, setPlayers] = useState(4);
  const [pages, setPages] = useState(8);
  const [mode, setMode] = useState<"read" | "listen">("read");
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedChronicle = chronicles.find((c) => c.id === selected) ?? null;

  useEffect(() => {
    api
      .chronicles()
      .then((r) => {
        setChronicles(r.chronicles);
        setSelected((s) => s ?? r.chronicles[0]?.id ?? null);
      })
      .catch(() => {});
  }, []);

  const create = async () => {
    if (!user || !selected) return;
    setBusy(true);
    setError(null);
    try {
      const { guild } = await api.createGuild({
        name: name.trim() || "The Night Owls",
        player_count: players,
        pages_per_night: Math.min(6, Math.max(1, pages)),
        chronicle_id: selected,
        created_by: user.id,
      });
      await AsyncStorage.setItem("babel.lastGuild", JSON.stringify({ id: guild.id, name: guild.name }));
      router.replace(`/guild/${guild.id}`);
    } catch (e: any) {
      setError(e.message ?? "Could not start your tale");
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <ScrollView contentContainerStyle={{ paddingBottom: space[11] }} showsVerticalScrollIndicator={false}>
        <StepHead
          step={1}
          total={2}
          title="Set the terms of your tale."
          subtitle="These keep four friends on the same page — literally."
          onBack={() => router.back()}
        />

        <View style={{ paddingHorizontal: space[5], gap: space[7] }}>
          <View>
            <Text style={{ fontFamily: fonts.sans.bold, fontSize: 15, color: colors.textStrong, marginBottom: space[4] }}>
              Gather your friends
            </Text>
            <View style={{ flexDirection: "row", gap: space[4], alignItems: "center" }}>
              {user ? (
                <View style={{ alignItems: "center" }}>
                  <Avatar name={user.display_name} seat={2} size={50} />
                  <Text style={{ fontFamily: fonts.sans.regular, fontSize: 11.5, color: colors.textSecondary, marginTop: 6, maxWidth: 56 }} numberOfLines={1}>
                    {user.display_name.split(" ")[0]}
                  </Text>
                </View>
              ) : null}
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 1.5,
                    borderStyle: "dashed",
                    borderColor: colors.borderStrong,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={22} color={colors.textMuted} strokeWidth={1.9} />
                </View>
                <Text style={{ fontFamily: fonts.sans.regular, fontSize: 11.5, color: colors.textMuted, marginTop: 6 }}>
                  Invite
                </Text>
              </View>
            </View>
          </View>

          <FormRow label="Pages per night" sublabel="Everyone reads the same beat. No one falls behind.">
            <Stepper value={pages} min={4} max={14} suffix="pages" onChange={setPages} />
          </FormRow>

          <FormRow label="Players" sublabel="One character each.">
            <Stepper value={players} min={2} max={4} onChange={setPlayers} />
          </FormRow>

          <View>
            <Text style={{ fontFamily: fonts.sans.bold, fontSize: 15, color: colors.textStrong, marginBottom: space[4] }}>
              How you'll read
            </Text>
            <SegmentedControl
              options={[
                { value: "read" as const, label: "Read" },
                { value: "listen" as const, label: "Listen" },
              ]}
              value={mode}
              onChange={setMode}
            />
          </View>

          <View>
            <Text style={{ fontFamily: "SchibstedGrotesk_700Bold", fontSize: 15, color: colors.textStrong, marginBottom: space[2] }}>
              Pick a novel from the shelf
            </Text>
            <Text style={{ fontFamily: fonts.sans.regular, fontSize: 13, color: colors.textMuted, marginBottom: space[4] }}>
              Each book is written by a real author. As you read together, the story
              writes its next chapters in their voice — bending to the choices you make.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: space[4], paddingVertical: space[2], paddingRight: space[4] }}
            >
              {chronicles.map((c) => (
                <StoryCover
                  key={c.id}
                  title={c.title}
                  author={c.author}
                  genre={chronicleGenre(c)}
                  size="md"
                  selected={selected === c.id}
                  onPress={() => setSelected(c.id)}
                />
              ))}
            </ScrollView>
            {selectedChronicle ? (
              <View style={{ marginTop: space[4] }}>
                {selectedChronicle.author ? (
                  <Text style={{ fontFamily: fonts.sans.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: space[2] }}>
                    {selectedChronicle.title} · by {selectedChronicle.author}
                  </Text>
                ) : null}
                <Text style={{ fontFamily: fonts.serif.italic, fontSize: 14.5, lineHeight: 22, color: colors.textBody }}>
                  {selectedChronicle.sample ?? selectedChronicle.blurb}
                </Text>
              </View>
            ) : null}
          </View>

          <Field label="Friend group name (optional)" placeholder="The Night Owls" value={name} onChangeText={setName} />

          {error ? <Caption style={{ color: colors.danger }}>{error}</Caption> : null}

          <Button
            title="Next — build your character"
            onPress={create}
            loading={busy}
            disabled={!selected}
            size="lg"
            iconLeft={<Sparkles size={19} color={colors.textOnBrand} strokeWidth={2} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
