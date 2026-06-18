import { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  StatusBar, MonoLabel, ScreenFrame, Fab, PillarHeader, DragHandle, useSwipeDown,
} from '../chrome.jsx';
import { useBackClose } from '../lib/backstack.js';
import { F5, WordmarkWithMark } from '../marks.jsx';
import { checkAvailability, requestPermissions, requestPermissionsVerbose } from '../lib/healthConnect.js';
import { useTheme, INTENSITIES, ACCENTS } from '../theme.jsx';

const APP_BUILD = 'b16';

// ─── helpers ──────────────────────────────────────────────────────────────────

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

const LS_FOCUS          = 'soma_focus_areas';
const LS_INJURY         = 'soma_injury_notes';
const LS_EQUIPMENT      = 'soma_equipment';
const LS_EQUIPMENT_CUST = 'soma_equipment_custom';
const LS_MOVEMENTS      = 'soma_movements';
const LS_SKILL_PRS      = 'soma_skill_prs';
const LS_GOALS          = 'soma_goals';

function loadFocus()  { try { return JSON.parse(localStorage.getItem(LS_FOCUS) || '[]'); } catch { return []; } }
function saveFocus(v) { localStorage.setItem(LS_FOCUS, JSON.stringify(v)); }

function loadEquipment()  { try { return JSON.parse(localStorage.getItem(LS_EQUIPMENT) || '[]'); } catch { return []; } }
function saveEquipment(v) { localStorage.setItem(LS_EQUIPMENT, JSON.stringify(v)); }

function loadMovements()  { try { return JSON.parse(localStorage.getItem(LS_MOVEMENTS) || '[]'); } catch { return []; } }
function saveMovements(v) { localStorage.setItem(LS_MOVEMENTS, JSON.stringify(v)); }

function loadEquipCust()  { try { return JSON.parse(localStorage.getItem(LS_EQUIPMENT_CUST) || '[]'); } catch { return []; } }
function saveEquipCust(v) { localStorage.setItem(LS_EQUIPMENT_CUST, JSON.stringify(v)); }

function loadSkillPrs()  { try { return JSON.parse(localStorage.getItem(LS_SKILL_PRS) || '{}'); } catch { return {}; } }
function saveSkillPrs(v) { localStorage.setItem(LS_SKILL_PRS, JSON.stringify(v)); }

function loadGoals() {
  try {
    return JSON.parse(localStorage.getItem(LS_GOALS) || 'null') || { annual: '', quarterly: [], weekly: [] };
  } catch {
    return { annual: '', quarterly: [], weekly: [] };
  }
}
function saveGoals(v) { localStorage.setItem(LS_GOALS, JSON.stringify(v)); }

// ─── sub-components ───────────────────────────────────────────────────────────

function Pill({ t, active, onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
      fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12,
      background: active ? t.accent : t.s2,
      color: active ? '#0A0908' : t.fgMuted,
      transition: 'background 0.15s, color 0.15s',
      ...style,
    }}>
      {children}
    </button>
  );
}

function Input({ t, value, onChange, type = 'text', placeholder, style = {} }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '12px', borderRadius: 12,
        border: `1px solid ${t.border}`,
        background: t.surface, color: t.fg,
        fontFamily: t.fonts.body, fontSize: 14,
        outline: 'none',
        ...style,
      }}
    />
  );
}

// ─── Edit Profile card ────────────────────────────────────────────────────────

const GOALS = [
  { id: 'muscle',  label: 'Ganar músculo'  },
  { id: 'fat',     label: 'Perder grasa'   },
  { id: 'perf',    label: 'Rendimiento'    },
  { id: 'health',  label: 'Salud general'  },
];
const DAYS = [3, 4, 5, 6];
const TIMES = [
  { id: 'morning',   label: 'Mañana' },
  { id: 'afternoon', label: 'Tarde'  },
  { id: 'night',     label: 'Noche'  },
];

function EditProfileCard({ t, profile, saveProfile }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // form state
  const [name,       setName]       = useState('');
  const [weight,     setWeight]     = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height,     setHeight]     = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [goal,       setGoal]       = useState([]);
  const [days,       setDays]       = useState(null);
  const [timeOfDay,  setTimeOfDay]  = useState(null);

  function openEdit() {
    setName(profile?.name || '');
    const wkg = profile?.weight_kg || '';
    setWeight(wkg ? String(wkg) : '');
    setWeightUnit('kg');
    const hcm = profile?.height_cm || '';
    setHeight(hcm ? String(hcm) : '');
    setHeightUnit('cm');
    setGoal(profile?.goal ? profile.goal.split(',').filter(Boolean) : []);
    setDays(profile?.days_per_week || null);
    setTimeOfDay(profile?.time_of_day || null);
    setOpen(true);
  }

  function toggleGoal(id) {
    setGoal(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  }

  function changeWeightUnit(next) {
    if (next === weightUnit) return;
    const num = parseFloat(weight);
    if (!isNaN(num)) {
      const converted = next === 'lbs' ? num / 0.453592 : num * 0.453592;
      setWeight(String(Math.round(converted * 10) / 10));
    }
    setWeightUnit(next);
  }

  function changeHeightUnit(next) {
    if (next === heightUnit) return;
    const num = parseFloat(height);
    if (!isNaN(num)) {
      const converted = next === 'in' ? num / 2.54 : num * 2.54;
      setHeight(String(Math.round(converted * 10) / 10));
    }
    setHeightUnit(next);
  }

  async function handleSave() {
    setSaving(true);
    const weight_kg = weightUnit === 'kg'
      ? parseFloat(weight) || null
      : weight ? Math.round(parseFloat(weight) * 0.453592 * 10) / 10 : null;
    const height_cm = heightUnit === 'cm'
      ? parseFloat(height) || null
      : height ? Math.round(parseFloat(height) * 2.54 * 10) / 10 : null;
    try {
      await saveProfile({
        name:         name.trim() || profile?.name,
        weight_kg,
        height_cm,
        goal:         goal.join(','),
        days_per_week: days,
        time_of_day:  timeOfDay,
      });
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  const fieldLabel = { fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
    letterSpacing: '0.16em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 6 };
  const row = { marginBottom: 14 };

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: 16,
      margin: '8px 20px', border: `1px solid ${t.divider}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>
          Editar perfil
        </div>
        {!open && (
          <button onClick={openEdit} style={{
            padding: '5px 12px', borderRadius: 10, border: `1px solid ${t.divider}`,
            background: 'transparent', color: t.fgMuted, cursor: 'pointer',
            fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12,
          }}>
            Editar
          </button>
        )}
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          {/* Name */}
          <div style={row}>
            <div style={fieldLabel}>Nombre</div>
            <Input t={t} value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
          </div>

          {/* Weight */}
          <div style={row}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={fieldLabel}>Peso</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <Pill t={t} active={weightUnit === 'kg'} onClick={() => changeWeightUnit('kg')}>kg</Pill>
                <Pill t={t} active={weightUnit === 'lbs'} onClick={() => changeWeightUnit('lbs')}>lbs</Pill>
              </div>
            </div>
            <Input t={t} type="number" value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder={weightUnit === 'kg' ? 'ej. 75' : 'ej. 165'} />
          </div>

          {/* Height */}
          <div style={row}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={fieldLabel}>Altura</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <Pill t={t} active={heightUnit === 'cm'} onClick={() => changeHeightUnit('cm')}>cm</Pill>
                <Pill t={t} active={heightUnit === 'in'} onClick={() => changeHeightUnit('in')}>in</Pill>
              </div>
            </div>
            <Input t={t} type="number" value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder={heightUnit === 'cm' ? 'ej. 175' : 'ej. 69'} />
          </div>

          {/* Goal */}
          <div style={row}>
            <div style={fieldLabel}>Objetivo</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GOALS.map(g => (
                <Pill key={g.id} t={t} active={goal.includes(g.id)} onClick={() => toggleGoal(g.id)}>
                  {g.label}
                </Pill>
              ))}
            </div>
          </div>

          {/* Days per week */}
          <div style={row}>
            <div style={fieldLabel}>Días por semana</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {DAYS.map(d => (
                <Pill key={d} t={t} active={days === d} onClick={() => setDays(d)}>
                  {d}
                </Pill>
              ))}
            </div>
          </div>

          {/* Time of day */}
          <div style={{ ...row, marginBottom: 18 }}>
            <div style={fieldLabel}>Horario de entrenamiento</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {TIMES.map(tm => (
                <Pill key={tm.id} t={t} active={timeOfDay === tm.id} onClick={() => setTimeOfDay(tm.id)}>
                  {tm.label}
                </Pill>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 1, padding: '11px', borderRadius: 12, border: 'none',
              background: t.accent, color: '#0A0908', cursor: 'pointer',
              fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
              opacity: saving ? 0.6 : 1,
            }}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
            <button onClick={() => setOpen(false)} style={{
              flex: 1, padding: '11px', borderRadius: 12,
              border: `1px solid ${t.divider}`, background: 'transparent',
              color: t.fgMuted, cursor: 'pointer',
              fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14,
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Estado físico card ───────────────────────────────────────────────────────

function PhysicalStateCard({ t }) {
  const [notes, setNotes] = useState(() => localStorage.getItem(LS_INJURY) || '');

  const persist = useCallback((val) => {
    localStorage.setItem(LS_INJURY, val);
  }, []);
  const debouncedSave = useDebounce(persist, 1000);

  function handleChange(e) {
    const val = e.target.value;
    setNotes(val);
    debouncedSave(val);
  }

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: 16,
      margin: '8px 20px', border: `1px solid ${t.divider}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>
          Estado físico
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={t.fgFaint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="¿Alguna lesión o área que quieras cuidar?"
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '12px', borderRadius: 12,
          border: `1px solid ${t.border}`,
          background: t.bg, color: t.fg,
          fontFamily: t.fonts.body, fontSize: 13,
          lineHeight: 1.5, resize: 'none', outline: 'none',
        }}
      />
    </div>
  );
}

// ─── Áreas de enfoque card ────────────────────────────────────────────────────

// Connected catalog — movements come from skills, body areas predefined
const FOCUS_BODY_AREAS = [
  'Cuello', 'Hombros', 'Espalda alta', 'Lumbar', 'Core', 'Cadera',
  'Glúteos', 'Cuádriceps', 'Isquiotibiales', 'Rodillas', 'Tobillos', 'Muñecas',
];

const FOCUS_CATS = [
  { id: 'move', label: 'Movimientos' },
  { id: 'body', label: 'Cuerpo' },
];

function FocusAreasCard({ t }) {
  const [areas, setAreas]   = useState(() => {
    // migrate any legacy free-text entries into the new shape
    return loadFocus().map(a => a.label ? a : { id: a.id, label: a.text || a.label || '', cat: 'move', status: a.status || 'active' });
  });
  const [picking, setPicking]   = useState(false);
  const [pickCat, setPickCat]   = useState('move');

  function persist(next) {
    setAreas(next);
    saveFocus(next);
  }

  const selectedLabels = new Set(areas.map(a => a.label));

  function toggleItem(label, cat) {
    if (selectedLabels.has(label)) {
      persist(areas.filter(a => a.label !== label));
    } else {
      persist([...areas, { id: Date.now().toString() + label, label, cat, status: 'active' }]);
    }
  }

  function toggleStatus(id) {
    persist(areas.map(a => a.id === id
      ? { ...a, status: a.status === 'active' ? 'improved' : 'active' }
      : a
    ));
  }

  function removeArea(id) {
    persist(areas.filter(a => a.id !== id));
  }

  // Build catalog for the active picker category
  const catalog = pickCat === 'move'
    ? SKILL_GROUPS.flatMap(g => g.skills.map(s => ({ label: s, color: g.col })))
    : FOCUS_BODY_AREAS.map(b => ({ label: b, color: '#DC2626' }));

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: 16,
      margin: '8px 20px', border: `1px solid ${t.divider}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>
          Áreas de enfoque
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, color: t.fgFaint, letterSpacing: '0.1em' }}>
          {areas.length}
        </div>
      </div>

      {/* Selected focus items */}
      {areas.length === 0 && !picking && (
        <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgFaint, padding: '4px 0 12px', textAlign: 'center' }}>
          Elige movimientos o zonas del cuerpo que quieres priorizar.
        </div>
      )}

      {areas.map(area => {
        const improved = area.status === 'improved';
        const dotColor = area.cat === 'body' ? '#DC2626'
          : (SKILL_GROUPS.find(g => g.skills.includes(area.label))?.col || t.accent);
        return (
          <div key={area.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 0', borderBottom: `1px solid ${t.divider}`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0, opacity: improved ? 0.4 : 1 }}/>
            <div style={{
              flex: 1, fontFamily: t.fonts.body, fontSize: 13,
              color: improved ? t.fgMuted : t.fg,
              textDecoration: improved ? 'line-through' : 'none',
              opacity: improved ? 0.6 : 1,
            }}>
              {area.label}
            </div>
            <button onClick={() => toggleStatus(area.id)} style={{
              padding: '4px 9px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: improved ? t.fgFaint : t.accent,
              color: improved ? t.fgMuted : '#0A0908', flexShrink: 0,
            }}>
              {improved ? 'Mejorado' : 'Activo'}
            </button>
            <button onClick={() => removeArea(area.id)} style={{
              width: 24, height: 24, borderRadius: 6, border: 'none',
              background: 'transparent', color: t.fgFaint, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>×</button>
          </div>
        );
      })}

      {/* Picker */}
      {!picking ? (
        <button onClick={() => setPicking(true)} style={{
          marginTop: 12, width: '100%', padding: '9px', borderRadius: 10,
          border: `1px dashed ${t.divider}`, background: 'transparent',
          color: t.fgMuted, cursor: 'pointer',
          fontFamily: t.fonts.body, fontSize: 12.5, fontWeight: 600,
        }}>
          + Agregar enfoque
        </button>
      ) : (
        <div style={{ marginTop: 12 }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {FOCUS_CATS.map(c => (
              <button key={c.id} onClick={() => setPickCat(c.id)} style={{
                padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                border: 'none',
                background: pickCat === c.id ? t.accent : t.s2,
                color: pickCat === c.id ? '#0A0908' : t.fgMuted,
                fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {c.label}
              </button>
            ))}
            <button onClick={() => setPicking(false)} style={{
              marginLeft: 'auto', padding: '5px 10px', borderRadius: 8, border: 'none',
              background: t.s2, color: t.fgMuted, cursor: 'pointer',
              fontFamily: t.fonts.body, fontSize: 12, fontWeight: 600,
            }}>
              Listo
            </button>
          </div>
          {/* Selectable chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
            {catalog.map(item => {
              const on = selectedLabels.has(item.label);
              return (
                <button key={item.label} onClick={() => toggleItem(item.label, pickCat)} style={{
                  padding: '6px 11px', borderRadius: 999,
                  border: `1px solid ${on ? item.color : t.border}`,
                  background: on ? item.color + '20' : t.s2,
                  color: on ? item.color : t.fgMuted,
                  cursor: 'pointer', fontFamily: t.fonts.body, fontSize: 12,
                  fontWeight: on ? 600 : 400,
                }}>
                  {on ? '✓ ' : ''}{item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Equipment card (BTWB-style predefined checklist) ─────────────────────────

const EQUIPMENT_GROUPS = [
  { group: 'BARRAS & PESO LIBRE', items: ['Barra olímpica', 'Barra de peso ligero (15 kg)', 'Mancuernas', 'Kettlebell', 'Discos / Bumper plates', 'Chaleco con peso'] },
  { group: 'GYMNASTICS',          items: ['Barra de dominadas', 'Anillas', 'Paralelas (Parallettes)', 'Cuerda de escalar'] },
  { group: 'CARDIO',              items: ['Remo (Concept2)', 'Bici de asalto (Assault / Echo)', 'SkiErg', 'Cuerda para saltar'] },
  { group: 'ACCESORIOS',          items: ['Cajón pliométrico (Box)', 'Balón medicinal (Wall ball)', 'AbMat', 'GHD', 'Banda elástica', 'Foam roller'] },
];

const EQUIPMENT_KB = {
  'Barra olímpica':               { desc: 'Barra estándar de 20 kg (hombres) o 15 kg (mujeres). Esencial para levantamientos olímpicos y powerlifting.', moves: ['Snatch', 'Clean & Jerk', 'Back Squat', 'Deadlift', 'Bench Press', 'Strict Press', 'Thruster'] },
  'Barra de peso ligero (15 kg)': { desc: 'Barra técnica de 15 kg. Ideal para aprender técnica olímpica o para atletas de menor masa corporal.', moves: ['Power Snatch', 'Power Clean', 'Hang Power Clean', 'Push Jerk', 'Overhead Squat'] },
  'Mancuernas':                   { desc: 'Permite trabajo unilateral para corregir desbalances musculares. Alta versatilidad y rango de movimiento.', moves: ['DB Snatch', 'DB Clean', 'DB Thruster', 'Lunge', 'Row', 'Press', 'Curl'] },
  'Kettlebell':                   { desc: 'El centro de masa desplazado desafía la estabilidad y el core. Excelente para fuerza funcional y acondicionamiento.', moves: ['KB Swing', 'KB Clean', 'KB Snatch', 'Turkish Get-Up', 'Goblet Squat', 'Farmer Carry'] },
  'Discos / Bumper plates':       { desc: 'Discos de goma que permiten dejar caer la barra de forma segura. Necesarios para levantamientos olímpicos.', moves: ['Todos los levantamientos olímpicos', 'Deadlift', 'Plate Ground-to-Overhead'] },
  'Chaleco con peso':             { desc: 'Añade carga externa a movimientos bodyweight. Varía de 5 a 20+ kg para progressión continua.', moves: ['Pull-up lastrado', 'Dip', 'Push-up', 'Running', 'Box Jump', 'Rope Climb'] },
  'Barra de dominadas':           { desc: 'Elemento fundamental para trabajo de espalda y gymnastics. Permite kipping y butterfly además de estricto.', moves: ['Pull-up', 'Chest-to-bar', 'Muscle-up', 'Toes-to-bar', 'L-sit', 'Hanging knee raise'] },
  'Anillas':                      { desc: 'Las anillas inestables activan más musculatura estabilizadora que barras fijas. Nivel de dificultad ajustable por altura.', moves: ['Ring Dip', 'Ring Muscle-up', 'Ring Row', 'Ring Push-up', 'False Grip', 'Skin the Cat'] },
  'Paralelas (Parallettes)':      { desc: 'Barras bajas para gymnastics avanzado. Alivian presión en muñecas vs el piso.', moves: ['L-sit', 'V-sit', 'HSPU', 'Handstand', 'Pike Push-up', 'Planche progressions'] },
  'Cuerda de escalar':            { desc: 'Desarrolla fuerza de agarre, bíceps y core. Variante legless (sin piernas) amplía el reto significativamente.', moves: ['Rope Climb', 'Legless Rope Climb', 'Rope Pull', 'Towel Pull-up'] },
  'Remo (Concept2)':              { desc: 'Cardio de bajo impacto que trabaja todo el cuerpo 86% muscular. Métrica estándar en CrossFit: split de 500m.', moves: ['Row 500m', 'Row 2k', 'Row 5k', 'EMOM Row', 'Pyramid Row'] },
  'Bici de asalto (Assault / Echo)': { desc: 'Cardio de alta intensidad con resistencia infinita. La resistencia aumenta exponencialmente con la velocidad.', moves: ['Echo Bike Calories', 'Assault Bike Sprint', 'AMRAP Cals', 'Tabata Bike'] },
  'SkiErg':                       { desc: 'Simula esquí nórdico. Cardio de tren superior con mucho trabajo de lat, core y tracción.', moves: ['SkiErg 500m', 'SkiErg Calories', 'Double Ski + Burpee', 'EMOM Ski'] },
  'Cuerda para saltar':           { desc: 'Herramienta de acondicionamiento cardiovascular y coordinación. Double-unders son estándar en CrossFit.', moves: ['Single Under', 'Double Under', 'Triple Under', 'Crossovers', 'DU Tabata'] },
  'Cajón pliométrico (Box)':      { desc: 'Para saltos de potencia y step-ups de fuerza. Alturas estándar: 50/60/70 cm. Superficie de caída al usar para jump.', moves: ['Box Jump', 'Box Step-up', 'Box Step-over', 'Seated Box Jump', 'Broad Jump'] },
  'Balón medicinal (Wall ball)':  { desc: 'Pelota lastrada de 9-14 kg para movimientos explosivos. El wall ball shot combina squat + press en un movimiento.', moves: ['Wall Ball Shot', 'Wall Ball Toss', 'MB Slam', 'Squat to Toss', 'MB Clean'] },
  'AbMat':                        { desc: 'Almohadilla lumbar que aumenta el rango del abdominal y protege la espalda baja durante sit-ups.', moves: ['AbMat Sit-up', 'Butterfly Sit-up', 'V-up modificado', 'Hollow rock'] },
  'GHD':                          { desc: 'Glute-Ham Developer. Desarrolla cadena posterior e isquiotibiales. Uso avanzado — progresar gradualmente.', moves: ['GHD Sit-up', 'Hip Extension', 'Back Extension', 'Reverse Hyper'] },
  'Banda elástica':               { desc: 'Para asistencia en dominadas, activación de glúteos y trabajo de movilidad. Resistencia varía por grosor.', moves: ['Banded Pull-up', 'Banded Squat', 'Glute Activation', 'Face Pull', 'Banded Press'] },
  'Foam roller':                  { desc: 'Automasaje miofascial para recuperación y movilidad articular. Usar pre y post entrenamiento.', moves: ['IT Band roll', 'Thoracic roll', 'Quad roll', 'Hip flexor release', 'Lat roll'] },
};

function EquipmentCard({ t }) {
  const [checked, setChecked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(LS_EQUIPMENT) || '[]')); }
    catch { return new Set(); }
  });
  const [customItems, setCustomItems] = useState(() => loadEquipCust());
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [infoItem, setInfoItem] = useState(null); // { name, kb }
  useBackClose(!!infoItem, () => setInfoItem(null));
  const infoSwipe = useSwipeDown(() => setInfoItem(null));

  function toggle(name) {
    const next = new Set(checked);
    next.has(name) ? next.delete(name) : next.add(name);
    setChecked(next);
    localStorage.setItem(LS_EQUIPMENT, JSON.stringify([...next]));
  }

  function addCustom() {
    const name = customInput.trim();
    if (!name) return;
    const next = [...customItems, name];
    setCustomItems(next);
    saveEquipCust(next);
    // auto-check it
    const nextChecked = new Set(checked);
    nextChecked.add(name);
    setChecked(nextChecked);
    localStorage.setItem(LS_EQUIPMENT, JSON.stringify([...nextChecked]));
    setCustomInput('');
    setShowCustomInput(false);
  }

  function removeCustom(name) {
    const next = customItems.filter(c => c !== name);
    setCustomItems(next);
    saveEquipCust(next);
    const nextChecked = new Set(checked);
    nextChecked.delete(name);
    setChecked(nextChecked);
    localStorage.setItem(LS_EQUIPMENT, JSON.stringify([...nextChecked]));
  }

  const predefinedTotal = EQUIPMENT_GROUPS.reduce((s, g) => s + g.items.length, 0);
  const total = predefinedTotal + customItems.length;

  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 16, margin: '8px 20px', border: `1px solid ${t.divider}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>Equipo disponible</div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, color: t.fgFaint, letterSpacing: '0.1em' }}>
          {checked.size}/{total}
        </div>
      </div>

      {EQUIPMENT_GROUPS.map(({ group, items }) => (
        <div key={group} style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.fgFaint, marginBottom: 8 }}>
            {group}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(item => {
              const on = checked.has(item);
              const kb = EQUIPMENT_KB[item];
              return (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => toggle(item)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 10, border: 'none',
                    background: on ? t.accent + '18' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      background: on ? t.accent : 'transparent',
                      border: `2px solid ${on ? t.accent : t.fgFaint}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0908" strokeWidth="3" strokeLinecap="round"><polyline points="4,12 10,18 20,6"/></svg>}
                    </div>
                    <span style={{ fontFamily: t.fonts.body, fontSize: 13, color: on ? t.fg : t.fgMuted, fontWeight: on ? 600 : 400 }}>
                      {item}
                    </span>
                  </button>
                  {kb && (
                    <button onClick={() => setInfoItem({ name: item, kb })} style={{
                      width: 24, height: 24, borderRadius: 6, border: 'none',
                      background: 'transparent', cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: t.fgFaint,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom items */}
      {customItems.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.fgFaint, marginBottom: 8 }}>
            PERSONALIZADO
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {customItems.map(item => {
              const on = checked.has(item);
              return (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => toggle(item)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 10, border: 'none',
                    background: on ? t.accent + '18' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      background: on ? t.accent : 'transparent',
                      border: `2px solid ${on ? t.accent : t.fgFaint}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0908" strokeWidth="3" strokeLinecap="round"><polyline points="4,12 10,18 20,6"/></svg>}
                    </div>
                    <span style={{ fontFamily: t.fonts.body, fontSize: 13, color: on ? t.fg : t.fgMuted, fontWeight: on ? 600 : 400 }}>
                      {item}
                    </span>
                  </button>
                  <button onClick={() => removeCustom(item)} style={{
                    width: 24, height: 24, borderRadius: 6, border: 'none',
                    background: 'transparent', color: t.fgFaint, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
                  }}>×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add custom */}
      {showCustomInput ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="ej. Sled, GHD, Trap bar..."
            autoFocus
            style={{
              flex: 1, padding: '9px 11px', borderRadius: 10, border: `1px solid ${t.border}`,
              background: t.bg, color: t.fg, fontFamily: t.fonts.body, fontSize: 13, outline: 'none',
            }}
          />
          <button onClick={addCustom} style={{
            padding: '9px 14px', borderRadius: 10, border: 'none',
            background: t.accent, color: '#0A0908', cursor: 'pointer',
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            Agregar
          </button>
          <button onClick={() => { setShowCustomInput(false); setCustomInput(''); }} style={{
            padding: '9px 10px', borderRadius: 10, border: `1px solid ${t.divider}`,
            background: 'transparent', color: t.fgMuted, cursor: 'pointer', flexShrink: 0,
          }}>✕</button>
        </div>
      ) : (
        <button onClick={() => setShowCustomInput(true)} style={{
          marginTop: 8, width: '100%', padding: '8px', borderRadius: 10,
          border: `1px dashed ${t.divider}`, background: 'transparent',
          color: t.fgMuted, cursor: 'pointer',
          fontFamily: t.fonts.body, fontSize: 12, fontWeight: 600,
        }}>
          + Agregar equipo personalizado
        </button>
      )}

      {/* Equipment info popup */}
      {infoItem && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setInfoItem(null)}>
          <div onClick={e => e.stopPropagation()} {...infoSwipe} style={{
            width: '100%', background: t.bg, borderRadius: '20px 20px 0 0',
            padding: '12px 20px 40px', maxHeight: '70vh', overflow: 'auto',
          }}>
            <DragHandle t={t}/>
            <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 16, color: t.fg, marginBottom: 14 }}>{infoItem.name}</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 13.5, color: t.fgMuted, lineHeight: 1.6, marginBottom: 14 }}>
              {infoItem.kb.desc}
            </div>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: t.accent, textTransform: 'uppercase', marginBottom: 8 }}>
              Movimientos posibles
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {infoItem.kb.moves.map(m => (
                <div key={m} style={{ padding: '5px 10px', borderRadius: 8, background: t.surface, border: `1px solid ${t.divider}`, fontFamily: t.fonts.body, fontSize: 12, color: t.fg }}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skills card (BTWB-style with levels) ─────────────────────────────────────

const SKILL_GROUPS = [
  { group: 'HALTEROFILIA',  col: '#42C5F5', skills: ['Snatch', 'Clean', 'Jerk', 'Clean & Jerk', 'Power Snatch', 'Power Clean', 'Hang Power Clean', 'Hang Power Snatch'] },
  { group: 'FUERZA',        col: '#F5C542', skills: ['Back Squat', 'Front Squat', 'Overhead Squat', 'Deadlift', 'Romanian Deadlift', 'Bench Press', 'Strict Press', 'Push Press', 'Thruster'] },
  { group: 'GYMNASTICS',    col: '#C542F5', skills: ['Pull-up', 'Butterfly Pull-up', 'Chest-to-bar', 'Muscle-up (barra)', 'Muscle-up (anilla)', 'Ring Dip', 'HSPU', 'Handstand Walk', 'Pistol Squat', 'Toes-to-bar', 'L-sit', 'Rope Climb'] },
  { group: 'CARDIO & SKILLS', col: '#42F5A0', skills: ['Double-under', 'Box Jump', 'Wall Ball', 'Burpee', 'Running / Sprints', 'Rowing technique', 'Assault Bike', 'Sled Push/Pull'] },
];

const SKILL_LEVELS = [
  { label: '—',           color: null   },
  { label: 'Aprend.',     color: '#F59E0B' },
  { label: 'Compete.',    color: '#34C759' },
  { label: 'Avanzado',   color: '#C8FB5A' },
];

const PR_REPS = [1, 2, 3, 5, 10];

// Each skill group tracks PRs differently
const GROUP_METRIC = {
  'HALTEROFILIA':     'weight',
  'FUERZA':           'weight',
  'GYMNASTICS':       'reps',
  'CARDIO & SKILLS':  'time',
};
function metricForSkill(skill) {
  const g = SKILL_GROUPS.find(gr => gr.skills.includes(skill));
  return GROUP_METRIC[g?.group] || 'weight';
}

// time helpers (value stored in seconds)
function parseTime(str) {
  if (!str) return null;
  const s = String(str).trim();
  if (s.includes(':')) {
    const [m, sec] = s.split(':');
    const total = (parseInt(m, 10) || 0) * 60 + (parseInt(sec, 10) || 0);
    return total > 0 ? total : null;
  }
  const n = parseFloat(s);
  return isNaN(n) || n <= 0 ? null : Math.round(n);
}
function formatTime(seconds) {
  if (seconds == null) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// short summary chip for a skill row
function prSummary(skill, skillPrs, metricOverride) {
  if (!skillPrs) return null;
  const metric = metricOverride || metricForSkill(skill);
  if (metric === 'weight') {
    const best = skillPrs['1'] || skillPrs[1];
    return best ? `${best.value}${skillPrs.unit || 'kg'}` : null;
  }
  if (metric === 'reps') {
    return skillPrs.reps ? `${skillPrs.reps.value} reps` : null;
  }
  if (metric === 'time') {
    return skillPrs.time ? formatTime(skillPrs.time.value) : null;
  }
  return null;
}

function SkillsCard({ t }) {
  const [skills, setSkills] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_MOVEMENTS) || '{}'); }
    catch { return {}; }
  });
  const [prs, setPrs] = useState(() => loadSkillPrs());
  const [activeGroup, setActiveGroup] = useState(SKILL_GROUPS[0].group);
  const [prSkill, setPrSkill] = useState(null); // skill name whose edit sheet is open
  const [prInputs, setPrInputs] = useState({}); // temp input values in the sheet
  const [prUnit, setPrUnit] = useState('kg');   // weight unit in the sheet
  const [prName, setPrName] = useState('');      // editable movement name
  const [prMetric, setPrMetric] = useState('weight'); // editable metric type
  const [adding, setAdding]   = useState(false);
  const [newSkill, setNewSkill] = useState('');
  // user-edited movement lists per group (overrides defaults)
  const [skillLists, setSkillLists] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soma_skill_lists') || '{}'); }
    catch { return {}; }
  });
  // per-movement metric override
  const [skillMetrics, setSkillMetrics] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soma_skill_metrics') || '{}'); }
    catch { return {}; }
  });
  useBackClose(!!prSkill, () => setPrSkill(null));
  const prSwipe = useSwipeDown(() => setPrSkill(null));

  const today = () => new Date().toISOString().slice(0, 10);

  function defaultList(group) { return SKILL_GROUPS.find(g => g.group === group)?.skills || []; }
  function getList(group)     { return skillLists[group] || defaultList(group); }
  function persistLists(next) { setSkillLists(next); localStorage.setItem('soma_skill_lists', JSON.stringify(next)); }
  function withGroup(next, group) { if (!next[group]) next[group] = [...defaultList(group)]; return next; }

  function metricFor(skill) { return skillMetrics[skill] || GROUP_METRIC[activeGroup] || 'weight'; }

  // migrate level + PR + metric data when a movement is renamed
  function migrateKey(oldName, newName) {
    if (!oldName || !newName || oldName === newName) return;
    if (skills[oldName] != null) {
      const n = { ...skills }; n[newName] = n[oldName]; delete n[oldName];
      setSkills(n); localStorage.setItem(LS_MOVEMENTS, JSON.stringify(n));
    }
    if (prs[oldName]) {
      const n = { ...prs }; n[newName] = n[oldName]; delete n[oldName];
      setPrs(n); saveSkillPrs(n);
    }
    if (skillMetrics[oldName]) {
      const n = { ...skillMetrics }; n[newName] = n[oldName]; delete n[oldName];
      setSkillMetrics(n); localStorage.setItem('soma_skill_metrics', JSON.stringify(n));
    }
    // rename inside the group list
    const next = withGroup({ ...skillLists }, activeGroup);
    const idx = next[activeGroup].indexOf(oldName);
    if (idx >= 0) { next[activeGroup] = next[activeGroup].slice(); next[activeGroup][idx] = newName; persistLists(next); }
  }

  function removeSkill(name) {
    const next = withGroup({ ...skillLists }, activeGroup);
    next[activeGroup] = next[activeGroup].filter(s => s !== name);
    persistLists(next);
    if (skills[name] != null) { const n = { ...skills }; delete n[name]; setSkills(n); localStorage.setItem(LS_MOVEMENTS, JSON.stringify(n)); }
    if (prs[name]) { const n = { ...prs }; delete n[name]; setPrs(n); saveSkillPrs(n); }
    if (skillMetrics[name]) { const n = { ...skillMetrics }; delete n[name]; setSkillMetrics(n); localStorage.setItem('soma_skill_metrics', JSON.stringify(n)); }
    setPrSkill(null);
  }

  function addSkill() {
    const name = newSkill.trim();
    if (!name) return;
    const next = withGroup({ ...skillLists }, activeGroup);
    if (!next[activeGroup].includes(name)) next[activeGroup] = [...next[activeGroup], name];
    persistLists(next);
    setNewSkill(''); setAdding(false);
  }

  function cycleLevel(skill) {
    const cur = skills[skill] || 0;
    const next = { ...skills, [skill]: (cur + 1) % 4 };
    setSkills(next);
    localStorage.setItem(LS_MOVEMENTS, JSON.stringify(next));
  }

  function openPrSheet(skill) {
    const existing = prs[skill] || {};
    setPrName(skill);
    setPrMetric(metricFor(skill));
    const inputs = {};
    PR_REPS.forEach(r => { inputs[r] = existing[r]?.value ?? ''; });
    inputs.reps = existing.reps?.value ?? '';
    inputs.time = existing.time ? formatTime(existing.time.value) : '';
    setPrUnit(existing.unit || 'kg');
    setPrInputs(inputs);
    setPrSkill(skill);
  }

  function savePrs() {
    const original = prSkill;
    const metric = prMetric;
    // handle rename first
    const newName = prName.trim();
    if (newName && newName !== original) migrateKey(original, newName);
    const skill = newName || original;

    // persist metric choice
    const nm = { ...skillMetrics, [skill]: metric };
    setSkillMetrics(nm);
    localStorage.setItem('soma_skill_metrics', JSON.stringify(nm));

    const existing = prs[skill] || {};
    let updated = { ...existing, metric };

    if (metric === 'weight') {
      updated.unit = prUnit;
      PR_REPS.forEach(r => {
        const val = parseFloat(prInputs[r]);
        if (!isNaN(val) && val > 0) {
          const prev = existing[r];
          updated[r] = { value: val, date: (!prev || val > prev.value) ? today() : prev.date };
        }
      });
    } else if (metric === 'reps') {
      const val = parseInt(prInputs.reps, 10);
      if (!isNaN(val) && val > 0) {
        const prev = existing.reps;
        updated.reps = { value: val, date: (!prev || val > prev.value) ? today() : prev.date };
      }
    } else if (metric === 'time') {
      const val = parseTime(prInputs.time);
      if (val != null) {
        const prev = existing.time;
        updated.time = { value: val, date: (!prev || val < prev.value) ? today() : prev.date };
      }
    }

    const nextPrs = { ...prs, [skill]: updated };
    setPrs(nextPrs);
    saveSkillPrs(nextPrs);
    setPrSkill(null);
  }

  const group = SKILL_GROUPS.find(g => g.group === activeGroup);
  const groupSkills = getList(activeGroup);
  const groupMetric = GROUP_METRIC[activeGroup] || 'weight';
  const sheetMetric = prMetric;
  const metricLabel = { weight: 'PESO', reps: 'REPS MÁX', time: 'MEJOR TIEMPO' }[sheetMetric] || '';

  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 16, margin: '8px 20px', border: `1px solid ${t.divider}` }}>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg, marginBottom: 12 }}>
        Skills & Movimientos
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {SKILL_GROUPS.map(g => (
          <button key={g.group} onClick={() => setActiveGroup(g.group)} style={{
            padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
            background: activeGroup === g.group ? g.col + '30' : t.s2,
            color: activeGroup === g.group ? g.col : t.fgMuted,
            fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            border: `1px solid ${activeGroup === g.group ? g.col : 'transparent'}`,
          }}>
            {g.group}
          </button>
        ))}
      </div>

      {/* Metric hint for active group */}
      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint, letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>
        {GROUP_METRIC[activeGroup] === 'weight' ? 'PR por peso · 1·2·3·5·10 RM'
          : GROUP_METRIC[activeGroup] === 'reps' ? 'PR por reps máximas'
          : 'PR por mejor tiempo'}
      </div>

      {/* Skill level legend */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        {SKILL_LEVELS.map((lv, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3].map(dot => (
                <div key={dot} style={{ width: 5, height: 5, borderRadius: '50%', background: dot <= i ? (lv.color || t.fgFaint) : t.s2 }}/>
              ))}
            </div>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8, color: t.fgFaint, letterSpacing: '0.06em' }}>{lv.label}</span>
          </div>
        ))}
      </div>

      {/* Skills list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groupSkills.map(skill => {
          const level = skills[skill] || 0;
          const lv = SKILL_LEVELS[level];
          const skillPrs = prs[skill] || null;
          const summary = prSummary(skill, skillPrs, metricFor(skill));
          const hasPr = !!summary;
          return (
            <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => cycleLevel(skill)} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 10, border: 'none',
                background: level > 0 ? (group.col + '12') : 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {[1,2,3].map(dot => (
                    <div key={dot} style={{ width: 7, height: 7, borderRadius: '50%', background: dot <= level ? (lv.color || group.col) : t.s2 }}/>
                  ))}
                </div>
                <span style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 13, color: level > 0 ? t.fg : t.fgMuted, fontWeight: level > 0 ? 600 : 400 }}>
                  {skill}
                </span>
                {hasPr && (
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, color: group.col, letterSpacing: '0.04em', flexShrink: 0 }}>
                    {summary}
                  </span>
                )}
                {!hasPr && level > 0 && (
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, color: lv.color || group.col, letterSpacing: '0.06em', flexShrink: 0 }}>
                    {lv.label}
                  </span>
                )}
              </button>
              <button onClick={() => openPrSheet(skill)} style={{
                padding: '0 10px', height: 28, borderRadius: 8, flexShrink: 0,
                border: `1px solid ${hasPr ? group.col : t.border}`,
                background: hasPr ? group.col + '20' : 'transparent',
                color: hasPr ? group.col : t.fgMuted,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: t.fonts.body, fontSize: 11, fontWeight: 600,
              }}>
                Editar
              </button>
            </div>
          );
        })}
      </div>

      {/* Add movement (separate button) */}
      {adding ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            value={newSkill}
            autoFocus
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
            placeholder={`Nuevo movimiento en ${activeGroup}…`}
            style={{ flex: 1, padding: '9px 11px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bg, color: t.fg, fontFamily: t.fonts.body, fontSize: 13, outline: 'none' }}
          />
          <button onClick={addSkill} style={{
            padding: '9px 14px', borderRadius: 10, border: 'none', background: t.accent, color: '#0A0908',
            cursor: 'pointer', fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>Agregar</button>
          <button onClick={() => { setAdding(false); setNewSkill(''); }} style={{
            padding: '9px 10px', borderRadius: 10, border: `1px solid ${t.divider}`, background: 'transparent',
            color: t.fgMuted, cursor: 'pointer', flexShrink: 0,
          }}>✕</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          marginTop: 10, width: '100%', padding: '10px', borderRadius: 10,
          border: `1px dashed ${t.divider}`, background: 'transparent', color: t.fgMuted, cursor: 'pointer',
          fontFamily: t.fonts.body, fontSize: 13, fontWeight: 600,
        }}>
          + Agregar movimiento
        </button>
      )}

      <div style={{ marginTop: 10, fontFamily: t.fonts.body, fontSize: 11, color: t.fgFaint }}>
        Toca el nombre para cambiar nivel · "Editar" para cambiar peso, métrica, reps o tiempo
      </div>

      {/* PR Sheet overlay */}
      {prSkill && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setPrSkill(null)}>
          <div onClick={e => e.stopPropagation()} {...prSwipe} style={{
            width: '100%', background: t.bg, borderRadius: '20px 20px 0 0', padding: '12px 20px 40px',
          }}>
            <DragHandle t={t}/>

            {/* Editable name */}
            <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 6 }}>Movimiento</div>
            <input
              value={prName}
              onChange={e => setPrName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', borderRadius: 12, border: `1px solid ${t.border}`,
                background: t.surface, color: t.fg, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 15, outline: 'none', marginBottom: 16 }}
            />

            {/* Metric type selector */}
            <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 8 }}>Métrica</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              {[{ id: 'weight', label: 'Peso' }, { id: 'reps', label: 'Reps' }, { id: 'time', label: 'Tiempo' }].map(m => (
                <button key={m.id} onClick={() => setPrMetric(m.id)} style={{
                  flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${prMetric === m.id ? t.accent : t.border}`,
                  background: prMetric === m.id ? t.accent + '18' : t.s2,
                  color: prMetric === m.id ? t.fg : t.fgMuted,
                  fontFamily: t.fonts.body, fontWeight: prMetric === m.id ? 700 : 500, fontSize: 13,
                }}>{m.label}</button>
              ))}
            </div>

            {/* WEIGHT: unit toggle + rep-max table */}
            {sheetMetric === 'weight' && (
              <>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {['kg', 'lbs'].map(u => (
                    <button key={u} onClick={() => setPrUnit(u)} style={{
                      flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${prUnit === u ? t.accent : t.border}`,
                      background: prUnit === u ? t.accent + '18' : t.s2,
                      color: prUnit === u ? t.fg : t.fgMuted,
                      fontFamily: t.fonts.body, fontWeight: prUnit === u ? 700 : 500, fontSize: 13,
                    }}>{u}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {PR_REPS.map(r => {
                    const saved = prs[prSkill]?.[r];
                    return (
                      <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, color: t.fgMuted, textAlign: 'right', flexShrink: 0 }}>
                          {r}RM
                        </div>
                        <input
                          type="number" inputMode="decimal"
                          value={prInputs[r] ?? ''}
                          onChange={e => setPrInputs(prev => ({ ...prev, [r]: e.target.value }))}
                          placeholder={saved ? String(saved.value) : '—'}
                          style={{
                            flex: 1, padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`,
                            background: t.surface, color: t.fg, fontFamily: t.fonts.mono, fontSize: 15, fontWeight: 700, outline: 'none',
                          }}
                        />
                        {saved && (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, color: t.accent }}>{saved.value} {prs[prSkill]?.unit || 'kg'}</div>
                            <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint }}>{saved.date}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* REPS: single max reps */}
            {sheetMetric === 'reps' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, marginBottom: 8 }}>
                  Máximo de repeticiones sin parar
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="number" inputMode="numeric"
                    value={prInputs.reps ?? ''}
                    onChange={e => setPrInputs(prev => ({ ...prev, reps: e.target.value }))}
                    placeholder={prs[prSkill]?.reps ? String(prs[prSkill].reps.value) : 'ej. 25'}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${t.border}`,
                      background: t.surface, color: t.fg, fontFamily: t.fonts.mono, fontSize: 18, fontWeight: 700, outline: 'none',
                    }}
                  />
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, color: t.fgMuted }}>reps</span>
                  {prs[prSkill]?.reps && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, color: t.accent }}>{prs[prSkill].reps.value}</div>
                      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint }}>{prs[prSkill].reps.date}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TIME: best time */}
            {sheetMetric === 'time' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, marginBottom: 8 }}>
                  Mejor tiempo (minutos:segundos)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="text" inputMode="numeric"
                    value={prInputs.time ?? ''}
                    onChange={e => setPrInputs(prev => ({ ...prev, time: e.target.value }))}
                    placeholder={prs[prSkill]?.time ? formatTime(prs[prSkill].time.value) : 'ej. 3:45'}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${t.border}`,
                      background: t.surface, color: t.fg, fontFamily: t.fonts.mono, fontSize: 18, fontWeight: 700, outline: 'none',
                    }}
                  />
                  {prs[prSkill]?.time && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700, color: t.accent }}>{formatTime(prs[prSkill].time.value)}</div>
                      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint }}>{prs[prSkill].time.date}</div>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: t.fonts.body, fontSize: 10.5, color: t.fgFaint, marginTop: 6 }}>
                  Menor tiempo = mejor récord
                </div>
              </div>
            )}

            <button onClick={savePrs} style={{
              width: '100%', padding: '13px', borderRadius: 14, border: 'none',
              background: t.accent, color: '#0A0908', cursor: 'pointer',
              fontFamily: t.fonts.body, fontWeight: 700, fontSize: 15,
            }}>
              Guardar
            </button>
            <button onClick={() => removeSkill(prSkill)} style={{
              width: '100%', marginTop: 10, padding: '12px', borderRadius: 14,
              border: `1px solid ${t.semantic.low}44`, background: 'transparent', color: t.semantic.low,
              cursor: 'pointer', fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13,
            }}>
              Eliminar movimiento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Goals card (Quiet Progress-inspired) ────────────────────────────────────

function GoalsCard({ t }) {
  const [goals, setGoals] = useState(() => loadGoals());

  function persist(next) {
    setGoals(next);
    saveGoals(next);
  }

  // Annual
  function setAnnual(val) {
    persist({ ...goals, annual: val });
  }

  // Quarterly
  function addQuarterly() {
    if (goals.quarterly.length >= 3) return;
    const q = goals.quarterly.length + 1;
    persist({ ...goals, quarterly: [...goals.quarterly, { q, text: '' }] });
  }
  function setQuarterly(idx, val) {
    const next = goals.quarterly.map((item, i) => i === idx ? { ...item, text: val } : item);
    persist({ ...goals, quarterly: next });
  }
  function removeQuarterly(idx) {
    persist({ ...goals, quarterly: goals.quarterly.filter((_, i) => i !== idx) });
  }

  // Weekly
  function addWeekly() {
    if (goals.weekly.length >= 3) return;
    const w = goals.weekly.length + 1;
    persist({ ...goals, weekly: [...goals.weekly, { w, text: '', done: false }] });
  }
  function setWeeklyText(idx, val) {
    const next = goals.weekly.map((item, i) => i === idx ? { ...item, text: val } : item);
    persist({ ...goals, weekly: next });
  }
  function toggleWeeklyDone(idx) {
    const next = goals.weekly.map((item, i) => i === idx ? { ...item, done: !item.done } : item);
    persist({ ...goals, weekly: next });
  }
  function removeWeekly(idx) {
    persist({ ...goals, weekly: goals.weekly.filter((_, i) => i !== idx) });
  }

  const sectionLabel = {
    fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
    letterSpacing: '0.18em', color: t.fgFaint, textTransform: 'uppercase',
    marginBottom: 8,
  };

  const addRowBtn = (onClick, disabled) => (
    <button onClick={onClick} disabled={disabled} style={{
      marginTop: 8, width: '100%', padding: '8px', borderRadius: 10,
      border: `1px dashed ${t.divider}`, background: 'transparent',
      color: disabled ? t.fgFaint : t.fgMuted, cursor: disabled ? 'default' : 'pointer',
      fontFamily: t.fonts.body, fontSize: 12, fontWeight: 600,
      opacity: disabled ? 0.4 : 1,
    }}>
      + Agregar
    </button>
  );

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: 16,
      margin: '8px 20px', border: `1px solid ${t.divider}`,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>
          Metas
        </div>
        <div style={{
          fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgFaint,
          letterSpacing: '0.12em', marginTop: 2,
        }}>
          Anual → Trimestral → Semanal
        </div>
      </div>

      {/* META ANUAL */}
      <div style={{ marginBottom: 16 }}>
        <div style={sectionLabel}>Meta anual</div>
        <textarea
          value={goals.annual}
          onChange={e => setAnnual(e.target.value)}
          placeholder="¿Qué quieres lograr este año?"
          rows={2}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '11px 12px', borderRadius: 12,
            border: `1px solid ${t.border}`,
            background: t.bg, color: t.fg,
            fontFamily: t.fonts.body, fontSize: 13,
            lineHeight: 1.55, resize: 'none', outline: 'none',
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: t.divider, marginBottom: 14 }} />

      {/* ESTE TRIMESTRE */}
      <div style={{ marginBottom: 16 }}>
        <div style={sectionLabel}>Este trimestre</div>
        {goals.quarterly.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: t.fonts.mono, fontSize: 10, color: t.fgFaint,
              flexShrink: 0, width: 14, textAlign: 'right',
            }}>
              Q{item.q}
            </span>
            <input
              value={item.text}
              onChange={e => setQuarterly(idx, e.target.value)}
              placeholder={`Meta trimestral ${idx + 1}…`}
              style={{
                flex: 1, padding: '9px 11px', borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: t.bg, color: t.fg,
                fontFamily: t.fonts.body, fontSize: 13, outline: 'none',
              }}
            />
            <button onClick={() => removeQuarterly(idx)} style={{
              width: 22, height: 22, borderRadius: 6, border: 'none',
              background: 'transparent', color: t.fgFaint, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>
              ×
            </button>
          </div>
        ))}
        {addRowBtn(addQuarterly, goals.quarterly.length >= 3)}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: t.divider, marginBottom: 14 }} />

      {/* ESTA SEMANA */}
      <div>
        <div style={sectionLabel}>Esta semana</div>
        {goals.weekly.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <button
              onClick={() => toggleWeeklyDone(idx)}
              style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                border: `2px solid ${item.done ? t.accent : t.border}`,
                background: item.done ? t.accent : 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {item.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#0A0908" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <input
              value={item.text}
              onChange={e => setWeeklyText(idx, e.target.value)}
              placeholder={`Acción semanal ${idx + 1}…`}
              style={{
                flex: 1, padding: '9px 11px', borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: t.bg, color: item.done ? t.fgFaint : t.fg,
                fontFamily: t.fonts.body, fontSize: 13, outline: 'none',
                textDecoration: item.done ? 'line-through' : 'none',
                opacity: item.done ? 0.6 : 1,
              }}
            />
            <button onClick={() => removeWeekly(idx)} style={{
              width: 22, height: 22, borderRadius: 6, border: 'none',
              background: 'transparent', color: t.fgFaint, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>
              ×
            </button>
          </div>
        ))}
        {addRowBtn(addWeekly, goals.weekly.length >= 3)}
      </div>
    </div>
  );
}

// ─── Theme card ───────────────────────────────────────────────────────────────

function ThemeCard({ t }) {
  const { mode, setMode, intensityId, setIntensityId, accentId, setAccentId } = useTheme();
  const isMono = intensityId === 'mono';
  const previewIntensity = intensityId === 'vivid' ? 'vivid' : 'calm';

  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 16, margin: '8px 20px', border: `1px solid ${t.divider}` }}>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg, marginBottom: 12 }}>
        Apariencia
      </div>

      {/* Mode: dark / light */}
      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.fgFaint, marginBottom: 8 }}>
        Modo
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ id: 'dark', label: 'Oscuro' }, { id: 'light', label: 'Claro' }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
            border: `1px solid ${mode === m.id ? t.accent : t.border}`,
            background: mode === m.id ? t.accent + '18' : t.s2,
            color: mode === m.id ? t.fg : t.fgMuted,
            fontFamily: t.fonts.body, fontWeight: mode === m.id ? 700 : 500, fontSize: 13,
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Accent color */}
      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.fgFaint, marginBottom: 8 }}>
        Color de acento
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, opacity: isMono ? 0.4 : 1 }}>
        {Object.values(ACCENTS).map(a => {
          const on = accentId === a.id && !isMono;
          const color = a[previewIntensity];
          return (
            <button key={a.id} onClick={() => setAccentId(a.id)} disabled={isMono} style={{
              flex: 1, padding: '10px 6px', borderRadius: 12,
              cursor: isMono ? 'default' : 'pointer',
              border: `1.5px solid ${on ? color : t.border}`,
              background: on ? color + '20' : t.s2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: color, border: on ? `2px solid ${t.fg}` : 'none' }}/>
              <span style={{ fontFamily: t.fonts.body, fontSize: 11.5, fontWeight: on ? 700 : 500, color: on ? t.fg : t.fgMuted }}>{a.label}</span>
            </button>
          );
        })}
      </div>
      {isMono && (
        <div style={{ fontFamily: t.fonts.body, fontSize: 10.5, color: t.fgFaint, marginTop: -10, marginBottom: 16 }}>
          El modo Mono no usa color. Cambia la intensidad para elegir un acento.
        </div>
      )}

      {/* Intensity / palette */}
      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.fgFaint, marginBottom: 8 }}>
        Intensidad
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.values(INTENSITIES).map(opt => {
          const on = intensityId === opt.id;
          // preview swatches: the chosen accent at this intensity (or neutrals for mono)
          const swatches = opt.id === 'mono'
            ? [t.fg, t.fgMuted, t.fgFaint]
            : Object.values(ACCENTS).map(a => a[opt.id === 'vivid' ? 'vivid' : 'calm']);
          return (
            <button key={opt.id} onClick={() => setIntensityId(opt.id)} style={{
              width: '100%', padding: '11px 12px', borderRadius: 12, cursor: 'pointer',
              border: `1px solid ${on ? t.accent : t.border}`,
              background: on ? t.accent + '18' : t.s2,
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            }}>
              <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                {swatches.map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c }}/>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: t.fonts.body, fontWeight: on ? 700 : 600, fontSize: 13, color: t.fg }}>{opt.label}</div>
                <div style={{ fontFamily: t.fonts.body, fontSize: 11, color: t.fgMuted, marginTop: 1 }}>{opt.note}</div>
              </div>
              {on && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round"><polyline points="4,12 10,18 20,6"/></svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Health Connect card ──────────────────────────────────────────────────────

function HealthConnectCard({ t }) {
  const native = Capacitor.isNativePlatform();
  const [avail, setAvail] = useState(native ? 'unknown' : 'web');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!native) return;
    checkAvailability().then(a => setAvail(a)).catch(() => setAvail('error'));
  }, [native]);

  const [diag, setDiag] = useState(null);

  async function connect() {
    setConnecting(true);
    const r = await requestPermissionsVerbose();
    setConnecting(false);
    setConnected(r.granted);
    setAvail(r.availability);
    if (!r.granted) {
      setDiag(`Disponibilidad: ${r.availability}` + (r.error ? ` · Error: ${r.error}` : ` · permisos otorgados: ${r.granted_count ?? 0}`));
    } else {
      setDiag(null);
    }
  }

  let statusLabel, statusColor;
  if (connected)               { statusLabel = 'Conectado ✓';        statusColor = t.semantic?.ok || '#34C759'; }
  else if (avail === 'web')    { statusLabel = 'Solo en Android';    statusColor = t.fgFaint; }
  else if (avail === 'NotInstalled') { statusLabel = 'Falta instalar app'; statusColor = '#F59E0B'; }
  else if (avail === 'NotSupported') { statusLabel = 'No compatible'; statusColor = t.fgFaint; }
  else if (avail === 'Available')    { statusLabel = 'Listo';        statusColor = t.accent; }
  else                          { statusLabel = `build ${APP_BUILD}`; statusColor = t.fgFaint; }

  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 16, margin: '8px 20px', border: `1px solid ${t.divider}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>
          Health Connect <span style={{ fontFamily: t.fonts.mono, fontSize: 9, color: t.fgFaint }}>· {APP_BUILD}</span>
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, color: statusColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {statusLabel}
        </div>
      </div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.5, marginBottom: 12 }}>
        Conecta Google Health Connect para ver frecuencia cardíaca, sueño, pasos, calorías y peso en tu Dashboard y Bitácora.
      </div>

      {!native && (
        <div style={{ padding: '10px 12px', borderRadius: 10, background: t.s2, fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted }}>
          Esta función solo está disponible en la app instalada en tu teléfono Android.
        </div>
      )}

      {native && connected && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['RHR', 'Sueño', 'Pasos', 'Calorías', 'Peso'].map(m => (
            <div key={m} style={{ padding: '4px 10px', borderRadius: 8, background: (t.semantic?.ok || '#34C759') + '20', fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, color: t.semantic?.ok || '#34C759', letterSpacing: '0.08em' }}>
              {m}
            </div>
          ))}
        </div>
      )}

      {native && !connected && (
        <>
          <button onClick={connect} disabled={connecting} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: t.accent, color: '#0A0908', cursor: 'pointer',
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
            opacity: connecting ? 0.6 : 1,
          }}>
            {connecting ? 'Solicitando permisos...' : 'Conectar Health Connect'}
          </button>
          {avail === 'NotInstalled' && (
            <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: t.s2, fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted }}>
              Instala "Health Connect" desde la Play Store, ábrelo una vez, y vuelve aquí.
            </div>
          )}
          {diag && (
            <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: '#F59E0B18', border: '1px solid #F59E0B55', fontFamily: t.fonts.mono, fontSize: 10.5, color: t.fg, lineHeight: 1.5, wordBreak: 'break-word' }}>
              <div style={{ fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>DIAGNÓSTICO</div>
              {diag}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Personal info (clean read/edit, localStorage-first) ───────────────────────

const GOAL_LABELS = { muscle: 'Ganar músculo', fat: 'Perder grasa', perf: 'Rendimiento', health: 'Salud general' };
const TIME_LABELS = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche' };

function PersonalInfoCard({ t, profile, saveProfile }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName]       = useState('');
  const [age, setAge]         = useState('');
  const [weight, setWeight]   = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight]   = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [goal, setGoal]       = useState([]);
  const [days, setDays]       = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);

  function openEdit() {
    setName(profile?.name || '');
    setAge(profile?.age ? String(profile.age) : '');
    setWeight(profile?.weight_kg ? String(profile.weight_kg) : '');
    setWeightUnit('kg');
    setHeight(profile?.height_cm ? String(profile.height_cm) : '');
    setHeightUnit('cm');
    setGoal(profile?.goal ? profile.goal.split(',').filter(Boolean) : []);
    setDays(profile?.days_per_week || null);
    setTimeOfDay(profile?.time_of_day || null);
    setEditing(true);
  }

  function changeWeightUnit(next) {
    if (next === weightUnit) return;
    const n = parseFloat(weight);
    if (!isNaN(n)) setWeight(String(Math.round((next === 'lbs' ? n / 0.453592 : n * 0.453592) * 10) / 10));
    setWeightUnit(next);
  }
  function changeHeightUnit(next) {
    if (next === heightUnit) return;
    const n = parseFloat(height);
    if (!isNaN(n)) setHeight(String(Math.round((next === 'in' ? n / 2.54 : n * 2.54) * 10) / 10));
    setHeightUnit(next);
  }
  function toggleGoal(id) { setGoal(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]); }

  async function handleSave() {
    setSaving(true);
    const weight_kg = weightUnit === 'kg' ? (parseFloat(weight) || null) : (weight ? Math.round(parseFloat(weight) * 0.453592 * 10) / 10 : null);
    const height_cm = heightUnit === 'cm' ? (parseFloat(height) || null) : (height ? Math.round(parseFloat(height) * 2.54 * 10) / 10 : null);
    await saveProfile({
      name: name.trim() || profile?.name,
      age: parseInt(age, 10) || null,
      weight_kg, height_cm,
      goal: goal.join(','),
      days_per_week: days,
      time_of_day: timeOfDay,
    });
    setSaving(false);
    setEditing(false);
  }

  const goalText = (profile?.goal ? profile.goal.split(',').filter(Boolean) : []).map(g => GOAL_LABELS[g] || g).join(', ');
  const rows = [
    { lab: 'Nombre',     val: profile?.name || '—' },
    { lab: 'Edad',       val: profile?.age ? `${profile.age} años` : '—' },
    { lab: 'Peso',       val: profile?.weight_kg ? `${profile.weight_kg} kg` : '—' },
    { lab: 'Altura',     val: profile?.height_cm ? `${profile.height_cm} cm` : '—' },
    { lab: 'Objetivo',   val: goalText || '—' },
    { lab: 'Días/semana',val: profile?.days_per_week ? `${profile.days_per_week}` : '—' },
    { lab: 'Horario',    val: profile?.time_of_day ? (TIME_LABELS[profile.time_of_day] || profile.time_of_day) : '—' },
  ];

  const fieldLabel = { fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 6 };

  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 16, margin: '8px 20px', border: `1px solid ${t.divider}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editing ? 14 : 6 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>Mis datos</div>
        {!editing && (
          <button onClick={openEdit} style={{
            padding: '5px 14px', borderRadius: 10, border: `1px solid ${t.divider}`,
            background: 'transparent', color: t.accent, cursor: 'pointer',
            fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12.5,
          }}>Editar</button>
        )}
      </div>

      {!editing ? (
        <div>
          {rows.map((r, i) => (
            <div key={r.lab} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < rows.length - 1 ? `1px solid ${t.divider}` : 'none' }}>
              <span style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted }}>{r.lab}</span>
              <span style={{ fontFamily: t.fonts.body, fontSize: 13.5, fontWeight: 600, color: r.val === '—' ? t.fgFaint : t.fg, textAlign: 'right', maxWidth: '60%' }}>{r.val}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Nombre</div>
            <Input t={t} value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={fieldLabel}>Edad</div>
              <Input t={t} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="años" />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={fieldLabel}>Peso</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <Pill t={t} active={weightUnit === 'kg'} onClick={() => changeWeightUnit('kg')}>kg</Pill>
                <Pill t={t} active={weightUnit === 'lbs'} onClick={() => changeWeightUnit('lbs')}>lbs</Pill>
              </div>
            </div>
            <Input t={t} type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={weightUnit === 'kg' ? 'ej. 75' : 'ej. 165'} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={fieldLabel}>Altura</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <Pill t={t} active={heightUnit === 'cm'} onClick={() => changeHeightUnit('cm')}>cm</Pill>
                <Pill t={t} active={heightUnit === 'in'} onClick={() => changeHeightUnit('in')}>in</Pill>
              </div>
            </div>
            <Input t={t} type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={heightUnit === 'cm' ? 'ej. 175' : 'ej. 69'} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Objetivo</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GOALS.map(g => (
                <Pill key={g.id} t={t} active={goal.includes(g.id)} onClick={() => toggleGoal(g.id)}>{g.label}</Pill>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Días por semana</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {DAYS.map(d => (<Pill key={d} t={t} active={days === d} onClick={() => setDays(d)}>{d}</Pill>))}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={fieldLabel}>Horario de entrenamiento</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {TIMES.map(tm => (<Pill key={tm.id} t={t} active={timeOfDay === tm.id} onClick={() => setTimeOfDay(tm.id)}>{tm.label}</Pill>))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: t.accent, color: '#0A0908',
              cursor: 'pointer', fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1,
            }}>{saving ? 'Guardando…' : 'Guardar'}</button>
            <button onClick={() => setEditing(false)} style={{
              flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${t.divider}`, background: 'transparent',
              color: t.fgMuted, cursor: 'pointer', fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14,
            }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible section ────────────────────────────────────────────────────────

function Section({ t, title, open, onToggle, children }) {
  return (
    <div style={{ marginTop: 6 }}>
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
      }}>
        <span style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 15, color: t.fg }}>{title}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.fgMuted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ProfileScreen({ t, onNav, onMenu, onPlus }) {
  const { profile, saveProfile, signOut, session } = useAuth();

  const displayName = profile?.name || 'Usuario';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Real stats
  const [stats, setStats] = useState({ workouts: null, streak: 0, prs: null });
  useEffect(() => {
    if (!session?.user) return;
    const uid = session.user.id;
    const now = new Date();
    const dow = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
    const weekStart = mon.toISOString().slice(0, 10);
    const today = now.toISOString().slice(0, 10);
    Promise.all([
      supabase.from('workouts').select('*', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('prs').select('*', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('workouts').select('date').eq('user_id', uid).gte('date', weekStart).lte('date', today),
    ]).then(([w, p, ww]) => {
      setStats({ workouts: w.count ?? 0, prs: p.count ?? 0, streak: (ww.data || []).length });
    }).catch(() => {});
  }, [session?.user?.id]);

  // local count of PRs as fallback / supplement
  const localPrCount = (() => {
    try {
      const m = JSON.parse(localStorage.getItem('soma_skill_prs') || '{}');
      return Object.values(m).filter(v => v && Object.keys(v).some(k => k !== 'unit' && k !== 'metric')).length;
    } catch { return 0; }
  })();

  // Collapsible sections — "Mis datos" open by default
  const [openSections, setOpenSections] = useState({ datos: true });
  const toggle = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));

  const statItems = [
    { lab: 'ENTRENOS', val: stats.workouts == null ? '—' : String(stats.workouts), col: t.pillar.train },
    { lab: 'ESTA SEM', val: `${stats.streak}d`, col: t.secondary },
    { lab: 'PRS',      val: String(Math.max(stats.prs || 0, localPrCount)), col: t.pillar.records },
  ];

  return (
    <ScreenFrame t={t} accentColor={t.fg}>
      <StatusBar t={t} />
      <PillarHeader t={t} title="Yo" onMenu={onMenu} />

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>

        {/* ── Avatar + name ── */}
        <div style={{ margin: '18px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: t.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
            letterSpacing: '-0.04em', color: t.onAccent,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22, letterSpacing: '-0.035em', color: t.fg }}>
              {displayName}
            </div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, marginTop: 3 }}>
              L01 · The Spark
            </div>
          </div>
        </div>

        {/* ── Stats row (real) ── */}
        <div style={{
          margin: '16px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          background: t.surface, borderRadius: 18, border: '1px solid ' + t.divider, overflow: 'hidden',
        }}>
          {statItems.map((s, i, arr) => (
            <div key={i} style={{ padding: '14px 10px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid ' + t.divider : 'none' }}>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24, letterSpacing: '-0.035em', color: t.fg }}>{s.val}</div>
              <div style={{ width: 16, height: 2, background: s.col, borderRadius: 1, margin: '4px auto 4px' }} />
              <MonoLabel t={t}>{s.lab}</MonoLabel>
            </div>
          ))}
        </div>

        {/* ── Collapsible sections ── */}
        <div style={{ marginTop: 14 }}>
          <Section t={t} title="Mis datos" open={!!openSections.datos} onToggle={() => toggle('datos')}>
            <PersonalInfoCard t={t} profile={profile} saveProfile={saveProfile} />
          </Section>

          <Section t={t} title="Skills & PRs" open={!!openSections.skills} onToggle={() => toggle('skills')}>
            <SkillsCard t={t} />
          </Section>

          <Section t={t} title="Equipo" open={!!openSections.equipo} onToggle={() => toggle('equipo')}>
            <EquipmentCard t={t} />
          </Section>

          <Section t={t} title="Áreas de enfoque" open={!!openSections.focus} onToggle={() => toggle('focus')}>
            <FocusAreasCard t={t} />
          </Section>

          <Section t={t} title="Metas" open={!!openSections.metas} onToggle={() => toggle('metas')}>
            <GoalsCard t={t} />
          </Section>

          <Section t={t} title="Estado físico / lesiones" open={!!openSections.fisico} onToggle={() => toggle('fisico')}>
            <PhysicalStateCard t={t} />
          </Section>

          <Section t={t} title="Health Connect" open={!!openSections.health} onToggle={() => toggle('health')}>
            <HealthConnectCard t={t} />
          </Section>

          <Section t={t} title="Apariencia" open={!!openSections.tema} onToggle={() => toggle('tema')}>
            <ThemeCard t={t} />
          </Section>
        </div>

        {/* ── Sign out ── */}
        <button onClick={signOut} style={{
          margin: '20px 20px 0', width: 'calc(100% - 40px)',
          padding: '13px', borderRadius: 14, border: `1px solid ${t.semantic.low}44`,
          background: 'transparent', color: t.semantic.low,
          fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Cerrar sesión
        </button>
      </div>

      <Fab t={t} onClick={onPlus} />
    </ScreenFrame>
  );
}
