import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  StatusBar, MonoLabel, ScreenFrame, Fab, PillarHeader,
} from '../chrome.jsx';
import { F5, WordmarkWithMark } from '../marks.jsx';

// ─── helpers ──────────────────────────────────────────────────────────────────

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

const LS_FOCUS     = 'soma_focus_areas';
const LS_INJURY    = 'soma_injury_notes';
const LS_EQUIPMENT = 'soma_equipment';
const LS_MOVEMENTS = 'soma_movements';
const LS_GOALS     = 'soma_goals';

function loadFocus()  { try { return JSON.parse(localStorage.getItem(LS_FOCUS) || '[]'); } catch { return []; } }
function saveFocus(v) { localStorage.setItem(LS_FOCUS, JSON.stringify(v)); }

function loadEquipment()  { try { return JSON.parse(localStorage.getItem(LS_EQUIPMENT) || '[]'); } catch { return []; } }
function saveEquipment(v) { localStorage.setItem(LS_EQUIPMENT, JSON.stringify(v)); }

function loadMovements()  { try { return JSON.parse(localStorage.getItem(LS_MOVEMENTS) || '[]'); } catch { return []; } }
function saveMovements(v) { localStorage.setItem(LS_MOVEMENTS, JSON.stringify(v)); }

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
                <Pill t={t} active={weightUnit === 'kg'} onClick={() => setWeightUnit('kg')}>kg</Pill>
                <Pill t={t} active={weightUnit === 'lbs'} onClick={() => setWeightUnit('lbs')}>lbs</Pill>
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
                <Pill t={t} active={heightUnit === 'cm'} onClick={() => setHeightUnit('cm')}>cm</Pill>
                <Pill t={t} active={heightUnit === 'in'} onClick={() => setHeightUnit('in')}>in</Pill>
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

function FocusAreasCard({ t }) {
  const [areas, setAreas]     = useState(() => loadFocus());
  const [adding, setAdding]   = useState(false);
  const [newText, setNewText] = useState('');

  function persist(next) {
    setAreas(next);
    saveFocus(next);
  }

  function addArea() {
    const txt = newText.trim();
    if (!txt) return;
    const next = [...areas, {
      id:      Date.now().toString(),
      text:    txt,
      status:  'active',
      created: new Date().toISOString(),
    }];
    persist(next);
    setNewText('');
    setAdding(false);
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

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: 16,
      margin: '8px 20px', border: `1px solid ${t.divider}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg }}>
          Áreas de enfoque
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} style={{
            width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.divider}`,
            background: 'transparent', color: t.fgMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, lineHeight: 1,
          }}>
            +
          </button>
        )}
      </div>

      {areas.length === 0 && !adding && (
        <div style={{
          fontFamily: t.fonts.body, fontSize: 13, color: t.fgFaint,
          padding: '8px 0', textAlign: 'center',
        }}>
          No hay áreas de enfoque. Agrega qué quieres priorizar.
        </div>
      )}

      {areas.map(area => {
        const improved = area.status === 'improved';
        return (
          <div key={area.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 0',
            borderBottom: `1px solid ${t.divider}`,
          }}>
            <div style={{
              flex: 1,
              fontFamily: t.fonts.body, fontSize: 13,
              color: improved ? t.fgMuted : t.fg,
              textDecoration: improved ? 'line-through' : 'none',
              opacity: improved ? 0.6 : 1,
            }}>
              {area.text}
            </div>
            <button onClick={() => toggleStatus(area.id)} style={{
              padding: '4px 9px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: improved ? t.fgFaint : t.accent,
              color: improved ? t.fgMuted : '#0A0908',
              flexShrink: 0,
            }}>
              {improved ? 'Mejorado' : 'Activo'}
            </button>
            <button onClick={() => removeArea(area.id)} style={{
              width: 24, height: 24, borderRadius: 6, border: 'none',
              background: 'transparent', color: t.fgFaint, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>
              ×
            </button>
          </div>
        );
      })}

      {adding && (
        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            t={t}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="ej. Fortalecer espalda baja"
            style={{ flex: 1 }}
          />
          <button onClick={addArea} style={{
            padding: '11px 14px', borderRadius: 12, border: 'none',
            background: t.accent, color: '#0A0908', cursor: 'pointer',
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            Agregar
          </button>
          <button onClick={() => { setAdding(false); setNewText(''); }} style={{
            padding: '11px 10px', borderRadius: 12,
            border: `1px solid ${t.divider}`, background: 'transparent',
            color: t.fgMuted, cursor: 'pointer',
            fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, flexShrink: 0,
          }}>
            ✕
          </button>
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

function EquipmentCard({ t }) {
  const [checked, setChecked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(LS_EQUIPMENT) || '[]')); }
    catch { return new Set(); }
  });

  function toggle(name) {
    const next = new Set(checked);
    next.has(name) ? next.delete(name) : next.add(name);
    setChecked(next);
    localStorage.setItem(LS_EQUIPMENT, JSON.stringify([...next]));
  }

  const total = EQUIPMENT_GROUPS.reduce((s, g) => s + g.items.length, 0);

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
              return (
                <button key={item} onClick={() => toggle(item)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 10, border: 'none',
                  background: on ? t.accent + '18' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
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
              );
            })}
          </div>
        </div>
      ))}
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

function SkillsCard({ t }) {
  const [skills, setSkills] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_MOVEMENTS) || '{}'); }
    catch { return {}; }
  });
  const [activeGroup, setActiveGroup] = useState(SKILL_GROUPS[0].group);

  function cycleLevel(skill) {
    const cur = skills[skill] || 0;
    const next = { ...skills, [skill]: (cur + 1) % 4 };
    setSkills(next);
    localStorage.setItem(LS_MOVEMENTS, JSON.stringify(next));
  }

  const group = SKILL_GROUPS.find(g => g.group === activeGroup);

  return (
    <div style={{ background: t.surface, borderRadius: 16, padding: 16, margin: '8px 20px', border: `1px solid ${t.divider}` }}>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14, color: t.fg, marginBottom: 12 }}>
        Skills & Movimientos
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {SKILL_GROUPS.map(g => (
          <button key={g.group} onClick={() => setActiveGroup(g.group)} style={{
            padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
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
        {group?.skills.map(skill => {
          const level = skills[skill] || 0;
          const lv = SKILL_LEVELS[level];
          return (
            <button key={skill} onClick={() => cycleLevel(skill)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 10, border: 'none',
              background: level > 0 ? (group.col + '12') : 'transparent',
              cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              {/* 3-dot level */}
              <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                {[1,2,3].map(dot => (
                  <div key={dot} style={{ width: 7, height: 7, borderRadius: '50%', background: dot <= level ? (lv.color || group.col) : t.s2 }}/>
                ))}
              </div>
              <span style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 13, color: level > 0 ? t.fg : t.fgMuted, fontWeight: level > 0 ? 600 : 400 }}>
                {skill}
              </span>
              {level > 0 && (
                <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700, color: lv.color || group.col, letterSpacing: '0.06em', flexShrink: 0 }}>
                  {lv.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontFamily: t.fonts.body, fontSize: 11, color: t.fgFaint }}>
        Toca un skill para cambiar el nivel
      </div>
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

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ProfileScreen({ t, onNav, onMenu, onPlus }) {
  const { profile, saveProfile, signOut } = useAuth();

  const displayName = profile?.name || 'Usuario';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <ScreenFrame t={t} accentColor={t.fg}>
      <StatusBar t={t} />
      <PillarHeader t={t} title="Perfil" onMenu={onMenu} />

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>

        {/* ── Avatar + name ── */}
        <div style={{ margin: '18px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: t.s2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
            letterSpacing: '-0.04em', color: t.fgMuted,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
              letterSpacing: '-0.035em', color: t.fg,
            }}>
              {displayName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted }}>
                L01 · The Spark
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          margin: '18px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          background: t.surface, borderRadius: 18,
          border: '1px solid ' + t.divider, overflow: 'hidden',
        }}>
          {[
            { lab: 'ENTRENOS', val: '0',  col: t.pillar.train   },
            { lab: 'STREAK',   val: '0d', col: t.secondary      },
            { lab: 'PRS',      val: '0',  col: t.pillar.records },
          ].map((s, i, arr) => (
            <div key={i} style={{
              padding: '14px 10px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid ' + t.divider : 'none',
            }}>
              <div style={{
                fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
                letterSpacing: '-0.035em', color: t.fg,
              }}>{s.val}</div>
              <div style={{
                width: 16, height: 2, background: s.col,
                borderRadius: 1, margin: '4px auto 4px',
              }} />
              <MonoLabel t={t}>{s.lab}</MonoLabel>
            </div>
          ))}
        </div>

        {/* ── Edit Profile ── */}
        <div style={{ marginTop: 16 }}>
          <MonoLabel t={t} style={{ padding: '0 20px 8px' }}>
            <div style={{ padding: '0 20px 8px' }}>tu perfil</div>
          </MonoLabel>
          <EditProfileCard t={t} profile={profile} saveProfile={saveProfile} />
        </div>

        {/* ── Estado físico ── */}
        <div style={{ marginTop: 4 }}>
          <PhysicalStateCard t={t} />
        </div>

        {/* ── Áreas de enfoque ── */}
        <div style={{ marginTop: 4 }}>
          <FocusAreasCard t={t} />
        </div>

        {/* ── Equipo ── */}
        <div style={{ marginTop: 4 }}>
          <EquipmentCard t={t} />
        </div>

        {/* ── Movimientos ── */}
        <div style={{ marginTop: 4 }}>
          <SkillsCard t={t} />
        </div>

        {/* ── Metas ── */}
        <div style={{ marginTop: 4 }}>
          <GoalsCard t={t} />
        </div>

        {/* ── Sign out ── */}
        <button onClick={signOut} style={{
          margin: '16px 20px 0', width: 'calc(100% - 40px)',
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
