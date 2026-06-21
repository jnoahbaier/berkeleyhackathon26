import { Redirect } from "expo-router";

/** Legacy route — main shell lives in the tab bar now. */
export default function Home() {
  return <Redirect href="/(tabs)/tonight" />;
}
