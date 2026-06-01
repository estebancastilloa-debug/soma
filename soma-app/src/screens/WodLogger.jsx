import { useState } from 'react';
import {
  ScreenFrame, StatusBar, PillarHeader, MonoLabel, SectionHead,
} from '../chrome.jsx';
import {
  IconTimer, IconPlus, IconCheck, IconDumbbellSmall, IconBarbell,
  IconFlame, IconX,
} from '../icons.jsx';
import { F5 } from '../marks.jsx';

// ─── Mode tabs ────────────────────────────────────────────────────────
function ModeTabs({ t, mode, setMode }) {
  const modes = [
    { id: 'quick',    label: 'Quick'    },
    { id: 'standard', label: 'Standard' },
    { id: 'full',     label: 'Full'     },
  ];
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: '12px 20px 0',
    }}>
      {modes.map(m => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: 20,
              border: active ? 'none' : `1.5px solid ${t.border}`,
              background: active ? t.pillar.train : 'transparent',
              color: active ? '#0A0908' : t.fgMuted,
              fontFamily: t.fonts.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.14s ease',
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Shared input field ───────────────────────────────────────────────
function Field({ t, label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <MonoLabel t={t}>{label}</MonoLabel>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}

function TextInput({ t, placeholder, value, onChange, mono, large }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: '11px 13px',
        color: t.fg,
        fontFamily: mono ? t.fonts.mono : t.fonts.body,
        fontSize: large ? 22 : 14,
        fontWeight: large ? 700 : 500,
        letterSpacing: large ? '-0.03em' : 'normal',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function TextArea({ t, placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: '13px',
        color: t.fg,
        fontFamily: t.fonts.body,
        fontSize: 14,
        outline: 'none',
        resize: 'none',
        boxSizing: 'border-box',
        lineHeight: 1.5,
      }}
    />
  );
}

// ─── Log Workout button ───────────────────────────────────────────────
function LogButton({ t, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: t.pillar.train,
        color: '#0A0908',
        border: 'none',
        borderRadius: 14,
        padding: '15px 0',
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: '-0.01em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
      }}
    >
      <IconCheck size={18} stroke={2.4} color="#0A0908" />
      Log Workout
    </button>
  );
}

// ─── Quick mode ───────────────────────────────────────────────────────
function QuickMode({ t, workout, setWorkout, onLog }) {
  const [time, setTime]   = useState('');
  const [rx, setRx]       = useState(true);
  const [score, setScore] = useState('');

  return (
    <div>
      {/* WOD text area */}
      <Field t={t} label="what did you do?">
        <TextArea
          t={t}
          placeholder="Fran · 21-15-9 · Thrusters / Pull-ups"
          value={workout}
          onChange={setWorkout}
          rows={3}
        />
      </Field>

      {/* Time input */}
      <Field t={t} label="time">
        <input
          value={time}
          onChange={e => setTime(e.target.value)}
          placeholder="0:00"
          type="text"
          style={{
            width: '100%',
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: '12px 16px',
            color: t.fg,
            fontFamily: t.fonts.mono,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            outline: 'none',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        />
      </Field>

      {/* Rx / Scaled toggle */}
      <Field t={t} label="scaling">
        <div style={{ display: 'flex', gap: 8 }}>
          {[true, false].map(isRx => (
            <button
              key={String(isRx)}
              onClick={() => setRx(isRx)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 10,
                border: rx === isRx ? 'none' : `1.5px solid ${t.border}`,
                background: rx === isRx ? t.pillar.train : 'transparent',
                color: rx === isRx ? '#0A0908' : t.fgMuted,
                fontFamily: t.fonts.mono,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {isRx ? 'Rx' : 'Scaled'}
            </button>
          ))}
        </div>
      </Field>

      {/* Score */}
      <Field t={t} label="score">
        <TextInput
          t={t}
          placeholder="e.g. 95 reps or 4+12"
          value={score}
          onChange={setScore}
        />
      </Field>

      <LogButton t={t} onClick={onLog} />
    </div>
  );
}

// ─── Standard mode ────────────────────────────────────────────────────
function StandardMode({ t, workout, setWorkout, onLog }) {
  const [wodName, setWodName] = useState('');
  const [type, setType]       = useState('For Time');
  const [score, setScore]     = useState('');
  const [movements, setMovements] = useState([
    { movement: '', weight: '' },
    { movement: '', weight: '' },
    { movement: '', weight: '' },
  ]);

  const types = ['AMRAP', 'For Time', 'EMOM'];

  const addMovement = () => {
    setMovements(prev => [...prev, { movement: '', weight: '' }]);
  };

  const updateMovement = (i, field, val) => {
    setMovements(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  };

  return (
    <div>
      <Field t={t} label="WOD name">
        <TextInput
          t={t}
          placeholder="e.g. Fran, Helen, or custom"
          value={wodName}
          onChange={setWodName}
        />
      </Field>

      <Field t={t} label="type">
        <div style={{ display: 'flex', gap: 6 }}>
          {types.map(tp => {
            const active = type === tp;
            return (
              <button
                key={tp}
                onClick={() => setType(tp)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: active ? 'none' : `1.5px solid ${t.border}`,
                  background: active ? t.pillar.train : 'transparent',
                  color: active ? '#0A0908' : t.fgMuted,
                  fontFamily: t.fonts.mono,
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {tp}
              </button>
            );
          })}
        </div>
      </Field>

      <Field t={t} label={type === 'AMRAP' ? 'score (rounds + reps)' : 'score (time)'}>
        <TextInput
          t={t}
          placeholder={type === 'AMRAP' ? '12+7' : '5:42'}
          value={score}
          onChange={setScore}
          mono
        />
      </Field>

      <Field t={t} label="movements">
        {movements.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={m.movement}
              onChange={e => updateMovement(i, 'movement', e.target.value)}
              placeholder={`Movement ${i + 1}`}
              style={{
                flex: 2,
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '10px 12px',
                color: t.fg,
                fontFamily: t.fonts.body,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <input
              value={m.weight}
              onChange={e => updateMovement(i, 'weight', e.target.value)}
              placeholder="wt/reps"
              style={{
                flex: 1,
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '10px 10px',
                color: t.fg,
                fontFamily: t.fonts.mono,
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
        <button
          onClick={addMovement}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            fontFamily: t.fonts.mono,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: t.pillar.train,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <IconPlus size={12} stroke={2.4} color={t.pillar.train} />
          Add movement
        </button>
      </Field>

      <LogButton t={t} onClick={onLog} />
    </div>
  );
}

// ─── RPE slider (10 squares) ─────────────────────────────────────────
function RPESlider({ t, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: 10 }, (_, i) => {
        const n = i + 1;
        const filled = n <= value;
        const color = n <= 3 ? t.semantic.ok : n <= 6 ? t.semantic.mid : t.semantic.low;
        return (
          <button
            key={n}
            onClick={() => onChange(n)}
            title={String(n)}
            style={{
              flex: 1,
              height: 28,
              borderRadius: 5,
              border: 'none',
              background: filled ? color : t.s2,
              cursor: 'pointer',
              transition: 'background 0.1s ease',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Full mode ────────────────────────────────────────────────────────
function FullMode({ t, workout, setWorkout, onLog }) {
  const [wodName, setWodName]   = useState('');
  const [type, setType]         = useState('For Time');
  const [score, setScore]       = useState('');
  const [rpe, setRpe]           = useState(0);
  const [notes, setNotes]       = useState('');
  const [linked, setLinked]     = useState(false);
  const [movements, setMovements] = useState([
    { movement: '', weight: '' },
    { movement: '', weight: '' },
    { movement: '', weight: '' },
  ]);
  const types = ['AMRAP', 'For Time', 'EMOM'];

  const addMovement = () => {
    setMovements(prev => [...prev, { movement: '', weight: '' }]);
  };
  const updateMovement = (i, field, val) => {
    setMovements(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  };

  return (
    <div>
      <Field t={t} label="WOD name">
        <TextInput
          t={t}
          placeholder="e.g. Fran, Helen, or custom"
          value={wodName}
          onChange={setWodName}
        />
      </Field>

      <Field t={t} label="type">
        <div style={{ display: 'flex', gap: 6 }}>
          {types.map(tp => {
            const active = type === tp;
            return (
              <button
                key={tp}
                onClick={() => setType(tp)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: active ? 'none' : `1.5px solid ${t.border}`,
                  background: active ? t.pillar.train : 'transparent',
                  color: active ? '#0A0908' : t.fgMuted,
                  fontFamily: t.fonts.mono,
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {tp}
              </button>
            );
          })}
        </div>
      </Field>

      <Field t={t} label={type === 'AMRAP' ? 'score (rounds + reps)' : 'score (time)'}>
        <TextInput
          t={t}
          placeholder={type === 'AMRAP' ? '12+7' : '5:42'}
          value={score}
          onChange={setScore}
          mono
        />
      </Field>

      <Field t={t} label="movements">
        {movements.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={m.movement}
              onChange={e => updateMovement(i, 'movement', e.target.value)}
              placeholder={`Movement ${i + 1}`}
              style={{
                flex: 2,
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '10px 12px',
                color: t.fg,
                fontFamily: t.fonts.body,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <input
              value={m.weight}
              onChange={e => updateMovement(i, 'weight', e.target.value)}
              placeholder="wt/reps"
              style={{
                flex: 1,
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '10px 10px',
                color: t.fg,
                fontFamily: t.fonts.mono,
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
        <button
          onClick={addMovement}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            fontFamily: t.fonts.mono,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: t.pillar.train,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <IconPlus size={12} stroke={2.4} color={t.pillar.train} />
          Add movement
        </button>
      </Field>

      {/* RPE slider */}
      <Field t={t} label={`feel / rpe · ${rpe > 0 ? rpe + '/10' : 'tap to rate'}`}>
        <RPESlider t={t} value={rpe} onChange={setRpe} />
      </Field>

      {/* Notes */}
      <Field t={t} label="notes">
        <TextArea
          t={t}
          placeholder="How did it feel? Any form cues, PRs, or observations..."
          value={notes}
          onChange={setNotes}
          rows={3}
        />
      </Field>

      {/* Link to program week toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        marginBottom: 14,
      }}>
        <div>
          <div style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 13,
            color: t.fg,
          }}>Link to program week</div>
          <div style={{
            fontFamily: t.fonts.body,
            fontSize: 11,
            color: t.fgMuted,
            marginTop: 1,
          }}>Bloque 3 · Semana 3</div>
        </div>
        <button
          onClick={() => setLinked(prev => !prev)}
          style={{
            width: 44,
            height: 26,
            borderRadius: 13,
            border: 'none',
            background: linked ? t.pillar.train : t.s2,
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.18s ease',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 3,
            left: linked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: linked ? '#0A0908' : t.fgMuted,
            transition: 'left 0.18s ease',
          }} />
        </button>
      </div>

      <LogButton t={t} onClick={onLog} />
    </div>
  );
}

// ─── WodLoggerScreen ─────────────────────────────────────────────────
export function WodLoggerScreen({ t, onNav, onMenu, onPlus }) {
  const [mode, setMode]       = useState('quick');
  const [workout, setWorkout] = useState('');

  const handleLog = () => {
    // placeholder — would submit workout data
    setWorkout('');
  };

  return (
    <ScreenFrame t={t} accentColor={t.pillar.train}>
      <StatusBar t={t} />
      <PillarHeader
        t={t}
        title="WOD Logger"
        sub="Log your workout"
        pillarColor={t.pillar.train}
        onMenu={onMenu}
      />

      {/* Mode tabs */}
      <ModeTabs t={t} mode={mode} setMode={setMode} />

      {/* ── Scrollable body ── */}
      <div style={{
        height: 'calc(100% - 130px)',
        overflowY: 'auto',
        padding: '20px 20px 0',
        boxSizing: 'border-box',
        paddingBottom: 60,
      }}>
        {mode === 'quick'    && <QuickMode    t={t} workout={workout} setWorkout={setWorkout} onLog={handleLog} />}
        {mode === 'standard' && <StandardMode t={t} workout={workout} setWorkout={setWorkout} onLog={handleLog} />}
        {mode === 'full'     && <FullMode     t={t} workout={workout} setWorkout={setWorkout} onLog={handleLog} />}

        {/* F5 watermark */}
        <div style={{ position: 'relative', height: 60, marginTop: 10 }}>
          <div style={{
            position: 'absolute', right: 0, bottom: 0,
            width: 70, height: 70, opacity: 0.04, pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.fg} stroke={7} />
            </svg>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

export default WodLoggerScreen;
