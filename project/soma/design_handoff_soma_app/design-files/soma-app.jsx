// SOMA — Functional demo shell.
// Locked: Onda (F5) + Syne 800. Live: 4 accent colors × 2 modes.
// Phone frame in center, brand panel left, control panel right.
// Tab bar + Dashboard widgets are clickable to navigate between screens.

const { useState } = React;
const { F5 } = window;
const { ACCENTS, tokens } = window;
const { WordmarkWithMark } = window;
const {
  DashboardScreen, TrainScreen, EatScreen,
  RecordsScreen, JournalScreen, ProfileScreen,
} = window;

const SCREENS = {
  home:    DashboardScreen,
  train:   TrainScreen,
  eat:     EatScreen,
  records: RecordsScreen,
  journal: JournalScreen,
  me:      ProfileScreen,
};

// ── Phone frame ──────────────────────────────────────────────────
function PhoneFrame({ mode, children }) {
  return (
    <div style={{
      width: 360, height: 740, borderRadius: 52,
      background: '#000',
      padding: 8, boxSizing: 'border-box',
      boxShadow: mode === 'dark'
        ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
        : '0 40px 100px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* notch */}
      <div style={{
        position: 'absolute', top: 14, left: '50%',
        transform: 'translateX(-50%)',
        width: 110, height: 28, borderRadius: 14,
        background: '#000', zIndex: 5,
      }}></div>
      <div style={{
        width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden',
        position: 'relative', background: '#000',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Brand panel (left) ───────────────────────────────────────────
function BrandPanel({ mode }) {
  const c       = mode === 'dark' ? '#F4F1EC' : '#15120E';
  const cMuted  = mode === 'dark' ? '#9A938A' : '#5F5B53';
  const cFaint  = mode === 'dark' ? '#6B655B' : '#9A968F';
  return (
    <div style={{
      width: 260, flexShrink: 0, color: c,
      display: 'flex', flexDirection: 'column', gap: 20,
      alignSelf: 'stretch', justifyContent: 'space-between',
      padding: '20px 0',
    }}>
      <div>
        <WordmarkWithMark font="syne" Mark={F5} size={56} color={c}/>
        <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 19,
          letterSpacing: '-0.025em', lineHeight: 1.18, marginTop: 24,
          color: c }}>
          Cuerpo<br/>Mente<br/>Tiempo</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: cMuted,
          lineHeight: 1.6, marginTop: 18, maxWidth: 240 }}>
          Demo funcional. Toca el tab bar y los widgets para navegar.
          Cambia color y modo en el panel de la derecha.</div>
      </div>
      <div style={{
        paddingTop: 18, borderTop: `1px solid ${c}1A`,
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em', color: cFaint, textTransform: 'uppercase',
        lineHeight: 1.8,
      }}>
        <div>v0.4 \u00b7 demo</div>
        <div>isotipo: onda</div>
        <div>type: syne 800</div>
      </div>
    </div>
  );
}

// ── Control panel (right) ────────────────────────────────────────
function ControlPanel({ accentId, setAccentId, mode, setMode, tab, setTab }) {
  const c        = mode === 'dark' ? '#F4F1EC' : '#15120E';
  const cMuted   = mode === 'dark' ? '#9A938A' : '#5F5B53';
  const cBorder  = mode === 'dark' ? '#2A2620' : '#E3E0D9';
  const cSurface = mode === 'dark' ? '#15130F' : '#FFFFFF';

  const screens = [
    { id: 'home',    label: 'Home' },
    { id: 'train',   label: 'Entrena' },
    { id: 'eat',     label: 'Come' },
    { id: 'records', label: 'Records' },
    { id: 'journal', label: 'Bitácora' },
    { id: 'me',      label: 'Yo' },
  ];

  return (
    <div style={{
      width: 240, flexShrink: 0, color: c,
      display: 'flex', flexDirection: 'column', gap: 22,
      padding: '20px 0',
    }}>
      {/* Color del app */}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          Color del app</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(ACCENTS).map(([id, a]) => {
            const active = accentId === id;
            const swatch = id === 'bone' ? c : a.hex;
            const [name, sub] = a.label.split(' · ');
            return (
              <button key={id} onClick={() => setAccentId(id)}
                style={{
                  background: active ? cSurface : 'transparent',
                  border: `1px solid ${active ? c : cBorder}`,
                  color: c, padding: '10px 12px', borderRadius: 12,
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'DM Sans', fontSize: 13,
                }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: swatch,
                  border: id === 'bone' ? `1px solid ${cBorder}` : 'none',
                }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: active ? 700 : 500,
                    textTransform: 'capitalize' }}>{name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8.5,
                    fontWeight: 600, letterSpacing: '0.16em',
                    color: cMuted, textTransform: 'uppercase',
                    marginTop: 1 }}>{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modo */}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          Modo</div>
        <div style={{ marginTop: 10, display: 'flex', gap: 4,
          padding: 3, background: cSurface, borderRadius: 999,
          border: `1px solid ${cBorder}` }}>
          {['dark', 'light'].map(m => {
            const on = mode === m;
            return (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 999, border: 'none',
                  background: on ? c : 'transparent',
                  color: on ? (m === 'dark' ? '#0A0908' : '#F6F5F2') : c,
                  fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize',
                }}>{m}</button>
            );
          })}
        </div>
      </div>

      {/* Pantalla actual / jump */}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          Pantalla</div>
        <div style={{ marginTop: 10, display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {screens.map(s => {
            const on = tab === s.id;
            return (
              <button key={s.id} onClick={() => setTab(s.id)}
                style={{
                  border: `1px solid ${on ? c : cBorder}`,
                  background: on ? c : 'transparent',
                  color: on ? (mode === 'dark' ? '#0A0908' : '#F6F5F2') : c,
                  padding: '8px 10px', borderRadius: 8,
                  fontFamily: 'DM Sans', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', textAlign: 'left',
                }}>{s.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────
function SomaDemo() {
  const [tab, setTab] = useState('home');
  const [accentId, setAccentId] = useState('lime');
  const [mode, setMode] = useState('dark');

  const t = tokens({ mode, accentId });
  const Screen = SCREENS[tab] || DashboardScreen;
  const screenProps = {
    Mark: F5, weight: 800, font: 'syne', t,
    onTab: setTab,
  };

  const ambient = mode === 'dark'
    ? 'radial-gradient(ellipse at 25% 15%, #1d1a14, #08070500 65%), #050505'
    : 'radial-gradient(ellipse at 25% 15%, #FFFEFB, #F0EDE3 65%), #ECE9DF';

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: ambient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 56, padding: '40px 56px', boxSizing: 'border-box',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      transition: 'background 0.3s',
    }}>
      <BrandPanel mode={mode}/>
      <PhoneFrame mode={mode}>
        <Screen {...screenProps}/>
      </PhoneFrame>
      <ControlPanel
        accentId={accentId} setAccentId={setAccentId}
        mode={mode} setMode={setMode}
        tab={tab} setTab={setTab}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SomaDemo/>);
