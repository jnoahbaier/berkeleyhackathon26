import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Check, Headphones, MessageCircle, Moon } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Wordmark from "../assets/brand/talegate-wordmark.svg";
import {
  Avatar,
  Body,
  Button,
  Card,
  Heading,
  Label,
  Pill,
  Reading,
  Title,
} from "../src/components/ui";
import { colors, gradients, palette, radius, space, text as type } from "../src/theme/theme";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: space[8] }}>
      <Label style={{ marginBottom: space[4] }}>{label}</Label>
      <View style={{ gap: space[3] }}>{children}</View>
    </View>
  );
}

export default function DesignCheck() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgApp }} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: space[12] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dusk hero — the signature gradient behind bold near-black type */}
        <LinearGradient
          colors={gradients.dusk.colors}
          locations={gradients.dusk.locations}
          start={gradients.dusk.start}
          end={gradients.dusk.end}
          style={{ paddingHorizontal: space[6], paddingTop: space[9], paddingBottom: space[8] }}
        >
          <Wordmark width={196} height={51} />
          <Text style={[type.label, { color: "rgba(40,32,22,0.65)", marginTop: space[6] }]}>
            Tuesday · the hour grows late
          </Text>
          <Text style={[type.displayLg, { marginTop: space[3] }]}>
            Good evening.{"\n"}Your guild is gathering.
          </Text>
        </LinearGradient>

        <View style={{ padding: space[6] }}>
          {/* Type scale */}
          <Section label="Type · Schibsted / Newsreader / Geist Mono">
            <Title>Display heading (h1)</Title>
            <Heading>Section heading (h2)</Heading>
            <Body>
              Product voice in Schibsted Grotesk — plain, friendly, a little wry. Your guild is
              waiting.
            </Body>
            <Reading>
              The lantern gutters. Mara waits for your word — the gate, or the river?
            </Reading>
            <Label>Chapter 04 · Night 12</Label>
          </Section>

          {/* Buttons */}
          <Section label="Buttons · variants">
            <Button variant="primary" iconLeft={<BookOpen size={19} strokeWidth={2} color={colors.textOnBrand} />}>
              Read tonight's chapter
            </Button>
            <Button variant="accent" iconLeft={<Moon size={19} strokeWidth={2} color={colors.textOnAccent} />}>
              Light the chapter
            </Button>
            <Button variant="secondary">Maybe later</Button>
            <Button variant="ghost">Skip</Button>
            <Button variant="danger">Betray the guild</Button>
          </Section>

          <Section label="Buttons · sizes & states">
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary">Large</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <View style={{ flexDirection: "row", gap: space[3] }}>
              <Button variant="secondary" full={false}>Auto width</Button>
            </View>
          </Section>

          {/* Cards */}
          <Section label="Cards · elevation">
            <Card elevation="sm">
              <Heading style={{ marginBottom: space[2] }}>Listen instead</Heading>
              <Body dim>11 min, narrated</Body>
            </Card>
            <Card elevation="lg">
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space[3] }}>
                <Pill text="Lit · 10:00 PM" tone="accent" />
                <Label>8 pages</Label>
              </View>
              <Text style={[type.label, { color: palette.candle600, marginBottom: space[2] }]}>
                Chapter 12 · The Ember Gate
              </Text>
              <Reading style={type.serifDisplay}>The gate, or the river?</Reading>
              <Body dim style={{ marginTop: space[2] }}>
                The bridge held — barely. Tonight the gate is watching, and Mara won't look at it.
              </Body>
            </Card>
            <View style={{ flexDirection: "row", gap: space[3] }}>
              <Card elevation="sm" interactive style={{ flex: 1 }}>
                <Headphones size={22} color={colors.brand} />
                <Heading style={[type.h4, { marginTop: space[3] }]}>Listen</Heading>
              </Card>
              <Card elevation="sm" interactive style={{ flex: 1 }}>
                <MessageCircle size={22} color={colors.danger} />
                <Heading style={[type.h4, { marginTop: space[3] }]}>The Hearth</Heading>
              </Card>
            </View>
          </Section>

          {/* Night surface */}
          <Section label="Night surface · the Reader">
            <View style={{ borderRadius: radius.lg, overflow: "hidden" }}>
              <LinearGradient
                colors={gradients.night.colors}
                locations={gradients.night.locations}
                start={gradients.night.start}
                end={gradients.night.end}
                style={{ padding: space[6], gap: space[4] }}
              >
                <Card onNight>
                  <Text style={[type.label, { color: colors.nightMuted, marginBottom: space[2] }]}>
                    Chapter 12 · Night 12
                  </Text>
                  <Text style={[type.read, { color: colors.nightText }]}>
                    You step to the threshold. The ember-light breathes once, and the gate remembers
                    your name.
                  </Text>
                </Card>
                <Button onNight variant="secondary">Goodnight</Button>
                <Button variant="accent" iconLeft={<Check size={19} strokeWidth={2.4} color={colors.textOnAccent} />}>
                  Seal my word
                </Button>
              </LinearGradient>
            </View>
          </Section>

          {/* Guild seats */}
          <Section label="Guild seats · avatars & pills">
            <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
              <Avatar name="Mara Vance" seat={1} />
              <Avatar name="You" seat={2} active />
              <Avatar name="Iris Bell" seat={3} />
              <Avatar name="Kai Okafor" seat={4} />
            </View>
            <View style={{ flexDirection: "row", gap: space[3], flexWrap: "wrap" }}>
              <Pill text="You" tone="brand" />
              <Pill text="3 of 4 chose" tone="success" />
              <Pill text="Lit" tone="accent" />
              <Pill text="Night 12 of 30" tone="default" />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
