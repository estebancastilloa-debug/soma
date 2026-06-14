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

const LS_FOCUS  = 'soma_focus_areas';
const LS_INJURY = 'soma_injury_notes';

function loadFocus()  { try { return JSON.parse(localStorage.getItem(LS_FOCUS) || '[]'); } catch { return []; } }
function saveFocus(v) { localStorage.setItem(LS_FOCUS, JSON.stringify(v)); }

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
