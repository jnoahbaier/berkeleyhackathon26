import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, User, Profile } from "./api";

type Session = {
  user: User | null;
  profile: Profile | null;
  hydrated: boolean;
  signIn: (displayName: string) => Promise<User>;
  setProfile: (p: Profile) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const KEY = "babel.userId";
const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem(KEY);
        if (id) {
          const { user, profile } = await api.getUser(id);
          setUser(user);
          setProfileState(profile);
        }
      } catch {
        // stale id or server down; start fresh
        await AsyncStorage.removeItem(KEY);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const signIn = async (displayName: string) => {
    const { user } = await api.createUser(displayName);
    await AsyncStorage.setItem(KEY, user.id);
    setUser(user);
    return user;
  };

  const refresh = async () => {
    if (!user) return;
    const res = await api.getUser(user.id);
    setUser(res.user);
    setProfileState(res.profile);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(KEY);
    setUser(null);
    setProfileState(null);
  };

  return (
    <SessionContext.Provider
      value={{ user, profile, hydrated, signIn, setProfile: setProfileState, refresh, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
