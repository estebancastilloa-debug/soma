import { L01,L02,L03,L04,L05,L06,L07,L08,L09,L10,L11,L12 } from '../marks.jsx';

export const LEVELS = [
  { id:1,  Mark:L01, name:'The Spark',            phase:'Foundation', summary:'You have ignited your journey.',             goal:'Start logging.',                               es:'Primer paso' },
  { id:2,  Mark:L02, name:'The Iron Novice',       phase:'Foundation', summary:'Establishing a routine.',                   goal:'Consistency.',                                 es:'Construyendo base' },
  { id:3,  Mark:L03, name:'The Consistent Crusader',phase:'Foundation',summary:'Out of the sickness zone.',                  goal:'Hit sleep + nutrition goals weekly.',           es:'Fuera de la zona enferma' },
  { id:4,  Mark:L04, name:'The Wellness Ranger',   phase:'Wellness',   summary:'Lifestyle habits are normalizing.',          goal:'Stop cherry-picking workouts.',                 es:'Hábitos estables' },
  { id:5,  Mark:L05, name:'The Functional Fighter', phase:'Wellness',  summary:'Solid foundation of mechanics + consistency.',goal:'Add intensity — increase load + speed.',       es:'Añadiendo intensidad' },
  { id:6,  Mark:L06, name:'The Balanced Beast',    phase:'Wellness',   summary:'Officially above average.',                  goal:'Eliminate red Imbalance flags.',               es:'Por encima del promedio' },
  { id:7,  Mark:L07, name:'The SOMA Spartan',      phase:'Fit',        summary:'Highly capable athlete.',                   goal:'Perform Rx, not scaled.',                      es:'Atleta capaz' },
  { id:8,  Mark:L08, name:'The Relentless Savage', phase:'Fit',        summary:'Vast work capacity.',                       goal:'Track precise macros + journal mood daily.',   es:'Capacidad vasta' },
  { id:9,  Mark:L09, name:'The Elite Operator',    phase:'Fit',        summary:'Elite efficiency.',                          goal:'Add complex skills (gymnastics, oly).',        es:'Eficiencia élite' },
  { id:10, Mark:L10, name:'The Juggernaut',         phase:'Pinnacle',   summary:'Top decile of human performance.',           goal:'Maintain recovery — sleep, HRV, RHR.',         es:'Top 10% humano' },
  { id:11, Mark:L11, name:'The Zenith',             phase:'Pinnacle',   summary:'Master of the holistic lifestyle.',          goal:'Lead — coach others.',                         es:'Maestro del estilo holístico' },
  { id:12, Mark:L12, name:'The SOMA Sovereign',    phase:'Pinnacle',   summary:'The absolute pinnacle.',                    goal:'Stay here. The ceiling is yourself.',          es:'El pináculo' },
];

export const PHASES = [
  { id:'Foundation', label:'The Foundation',   range:'L1 — L3', note:'Sickness to Baseline' },
  { id:'Wellness',   label:'The Wellness Zone', range:'L4 — L6', note:'General Physical Preparedness' },
  { id:'Fit',        label:'The Fit Zone',      range:'L7 — L9', note:'Advanced Athleticism' },
  { id:'Pinnacle',   label:'The Pinnacle',      range:'L10 — L12', note:'Top 10% Globally' },
];

export const LEVEL_RULES = [
  { id:'seed',       title:'Data Seed',         sub:'Unlock the system',  body:'Log a minimum of 2 valid workout results in all 8 fitness categories: Power Lifts, Olympic Lifts, Endurance, Speed, Bodyweight Metcons, Light Metcons, Heavy Metcons, Long Metcons.' },
  { id:'window',     title:'365-Day Window',     sub:'Decay rule',         body:'For any PR or habit to count, it must have happened in the last 365 days. Stop logging → your level decays. Biology is reversible.' },
  { id:'confidence', title:'Confidence Rating',  sub:'Green = level up',   body:'Red = data too sparse. Yellow = building history. Green = dense, consistent, verified. You only Level Up when your Rating is Green.' },
  { id:'imbalance',  title:'Imbalance Penalty',  sub:'Weakness cap',       body:'A Red Imbalance flag (major Δ between paired movements) caps you below Level 7. You must fix the weakness to progress past Spartan.' },
  { id:'rx',         title:'Mechanics → Consistency → Intensity', sub:'Rx unlocks the top', body:'Scaling is encouraged for safety. But heavily scaled workouts cap your maximum percentile. Eventually you must perform Rx to reach the Pinnacle.' },
];

export const LEVEL_PILLARS = [
  { id:'output',   title:'Fitness & Output',         sub:'Stop cherry-picking',        body:'Attack weaknesses across all 8 fitness dimensions. If you only lift heavy but never run, the AI penalizes you.' },
  { id:'fuel',     title:'Nutrition & Fueling',       sub:"You can't out-train a bad input", body:'Log macros, calories, hydration. The AI cross-references this with workout performance.' },
  { id:'recovery', title:'Recovery, Sleep & Mobility',sub:'Strength happens here',       body:'8–10 hrs of sleep. Track RHR + HRV. Daily mobility for tissue capacity + joint centration.' },
  { id:'mind',     title:'Mental Health & Habits',    sub:'One-tap streaks',             body:'Build streaks on resilience habits. The AI adjusts recommendations from your Feel-Good and stress logs.' },
];
