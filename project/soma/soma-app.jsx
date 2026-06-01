// SOMA — Functional demo shell.
// v0.6 changes:
//  · Color system: ONE brand palette (lime/coral/blue) × 3 intensities
//    (Vivid / Calm / Mono). Indigo and Lime no longer share colors.
//  · Tab bar with central + (BTWB-style) opens AddSheet
//  · AddSheet routes to: less-used screens (Records, Bitácora, Level)
//    AND opens modal sheets (Multiple Movements, Edit, Search)

const { useState } = React;
const { F5 } = window;
const { INTENSITIES, tokens } = window;
const { WordmarkWithMark } = window;
const {
  DashboardScreen, TrainScreen, EatScreen,
  RecordsScreen, JournalScreen, ProfileScreen, LevelScreen,
} = window;
const {
  AddSheet, DrawerMenu,
  MultipleMovementsScreen, SearchMovementsModal, EditMovementModal,
} = window;
const { ImportScreen } = window;

const SCREENS = {
  home:    DashboardScreen,
  train:   TrainScreen,
  eat:     EatScreen,
  records: RecordsScreen,
  journal: JournalScreen,
  me:      ProfileScreen,
  level:   LevelScreen,
  import:  ImportScreen,
};

// Phone frame
function PhoneFrame({ mode, children }) {
  return (
    <div style={{
      width: 360, height: 740, borderRadius: 52,
      background: '#000',
      padding: 8, boxSizing: 'border-box',
      boxShadow: mode === 'dark'
        ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
        : '0 40px 100px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
      flexShrink: 0, position: 'relative',
    }}>
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

function BrandPanel({ mode, t }) {
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
          color: c }}>Cuerpo<br/>Mente<br/>Tiempo</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: cMuted,
          lineHeight: 1.6, marginTop: 18, maxWidth: 240 }}>
          Tap the menu ☰ in any header to navigate. Floating + button opens
          quick-log. Holistic Habits are customizable.</div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9,
            fontWeight: 700, letterSpacing: '0.18em', color: cFaint,
            textTransform: 'uppercase' }}>active palette</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {[
              { c: t.accent,    lab: 'Pri' },
              { c: t.secondary, lab: 'Sec' },
              { c: t.tertiary,  lab: 'Ter' },
              { c: t.fg,        lab: 'Ink' },
              { c: t.surface2,  lab: 'Surf' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ width: '100%', height: 22, borderRadius: 4,
                  background: s.c, border: `1px solid ${cFaint}22` }}></div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7.5,
                  letterSpacing: '0.1em', color: cFaint, marginTop: 3,
                  textTransform: 'uppercase' }}>{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        paddingTop: 18, borderTop: `1px solid ${c}1A`,
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em', color: cFaint, textTransform: 'uppercase',
        lineHeight: 1.8,
      }}>
        <div>v0.6 · demo</div>
        <div>isotype: onda F5</div>
        <div>type: syne 800</div>
      </div>
    </div>
  );
}

function ControlPanel({ intensityId, setIntensityId, mode, setMode,
                        tab, setTab, openModal }) {
  const c        = mode === 'dark' ? '#F4F1EC' : '#15120E';
  const cMuted   = mode === 'dark' ? '#9A938A' : '#5F5B53';
  const cBorder  = mode === 'dark' ? '#2A2620' : '#D9D4C7';
  const cSurface = mode === 'dark' ? '#15130F' : '#FFFFFF';

  const tInt = tokens({ mode, intensityId });

  const screens = [
    { id: 'home',    label: 'Home' },
    { id: 'train',   label: 'Entrena' },
    { id: 'eat',     label: 'Come' },
    { id: 'records', label: 'Records' },
    { id: 'import',  label: 'Importar ↓' },
    { id: 'level',   label: 'Level ★' },
    { id: 'journal', label: 'Bitácora' },
    { id: 'me',      label: 'Yo' },
  ];

  const modals = [
    { id: 'tpl',    label: 'Multiple movements' },
    { id: 'search', label: 'Search movements' },
    { id: 'edit',   label: 'Edit movement' },
  ];

  return (
    <div style={{
      width: 240, flexShrink: 0, color: c,
      display: 'flex', flexDirection: 'column', gap: 22,
      padding: '20px 0',
    }}>
      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          Intensity</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.values(INTENSITIES).map(int => {
            const active = intensityId === int.id;
            // Show same 3 colors at this intensity
            const sample = tokens({ mode, intensityId: int.id });
            const [name, sub] = int.label.split(' · ');
            return (
              <button key={int.id} onClick={() => setIntensityId(int.id)}
                style={{
                  background: active ? cSurface : 'transparent',
                  border: `1px solid ${active ? c : cBorder}`,
                  color: c, padding: '10px 12px', borderRadius: 12,
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'DM Sans', fontSize: 13,
                }}>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  <div style={{ width: 14, height: 22, borderRadius: '7px 0 0 7px',
                    background: sample.accent }}></div>
                  <div style={{ width: 7, height: 22,
                    background: sample.secondary }}></div>
                  <div style={{ width: 7, height: 22, borderRadius: '0 7px 7px 0',
                    background: sample.tertiary }}></div>
                </div>
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

      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          Mode</div>
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

      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          Screen</div>
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

      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: cMuted }}>
          BTWB Flows</div>
        <div style={{ marginTop: 10, display: 'flex',
          flexDirection: 'column', gap: 4 }}>
          {modals.map(m => (
            <button key={m.id} onClick={() => openModal(m.id)}
              style={{
                border: `1px dashed ${cBorder}`,
                background: 'transparent', color: c,
                padding: '8px 10px', borderRadius: 8,
                fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 600,
                cursor: 'pointer', textAlign: 'left',
              }}>{m.label} ↗</button>
          ))}
        </div>
      </div>

      <a href="design-rules.html" target="_blank" style={{
        marginTop: 'auto',
        padding: '10px 12px', borderRadius: 10,
        background: 'transparent', border: `1px dashed ${cBorder}`,
        color: c, textDecoration: 'none',
        fontFamily: 'JetBrains Mono', fontSize: 9.5, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        textAlign: 'center',
      }}>↗ design rules</a>
    </div>
  );
}

function SomaDemo() {
  const [tab, setTab] = useState('home');
  const [intensityId, setIntensityId] = useState('vivid');
  const [mode, setMode] = useState('dark');
  const [addSheet, setAddSheet] = useState(false);
  const [drawer, setDrawer] = useState(false);
  // Modal stack: 'tpl' | 'search' | 'edit' | null
  const [modal, setModal] = useState(null);

  const t = tokens({ mode, intensityId });
  const Screen = SCREENS[tab] || DashboardScreen;
  const screenProps = {
    Mark: F5, weight: 800, font: 'syne', t,
    onTab: setTab,
    onPlus: () => setAddSheet(true),
    onMenu: () => setDrawer(true),
  };

  function handleAddNav(action) {
    // Quick-log + navigation routing from the AddSheet
    if (action.startsWith('log:')) {
      const kind = action.slice(4);
      if (kind === 'workout')      setModal('tpl');
      else if (kind === 'meal')    setTab('eat');
      else if (kind === 'mood')    setTab('journal');
      else if (kind === 'water')   setTab('eat');
      else if (kind === 'weight')  setTab('me');
      return;
    }
    // Navigation
    if (['records', 'level', 'journal', 'me', 'home', 'train', 'eat', 'import']
        .includes(action)) {
      setTab(action);
      return;
    }
    // BTWB modals
    if (action === 'movement')   setModal('tpl');
    if (action === 'editmove')   setModal('edit');
    if (action === 'searchmove') setModal('search');
  }

  const ambient = mode === 'dark'
    ? 'radial-gradient(ellipse at 25% 15%, #1d1a14, #08070500 65%), #050505'
    : 'radial-gradient(ellipse at 25% 15%, #FFFEFB, #EFEBE0 65%), #E7E3D6';

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: ambient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 56, padding: '40px 56px', boxSizing: 'border-box',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      transition: 'background 0.3s',
    }}>
      <BrandPanel mode={mode} t={t}/>
      <PhoneFrame mode={mode}>
        <Screen {...screenProps}/>
        {/* Overlays — rendered INSIDE the phone frame */}
        <DrawerMenu t={t} open={drawer}
          onClose={() => setDrawer(false)}
          tab={tab} onTab={setTab} Mark={F5}/>
        <AddSheet t={t} open={addSheet}
          onClose={() => setAddSheet(false)}
          onNav={handleAddNav}/>
        {modal === 'tpl' && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 80,
            background: t.bg }}>
            <MultipleMovementsScreen t={t}
              onClose={() => setModal(null)}
              onPick={tpl => { setModal('edit'); }}/>
          </div>
        )}
        <SearchMovementsModal t={t} open={modal === 'search'}
          onClose={() => setModal(null)}
          onPick={(name) => setModal('edit')}/>
        <EditMovementModal t={t} open={modal === 'edit'}
          movement="Snatch"
          onClose={() => setModal(null)}
          onUpdate={() => setModal(null)}/>
      </PhoneFrame>
      <ControlPanel
        intensityId={intensityId} setIntensityId={setIntensityId}
        mode={mode} setMode={setMode}
        tab={tab} setTab={setTab}
        openModal={setModal}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SomaDemo/>);
