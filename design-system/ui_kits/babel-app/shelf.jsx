/* Shelf (catalog) + Detail sheet. Exposes window.ShelfScreen, window.DetailSheet */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const { StoryCover, Button, Badge, IconButton, Tag } = DS;
  const { Icon, BABEL, ScreenScroll } = window;

  function Carousel({ label, items, onPick }) {
    return (
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 17, color: "var(--ink-900)", padding: "0 20px", marginBottom: 12, letterSpacing: "-0.01em" }}>{label}</div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "4px 20px 8px" }}>
          {items.map((s, i) => (
            <StoryCover key={i} title={s.title} author={s.author} genre={s.genre} size="md" onClick={() => onPick(s)} />
          ))}
        </div>
      </div>
    );
  }

  function ShelfScreen({ onPick }) {
    const all = BABEL.shelf;
    const featured = all[0];
    return (
      <ScreenScroll>
        {/* Hero / featured */}
        <div style={{ background: "var(--gradient-dusk)", padding: "66px 20px 22px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(40,32,22,0.6)", marginBottom: 8 }}>The Talegate Library · 10 tales</div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 34, lineHeight: 1.05, letterSpacing: "-0.025em", color: "var(--ink-900)", marginBottom: 18 }}>Pick a tale,<br />the way you'd pick a book together.</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", background: "rgba(255,255,255,0.5)", borderRadius: "var(--radius-xl)", padding: 14, backdropFilter: "var(--blur-glass)", WebkitBackdropFilter: "var(--blur-glass)" }}>
            <StoryCover title={featured.title} author={featured.author} genre={featured.genre} size="md" onClick={() => onPick(featured)} />
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <Badge tone="lit">Editor's pick</Badge>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20, lineHeight: 1.15, color: "var(--ink-900)", margin: "10px 0 6px" }}>{featured.title}</div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: 13.5, lineHeight: 1.45, color: "var(--ink-600,#6b6457)", margin: "0 0 12px" }}>A guild of four, one road, and a gate that opens only at a price.</p>
              <Button variant="primary" size="sm" onClick={() => onPick(featured)}>Open</Button>
            </div>
          </div>
        </div>

        <div style={{ padding: "8px 0 6px" }}>
          <div style={{ display: "flex", gap: 9, overflowX: "auto", padding: "12px 20px" }}>
            {["All", "Medieval", "Sci-fi", "Cosy", "Noir", "Horror", "Myth"].map((g, i) => (
              <Tag key={g} selected={i === 0} onClick={() => {}}>{g}</Tag>
            ))}
          </div>
          <Carousel label="Handpicked this month" items={all.slice(0, 5)} onPick={onPick} />
          <Carousel label="For long-distance guilds" items={all.slice(5)} onPick={onPick} />
        </div>
      </ScreenScroll>
    );
  }

  function DetailSheet({ story, onClose, onStart }) {
    if (!story) return null;
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,16,10,0.42)", backdropFilter: "blur(2px)" }} />
        <div style={{ position: "relative", background: "var(--paper)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", padding: "14px 22px 26px", maxHeight: "88%", overflowY: "auto", boxShadow: "var(--shadow-xl)" }}>
          <div style={{ width: 40, height: 5, borderRadius: 999, background: "var(--line-strong)", margin: "0 auto 18px" }} />
          <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
            <StoryCover title={story.title} author={story.author} genre={story.genre} size="md" />
            <div style={{ flex: 1 }}>
              <Badge tone="neutral" style={{ marginBottom: 8 }}>{story.genre}</Badge>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ink-900)" }}>{story.title}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-400)", marginTop: 4 }}>by {story.author}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={14} /> 30 nights</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="users" size={14} /> 2–4 guild</span>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.6, color: "var(--ink-700)", margin: "0 0 18px" }}>A guild of four wakes on the wrong side of a burning country. The only way home runs through the Ember Gate — and the Gate remembers every bargain. <em>Your tastes shape who you become inside it.</em></p>
          <div style={{ background: "var(--indigo-50)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--indigo-600)", marginBottom: 6 }}>Adapts to your guild</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-700)" }}>Characters, sub-plots, and tone bend toward each player's favourite books, films, and games.</div>
          </div>
          <Button variant="accent" full size="lg" onClick={onStart}>Start a new tale with your guild</Button>
        </div>
      </div>
    );
  }

  window.ShelfScreen = ShelfScreen;
  window.DetailSheet = DetailSheet;
})();
