// SOMA Level — 12 levels per the official Holistic Level Guide.
// Names + descriptions are user-provided (English original).
// Icons are an evolution of the F5 wave:
//   L1-3 (Foundation)  → dots → dashed → tiny line
//   L4-6 (Wellness)    → growing single continuous wave
//   L7-9 (Fit)         → 2 PARALLEL waves
//   L10-12 (Pinnacle)  → 2-3 INDEPENDENT waves crossing each other
// All live inside the same elliptical "O" — the SOMA letterform.

function LevelOval({ color, stroke = 8 }) {
  return (<ellipse cx="40" cy="40" rx="32" ry="30"
    fill="none" stroke={color} strokeWidth={stroke} />);
}

// A single sine segment: amp = amplitude, freq = number of half-cycles across,
// y = vertical center, x0 / span = horizontal extent.
function wavePath({ amp, freq, y = 40, x0 = 16, span = 48 }) {
  const segLen = span / freq;
  let d = `M ${x0} ${y}`;
  for (let i = 0; i < freq; i++) {
    const up = i % 2 === 0;
    const cx = x0 + segLen * i + segLen / 2;
    const cy = up ? y - amp : y + amp;
    const ex = x0 + segLen * (i + 1);
    d += ` Q ${cx} ${cy} ${ex} ${y}`;
  }
  return d;
}

// Two crossing waves — second one phase-shifted by half a wavelength.
function wavePathShifted({ amp, freq, y = 40, x0 = 16, span = 48, phase = 0.5 }) {
  const segLen = span / freq;
  const startUp = phase < 0.5;
  let d = `M ${x0} ${y}`;
  for (let i = 0; i < freq; i++) {
    const up = startUp ? i % 2 === 0 : i % 2 !== 0;
    const cx = x0 + segLen * i + segLen / 2;
    const cy = up ? y - amp : y + amp;
    const ex = x0 + segLen * (i + 1);
    d += ` Q ${cx} ${cy} ${ex} ${y}`;
  }
  return d;
}

// ── L1-3 · Foundation ─────────────────────────────────────────────
// L1 Spark — one dot
function L01({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <circle cx="40" cy="40" r="3" fill={color}/>
  </g>);
}
// L2 Iron Novice — three dots in a row
function L02({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <circle cx="28" cy="40" r="2.4" fill={color}/>
    <circle cx="40" cy="40" r="2.4" fill={color}/>
    <circle cx="52" cy="40" r="2.4" fill={color}/>
  </g>);
}
// L3 Consistent Crusader — a flat dashed line (still becoming a wave)
function L03({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <line x1="14" y1="40" x2="66" y2="40" stroke={color} strokeWidth="3"
      strokeLinecap="round" strokeDasharray="4 4"/>
  </g>);
}

// ── L4-6 · Wellness ───────────────────────────────────────────────
// L4 Wellness Ranger — first true wave, small
function L04({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 3.5, freq: 2 })} fill="none"
      stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </g>);
}
// L5 Functional Fighter — same wave, more amplitude
function L05({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 6, freq: 2 })} fill="none"
      stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
  </g>);
}
// L6 Balanced Beast — full single wave, higher frequency
function L06({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 8, freq: 3 })} fill="none"
      stroke={color} strokeWidth="3.6" strokeLinecap="round"/>
  </g>);
}

// ── L7-9 · Fit — two PARALLEL waves ───────────────────────────────
// L7 SOMA Spartan — two parallel waves, modest amplitude
function L07({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 5, freq: 2, y: 34 })} fill="none"
      stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d={wavePath({ amp: 5, freq: 2, y: 46 })} fill="none"
      stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </g>);
}
// L8 Relentless Savage — parallel + amplitude
function L08({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 6.5, freq: 3, y: 33 })} fill="none"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"/>
    <path d={wavePath({ amp: 6.5, freq: 3, y: 47 })} fill="none"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"/>
  </g>);
}
// L9 Elite Operator — tight parallel, dense rhythm
function L09({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 7, freq: 4, y: 32 })} fill="none"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"/>
    <path d={wavePath({ amp: 7, freq: 4, y: 48 })} fill="none"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"/>
  </g>);
}

// ── L10-12 · Pinnacle — INDEPENDENT crossing waves ────────────────
// L10 Juggernaut — two waves crossing (opposite phase, same y)
function L10({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 7, freq: 3 })} fill="none"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"/>
    <path d={wavePathShifted({ amp: 7, freq: 3, phase: 0.7 })} fill="none"
      stroke={color} strokeWidth="3.2" strokeLinecap="round" opacity="0.85"/>
  </g>);
}
// L11 Zenith — three waves crossing
function L11({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 8, freq: 3, y: 36 })} fill="none"
      stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d={wavePathShifted({ amp: 8, freq: 3, y: 44, phase: 0.7 })} fill="none"
      stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d={wavePath({ amp: 5, freq: 5, y: 40 })} fill="none"
      stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity="0.7"/>
  </g>);
}
// L12 SOMA Sovereign — waves fill the oval, multi-frequency
function L12({ color, stroke = 8 }) { return (
  <g>
    <LevelOval color={color} stroke={stroke}/>
    <path d={wavePath({ amp: 9, freq: 3, y: 32 })} fill="none"
      stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
    <path d={wavePathShifted({ amp: 9, freq: 3, y: 48, phase: 0.7 })} fill="none"
      stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
    <path d={wavePath({ amp: 6, freq: 5, y: 40 })} fill="none"
      stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity="0.85"/>
    {/* spark */}
    <path d="M62 18 Q62.5 20 64 20.5 Q62.5 21 62 23 Q61.5 21 60 20.5 Q61.5 20 62 18 Z"
      fill={color} stroke="none"/>
  </g>);
}

// ── Level definitions (names + copy from the official guide) ──────
const LEVELS = [
  // Phase 1 — Foundation (Sickness to Baseline)
  { id: 1,  Mark: L01, name: 'The Spark',
    phase: 'Foundation',
    summary: 'You have ignited your journey.',
    detail: 'Right now, you are building the absolute basics. You may have missing data, inconsistent sleep, or physical imbalances, but you are showing up.',
    goal: 'Start logging.',
  },
  { id: 2,  Mark: L02, name: 'The Iron Novice',
    phase: 'Foundation',
    summary: 'Establishing a routine.',
    detail: 'You are learning the core movements and figuring out how to track your food and habits.',
    goal: 'Consistency.',
  },
  { id: 3,  Mark: L03, name: 'The Consistent Crusader',
    phase: 'Foundation',
    summary: 'Out of the sickness zone.',
    detail: 'You log your habits regularly and are building a base of strength and aerobic capacity.',
    goal: 'Hit your sleep + nutrition goals weekly.',
  },
  // Phase 2 — Wellness Zone
  { id: 4,  Mark: L04, name: 'The Wellness Ranger',
    phase: 'Wellness',
    summary: 'Lifestyle habits are normalizing.',
    detail: 'You are hitting your sleep goals, your nutrition is stable, and you are logging workouts across different modalities without cherry-picking.',
    goal: 'Stop cherry-picking workouts.',
  },
  { id: 5,  Mark: L05, name: 'The Functional Fighter',
    phase: 'Wellness',
    summary: 'Solid foundation of mechanics + consistency.',
    detail: 'You are starting to add true intensity to your workouts and your daily habit streaks are growing.',
    goal: 'Add intensity — increase load + speed.',
  },
  { id: 6,  Mark: L06, name: 'The Balanced Beast',
    phase: 'Wellness',
    summary: 'Officially above average.',
    detail: 'Your physical data shows symmetry between your upper and lower body, and your mobility work is keeping you injury-free.',
    goal: 'Eliminate red Imbalance flags.',
  },
  // Phase 3 — Fit Zone
  { id: 7,  Mark: L07, name: 'The SOMA Spartan',
    phase: 'Fit',
    summary: 'Highly capable athlete.',
    detail: 'You have no major red Imbalance flags in your profile, and you consistently perform workouts as prescribed (Rx).',
    goal: 'Perform Rx, not scaled.',
  },
  { id: 8,  Mark: L08, name: 'The Relentless Savage',
    phase: 'Fit',
    summary: 'Vast work capacity.',
    detail: 'Your work capacity across broad time and modal domains is vast. Your nutrition is dialed in with precise macros, and your mental logs reflect high resilience.',
    goal: 'Track precise macros + journal mood daily.',
  },
  { id: 9,  Mark: L09, name: 'The Elite Operator',
    phase: 'Fit',
    summary: 'Elite efficiency.',
    detail: 'Deep tissue capacity, flawless neuromuscular control, and raw mechanical power.',
    goal: 'Add complex skills (gymnastics, oly).',
  },
  // Phase 4 — Pinnacle
  { id: 10, Mark: L10, name: 'The Juggernaut',
    phase: 'Pinnacle',
    summary: 'Top decile of human performance.',
    detail: 'Your strength, endurance, and gymnastics skills are exceptional. Biological recovery markers are pristine.',
    goal: 'Maintain recovery — sleep, HRV, RHR.',
  },
  { id: 11, Mark: L11, name: 'The Zenith',
    phase: 'Pinnacle',
    summary: 'Master of the holistic lifestyle.',
    detail: 'You have effectively eliminated weaknesses and your body functions as a highly optimized, unified system.',
    goal: 'Lead — coach others.',
  },
  { id: 12, Mark: L12, name: 'The SOMA Sovereign',
    phase: 'Pinnacle',
    summary: 'The absolute pinnacle.',
    detail: 'The elite standard of strength, speed, stamina, mobility, mindset, and nutritional discipline.',
    goal: 'Stay here. The ceiling is yourself.',
  },
];

const PHASES = [
  { id: 'Foundation', label: 'The Foundation',  range: 'L1 — L3',
    note: 'Sickness to Baseline' },
  { id: 'Wellness',   label: 'The Wellness Zone', range: 'L4 — L6',
    note: 'General Physical Preparedness' },
  { id: 'Fit',        label: 'The Fit Zone',     range: 'L7 — L9',
    note: 'Advanced Athleticism' },
  { id: 'Pinnacle',   label: 'The Pinnacle',     range: 'L10 — L12',
    note: 'Top 10% Globally' },
];

// The 5 Core Rules of the system
const LEVEL_RULES = [
  { id: 'seed',     title: 'Data Seed',
    sub: 'Unlock the system',
    body: 'Log a minimum of 2 valid workout results in all 8 fitness categories: Power Lifts, Olympic Lifts, Endurance, Speed, Bodyweight Metcons, Light Metcons, Heavy Metcons, Long Metcons.',
  },
  { id: 'window',   title: '365-Day Window',
    sub: 'Decay rule',
    body: 'For any PR or habit to count, it must have happened in the last 365 days. Stop logging → your level decays. Biology is reversible.',
  },
  { id: 'confidence', title: 'Confidence Rating',
    sub: 'Green = level up',
    body: 'Red = data too sparse. Yellow = building history. Green = dense, consistent, verified. You only Level Up when your Rating is Green.',
  },
  { id: 'imbalance', title: 'Imbalance Penalty',
    sub: 'Weakness cap',
    body: 'A Red Imbalance flag (major Δ between paired movements) caps you below Level 7. You must fix the weakness to progress past Spartan.',
  },
  { id: 'rx',       title: 'Mechanics → Consistency → Intensity',
    sub: 'Rx unlocks the top',
    body: 'Scaling is encouraged for safety. But heavily scaled workouts cap your maximum percentile. Eventually you must perform Rx to reach the Pinnacle.',
  },
];

// The 4 Pillars of Progression
const LEVEL_PILLARS = [
  { id: 'output',   title: 'Fitness & Output',
    sub: 'Stop cherry-picking',
    body: 'Attack weaknesses across all 8 fitness dimensions. If you only lift heavy but never run, the AI penalizes you.',
  },
  { id: 'fuel',     title: 'Nutrition & Fueling',
    sub: 'You can\u2019t out-train a bad input',
    body: 'Log macros, calories, hydration. The AI cross-references this with workout performance.',
  },
  { id: 'recovery', title: 'Recovery, Sleep & Mobility',
    sub: 'Strength happens here',
    body: '8\u201310 hrs of sleep. Track RHR + HRV. Daily mobility for tissue capacity + joint centration.',
  },
  { id: 'mind',     title: 'Mental Health & Habits',
    sub: 'One-tap streaks',
    body: 'Build streaks on resilience habits. The AI adjusts recommendations from your Feel-Good and stress logs.',
  },
];

Object.assign(window, {
  L01, L02, L03, L04, L05, L06, L07, L08, L09, L10, L11, L12,
  LEVELS, PHASES, LEVEL_RULES, LEVEL_PILLARS,
});
