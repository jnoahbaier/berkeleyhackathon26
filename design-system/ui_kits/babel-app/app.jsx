/* Talegate app — router shell. Mounts the interactive prototype. */
(function () {
  const { Phone, TabBar } = window;
  const { TonightScreen, GuildScreen } = window;
  const { ShelfScreen, DetailSheet } = window;
  const { SetupScreen, CharacterScreen } = window;
  const { ReaderScreen } = window;

  function App() {
    const [tab, setTab] = React.useState("tonight");
    const [overlay, setOverlay] = React.useState(null); // reader | setup | character
    const [detail, setDetail] = React.useState(null);

    const night = overlay === "reader";

    return (
      <Phone night={night}>
        {/* base tab screens */}
        {overlay === null && (
          <React.Fragment>
            {tab === "tonight" && <TonightScreen onRead={() => setOverlay("reader")} />}
            {tab === "shelf" && <ShelfScreen onPick={setDetail} />}
            {tab === "guild" && <GuildScreen />}
            <TabBar active={tab} onChange={(t) => { setTab(t); setDetail(null); }} />
            <DetailSheet story={detail} onClose={() => setDetail(null)} onStart={() => { setDetail(null); setOverlay("setup"); }} />
          </React.Fragment>
        )}

        {/* onboarding flow */}
        {overlay === "setup" && (
          <SetupScreen onBack={() => setOverlay(null)} onNext={() => setOverlay("character")} />
        )}
        {overlay === "character" && (
          <CharacterScreen onBack={() => setOverlay("setup")} onDone={() => { setTab("tonight"); setOverlay("reader"); }} />
        )}

        {/* reader */}
        {overlay === "reader" && (
          <ReaderScreen onExit={() => setOverlay(null)} />
        )}
      </Phone>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
