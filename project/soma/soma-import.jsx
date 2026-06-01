// SOMA — NotebookLM program importer · parsing engine.
// Pure logic + a realistic sample. No React here.
//
// parseProgram(rawText) → {
//   days: [{ id, name, focus, date, blocks: [Block] }],
//   stats: { days, blocks, movements, scored },
//   warnings: [ "string", ... ]
// }
// Block = { type, title, score, scheme, timeCap, rounds, movements:[Move], notes:[] }
// Move  = { raw, name, reps, load, cat, equip, measures:[ {key,label} ] }

// ── Sample paste (NotebookLM-style weekly export) ──────────────────
const SAMPLE_PROGRAM = `SEMANA 14 · CrossFit RX — Esteban Castillo

LUNES — Fuerza + Metcon corto
Calentamiento
3 rondas:
- 10 air squats
- 10 band pull-aparts
- 30s plancha
Fuerza
Back Squat 5x5 @ 75%
Descanso 2 min entre series
MetCon "Fran" (For Time)
21-15-9
- Thrusters (43/30 kg)
- Pull-ups
Time cap: 8 min
Accesorio
3x12 GHD sit-ups
3x15 back extensions

MARTES — Gimnasia + Aeróbico
Calentamiento
2 rondas: 250m row, 10 PVC pass-through
Skill
EMOM 10 min: 3-5 strict muscle-ups
MetCon (AMRAP 18 min)
- 400m run
- 15 wall balls (9/6 kg)
- 12 toes-to-bar
Enfriamiento
5 min bici suave

MIÉRCOLES — Halterofilia
Fuerza
Power Clean — build to a heavy single
Snatch 4x3 @ 70%
MetCon (3 RFT)
- 9 hang power cleans (60/42.5 kg)
- 12 box jumps (60/50 cm)
- 15 double-unders

JUEVES — Descanso activo
Movilidad
20 min flujo de cadera + zona torácica
Aeróbico Z2
30 min bici @ Zona 2

VIERNES — Test
Fuerza
Back Squat 1RM
MetCon "Helen" (3 RFT)
- 400m run
- 21 kettlebell swings (24/16 kg)
- 12 pull-ups
Time cap: 14 min`;

// ── Movement dictionary ────────────────────────────────────────────
// [matcher, category, equipment-icon]
const MOVE_DB = [
  [/thruster/i, 'barbell', 'IconBarbell'],
  [/(back|front|overhead|air)?\s*squat|sentadilla/i, 'barbell', 'IconBarbell'],
  [/deadlift|peso muerto/i, 'barbell', 'IconBarbell'],
  [/(power|hang|squat)?\s*clean|cargada/i, 'barbell', 'IconBarbell'],
  [/snatch|arranque/i, 'barbell', 'IconBarbell'],
  [/(push |strict )?press|jerk|envión|envion/i, 'barbell', 'IconBarbell'],
  [/bench|press de banca/i, 'barbell', 'IconBench'],
  [/kettlebell|kb swing|swing|goblet/i, 'kettlebell', 'IconKettlebell'],
  [/wall ?ball/i, 'medball', 'IconMedBall'],
  [/muscle.?up/i, 'gym', 'IconRings'],
  [/pull.?up|dominada/i, 'gym', 'IconPullupBar'],
  [/toes.?to.?bar|t2b/i, 'gym', 'IconPullupBar'],
  [/(handstand|hand stand|hspu)|pino/i, 'gym', 'IconBodyweight'],
  [/push.?up|lagartija|flexion/i, 'gym', 'IconBodyweight'],
  [/burpee/i, 'gym', 'IconBodyweight'],
  [/box jump|salto al caj|step.?up/i, 'gym', 'IconPlyoBox'],
  [/sit.?up|abdominal|ghd|hollow|plancha|plank/i, 'gym', 'IconBodyweight'],
  [/lunge|zancada/i, 'gym', 'IconBodyweight'],
  [/back ?extension|extensi[oó]n/i, 'gym', 'IconStretch'],
  [/air squat/i, 'gym', 'IconBodyweight'],
  [/band|liga/i, 'gym', 'IconBands'],
  [/double.?under|comba|cuerda/i, 'mono', 'IconJumpRope'],
  [/row|remo/i, 'mono', 'IconRower'],
  [/run|correr|carrera|trote/i, 'mono', 'IconRun'],
  [/bike|bici|assault|echo|air ?bike/i, 'mono', 'IconBike'],
  [/pvc|pass.?through|movilidad|flujo|cadera|tor[aá]cica/i, 'mono', 'IconStretch'],
];

// Measures tracked per category — "todo lo que queremos medir".
const MEASURES = {
  barbell: [
    { key: 'load',  label: 'Carga (kg)' },
    { key: 'reps',  label: 'Reps' },
    { key: 'rpe',   label: 'RPE' },
    { key: 'pct1rm',label: '% 1RM' },
  ],
  kettlebell: [
    { key: 'load', label: 'Carga (kg)' },
    { key: 'reps', label: 'Reps' },
    { key: 'rpe',  label: 'RPE' },
  ],
  medball: [
    { key: 'load',   label: 'Carga (kg)' },
    { key: 'reps',   label: 'Reps' },
    { key: 'target', label: 'Altura objetivo' },
  ],
  gym: [
    { key: 'reps',    label: 'Reps' },
    { key: 'scaling', label: 'RX / Escalado' },
    { key: 'quality', label: 'Calidad' },
  ],
  mono: [
    { key: 'distance', label: 'Distancia / Cals' },
    { key: 'time',     label: 'Tiempo / Pace' },
    { key: 'hr',       label: 'FC media' },
  ],
};

const CAT_LABEL = {
  barbell: 'Halterofilia',
  kettlebell: 'Kettlebell',
  medball: 'Balón',
  gym: 'Gimnasia',
  mono: 'Monoestructural',
};

function classifyMove(name) {
  for (const [re, cat, equip] of MOVE_DB) {
    if (re.test(name)) return { cat, equip };
  }
  return { cat: 'gym', equip: 'IconBodyweight' };
}

// ── Block-type detection ────────────────────────────────────────────
const BLOCK_TYPES = [
  { type: 'warmup',    re: /^(calentamiento|warm.?up|movilidad|activaci[oó]n)/i,   label: 'Calentamiento' },
  { type: 'skill',     re: /^(skill|t[eé]cnica|pr[aá]ctica|gimnasia)/i,            label: 'Skill' },
  { type: 'strength',  re: /^(fuerza|strength|halterofilia|levantamiento)/i,        label: 'Fuerza' },
  { type: 'wod',       re: /^(met.?con|wod|conditioning|condicionamiento|aer[oó]bico)/i, label: 'MetCon' },
  { type: 'accessory', re: /^(accesorio|accessory|complementario|bodybuilding)/i,   label: 'Accesorio' },
  { type: 'cooldown',  re: /^(enfriamiento|cool.?down|estiramiento)/i,              label: 'Enfriamiento' },
];

function detectBlock(line) {
  for (const b of BLOCK_TYPES) {
    if (b.re.test(line)) return b;
  }
  return null;
}

// ── Day-header detection ────────────────────────────────────────────
const DAY_RE = /^(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|monday|tuesday|wednesday|thursday|friday|saturday|sunday|d[ií]a\s*\d+|day\s*\d+)\b/i;
const DAY_ABBR = {
  lunes: 'LUN', martes: 'MAR', 'miércoles': 'MIÉ', 'miercoles': 'MIÉ',
  jueves: 'JUE', viernes: 'VIE', 'sábado': 'SÁB', sabado: 'SÁB', domingo: 'DOM',
  monday: 'MON', tuesday: 'TUE', wednesday: 'WED', thursday: 'THU',
  friday: 'FRI', saturday: 'SAT', sunday: 'SUN',
};

function dayAbbr(name) {
  const w = name.toLowerCase().split(/[\s—–-]/)[0];
  return DAY_ABBR[w] || name.slice(0, 3).toUpperCase();
}

// ── Score-type detection ────────────────────────────────────────────
function detectScore(text) {
  const s = text.toLowerCase();
  if (/amrap/.test(s))                  return { key: 'amrap', label: 'AMRAP', result: 'Rondas + reps' };
  if (/emom/.test(s))                   return { key: 'emom',  label: 'EMOM',  result: 'Reps por minuto' };
  if (/tabata/.test(s))                 return { key: 'tabata',label: 'Tabata',result: 'Reps mín.' };
  if (/for time|por tiempo|rft|rounds for time/.test(s))
                                        return { key: 'fortime', label: 'For Time', result: 'Tiempo' };
  if (/1\s?rm|build to|heavy single|max(?!.?reps)/.test(s))
                                        return { key: 'load', label: 'Carga máx.', result: 'Carga (kg)' };
  if (/max.?reps|amreps/.test(s))       return { key: 'maxreps', label: 'Max reps', result: 'Reps totales' };
  return null;
}

// ── Field extraction helpers ────────────────────────────────────────
function extractRounds(text) {
  let m = text.match(/(\d+)\s*(?:rft|rondas?|rounds?)/i);
  if (m) return m[1] + ' rondas';
  m = text.match(/amrap\s*(\d+)\s*(?:min|')/i);
  if (m) return 'AMRAP ' + m[1] + ' min';
  m = text.match(/emom\s*(\d+)/i);
  if (m) return 'EMOM ' + m[1] + ' min';
  return null;
}

function extractScheme(text) {
  // e.g. 21-15-9, 5x5, 5-5-3-3-1, 4x3
  let m = text.match(/\b(\d+(?:\s*[-–]\s*\d+){1,})\b/);
  if (m && /[-–]/.test(m[1])) return m[1].replace(/\s/g, '');
  m = text.match(/\b(\d+\s*x\s*\d+)\b/i);
  if (m) return m[1].replace(/\s/g, '').toLowerCase();
  return null;
}

function extractTimeCap(text) {
  const m = text.match(/(?:time ?cap|cap)[:\s]*(\d+)\s*(?:min|')/i);
  return m ? m[1] + ' min' : null;
}

// Parse a single movement line into structured data.
function parseMove(line) {
  let raw = line.replace(/^[\s•\-*·–]+/, '').trim();
  if (!raw) return null;

  // Load: (43/30 kg) | (95/65 lb) | 60kg | @ 75% | (60/50 cm)
  let load = null;
  let lm = raw.match(/\((\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*(kg|lb|cm|m)?\)/i);
  if (lm) {
    load = { rx: lm[1], scaled: lm[2], unit: (lm[3] || 'kg').toLowerCase() };
    raw = raw.replace(lm[0], '').trim();
  } else {
    let pm = raw.match(/@\s*(\d+)\s*%/);
    if (pm) { load = { pct: pm[1] }; raw = raw.replace(pm[0], '').trim(); }
    else {
      let sm = raw.match(/\(?(\d+(?:\.\d+)?)\s*(kg|lb)\)?/i);
      if (sm) { load = { single: sm[1], unit: sm[2].toLowerCase() }; raw = raw.replace(sm[0], '').trim(); }
    }
  }

  // Reps: leading number, or xN, or distance (400m), or time (30s)
  let reps = null;
  let dm = raw.match(/^(\d+\s*(?:m|km|cal|cals|s|min))\b/i);
  if (dm) { reps = dm[1].replace(/\s/g, ''); raw = raw.slice(dm[0].length).trim(); }
  else {
    let rm = raw.match(/^(\d+)\s+/);
    if (rm) { reps = rm[1]; raw = raw.slice(rm[0].length).trim(); }
    else {
      let xm = raw.match(/x\s*(\d+)\b/i);
      if (xm) { reps = xm[1]; raw = raw.replace(xm[0], '').trim(); }
    }
  }

  raw = raw.replace(/^[—–\-:\s]+|[—–\-:\s]+$/g, '').trim();
  if (!raw) return null;

  const { cat, equip } = classifyMove(raw);
  return {
    raw: line.trim(), name: raw, reps, load, cat, equip,
    measures: MEASURES[cat] || MEASURES.gym,
  };
}

// Decide whether a content line is a movement vs a note/scheme.
function looksLikeMove(line) {
  const s = line.trim();
  if (!s) return false;
  if (/^[•\-*·–]/.test(s)) return true;               // bullet
  if (/^\d+\s*[-–]\s*\d+/.test(s)) return false;       // rep scheme 21-15-9
  if (/^\d+\s*x\s*\d+/i.test(s)) return true;          // 3x12 ...
  if (/^\d+\s+\S/.test(s)) return true;                // "10 air squats"
  if (/descanso|rest|entre series|@ ?zona|z2|suave/i.test(s)) return false;
  return false;
}

// ── Main parser ─────────────────────────────────────────────────────
function parseProgram(raw) {
  const lines = (raw || '').split(/\r?\n/);
  const days = [];
  const warnings = [];
  let day = null, block = null, weekTitle = null;

  const closeBlock = () => {
    if (!block) return;
    const body = block._lines.join('\n');
    block.score   = detectScore(block.title + '\n' + body);
    block.rounds  = extractRounds(block.title + '\n' + body);
    block.scheme  = extractScheme(body) || extractScheme(block.title);
    block.timeCap = extractTimeCap(body);
    block.movements = [];
    block.notes = [];
    for (const l of block._lines) {
      if (looksLikeMove(l)) {
        const mv = parseMove(l);
        if (mv) block.movements.push(mv);
      } else if (l.trim() && !/^\d+\s*[-–]\s*\d+/.test(l.trim())) {
        block.notes.push(l.trim());
      }
    }
    delete block._lines;
    block = null;
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Week title (first all-caps-ish line with SEMANA / WEEK / · )
    if (!day && !weekTitle && /semana|week/i.test(line)) { weekTitle = line; continue; }

    // Day header
    if (DAY_RE.test(line)) {
      closeBlock();
      const m = line.match(DAY_RE);
      const dname = m[0];
      const rest = line.slice(m[0].length).replace(/^[\s—–\-:]+/, '').trim();
      day = { id: 'd' + (days.length + 1), name: dname, abbr: dayAbbr(dname),
        focus: rest || null, blocks: [] };
      days.push(day);
      continue;
    }

    // Block header
    const bt = detectBlock(line);
    if (bt && day) {
      closeBlock();
      // title may carry inline content e.g. 'MetCon "Fran" (For Time)'
      block = { type: bt.type, typeLabel: bt.label, title: line, _lines: [] };
      day.blocks.push(block);
      continue;
    }

    // Content
    if (block) { block._lines.push(line); }
    else if (day) {
      // orphan content before any block → make an implicit block
      block = { type: 'wod', typeLabel: 'Bloque', title: 'Bloque', _lines: [line] };
      day.blocks.push(block);
    }
  }
  closeBlock();

  // Warnings
  days.forEach(d => {
    if (!d.blocks.length) warnings.push(`"${d.name}" no tiene bloques detectados`);
    d.blocks.forEach(b => {
      if (b.type === 'wod' && !b.score)
        warnings.push(`${d.abbr} · ${b.typeLabel}: no se detectó tipo de resultado`);
    });
  });

  const stats = {
    days: days.length,
    blocks: days.reduce((n, d) => n + d.blocks.length, 0),
    movements: days.reduce((n, d) => n + d.blocks.reduce((m, b) => m + (b.movements ? b.movements.length : 0), 0), 0),
    scored: days.reduce((n, d) => n + d.blocks.filter(b => b.score).length, 0),
  };

  return { weekTitle, days, stats, warnings };
}

Object.assign(window, {
  parseProgram, SAMPLE_PROGRAM, CAT_LABEL, MEASURES,
  BLOCK_TYPES, classifyMove,
});
