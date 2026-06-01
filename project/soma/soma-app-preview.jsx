// SOMA — App preview canvas + Tweaks.
// Three sections:
//   01 · Logo matrix (2 fonts × 2 isotypes = 4 combinations)
//   02 · Accent color exploration (4 candidates × light/dark)
//   03 · 6 app screens in the active configuration

const { DesignCanvas, DCSection, DCArtboard } = window;
const { F1, F5, FINAL_MARKS } = window;
const { WordmarkWithMark, InlineLockup, FONT_OPTIONS } = window;
const { ACCENTS, tokens } = window;
const {
  DashboardScreen, TrainScreen, EatScreen,
  RecordsScreen, JournalScreen, ProfileScreen,
} = window;
const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, useTweaks } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mark": "F5",
  "font": "syne",
  "accent": "lime",
  "mode": "dark"
}/*EDITMODE-END*/;

const MARK_OPTIONS = {
  F1: { Mark: F1, label: 'F1 · Sonrisa sutil' },
  F5: { Mark: F5, label: 'F5 · Onda' },
};
const FONT_FINALISTS = {
  syne:    FONT_OPTIONS.syne,    // 800
  syne700: FONT_OPTIONS.syne700, // 700
};

// ── A · Logo matrix tile ─────────────────────────────────────────
function LogoTile({ Mark, fontKey, inverted = false }) {
  const bg = inverted ? '#0A0908' : '#FAF8F3';
  const fg = inverted ? '#F4F1EC' : '#15120E';
  const sub = inverted ? '#9A938A' : '#6B655B';
  const f = FONT_OPTIONS[fontKey];
  const markLabel = Mark === F1 ? 'F1 · sonrisa sutil' : 'F5 · onda';
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: fg,
      padding: 26, boxSizing: 'border-box', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      <div style={{
        position: 'absolute', top: 16, left: 20,
        fontFamily: 'JetBrains Mono', fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.16em', color: sub,
      }}>{f.label.toUpperCase()} · {markLabel.toUpperCase()}</div>
      <WordmarkWithMark font={fontKey} Mark={Mark} size={104} color={fg} />
    </div>
  );
}

// ── B · Accent swatch tile ───────────────────────────────────────
function AccentTile({ accentId, mode }) {
  const t = tokens({ mode, accentId });
  const a = ACCENTS[accentId];
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg, color: t.fg,
      padding: 22, boxSizing: 'border-box', position: 'relative',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      border: `1px solid ${t.divider}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
            letterSpacing: '0.16em', fontWeight: 700, color: t.fgMuted,
            textTransform: 'uppercase' }}>{mode}</div>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22,
            letterSpacing: '-0.035em', marginTop: 6 }}>{a.label}</div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 11.5, color: t.fgMuted,
            marginTop: 4 }}>{a.note}</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: t.accent,
          boxShadow: `0 0 0 4px ${t.bg}, 0 0 0 5px ${t.border}`,
        }}></div>
      </div>

      {/* Sample button + chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          padding: '10px 16px', borderRadius: 999,
          background: t.accent, color: t.onAccent,
          fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12,
        }}>Empezar WOD</div>
        <div style={{
          padding: '6px 10px', borderRadius: 4,
          background: t.accent, color: t.onAccent,
          fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 9.5,
          letterSpacing: '0.14em',
        }}>PR</div>
        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700,
          fontSize: 13, color: t.accent }}>87/100</span>
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 9.5, fontWeight: 700,
        letterSpacing: '0.18em', color: t.fgFaint,
      }}>{a.hex.toUpperCase()}</div>
    </div>
  );
}

// ── C · App preview ──────────────────────────────────────────────
function App() {
  const [v, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const Mark = MARK_OPTIONS[v.mark]?.Mark || F5;
  const fontKey = v.font;
  const t = tokens({ mode: v.mode, accentId: v.accent });
  const screenProps = { Mark, weight: FONT_FINALISTS[fontKey].weight, t, font: fontKey };

  return (
    <>
      <DesignCanvas>
        {/* ─── 01 · Logo matrix ─── */}
        <DCSection id="logo-matrix"
          title="01 · Logo · 2 fonts × 2 isotipos"
          subtitle="Las 4 combinaciones que quedan en juego. Mismo wordmark, fusión con la O. Compara peso, gesto y carácter — el resto del app va a heredar el font + isotipo que elijas.">
          {Object.keys(FONT_FINALISTS).map(fontKey =>
            Object.keys(MARK_OPTIONS).map(markId => (
              <DCArtboard key={`${fontKey}-${markId}`}
                id={`logo-${fontKey}-${markId}`}
                label={`${FONT_FINALISTS[fontKey].label} · ${MARK_OPTIONS[markId].label}`}
                width={460} height={220}>
                <LogoTile Mark={MARK_OPTIONS[markId].Mark} fontKey={fontKey} />
              </DCArtboard>
            ))
          )}
          {/* Inverted strip — same 4, on dark */}
          {Object.keys(FONT_FINALISTS).map(fontKey =>
            Object.keys(MARK_OPTIONS).map(markId => (
              <DCArtboard key={`logo-inv-${fontKey}-${markId}`}
                id={`logo-inv-${fontKey}-${markId}`}
                label={`${FONT_FINALISTS[fontKey].label} · ${MARK_OPTIONS[markId].label} · oscuro`}
                width={460} height={220}>
                <LogoTile Mark={MARK_OPTIONS[markId].Mark} fontKey={fontKey} inverted />
              </DCArtboard>
            ))
          )}
        </DCSection>

        {/* ─── 02 · Accent color exploration ─── */}
        <DCSection id="accents"
          title="02 · Color de marca · 4 candidatos × 2 modos"
          subtitle="Adiós a los temas múltiples. Una sola marca, dos modos. Estos 4 colores son los candidatos serios: cada uno define una personalidad muy distinta. Mira la misma muestra (botón, chip PR, número) en cada uno.">
          {Object.keys(ACCENTS).map(accentId => (
            <DCArtboard key={`acc-${accentId}-dark`}
              id={`acc-${accentId}-dark`}
              label={`${ACCENTS[accentId].label} · dark`}
              width={340} height={240}>
              <AccentTile accentId={accentId} mode="dark" />
            </DCArtboard>
          ))}
          {Object.keys(ACCENTS).map(accentId => (
            <DCArtboard key={`acc-${accentId}-light`}
              id={`acc-${accentId}-light`}
              label={`${ACCENTS[accentId].label} · light`}
              width={340} height={240}>
              <AccentTile accentId={accentId} mode="light" />
            </DCArtboard>
          ))}
        </DCSection>

        {/* ─── 03 · App preview · active config ─── */}
        <DCSection id="app-preview"
          title={`03 · El app · ${ACCENTS[v.accent].label} · ${v.mode}`}
          subtitle="6 pantallas clave en la configuración activa. Cambia marca, font, color y modo en Tweaks — todo el app se actualiza en vivo.">

          <DCArtboard id="scr-dashboard" label="Dashboard · home"
            width={320} height={680}>
            <DashboardScreen {...screenProps} />
          </DCArtboard>

          <DCArtboard id="scr-train" label="Entrena · WOD"
            width={320} height={680}>
            <TrainScreen {...screenProps} />
          </DCArtboard>

          <DCArtboard id="scr-eat" label="Come · macros + comidas"
            width={320} height={680}>
            <EatScreen {...screenProps} />
          </DCArtboard>

          <DCArtboard id="scr-records" label="Records · analyze"
            width={320} height={680}>
            <RecordsScreen {...screenProps} />
          </DCArtboard>

          <DCArtboard id="scr-journal" label="Bitácora · journal"
            width={320} height={680}>
            <JournalScreen {...screenProps} />
          </DCArtboard>

          <DCArtboard id="scr-profile" label="Yo · profile"
            width={320} height={680}>
            <ProfileScreen {...screenProps} />
          </DCArtboard>
        </DCSection>

        {/* ─── 04 · Mode comparison · same screen, both modes ─── */}
        <DCSection id="mode-compare"
          title="04 · Dashboard · lado a lado · light y dark"
          subtitle="La pantalla más importante (Dashboard) en ambos modos con la configuración activa. Si funciona acá, funciona en todo.">
          <DCArtboard id="cmp-dark" label="Dashboard · dark"
            width={320} height={680}>
            <DashboardScreen
              {...screenProps}
              t={tokens({ mode: 'dark', accentId: v.accent })} />
          </DCArtboard>
          <DCArtboard id="cmp-light" label="Dashboard · light"
            width={320} height={680}>
            <DashboardScreen
              {...screenProps}
              t={tokens({ mode: 'light', accentId: v.accent })} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {/* ─── Tweaks panel ─── */}
      <TweaksPanel title="Tweaks · SOMA">
        <TweakSection label="Marca activa">
          <TweakRadio
            label="Isotipo"
            value={v.mark}
            options={[
              { value: 'F1', label: 'Sonrisa' },
              { value: 'F5', label: 'Onda' },
            ]}
            onChange={(x) => setTweak('mark', x)}
          />
          <TweakRadio
            label="Font"
            value={v.font}
            options={[
              { value: 'syne', label: 'Syne 800' },
              { value: 'syne700', label: 'Syne 700' },
            ]}
            onChange={(x) => setTweak('font', x)}
          />
        </TweakSection>

        <TweakSection label="Color del app">
          <TweakSelect
            label="Acento"
            value={v.accent}
            options={Object.entries(ACCENTS).map(([k, a]) => ({
              value: k, label: a.label,
            }))}
            onChange={(x) => setTweak('accent', x)}
          />
          <TweakRadio
            label="Modo"
            value={v.mode}
            options={[
              { value: 'dark',  label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
            onChange={(x) => setTweak('mode', x)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
