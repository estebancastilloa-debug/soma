import { useState } from 'react';
import { useTheme } from './theme.jsx';
import { DrawerMenu, AddSheet, BottomTabBar } from './chrome.jsx';

import { DashboardScreen }  from './screens/Dashboard.jsx';
import { TrainScreen }      from './screens/Train.jsx';
import { EatScreen }        from './screens/Eat.jsx';
import { RecordsScreen }    from './screens/Records.jsx';
import { LevelScreen }      from './screens/Level.jsx';
import { ProfileScreen }    from './screens/Profile.jsx';
import { JournalScreen }    from './screens/Journal.jsx';
import { ImportScreen }     from './screens/Import.jsx';
import { SupplementsScreen } from './screens/Supplements.jsx';
import { TravelScreen }     from './screens/Travel.jsx';
import { HealthScreen }     from './screens/Health.jsx';
import { AnalyticsScreen }  from './screens/Analytics.jsx';
import { PRTrackerScreen }  from './screens/PRTracker.jsx';
import { WodLoggerScreen }  from './screens/WodLogger.jsx';
import { OnboardingScreen } from './screens/Onboarding.jsx';

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
  health:      HealthScreen,
  analytics:   AnalyticsScreen,
  prtracker:   PRTrackerScreen,
  wodlogger:   WodLoggerScreen,
  onboarding:  OnboardingScreen,
};

// ─── Inline BTWB modals ───────────────────────────────────────────
const WOD_TEMPLATES = [
  { id:'amrap',   lab:'AMRAP',          sub:'As Many Rounds As Possible', col:'eat' },
  { id:'emom',    lab:'EMOM',           sub:'Every Minute On the Minute', col:'records' },
  { id:'fortime', lab:'For Time',        sub:'Race the clock',             col:'train' },
  { id:'rft',     lab:'Rounds for Time', sub:'Set rounds, race the clock', col:'train' },
  { id:'tabata',  lab:'Tabata',          sub:'20s on / 10s off · 8 rounds',col:'records' },
];

function MovementModalWrap({ t, title, onClose, children }) {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:80,
      background:t.bg, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'52px 20px 12px', display:'flex', alignItems:'center',
        justifyContent:'space-between' }}>
        <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:20,
          letterSpacing:'-0.03em', color:t.fg }}>{title}</div>
        <button onClick={onClose} style={{ width:34, height:34, borderRadius:'50%',
          border:'none', background:t.surface, color:t.fg, cursor:'pointer',
          fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'0 20px 40px' }}>{children}</div>
    </div>
  );
}

function MultipleMovementsModal({ t, onClose, onPick }) {
  return (
    <MovementModalWrap t={t} title="Multiple Movements" onClose={onClose}>
      <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700,
        letterSpacing:'0.18em', color:t.fgMuted, textTransform:'uppercase',
        marginBottom:10 }}>Selecciona un template</div>
      {WOD_TEMPLATES.map(tpl => (
        <button key={tpl.id} onClick={() => onPick(tpl)}
          style={{ width:'100%', marginBottom:6, padding:'14px 16px', borderRadius:14,
            border:'none', background:t.surface, color:t.fg, cursor:'pointer',
            textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0,
            background:t.pillar[tpl.col] || t.accent }}/>
          <div>
            <div style={{ fontFamily:t.fonts.body, fontWeight:700, fontSize:14 }}>{tpl.lab}</div>
            <div style={{ fontFamily:t.fonts.body, fontSize:12, color:t.fgMuted, marginTop:2 }}>{tpl.sub}</div>
          </div>
        </button>
      ))}
    </MovementModalWrap>
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
      <div style={{ padding:'52px 20px 12px', display:'flex', gap:12 }}>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="Buscar movimientos..."
          autoFocus
          style={{ flex:1, padding:'10px 14px', borderRadius:12,
            border:`1px solid ${t.divider}`, background:t.surface, color:t.fg,
            fontFamily:t.fonts.body, fontSize:14, outline:'none' }}/>
        <button onClick={onClose} style={{ border:'none', background:t.surface,
          color:t.fg, width:36, height:36, borderRadius:'50%', cursor:'pointer',
          fontSize:18, display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0 }}>×</button>
      </div>
      <div style={{ overflow:'auto', padding:'0 20px 100px' }}>
        {hits.map(m => (
          <button key={m} onClick={() => { onPick(m); onClose(); }}
            style={{ width:'100%', padding:'14px 0',
              borderBottom:`1px solid ${t.divider}`, border:'none',
              background:'transparent', color:t.fg, cursor:'pointer',
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
      <div style={{ width:'100%', background:t.bg,
        borderRadius:'24px 24px 0 0', padding:'24px 20px',
        paddingBottom:'calc(24px + env(safe-area-inset-bottom))' }}>
        <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:20,
          letterSpacing:'-0.03em', color:t.fg, marginBottom:20 }}>{movement}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Reps', reps, setReps], ['Peso (kg)', weight, setWeight]].map(([lab, val, set]) => (
            <div key={lab}>
              <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700,
                letterSpacing:'0.16em', color:t.fgMuted, textTransform:'uppercase',
                marginBottom:6 }}>{lab}</div>
              <input value={val} onChange={e => set(e.target.value)} type="number"
                style={{ width:'100%', padding:'12px', borderRadius:12,
                  border:`1px solid ${t.divider}`, background:t.surface, color:t.fg,
                  fontFamily:t.fonts.mono, fontSize:20, fontWeight:800,
                  outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
          <button onClick={onClose} style={{ padding:'13px', borderRadius:14,
            border:`1px solid ${t.border}`, background:'transparent', color:t.fg,
            fontFamily:t.fonts.body, fontWeight:600, cursor:'pointer' }}>Cancelar</button>
          <button onClick={onUpdate} style={{ padding:'13px', borderRadius:14,
            border:'none', background:t.accent, color:t.onAccent,
            fontFamily:t.fonts.body, fontWeight:700, cursor:'pointer' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const { t } = useTheme();
  const [screen, setScreen] = useState('home');
  const [addSheet, setAddSheet] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(null);

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

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      background: t.bg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Screen area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Screen
          t={t}
          onNav={setScreen}
          onMenu={() => setDrawer(true)}
          onPlus={() => setAddSheet(true)}
        />

        {/* Overlays */}
        <DrawerMenu t={t} open={drawer}
          onClose={() => setDrawer(false)}
          screen={screen}
          onNav={id => { setScreen(id); setDrawer(false); }}/>

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
      </div>

      {/* Bottom navigation */}
      <BottomTabBar t={t} screen={screen} onNav={setScreen} onPlus={() => setAddSheet(true)}/>
    </div>
  );
}
