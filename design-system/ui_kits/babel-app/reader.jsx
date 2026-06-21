/* Reader — night reading + the nightly choice. Exposes window.ReaderScreen */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const { Button, Choice, Badge, IconButton, ProgressTrack, GuildDots, Avatar } = DS;
  const { Icon, BABEL } = window;

  function ReaderScreen({ onExit }) {
    const ch = BABEL.chapter;
    const [phase, setPhase] = React.useState("read"); // read | choose | sealed
    const [pick, setPick] = React.useState(null);
    const scroller = React.useRef(null);

    const dots = BABEL.guild.members.map((m, i) => ({ name: m.name, seat: m.seat, done: phase === "sealed" ? i !== 2 : i < 1 }));

    return (
      <div style={{ position: "absolute", inset: 0, background: "var(--night-900)", color: "var(--night-text)" }}>
        {/* glow */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320, background: "var(--gradient-glow)", opacity: 0.5, pointerEvents: "none" }} />

        {/* top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "58px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, var(--night-900) 55%, rgba(19,17,32,0))" }}>
          <IconButton label="Close" variant="plain" size="sm" onNight onClick={onExit}><Icon name="chevron-down" size={20} /></IconButton>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--night-muted)" }}>{ch.label}</span>
          <IconButton label="Type size" variant="plain" size="sm" onNight><Icon name="a-large-small" size={20} /></IconButton>
        </div>

        {/* reading column */}
        <div ref={scroller} style={{ position: "absolute", inset: 0, overflowY: "auto", padding: "108px 26px 200px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--candle-400)", marginBottom: 18, textAlign: "center" }}>· {ch.title} ·</div>
          {ch.paras.map((p, i) => (
            <p key={i} style={{ fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.78, color: "var(--night-text)", margin: "0 0 22px", textWrap: "pretty", maxWidth: "34rem" }}>
              {i === 0 ? <span style={{ float: "left", fontSize: 58, lineHeight: 0.86, fontWeight: 600, paddingRight: 12, paddingTop: 6, color: "var(--candle-400)", fontFamily: "var(--font-serif)" }}>{p[0]}</span> : null}
              {i === 0 ? p.slice(1) : p}
            </p>
          ))}
          <div style={{ textAlign: "center", padding: "8px 0 4px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--night-muted)" }}>— your word is needed —</div>
        </div>

        {/* bottom — choice trigger or sheet */}
        {phase === "read" && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 22px 28px", background: "linear-gradient(0deg, var(--night-900) 60%, rgba(19,17,32,0))", zIndex: 20 }}>
            <Button variant="accent" full size="lg" iconLeft={<Icon name="git-fork" size={19} stroke={2} />} onClick={() => setPhase("choose")}>The night forks — choose</Button>
          </div>
        )}

        {(phase === "choose" || phase === "sealed") && (
          <div style={{ position: "absolute", inset: 0, zIndex: 40, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div onClick={() => phase === "choose" && setPhase("read")} style={{ position: "absolute", inset: 0, background: "rgba(8,6,14,0.6)" }} />
            <div style={{ position: "relative", background: "var(--night-800)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", padding: "14px 20px 26px", boxShadow: "var(--shadow-xl)", borderTop: "1px solid var(--night-600)" }}>
              <div style={{ width: 40, height: 5, borderRadius: 999, background: "var(--night-600)", margin: "0 auto 16px" }} />
              {phase === "choose" ? (
                <React.Fragment>
                  <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22, color: "var(--night-text)", marginBottom: 4 }}>The gate, or the river?</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--night-muted)", marginBottom: 16 }}>Your word locks at 10pm</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                    {ch.choices.map((c) => (
                      <Choice key={c.letter} letter={c.letter} flavor={c.flavor} meta={c.tally} selected={pick === c.letter} onClick={() => setPick(c.letter)}>{c.text}</Choice>
                    ))}
                  </div>
                  <Button variant="accent" full size="lg" disabled={!pick} onClick={() => setPhase("sealed")}>Seal my word</Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ textAlign: "center", padding: "6px 0 4px" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--candle-500)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <Icon name="check" size={28} color="#1a130a" stroke={2.6} />
                    </div>
                    <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22, color: "var(--night-text)", marginBottom: 6 }}>Your word is sealed.</div>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.5, color: "var(--night-soft)", margin: "0 auto 20px", maxWidth: 300 }}>The others have until 10pm. Tomorrow night, the road answers.</p>
                  </div>
                  <div style={{ background: "var(--night-700)", borderRadius: "var(--radius-lg)", padding: "16px 18px", marginBottom: 16 }}>
                    <GuildDots members={dots} onNight label="3 of 4 have chosen" />
                  </div>
                  <Button variant="secondary" onNight full size="lg" onClick={onExit}>Goodnight</Button>
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  window.ReaderScreen = ReaderScreen;
})();
