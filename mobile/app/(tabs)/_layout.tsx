import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Library, Moon, Users } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadow, space } from "../../src/theme/theme";

const ICONS: Record<string, typeof Moon> = {
  tonight: Moon,
  shelf: Library,
  guild: Users,
};
const LABELS: Record<string, string> = {
  tonight: "Tonight",
  shelf: "Shelf",
  guild: "Friends",
};

/** Floating glass pill — Tonight · Shelf · Friends. */
function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        left: space[5],
        right: space[5],
        bottom: Math.max(insets.bottom, space[4]),
        height: 68,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: space[3],
        backgroundColor: "rgba(255,255,255,0.82)",
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.85)",
        ...shadow.lg,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name] ?? Moon;
        const color = focused ? colors.brand : colors.textMuted;
        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: space[3] }}
          >
            <Icon size={23} color={color} strokeWidth={focused ? 2.2 : 1.8} />
            <Text
              style={{
                fontSize: 11,
                color,
                fontFamily: focused ? fonts.sans.bold : fonts.sans.medium,
              }}
            >
              {LABELS[route.name] ?? route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bgApp } }}
    >
      <Tabs.Screen name="tonight" />
      <Tabs.Screen name="shelf" />
      <Tabs.Screen name="guild" />
    </Tabs>
  );
}
