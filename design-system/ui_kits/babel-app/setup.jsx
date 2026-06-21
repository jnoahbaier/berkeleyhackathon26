/* Guild setup + Character creation. Exposes window.SetupScreen, window.CharacterScreen */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const { Button, Input, Stepper, SegmentedControl, Avatar, Tag, Badge, IconButton } = DS;
  const { Icon, BABEL, ScreenScroll } = window;

  function StepHead({ step, total, title, sub, onBack }) {
    return (
      <div style={{ padding: "60px 22px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <IconButton label="Back" variant="plain" size="sm" onClick={onBack}><Icon name="arrow-left" size={18} /></IconButton>
          <div style={{ flex: 1, display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i < step ? "var(--candle-500)" : "var(--line)" }} />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 8 }}>Step {step} of {total}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 28, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--ink-900)" }}>{title}</div>
        {sub && <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.5, color: "var(--ink-500)", margin: "10px 0 0" }}>{sub}</p>}
      </div>
    );
  }

  function SetupScreen({ onBack, onNext }) {
    const [players, setPlayers] = React.useState(4);
    const [pages, setPages] = React.useState(8);
    const [mode, setMode] = React.useState("Read");
    const [tone, setTone] = React.useState("med");
    const invited = BABEL.guild.members;
    return (
      <ScreenScroll>
        <StepHead step={1} total={2} title="Set the terms of your tale." sub="These keep four friends on the same page — literally." onBack={onBack} />
        <div style={{ padding: "22px 18px 0", display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Invite */}
          <div>
            <Label>Your guild</Label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {invited.map((m, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <Avatar name={m.name === "You" ? "Y" : m.name} seat={m.seat} size={50} />
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)", marginTop: 6, maxWidth: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name.split(" ")[0]}</div>
                </div>
              ))}
              <div style={{ textAlign: "center" }}>
                <button style={{ width: 50, height: 50, borderRadius: "50%", border: "1.5px dashed var(--line-strong)", background: "transparent", color: "var(--ink-400)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={22} /></button>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-400)", marginTop: 6 }}>Invite</div>
              </div>
            </div>
          </div>

          {/* Cadence */}
          <Field>
            <div>
              <Label>Pages per night</Label>
              <SubLabel>Everyone reads the same beat. No one falls behind.</SubLabel>
            </div>
            <Stepper value={pages} min={4} max={14} suffix="pages" onChange={setPages} />
          </Field>

          <Field>
            <div>
              <Label>Players</Label>
              <SubLabel>One character each.</SubLabel>
            </div>
            <Stepper value={players} min={2} max={4} suffix="" onChange={setPlayers} />
          </Field>

          <div>
            <Label>How you'll read</Label>
            <SegmentedControl options={["Read", "Listen"]} value={mode} onChange={setMode} />
          </div>

          <div>
            <Label>Lean the world toward…</Label>
            <SubLabel>A starting tone — your tastes do the rest.</SubLabel>
            <SegmentedControl
              options={[{ value: "med", label: "Medieval" }, { value: "sci", label: "Sci-fi" }, { value: "cosy", label: "Cosy" }]}
              value={tone} onChange={setTone} />
          </div>

          <div style={{ paddingTop: 4, paddingBottom: 8 }}>
            <Button variant="primary" full size="lg" onClick={onNext}>Next — build your character</Button>
          </div>
        </div>
      </ScreenScroll>
    );
  }

  const TASTES = ["The Lord of the Rings", "Dune", "The Witcher", "Studio Ghibli", "Disco Elysium", "Le Guin", "Mistborn", "Hollow Knight", "Brooklyn 99", "Murakami"];

  function CharacterScreen({ onBack, onDone }) {
    const [name, setName] = React.useState("");
    const [picked, setPicked] = React.useState(["The Lord of the Rings", "Disco Elysium", "Studio Ghibli"]);
    const [trait, setTrait] = React.useState("loyal");
    const toggle = (t) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
    return (
      <ScreenScroll>
        <StepHead step={2} total={2} title="Now — who are you, inside it?" sub="Your favourites quietly shape your character and the world you wake in." onBack={onBack} />
        <div style={{ padding: "22px 18px 0", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--paper)", borderRadius: "var(--radius-lg)", padding: 16, boxShadow: "var(--shadow-sm)" }}>
            <Avatar name="Y" seat={2} size={56} ring />
            <div style={{ flex: 1 }}>
              <Input placeholder="Name your character" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Your taste profile</Label>
            <SubLabel>Books, films, games — pick what's yours.</SubLabel>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              {TASTES.map((t) => (
                <Tag key={t} selected={picked.includes(t)} onClick={() => toggle(t)}>{t}</Tag>
              ))}
            </div>
          </div>

          <div>
            <Label>At your core, you are…</Label>
            <SegmentedControl
              options={[{ value: "loyal", label: "Loyal" }, { value: "cunning", label: "Cunning" }, { value: "reckless", label: "Reckless" }]}
              value={trait} onChange={setTrait} />
          </div>

          <div style={{ background: "var(--gradient-dusk)", borderRadius: "var(--radius-lg)", padding: 18 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(40,32,22,0.6)", marginBottom: 6 }}>Talegate will weave</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.5, color: "var(--ink-900)" }}>A <b>loyal</b> wanderer with a mapmaker's eye and a soft spot for lost things — at home in slow, painted worlds.</div>
          </div>

          <div style={{ paddingBottom: 8 }}>
            <Button variant="accent" full size="lg" iconLeft={<Icon name="sparkles" size={19} stroke={2} />} onClick={onDone}>Weave the first chapter</Button>
          </div>
        </div>
      </ScreenScroll>
    );
  }

  function Label({ children }) {
    return <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)", marginBottom: 10 }}>{children}</div>;
  }
  function SubLabel({ children }) {
    return <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-400)", marginBottom: 12, marginTop: -6 }}>{children}</div>;
  }
  function Field({ children }) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>{children}</div>;
  }

  window.SetupScreen = SetupScreen;
  window.CharacterScreen = CharacterScreen;
})();
