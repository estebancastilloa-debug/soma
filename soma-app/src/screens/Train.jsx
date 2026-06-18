import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getRecentActivity } from '../lib/healthConnect.js';
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
  { value: 'amreps',   label: 'AMReps' },
  { value: 'emom',     label: 'EMOM' },
  { value: 'fortime',  label: 'For Time' },
  { value: 'notime',   label: 'Not for Time' },
  { value: 'deathby',  label: 'Death By' },
  { value: 'tabata',   label: 'Tabata' },
  { value: 'custom',   label: 'Otro' },
];

// Common rep schemes for "For Time" workouts
const REP_SCHEMES = [
  { value: '21-15-9',          label: '21-15-9' },
  { value: '50-40-30-20-10',   label: '50-40-30-20-10' },
  { value: '10-9-8-7-6-5-4-3-2-1', label: '10→1' },
  { value: 'custom',           label: 'Otro' },
];

const SCORE_UNITS = [
  { value: 'time',   label: 'min:seg' },
  { value: 'reps',   label: 'reps' },
  { value: 'load',   label: 'kg' },
  { value: 'rounds', label: 'rondas' },
];

// Default score unit per WOD type
const TYPE_DEFAULT_UNIT = {
  strength: 'load',
  amrap:    'rounds',
  amreps:   'reps',
  emom:     'rounds',
  fortime:  'time',
  notime:   'reps',
  deathby:  'rounds',
  tabata:   'reps',
  custom:   'time',
};

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

function ThreeWeekCalendar({ t, workoutDates, activityDates }) {
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
                const hasActivity = !hasWorkout && activityDates?.has(iso);

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
                      background: hasWorkout ? t.pillar.train : hasActivity ? t.secondary : 'transparent',
                      border: (hasWorkout || hasActivity) ? 'none' : `1.5px solid ${t.fgFaint}`,
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
  const [scheme, setScheme]   = useState('');
  const [customScheme, setCustomScheme] = useState('');
  const [score, setScore]     = useState('');
  const [unit, setUnit]       = useState('time');
  const [rpe, setRpe]         = useState('');
  const [notes, setNotes]     = useState('');
  const [saving, setSaving]   = useState(false);

  function pickType(value) {
    const next = wodType === value ? '' : value;
    setWodType(next);
    if (next && TYPE_DEFAULT_UNIT[next]) setUnit(TYPE_DEFAULT_UNIT[next]);
    if (next !== 'fortime') { setScheme(''); setCustomScheme(''); }
  }

  const inputStyle = {
    width: '100%', background: t.bg, border: `1px solid ${t.divider}`,
    borderRadius: 10, padding: '10px 12px', color: t.fg,
    fontFamily: t.fonts.body, fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  };

  async function handleSave() {
    if (!session?.user) return;
    setSaving(true);
    const schemeText = scheme === 'custom' ? customScheme.trim() : scheme;
    const notesWithScheme = [schemeText ? `Esquema: ${schemeText}` : '', notes].filter(Boolean).join('\n');
    const noScore = wodType === 'notime';
    await supabase.from('workouts').insert({
      user_id: session.user.id,
      date: todayIso(),
      name: name || null,
      wod_type: wodType || null,
      score_value: noScore ? null : (parseFloat(score) || null),
      score_unit: unit,
      rpe: parseInt(rpe) || null,
      notes: notesWithScheme || null,
    });
    setSaving(false);
    setName(''); setWodType(''); setScheme(''); setCustomScheme('');
    setScore(''); setRpe(''); setNotes('');
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
              onClick={() => pickType(w.value)}
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

      {/* For Time → rep scheme presets */}
      {wodType === 'fortime' && (
        <div>
          <MonoLabel t={t} style={{ marginBottom: 6 }}>esquema de reps</MonoLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {REP_SCHEMES.map(s => (
              <button
                key={s.value}
                onClick={() => setScheme(scheme === s.value ? '' : s.value)}
                style={{
                  ...pillBase,
                  background: scheme === s.value ? t.pillar.train : t.bg,
                  color: scheme === s.value ? '#0A0908' : t.fg,
                  border: `1px solid ${scheme === s.value ? t.pillar.train : t.divider}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {scheme === 'custom' && (
            <input
              placeholder="ej. 30-20-10"
              value={customScheme}
              onChange={e => setCustomScheme(e.target.value)}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          )}
        </div>
      )}

      {/* Score + unit — hidden for Not for Time */}
      {wodType !== 'notime' && (
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
      )}

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

// ─── NotebookLM programming modal ─────────────────────────────────────

function buildProgramPrompt(profile, workouts) {
  const today    = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const now      = new Date();
  const dow      = now.getDay();
  const mon      = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
  const weekStart = mon.toISOString().slice(0, 10);
  const weekEnd   = now.toISOString().slice(0, 10);

  const thisWeek = workouts.filter(w => w.date >= weekStart && w.date <= weekEnd);

  const goalMap  = { muscle: 'Ganar músculo', fat: 'Perder grasa', perf: 'Rendimiento', health: 'Salud general' };
  const goalsStr = profile?.goal ? profile.goal.split(',').map(g => goalMap[g] || g).join(', ') : 'No especificado';

  const wodLines = thisWeek.length === 0
    ? '  (Sin entrenamientos esta semana)'
    : thisWeek.map(w => {
        const d = new Date(w.date + 'T00:00:00').toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' });
        const parts = [`${d} | ${w.name || 'Entreno'}`];
        if (w.wod_type) parts.push(w.wod_type.toUpperCase());
        if (w.score_value != null) parts.push(`Score: ${w.score_value} ${w.score_unit || ''}`);
        if (w.rpe) parts.push(`RPE: ${w.rpe}/10`);
        if (w.notes) parts.push(`Notas: ${w.notes}`);
        return '  - ' + parts.join(' · ');
      }).join('\n');

  const injuryNotes = localStorage.getItem('soma_injury_notes') || '';
  const focusAreas  = (() => { try { return JSON.parse(localStorage.getItem('soma_focus_areas') || '[]'); } catch { return []; } })();
  const goals       = (() => { try { return JSON.parse(localStorage.getItem('soma_goals') || 'null'); } catch { return null; } })();
  const equipment   = (() => { try { return JSON.parse(localStorage.getItem('soma_equipment') || '[]'); } catch { return []; } })();
  const skills      = (() => { try { return JSON.parse(localStorage.getItem('soma_movements') || '{}'); } catch { return {}; } })();

  const equipStr    = equipment.length > 0 ? equipment.join(', ') : 'No especificado';
  const focusStr    = focusAreas.filter(a => a.status === 'active').map(a => `  - ${a.text}`).join('\n') || '  (Sin áreas de enfoque activas)';
  const annualGoal  = goals?.annual || '(No definida)';
  const quarterStr  = (goals?.quarterly || []).map((q, i) => `  Q${i+1}: ${q.text}`).join('\n') || '  (No definidos)';

  const advancedSkills = Object.entries(skills).filter(([,lv]) => lv >= 2).map(([s]) => s);
  const learningSkills = Object.entries(skills).filter(([,lv]) => lv === 1).map(([s]) => s);

  return `═══════════════════════════════════════
SOMA — PROMPT DE PROGRAMACIÓN SEMANAL
${today}
═══════════════════════════════════════

PERFIL DEL ATLETA:
  Nombre: ${profile?.name || '[sin nombre]'}
  Objetivo(s): ${goalsStr}
  Días/semana: ${profile?.days_per_week || '?'}
  Horario: ${profile?.time_of_day || 'no especificado'}
  Peso: ${profile?.weight_kg ? profile.weight_kg + ' kg' : '—'}
  Altura: ${profile?.height_cm ? profile.height_cm + ' cm' : '—'}

META ANUAL:
  ${annualGoal}

METAS TRIMESTRALES:
${quarterStr}

EQUIPO DISPONIBLE:
  ${equipStr}

SKILLS AVANZADOS (lv 2-3):
  ${advancedSkills.join(', ') || '(No registrados)'}
SKILLS EN PROGRESO (lv 1):
  ${learningSkills.join(', ') || '(No registrados)'}

ENTRENAMIENTOS ESTA SEMANA:
${wodLines}

ESTADO FÍSICO / LESIONES:
  ${injuryNotes ? injuryNotes.trim() : '(Sin lesiones reportadas)'}

ÁREAS DE ENFOQUE ACTUALES:
${focusStr}

═══════════════════════════════════════
SOLICITUD:

1. Analiza la carga de esta semana (volumen, intensidad, RPE promedio).
2. Considera mi estado físico y áreas de enfoque prioritarias.
3. Diseña la programación para los próximos ${profile?.days_per_week || 4} días.

Para CADA DÍA incluye:
  - Objetivo del día (fuerza, condicionamiento, skill, descanso activo)
  - Calentamiento específico (5-10 min)
  - Parte principal: WOD completo con movimientos, reps y cargas sugeridas para mi nivel
  - Tipo: AMRAP / EMOM / For Time / Fuerza / etc.
  - Escala o modificación considerando mis limitaciones físicas
  - Tiempo estimado total

4. Si necesitas más datos para una mejor programación, indica exactamente:
   NECESITA_DATO: [descripción del dato que falta]

═══════════════════════════════════════`;
}

function ProgramModal({ t, profile, workouts, onClose }) {
  const [tab,     setTab]     = useState('prompt');
  const [copied,  setCopied]  = useState(false);
  const [pasted,  setPasted]  = useState(() => localStorage.getItem('soma_program_next') || '');
  const prompt = buildProgramPrompt(profile, workouts);

  function copy() {
    navigator.clipboard?.writeText(prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function savePasted(val) {
    setPasted(val);
    localStorage.setItem('soma_program_next', val);
  }

  const alerts = [...(pasted.matchAll(/NECESITA_DATO:\s*(.+)/g))].map(m => m[1]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 95, background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 12px', borderBottom: `1px solid ${t.divider}`, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.fgMuted, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, padding: '0 0 10px', display: 'block' }}>
          ← Volver a Entrena
        </button>
        <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: t.fg }}>
          NotebookLM · Programación
        </div>
        <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, marginTop: 4, lineHeight: 1.4 }}>
          Copia el prompt → pégalo en NotebookLM → pega la respuesta aquí.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 20px 0', flexShrink: 0 }}>
        {[{ id: 'prompt', lab: '① Copiar prompt' }, { id: 'paste', lab: '② Pegar programa' }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer',
            background: tab === tb.id ? t.pillar.train : t.surface,
            color: tab === tb.id ? '#0A0908' : t.fgMuted,
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13,
            border: `1px solid ${tab === tb.id ? t.pillar.train : t.divider}`,
          }}>
            {tb.lab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 40px' }}>
        {tab === 'prompt' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <button onClick={copy} style={{
                padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: copied ? '#34C759' : t.pillar.train,
                color: '#0A0908', fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13,
              }}>
                {copied ? '✓ Copiado!' : 'Copiar prompt'}
              </button>
            </div>
            <textarea readOnly value={prompt} rows={28} style={{
              width: '100%', background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '14px', color: t.fg,
              fontFamily: t.fonts.mono, fontSize: 10.5, lineHeight: 1.6,
              resize: 'none', outline: 'none', boxSizing: 'border-box',
            }}/>
            <div style={{ marginTop: 12, padding: '12px 14px', background: t.surface, borderRadius: 12, border: `1px solid ${t.divider}` }}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.fgFaint, marginBottom: 6 }}>CÓMO USARLO</div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.6 }}>
                {'1. Copia el prompt arriba\n2. Abre NotebookLM con tu notebook de entrenamiento\n3. Pega el prompt en el chat y envíalo\n4. Copia la respuesta → pestaña "② Pegar programa"'}
              </div>
            </div>
          </>
        ) : (
          <>
            {alerts.length > 0 && (
              <div style={{ marginBottom: 12, padding: '12px 14px', background: '#FF9F0A18', border: '1.5px solid #FF9F0A', borderRadius: 12 }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF9F0A', marginBottom: 8 }}>
                  ⚠ DATOS FALTANTES DETECTADOS
                </div>
                {alerts.map((a, i) => (
                  <div key={i} style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fg, padding: '3px 0' }}>
                    → {a}
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={pasted}
              onChange={e => savePasted(e.target.value)}
              placeholder="Pega aquí la respuesta de NotebookLM con tu programación semanal..."
              rows={24}
              style={{
                width: '100%', background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: '14px', color: t.fg,
                fontFamily: t.fonts.body, fontSize: 13, lineHeight: 1.6,
                resize: 'none', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {pasted && (
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint, letterSpacing: '0.1em' }}>GUARDADO ✓</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── TrainScreen ─────────────────────────────────────────────────────

export function TrainScreen({ t, onNav, onMenu, onPlus }) {
  const { session, profile } = useAuth();
  const [workouts,     setWorkouts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [showProgram,  setShowProgram]  = useState(false);
  const [activity,     setActivity]     = useState([]); // phone-detected exercise sessions

  useEffect(() => {
    getRecentActivity(21).then(setActivity).catch(() => {});
    try {
      if (sessionStorage.getItem('soma_open_logform') === '1') {
        sessionStorage.removeItem('soma_open_logform');
        setShowForm(true);
      }
    } catch {}
  }, []);

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
          activityDates={new Set(activity.map(a => a.date))}
        />

        {/* ── Phone-detected activity ── */}
        {activity.length > 0 && (
          <>
            <SectionHead t={t}>actividad del teléfono</SectionHead>
            <div style={{ margin: '8px 20px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {activity.slice(0, 6).map((a, i) => {
                const logged = workouts.some(w => w.date === a.date);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: t.surface, border: `1px solid ${t.divider}`,
                    borderRadius: 12, padding: '10px 12px',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.secondary, flexShrink: 0 }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg }}>{a.title}</div>
                      <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.fgMuted, marginTop: 1 }}>
                        {formatDate(a.date)} · {a.durationMin} min
                      </div>
                    </div>
                    {logged
                      ? <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, color: t.pillar.train, letterSpacing: '0.06em' }}>WOD ✓</span>
                      : <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, color: t.secondary, letterSpacing: '0.06em' }}>REGISTRADO</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ margin: '6px 20px 0', fontFamily: t.fonts.body, fontSize: 11, color: t.fgFaint }}>
              Tu actividad física del teléfono queda registrada aunque no anotes el WOD.
            </div>
          </>
        )}

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

        {/* ── NotebookLM programming ── */}
        {(() => {
          const saved = localStorage.getItem('soma_program_next');
          return (
            <div style={{ margin: '14px 20px 0' }}>
              {saved ? (
                <div style={{ background: t.surface, border: `1px solid ${t.divider}`, borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.pillar.train }}>
                      PROGRAMACIÓN PRÓXIMA SEMANA
                    </div>
                    <button onClick={() => setShowProgram(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, color: t.fgMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      EDITAR →
                    </button>
                  </div>
                  <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: 120, overflow: 'hidden' }}>
                    {saved.slice(0, 300)}{saved.length > 300 ? '…' : ''}
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowProgram(true)} style={{
                  width: '100%', background: t.pillar.train + '15',
                  border: `1.5px dashed ${t.pillar.train}`,
                  borderRadius: 14, padding: '13px 0',
                  fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13.5,
                  color: t.pillar.train, cursor: 'pointer', letterSpacing: '-0.01em',
                }}>
                  Generar programación con NotebookLM →
                </button>
              )}
            </div>
          );
        })()}

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

      {showProgram && (
        <ProgramModal
          t={t}
          profile={profile}
          workouts={workouts}
          onClose={() => setShowProgram(false)}
        />
      )}
    </ScreenFrame>
  );
}

export default TrainScreen;
