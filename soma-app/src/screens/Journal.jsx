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

// ─── Inner Map Data ────────────────────────────────────────────────────
const INNER_MAP_DATA = {
  adhd: {
    color: '#7C3AED',
    guide: 'El ADHD no es falta de atención — es dificultad para DIRIGIRLA. Tu cerebro opera con dopamina y necesita novedad, urgencia y significado. Con los sistemas correctos, el ADHD se convierte en ventaja competitiva.',
    prompt: 'Soy [tu nombre], tengo ADHD [diagnosticado/sospechado]. Analiza los documentos cargados y ayúdame a entender: 1) Cómo mi perfil específico de ADHD afecta mis hábitos de entrenamiento y nutrición. 2) Qué sistemas simples puedo implementar para mantener consistencia sin depender de motivación. 3) Cómo aprovechar mi hiperfoco en beneficio de mis metas físicas. Dame estrategias concretas y aplicables hoy.',
    exercises: [
      { id: 'a1', text: 'Realiza una tarea difícil durante 5 minutos continuos sin interrupciones' },
      { id: 'a2', text: 'Crea un "menú de recompensas" inmediatas para celebrar logros pequeños' },
      { id: 'a3', text: 'Identifica y documenta tu hora de mayor enfoque del día' },
      { id: 'a4', text: 'Diseña una rutina de 3 pasos para empezar tu entrenamiento (sin negociar)' },
      { id: 'a5', text: 'Prueba la técnica Pomodoro: 25 min enfoque + 5 min descanso × 3 ciclos' },
    ],
  },
  biotipos: {
    color: '#0EA5E9',
    guide: 'Tu biotipo es la combinación de tu arquitectura metabólica y temperamento natural. Entenderlo te permite elegir el entrenamiento y la nutrición que tu cuerpo realmente responde — en lugar de copiar lo que le funciona a otros.',
    prompt: 'Quiero entender mi biotipo psicológico y metabólico. Analiza mis registros y ayúdame a identificar: 1) Qué tipo metabólico tengo y cómo afecta mi composición corporal y energía. 2) Mi temperamento dominante y cómo influye en mi motivación y tolerancia al estrés. 3) El protocolo de entrenamiento y nutrición más alineado a mi biotipo específico.',
    exercises: [
      { id: 'b1', text: 'Registra tus niveles de energía cada 3 horas durante un día completo (1-10)' },
      { id: 'b2', text: 'Describe tu respuesta natural al estrés: ¿lucha, huida, parálisis o apaciguamiento?' },
      { id: 'b3', text: 'Identifica 3 actividades que te dan energía vs 3 que te drenan' },
      { id: 'b4', text: 'Observa tu ritmo de sueño natural un fin de semana sin alarma' },
      { id: 'b5', text: 'Nota en qué momento del día tienes más energía mental vs física' },
    ],
  },
  heridas: {
    color: '#DC2626',
    guide: 'Las heridas de infancia son patrones emocionales formados cuando necesidades básicas no fueron cubiertas. Carl Jung llamó a esto la "sombra". Trabajar con ellas no es revivir el pasado — es dejar de que el pasado viva en ti.',
    prompt: 'Quiero explorar mis patrones emocionales y relacionales. Basándote en lo que he escrito, ayúdame a identificar: 1) Qué patrones de comportamiento podrían tener raíces en experiencias tempranas. 2) Cuáles son mis disparadores emocionales más comunes. 3) Ejercicios de shadow work específicos para mis patrones. Dame reflexiones profundas pero prácticas y aplicables.',
    exercises: [
      { id: 'h1', text: 'Escribe una carta a tu yo de 10 años — sin enviarla, sin censurarte' },
      { id: 'h2', text: 'Identifica 3 situaciones donde reaccionas de forma desproporcionada' },
      { id: 'h3', text: '¿Qué necesitabas de pequeño que no recibiste? Escríbelo sin juzgar' },
      { id: 'h4', text: 'Observa qué características de otros te molestan más (posibles partes tuyas)' },
      { id: 'h5', text: 'Practica hoy darte lo que tu yo más joven más necesitaba' },
    ],
  },
  energia: {
    color: '#D97706',
    guide: 'Todos tenemos energía masculina (dirección, estructura, acción) y femenina (flujo, creatividad, receptividad). No son géneros — son fuerzas complementarias. El desequilibrio en cualquier dirección genera agotamiento y fricción.',
    prompt: 'Quiero entender mi balance de energías y polaridad. Basándote en mis registros, ayúdame a ver: 1) Cuándo opero más desde energía direccional vs receptiva en mi vida diaria. 2) En qué áreas estoy desbalanceado. 3) Cómo integrar ambas energías de forma más consciente en entrenamiento, trabajo y relaciones.',
    exercises: [
      { id: 'e1', text: 'Pasa 20 minutos sin agenda, solo fluyendo — sin metas ni productividad' },
      { id: 'e2', text: 'Toma una decisión difícil que has estado posponiendo' },
      { id: 'e3', text: 'Identifica una área con exceso de caos y otra con exceso de rigidez' },
      { id: 'e4', text: 'Practica pedir ayuda una vez hoy sin explicar o justificar por qué' },
      { id: 'e5', text: 'Crea estructura visible (lista, horario, ritual) en tu área más caótica' },
    ],
  },
  locus_p: {
    color: '#059669',
    guide: 'El locus de control interno significa que crees que tus acciones determinan tus resultados. El externo, que la vida te pasa. La ciencia muestra que el locus interno correlaciona con mejor salud, rendimiento y bienestar general.',
    prompt: 'Analiza mis registros y ayúdame a identificar mis patrones de locus de control. ¿En qué áreas tiendo a ceder mi poder o culpar circunstancias externas? ¿Dónde tengo más agencia de la que estoy usando? Dame estrategias concretas para fortalecer mi sentido de agencia donde más lo necesito.',
    exercises: [
      { id: 'l1', text: 'Lista 5 cosas que definitivamente SÍ controlas en este momento' },
      { id: 'l2', text: 'Identifica una queja recurrente y escribe qué acción tuya puede cambiarla' },
      { id: 'l3', text: 'Reemplaza "no puedo" por "no quiero" o "elijo no" durante un día' },
      { id: 'l4', text: 'Ante el problema más recurrente: ¿qué parte depende únicamente de ti?' },
      { id: 'l5', text: 'Toma una decisión pequeña hoy sin pedir opinión de nadie' },
    ],
  },
  apego: {
    color: '#DB2777',
    guide: 'El estilo de apego se forma en los primeros años y moldea cómo nos relacionamos de adultos. Los estilos son: Seguro, Ansioso, Evitativo y Desorganizado. La buena noticia: el apego es plástico — puede cambiar con conciencia y práctica.',
    prompt: 'Quiero entender mi estilo de apego y cómo afecta mis relaciones actuales. Basándote en mis notas y reflexiones, ¿qué patrones relacionales observas? ¿Qué características de mi estilo de apego aparecen con más frecuencia? Dame ejercicios prácticos y específicos para moverme hacia un apego más seguro.',
    exercises: [
      { id: 'ap1', text: 'Identifica tu respuesta automática cuando alguien se acerca emocionalmente' },
      { id: 'ap2', text: 'Nota cuándo sientes ansiedad de abandono vs deseo de distancia en 24 hrs' },
      { id: 'ap3', text: 'Practica pedir una necesidad emocional directamente, sin rodeos ni hints' },
      { id: 'ap4', text: 'Observa si en relaciones pierdes tu autonomía o la proteges en exceso' },
      { id: 'ap5', text: 'Escribe cómo era tu relación con tus cuidadores principales en la infancia' },
    ],
  },
};

// ─── InnerMapDetail ────────────────────────────────────────────────────
function InnerMapDetail({ t, item, data, onBack, onUpdate }) {
  const detail = INNER_MAP_DATA[item.id] || {};
  const [copied, setCopied] = useState(false);
  const [exercises, setExercises] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('soma_psych_exercises') || '{}');
      return saved[item.id] || [];
    } catch { return []; }
  });

  function toggleExercise(exId) {
    const next = exercises.includes(exId)
      ? exercises.filter(x => x !== exId)
      : [...exercises, exId];
    setExercises(next);
    try {
      const all = JSON.parse(localStorage.getItem('soma_psych_exercises') || '{}');
      all[item.id] = next;
      localStorage.setItem('soma_psych_exercises', JSON.stringify(all));
    } catch {}
  }

  function handleCopy() {
    if (detail.prompt) {
      navigator.clipboard.writeText(detail.prompt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }

  const statusColor = data.status === 'explored'  ? (t.semantic?.ok  || '#34c759')
                    : data.status === 'exploring' ? t.accent
                    : t.fgFaint;

  const exList = detail.exercises || [];
  const doneEx = exercises.filter(id => exList.find(e => e.id === id)).length;
  const exProgress = exList.length ? doneEx / exList.length : 0;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 95,
      background: t.bg, display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ paddingTop: 52, paddingLeft: 20, paddingRight: 20, paddingBottom: 16, borderBottom: '1px solid ' + t.divider, flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', color: t.fgMuted, textTransform: 'uppercase',
            padding: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6,
          }}>
          <span style={{ fontSize: 14 }}>←</span> Volver
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: detail.color || t.accent, flexShrink: 0 }} />
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color: t.fg }}>
            {item.lab}
          </div>
        </div>
        <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, marginTop: 4, paddingLeft: 22 }}>
          {item.sub}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 60 }}>

        {/* STATUS */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + t.divider }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: t.fgMuted, textTransform: 'uppercase', marginBottom: 10 }}>
            Estado
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {STATUS_OPTS.map(opt => {
              const isActive = data.status === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => onUpdate(item.id, 'status', opt.key)}
                  style={{
                    padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: isActive ? (detail.color || t.accent) : t.surface,
                    color: isActive ? '#ffffff' : t.fgMuted,
                    fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    transition: 'all 0.15s',
                  }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GUÍA */}
        {detail.guide && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + t.divider }}>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: detail.color || t.accent, textTransform: 'uppercase', marginBottom: 10 }}>
              Guía
            </div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 14, color: t.fg, lineHeight: 1.6 }}>
              {detail.guide}
            </div>
          </div>
        )}

        {/* PROMPT NOTEBOOKLM */}
        {detail.prompt && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + t.divider }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: detail.color || t.accent, textTransform: 'uppercase' }}>
                Prompt NotebookLM
              </div>
              <button
                onClick={handleCopy}
                style={{
                  padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: copied ? (t.semantic?.ok || '#34c759') : t.surface,
                  color: copied ? '#ffffff' : t.fg,
                  fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}>
                {copied ? '✓ COPIADO' : 'COPIAR'}
              </button>
            </div>
            <div style={{
              padding: '12px 14px', background: t.surface,
              borderRadius: 12, border: '1px solid ' + t.divider,
            }}>
              <div style={{
                fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted,
                lineHeight: 1.6, fontStyle: 'italic',
              }}>
                {detail.prompt}
              </div>
            </div>
          </div>
        )}

        {/* EJERCICIOS PRÁCTICOS */}
        {exList.length > 0 && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + t.divider }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: detail.color || t.accent, textTransform: 'uppercase' }}>
                Ejercicios Prácticos
              </div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700, color: t.fgMuted }}>
                {doneEx}/{exList.length}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {exList.map(ex => {
                const isDone = exercises.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggleExercise(ex.id)}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
                      border: isDone ? `2px solid ${detail.color || t.accent}` : '1px solid ' + t.border,
                      background: isDone ? `${detail.color || t.accent}15` : t.surface,
                      display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left',
                    }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      border: isDone ? 'none' : `1.5px solid ${t.fgFaint}`,
                      background: isDone ? (detail.color || t.accent) : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isDone && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
                          <polyline points="4,12 10,18 20,6"/>
                        </svg>
                      )}
                    </div>
                    <div style={{
                      fontFamily: t.fonts.body, fontSize: 13, color: isDone ? t.fgMuted : t.fg,
                      lineHeight: 1.4,
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}>
                      {ex.text}
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Progress bar */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: t.s2, overflow: 'hidden' }}>
                <div style={{
                  width: `${exProgress * 100}%`, height: '100%',
                  background: detail.color || t.accent, borderRadius: 2, transition: 'width 0.3s',
                }} />
              </div>
              <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, color: t.fgMuted }}>
                {Math.round(exProgress * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* MIS NOTAS */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: detail.color || t.accent, textTransform: 'uppercase', marginBottom: 10 }}>
            Mis Notas
          </div>
          <textarea
            value={data.notes || ''}
            onChange={e => onUpdate(item.id, 'notes', e.target.value)}
            placeholder="Añade tus reflexiones, insights o aprendizajes..."
            rows={5}
            style={{
              width: '100%', background: t.surface, border: '1px solid ' + t.border,
              borderRadius: 12, padding: '12px 14px', color: t.fg,
              fontFamily: t.fonts.body, fontSize: 13.5, lineHeight: 1.5,
              outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}

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
  const [psychDetailItem, setPsychDetailItem] = useState(null);

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
                Toca cualquier marco para explorar tu perfil psicológico en profundidad.
              </div>
            </div>

            {PSYCH_ITEMS.map(item => {
              const data = psychData[item.id] || { status:'unexplored', notes:'' };
              const detail = INNER_MAP_DATA[item.id] || {};
              const statusColor = data.status === 'explored'  ? (t.semantic?.ok  || '#34c759')
                                : data.status === 'exploring' ? t.accent
                                : t.fgFaint;

              return (
                <div key={item.id} style={{ margin:'8px 20px 0', background:t.surface, borderRadius:14, border:'1px solid '+t.divider, overflow:'hidden' }}>
                  <button
                    onClick={() => setPsychDetailItem(item)}
                    style={{
                      width:'100%', padding:'14px 16px', border:'none', background:'transparent',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:12, textAlign:'left',
                    }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background: detail.color || statusColor, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:t.fonts.body, fontWeight:600, fontSize:13.5, color:t.fg }}>{item.lab}</div>
                      <div style={{ fontFamily:t.fonts.body, fontSize:11.5, color:t.fgMuted, marginTop:2 }}>{item.sub}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:t.fonts.mono, fontSize:8.5, fontWeight:700, letterSpacing:'0.1em', color:statusColor, textTransform:'uppercase' }}>
                        {STATUS_OPTS.find(s => s.key === data.status)?.label || 'Sin explorar'}
                      </div>
                      <div style={{ fontFamily:t.fonts.mono, fontSize:10, color:t.fgFaint, marginTop:2 }}>
                        Ver guía →
                      </div>
                    </div>
                  </button>
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

      {/* InnerMapDetail overlay */}
      {psychDetailItem && (
        <InnerMapDetail
          t={t}
          item={psychDetailItem}
          data={psychData[psychDetailItem.id] || { status: 'unexplored', notes: '' }}
          onBack={() => setPsychDetailItem(null)}
          onUpdate={updatePsych}
        />
      )}

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
