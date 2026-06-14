import { useState } from 'react';
import {
  ScreenFrame, StatusBar, PillarHeader,
  MonoLabel, SectionHead, Fab,
} from '../chrome.jsx';
import { F5 } from '../marks.jsx';
import {
  IconSearch, IconCamera, IconMic,
  IconWater,
  IconProtein, IconCarbs, IconFat,
} from '../icons.jsx';

// ─── SVG donut chart ─────────────────────────────────────────────────
function DonutChart({ t, protein = 0.43, carbs = 0.34, fat = 0.23 }) {
  const cx = 65, cy = 65, R = 56, stroke = 11;
  const circ = 2 * Math.PI * R;
  const pLen = protein * circ;
  const cLen = carbs * circ;
  const fLen = fat * circ;
  const gap = 2.5;

  const p1Offset = 0;
  const c1Offset = pLen + gap;
  const f1Offset = pLen + cLen + gap * 2;

  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke="#0A090820" strokeWidth={stroke}/>
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke={t.secondary} strokeWidth={stroke}
        strokeDasharray={`${pLen - gap} ${circ - pLen + gap}`}
        strokeDashoffset={-(p1Offset) + circ / 4}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke={t.tertiary} strokeWidth={stroke}
        strokeDasharray={`${cLen - gap} ${circ - cLen + gap}`}
        strokeDashoffset={-(c1Offset) + circ / 4}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke={t.fg} strokeWidth={stroke}
        strokeDasharray={`${fLen - gap} ${circ - fLen + gap}`}
        strokeDashoffset={-(f1Offset) + circ / 4}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
    </svg>
  );
}

// ─── Macro chip ───────────────────────────────────────────────────────
function MacroChip({ t, Icon, label, current, goal, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
      background: '#0A090810', borderRadius: 10, padding: '7px 10px' }}>
      <Icon size={14} stroke={2} color={color}/>
      <div>
        <div style={{ fontFamily: t.fonts.body, fontSize: 9.5, color: '#0A0908AA',
          fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 11.5,
          color: '#0A0908', letterSpacing: '-0.02em' }}>
          {current}<span style={{ opacity: 0.5, fontSize: 10 }}>/{goal}g</span>
        </div>
      </div>
    </div>
  );
}

// ─── Water bar ────────────────────────────────────────────────────────
function WaterBar({ t, total = 8, filled = 5 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
      <IconWater size={13} stroke={2} color="#0A0908AA"/>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i < filled ? t.tertiary : '#0A090828',
          }}/>
        ))}
      </div>
      <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
        color: '#0A0908AA' }}>{filled}/{total}L</span>
    </div>
  );
}

// ─── Pantry item ──────────────────────────────────────────────────────
function PantryItem({ t, name, stock, onDelete }) {
  const stockColor = stock <= 1
    ? t.semantic.low
    : stock === 2
      ? '#F59E0B'
      : stock === 3
        ? t.semantic.ok
        : t.accent;

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.divider}`,
      borderRadius: 12, padding: '12px 12px 10px', position: 'relative' }}>
      {onDelete && (
        <button
          onClick={onDelete}
          style={{
            position: 'absolute', top: 6, right: 6,
            background: 'transparent', border: 'none',
            color: t.fgFaint, cursor: 'pointer',
            fontFamily: t.fonts.mono, fontSize: 12, lineHeight: 1,
            padding: '2px 4px',
          }}
        >
          ×
        </button>
      )}
      <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12.5,
        color: t.fg, marginBottom: 8, lineHeight: 1.2, paddingRight: onDelete ? 16 : 0 }}>{name}</div>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{
            flex: 1, height: 5, borderRadius: 3,
            background: n <= stock ? stockColor : t.s2,
          }}/>
        ))}
      </div>
      <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
        color: stock <= 1 ? t.semantic.low : t.fgFaint,
        marginTop: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {stock <= 1 ? 'agotado' : stock === 2 ? 'bajo' : 'ok'}
      </div>
    </div>
  );
}

// ─── Pantry Modal ─────────────────────────────────────────────────────
const PANTRY_KEY = 'soma_pantry';

function loadPantry() {
  try {
    return JSON.parse(localStorage.getItem(PANTRY_KEY)) || [];
  } catch {
    return [];
  }
}

function savePantry(items) {
  localStorage.setItem(PANTRY_KEY, JSON.stringify(items));
}

function PantryModal({ t, onClose }) {
  const [items, setItems]       = useState(() => loadPantry());
  const [newName, setNewName]   = useState('');
  const [newStock, setNewStock] = useState(3);

  function handleAdd() {
    if (!newName.trim()) return;
    const next = [...items, { id: Date.now(), name: newName.trim(), stock: newStock }];
    setItems(next);
    savePantry(next);
    setNewName('');
    setNewStock(3);
  }

  function handleDelete(id) {
    const next = items.filter(it => it.id !== id);
    setItems(next);
    savePantry(next);
  }

  const stockColors = [t.semantic.low, '#F59E0B', t.semantic.ok, t.accent];
  const stockLabels = ['Agotado', 'Bajo', 'Ok', 'Lleno'];

  const totalItems   = items.length;
  const lowItems     = items.filter(it => it.stock === 2).length;
  const emptyItems   = items.filter(it => it.stock <= 1).length;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: t.bg, display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px 12px',
        borderBottom: `1px solid ${t.divider}`,
      }}>
        <div style={{
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
          letterSpacing: '-0.04em', color: t.fg,
        }}>
          Despensa
        </div>
        <button
          onClick={onClose}
          style={{
            background: t.surface, border: `1px solid ${t.divider}`,
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: t.fgMuted,
            fontFamily: t.fonts.mono, fontSize: 16, fontWeight: 700,
          }}
        >
          ×
        </button>
      </div>

      {/* Stats row */}
      <div style={{ margin: '12px 20px 0', display: 'flex', gap: 8 }}>
        {[
          { lab: 'TOTAL',    val: String(totalItems), color: t.fgMuted },
          { lab: 'BAJOS',    val: String(lowItems),   color: '#F59E0B' },
          { lab: 'AGOTADOS', val: String(emptyItems), color: t.semantic.low },
        ].map(s => (
          <div key={s.lab} style={{ flex: 1, background: t.surface,
            border: `1px solid ${t.divider}`, borderRadius: 10,
            padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 18,
              color: s.color, letterSpacing: '-0.03em' }}>{s.val}</div>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 700,
              color: t.fgFaint, letterSpacing: '0.14em', textTransform: 'uppercase',
              marginTop: 2 }}>{s.lab}</div>
          </div>
        ))}
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 0' }}>
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '32px 0',
            fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
          }}>
            Tu despensa está vacía. Agrega artículos abajo.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {items.map(item => (
              <PantryItem
                key={item.id}
                t={t}
                name={item.name}
                stock={item.stock}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}

        {/* Add new item */}
        <div style={{
          marginTop: 16, background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 14,
          padding: '14px 14px',
        }}>
          <div style={{
            fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: t.fgFaint, marginBottom: 10,
          }}>
            Agregar artículo
          </div>

          <input
            placeholder="Nombre del artículo"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{
              width: '100%', background: t.bg, border: `1px solid ${t.divider}`,
              borderRadius: 10, padding: '10px 12px', color: t.fg,
              fontFamily: t.fonts.body, fontSize: 14, outline: 'none',
              boxSizing: 'border-box', marginBottom: 10,
            }}
          />

          {/* Stock buttons */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {[1,2,3,4].map((n, i) => (
              <button
                key={n}
                onClick={() => setNewStock(n)}
                style={{
                  flex: 1,
                  background: newStock === n ? stockColors[i] : t.bg,
                  border: `1px solid ${newStock === n ? stockColors[i] : t.divider}`,
                  borderRadius: 8, padding: '7px 4px',
                  fontFamily: t.fonts.body, fontWeight: 600, fontSize: 10.5,
                  color: newStock === n ? '#0A0908' : t.fgMuted,
                  cursor: 'pointer',
                }}
              >
                {stockLabels[i]}
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            style={{
              width: '100%',
              background: newName.trim() ? t.pillar.eat : t.fgFaint,
              color: '#0A0908', border: 'none', borderRadius: 10,
              padding: '11px 0', fontFamily: t.fonts.body,
              fontWeight: 700, fontSize: 14, cursor: newName.trim() ? 'pointer' : 'default',
              letterSpacing: '-0.01em',
            }}
          >
            Agregar
          </button>
        </div>

        <div style={{ height: 32 }}/>
      </div>
    </div>
  );
}

// ─── Meals coming soon overlay ────────────────────────────────────────
function MealsModal({ t, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: t.bg, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px 12px',
        borderBottom: `1px solid ${t.divider}`,
      }}>
        <div style={{
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
          letterSpacing: '-0.04em', color: t.fg,
        }}>
          Comidas de hoy
        </div>
        <button
          onClick={onClose}
          style={{
            background: t.surface, border: `1px solid ${t.divider}`,
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: t.fgMuted,
            fontFamily: t.fonts.mono, fontSize: 16, fontWeight: 700,
          }}
        >
          ×
        </button>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 32px',
      }}>
        <div style={{
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 18,
          letterSpacing: '-0.03em', color: t.fg, textAlign: 'center',
        }}>
          Próximamente
        </div>
        <div style={{
          fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
          textAlign: 'center', lineHeight: 1.5,
        }}>
          Próximamente: registro de comidas detallado
        </div>
      </div>
    </div>
  );
}

// ─── EatScreen ───────────────────────────────────────────────────────
export function EatScreen({ t, onNav, onMenu, onPlus }) {
  const [showPantry, setShowPantry] = useState(false);
  const [showMeals, setShowMeals]   = useState(false);

  return (
    <ScreenFrame t={t} accentColor={t.pillar.eat}>
      <StatusBar t={t}/>
      <PillarHeader
        t={t}
        title="Come"
        sub="358 kcal restantes"
        pillarColor={t.pillar.eat}
        onMenu={onMenu}
      />

      {/* ── Scrollable body ── */}
      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* ── Calorie hero card ── */}
        <div style={{ margin: '14px 20px 0', background: t.pillar.eat,
          color: '#0A0908', borderRadius: 20, padding: '16px 18px',
          position: 'relative', overflow: 'hidden' }}>

          {/* F5 watermark */}
          <div style={{ position: 'absolute', right: -10, bottom: -10, width: 110, height: 110,
            opacity: 0.1, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color="#0A0908" stroke={7}/>
            </svg>
          </div>

          {/* Donut + info side by side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DonutChart t={t} protein={0.43} carbs={0.34} fat={0.23}/>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 44,
                letterSpacing: '-0.05em', lineHeight: 1, color: '#0A0908' }}>
                358
              </div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 11.5, fontWeight: 600,
                color: '#0A0908AA', marginTop: 2 }}>kcal restantes</div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
                color: '#0A0908AA', marginTop: 6, letterSpacing: '-0.01em' }}>
                1842 de 2200 · 84%
              </div>
            </div>
          </div>

          {/* Macro chips */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            <MacroChip t={t} Icon={IconProtein} label="Proteína"
              current={142} goal={165} color={t.secondary}/>
            <MacroChip t={t} Icon={IconCarbs}   label="Carbs"
              current={220} goal={250} color={t.tertiary}/>
            <MacroChip t={t} Icon={IconFat}     label="Grasa"
              current={78}  goal={85}  color="#0A0908BB"/>
          </div>

          {/* Water bar */}
          <WaterBar t={t} total={8} filled={5}/>
        </div>

        {/* ── Quick add bar ── */}
        <div style={{ margin: '14px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
          <IconSearch size={16} stroke={1.9} color={t.fgFaint}/>
          <div style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 13.5,
            color: t.fgFaint }}>¿Qué comiste?</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onPlus} style={{ background: 'transparent', border: 'none',
              cursor: 'pointer', color: t.fgMuted, padding: 0,
              display: 'flex', alignItems: 'center' }}>
              <IconCamera size={18} stroke={1.9} color={t.fgMuted}/>
            </button>
            <button onClick={onPlus} style={{ background: 'transparent', border: 'none',
              cursor: 'pointer', color: t.fgMuted, padding: 0,
              display: 'flex', alignItems: 'center' }}>
              <IconMic size={18} stroke={1.9} color={t.fgMuted}/>
            </button>
          </div>
        </div>

        {/* ── Meals today ── */}
        <SectionHead t={t} actionLabel="ver todas" onAction={() => setShowMeals(true)}>
          comidas de hoy
        </SectionHead>
        <div style={{
          margin: '8px 20px 0', padding: '16px',
          background: t.surface, border: `1px solid ${t.divider}`,
          borderRadius: 14, textAlign: 'center',
        }}>
          <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted }}>
            Registra tus comidas tocando +
          </div>
        </div>

        {/* ── Pantry ── */}
        <SectionHead t={t} actionLabel="ver todo" onAction={() => setShowPantry(true)}>
          despensa
        </SectionHead>

        {/* Stats row */}
        <div style={{ margin: '10px 20px 0', display: 'flex', gap: 8 }}>
          {[
            { lab: 'TOTAL', val: '10', color: t.fgMuted },
            { lab: 'BAJOS', val: '2',  color: t.semantic.mid },
            { lab: 'AGOTADOS', val: '1', color: t.semantic.low },
          ].map(s => (
            <div key={s.lab} style={{ flex: 1, background: t.surface,
              border: `1px solid ${t.divider}`, borderRadius: 10,
              padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 18,
                color: s.color, letterSpacing: '-0.03em' }}>{s.val}</div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 700,
                color: t.fgFaint, letterSpacing: '0.14em', textTransform: 'uppercase',
                marginTop: 2 }}>{s.lab}</div>
            </div>
          ))}
        </div>

        {/* 2-col pantry grid preview */}
        <div style={{ margin: '10px 20px 0', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(JSON.parse(localStorage.getItem('soma_pantry') || '[]')).slice(0, 4).map((p) => (
            <PantryItem key={p.id} t={t} name={p.name} stock={p.stock}/>
          ))}
          {(JSON.parse(localStorage.getItem('soma_pantry') || '[]')).length === 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: '20px 0',
              fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgFaint,
            }}>
              Toca "ver todo" para gestionar tu despensa
            </div>
          )}
        </div>

        {/* Shopping list CTA */}
        <button onClick={onPlus} style={{
          margin: '12px 20px 0', width: 'calc(100% - 40px)',
          background: t.surface, border: `1px solid ${t.divider}`,
          borderRadius: 14, padding: '13px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: t.pillar.eat + '25',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>🛒</span>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13.5,
              color: t.fg }}>Lista de compras</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 11, color: t.fgMuted, marginTop: 1 }}>
              3 artículos pendientes
            </div>
          </div>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 18, fontWeight: 700,
            color: t.pillar.eat }}>→</span>
        </button>

        {/* ── F5 watermark ── */}
        <div style={{ position: 'relative', height: 70, marginTop: 8 }}>
          <div style={{ position: 'absolute', right: 14, bottom: 0, width: 80, height: 80,
            opacity: 0.04, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.fg} stroke={7}/>
            </svg>
          </div>
        </div>

      </div>

      <Fab t={t} onClick={onPlus}/>

      {showPantry && <PantryModal t={t} onClose={() => setShowPantry(false)}/>}
      {showMeals  && <MealsModal  t={t} onClose={() => setShowMeals(false)}/>}
    </ScreenFrame>
  );
}

export default EatScreen;
