import { Calendar, Users } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Badge, Sheet, StoryCover, Tag, type CoverGenre } from "../../src/components/ds";
import { Button, Caption, GradientHero } from "../../src/components/ui";
import { api, Chronicle } from "../../src/lib/api";
import { colors, fonts, radius, space, text as type } from "../../src/theme/theme";

const GENRES = ["All", "Medieval", "Sci-fi", "Cosy", "Noir", "Horror", "Myth"] as const;

function chronicleGenre(c: Chronicle): CoverGenre {
  const t = c.tone.toLowerCase();
  if (t.includes("space") || t.includes("sci")) return "scifi";
  if (t.includes("cosy") || t.includes("cozy")) return "cosy";
  if (t.includes("noir")) return "noir";
  if (t.includes("horror") || t.includes("dread")) return "horror";
  if (t.includes("myth")) return "myth";
  return "medieval";
}

function genreFilter(c: Chronicle, filter: string): boolean {
  if (filter === "All") return true;
  const g = chronicleGenre(c);
  const map: Record<string, CoverGenre> = {
    Medieval: "medieval",
    "Sci-fi": "scifi",
    Cosy: "cosy",
    Noir: "noir",
    Horror: "horror",
    Myth: "myth",
  };
  return g === map[filter];
}

export default function Shelf() {
  const router = useRouter();
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [picked, setPicked] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .chronicles()
      .then((r) => setChronicles(r.chronicles))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = chronicles.filter((c) => genreFilter(c, filter));
  const featured = chronicles[0];
  const handpicked = filtered.slice(0, 5);
  const longDistance = filtered.slice(5);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgApp }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <GradientHero
          style={{ paddingTop: 66, paddingBottom: space[6] }}
          kicker={`The Talegate Library · ${chronicles.length} tales`}
          title={
            <Text style={{ fontFamily: fonts.sans.bold, fontSize: 34, lineHeight: 36, letterSpacing: -0.85, color: colors.textStrong }}>
              Pick a tale,{"\n"}the way you'd pick a book together.
            </Text>
          }
        >
          {featured ? (
            <View
              style={{
                marginTop: space[5],
                flexDirection: "row",
                gap: space[5],
                alignItems: "flex-end",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: radius.xl,
                padding: space[4],
              }}
            >
              <StoryCover
                title={featured.title}
                author={featured.author}
                genre={chronicleGenre(featured)}
                size="md"
                onPress={() => setPicked(featured)}
              />
              <View style={{ flex: 1, paddingBottom: space[2] }}>
                <Badge tone="lit">Editor's pick</Badge>
                <Text style={{ fontFamily: fonts.serif.semibold, fontSize: 20, lineHeight: 23, color: colors.textStrong, marginTop: space[4], marginBottom: space[2] }}>
                  {featured.title}
                </Text>
                <Text style={{ fontFamily: fonts.serif.regular, fontSize: 13.5, lineHeight: 20, color: colors.textSecondary, marginBottom: space[4] }}>
                  {featured.blurb}
                </Text>
                <Button variant="primary" size="sm" full={false} title="Open" onPress={() => setPicked(featured)} />
              </View>
            </View>
          ) : null}
        </GradientHero>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space[6], paddingVertical: space[4], gap: 9 }}>
          {GENRES.map((g) => (
            <Tag key={g} selected={filter === g} onPress={() => setFilter(g)}>
              {g}
            </Tag>
          ))}
        </ScrollView>

        {loading ? (
          <Caption style={{ paddingHorizontal: space[6] }}>Opening the stacks…</Caption>
        ) : (
          <>
            <Carousel label="Handpicked this month" items={handpicked} onPick={setPicked} />
            {longDistance.length > 0 ? (
              <Carousel label="For long-distance friends" items={longDistance} onPick={setPicked} />
            ) : null}
          </>
        )}
      </ScrollView>

      <DetailSheet
        story={picked}
        onClose={() => setPicked(null)}
        onStart={() => {
          setPicked(null);
          router.push("/guild/create");
        }}
      />
    </View>
  );
}

function Carousel({ label, items, onPick }: { label: string; items: Chronicle[]; onPick: (c: Chronicle) => void }) {
  if (!items.length) return null;
  return (
    <View style={{ marginBottom: space[7] }}>
      <Text style={{ fontFamily: fonts.sans.bold, fontSize: 17, letterSpacing: -0.17, color: colors.textStrong, paddingHorizontal: space[6], marginBottom: space[4] }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space[6], gap: space[4] }}>
        {items.map((c) => (
          <StoryCover key={c.id} title={c.title} author={c.author} genre={chronicleGenre(c)} size="md" onPress={() => onPick(c)} />
        ))}
      </ScrollView>
    </View>
  );
}

function DetailSheet({ story, onClose, onStart }: { story: Chronicle | null; onClose: () => void; onStart: () => void }) {
  if (!story) return null;
  const genre = chronicleGenre(story);
  return (
    <Sheet visible={!!story} onClose={onClose}>
      <View style={{ flexDirection: "row", gap: space[5], marginBottom: space[5] }}>
        <StoryCover title={story.title} genre={genre} size="md" />
        <View style={{ flex: 1 }}>
          <Badge tone="neutral" style={{ marginBottom: space[3] }}>{genre}</Badge>
          <Text style={{ fontFamily: fonts.sans.bold, fontSize: 24, lineHeight: 26, letterSpacing: -0.48, color: colors.textStrong }}>
            {story.title}
          </Text>
          <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14, color: colors.textMuted, marginTop: space[2] }}>
            {story.author ? `by ${story.author}` : "by Talegate"}
          </Text>
          <View style={{ flexDirection: "row", gap: space[3], marginTop: space[4], flexWrap: "wrap" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Calendar size={14} color={colors.textSecondary} strokeWidth={1.9} />
              <Text style={{ fontFamily: fonts.mono.medium, fontSize: 11, color: colors.textSecondary }}>30 nights</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Users size={14} color={colors.textSecondary} strokeWidth={1.9} />
              <Text style={{ fontFamily: fonts.mono.medium, fontSize: 11, color: colors.textSecondary }}>2–4 friends</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={{ fontFamily: fonts.serif.regular, fontSize: 17, lineHeight: 27, color: colors.textBody, marginBottom: space[5] }}>
        {story.blurb}{" "}
        <Text style={{ fontFamily: fonts.serif.italic }}>The author sets the course — your choices write what happens next.</Text>
      </Text>

      {story.sample ? (
        <Text style={{ fontFamily: fonts.serif.italic, fontSize: 15, lineHeight: 24, color: colors.textSecondary, marginBottom: space[5] }}>
          {story.sample}
        </Text>
      ) : null}

      <View style={{ backgroundColor: colors.brandTint, borderRadius: radius.md, padding: space[5], marginBottom: space[6] }}>
        <Text style={[type.label, { color: colors.brand, marginBottom: space[2] }]}>Written by a real author</Text>
        <Text style={{ fontFamily: fonts.sans.regular, fontSize: 13.5, lineHeight: 20, color: colors.textBody }}>
          {story.author ? `${story.author} wrote this world and its cast. ` : ""}
          Each night, the story writes its next chapter in the author's voice — bending to the choices you and your friends make.
        </Text>
      </View>

      <Button variant="accent" size="lg" full title="Start a new tale with your friends" onPress={onStart} />
    </Sheet>
  );
}
