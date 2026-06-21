import { useRouter } from "expo-router";
import { useState } from "react";
import { Body, Button, Caption, Screen, TagInput, Title } from "../src/components/ui";
import { api } from "../src/lib/api";
import { useSession } from "../src/lib/session";
import { colors, spacing } from "../src/theme/theme";

export default function Onboarding() {
  const { user, profile, setProfile } = useSession();
  const router = useRouter();

  const [books, setBooks] = useState<string[]>(profile?.favorite_books ?? []);
  const [movies, setMovies] = useState<string[]>(profile?.favorite_movies ?? []);
  const [games, setGames] = useState<string[]>(profile?.favorite_games ?? []);
  const [hobbies, setHobbies] = useState<string[]>(profile?.hobbies ?? []);
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = books.length + movies.length + games.length + hobbies.length + interests.length;

  const save = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const { profile } = await api.saveProfile(user.id, {
        favorite_books: books,
        favorite_movies: movies,
        favorite_games: games,
        hobbies,
        interests,
      });
      setProfile(profile);
      router.replace("/home");
    } catch (e: any) {
      setError(e.message ?? "Could not save");
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Title>Your tastes</Title>
      <Body dim style={{ marginBottom: spacing.lg }}>
        Babel weaves the story from what your whole guild loves. Add a few favorites — the more
        specific, the better the world.
      </Body>

      <TagInput label="Favorite books" placeholder="Type a title, press enter" value={books} onChange={setBooks} />
      <TagInput label="Favorite movies / shows" placeholder="Add a title" value={movies} onChange={setMovies} />
      <TagInput label="Favorite games" placeholder="Add a game" value={games} onChange={setGames} />
      <TagInput label="Hobbies" placeholder="hiking, painting..." value={hobbies} onChange={setHobbies} />
      <TagInput label="Other interests" placeholder="mythology, space..." value={interests} onChange={setInterests} />

      {error ? <Caption style={{ color: colors.danger, marginBottom: spacing.sm }}>{error}</Caption> : null}
      <Button
        title={total === 0 ? "Skip for now" : "Save profile"}
        onPress={save}
        loading={busy}
        variant={total === 0 ? "ghost" : "primary"}
      />
    </Screen>
  );
}
