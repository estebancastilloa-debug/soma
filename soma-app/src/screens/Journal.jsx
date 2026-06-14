import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatusBar, PillarHeader, MonoLabel, SectionHead, ScreenFrame, Fab } from '../chrome.jsx';
import { IconHeart, IconRecovery, IconSleep, IconWater, MOOD_ICONS, MOOD_LABELS } from '../icons.jsx';
import { HABITS, PROMPTS } from '../data/habits.js';

// ─── Spanish labels for habits ────────────────────────────────────────
const HABIT_ES = {
  mobility: 'Movilidad',   cold: 'Baño frío',    sauna: 'Sauna',
  grip: 'Test de grip',    walk: 'Caminata',      callus: 'Incomodidad voluntaria',
  stoic: 'Reflexión estoica', meditate: 'Meditación', journal: 'Journaling',
  breath: 'Respiración',   hydrate: 'Hidratación', protgoal: 'Meta de proteína',
  creatine: 'Creatina',   connect: 'Conexión profunda', gratitude: 'Gratitud',
};

const CAT_LABEL = { body: 'Cuerpo', mind: 'Mente', fuel: 'Nutrición', social: 'Social' };
const CAT_PILLAR = { body: 'train', mind: 'records', fuel: 'eat', social: 'journal' };

// ─── Psychology items ──────────────────────────────────────────────────
const PSYCH_ITEMS = [
  { id:'adhd',     lab:'ADHD',               sub:'Atención · hiperactividad · sistemas'     },
  { id:'biotipos', lab:'Biotipos',            sub:'Tu arquetipo metabólico y mental'         },
  { id:'heridas',  lab:'Heridas de infancia', sub:'Patrones inconscientes de protección'    },
  { id:'energia',  lab:'Energía M/F',         sub:'Polaridad masculina y femenina'          },
  { id:'locus_p',  lab:'Locus de control',    sub:'¿Cuánto sientes que controlas tu vida?'  },
  { id:'apego',    lab:'Apego',               sub:'Ansioso · evitativo · seguro'            },
];

const STATUS_OPTS = [
  { key:'unexplored', label:'Sin explorar' },
  { key:'exploring',  label:'Explorando'   },
  { key:'explored',   label:'Explorado'    },
];

// ─── JournalScreen ─────────────────────────────────────────────────────
export function JournalScreen({ t, onNav, onMenu, onPlus }) {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  const [tab, setTab] = useState('dia');
  const [mood, setMood] = useState(3);
  const [habits, setHabits] = useState([]);        // completed today
  const [journalText, setJournalText]   = useState('');
  const [locusAnswers, setLocusAnswers] = useState({ q1:'', q2:'', q3:'' });

  // Psychology notes — stored in localStorage
  const [psychData, setPsychData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soma_psychology') || '{}'); }
    catch { return {}; }
  });
  const [expandedPsych, setExpandedPsych] = useState(null);

  // Habit template — which habits the user tracks
  const [habitTemplate, setHabitTemplate] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('soma_habit_template'));
      return Array.isArray(saved) ? saved : HABITS.slice(0, 8).map(h => h.id);
    } catch { return HABITS.slice(0, 8).map(h => h.id); }
  });
  const [showHabitEdit, setShowHabitEdit] = useState(false);

  const journalTimer = useRef(null);
  const locusTimer   = useRef(null);

  // Load today's log
  useEffect(() => {
    if (!user) return;
    supabase.from('daily_log').select('*')
      .eq('user_id', user.id).eq('date', today).maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        if (data.mood != null)           setMood(data.mood);
        if (data.habit_ids?.length)      setHabits(data.habit_ids);
        if (data.journal_text)           setJournalText(data.journal_text);
        if (data.locus_text) {
          try { setLocusAnswers(JSON.parse(data.locus_text)); } catch {}
        }
      });
  }, [user]);

  // Supabase save
  async function saveLog({ newMood = mood, newHabits = habits, newJournal = journalText, newLocus = locusAnswers } = {}) {
    if (!user) return;
    await supabase.from('daily_log').upsert({
      user_id: user.id, date: today,
      mood: newMood, habit_ids: newHabits,
      journal_text: newJournal,
      locus_text: JSON.stringify(newLocus),
    }, { onConflict: 'user_id,date' });
  }

  function toggleHabit(id) {
    const next = habits.includes(id) ? habits.filter(x => x !== id) : [...habits, id];
    setHabits(next);
    saveLog({ newHabits: next });
  }

  function handleJournalChange(text) {
    setJournalText(text);
    clearTimeout(journalTimer.current);
    journalTimer.current = setTimeout(() => saveLog({ newJournal: text }), 1200);
  }

  function handleLocusChange(key, value) {
    const next = { ...locusAnswers, [key]: value };
    setLocusAnswers(next);
    clearTimeout(locusTimer.current);
    locusTimer.current = setTimeout(() => saveLog({ newLocus: next }), 1200);
  }

  function toggleHabitTemplate(id) {
    const next = habitTemplate.includes(id)
      ? habitTemplate.filter(x => x !== id)
      : [...habitTemplate, id];
    setHabitTemplate(next);
    localStorage.setItem('soma_habit_template', JSON.stringify(next));
  }

  function updatePsych(id, field, value) {
    const next = { ...psychData, [id]: { ...(psychData[id] || {}), [field]: value } };
    setPsychData(next);
    localStorage.setItem('soma_psychology', JSON.stringify(next));
  }

  const todayPrompt   = PROMPTS[new Date().getDay() % PROMPTS.length];
  const activeHabits  = HABITS.filter(h => habitTemplate.includes(h.id));
  const doneCount     = habits.filter(id => activeHabits.find(h => h.id === id)).length;

  return (
    <ScreenFrame t={t} accentColor={t.fg}>
      <StatusBar t={t}/>
      <PillarHeader t={t} title="Bitácora"
        sub={new Date().toLocaleDateString('es', { weekday:'long', day:'numeric', month:'long' })}
        onMenu={onMenu}/>

      {/* Tabs */}
      <div style={{ padding:'12px 20px 0', display:'flex', gap:8 }}>
        {[{ id:'dia', lab:'Día' }, { id:'psicologia', lab:'Psicología' }, { id:'locus', lab:'Locus' }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            padding:'7px 16px', borderRadius:999, border:'none', cursor:'pointer',
            background: tab === tb.id ? t.accent : t.surface,
            color: tab === tb.id ? t.onAccent : t.fgMuted,
            fontFamily:t.fonts.body, fontWeight:600, fontSize:13,
          }}>{tb.lab}</button>
        ))}
      </div>

      <div style={{ height:'calc(100% - 100px)', overflow:'auto', paddingBottom:100 }}>

        {/* ── TAB: DÍA ── */}
        {tab === 'dia' && (
          <>
            {/* Mood */}
            <div style={{ margin:'14px 20px 0', padding:16, background:t.surface, borderRadius:18, border:'1px solid '+t.divider }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                <IconHeart size={14} color={t.secondary}/>
                <MonoLabel t={t}>¿cómo te sientes ahora?</MonoLabel>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {MOOD_ICONS.map((MoodIcon, i) => (
                  <button key={i}
                    onClick={() => { setMood(i); saveLog({ newMood: i }); }}
                    style={{
                      aspectRatio:'1', borderRadius:12, border:'none', cursor:'pointer',
                      background: mood === i ? t.accent : t.s2,
                      color: mood === i ? t.onAccent : t.fg,
                      display:'flex', flexDirection:'column', alignItems:'center',
                      justifyContent:'center', gap:4,
                    }}>
                    <MoodIcon size={30} stroke={1.8}/>
                    {mood === i && (
                      <div style={{ fontFamily:t.fonts.mono, fontSize:8, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>
                        {MOOD_LABELS[i]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Habits */}
            <div style={{ margin:'12px 20px 0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <MonoLabel t={t}>hábitos de hoy · {doneCount}/{activeHabits.length}</MonoLabel>
                <button onClick={() => setShowHabitEdit(true)} style={{
                  border:'none', background:'transparent', cursor:'pointer',
                  fontFamily:t.fonts.mono, fontSize:9, fontWeight:700,
                  letterSpacing:'0.16em', color:t.accent, textTransform:'uppercase',
                }}>EDITAR</button>
              </div>

              {activeHabits.length === 0 ? (
                <div style={{ padding:16, background:t.surface, borderRadius:14, border:'1px solid '+t.divider, textAlign:'center' }}>
                  <div style={{ fontFamily:t.fonts.body, fontSize:13, color:t.fgMuted, marginBottom:10 }}>
                    Aún no has seleccionado hábitos para rastrear.
                  </div>
                  <button onClick={() => setShowHabitEdit(true)} style={{
                    padding:'8px 18px', borderRadius:20, border:'none', background:t.accent,
                    color:'#0A0908', fontFamily:t.fonts.body, fontWeight:600, fontSize:13, cursor:'pointer',
                  }}>Seleccionar hábitos</button>
                </div>
              ) : (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {activeHabits.map(h => {
                      const isOn = habits.includes(h.id);
                      const catColor = t.pillar[CAT_PILLAR[h.cat]] || t.accent;
                      return (
                        <button key={h.id} onClick={() => toggleHabit(h.id)} style={{
                          padding:'12px', borderRadius:12,
                          border: isOn ? `2px solid ${catColor}` : `1px solid ${t.border}`,
                          background: isOn ? `${catColor}18` : t.surface,
                          cursor:'pointer', textAlign:'left',
                          display:'flex', alignItems:'center', gap:10,
                        }}>
                          <div style={{
                            width:28, height:28, borderRadius:'50%', flexShrink:0,
                            background: isOn ? catColor : t.s2,
                            display:'flex', alignItems:'center', justifyContent:'center',
                          }}>
                            {isOn
                              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0908" strokeWidth="2.6" strokeLinecap="round"><polyline points="4,12 10,18 20,6"/></svg>
                              : <div style={{ width:8, height:8, borderRadius:'50%', border:`1.5px solid ${t.fgFaint}` }}/>
                            }
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontFamily:t.fonts.body, fontWeight:600, fontSize:12.5, color:t.fg, lineHeight:1.2 }}>
                              {HABIT_ES[h.id] || h.lab}
                            </div>
                            <div style={{ fontFamily:t.fonts.mono, fontSize:8, color:catColor, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:2 }}>
                              {CAT_LABEL[h.cat]}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ flex:1, height:4, borderRadius:2, background:t.s2, overflow:'hidden' }}>
                      <div style={{
                        width: activeHabits.length ? `${(doneCount / activeHabits.length) * 100}%` : '0%',
                        height:'100%', background:t.accent, borderRadius:2, transition:'width 0.3s',
                      }}/>
                    </div>
                    <span style={{ fontFamily:t.fonts.mono, fontSize:10, fontWeight:700, color:t.fgMuted }}>
                      {doneCount}/{activeHabits.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Daily prompt — real textarea */}
            <div style={{ margin:'12px 20px 0', padding:16, background:t.surface, borderRadius:18, border:'1px solid '+t.divider }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <MonoLabel t={t}>prompt del día</MonoLabel>
                <span style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.12em', color:t.accent, textTransform:'uppercase' }}>
                  {todayPrompt.cat}
                </span>
              </div>
              <div style={{ fontFamily:t.fonts.body, fontSize:13.5, color:t.fg, lineHeight:1.5, fontStyle:'italic', marginBottom:12 }}>
                "{todayPrompt.text}"
              </div>
              <textarea
                value={journalText}
                onChange={e => handleJournalChange(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                rows={4}
                style={{
                  width:'100%', background:t.s2, border:`1px solid ${t.border}`,
                  borderRadius:10, padding:'10px 12px', color:t.fg,
                  fontFamily:t.fonts.body, fontSize:13.5, lineHeight:1.5,
                  outline:'none', resize:'vertical', boxSizing:'border-box',
                }}
              />
            </div>

            {/* Body signals */}
            <SectionHead t={t}>señales corporales</SectionHead>
            <div style={{ margin:'10px 20px 0', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
              {[
                { lab:'HRV',   Icon:IconRecovery },
                { lab:'RHR',   Icon:IconHeart    },
                { lab:'Sueño', Icon:IconSleep    },
                { lab:'Agua',  Icon:IconWater    },
              ].map((s, i) => (
                <div key={i} style={{ padding:'12px 14px', background:t.surface, borderRadius:14, border:'1px solid '+t.divider }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <s.Icon size={13} stroke={1.8} color={t.fgFaint}/>
                    <MonoLabel t={t}>{s.lab}</MonoLabel>
                  </div>
                  <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:22, letterSpacing:'-0.025em', color:t.fgFaint }}>—</div>
                </div>
              ))}
            </div>
            <div style={{ margin:'6px 20px 16px', fontFamily:t.fonts.body, fontSize:11.5, color:t.fgFaint }}>
              Conecta un dispositivo de salud para ver datos reales.
            </div>
          </>
        )}

        {/* ── TAB: PSICOLOGÍA ── */}
        {tab === 'psicologia' && (
          <>
            <div style={{ margin:'14px 20px 0' }}>
              <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:22, letterSpacing:'-0.03em', color:t.fg, marginBottom:4 }}>Inner Map</div>
              <div style={{ fontFamily:t.fonts.body, fontSize:13, color:t.fgMuted, lineHeight:1.5 }}>
                Toca cualquier marco para agregar notas y cambiar tu estado de exploración.
              </div>
            </div>

            {PSYCH_ITEMS.map(item => {
              const data = psychData[item.id] || { status:'unexplored', notes:'' };
              const isExpanded = expandedPsych === item.id;
              const statusColor = data.status === 'explored'  ? (t.semantic?.ok  || '#34c759')
                                : data.status === 'exploring' ? t.accent
                                : t.fgFaint;

              return (
                <div key={item.id} style={{ margin:'8px 20px 0', background:t.surface, borderRadius:14, border:'1px solid '+t.divider, overflow:'hidden' }}>
                  {/* Card header — clickable */}
                  <button
                    onClick={() => setExpandedPsych(isExpanded ? null : item.id)}
                    style={{
                      width:'100%', padding:'14px 16px', border:'none', background:'transparent',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:12, textAlign:'left',
                    }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:statusColor, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:t.fonts.body, fontWeight:600, fontSize:13.5, color:t.fg }}>{item.lab}</div>
                      <div style={{ fontFamily:t.fonts.body, fontSize:11.5, color:t.fgMuted, marginTop:2 }}>{item.sub}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:t.fonts.mono, fontSize:8.5, fontWeight:700, letterSpacing:'0.1em', color:statusColor, textTransform:'uppercase' }}>
                        {STATUS_OPTS.find(s => s.key === data.status)?.label || 'Sin explorar'}
                      </div>
                      <div style={{ fontFamily:t.fonts.mono, fontSize:10, color:t.fgFaint, marginTop:2 }}>
                        {isExpanded ? '▲ cerrar' : '▼ abrir'}
                      </div>
                    </div>
                  </button>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div style={{ padding:'0 16px 16px', borderTop:'1px solid '+t.divider, background:t.s2 }}>
                      {/* Status selector */}
                      <div style={{ display:'flex', gap:6, marginTop:12, marginBottom:12 }}>
                        {STATUS_OPTS.map(opt => (
                          <button key={opt.key}
                            onClick={() => updatePsych(item.id, 'status', opt.key)}
                            style={{
                              padding:'5px 10px', borderRadius:20, border:'none', cursor:'pointer',
                              background: data.status === opt.key ? t.accent : t.surface,
                              color: data.status === opt.key ? '#0A0908' : t.fgMuted,
                              fontFamily:t.fonts.mono, fontSize:9, fontWeight:700,
                              textTransform:'uppercase', letterSpacing:'0.1em',
                            }}>{opt.label}</button>
                        ))}
                      </div>

                      {/* Notes textarea */}
                      <textarea
                        value={data.notes || ''}
                        onChange={e => updatePsych(item.id, 'notes', e.target.value)}
                        placeholder="Añade tus notas, reflexiones o insights..."
                        rows={3}
                        style={{
                          width:'100%', background:t.surface, border:`1px solid ${t.border}`,
                          borderRadius:10, padding:'10px 12px', color:t.fg,
                          fontFamily:t.fonts.body, fontSize:13, lineHeight:1.5,
                          outline:'none', resize:'vertical', boxSizing:'border-box',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── TAB: LOCUS ── */}
        {tab === 'locus' && (
          <>
            <div style={{ margin:'14px 20px 0', padding:18, background:t.surface, borderRadius:18, border:'1px solid '+t.divider }}>
              <MonoLabel t={t} color={t.accent}>locus de control</MonoLabel>
              <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:20, letterSpacing:'-0.03em', color:t.fg, marginTop:8, lineHeight:1.2 }}>
                ¿Qué es tuyo?<br/>¿Qué no lo es?
              </div>
              <div style={{ fontFamily:t.fonts.body, fontSize:13, color:t.fgMuted, lineHeight:1.5, marginTop:10 }}>
                La estoica separación entre lo que controlas y lo que no. Practica esto diario.
              </div>
            </div>

            {/* Lo mío / No es mío */}
            <div style={{ margin:'12px 20px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { head:'LO MÍO',    col: t.semantic?.ok  || '#34c759', items:['Mi actitud','Mi esfuerzo','Mis palabras','Mis decisiones','Mi atención'] },
                { head:'NO ES MÍO', col: t.semantic?.low || '#ff453a', items:['Lo que piensan otros','El resultado final','El clima','El pasado','Las opiniones ajenas'] },
              ].map((col, i) => (
                <div key={i} style={{ padding:14, background:t.surface, borderRadius:14, border:'1px solid '+t.divider }}>
                  <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.16em', color:col.col, textTransform:'uppercase', marginBottom:10 }}>{col.head}</div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{ fontFamily:t.fonts.body, fontSize:12.5, color:t.fg, padding:'4px 0', borderBottom: j < col.items.length - 1 ? '1px solid '+t.divider : 'none' }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Reflection questions — real textareas */}
            <div style={{ margin:'12px 20px 0', padding:16, background:t.surface, borderRadius:16, border:'1px solid '+t.divider }}>
              <MonoLabel t={t}>reflexión de hoy</MonoLabel>
              <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  { key:'q1', q:'Hoy, ¿qué intenté controlar que no era mío?' },
                  { key:'q2', q:'¿Qué estaba en mi control y no aproveché?' },
                  { key:'q3', q:'¿Cómo puedo responder mejor mañana?' },
                ].map(({ key, q }) => (
                  <div key={key}>
                    <div style={{ fontFamily:t.fonts.body, fontSize:12.5, color:t.fg, fontStyle:'italic', marginBottom:8 }}>"{q}"</div>
                    <textarea
                      value={locusAnswers[key] || ''}
                      onChange={e => handleLocusChange(key, e.target.value)}
                      placeholder="Escribe aquí..."
                      rows={2}
                      style={{
                        width:'100%', background:t.s2, border:`1px solid ${t.border}`,
                        borderRadius:8, padding:'8px 10px', color:t.fg,
                        fontFamily:t.fonts.body, fontSize:13, lineHeight:1.5,
                        outline:'none', resize:'vertical', boxSizing:'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Habit edit overlay */}
      {showHabitEdit && (
        <div style={{ position:'absolute', inset:0, zIndex:90, background:t.bg, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'52px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:22, letterSpacing:'-0.03em', color:t.fg }}>
              Mis hábitos
            </div>
            <button onClick={() => setShowHabitEdit(false)} style={{
              width:34, height:34, borderRadius:'50%', border:'none', background:t.surface,
              color:t.fg, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center',
            }}>×</button>
          </div>
          <div style={{ fontFamily:t.fonts.body, fontSize:13, color:t.fgMuted, padding:'0 20px 16px', lineHeight:1.5 }}>
            Selecciona los hábitos que quieres rastrear cada día. Estos aparecerán en tu grid diario.
          </div>
          <div style={{ flex:1, overflow:'auto', padding:'0 20px 60px' }}>
            {['body','mind','fuel','social'].map(cat => {
              const catHabits = HABITS.filter(h => h.cat === cat);
              const catColor  = t.pillar[CAT_PILLAR[cat]] || t.accent;
              return (
                <div key={cat} style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.18em', color:catColor, textTransform:'uppercase', marginBottom:8 }}>
                    {CAT_LABEL[cat]}
                  </div>
                  {catHabits.map(h => {
                    const isActive = habitTemplate.includes(h.id);
                    return (
                      <button key={h.id} onClick={() => toggleHabitTemplate(h.id)} style={{
                        width:'100%', padding:'12px 14px', marginBottom:6, borderRadius:12,
                        border: isActive ? `2px solid ${catColor}` : `1px solid ${t.border}`,
                        background: isActive ? `${catColor}18` : t.surface,
                        color:t.fg, cursor:'pointer', textAlign:'left',
                        display:'flex', alignItems:'center', gap:12,
                      }}>
                        <div style={{
                          width:22, height:22, borderRadius:'50%', flexShrink:0,
                          background: isActive ? catColor : t.s2,
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          {isActive && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0908" strokeWidth="2.6" strokeLinecap="round"><polyline points="4,12 10,18 20,6"/></svg>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:t.fonts.body, fontWeight:600, fontSize:13.5, color:t.fg }}>{HABIT_ES[h.id] || h.lab}</div>
                          <div style={{ fontFamily:t.fonts.body, fontSize:11.5, color:t.fgMuted, marginTop:2 }}>{h.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Fab t={t} onClick={onPlus}/>
    </ScreenFrame>
  );
}
