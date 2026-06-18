import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getTodayHealthData } from '../lib/healthConnect.js';
import { computeReadiness } from '../lib/readiness.js';
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

// ─── Physical feeling states ───────────────────────────────────────────
const PHYS_STATES = [
  { id: 'great',   label: 'Excelente', color: '#34C759' },
  { id: 'good',    label: 'Bien',      color: '#42C5F5' },
  { id: 'ok',      label: 'Normal',    color: '#F5C542' },
  { id: 'tired',   label: 'Cansado',   color: '#F59E0B' },
  { id: 'drained', label: 'Agotado',   color: '#DC2626' },
];

// ─── Body area groups ──────────────────────────────────────────────────
const BODY_AREA_GROUPS = [
  { group: 'SUPERIOR', areas: ['Cuello', 'Hombro izq', 'Hombro der', 'Codo izq', 'Codo der', 'Muñeca izq', 'Muñeca der'] },
  { group: 'TORSO',    areas: ['Espalda alta', 'Lumbar', 'Pecho', 'Core'] },
  { group: 'INFERIOR', areas: ['Cadera', 'Cuádriceps izq', 'Cuádriceps der', 'Isquios izq', 'Isquios der', 'Rodilla izq', 'Rodilla der', 'Tobillo izq', 'Tobillo der'] },
];

// Pain intensity per body area
const PAIN_LEVELS = [
  { v: 0, label: '—',         color: null      },
  { v: 1, label: 'Leve',      color: '#F5C542' },
  { v: 2, label: 'Moderado',  color: '#F59E0B' },
  { v: 3, label: 'Fuerte',    color: '#DC2626' },
];

// Pain type: exercise soreness (normal/good) vs injury (bad)
const PAIN_TYPES = [
  { id: 'exercise', label: 'Ejercicio', sub: 'Agujetas / esfuerzo normal', color: '#42C5F5' },
  { id: 'injury',   label: 'Lesión',    sub: 'Dolor que preocupa',          color: '#DC2626' },
];

// Normalize stored area data (legacy array, legacy number, or {level,type})
function normalizeAreas(raw) {
  const out = {};
  if (Array.isArray(raw)) {
    raw.forEach(a => { out[a] = { level: 2, type: 'exercise' }; });
  } else if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([area, val]) => {
      if (typeof val === 'number') out[area] = { level: val, type: 'exercise' };
      else if (val && typeof val === 'object') out[area] = { level: val.level || 1, type: val.type || 'exercise' };
    });
  }
  return out;
}

// ─── WebAuthn helpers ──────────────────────────────────────────────────
function u8ToB64(arr) {
  return btoa(String.fromCharCode(...new Uint8Array(arr)));
}
function b64ToU8(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

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
        <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + t.divider }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: detail.color || t.accent, textTransform: 'uppercase', marginBottom: 10 }}>
            Mis Notas
          </div>
          <textarea
            value={data.notes || ''}
            onChange={e => onUpdate(item.id, 'notes', e.target.value)}
            placeholder="Añade tus reflexiones, insights o aprendizajes..."
            rows={4}
            style={{
              width: '100%', background: t.surface, border: '1px solid ' + t.border,
              borderRadius: 12, padding: '12px 14px', color: t.fg,
              fontFamily: t.fonts.body, fontSize: 13.5, lineHeight: 1.5,
              outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* RESPUESTA DE NOTEBOOKLM */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: detail.color || t.accent, textTransform: 'uppercase', marginBottom: 6 }}>
            Respuesta de NotebookLM
          </div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11.5, color: t.fgFaint, lineHeight: 1.4, marginBottom: 10 }}>
            Pega aquí la respuesta de NotebookLM cuando uses el prompt de arriba. Esto enriquece tu perfil y los futuros prompts.
          </div>
          <textarea
            value={data.nlmResponse || ''}
            onChange={e => onUpdate(item.id, 'nlmResponse', e.target.value)}
            placeholder="Pega la respuesta de NotebookLM aquí..."
            rows={5}
            style={{
              width: '100%', background: t.s2, border: '1px solid ' + t.border,
              borderRadius: 12, padding: '12px 14px', color: t.fg,
              fontFamily: t.fonts.body, fontSize: 13, lineHeight: 1.5,
              outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
          {data.nlmResponse && (
            <div style={{ marginTop: 6, fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint, textAlign: 'right', letterSpacing: '0.1em' }}>
              GUARDADO ✓
            </div>
          )}
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

  // Physical feeling + body areas (localStorage, per-day)
  const [physMood, setPhysMood] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soma_phys_mood') || '{}')[today] || null; }
    catch { return null; }
  });
  // body areas store { areaName: { level: 1-3, type: 'exercise'|'injury' } }
  const [bodyAreas, setBodyAreas] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('soma_body_areas') || '{}')[today];
      return normalizeAreas(raw);
    } catch { return {}; }
  });
  const [painSheetArea, setPainSheetArea] = useState(null); // area being edited

  // Psychology biometric lock
  const [psychUnlocked, setPsychUnlocked] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(() => !!localStorage.getItem('soma_webauthn_id'));
  const [bioRegistering, setBioRegistering] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [obsidianCopied, setObsidianCopied] = useState(false);

  useEffect(() => {
    getTodayHealthData().then(d => { if (d) setHealthData(d); });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from('workouts').select('*')
      .eq('user_id', user.id).eq('date', today).maybeSingle()
      .then(({ data }) => { if (data) setTodayWorkout(data); });
  }, [user]);

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

  function buildObsidianNote() {
    const dateLabel = new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const lines = [];

    lines.push(`# 📊 SOMA — ${today}`);
    lines.push(`_${dateLabel}_`);
    lines.push('');

    // ── Entrenamiento ──
    lines.push('## 🏋️ Entrenamiento');
    if (todayWorkout) {
      lines.push(`- **WOD:** ${todayWorkout.name || '—'}`);
      if (todayWorkout.wod_type)   lines.push(`- **Tipo:** ${todayWorkout.wod_type}`);
      if (todayWorkout.description) lines.push(`- **Descripción:** ${todayWorkout.description}`);
      if (todayWorkout.score != null) lines.push(`- **Score:** ${todayWorkout.score} ${todayWorkout.score_unit || ''}`);
      if (todayWorkout.notes)      lines.push(`- **Notas:** ${todayWorkout.notes}`);
    } else {
      lines.push('- Sin entrenamiento registrado hoy');
    }
    lines.push('');

    // ── Estado Mental ──
    lines.push('## 🧠 Estado Mental');
    const moodLabels = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Genial'];
    lines.push(`- **Mood:** ${moodLabels[mood] ?? '—'} (${mood + 1}/5)`);
    lines.push('');

    // ── Estado Físico ──
    lines.push('## 💪 Estado Físico');
    const physLabel = PHYS_STATES.find(s => s.id === physMood)?.label || 'No registrado';
    lines.push(`- **Cansancio:** ${physLabel}`);
    const painEntries = Object.entries(bodyAreas).filter(([, v]) => v && v.level > 0);
    if (painEntries.length > 0) {
      const injuryText = painEntries.filter(([, v]) => v.type === 'injury')
        .map(([a, v]) => `${a} (${PAIN_LEVELS.find(p => p.v === v.level)?.label || v.level})`).join(', ');
      const exerciseText = painEntries.filter(([, v]) => v.type === 'exercise')
        .map(([a, v]) => `${a} (${PAIN_LEVELS.find(p => p.v === v.level)?.label || v.level})`).join(', ');
      if (injuryText)   lines.push(`- **Dolor de lesión ⚠:** ${injuryText}`);
      if (exerciseText) lines.push(`- **Dolor de ejercicio:** ${exerciseText}`);
    }
    if (readiness) {
      lines.push(`- **Readiness:** ${readiness.score}/100 · ${readiness.label}`);
    }
    lines.push('');

    // ── Hábitos ──
    const activeHabits = HABITS.filter(h => habitTemplate.includes(h.id));
    const doneHabits   = activeHabits.filter(h => habits.includes(h.id));
    lines.push(`## ✅ Hábitos — ${doneHabits.length}/${activeHabits.length}`);
    activeHabits.forEach(h => {
      const done = habits.includes(h.id);
      lines.push(`- [${done ? 'x' : ' '}] ${HABIT_ES[h.id] || h.lab}`);
    });
    lines.push('');

    // ── Biométricas (Health Connect) ──
    if (healthData) {
      lines.push('## ❤️ Biométricas');
      if (healthData.hrv)        lines.push(`- **HRV:** ${healthData.hrv} ms`);
      if (healthData.rhr)        lines.push(`- **RHR:** ${healthData.rhr} bpm`);
      if (healthData.sleepHours) lines.push(`- **Sueño:** ${healthData.sleepHours} h`);
      if (healthData.steps)      lines.push(`- **Pasos:** ${healthData.steps.toLocaleString()}`);
      if (healthData.calories)   lines.push(`- **Calorías activas:** ${healthData.calories} kcal`);
      if (healthData.weight)     lines.push(`- **Peso:** ${healthData.weight} kg`);
      lines.push('');
    }

    // ── Reflexión del día ──
    const todayP = PROMPTS[new Date().getDay() % PROMPTS.length];
    lines.push('## 📝 Reflexión del día');
    lines.push(`> _"${todayP.text}"_`);
    lines.push('');
    if (journalText.trim()) {
      journalText.trim().split('\n').forEach(l => lines.push(l));
    } else {
      lines.push('_Sin respuesta hoy_');
    }
    lines.push('');

    // ── Locus de Control ──
    const locusQs = [
      { key:'q1', q:'¿Qué intenté controlar que no era mío?' },
      { key:'q2', q:'¿Qué estaba en mi control y no aproveché?' },
      { key:'q3', q:'¿Cómo puedo responder mejor mañana?' },
    ];
    const hasLocus = locusQs.some(({ key }) => locusAnswers[key]?.trim());
    if (hasLocus) {
      lines.push('## 🔄 Locus de Control');
      locusQs.forEach(({ key, q }) => {
        lines.push(`**${q}**`);
        lines.push(locusAnswers[key]?.trim() || '_Sin respuesta_');
        lines.push('');
      });
    }

    // ── Psicología (notas del día) ──
    const psychNotes = Object.entries(psychData)
      .filter(([, d]) => d?.notes?.trim())
      .map(([id, d]) => {
        const item = PSYCH_ITEMS.find(p => p.id === id);
        return item ? `**${item.lab}:** ${d.notes.trim()}` : null;
      })
      .filter(Boolean);
    if (psychNotes.length) {
      lines.push('## 🧬 Inner Map — Notas');
      psychNotes.forEach(n => lines.push(`- ${n}`));
      lines.push('');
    }

    lines.push('---');
    lines.push(`_Exportado desde SOMA · ${new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })}_`);

    return lines.join('\n');
  }

  async function handleCopyObsidian() {
    const note = buildObsidianNote();
    try {
      await navigator.clipboard.writeText(note);
      setObsidianCopied(true);
      setTimeout(() => setObsidianCopied(false), 3000);
    } catch {
      // fallback: show in alert on devices without clipboard API
      alert(note);
    }
  }

  function handlePhysMood(id) {
    setPhysMood(id);
    try {
      const all = JSON.parse(localStorage.getItem('soma_phys_mood') || '{}');
      all[today] = id;
      localStorage.setItem('soma_phys_mood', JSON.stringify(all));
    } catch {}
  }

  function persistAreas(next) {
    setBodyAreas(next);
    try {
      const all = JSON.parse(localStorage.getItem('soma_body_areas') || '{}');
      all[today] = next;
      localStorage.setItem('soma_body_areas', JSON.stringify(all));
    } catch {}
  }

  function setPain(area, level, type) {
    const next = { ...bodyAreas };
    if (!level) delete next[area];
    else next[area] = { level, type: type || next[area]?.type || 'exercise' };
    persistAreas(next);
  }

  // Count injury-days and exercise-days per area across history
  const areaFrequency = (() => {
    try {
      const all = JSON.parse(localStorage.getItem('soma_body_areas') || '{}');
      const counts = {};
      Object.values(all).forEach(day => {
        const norm = normalizeAreas(day);
        Object.entries(norm).forEach(([a, v]) => {
          if (!counts[a]) counts[a] = { total: 0, injury: 0 };
          counts[a].total += 1;
          if (v.type === 'injury') counts[a].injury += 1;
        });
      });
      return counts;
    } catch { return {}; }
  })();

  // readiness: pass intensities weighted by type (injury counts more)
  const painMapWeighted = Object.fromEntries(
    Object.entries(bodyAreas).map(([a, v]) => [a, v.type === 'injury' ? v.level * 1.6 : v.level])
  );
  const readiness = computeReadiness({ healthData, fatigueId: physMood, mentalMood: mood, painMap: painMapWeighted });

  async function registerBiometric() {
    if (!window.PublicKeyCredential) {
      alert('Tu dispositivo no soporta biometría web. Intenta en Safari (iOS) o Chrome (Android).');
      return;
    }
    setBioRegistering(true);
    try {
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: 'SOMA', id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(user?.id || 'soma-user'),
            name: user?.email || 'soma@user',
            displayName: 'SOMA User',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
          timeout: 60000,
        }
      });
      if (cred) {
        localStorage.setItem('soma_webauthn_id', u8ToB64(cred.rawId));
        setBioEnabled(true);
        setPsychUnlocked(true);
      }
    } catch { /* user cancelled */ }
    finally { setBioRegistering(false); }
  }

  async function authenticateBiometric() {
    const storedId = localStorage.getItem('soma_webauthn_id');
    if (!storedId) { setPsychUnlocked(true); return; }
    try {
      const result = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rpId: window.location.hostname,
          allowCredentials: [{ type: 'public-key', id: b64ToU8(storedId) }],
          userVerification: 'required',
          timeout: 60000,
        }
      });
      if (result) setPsychUnlocked(true);
    } catch { /* user cancelled */ }
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
            {/* Mental Mood */}
            <div style={{ margin:'14px 20px 0', padding:16, background:t.surface, borderRadius:18, border:'1px solid '+t.divider }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                <IconHeart size={14} color={t.secondary}/>
                <MonoLabel t={t}>estado mental</MonoLabel>
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

            {/* Readiness card */}
            {readiness && (
              <div style={{ margin:'10px 20px 0', padding:16, background:readiness.color, borderRadius:18, position:'relative', overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.16em', color:'#0A0908AA', textTransform:'uppercase' }}>readiness</div>
                    <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:30, letterSpacing:'-0.04em', color:'#0A0908', lineHeight:1.1, marginTop:2 }}>
                      {readiness.label}
                    </div>
                  </div>
                  <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:46, letterSpacing:'-0.05em', color:'#0A0908', lineHeight:1 }}>
                    {readiness.score}
                  </div>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
                  {readiness.parts.map(p => (
                    <span key={p.key} style={{ fontFamily:t.fonts.mono, fontSize:9.5, fontWeight:700, color:'#0A0908', opacity:0.7 }}>
                      {p.key} {p.penalty > 0 ? `−${p.penalty}` : '✓'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cansancio (fatigue) */}
            <div style={{ margin:'10px 20px 0', padding:16, background:t.surface, borderRadius:18, border:'1px solid '+t.divider }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.fgFaint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <MonoLabel t={t}>cansancio / energía</MonoLabel>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {PHYS_STATES.map(s => (
                  <button key={s.id} onClick={() => handlePhysMood(s.id)} style={{
                    flex:1, minWidth:0, padding:'9px 4px', borderRadius:10, border:'none', cursor:'pointer',
                    background: physMood === s.id ? s.color : t.s2,
                    color: physMood === s.id ? '#fff' : t.fgMuted,
                    fontFamily:t.fonts.body, fontWeight: physMood === s.id ? 700 : 400, fontSize:12,
                    transition:'all 0.15s',
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dolor por zona (pain with intensity) */}
            <div style={{ margin:'10px 20px 0', padding:16, background:t.surface, borderRadius:18, border:'1px solid '+t.divider }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <MonoLabel t={t}>dolor por zona</MonoLabel>
                {Object.keys(bodyAreas).length > 0 && (
                  <span style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, color:'#DC2626', letterSpacing:'0.1em' }}>
                    {Object.keys(bodyAreas).length} ZONA{Object.keys(bodyAreas).length>1?'S':''}
                  </span>
                )}
              </div>
              {/* legend */}
              <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
                {PAIN_TYPES.map(pt => (
                  <div key={pt.id} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:pt.color }}/>
                    <span style={{ fontFamily:t.fonts.body, fontSize:11, color:t.fgMuted }}>{pt.label}</span>
                  </div>
                ))}
                <span style={{ fontFamily:t.fonts.body, fontSize:11, color:t.fgFaint, marginLeft:'auto' }}>toca una zona</span>
              </div>
              {BODY_AREA_GROUPS.map(({ group, areas }) => (
                <div key={group} style={{ marginBottom:10 }}>
                  <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.12em', color:t.fgFaint, textTransform:'uppercase', marginBottom:7 }}>
                    {group}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {areas.map(area => {
                      const entry = bodyAreas[area];
                      const active = !!entry;
                      const typeCol = entry ? PAIN_TYPES.find(p => p.id === entry.type)?.color : null;
                      const freq = areaFrequency[area];
                      return (
                        <button key={area} onClick={() => setPainSheetArea(area)} style={{
                          padding:'8px 11px', borderRadius:10,
                          border:`1px solid ${active ? typeCol : t.border}`,
                          background: active ? typeCol + '22' : t.s2,
                          color: active ? typeCol : t.fg,
                          cursor:'pointer', fontFamily:t.fonts.body, fontSize:13, fontWeight: active ? 600 : 400,
                          display:'flex', alignItems:'center', gap:5,
                        }}>
                          {active && <span style={{ display:'flex', gap:2 }}>
                            {[1,2,3].map(d => <span key={d} style={{ width:5, height:5, borderRadius:'50%', background: d <= entry.level ? typeCol : typeCol+'44' }}/>)}
                          </span>}
                          {area}
                          {freq?.injury > 1 && (
                            <span style={{ fontFamily:t.fonts.mono, fontSize:9, color:'#DC2626', opacity:0.8 }}>
                              ⚠{freq.injury}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {/* Injury watch — areas flagged as injury most often */}
              {Object.entries(areaFrequency).some(([, c]) => c.injury > 0) && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid '+t.divider }}>
                  <div style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.12em', color:'#DC2626', textTransform:'uppercase', marginBottom:7 }}>
                    ⚠ Vigilancia de lesiones
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {Object.entries(areaFrequency).filter(([, c]) => c.injury > 0).sort((a,b)=>b[1].injury-a[1].injury).slice(0,6).map(([area, c]) => (
                      <div key={area} style={{ padding:'5px 9px', borderRadius:8, background:'#DC262615', border:'1px solid #DC262644', display:'flex', alignItems:'center', gap:5 }}>
                        <span style={{ fontFamily:t.fonts.body, fontSize:12, color:t.fg }}>{area}</span>
                        <span style={{ fontFamily:t.fonts.mono, fontSize:10, fontWeight:700, color:'#DC2626' }}>{c.injury}d lesión</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

            {/* ── Exportar a Obsidian ── */}
            <div style={{ margin:'16px 20px 0' }}>
              <button onClick={handleCopyObsidian} style={{
                width:'100%', padding:'15px 20px', borderRadius:16,
                border:`1.5px solid ${obsidianCopied ? '#7C3AED' : t.divider}`,
                background: obsidianCopied ? '#7C3AED18' : t.surface,
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
                transition:'all 0.2s',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:36, height:36, borderRadius:10, flexShrink:0,
                    background: obsidianCopied ? '#7C3AED' : t.s2,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6M9 16h6M9 8h3" stroke={obsidianCopied ? '#fff' : t.fgMuted} strokeWidth="2" strokeLinecap="round"/>
                      <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke={obsidianCopied ? '#fff' : t.fgMuted} strokeWidth="2"/>
                    </svg>
                  </div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontFamily:t.fonts.body, fontWeight:700, fontSize:13.5, color: obsidianCopied ? '#7C3AED' : t.fg }}>
                      {obsidianCopied ? '✓ Copiado — pega en Obsidian' : 'Copiar resumen del día'}
                    </div>
                    <div style={{ fontFamily:t.fonts.mono, fontSize:9, color:t.fgFaint, letterSpacing:'0.1em', marginTop:2 }}>
                      ENTRENO · MOOD · HÁBITOS · HRV · REFLEXIÓN
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily:t.fonts.mono, fontSize:10, fontWeight:700, color: obsidianCopied ? '#7C3AED' : t.fgFaint, letterSpacing:'0.1em', flexShrink:0 }}>
                  {obsidianCopied ? 'LISTO' : 'COPIAR →'}
                </div>
              </button>
            </div>

            {/* Body signals — real Health Connect data */}
            <SectionHead t={t}>señales corporales</SectionHead>
            <div style={{ margin:'10px 20px 0', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
              {[
                { lab:'RHR',     Icon:IconHeart,    val: healthData?.rhr   ? `${healthData.rhr} bpm` : '—', live: !!healthData?.rhr   },
                { lab:'Sueño',   Icon:IconSleep,    val: healthData?.sleepHours ? `${healthData.sleepHours}h` : '—', live: !!healthData?.sleepHours },
                { lab:'Pasos',   Icon:IconRecovery, val: healthData?.steps != null ? healthData.steps.toLocaleString() : '—', live: healthData?.steps != null },
                { lab:'Calorías',Icon:IconWater,    val: healthData?.calories != null ? `${healthData.calories}` : '—', live: healthData?.calories != null },
              ].map((s, i) => (
                <div key={i} style={{ padding:'12px 14px', background:t.surface, borderRadius:14, border:'1px solid '+t.divider }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <s.Icon size={13} stroke={1.8} color={s.live ? t.accent : t.fgFaint}/>
                    <MonoLabel t={t}>{s.lab}</MonoLabel>
                  </div>
                  <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:20, letterSpacing:'-0.025em', color: s.live ? t.fg : t.fgFaint }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
            {!healthData && (
              <div style={{ margin:'6px 20px 16px', fontFamily:t.fonts.body, fontSize:11.5, color:t.fgFaint }}>
                Conecta Health Connect desde el Dashboard para ver datos reales.
              </div>
            )}
          </>
        )}

        {/* ── TAB: PSICOLOGÍA ── */}
        {tab === 'psicologia' && !psychUnlocked && (
          <div style={{ padding:'60px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:20, textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:20, background:t.surface, border:'1px solid '+t.divider, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={t.fgMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:22, letterSpacing:'-0.03em', color:t.fg, marginBottom:8 }}>
                Zona privada
              </div>
              <div style={{ fontFamily:t.fonts.body, fontSize:13.5, color:t.fgMuted, lineHeight:1.6, maxWidth:280 }}>
                {bioEnabled
                  ? 'Verifica tu identidad con huella digital para acceder a tu Inner Map.'
                  : 'Activa la autenticación biométrica para proteger tu perfil psicológico.'}
              </div>
            </div>
            {bioEnabled ? (
              <button onClick={authenticateBiometric} style={{
                padding:'14px 32px', borderRadius:14, border:'none',
                background:t.accent, color:'#0A0908', cursor:'pointer',
                fontFamily:t.fonts.body, fontWeight:700, fontSize:15,
              }}>
                Verificar con huella
              </button>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%', maxWidth:300 }}>
                <button onClick={registerBiometric} disabled={bioRegistering} style={{
                  padding:'14px', borderRadius:14, border:'none',
                  background:t.accent, color:'#0A0908', cursor:'pointer',
                  fontFamily:t.fonts.body, fontWeight:700, fontSize:14,
                  opacity: bioRegistering ? 0.6 : 1,
                }}>
                  {bioRegistering ? 'Activando...' : 'Activar huella digital'}
                </button>
                <button onClick={() => setPsychUnlocked(true)} style={{
                  padding:'12px', borderRadius:14,
                  border:'1px solid '+t.divider, background:'transparent',
                  color:t.fgMuted, cursor:'pointer',
                  fontFamily:t.fonts.body, fontWeight:600, fontSize:13,
                }}>
                  Continuar sin protección
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'psicologia' && psychUnlocked && (
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

      {/* Pain detail sheet */}
      {painSheetArea && (() => {
        const entry = bodyAreas[painSheetArea] || { level: 0, type: 'exercise' };
        return (
          <div style={{ position:'absolute', inset:0, zIndex:96, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-end' }}
            onClick={() => setPainSheetArea(null)}>
            <div onClick={e => e.stopPropagation()} style={{ width:'100%', background:t.bg, borderRadius:'22px 22px 0 0', padding:'22px 20px 40px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <div style={{ fontFamily:t.fonts.display, fontWeight:700, fontSize:20, color:t.fg }}>{painSheetArea}</div>
                <button onClick={() => setPainSheetArea(null)} style={{ width:34, height:34, borderRadius:'50%', border:'none', background:t.surface, color:t.fg, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
              </div>

              {/* Intensity */}
              <div style={{ fontFamily:t.fonts.mono, fontSize:10, fontWeight:700, letterSpacing:'0.14em', color:t.fgFaint, textTransform:'uppercase', marginBottom:8 }}>Intensidad</div>
              <div style={{ display:'flex', gap:8, marginBottom:20 }}>
                {PAIN_LEVELS.slice(1).map(p => {
                  const on = entry.level === p.v;
                  return (
                    <button key={p.v} onClick={() => setPain(painSheetArea, p.v, entry.type)} style={{
                      flex:1, padding:'12px 6px', borderRadius:12, cursor:'pointer',
                      border:`1px solid ${on ? p.color : t.border}`,
                      background: on ? p.color + '22' : t.surface,
                      color: on ? p.color : t.fgMuted,
                      fontFamily:t.fonts.body, fontWeight: on ? 700 : 500, fontSize:14,
                    }}>{p.label}</button>
                  );
                })}
              </div>

              {/* Type */}
              <div style={{ fontFamily:t.fonts.mono, fontSize:10, fontWeight:700, letterSpacing:'0.14em', color:t.fgFaint, textTransform:'uppercase', marginBottom:8 }}>Tipo de dolor</div>
              <div style={{ display:'flex', gap:8, marginBottom:22 }}>
                {PAIN_TYPES.map(pt => {
                  const on = entry.type === pt.id && entry.level > 0;
                  return (
                    <button key={pt.id} onClick={() => setPain(painSheetArea, entry.level || 1, pt.id)} style={{
                      flex:1, padding:'14px 10px', borderRadius:14, cursor:'pointer', textAlign:'left',
                      border:`1.5px solid ${on ? pt.color : t.border}`,
                      background: on ? pt.color + '18' : t.surface,
                    }}>
                      <div style={{ fontFamily:t.fonts.body, fontWeight:700, fontSize:14, color: on ? pt.color : t.fg }}>{pt.label}</div>
                      <div style={{ fontFamily:t.fonts.body, fontSize:11, color:t.fgMuted, marginTop:2 }}>{pt.sub}</div>
                    </button>
                  );
                })}
              </div>

              {entry.level > 0 && (
                <button onClick={() => { setPain(painSheetArea, 0); setPainSheetArea(null); }} style={{
                  width:'100%', padding:'12px', borderRadius:14, border:`1px solid ${t.divider}`,
                  background:'transparent', color:t.fgMuted, cursor:'pointer',
                  fontFamily:t.fonts.body, fontWeight:600, fontSize:13,
                }}>Quitar dolor de esta zona</button>
              )}
            </div>
          </div>
        );
      })()}

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
