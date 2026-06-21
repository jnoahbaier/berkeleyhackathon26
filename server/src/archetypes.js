/**
 * Story archetypes the guild can pick from. The onboarding can also auto-suggest
 * one based on the combined player profiles (favorite books / movies / games).
 */
export const ARCHETYPES = [
  {
    id: "medieval_fantasy",
    name: "Medieval Fantasy",
    blurb: "Kingdoms, magic, sworn oaths and quiet betrayals.",
    keywords: [
      "tolkien", "lord of the rings", "got", "game of thrones", "witcher",
      "elden ring", "skyrim", "dragon", "fantasy", "harry potter", "narnia",
      "knight", "magic", "dnd", "dungeons",
    ],
  },
  {
    id: "space_opera",
    name: "Space Opera / Sci-Fi",
    blurb: "Starships, fragile alliances, and the cold dark between worlds.",
    keywords: [
      "dune", "star wars", "star trek", "expanse", "mass effect", "halo",
      "sci-fi", "scifi", "space", "cyberpunk", "blade runner", "foundation",
      "interstellar", "alien", "android",
    ],
  },
  {
    id: "noir_mystery",
    name: "Noir Mystery",
    blurb: "Rain-slick streets, unreliable friends, and a secret worth killing for.",
    keywords: [
      "sherlock", "agatha christie", "detective", "noir", "mystery", "crime",
      "true crime", "knives out", "disco elysium", "murder", "thriller",
    ],
  },
  {
    id: "cozy_slice_of_life",
    name: "Cozy Slice of Life",
    blurb: "A small town, warm friendships, and gentle everyday drama.",
    keywords: [
      "studio ghibli", "stardew", "animal crossing", "cozy", "romance",
      "slice of life", "gilmore", "coffee", "bakery", "found family",
    ],
  },
  {
    id: "post_apocalyptic",
    name: "Post-Apocalyptic Survival",
    blurb: "What's left of the world, and who you choose to keep alive.",
    keywords: [
      "last of us", "fallout", "mad max", "walking dead", "the road",
      "zombie", "apocalypse", "survival", "wasteland", "metro",
    ],
  },
  {
    id: "high_school_drama",
    name: "Coming of Age",
    blurb: "Friendship, first stakes, and figuring out who you are.",
    keywords: [
      "stranger things", "percy jackson", "hunger games", "young adult",
      "ya", "coming of age", "school", "teen", "euphoria",
    ],
  },
];

export function archetypeById(id) {
  return ARCHETYPES.find((a) => a.id === id) ?? null;
}

/**
 * Score every archetype against the combined free-text of player profiles and
 * return the best match. Deterministic, no AI needed (used as a fast default /
 * suggestion before the LLM crafts the actual world).
 */
export function suggestArchetype(profiles) {
  const corpus = profiles
    .flatMap((p) => [
      ...(p.favorite_books ?? []),
      ...(p.favorite_movies ?? []),
      ...(p.favorite_games ?? []),
      ...(p.hobbies ?? []),
      ...(p.interests ?? []),
    ])
    .join(" ")
    .toLowerCase();

  let best = ARCHETYPES[0];
  let bestScore = -1;
  for (const arch of ARCHETYPES) {
    const score = arch.keywords.reduce(
      (acc, kw) => acc + (corpus.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      best = arch;
      bestScore = score;
    }
  }
  return { archetype: best, score: bestScore };
}
