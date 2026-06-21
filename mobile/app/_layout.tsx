import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
} from "@expo-google-fonts/geist-mono";
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
  Newsreader_600SemiBold_Italic,
} from "@expo-google-fonts/newsreader";
import {
  SchibstedGrotesk_400Regular,
  SchibstedGrotesk_500Medium,
  SchibstedGrotesk_600SemiBold,
  SchibstedGrotesk_700Bold,
  SchibstedGrotesk_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/schibsted-grotesk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "../src/lib/session";
import { colors, fonts } from "../src/theme/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_600SemiBold,
    SchibstedGrotesk_700Bold,
    SchibstedGrotesk_800ExtraBold,
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    Newsreader_600SemiBold_Italic,
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
  });

  if (!fontsLoaded) {
    // Keep the parchment canvas while the three families load.
    return <View style={{ flex: 1, backgroundColor: colors.bgApp }} />;
  }

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bgApp },
            headerTintColor: colors.textStrong,
            headerTitleStyle: {
              fontFamily: fonts.sans.bold,
              color: colors.textStrong,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bgApp },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="guild/create" options={{ headerShown: false }} />
          <Stack.Screen name="guild/join" options={{ headerShown: false }} />
          <Stack.Screen name="guild/[id]/index" options={{ title: "" }} />
          <Stack.Screen name="guild/[id]/timeline" options={{ title: "Story so far" }} />
          <Stack.Screen name="design-check" options={{ title: "Design check" }} />
        </Stack>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
