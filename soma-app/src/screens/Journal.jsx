import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatusBar, PillarHeader, MonoLabel, SectionHead, ScreenFrame, Fab } from '../chrome.jsx';
import { IconHeart, IconCheck, IconMic, IconCamera, IconPlus, IconRecovery, IconSleep, IconWater, MOOD_ICONS, MOOD_LABELS } from '../icons.jsx';
import { HABITS, PROMPTS } from '../data/habits.js';

export function JournalScreen({ t, onNav, onMenu, onPlus }) {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState('dia');
  const [mood, setMood] = useState(3);
  const [habits, setHabits] = useState(['mobility', 'cold', 'meditate']);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('daily_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (data.mood !== undefined) setMood(data.mood);
          if (data.habit_ids?.length) setHabits(data.habit_ids);
        }
      });
  }, [user]);

  async function saveLog(newMood, newHabits) {
    if (!user) return;
    await supabase.from('daily_log').upsert({
      user_id: user.id,
      date: today,
      mood: newMood,
      habit_ids: newHabits,
    }, { onConflict: 'user_id,date' });
  }
  const todayPrompt = PROMPTS[0];

  const activeHabits = HABITS.filter(h => habits.includes(h.id)).slice(0, 8);
  const allDisplayHabits = HABITS.slice(0, 8);

  return (
    <ScreenFrame t={t} accentColor={t.fg}>
      <StatusBar t={t} />
      <PillarHeader t={t} title="Bitácora" sub="Jueves 15 · mayo" onMenu={onMenu} />

      {/* Tab bar */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8 }}>
        {[{ id: 'dia', lab: 'Día' }, { id: 'psicologia', lab: 'Psicología' }, { id: 'locus', lab: 'Locus' }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{
              padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: tab === tb.id ? t.accent : t.surface,
              color: tab === tb.id ? t.onAccent : t.fgMuted,
              fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13,
            }}>
            {tb.lab}
          </button>
        ))}
      </div>

      <div style={{ height: 'calc(100% - 100px)', overflow: 'auto', paddingBottom: 100 }}>

        {tab === 'dia' && (
          <>
            {/* Mood scale */}
            <div style={{
              margin: '14px 20px 0', padding: 16, background: t.surface,
              borderRadius: 18, border: '1px solid ' + t.divider,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <IconHeart size={14} color={t.secondary} />
                <MonoLabel t={t}>energía ahora</MonoLabel>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                {MOOD_ICONS.map((MoodIcon, i) => (
                  <button key={i} onClick={() => { setMood(i); saveLog(i, habits); }}
                    style={{
                      aspectRatio: '1', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: mood === i ? t.accent : t.s2,
                      color: mood === i ? t.onAccent : t.fg,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 4, fontFamily: 'inherit',
                    }}>
                    <MoodIcon size={30} stroke={1.8} />
                    {mood === i && (
                      <div style={{
                        fontFamily: t.fonts.mono, fontSize: 8,
                        fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                      }}>
                        {MOOD_LABELS[i]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Holistic Habits */}
            <div style={{ margin: '12px 20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <MonoLabel t={t}>hábitos de hoy</MonoLabel>
                <button
                  style={{
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.16em', color: t.fgMuted, textTransform: 'uppercase',
                  }}>
                  EDITAR
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                {allDisplayHabits.map(h => {
                  const isOn = habits.includes(h.id);
                  return (
                    <button key={h.id}
                      onClick={() => {
                        const newHabits = isOn ? habits.filter(x => x !== h.id) : [...habits, h.id];
                        setHabits(newHabits);
                        saveLog(mood, newHabits);
                      }}
                      style={{
                        padding: '12px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: isOn ? t.accent : t.surface,
                        color: isOn ? t.onAccent : t.fg,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        fontFamily: 'inherit',
                      }}>
                      <IconCheck size={16} stroke={isOn ? 2.4 : 1.8} />
                      <span style={{
                        fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
                        lineHeight: 1.2,
                      }}>{h.lab.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: t.s2, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(habits.length / allDisplayHabits.length) * 100}%`,
                    height: '100%', background: t.accent, borderRadius: 2,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{
                  fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700, color: t.fgMuted,
                }}>{habits.length}/{allDisplayHabits.length}</span>
              </div>
            </div>

            {/* Daily prompt */}
            <div style={{
              margin: '12px 20px 0', padding: 16, background: t.surface,
              borderRadius: 18, border: '1px solid ' + t.divider,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <MonoLabel t={t}>prompt del día</MonoLabel>
                <span style={{
                  fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.12em', color: t.accent, textTransform: 'uppercase',
                }}>{todayPrompt.cat}</span>
              </div>
              <div style={{
                fontFamily: t.fonts.body, fontSize: 13.5, color: t.fg, lineHeight: 1.5,
                fontStyle: 'italic',
              }}>"{todayPrompt.text}"</div>
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 10, background: t.s2,
                fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted,
                fontStyle: 'normal', opacity: 0.7,
              }}>Escribe tu respuesta aquí...</div>
            </div>

            {/* Body signals */}
            <SectionHead t={t}>señales corporales</SectionHead>
            <div style={{ margin: '10px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {[
                { lab: 'HRV',   val: '68ms',  delta: '+4', Icon: IconRecovery, col: t.semantic.ok },
                { lab: 'RHR',   val: '52bpm', delta: '-2', Icon: IconHeart,    col: t.semantic.ok },
                { lab: 'SUEÑO', val: '7:24',  delta: '—',  Icon: IconSleep,    col: t.tertiary   },
                { lab: 'AGUA',  val: '5/8',   delta: '—',  Icon: IconWater,    col: t.tertiary   },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '12px 14px', background: t.surface,
                  borderRadius: 14, border: '1px solid ' + t.divider,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <s.Icon size={13} stroke={1.8} color={s.col} />
                    <MonoLabel t={t}>{s.lab}</MonoLabel>
                  </div>
                  <div style={{
                    fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
                    letterSpacing: '-0.025em', color: t.fg,
                  }}>{s.val}</div>
                  <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: s.col, marginTop: 2 }}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Quick capture */}
            <SectionHead t={t}>capturar</SectionHead>
            <div style={{ margin: '10px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { Icon: IconMic,    lab: 'Voz',   primary: true  },
                { Icon: IconCamera, lab: 'Foto',  primary: false },
                { Icon: IconPlus,   lab: 'Texto', primary: false },
              ].map((q, i) => (
                <div key={i} style={{
                  padding: '14px 10px', borderRadius: 14,
                  background: q.primary ? t.fg : t.surface,
                  color: q.primary ? t.bg : t.fg,
                  border: q.primary ? 'none' : '1px solid ' + t.divider,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer',
                }}>
                  <q.Icon size={22} stroke={1.8} />
                  <span style={{
                    fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                  }}>{q.lab}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'psicologia' && (
          <>
            <div style={{ margin: '14px 20px 0' }}>
              <div style={{
                fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
                letterSpacing: '-0.03em', color: t.fg, marginBottom: 4,
              }}>Inner Map</div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, lineHeight: 1.5 }}>
                Comprende quién eres y por qué eres diferente. Estos marcos te dan contexto para tus patrones.
              </div>
            </div>
            {[
              { lab: 'ADHD',                sub: 'Atención · hiperactividad · sistemas',    val: 'Explorado',   col: t.secondary          },
              { lab: 'Biotipos',             sub: 'Tu arquetipo metabólico y mental',        val: 'Sin datos',   col: t.tertiary           },
              { lab: 'Heridas de infancia',  sub: 'Patrones inconscientes de protección',   val: 'En proceso',  col: t.semantic.mid       },
              { lab: 'Energía M/F',          sub: 'Polaridad masculina y femenina',         val: 'Balanceado',  col: t.pillar.train       },
              { lab: 'Locus de control',     sub: '¿Cuánto sientes que controlas tu vida?', val: 'Interno 72%', col: t.semantic.ok        },
              { lab: 'Apego',                sub: 'Ansioso · evitativo · seguro',           val: 'Sin datos',   col: t.fgFaint            },
            ].map((f, i) => (
              <div key={i} style={{
                margin: '8px 20px 0', padding: '14px 16px', background: t.surface,
                borderRadius: 14, border: '1px solid ' + t.divider,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.col, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13.5, color: t.fg }}>{f.lab}</div>
                  <div style={{ fontFamily: t.fonts.body, fontSize: 11.5, color: t.fgMuted, marginTop: 2 }}>{f.sub}</div>
                </div>
                <span style={{
                  fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', color: t.fgFaint,
                }}>{f.val}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'locus' && (
          <>
            <div style={{
              margin: '14px 20px 0', padding: 18, background: t.surface,
              borderRadius: 18, border: '1px solid ' + t.divider,
            }}>
              <MonoLabel t={t} color={t.accent}>locus de control</MonoLabel>
              <div style={{
                fontFamily: t.fonts.display, fontWeight: 800, fontSize: 20,
                letterSpacing: '-0.03em', color: t.fg, marginTop: 8, lineHeight: 1.2,
              }}>
                ¿Qué es tuyo?<br />¿Qué no lo es?
              </div>
              <div style={{
                fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
                lineHeight: 1.5, marginTop: 10,
              }}>
                La estoica separación entre lo que controlas y lo que no. Practica esto diario.
              </div>
            </div>

            {/* Two columns: mine / not mine */}
            <div style={{ margin: '12px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { head: 'LO MÍO',    col: t.semantic.ok,  items: ['Mi actitud', 'Mi esfuerzo', 'Mis palabras', 'Mis decisiones', 'Mi atención'] },
                { head: 'NO ES MÍO', col: t.semantic.low, items: ['Lo que piensan otros', 'El resultado final', 'El clima', 'El pasado', 'Las opiniones ajenas'] },
              ].map((col, i) => (
                <div key={i} style={{
                  padding: 14, background: t.surface, borderRadius: 14, border: '1px solid ' + t.divider,
                }}>
                  <div style={{
                    fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.16em', color: col.col, textTransform: 'uppercase', marginBottom: 10,
                  }}>{col.head}</div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{
                      fontFamily: t.fonts.body, fontSize: 12.5, color: t.fg,
                      padding: '4px 0',
                      borderBottom: j < col.items.length - 1 ? '1px solid ' + t.divider : 'none',
                    }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Today's reflection */}
            <div style={{
              margin: '12px 20px 0', padding: 16, background: t.surface,
              borderRadius: 16, border: '1px solid ' + t.divider,
            }}>
              <MonoLabel t={t}>reflexión de hoy</MonoLabel>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Hoy, ¿qué intenté controlar que no era mío?',
                  '¿Qué estaba en mi control y no aproveché?',
                  '¿Cómo puedo responder mejor mañana?',
                ].map((q, i) => (
                  <div key={i}>
                    <div style={{
                      fontFamily: t.fonts.body, fontSize: 12.5, color: t.fg,
                      fontStyle: 'italic', marginBottom: 4,
                    }}>"{q}"</div>
                    <div style={{
                      padding: '8px 10px', borderRadius: 8, background: t.s2,
                      fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted, opacity: 0.7,
                    }}>
                      Escribe aquí...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Fab t={t} onClick={onPlus} />
    </ScreenFrame>
  );
}
