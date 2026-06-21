import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, Guild } from "./api";
import { subscribeToGuild } from "./socket";

export const LAST_GUILD = "babel.lastGuild";

/**
 * Loads the player's most recent guild (the one Tonight & Guild tabs revolve
 * around) and keeps it live over the socket. Returns `null` guild when the
 * player hasn't joined one yet.
 */
export function useCurrentGuild() {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const idRef = useRef<string | null>(null);
  const reloading = useRef(false);

  const reload = useCallback(async () => {
    if (!idRef.current || reloading.current) return;
    reloading.current = true;
    try {
      const { guild } = await api.getGuild(idRef.current);
      setGuild(guild);
      await AsyncStorage.setItem(LAST_GUILD, JSON.stringify({ id: guild.id, name: guild.name }));
    } catch {
      setGuild(null);
    } finally {
      reloading.current = false;
    }
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      setLoading(true);
      const raw = await AsyncStorage.getItem(LAST_GUILD);
      if (!raw) {
        setGuild(null);
        setLoading(false);
        return;
      }
      const saved = JSON.parse(raw) as { id: string };
      idRef.current = saved.id;
      await reload();
      setLoading(false);
      unsub = subscribeToGuild(saved.id, {
        onGuildUpdate: () => reload(),
        onChapterNew: () => reload(),
        onChoiceUpdate: () => reload(),
      });
    })();
    return () => unsub?.();
  }, [reload]);

  return { guild, loading, reload, setGuild };
}
