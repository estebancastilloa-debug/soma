import { useState, useEffect } from 'react';
import { ScreenFrame, StatusBar, PillarHeader, MonoLabel } from '../chrome.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

// ─── Category definitions ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'barbell',    label: 'Barbell'    },
  { id: 'olympic',    label: 'Olympic'    },
  { id: 'gymnastics', label: 'Gymnastics' },
  { id: 'endurance',  label: 'Endurance'  },
  { id: 'benchmark',  label: 'Benchmark'  },
];

const UNITS = ['kg', 'lbs', 'reps', 'min:sec'];

// ─── Format date for display ──────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── PR Card ──────────────────────────────────────────────────────────
function PRCard({ t, pr, onDelete }) {
  return (
    <div style={{
      background: t.surface,
      borderRadius: 14,
      padding: '14px 16px',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 15,
          color: t.fg,
          letterSpacing: '-0.01em',
          marginBottom: 2,
        }}>
          {pr.movement}
        </div>
        <div style={{
          fontFamily: t.fonts.mono,
          fontSize: 9.5,
          fontWeight: 600,
          color: t.fgMuted,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {formatDate(pr.logged_at)}
        </div>
      </div>

      <div style={{
        fontFamily: t.fonts.mono,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: '-0.02em',
        color: t.fg,
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {pr.value} <span style={{ fontSize: 12, color: t.fgMuted, fontWeight: 600 }}>{pr.unit}</span>
      </div>

      <button
        onClick={() => onDelete(pr)}
        style={{
          background: 'none',
          border: 'none',
          color: t.fgMuted,
          fontFamily: t.fonts.body,
          fontSize: 18,
          lineHeight: 1,
          cursor: 'pointer',
          padding: '4px 6px',
          borderRadius: 6,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────
function EmptyState({ t }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 32px',
      gap: 10,
    }}>
      <div style={{
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 16,
        color: t.fgMuted,
        textAlign: 'center',
      }}>
        Sin PRs en esta categoría
      </div>
      <div style={{
        fontFamily: t.fonts.body,
        fontSize: 13,
        color: t.fgFaint,
        textAlign: 'center',
      }}>
        Toca + para agregar tu primer PR.
      </div>
    </div>
  );
}

// ─── Pill button ─────────────────────────────────────────────────────
function Pill({ t, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '7px 14px',
        borderRadius: 20,
        border: 'none',
        background: active ? t.accent : t.s2,
        color: active ? '#0A0908' : t.fgMuted,
        fontFamily: t.fonts.mono,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.14s ease',
      }}
    >
      {label}
    </button>
  );
}

// ─── Add PR Sheet ─────────────────────────────────────────────────────
function AddPRSheet({ t, onSave, onCancel, saving }) {
  const [movement, setMovement] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState('barbell');

  function handleSave() {
    if (!movement.trim() || !value) return;
    onSave({ movement: movement.trim(), value, unit, category });
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 90,
      background: t.bg,
      padding: '20px 20px calc(20px + env(safe-area-inset-bottom, 0px))',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflowY: 'auto',
    }}>
      {/* Sheet header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
      }}>
        <div style={{
          fontFamily: t.fonts.display,
          fontWeight: 800,
          fontSize: 22,
          color: t.fg,
          letterSpacing: '-0.02em',
        }}>
          Nuevo PR
        </div>
        <button
          onClick={onCancel}
          style={{
            background: t.s2,
            border: 'none',
            color: t.fgMuted,
            fontFamily: t.fonts.body,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: 20,
          }}
        >
          Cancelar
        </button>
      </div>

      {/* Movement input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel t={t}>Movimiento</MonoLabel>
        <input
          type="text"
          placeholder="Back Squat"
          value={movement}
          onChange={e => setMovement(e.target.value)}
          style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: 12,
            padding: '13px 16px',
            fontFamily: t.fonts.body,
            fontSize: 16,
            color: t.fg,
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Value input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel t={t}>Valor</MonoLabel>
        <input
          type="number"
          placeholder="0"
          value={value}
          onChange={e => setValue(e.target.value)}
          inputMode="decimal"
          style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: 12,
            padding: '13px 16px',
            fontFamily: t.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            color: t.fg,
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Unit pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel t={t}>Unidad</MonoLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {UNITS.map(u => (
            <Pill key={u} t={t} label={u} active={unit === u} onClick={() => setUnit(u)} />
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MonoLabel t={t}>Categoría</MonoLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <Pill key={cat.id} t={t} label={cat.label} active={category === cat.id} onClick={() => setCategory(cat.id)} />
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || !movement.trim() || !value}
        style={{
          width: '100%',
          background: t.accent,
          color: '#0A0908',
          border: 'none',
          borderRadius: 14,
          padding: '16px 0',
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: '-0.01em',
          cursor: saving || !movement.trim() || !value ? 'not-allowed' : 'pointer',
          opacity: saving || !movement.trim() || !value ? 0.5 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {saving ? 'Guardando…' : 'Guardar PR'}
      </button>
    </div>
  );
}

// ─── PRTrackerScreen ──────────────────────────────────────────────────
export function PRTrackerScreen({ t, onNav, onMenu, onPlus }) {
  const { session } = useAuth();
  const [category, setCategory] = useState('barbell');
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const pillar = t.pillar.train;

  // Load PRs on mount
  useEffect(() => {
    if (!session?.user?.id) return;
    loadPRs();
  }, [session]);

  async function loadPRs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('prs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('logged_at', { ascending: false });
    if (!error && data) setPrs(data);
    setLoading(false);
  }

  async function handleSave({ movement, value, unit, category: cat }) {
    if (!session?.user?.id) return;
    setSaving(true);
    const { error } = await supabase.from('prs').insert({
      user_id: session.user.id,
      movement,
      category: cat,
      value: parseFloat(value),
      unit,
      logged_at: new Date().toISOString().split('T')[0],
    });
    if (!error) {
      await loadPRs();
      setShowAdd(false);
    }
    setSaving(false);
  }

  async function handleDelete(pr) {
    const { error } = await supabase.from('prs').delete().eq('id', pr.id);
    if (!error) {
      setPrs(prev => prev.filter(p => p.id !== pr.id));
    }
  }

  const filtered = prs.filter(p => p.category === category);

  return (
    <ScreenFrame t={t} accentColor={pillar}>
      <StatusBar t={t} />
      <PillarHeader
        t={t}
        title="Personal Records"
        sub="Tus mejores marcas"
        pillarColor={pillar}
        onMenu={onMenu}
        right={
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: t.accent,
              border: 'none',
              borderRadius: 20,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0A0908',
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            +
          </button>
        }
      />

      {/* ── Category tabs ── */}
      <div style={{
        display: 'flex',
        gap: 7,
        padding: '14px 20px 0',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}>
        {CATEGORIES.map(cat => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                background: active ? pillar : t.s2,
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
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Section header ── */}
      <div style={{
        padding: '14px 20px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${t.divider}`,
        flexShrink: 0,
      }}>
        <MonoLabel t={t}>{CATEGORIES.find(c => c.id === category)?.label} · PRs</MonoLabel>
        <div style={{
          fontFamily: t.fonts.mono,
          fontSize: 9,
          fontWeight: 700,
          color: pillar,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {loading ? '…' : `${filtered.length} registros`}
        </div>
      </div>

      {/* ── Scrollable PR list ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 20px',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
      }}>
        {loading ? (
          <div style={{
            padding: '60px 0',
            textAlign: 'center',
            fontFamily: t.fonts.mono,
            fontSize: 11,
            color: t.fgFaint,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Cargando…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          filtered.map(pr => (
            <PRCard key={pr.id} t={t} pr={pr} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* ── Add PR sheet ── */}
      {showAdd && (
        <AddPRSheet
          t={t}
          onSave={handleSave}
          onCancel={() => setShowAdd(false)}
          saving={saving}
        />
      )}
    </ScreenFrame>
  );
}

export default PRTrackerScreen;
