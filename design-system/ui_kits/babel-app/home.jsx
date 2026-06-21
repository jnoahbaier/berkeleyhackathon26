/* Tonight (home) + Guild screens. Exposes window.TonightScreen, window.GuildScreen */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const { Button, Badge, Card, Avatar, AvatarStack, GuildDots, ProgressTrack, IconButton } = DS;
  const { Icon, BABEL } = window;

  function ScreenScroll({ children, pad = 0 }) {
    return (
      <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingBottom: 104 }}>
        {children}
      </div>
    );
  }

  function TonightScreen({ onRead }) {
    const s = BABEL.story;
    const dots = BABEL.guild.members.map((m, i) => ({ name: m.name, seat: m.seat, done: i < 2 }));
    return (
      <ScreenScroll>
        {/* Dusk hero */}
        <div style={{ background: "var(--gradient-dusk)", padding: "70px 24px 30px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
            <IconButton label="Help" variant="glass" size="sm"><Icon name="help-circle" size={19} /></IconButton>
            <IconButton label="Profile" variant="glass" size="sm"><Icon name="user" size={19} /></IconButton>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(40,32,22,0.65)", marginBottom: 10 }}>Tuesday · the hour grows late</div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 38, lineHeight: 1.04, letterSpacing: "-0.025em", color: "var(--ink-900)" }}>Good evening.<br />Your guild is gathering.</div>
        </div>

        <div style={{ padding: "20px 18px 0", display: "flex", flexDirection: "column", gap: 16, marginTop: -14 }}>
          {/* Tonight's chapter */}
          <Card elevation="lg" pad={20}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <Badge tone="lit" dot>Lit · 10:00 PM</Badge>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--ink-400)" }}>{s.pages} PAGES</span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--candle-600)", marginBottom: 6 }}>Chapter {s.night} · {s.title}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 25, fontWeight: 600, lineHeight: 1.18, letterSpacing: "-0.01em", color: "var(--ink-900)", marginBottom: 6 }}>{s.title}?</div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.55, color: "var(--ink-500)", margin: "0 0 18px" }}>The bridge held — barely. Tonight the gate is watching, and Mara won't look at it.</p>
            <ProgressTrack value={s.night} total={s.total} label="The Ember Gate" />
            <div style={{ height: 18 }} />
            <Button variant="accent" full size="lg" iconLeft={<Icon name="book-open" size={19} stroke={2} />} onClick={onRead}>Read tonight's chapter</Button>
          </Card>

          {/* Who's here */}
          <Card elevation="sm" pad={18}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)" }}>The Night Owls</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-400)", marginTop: 2 }}>2 reading now</div>
              </div>
              <AvatarStack size={38} members={BABEL.guild.members} />
            </div>
            <div style={{ height: 14 }} />
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
              <GuildDots members={dots} />
            </div>
          </Card>

          <div style={{ display: "flex", gap: 12 }}>
            <Card elevation="sm" pad={16} style={{ flex: 1 }} interactive>
              <Icon name="headphones" size={22} color="var(--indigo-600)" />
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)", marginTop: 10 }}>Listen instead</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-400)", marginTop: 2 }}>11 min, narrated</div>
            </Card>
            <Card elevation="sm" pad={16} style={{ flex: 1 }} interactive>
              <Icon name="message-circle" size={22} color="var(--guild-1)" />
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)", marginTop: 10 }}>The Hearth</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-400)", marginTop: 2 }}>3 new from Kai</div>
            </Card>
          </div>
        </div>
      </ScreenScroll>
    );
  }

  function GuildScreen() {
    const s = BABEL.story;
    const chars = [
      { name: "Mara Vance", role: "The wary scout", seat: 1 },
      { name: "You", role: "The reluctant leader", seat: 2 },
      { name: "Iris Bell", role: "The keeper of secrets", seat: 3 },
      { name: "Kai Okafor", role: "The one who can't swim", seat: 4 },
    ];
    return (
      <ScreenScroll>
        <div style={{ padding: "66px 24px 18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 8 }}>Your guild</div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em", color: "var(--ink-900)" }}>The Night Owls</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, color: "var(--ink-500)", marginTop: 6 }}>Reading <b style={{ color: "var(--ink-700)" }}>The Ember Gate</b> · Night {s.night} of {s.total}</div>
        </div>

        <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 16 }}>
          <Card elevation="sm" pad={6}>
            {chars.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderBottom: i < chars.length - 1 ? "1px solid var(--line)" : "none" }}>
                <Avatar name={c.name === "You" ? "Y" : c.name} seat={c.seat} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)" }}>{c.name}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, fontStyle: "italic", color: "var(--ink-500)" }}>{c.role}</div>
                </div>
                {c.name === "You" && <Badge tone="brand">You</Badge>}
              </div>
            ))}
          </Card>

          {/* The Hearth — group chat */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-400)", margin: "8px 6px 12px" }}>The Hearth</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BABEL.hearth.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <Avatar name={m.who} seat={m.seat} size={30} />
                  <div style={{ background: "var(--paper)", borderRadius: "18px 18px 18px 6px", padding: "10px 14px", boxShadow: "var(--shadow-sm)", maxWidth: 270 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: `var(--guild-${m.seat})`, marginBottom: 2 }}>{m.who}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, lineHeight: 1.4, color: "var(--ink-800,#3b362d)" }}>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScreenScroll>
    );
  }

  window.TonightScreen = TonightScreen;
  window.GuildScreen = GuildScreen;
  window.ScreenScroll = ScreenScroll;
})();
