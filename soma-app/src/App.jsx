import { useState } from 'react';
import { useTheme, INTENSITIES, computeTokens } from './theme.jsx';
import { F5, WordmarkWithMark } from './marks.jsx';
import { DrawerMenu, AddSheet } from './chrome.jsx';

import { DashboardScreen } from './screens/Dashboard.jsx';
import { TrainScreen }     from './screens/Train.jsx';
import { EatScreen }       from './screens/Eat.jsx';
import { RecordsScreen }   from './screens/Records.jsx';
import { LevelScreen }     from './screens/Level.jsx';
import { ProfileScreen }   from './screens/Profile.jsx';
import { JournalScreen }   from './screens/Journal.jsx';
import { ImportScreen }    from './screens/Import.jsx';
import { SupplementsScreen }  from './screens/Supplements.jsx';
import { TravelScreen }       from './screens/Travel.jsx';
import { HealthScreen }       from './screens/Health.jsx';
import { AnalyticsScreen }    from './screens/Analytics.jsx';
import { PRTrackerScreen }    from './screens/PRTracker.jsx';
import { WodLoggerScreen }    from './screens/WodLogger.jsx';
import { OnboardingScreen }   from './screens/Onboarding.jsx';

const SCREENS = {
  home:        DashboardScreen,
  train:       TrainScreen,
  eat:         EatScreen,
  records:     RecordsScreen,
  level:       LevelScreen,
  me:          ProfileScreen,
  journal:     JournalScreen,
  import:      ImportScreen,
  supplements: SupplementsScreen,
  travel:      TravelScreen,
  onboarding:  OnboardingScreen,
  prtracker:   PRTrackerScreen,
  wodlogger:   WodLoggerScreen,
  health:      HealthScreen,
  analytics:   AnalyticsScreen,
};

const SCREEN_LIST = [
  { id:'home',        label:'Home' },
  { id:'train',       label:'Entrena' },
  { id:'eat',         label:'Come' },
  { id:'records',     label:'Records' },
  { id:'journal',     label:'Bitácora' },
  { id:'level',       label:'Level ★' },
  { id:'import',      label:'Importar ↓' },
  { id:'supplements', label:'Suplementos' },
  { id:'health',      label:'Salud' },
  { id:'prtracker',   label:'PR Tracker' },
  { id:'wodlogger',   label:'WOD Logger' },
  { id:'travel',      label:'Travel Mode' },
  { id:'analytics',   label:'Analytics' },
  { id:'me',          label:'Yo' },
  { id:'onboarding',  label:'Onboarding' },
];

// ─── BTWB Modals (inline stubs) ───────────────────────────────────
function MovementModal({ t, title, onClose, children }) {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:80,
      background:t.bg, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'44px 20px 12px', display:'flex', alignItems:'center',
        justifyContent:'space-between' }}>
        <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:20,
          letterSpacing:'-0.03em', color:t.fg }}>{title}</div>
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%',
          border:'none', background:t.surface, color:t.fg, cursor:'pointer',
          fontFamily:'inherit', fontSize:18, display:'flex', alignItems:'center',
          justifyContent:'center' }}>×</button>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'0 20px 40px' }}>{children}</div>
    </div>
  );
}

const WOD_TEMPLATES = [
  { id:'amrap',  lab:'AMRAP',              sub:'As Many Rounds As Possible', col:'eat' },
  { id:'emom',   lab:'EMOM',               sub:'Every Minute On the Minute', col:'records' },
  { id:'fortime',lab:'For Time',            sub:'Race the clock',             col:'train' },
  { id:'rft',    lab:'Rounds for Time',     sub:'Set rounds, race the clock', col:'train' },
  { id:'tabata', lab:'Tabata',              sub:'20s on / 10s off · 8 rounds',col:'records' },
  { id:'rftvary',lab:'RFT · Varying Reps', sub:'e.g. 21-15-9',              col:'eat' },
];

function MultipleMovementsModal({ t, onClose, onPick }) {
  return (
    <MovementModal t={t} title="Multiple Movements" onClose={onClose}>
      <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700,
        letterSpacing:'0.18em', color:t.fgMuted, textTransform:'uppercase',
        marginBottom:10 }}>Choose a workout template</div>
      {WOD_TEMPLATES.map(tpl => (
        <button key={tpl.id} onClick={() => onPick(tpl)}
          style={{ width:'100%', marginBottom:6, padding:'14px 16px', borderRadius:14,
            border:'none', background:t.surface, color:t.fg, cursor:'pointer',
            textAlign:'left', display:'flex', alignItems:'center', gap:12,
            fontFamily:'inherit' }}>
          <div style={{ width:10, height:10, borderRadius:'50%',
            background:t.pillar[tpl.col] || t.accent, flexShrink:0 }}/>
          <div>
            <div style={{ fontFamily:t.fonts.body, fontWeight:700, fontSize:14, color:t.fg }}>{tpl.lab}</div>
            <div style={{ fontFamily:t.fonts.body, fontSize:12, color:t.fgMuted, marginTop:2 }}>{tpl.sub}</div>
          </div>
        </button>
      ))}
    </MovementModal>
  );
}

const MOVEMENTS = ['Snatch','Clean & Jerk','Back Squat','Front Squat','Deadlift',
  'Pull-up','Muscle-up','Handstand Push-up','Box Jump','Thruster','Wall Ball','Double-Under'];

function SearchMovementsModal({ t, open, onClose, onPick }) {
  const [q, setQ] = useState('');
  if (!open) return null;
  const hits = MOVEMENTS.filter(m => m.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position:'absolute', inset:0, zIndex:90, background:t.bg }}>
      <div style={{ padding:'44px 20px 12px', display:'flex', alignItems:'center', gap:12 }}>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search movements..."
          style={{ flex:1, padding:'10px 14px', borderRadius:12, border:`1px solid ${t.divider}`,
            background:t.surface, color:t.fg, fontFamily:t.fonts.body, fontSize:14,
            outline:'none' }}/>
        <button onClick={onClose} style={{ border:'none', background:t.surface, color:t.fg,
          width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>
      <div style={{ overflow:'auto', padding:'0 20px 40px' }}>
        {hits.map(m => (
          <button key={m} onClick={() => { onPick(m); onClose(); }}
            style={{ width:'100%', padding:'13px 0', borderBottom:`1px solid ${t.divider}`,
              border:'none', background:'transparent', color:t.fg, cursor:'pointer',
              textAlign:'left', fontFamily:t.fonts.body, fontSize:14 }}>{m}</button>
        ))}
      </div>
    </div>
  );
}

function EditMovementModal({ t, open, movement, onClose, onUpdate }) {
  const [reps, setReps] = useState('21');
  const [weight, setWeight] = useState('43');
  if (!open) return null;
  return (
    <div style={{ position:'absolute', inset:0, zIndex:90,
      background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-end' }}>
      <div style={{ width:'100%', background:t.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px' }}>
        <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:20,
          letterSpacing:'-0.03em', color:t.fg, marginBottom:20 }}>{movement}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Reps', reps, setReps], ['Weight (kg)', weight, setWeight]].map(([lab, val, set]) => (
            <div key={lab}>
              <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700,
                letterSpacing:'0.16em', color:t.fgMuted, textTransform:'uppercase',
                marginBottom:6 }}>{lab}</div>
              <input value={val} onChange={e => set(e.target.value)}
                type="number" style={{ width:'100%', padding:'12px',
                  borderRadius:12, border:`1px solid ${t.divider}`,
                  background:t.surface, color:t.fg, fontFamily:t.fonts.mono,
                  fontSize:20, fontWeight:800, outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
          <button onClick={onClose} style={{ padding:'13px', borderRadius:14,
            border:`1px solid ${t.border}`, background:'transparent', color:t.fg,
            fontFamily:t.fonts.body, fontWeight:600, cursor:'pointer' }}>Cancel</button>
          <button onClick={onUpdate} style={{ padding:'13px', borderRadius:14,
            border:'none', background:t.accent, color:t.onAccent,
            fontFamily:t.fonts.body, fontWeight:700, cursor:'pointer' }}>Save Movement</button>
        </div>
      </div>
    </div>
  );
}

// ─── Phone frame ──────────────────────────────────────────────────
function PhoneFrame({ mode, children }) {
  return (
    <div style={{
      width:360, height:740, borderRadius:52, background:'#000',
      padding:8, boxSizing:'border-box', flexShrink:0, position:'relative',
      boxShadow: mode === 'dark'
        ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
        : '0 40px 100px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
    }}>
      <div style={{ position:'absolute', top:14, left:'50%',
        transform:'translateX(-50%)', width:110, height:28,
        borderRadius:14, background:'#000', zIndex:5 }}/>
      <div style={{ width:'100%', height:'100%', borderRadius:44,
        overflow:'hidden', position:'relative', background:'#000' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Brand panel ──────────────────────────────────────────────────
function BrandPanel({ mode, t }) {
  const c      = mode === 'dark' ? '#F4F1EC' : '#15120E';
  const cMuted = mode === 'dark' ? '#9A938A' : '#5F5B53';
  const cFaint = mode === 'dark' ? '#6B655B' : '#9A968F';

  return (
    <div style={{ width:260, flexShrink:0, color:c,
      display:'flex', flexDirection:'column', gap:20,
      alignSelf:'stretch', justifyContent:'space-between', padding:'20px 0' }}>
      <div>
        <WordmarkWithMark Mark={F5} size={56} color={c}/>
        <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:19,
          letterSpacing:'-0.025em', lineHeight:1.18, marginTop:24, color:c }}>
          Cuerpo<br/>Mente<br/>Tiempo
        </div>
        <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:12.5, color:cMuted,
          lineHeight:1.6, marginTop:18, maxWidth:240 }}>
          Tap ☰ in any header to navigate. Floating + opens quick-log. Holistic Habits are customizable.
        </div>

        <div style={{ marginTop:22 }}>
          <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9,
            fontWeight:700, letterSpacing:'0.18em', color:cFaint, textTransform:'uppercase' }}>
            active palette
          </div>
          <div style={{ display:'flex', gap:4, marginTop:8 }}>
            {[
              { c:t.accent,    lab:'Pri' },
              { c:t.secondary, lab:'Sec' },
              { c:t.tertiary,  lab:'Ter' },
              { c:t.fg,        lab:'Ink' },
              { c:t.surface,   lab:'Surf' },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, textAlign:'left' }}>
                <div style={{ width:'100%', height:22, borderRadius:4,
                  background:s.c, border:`1px solid ${cFaint}22` }}/>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:7.5,
                  letterSpacing:'0.1em', color:cFaint, marginTop:3,
                  textTransform:'uppercase' }}>{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingTop:18, borderTop:`1px solid ${c}1A`,
        fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:600,
        letterSpacing:'0.16em', color:cFaint, textTransform:'uppercase', lineHeight:1.8 }}>
        <div>v1.0 · demo</div>
        <div>isotype: onda F5</div>
        <div>type: syne 800</div>
      </div>
    </div>
  );
}

// ─── Control panel ────────────────────────────────────────────────
function ControlPanel({ intensityId, setIntensityId, mode, setMode, screen, setScreen, openModal }) {
  const c        = mode === 'dark' ? '#F4F1EC' : '#15120E';
  const cMuted   = mode === 'dark' ? '#9A938A' : '#5F5B53';
  const cBorder  = mode === 'dark' ? '#2A2620' : '#D9D4C7';
  const cSurface = mode === 'dark' ? '#15130F' : '#FFFFFF';

  const modals = [
    { id:'tpl',    label:'Multiple movements' },
    { id:'search', label:'Search movements' },
    { id:'edit',   label:'Edit movement' },
  ];

  return (
    <div style={{ width:240, flexShrink:0, color:c,
      display:'flex', flexDirection:'column', gap:22, padding:'20px 0' }}>

      {/* Intensity */}
      <div>
        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:700,
          letterSpacing:'0.16em', textTransform:'uppercase', color:cMuted }}>Intensity</div>
        <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
          {Object.values(INTENSITIES).map(int => {
            const active = intensityId === int.id;
            const sample = computeTokens({ mode, intensityId:int.id });
            const [name, sub] = int.label.split(' · ');
            return (
              <button key={int.id} onClick={() => setIntensityId(int.id)}
                style={{ background:active ? cSurface : 'transparent',
                  border:`1px solid ${active ? c : cBorder}`, color:c,
                  padding:'10px 12px', borderRadius:12,
                  display:'flex', alignItems:'center', gap:10,
                  cursor:'pointer', textAlign:'left', fontFamily:'DM Sans, sans-serif', fontSize:13 }}>
                <div style={{ display:'flex', gap:2, flexShrink:0 }}>
                  <div style={{ width:14, height:22, borderRadius:'7px 0 0 7px', background:sample.accent }}/>
                  <div style={{ width:7, height:22, background:sample.secondary }}/>
                  <div style={{ width:7, height:22, borderRadius:'0 7px 7px 0', background:sample.tertiary }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:active ? 700 : 500, textTransform:'capitalize' }}>{name}</div>
                  <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:8.5,
                    fontWeight:600, letterSpacing:'0.16em', color:cMuted,
                    textTransform:'uppercase', marginTop:1 }}>{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode toggle */}
      <div>
        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:700,
          letterSpacing:'0.16em', textTransform:'uppercase', color:cMuted }}>Mode</div>
        <div style={{ marginTop:10, display:'flex', gap:4, padding:3,
          background:cSurface, borderRadius:999, border:`1px solid ${cBorder}` }}>
          {['dark', 'light'].map(m => {
            const on = mode === m;
            return (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex:1, padding:'8px 0', borderRadius:999, border:'none',
                  background:on ? c : 'transparent',
                  color:on ? (m === 'dark' ? '#0A0908' : '#F6F5F2') : c,
                  fontFamily:'DM Sans, sans-serif', fontSize:12, fontWeight:600,
                  cursor:'pointer', textTransform:'capitalize' }}>{m}</button>
            );
          })}
        </div>
      </div>

      {/* Screen selector */}
      <div>
        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:700,
          letterSpacing:'0.16em', textTransform:'uppercase', color:cMuted }}>Screen</div>
        <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
          {SCREEN_LIST.map(s => {
            const on = screen === s.id;
            return (
              <button key={s.id} onClick={() => setScreen(s.id)}
                style={{ border:`1px solid ${on ? c : cBorder}`,
                  background:on ? c : 'transparent',
                  color:on ? (mode === 'dark' ? '#0A0908' : '#F6F5F2') : c,
                  padding:'8px 10px', borderRadius:8,
                  fontFamily:'DM Sans, sans-serif', fontSize:11, fontWeight:600,
                  cursor:'pointer', textAlign:'left' }}>{s.label}</button>
            );
          })}
        </div>
      </div>

      {/* BTWB modal launchers */}
      <div>
        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:700,
          letterSpacing:'0.16em', textTransform:'uppercase', color:cMuted }}>BTWB Flows</div>
        <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:4 }}>
          {modals.map(m => (
            <button key={m.id} onClick={() => openModal(m.id)}
              style={{ border:`1px dashed ${cBorder}`, background:'transparent', color:c,
                padding:'8px 10px', borderRadius:8,
                fontFamily:'DM Sans, sans-serif', fontSize:11.5, fontWeight:600,
                cursor:'pointer', textAlign:'left' }}>{m.label} ↗</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────
export default function App() {
  const { mode, setMode, intensityId, setIntensityId, t } = useTheme();
  const [screen, setScreen] = useState('home');
  const [addSheet, setAddSheet] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(null); // 'tpl' | 'search' | 'edit' | null

  const Screen = SCREENS[screen] || DashboardScreen;

  function handleAddNav(action) {
    setAddSheet(false);
    if (action.startsWith('log:')) {
      const kind = action.slice(4);
      if (kind === 'workout') { setModal('tpl'); return; }
      if (kind === 'meal')    { setScreen('eat'); return; }
      if (kind === 'mood')    { setScreen('journal'); return; }
      if (kind === 'water')   { setScreen('eat'); return; }
      if (kind === 'weight')  { setScreen('me'); return; }
      return;
    }
    if (action === 'movement')   { setModal('tpl'); return; }
    if (action === 'editmove')   { setModal('edit'); return; }
    if (action === 'searchmove') { setModal('search'); return; }
    if (SCREENS[action]) setScreen(action);
  }

  const ambient = mode === 'dark'
    ? 'radial-gradient(ellipse at 25% 15%, #1d1a14, #08070500 65%), #050505'
    : 'radial-gradient(ellipse at 25% 15%, #FFFEFB, #EFEBE0 65%), #E7E3D6';

  return (
    <div style={{ minHeight:'100vh', width:'100vw', background:ambient,
      display:'flex', alignItems:'center', justifyContent:'center',
      gap:56, padding:'40px 56px', boxSizing:'border-box',
      fontFamily:'DM Sans, system-ui, sans-serif', transition:'background 0.3s' }}>

      <BrandPanel mode={mode} t={t}/>

      <PhoneFrame mode={mode}>
        <Screen t={t} onNav={setScreen}
          onMenu={() => setDrawer(true)}
          onPlus={() => setAddSheet(true)}/>

        <DrawerMenu t={t} open={drawer}
          onClose={() => setDrawer(false)}
          screen={screen} onNav={id => { setScreen(id); setDrawer(false); }}/>

        <AddSheet t={t} open={addSheet}
          onClose={() => setAddSheet(false)}
          onNav={handleAddNav}/>

        {modal === 'tpl' && (
          <MultipleMovementsModal t={t}
            onClose={() => setModal(null)}
            onPick={() => setModal('edit')}/>
        )}
        <SearchMovementsModal t={t} open={modal === 'search'}
          onClose={() => setModal(null)}
          onPick={() => setModal('edit')}/>
        <EditMovementModal t={t} open={modal === 'edit'}
          movement="Snatch"
          onClose={() => setModal(null)}
          onUpdate={() => setModal(null)}/>
      </PhoneFrame>

      <ControlPanel
        intensityId={intensityId} setIntensityId={setIntensityId}
        mode={mode} setMode={setMode}
        screen={screen} setScreen={setScreen}
        openModal={setModal}/>
    </div>
  );
}
