/**
 * Chronicles — the curated catalog of stories a guild can play.
 *
 * Unlike the old "archetype" model (where each player WAS themselves and the
 * whole world was generated from tastes), a chronicle is a hand-authored book:
 *   - a fixed opening chapter (Chapter 1) that is IDENTICAL for every guild, and
 *   - 2–4 pre-defined central characters players claim on the first night.
 *
 * After casting, Claude continues the book from the chosen characters and the
 * decisions the guild makes. Characters nobody claims become non-player side
 * characters that the narrator drives with sensible defaults.
 *
 * Each chronicle ships exactly 4 central characters so any guild of 2–4 players
 * works: the remainder simply live in the world as NPCs.
 *
 * AUTHORS: every book on the shelf is written by a REAL author. The author pens
 * the world, the cast, and the opening — and sets the course the story is meant
 * to take. All Claude does is write the NEXT chapters in the author's voice,
 * staying close to what the author laid down while bending to the choices the
 * friends make each night. The three books below are placeholders: their
 * `author` names are invented and their `sample` excerpts are AI-generated
 * stand-ins until real authors fill the shelf.
 */

function paras(...p) {
  return p.join("\n\n");
}

export const CHRONICLES = [
  {
    id: "ember_gate",
    title: "The Ember Gate",
    author: "Elena Marsh",
    blurb: "A walled town, an ancient archway that hums after dark, and four friends who can no longer pretend it's asleep.",
    sample: paras(
      "The first stone of Emberfell was laid against the gate, not the other way round, and every mason since had pretended otherwise.",
      "They built the walls to keep the world out. Mara always suspected they were really built to keep the gate in — and that one night, very politely, it would ask to be let through."
    ),
    setting: "Emberfell — a fortified town built around a black-stone gate older than its walls",
    tone: "fireside fantasy: warm and cosy with a slow, rising dread",
    tint: "#E89B3C",
    characters: [
      { id: "mara", name: "Mara Vance", role: "the wary scout", blurb: "Reads the woods like a page and trusts no one twice.", traits: "watchful, quick-footed, haunted by a patrol that didn't come home" },
      { id: "cael", name: "Cael Doran", role: "the reluctant captain", blurb: "Wears a badge of command he never asked for.", traits: "steady, dutiful, terrified of his own doubt" },
      { id: "iris", name: "Iris Bell", role: "the keeper of records", blurb: "The town archivist who knows which graves are empty.", traits: "soft-spoken, ferociously curious, hoards truths like coin" },
      { id: "kai", name: "Kai Okafor", role: "the river-shy smith", blurb: "Mends blades and grudges; will not go near deep water.", traits: "warm, stubborn, loyal to a fault" },
    ],
    first_chapter: {
      title: "Chapter 1 — The Gate Wakes",
      shared_text: paras(
        "For as long as anyone in Emberfell could remember, the gate had been a dead thing — a great arch of black stone at the heart of the town, swallowing no road and opening onto nothing but the old square where children dared each other to touch it. The elders called it decoration. The maps called it nothing at all.",
        "Tonight it was humming.",
        "Mara Vance felt it in her teeth from the watchtower before she heard it, a low note like a struck bell held too long. Down in the forge, Kai Okafor's hammer stilled mid-swing as the coals flared without wind. In the archive, Iris Bell watched a centuries-sealed ledger fall open on its own, its ink suddenly wet. And in the captain's hall, Cael Doran set down a cup he would not finish, because the water in it had begun, very gently, to ring.",
        "By the time the four of them reached the square they were not alone — half the town had come in nightclothes, lanterns trembling. The arch glowed from within, a seam of ember-light widening down its centre as though something on the other side were leaning a shoulder against a door that had been shut for a thousand years.",
        "A wind came through it that smelled of pine and cold stars and, faintly, of smoke. On the far side of the light, where there had only ever been wall, there was now a road — and on the road, far off, a single lantern, coming closer.",
        "The town looked to the four who had arrived first, as towns do. Someone would have to decide whether to meet what was coming, or bar the gate and pray it could still be barred. The ember-light waited. So did everyone else."
      ),
    },
  },

  {
    id: "tenth_orbit",
    title: "Signal from the Tenth Orbit",
    author: "Tomas Reyes",
    blurb: "A salvage crew wakes a silent relay station at the edge of a dead system — and something there has been waiting for company.",
    sample: paras(
      "Out past the tenth orbit, the dark doesn't echo. Vesna had flown crews who never got used to that — the way a scream out here would simply leave and not come back.",
      "The Aria had been quiet for ninety years. Niko swore it wasn't empty quiet. It was the quiet of a room where someone is holding very still, listening for the sound of the door."
    ),
    setting: "the relay station Aria, drifting at the cold edge of an abandoned star system",
    tone: "intimate space opera: awe, hush, and the long dark between worlds",
    tint: "#5B50C9",
    characters: [
      { id: "vesna", name: "Vesna Roe", role: "the captain who stayed", blurb: "Brought everyone this far out; means to bring them back.", traits: "calm under pressure, carries old guilt, hates leaving things behind" },
      { id: "bo", name: "Bo Achterberg", role: "the rogue engineer", blurb: "Can fix anything except a schedule or an argument.", traits: "brilliant, blunt, allergic to authority" },
      { id: "lyra", name: "Lyra Sun", role: "the ship's diplomat", blurb: "Talks to people, governments, and now, perhaps, to stranger things.", traits: "warm, perceptive, keeps the crew from each other's throats" },
      { id: "niko", name: "Niko Vale", role: "the pilot who hears the dark", blurb: "Flies by instinct and by sounds no instrument records.", traits: "quiet, uncanny, half-in-love with the void" },
    ],
    first_chapter: {
      title: "Chapter 1 — Wake",
      shared_text: paras(
        "The Aria had been dark for ninety years, and the salvage crew aboard the Kestrel had flown three months to reach it. A relay station the size of a cathedral, tumbling slow against a sky with no nearby sun — abandoned, stripped from the registries, worth a fortune in rare alloy to anyone willing to come this far into nothing.",
        "Captain Vesna Roe brought the Kestrel in herself, because the docking was delicate and because she did not, as a rule, ask others to do the frightening parts. Niko Vale sat beside her not touching the controls, head tilted, listening to something in the hull's groan that made the hair on Vesna's arms stand up.",
        "Bo Achterberg got the station's main bus live in under an hour — too fast, Bo would say later, as if the Aria had wanted to wake. One by one the long corridors lit ahead of them, a path of cold blue leading inward, exactly as if it were expecting guests and knew the way they meant to go.",
        "It was Lyra Sun who found the message. Not in any language file, not in any log — pressed instead into every screen at once the moment the reactor warmed: a single repeating pattern, patient and unmistakably aimed. Hello. Hello. Are you the ones. Hello.",
        "Behind them, soft as a held breath, the airlock they had come through cycled shut. Ahead, the blue corridor brightened, beckoning toward the station's silent heart. The crew stood in the humming dark of a place that had waited ninety years to say its first word — and now, plainly, did not want them to leave just yet."
      ),
    },
  },

  {
    id: "lamplight",
    title: "The Lamplight Tearoom",
    author: "Margery Quill",
    blurb: "In a foggy seaside town, a beloved neighbour vanishes overnight — and the only people who seem to care gather, as ever, for tea.",
    sample: paras(
      "In Hollowmere, the fog kept everyone's secrets and the tearoom kept everyone's company, and Posy had long stopped wondering which did more harm.",
      "Margaret used to say a town this small had no room for a mystery. She was wrong about that, in the end — though by then she was no longer at her usual table to be told so."
    ),
    setting: "Hollowmere — a small, fog-wrapped coastal town where everyone knows everyone, and that's the problem",
    tone: "cosy mystery: gentle, warm, and just a little eerie",
    tint: "#5E8C7D",
    characters: [
      { id: "posy", name: "Posy Wren", role: "the baker who notices things", blurb: "Up before the town; sees who comes and goes in the dark.", traits: "kind, observant, can't leave a loose thread alone" },
      { id: "edmund", name: "Edmund Vale", role: "the bookshop owner", blurb: "Knows the town's history better than the town does.", traits: "dry, gentle, quietly grieving" },
      { id: "june", name: "June Halloway", role: "the wandering musician", blurb: "Blew in last spring and somehow never left.", traits: "charming, restless, hiding a reason for staying" },
      { id: "arlo", name: "Arlo Finch", role: "the new arrival", blurb: "Took the cottage on the cliff, asks too many questions.", traits: "earnest, sharp-eyed, an outsider's clear view" },
    ],
    first_chapter: {
      title: "Chapter 1 — The Empty Chair",
      shared_text: paras(
        "Every morning at half past seven, old Margaret Tides took the window seat at the Lamplight Tearoom, ordered toast she rarely finished, and watched the harbour come awake through the fog. She had done so for forty years. She did not do so this morning.",
        "Posy Wren noticed first, because Posy noticed everything — she had passed the tearoom at five with a tray of warm loaves and seen Margaret's lamp already lit, her door already open to the cold. By seven the lamp still burned, the door still gaped, and the toast sat untouched on the counter where no one remembered making it.",
        "Edmund Vale arrived for his usual pot of black tea and found the room too quiet. June Halloway drifted in behind him, fiddle case on her back, humming a tune she stopped humming the moment she saw the empty chair. And Arlo Finch — newest of them all, still learning which silences in Hollowmere meant something — saw at once that this one did.",
        "Margaret's coat was still on its hook. Her boots were still by the door. Her reading glasses lay folded on the table beside a cup of tea gone cold, and underneath the saucer, in a careful hand none of them recognised, was a single slip of paper bearing four words: tell no one yet.",
        "Outside, the fog pressed white against the glass and the harbour bell rang its slow, ordinary hour. Inside, four neighbours stood around an empty chair, a cooling cup, and a note that seemed to be addressed — though it named no one — to exactly the people who had come."
      ),
    },
  },
];

export function chronicleById(id) {
  return CHRONICLES.find((c) => c.id === id) ?? null;
}

/** Catalog payload for the app: everything needed to choose, minus the full
 *  opening prose (which is revealed once the story actually starts). */
export function chronicleSummary(c) {
  return {
    id: c.id,
    title: c.title,
    author: c.author,
    blurb: c.blurb,
    sample: c.sample,
    setting: c.setting,
    tone: c.tone,
    tint: c.tint,
    characters: c.characters,
  };
}
