import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ScreenFrame, StatusBar, PillarHeader,
  MonoLabel, SectionHead, Fab,
} from '../chrome.jsx';

// ─── Helpers ──────────────────────────────────────────────────────────

function getWeekDays(offset = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function isoDate(d) {
  return d.toISOString().split('T')[0];
}

function todayIso() {
  return isoDate(new Date());
}

const WOD_TYPES = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'amrap',    label: 'AMRAP' },
  { value: 'emom',     label: 'EMOM' },
  { value: 'fortime',  label: 'For Time' },
  { value: 'tabata',   label: 'Tabata' },
  { value: 'custom',   label: 'Otro' },
];

const SCORE_UNITS = [
  { value: 'time',   label: 'min:seg' },
  { value: 'reps',   label: 'reps' },
  { value: 'load',   label: 'kg' },
  { value: 'rounds', label: 'rondas' },
];

function formatScore(value, unit) {
  if (value == null) return '';
  if (unit === 'time') {
    const total = Math.round(value);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  const unitLabel = SCORE_UNITS.find(u => u.value === unit)?.label || unit;
  return `${value} ${unitLabel}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

function wodTypeLabel(wt) {
  return WOD_TYPES.find(w => w.value === wt)?.label || wt || '';
}

// ─── Three-week stacked calendar ───────────────────────────────────────

const WEEK_ROWS = [
  { offset: -1, label: '↑ anterior' },
  { offset:  0, label: 'esta semana' },
  { offset:  1, label: '↓ próxima' },
];

function ThreeWeekCalendar({ t, workoutDates }) {
  const today = todayIso();

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.divider}`,
      borderRadius: 18,
      margin: '14px 20px 0',
      padding: '14px 12px',
    }}>
      {WEEK_ROWS.map(({ offset, label }) => {
        const days = getWeekDays(offset);
        const isCurrent = offset === 0;
        const isPastOrNext = !isCurrent;

        return (
          <div
            key={offset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingTop: isCurrent ? 10 : 6,
              paddingBottom: isCurrent ? 10 : 6,
              borderLeft: isCurrent ? `3px solid ${t.accent}` : '3px solid transparent',
              paddingLeft: isCurrent ? 8 : 8,
              opacity: isPastOrNext ? 0.7 : 1,
              marginBottom: offset === -1 ? 4 : offset === 0 ? 4 : 0,
            }}
          >
            {/* Row label */}
            <div style={{
              width: 52,
              flexShrink: 0,
              fontFamily: t.fonts.mono,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isCurrent ? t.accent : t.fgFaint,
              lineHeight: 1.2,
              textAlign: 'right',
            }}>
              {label}
            </div>

            {/* Day columns */}
            <div style={{ display: 'flex', gap: 4, flex: 1 }}>
              {days.map((d, i) => {
                const iso = isoDate(d);
                const isToday = iso === today;
                const hasWorkout = workoutDates.has(iso);

                return (
                  <div key={iso} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <span style={{
                      fontFamily: t.fonts.mono,
                      fontSize: isCurrent ? 9 : 8,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isToday ? t.accent : t.fgMuted,
                    }}>
                      {DAY_LABELS[i]}
                    </span>

                    <div style={{
                      width: isCurrent ? 26 : 22,
                      height: isCurrent ? 26 : 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isToday ? t.accent : 'transparent',
                      border: isToday ? 'none' : `1.5px solid ${t.divider}`,
                    }}>
                      <span style={{
                        fontFamily: t.fonts.body,
                        fontWeight: isToday ? 700 : 500,
                        fontSize: isCurrent ? 11 : 10,
                        color: isToday ? '#0A0908' : t.fg,
                      }}>
                        {d.getDate()}
                      </span>
                    </div>

                    <div style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: hasWorkout ? t.pillar.train : 'transparent',
                      border: hasWorkout ? 'none' : `1.5px solid ${t.fgFaint}`,
                    }}/>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Today's workout card ──────────────────────────────────────────────

function TodayCard({ t, workout, onPlus }) {
  if (!workout) {
    return (
      <div style={{
        margin: '12px 20px 0', padding: '20px 18px',
        background: t.surface, border: `1px solid ${t.divider}`,
        borderRadius: 18, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: t.fonts.body, fontSize: 13.5, color: t.fgMuted,
          marginBottom: 14,
        }}>
          Sin entreno registrado hoy
        </div>
        <button onClick={onPlus} style={{
          background: t.pillar.train, color: '#0A0908',
          border: 'none', borderRadius: 12, padding: '12px 24px',
          fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
          cursor: 'pointer', letterSpacing: '-0.01em',
        }}>
          Registrar entreno
        </button>
      </div>
    );
  }

  return (
    <div style={{
      margin: '12px 20px 0', padding: '16px 18px',
      background: t.pillar.train + '18',
      border: `1.5px solid ${t.pillar.train}`,
      borderRadius: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: t.pillar.train, flexShrink: 0,
        }}/>
        <MonoLabel t={t} color={t.pillar.train}>HOY</MonoLabel>
      </div>
      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 20,
        letterSpacing: '-0.03em', color: t.fg, marginBottom: 4,
      }}>
        {workout.name || 'Entreno'}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {workout.wod_type && (
          <span style={{
            fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: t.pillar.train,
          }}>
            {wodTypeLabel(workout.wod_type)}
          </span>
        )}
        {workout.score_value != null && (
          <span style={{
            fontFamily: t.fonts.mono, fontSize: 10, color: t.fg,
            letterSpacing: '0.06em',
          }}>
            {formatScore(workout.score_value, workout.score_unit)}
          </span>
        )}
        {workout.rpe && (
          <span style={{
            fontFamily: t.fonts.mono, fontSize: 10, color: t.fgMuted,
            letterSpacing: '0.06em',
          }}>
            RPE {workout.rpe}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Quick-log form ────────────────────────────────────────────────────

function LogForm({ t, onSaved }) {
  const { session } = useAuth();
  const [name, setName]       = useState('');
  const [wodType, setWodType] = useState('');
  const [score, setScore]     = useState('');
  const [unit, setUnit]       = useState('time');
  const [rpe, setRpe]         = useState('');
  const [notes, setNotes]     = useState('');
  const [saving, setSaving]   = useState(false);

  const inputStyle = {
    width: '100%', background: t.bg, border: `1px solid ${t.divider}`,
    borderRadius: 10, padding: '10px 12px', color: t.fg,
    fontFamily: t.fonts.body, fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  };

  async function handleSave() {
    if (!session?.user) return;
    setSaving(true);
    await supabase.from('workouts').insert({
      user_id: session.user.id,
      date: todayIso(),
      name: name || null,
      wod_type: wodType || null,
      score_value: parseFloat(score) || null,
      score_unit: unit,
      rpe: parseInt(rpe) || null,
      notes: notes || null,
    });
    setSaving(false);
    setName(''); setWodType(''); setScore(''); setRpe(''); setNotes('');
    onSaved?.();
  }

  const pillBase = {
    border: 'none', borderRadius: 8, padding: '7px 11px',
    fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12,
    cursor: 'pointer', transition: 'background 0.15s',
  };

  return (
    <div style={{
      margin: '0 20px', padding: '16px',
      background: t.surface, border: `1px solid ${t.divider}`,
      borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 12,
    }}>

      {/* Name */}
      <input
        placeholder="Nombre del entreno (opcional)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={inputStyle}
      />

      {/* WOD type pills */}
      <div>
        <MonoLabel t={t} style={{ marginBottom: 6 }}>tipo</MonoLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {WOD_TYPES.map(w => (
            <button
              key={w.value}
              onClick={() => setWodType(wodType === w.value ? '' : w.value)}
              style={{
                ...pillBase,
                background: wodType === w.value ? t.pillar.train : t.bg,
                color: wodType === w.value ? '#0A0908' : t.fg,
                border: `1px solid ${wodType === w.value ? t.pillar.train : t.divider}`,
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Score + unit */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Score"
          value={score}
          onChange={e => setScore(e.target.value)}
          type="number"
          style={{ ...inputStyle, flex: 1 }}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          {SCORE_UNITS.map(u => (
            <button
              key={u.value}
              onClick={() => setUnit(u.value)}
              style={{
                ...pillBase,
                background: unit === u.value ? t.pillar.train : t.bg,
                color: unit === u.value ? '#0A0908' : t.fg,
                border: `1px solid ${unit === u.value ? t.pillar.train : t.divider}`,
                padding: '7px 9px', fontSize: 11,
              }}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* RPE pills */}
      <div>
        <MonoLabel t={t}>esfuerzo percibido (RPE)</MonoLabel>
        <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button
              key={n}
              onClick={() => setRpe(rpe === String(n) ? '' : String(n))}
              style={{
                ...pillBase,
                flex: 1, padding: '7px 2px', textAlign: 'center',
                background: rpe === String(n) ? t.pillar.train : t.bg,
                color: rpe === String(n) ? '#0A0908' : t.fgMuted,
                border: `1px solid ${rpe === String(n) ? t.pillar.train : t.divider}`,
                fontSize: 11,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <textarea
        placeholder="Notas (opcional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
      />

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: saving ? t.fgFaint : t.pillar.train,
          color: '#0A0908', border: 'none', borderRadius: 12,
          padding: '13px 0', fontFamily: t.fonts.body,
          fontWeight: 700, fontSize: 14.5, cursor: saving ? 'default' : 'pointer',
          letterSpacing: '-0.01em',
        }}
      >
        {saving ? 'Guardando…' : 'Guardar entrenamiento'}
      </button>
    </div>
  );
}

// ─── Past workout card ─────────────────────────────────────────────────

function WorkoutCard({ t, workout }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 20px', borderBottom: `1px solid ${t.divider}`,
    }}>
      {/* Date */}
      <div style={{
        minWidth: 36, textAlign: 'center',
        fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.06em', color: t.fgMuted, lineHeight: 1.4,
      }}>
        {formatDate(workout.date)}
      </div>

      {/* dot */}
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: t.pillar.train, flexShrink: 0,
      }}/>

      {/* Name + type */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13.5,
          color: t.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {workout.name || 'Entreno'}
        </div>
        {workout.wod_type && (
          <div style={{
            fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: t.pillar.train, marginTop: 2,
          }}>
            {wodTypeLabel(workout.wod_type)}
          </div>
        )}
      </div>

      {/* Score + RPE */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {workout.score_value != null && (
          <div style={{
            fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700,
            color: t.fg,
          }}>
            {formatScore(workout.score_value, workout.score_unit)}
          </div>
        )}
        {workout.rpe && (
          <div style={{
            fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgMuted,
            letterSpacing: '0.06em', marginTop: 1,
          }}>
            RPE {workout.rpe}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TrainScreen ─────────────────────────────────────────────────────

export function TrainScreen({ t, onNav, onMenu, onPlus }) {
  const { session } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadWorkouts = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })
      .limit(50);
    setWorkouts(data || []);
    setLoading(false);
  }, [session]);

  useEffect(() => { loadWorkouts(); }, [loadWorkouts]);

  const today        = todayIso();
  const todayWorkout = workouts.find(w => w.date === today) || null;

  function handleSaved() {
    setShowForm(false);
    loadWorkouts();
  }

  return (
    <ScreenFrame t={t} accentColor={t.pillar.train}>
      <StatusBar t={t}/>
      <PillarHeader
        t={t}
        title="Entrena"
        sub={new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
        pillarColor={t.pillar.train}
        onMenu={onMenu}
      />

      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* ── Three-week calendar ── */}
        <ThreeWeekCalendar
          t={t}
          workoutDates={new Set(workouts.map(w => w.date))}
        />

        {/* ── Today ── */}
        <SectionHead t={t}>hoy</SectionHead>
        <TodayCard t={t} workout={todayWorkout} onPlus={onPlus}/>

        {/* ── Log form toggle ── */}
        <div style={{ margin: '14px 20px 0' }}>
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              width: '100%', background: 'transparent',
              border: `1.5px dashed ${showForm ? t.pillar.train : t.divider}`,
              borderRadius: 14, padding: '11px 0',
              fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13.5,
              color: showForm ? t.pillar.train : t.fgMuted,
              cursor: 'pointer', letterSpacing: '-0.01em',
            }}
          >
            {showForm ? '✕ Cancelar' : 'Registrar entrenamiento +'}
          </button>
        </div>

        {showForm && (
          <div style={{ marginTop: 12 }}>
            <LogForm t={t} onSaved={handleSaved}/>
          </div>
        )}

        {/* ── History ── */}
        <SectionHead t={t}>historial</SectionHead>

        {loading ? (
          <div style={{
            padding: '28px 20px', textAlign: 'center',
            fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
          }}>
            Cargando…
          </div>
        ) : workouts.length === 0 ? (
          <div style={{
            padding: '28px 20px', textAlign: 'center',
            fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
          }}>
            Aún no hay entrenamientos registrados.
          </div>
        ) : (
          <div style={{ marginTop: 4 }}>
            {workouts.map(w => (
              <WorkoutCard key={w.id} t={t} workout={w}/>
            ))}
          </div>
        )}

      </div>

      <Fab t={t} onClick={onPlus}/>
    </ScreenFrame>
  );
}

export default TrainScreen;
