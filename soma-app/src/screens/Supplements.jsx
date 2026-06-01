import { useState } from 'react';
import { useLocalStorage, todayKey } from '../hooks/useLocalStorage.js';
import { StatusBar, PillarHeader, MonoLabel, SectionHead, ScreenFrame, Fab } from '../chrome.jsx';
import { IconPlus } from '../icons.jsx';
import { F5 } from '../marks.jsx';

const SUPPS = [
  {
    id: 'creatine', name: 'Creatina monohidrato', dose: '5g',      time: 'Mañana',
    cat: 'Rendimiento', taken: true,
    why: 'Aumenta fuerza, potencia y función cognitiva.',
    note: 'Toma con agua o en tu shake.',
  },
  {
    id: 'omega3',   name: 'Omega-3',              dose: '2g',      time: 'Con comida',
    cat: 'Recuperación', taken: true,
    why: 'Reduce inflamación sistémica y mejora la salud cardiovascular.',
    note: 'Con la comida más grande del día.',
  },
  {
    id: 'vitd',     name: 'Vitamina D3 + K2',     dose: '5000 IU', time: 'Mañana',
    cat: 'Salud', taken: false,
    why: 'La mayoría está deficiente. Impacta huesos, inmunidad y testosterona.',
    note: 'Toma en la mañana, no en la noche.',
  },
  {
    id: 'magnesium',name: 'Magnesio Glicinato',   dose: '400mg',   time: 'Noche',
    cat: 'Sueño', taken: false,
    why: 'Mejora calidad de sueño, reduce cortisol, apoya la recuperación muscular.',
    note: '30-60 min antes de dormir.',
  },
];

export function SupplementsScreen({ t, onNav, onMenu, onPlus }) {
  const [taken, setTaken] = useLocalStorage(`soma-supplements-${todayKey()}`, ['creatine', 'omega3']);
  const [expanded, setExpanded] = useState(null);

  const progress = taken.length / SUPPS.length;

  return (
    <ScreenFrame t={t} accentColor={t.secondary}>
      <StatusBar t={t} />
      <PillarHeader t={t} title="Suplementos" sub="Protocolo activo · 4 items"
        pillarColor={t.secondary} onMenu={onMenu} />

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>

        {/* Daily progress hero */}
        <div style={{
          margin: '14px 20px 0', padding: '16px 18px', background: t.secondary,
          color: '#0A0908', borderRadius: 18, position: 'relative', overflow: 'hidden',
        }}>
          <MonoLabel t={t} color="#0A090888">hoy</MonoLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 48,
              letterSpacing: '-0.04em', lineHeight: 0.9,
            }}>{taken.length}</span>
            <span style={{ fontFamily: t.fonts.body, fontSize: 16, opacity: 0.6 }}>/{SUPPS.length} tomados</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#0A090820', marginTop: 12 }}>
            <div style={{
              width: (progress * 100) + '%', height: '100%',
              background: '#0A0908', borderRadius: 3, opacity: 0.6,
              transition: 'width 0.3s',
            }} />
          </div>
          <svg width="100" height="100" viewBox="0 0 80 80"
            style={{ position: 'absolute', right: -10, top: -10, opacity: 0.12 }}>
            <F5 color="#0A0908" stroke={4} />
          </svg>
        </div>

        {/* Supplement list */}
        {SUPPS.map(s => {
          const isTaken = taken.includes(s.id);
          const isExpanded = expanded === s.id;
          return (
            <div key={s.id} style={{
              margin: '8px 20px 0', background: t.surface,
              borderRadius: 16, border: '1px solid ' + t.divider, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Take/untake button */}
                <button
                  onClick={() => setTaken(prev => isTaken ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                  style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0, border: 'none',
                    cursor: 'pointer',
                    background: isTaken ? t.semantic.ok : t.s2,
                    color: isTaken ? '#0A0908' : t.fgMuted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  {isTaken
                    ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <polyline points="4,12 10,18 20,6" />
                      </svg>
                    )
                    : <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid currentColor' }} />
                  }
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14, color: t.fg,
                    textDecoration: isTaken ? 'line-through' : 'none',
                    opacity: isTaken ? 0.5 : 1,
                  }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                    <span style={{
                      fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
                      letterSpacing: '0.12em', color: t.accent, textTransform: 'uppercase',
                    }}>{s.dose}</span>
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgFaint }}>·</span>
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgMuted }}>{s.time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{
                    fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                    letterSpacing: '0.12em', color: t.tertiary, textTransform: 'uppercase',
                  }}>{s.cat}</span>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : s.id)}
                    style={{
                      border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
                      fontFamily: t.fonts.mono, fontSize: 9, color: t.fgFaint, textDecoration: 'underline',
                    }}>
                    {isExpanded ? 'menos' : 'info'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div style={{
                  padding: '0 16px 14px', borderTop: '1px solid ' + t.divider,
                  background: t.s2,
                }}>
                  <div style={{
                    fontFamily: t.fonts.body, fontSize: 12.5, color: t.fg,
                    lineHeight: 1.5, marginTop: 10,
                  }}>
                    <strong>¿Por qué?</strong> {s.why}
                  </div>
                  <div style={{
                    fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted,
                    marginTop: 6, fontStyle: 'italic',
                  }}>
                    💡 {s.note}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add supplement */}
        <button style={{
          margin: '10px 20px 0', width: 'calc(100% - 40px)',
          padding: '13px', borderRadius: 14, cursor: 'pointer',
          border: '1px dashed ' + t.divider, background: 'transparent', color: t.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <IconPlus size={16} stroke={2} />
          <span style={{
            fontFamily: t.fonts.mono, fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>Agregar suplemento</span>
        </button>

        {/* Timing schedule */}
        <SectionHead t={t}>horario de hoy</SectionHead>
        {[
          { time: 'Mañana',   items: ['Creatina 5g', 'Vitamina D3 5000 IU'] },
          { time: 'Mediodía', items: ['Omega-3 2g'] },
          { time: 'Noche',    items: ['Magnesio 400mg'] },
        ].map((slot, i) => (
          <div key={i} style={{
            margin: '8px 20px 0', padding: '12px 14px', background: t.surface,
            borderRadius: 12, border: '1px solid ' + t.divider,
          }}>
            <div style={{
              fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.16em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 6,
            }}>{slot.time}</div>
            {slot.items.map((item, j) => (
              <div key={j} style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fg, padding: '3px 0' }}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Fab t={t} onClick={onPlus} />
    </ScreenFrame>
  );
}
