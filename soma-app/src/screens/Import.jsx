import { useState } from 'react';
import { StatusBar, PillarHeader, MonoLabel, ScreenFrame } from '../chrome.jsx';

const SAMPLE = `SEMANA 14 · CrossFit RX — Esteban Castillo

LUNES — Fuerza + Metcon corto
Fuerza: Back Squat 5x5 @ 75%
MetCon "Fran" (For Time) 21-15-9: Thrusters 43/30kg · Pull-ups. Time cap: 8 min
Accesorio: 3x12 GHD sit-ups

MARTES — Gimnasia + Aeróbico
Skill: EMOM 10 min 3-5 strict muscle-ups
MetCon AMRAP 18 min: 400m run · 15 wall balls · 12 toes-to-bar

MIÉRCOLES — Halterofilia
Fuerza: Power Clean heavy single · Snatch 4x3 @ 70%
MetCon 3 RFT: 9 hang power cleans · 12 box jumps · 15 double-unders

JUEVES — Descanso activo
Movilidad: 20 min flujo de cadera + zona torácica
Aeróbico Z2: 30 min bici

VIERNES — Test de benchmark
MetCon "Karen" (For Time): 150 wall balls. Time cap: 12 min`;

function parseDays(text) {
  const lines = text.split('\n');
  const days = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const dayMatch = trimmed.match(/^(LUNES|MARTES|MIÉRCOLES|MIERCOLES|JUEVES|VIERNES|SÁBADO|SABADO|DOMINGO)/i);
    if (dayMatch) {
      if (current) days.push(current);
      const parts = trimmed.split('—');
      current = {
        name: parts[0].trim(),
        focus: parts[1]?.trim() || '',
        blocks: [],
        movements: 0,
      };
      continue;
    }

    if (!current) continue;

    const blockPatterns = [
      { re: /^(fuerza|strength|halterofilia)/i,              type: 'strength'  },
      { re: /^(metcon|wod|amrap|emom|for time|3 rft|rft)/i,  type: 'wod'       },
      { re: /^(skill|técnica|tecnica|gimnasia)/i,            type: 'skill'     },
      { re: /^(calentamiento|warm)/i,                        type: 'warmup'    },
      { re: /^(accesorio|accessory|cool)/i,                  type: 'accessory' },
      { re: /^(movilidad|mobility|aeróbico|aerobico)/i,      type: 'cooldown'  },
    ];

    let matched = false;
    for (const { re, type } of blockPatterns) {
      if (re.test(trimmed)) {
        current.blocks.push({ title: trimmed, type, movements: null });
        matched = true;
        break;
      }
    }

    if (!matched && current.blocks.length > 0) {
      const last = current.blocks[current.blocks.length - 1];
      if (!last.movements) last.movements = trimmed;
      else last.movements += ' · ' + trimmed;
      current.movements++;
    }
  }

  if (current) days.push(current);
  return days;
}

const PHASES = ['paste', 'review', 'saved'];

export function ImportScreen({ t, onNav, onMenu, onPlus }) {
  const [phase, setPhase] = useState('paste');
  const [text, setText] = useState('');
  const parsed = (phase === 'review' || phase === 'saved') ? parseDays(text || SAMPLE) : null;

  const phaseIndex = PHASES.indexOf(phase);

  return (
    <ScreenFrame t={t} accentColor={t.pillar.train}>
      <StatusBar t={t} />
      <PillarHeader t={t} title="Importar" sub="Desde NotebookLM"
        pillarColor={t.pillar.train} onMenu={onMenu} />

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>

        {/* Phase indicator */}
        <div style={{ margin: '14px 20px 0', display: 'flex', gap: 4 }}>
          {PHASES.map((p, i) => (
            <div key={p} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= phaseIndex ? t.accent : t.s2,
              opacity: i < phaseIndex ? 0.4 : 1,
            }} />
          ))}
        </div>

        {phase === 'paste' && (
          <>
            <div style={{
              margin: '16px 20px 0', padding: 16, background: t.surface,
              borderRadius: 18, border: '1px solid ' + t.divider,
            }}>
              <MonoLabel t={t} color={t.accent}>paso 1 de 3</MonoLabel>
              <div style={{
                fontFamily: t.fonts.display, fontWeight: 800, fontSize: 20,
                letterSpacing: '-0.03em', color: t.fg, marginTop: 8,
              }}>
                Pega tu semana
              </div>
              <div style={{
                fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
                lineHeight: 1.5, marginTop: 6,
              }}>
                Copia el texto de tu programación desde NotebookLM y pégalo aquí. El parser detecta días, bloques y movimientos automáticamente.
              </div>
            </div>

            <div style={{ margin: '12px 20px 0' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Pega aquí tu semana de entrenamiento..."
                style={{
                  width: '100%', minHeight: 200, padding: '14px',
                  background: t.surface, border: '1px solid ' + t.divider,
                  borderRadius: 14, color: t.fg, fontFamily: t.fonts.body, fontSize: 13,
                  lineHeight: 1.5, resize: 'none', boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ margin: '10px 20px 0', display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setText(SAMPLE); setPhase('review'); }}
                style={{
                  flex: 1, padding: '13px', borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: t.accent, color: t.onAccent,
                  fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
                }}>
                Usar ejemplo
              </button>
              <button
                onClick={() => text && setPhase('review')}
                style={{
                  flex: 1, padding: '13px', borderRadius: 14, cursor: 'pointer',
                  border: '1px solid ' + (text ? t.fg : t.border),
                  background: 'transparent', color: text ? t.fg : t.fgFaint,
                  fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
                }}>
                Analizar
              </button>
            </div>
          </>
        )}

        {phase === 'review' && parsed && (
          <>
            <div style={{
              margin: '14px 20px 0', padding: 14,
              background: t.pillar.train + '22',
              borderRadius: 14, border: '1px solid ' + t.pillar.train + '44',
            }}>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  ['Días',        parsed.length],
                  ['Bloques',     parsed.reduce((a, d) => a + d.blocks.length, 0)],
                  ['Movimientos', parsed.reduce((a, d) => a + d.movements, 0)],
                ].map(([lab, val]) => (
                  <div key={lab} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
                      color: t.pillar.train, letterSpacing: '-0.025em',
                    }}>{val}</div>
                    <MonoLabel t={t} color={t.fgMuted}>{lab}</MonoLabel>
                  </div>
                ))}
              </div>
            </div>

            {parsed.map((day, i) => (
              <div key={i} style={{
                margin: '8px 20px 0', background: t.surface,
                borderRadius: 16, border: '1px solid ' + t.divider, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 14px', borderBottom: '1px solid ' + t.divider,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{
                    fontFamily: t.fonts.display, fontWeight: 800, fontSize: 16,
                    letterSpacing: '-0.02em', color: t.fg,
                  }}>{day.name}</div>
                  <span style={{
                    fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.14em', color: t.pillar.train, textTransform: 'uppercase',
                  }}>{day.focus}</span>
                </div>
                {day.blocks.map((b, j) => (
                  <div key={j} style={{
                    padding: '10px 14px',
                    borderBottom: j < day.blocks.length - 1 ? '1px solid ' + t.divider : 'none',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: b.type === 'strength' ? t.pillar.train
                        : b.type === 'wod' ? t.secondary
                        : t.fgFaint,
                      marginTop: 4, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg }}>{b.title}</div>
                      {b.movements && (
                        <div style={{
                          fontFamily: t.fonts.body, fontSize: 11.5,
                          color: t.fgMuted, marginTop: 2, lineHeight: 1.4,
                        }}>{b.movements}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ margin: '14px 20px 0', display: 'flex', gap: 8 }}>
              <button
                onClick={() => setPhase('paste')}
                style={{
                  flex: 1, padding: 13, borderRadius: 14, cursor: 'pointer',
                  border: '1px solid ' + t.border, background: 'transparent', color: t.fg,
                  fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13,
                }}>
                ← Volver
              </button>
              <button
                onClick={() => setPhase('saved')}
                style={{
                  flex: 2, padding: 13, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: t.accent, color: t.onAccent,
                  fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
                }}>
                Guardar semana →
              </button>
            </div>
          </>
        )}

        {phase === 'saved' && (
          <div style={{ margin: '60px 20px 0', textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: t.semantic.ok + '22',
              border: '2px solid ' + t.semantic.ok,
              margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke={t.semantic.ok} strokeWidth="2" strokeLinecap="round">
                <polyline points="4,12 10,18 20,6" />
              </svg>
            </div>
            <div style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
              letterSpacing: '-0.03em', color: t.fg,
            }}>Semana guardada</div>
            <div style={{
              fontFamily: t.fonts.body, fontSize: 14, color: t.fgMuted,
              lineHeight: 1.5, marginTop: 8, maxWidth: 260, margin: '8px auto 0',
            }}>
              Tu programación está lista en Entrena. Puedes empezar a registrar resultados.
            </div>
            <button
              onClick={() => onNav('train')}
              style={{
                marginTop: 28, padding: '14px 32px', borderRadius: 14, border: 'none',
                cursor: 'pointer', background: t.accent, color: t.onAccent,
                fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
              }}>
              Ir a Entrena →
            </button>
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}
