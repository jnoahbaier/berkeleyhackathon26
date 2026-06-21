/* Talegate UI kit — shared frame, icon helper, and mock data.
   Exposes: window.Icon, window.Phone, window.TabBar, window.BABEL */

(function () {
  // ---- Lucide icon helper ----
  function Icon({ name, size = 22, color = "currentColor", stroke = 1.9, style = {} }) {
    const node = window.lucide && lucide.icons[name];
    const svg = React.useMemo(() => {
      if (!node) return "";
      const el = lucide.createElement(node);
      el.setAttribute("width", size);
      el.setAttribute("height", size);
      el.setAttribute("stroke", color);
      el.setAttribute("stroke-width", stroke);
      return el.outerHTML;
    }, [name, size, color, stroke]);
    return <span style={{ display: "inline-flex", ...style }} dangerouslySetInnerHTML={{ __html: svg }} />;
  }

  // ---- Phone device frame (frameless rounded, à la inspiration) ----
  function Phone({ children, night = false, bg = null }) {
    return (
      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 54,
          background: bg || (night ? "var(--night-900)" : "var(--parchment)"),
          boxShadow: "0 2px 1px rgba(255,255,255,0.6) inset, 0 40px 80px rgba(31,26,16,0.22), 0 8px 24px rgba(31,26,16,0.14)",
          border: night ? "1px solid #2a2742" : "1px solid rgba(255,255,255,0.7)",
          position: "relative",
          overflow: "hidden",
          flex: "none",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", zIndex: 40, pointerEvents: "none" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: night ? "var(--night-text)" : "var(--ink-900)", letterSpacing: "-0.01em" }}>9:41</span>
          <div style={{ display: "flex", gap: 7, color: night ? "var(--night-text)" : "var(--ink-900)" }}>
            <Icon name="signal" size={17} stroke={2.2} />
            <Icon name="wifi" size={17} stroke={2.2} />
            <Icon name="battery-full" size={19} stroke={2.2} />
          </div>
        </div>
        {/* dynamic island */}
        <div style={{ position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)", width: 116, height: 33, borderRadius: 999, background: "#0c0a12", zIndex: 41 }} />
        {children}
      </div>
    );
  }

  // ---- Bottom tab bar (glass) ----
  function TabBar({ active, onChange, night = false }) {
    const tabs = [
      { id: "tonight", label: "Tonight", icon: "moon" },
      { id: "shelf", label: "Shelf", icon: "library" },
      { id: "guild", label: "Guild", icon: "users" },
    ];
    return (
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14, height: 68, zIndex: 30,
        background: night ? "rgba(28,25,48,0.7)" : "rgba(255,255,255,0.72)",
        backdropFilter: "var(--blur-glass)", WebkitBackdropFilter: "var(--blur-glass)",
        borderRadius: 30, border: `1px solid ${night ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)"}`,
        boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", padding: "0 10px" }}>
        {tabs.map((t) => {
          const on = active === t.id;
          const col = on ? "var(--indigo-600)" : night ? "var(--night-muted)" : "var(--ink-400)";
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0", WebkitTapHighlightColor: "transparent" }}>
              <Icon name={t.icon} size={23} color={col} stroke={on ? 2.2 : 1.8} />
              <span style={{ fontSize: 11, fontWeight: on ? 700 : 500, color: col, fontFamily: "var(--font-sans)" }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // ---- Shared mock data ----
  const BABEL = {
    guild: {
      name: "The Night Owls",
      members: [
        { name: "Mara Vance", seat: 1, you: false },
        { name: "You", seat: 2, you: true },
        { name: "Iris Bell", seat: 3, you: false },
        { name: "Kai Okafor", seat: 4, you: false },
      ],
    },
    story: {
      title: "The Ember Gate",
      author: "A. Solace",
      genre: "medieval",
      tagline: "A guild of four, one road, and a gate that only opens at a price.",
      night: 12, total: 30, pages: 8,
    },
    shelf: [
      { title: "The Ember Gate", author: "A. Solace", genre: "medieval" },
      { title: "Signal in the Deep", author: "N. Okafor", genre: "scifi" },
      { title: "The Quiet Hour", author: "L. März", genre: "cosy" },
      { title: "Velvet & Ash", author: "R. Devi", genre: "noir" },
      { title: "What the Wood Keeps", author: "S. Holt", genre: "horror" },
      { title: "Salt & Starlight", author: "M. Reyes", genre: "myth" },
      { title: "The Last Cartographer", author: "J. Penn", genre: "scifi" },
      { title: "A Year of Small Doors", author: "E. Fenn", genre: "cosy" },
      { title: "The Drowned King", author: "T. Marsh", genre: "medieval" },
      { title: "Neon Hours", author: "C. Vale", genre: "noir" },
    ],
    chapter: {
      label: "Chapter 12 · Night 12",
      title: "The gate, or the river",
      paras: [
        "The lantern gutters low, and for a moment the whole company is nothing but breath and the smell of wet stone. Mara stands at the lip of the ravine, her cloak heavy with river-mist, and she will not look at the gate.",
        "\u201cWe could cross here,\u201d she says. \u201cThe water is loud enough to hide us. But it is cold, and Kai cannot swim.\u201d",
        "Behind you, the Ember Gate breathes its slow orange light. It will open \u2014 it always opens \u2014 but it asks for something each time, and tonight it has been watching you the way a creditor watches a door.",
        "Iris touches your sleeve. \u201cIt should be your call,\u201d she says quietly. \u201cYou\u2019ve carried us this far.\u201d",
        "The night is not patient. Mara waits for your word.",
      ],
      choices: [
        { letter: "A", text: "Take the river. Cold is a price you can pay tonight.", flavor: "default", tally: "2 of 4 chose this" },
        { letter: "B", text: "Open the gate \u2014 and offer it the lantern, the only warmth you have.", flavor: "default", tally: "1 of 4 chose this" },
        { letter: "C", text: "Cut Kai loose. He has slowed you since the bridge.", flavor: "betrayal", tally: "Betrayal" },
      ],
    },
    hearth: [
      { who: "Mara", seat: 1, text: "i am NOT letting the gate have the lantern, are you insane" },
      { who: "Kai", seat: 4, text: "whoever picks C we are no longer friends 😭" },
      { who: "Iris", seat: 3, text: "river. trust me. (i read ahead. i didn't. but trust me.)" },
    ],
  };

  window.Icon = Icon;
  window.Phone = Phone;
  window.TabBar = TabBar;
  window.BABEL = BABEL;
})();
