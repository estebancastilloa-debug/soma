// SOMA — BTWB-style workout entry flows, rebuilt in SOMA's visual language.
// Three modals reachable from the + AddSheet:
//   - MultipleMovementsScreen   ("New movement" / "Workout template")
//   - SearchMovementsModal       ("Search movements")
//   - EditMovementModal          ("Edit movement")
//
// All use SOMA tokens (no stock indigo from BTWB). Reps/weight/distance/height/
// time toggles use the per-pillar colors so the workout entry inherits the
// SOMA color identity instead of feeling like a third-party form.

const { useState: useStateMv } = React;
const {
  StatusBar: StatusBarMv, MonoLabel: MonoLabelMv,
  ScreenFrame: ScreenFrameMv, PillarHeader: PillarHeaderMv,
  SectionHead: SectionHeadMv,
} = window;
const {
  IconChevronLeft: IconChevronLeftMv, IconChevronRight: IconChevronRightMv,
  IconPlus: IconPlusMv, IconCheck: IconCheckMv,
  IconDumbbellSmall: IconDumbbellMv, IconTimer: IconTimerMv,
  IconBalance: IconBalanceMv, IconBolt: IconBoltMv,
} = window;

// ──────────────────────────────────────────────────────────────────
// 1 · MULTIPLE MOVEMENTS TEMPLATES
// Replaces the BTWB "Multiple Movements" template-picker.
// Scored-by selector at top (Time / Completion / Rounds / Reps),
// then cards listing the templates for that scoring mode.
// ──────────────────────────────────────────────────────────────────

const SCORED_BY = [
  {
    id: 'time', lab: 'Time',
    templates: [
      { id: 'rft',     lab: 'Rounds for Time',         sub: 'Set rounds, race the clock.',  col: 'records' },
      { id: 'rftvary', lab: 'RFT · Varying Reps',      sub: 'e.g. 21-15-9. Same moves, different reps.', col: 'eat' },
      { id: 'rftbook', lab: 'RFT with Bookends',       sub: 'Buy-in or buy-out task.', col: 'train' },
      { id: 'eachrft', lab: 'Each Round For Time',     sub: 'Score every round.', col: 'records' },
      { id: 'fortime', lab: 'For Time',                sub: 'No rounds. All moves, one clock.', col: 'eat' },
    ],
  },
  {
    id: 'completion', lab: 'Completion',
    templates: [
      { id: 'quality', lab: 'For Quality',             sub: 'Not for time, for technique.', col: 'records' },
      { id: 'emomulti', lab: 'EMOM · multiple per interval', sub: 'Work each minute to completion.', col: 'eat' },
      { id: 'emomalt',  lab: 'EMOM · alternate',       sub: 'Different move each interval.', col: 'train' },
    ],
  },
  {
    id: 'rounds', lab: 'Rounds',
    templates: [
      { id: 'amrap',     lab: 'AMRAP',                 sub: 'As Many Rounds As Possible.', col: 'eat' },
      { id: 'amraprep',  lab: 'AMRAP Repeats',         sub: 'Same AMRAP, repeated.', col: 'train' },
      { id: 'amrapbuy',  lab: 'AMRAP with Buy-In',     sub: 'Buy-in then AMRAP.', col: 'records' },
      { id: 'amrapseries', lab: 'AMRAP Series',        sub: 'Different AMRAPs, sequence.', col: 'eat' },
    ],
  },
  {
    id: 'reps', lab: 'Reps',
    templates: [
      { id: 'amrapmax', lab: 'AMRAP with Max Rep',     sub: 'AMRAP with max-rep move(s).', col: 'records' },
      { id: 'amreps',   lab: 'AMReps',                 sub: 'As Many Reps As Possible.', col: 'eat' },
      { id: 'ascending', lab: 'Ascending AMReps',      sub: 'Increasing rep scheme.', col: 'train' },
      { id: 'tabata',   lab: 'Tabata',                 sub: '20s on / 10s off · 8 rounds.', col: 'records' },
      { id: 'fgb',      lab: 'FGB Style',              sub: 'Fight Gone Bad format.', col: 'eat' },
      { id: 'death',    lab: 'Death By Reps',          sub: 'Add a rep every minute until failure.', col: 'train' },
      { id: 'maxreps',  lab: 'Rounds for Max Reps',    sub: 'Set rounds, max reps each.', col: 'records' },
      { id: 'remaining', lab: 'Reps in Remaining Time', sub: 'Max reps in time left.',   col: 'eat' },
    ],
  },
];

function MultipleMovementsScreen({ t, onClose, onPick }) {
  const [mode, setMode] = useStateMv('time');
  const active = SCORED_BY.find(s => s.id === mode);

  return (
    <ScreenFrameMv t={t}>
      <StatusBarMv t={t}/>
      <PillarHeaderMv t={t}
        title="Multiple movements"
        sub="Which template matches your workout?"
        onBack={onClose}/>

      <div style={{ height: 'calc(100% - 64px)', overflow: 'auto',
        padding: '12px 20px 30px' }}>

        {/* Scored-by segmented selector — SOMA style */}
        <div style={{ marginTop: 8 }}>
          <MonoLabelMv t={t}>scored by</MonoLabelMv>
          <div style={{ marginTop: 8, display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
            padding: 3, background: t.surface, borderRadius: 999,
            border: `1px solid ${t.divider}` }}>
            {SCORED_BY.map(s => {
              const on = s.id === mode;
              return (
                <button key={s.id} onClick={() => setMode(s.id)}
                  style={{
                    border: 'none', padding: '8px 0', borderRadius: 999,
                    background: on ? t.fg : 'transparent',
                    color: on ? t.bg : t.fg,
                    fontFamily: t.fonts.body, fontWeight: 600, fontSize: 11.5,
                    cursor: 'pointer',
                  }}>{s.lab}</button>
              );
            })}
          </div>
        </div>

        {/* Templates */}
        <div style={{ marginTop: 18, display: 'flex',
          flexDirection: 'column', gap: 8 }}>
          {active.templates.map(tpl => {
            const tint = t.pillar[tpl.col] || t.fg;
            return (
              <button key={tpl.id}
                onClick={() => onPick && onPick(tpl)}
                style={{
                  border: `1px solid ${t.divider}`,
                  background: t.surface, color: t.fg,
                  padding: '13px 14px', borderRadius: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                {/* Color dot — uses pillar color, not BTWB's pastel circles */}
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: tint, flexShrink: 0,
                }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
                    fontSize: 14.5, letterSpacing: '-0.02em', color: t.fg }}>
                    {tpl.lab}</div>
                  <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
                    color: t.fgMuted, marginTop: 2 }}>{tpl.sub}</div>
                </div>
                <IconChevronRightMv size={14} color={t.fgFaint}/>
              </button>
            );
          })}
        </div>
      </div>
    </ScreenFrameMv>
  );
}

// ──────────────────────────────────────────────────────────────────
// 2 · SEARCH MOVEMENTS
// Search input + 2-column grid of movement names.
// ──────────────────────────────────────────────────────────────────

const MOVEMENT_DB = {
  '':       ['Back squat','Front squat','Deadlift','Bench press','Clean','Snatch','Pull-up','Push-up','Burpee','Box jump','Wall ball','Thruster','Row','Run','Bike','Ski','Toes to bar','Muscle-up','Handstand walk','Kettlebell swing'],
  'snatch': ['Snatch','Power snatch','Squat snatch','Dumbbell snatch','Snatch balance','Snatch pull','Hang snatch','Muscle snatch','Kettlebell snatch','Snatch deadlift','Pause snatch','Block snatch','Drop snatch','Tall snatch','Snatch complex','Snatch drop','Hip snatch','Split snatch','Floating snatch','Halting snatch','Tempo snatch','Snatch shrug','Segment snatch','Paused snatch','Snatch land','Dip snatch','Hang power snatch','Eccentric snatch','Deficit snatch','Hang squat snatch'],
  'row':    ['Row','Row calorie','Ring row','Pendlay row','Renegade row','Dumbbell row','Barbell row','Inverted row','Landmine row','Body row','Upright row','Run / Row','TRX row','Row / Ski','Row sprint','Gorilla row','Seated row','Seal row','Row / Bike','Banded row','Machine row','Row (Meters)','Row Erg','Partner row','Kroc row','Yates row','Chinese row','Kettlebell row','Recovery row','Sandbag row'],
  'squat':  ['Back squat','Front squat','Overhead squat','Goblet squat','Air squat','Bulgarian split squat','Pistol squat','Box squat','Pause squat','Tempo squat','Zercher squat','Hack squat','Cossack squat','Sumo squat','Wall squat','Jump squat','Squat snatch','Squat clean','Sissy squat','Bottom-up squat'],
};

function SearchMovementsModal({ t, open, onClose, onPick }) {
  const [q, setQ] = useStateMv('');
  if (!open) return null;
  const key = q.trim().toLowerCase();
  const list = MOVEMENT_DB[key] || MOVEMENT_DB[''];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70,
      display: 'flex', flexDirection: 'column',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, top: 0, height: 80,
        background: 'rgba(0,0,0,0.5)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 80,
        background: t.bg, borderRadius: '24px 24px 0 0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: t.fgFaint, opacity: 0.5,
          margin: '12px auto 14px' }}></div>

        {/* Header */}
        <div style={{ padding: '0 20px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 11,
            fontWeight: 700, letterSpacing: '0.18em', color: t.fgMuted,
            textTransform: 'uppercase' }}>Search Movements</div>
          <button onClick={onClose} style={{
            border: 'none', background: t.surface2, color: t.fg,
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
          }}>×</button>
        </div>

        {/* Search input */}
        <div style={{ margin: '14px 20px 0',
          padding: '11px 14px', borderRadius: 12,
          background: t.surface, border: `1px solid ${t.divider}`,
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: t.fgFaint, display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <line x1="16.5" y1="16.5" x2="20" y2="20"/>
            </svg>
          </span>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Find a movement…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', color: t.fg,
              fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14,
            }}/>
          {q && (
            <button onClick={() => setQ('')} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: t.fgFaint, fontFamily: 'inherit', fontSize: 14 }}>
              clear
            </button>
          )}
        </div>

        {/* 2-column grid */}
        <div style={{ flex: 1, overflow: 'auto',
          padding: '14px 20px 30px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {list.map(name => (
            <button key={name} onClick={() => onPick && onPick(name)}
              style={{
                border: `1px solid ${t.divider}`,
                background: t.surface, color: t.fg,
                padding: '12px 13px', borderRadius: 10,
                cursor: 'pointer', fontFamily: t.fonts.body,
                fontSize: 12.5, fontWeight: 600,
                textAlign: 'left',
              }}>{name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// 3 · EDIT MOVEMENT
// Toggles for reps · weight · distance · height · time. Each toggle
// uses a per-field color (Reps=primary, Weight=secondary, etc.) so
// the form has SOMA color identity. Big UPDATE button at bottom.
// ──────────────────────────────────────────────────────────────────

const FIELDS = [
  { id: 'reps',     lab: 'Reps',     placeholder: 'reps',
    Icon: 'plus',    pillar: 'train',   units: null },
  { id: 'weight',   lab: 'Weight',   placeholder: '0',
    Icon: 'dumbbell',pillar: 'records', units: ['kg', 'lb'] },
  { id: 'distance', lab: 'Distance', placeholder: '0',
    Icon: 'bolt',    pillar: 'eat',     units: ['m', 'km', 'mi'] },
  { id: 'height',   lab: 'Height',   placeholder: '0',
    Icon: 'balance', pillar: 'records', units: ['cm', 'in'] },
  { id: 'time',     lab: 'Time',     placeholder: 'mm : ss',
    Icon: 'timer',   pillar: 'eat',     units: null },
];
const FIELD_ICON = {
  plus:     window.IconPlus,
  dumbbell: window.IconDumbbellSmall,
  bolt:     window.IconBolt,
  balance:  window.IconBalance,
  timer:    window.IconTimer,
};

function EditMovementModal({ t, open, onClose, movement = 'Snatch', onUpdate }) {
  // active = which fields are turned ON
  const [active, setActive] = useStateMv({ reps: true, weight: true,
    distance: false, height: false, time: false });
  // values per field
  const [values, setValues] = useStateMv({});
  // selected unit per field (default = first option)
  const [units, setUnits] = useStateMv({ weight: 'kg', distance: 'm', height: 'cm' });
  if (!open) return null;
  const onPillar = '#0A0908';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70,
      display: 'flex', flexDirection: 'column',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, top: 0, height: 80,
        background: 'rgba(0,0,0,0.5)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 80,
        background: t.bg, borderRadius: '24px 24px 0 0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: t.fgFaint, opacity: 0.5,
          margin: '12px auto 14px' }}></div>

        <div style={{ padding: '0 20px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 11,
            fontWeight: 700, letterSpacing: '0.18em', color: t.fgMuted,
            textTransform: 'uppercase' }}>Edit Movement</div>
          <button onClick={onClose} style={{
            border: 'none', background: t.surface2, color: t.fg,
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
          }}>×</button>
        </div>

        {/* Movement chip */}
        <div style={{ margin: '14px 20px 0',
          padding: '14px 14px', borderRadius: 14,
          background: t.surface, border: `1px solid ${t.divider}`,
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, flexShrink: 0,
            borderRadius: 8, background: t.pillar.train, color: '#0A0908',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconDumbbellMv size={16} stroke={1.9}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <MonoLabelMv t={t}>movement</MonoLabelMv>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
              fontSize: 18, letterSpacing: '-0.025em', color: t.fg,
              marginTop: 1 }}>{movement}</div>
          </div>
          <button style={{
            border: 'none', background: t.surface2, color: t.fg,
            padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
            fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>swap</button>
        </div>

        {/* Hint */}
        <div style={{ padding: '10px 20px 0' }}>
          <MonoLabelMv t={t}>turn on the fields you track</MonoLabelMv>
        </div>

        {/* Field cards */}
        <div style={{ flex: 1, overflow: 'auto',
          padding: '8px 20px 16px',
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FIELDS.map(f => {
            const Icon = FIELD_ICON[f.Icon];
            const isOn = active[f.id];
            const tint = t.pillar[f.pillar] || t.fg;
            const selectedUnit = units[f.id] || (f.units ? f.units[0] : null);

            return (
              <div key={f.id} style={{
                padding: '10px 12px', borderRadius: 12,
                background: isOn ? tint + '14' : t.surface,
                border: `1px solid ${isOn ? tint + '55' : t.divider}`,
              }}>
                {/* Header row — toggle + label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setActive(a => ({ ...a, [f.id]: !a[f.id] }))}
                    style={{
                      width: 38, height: 22, borderRadius: 999,
                      border: 'none', cursor: 'pointer',
                      background: isOn ? tint : t.surface2,
                      position: 'relative', flexShrink: 0,
                    }}>
                    <div style={{
                      position: 'absolute', top: 2, left: isOn ? 18 : 2,
                      width: 18, height: 18, borderRadius: '50%',
                      background: t.bg, transition: 'left 0.15s',
                    }}></div>
                  </button>
                  <div style={{ color: isOn ? tint : t.fgFaint, display: 'flex',
                    flexShrink: 0 }}>
                    {Icon && <Icon size={16} stroke={1.9}/>}
                  </div>
                  <span style={{ flex: 1, fontFamily: t.fonts.body,
                    fontWeight: 700, fontSize: 14,
                    color: isOn ? t.fg : t.fgMuted }}>{f.lab}</span>
                </div>

                {/* Input + unit selector (only when active) */}
                {isOn && (
                  <div style={{ marginTop: 9,
                    display: 'flex', alignItems: 'stretch', gap: 6 }}>
                    <input value={values[f.id] || ''}
                      onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                      placeholder={f.placeholder}
                      type={f.id === 'time' ? 'text' : 'number'}
                      style={{
                        flex: 1, minWidth: 0,
                        padding: '10px 12px', borderRadius: 9,
                        border: 'none', outline: 'none',
                        background: t.bg, color: t.fg,
                        fontFamily: t.fonts.display, fontWeight: 700,
                        fontSize: 18, letterSpacing: '-0.02em',
                      }}/>
                    {/* Unit picker (segmented) */}
                    {f.units && (
                      <div style={{ display: 'flex', gap: 0,
                        padding: 2, background: t.bg, borderRadius: 9,
                        border: `1px solid ${tint}33`, flexShrink: 0 }}>
                        {f.units.map(u => {
                          const on = u === selectedUnit;
                          return (
                            <button key={u}
                              onClick={() => setUnits(uu => ({ ...uu, [f.id]: u }))}
                              style={{
                                border: 'none', cursor: 'pointer',
                                padding: '6px 10px', borderRadius: 7,
                                background: on ? tint : 'transparent',
                                color: on ? onPillar : t.fg,
                                fontFamily: t.fonts.mono, fontSize: 11,
                                fontWeight: 700, letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                minWidth: 32,
                              }}>{u}</button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ padding: '4px 20px 24px' }}>
          <button onClick={() => onUpdate && onUpdate({ active, values, units })}
            style={{
              width: '100%', padding: '14px', borderRadius: 999,
              border: 'none', cursor: 'pointer',
              background: t.accent, color: t.onAccent,
              fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
              letterSpacing: '0.04em',
            }}>UPDATE</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  MultipleMovementsScreen, SearchMovementsModal, EditMovementModal,
  SCORED_BY, MOVEMENT_DB,
});
