/**
 * Seeds a demo guild with two players + profiles so you can jump straight into
 * the story flow during a demo. Run: npm run seed
 *
 * Prints the two user ids and the invite code.
 */
import { db } from "./db.js";
import { nanoid, customAlphabet } from "nanoid";

const inviteCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

db.reset();

function mkUser(display_name, profile) {
  const user = db.insert("users", {
    id: nanoid(),
    display_name,
    created_at: new Date().toISOString(),
  });
  db.insert("profiles", { user_id: user.id, ...profile });
  return user;
}

const alex = mkUser("Alex", {
  favorite_books: ["The Lord of the Rings", "The Name of the Wind"],
  favorite_movies: ["The Lord of the Rings"],
  favorite_games: ["Elden Ring", "Skyrim"],
  hobbies: ["hiking", "tabletop dnd"],
  interests: ["mythology"],
});

const sam = mkUser("Sam", {
  favorite_books: ["A Game of Thrones"],
  favorite_movies: ["The Witcher"],
  favorite_games: ["The Witcher 3"],
  hobbies: ["painting miniatures"],
  interests: ["medieval history"],
});

const guild = db.insert("guilds", {
  id: nanoid(),
  name: "The Long-Distance Few",
  invite_code: inviteCode(),
  archetype: "medieval_fantasy",
  player_count: 2,
  pages_per_night: 2,
  release_time: "22:00",
  current_chapter_index: -1,
  status: "lobby",
  story_bible: null,
  created_by: alex.id,
  created_at: new Date().toISOString(),
});

for (const u of [alex, sam]) {
  db.insert("guild_members", {
    id: nanoid(),
    guild_id: guild.id,
    user_id: u.id,
    character: null,
    joined_at: new Date().toISOString(),
  });
}

console.log("Seeded demo guild:");
console.log("  Alex user id:", alex.id);
console.log("  Sam  user id:", sam.id);
console.log("  Invite code :", guild.invite_code);
console.log("  Guild id    :", guild.id);
