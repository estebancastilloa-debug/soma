// Computes a daily readiness score (0-100) from all available signals.
// Uses a weighted AVERAGE of sub-scores (each 0-100) so the number stays
// realistic — one bad input can't crash the whole score.

const FATIGUE_SCORE = {
  great:   100,
  good:    85,
  ok:      70,
  tired:   52,
  drained: 34,
};
const FATIGUE_LABEL = {
  great: 'Excelente', good: 'Bien', ok: 'Normal', tired: 'Cansado', drained: 'Agotado',
};

export function computeReadiness({ healthData, fatigueId, mentalMood, painMap, rhrBaseline } = {}) {
  const comps = []; // { key, score, weight, detail }

  // Sleep (phone)
  const sleep = healthData?.sleepHours;
  if (sleep != null) {
    let s;
    if (sleep >= 7.5)      s = 100;
    else if (sleep >= 7)   s = 92;
    else if (sleep >= 6)   s = 78;
    else if (sleep >= 5)   s = 58;
    else                   s = 38;
    if (sleep > 10)        s = 85; // oversleeping, slight
    comps.push({ key: 'Sueño', score: s, weight: 0.30, detail: `${sleep} h` });
  }

  // Fatigue (self-report)
  if (fatigueId && FATIGUE_SCORE[fatigueId] != null) {
    comps.push({ key: 'Cansancio', score: FATIGUE_SCORE[fatigueId], weight: 0.25, detail: FATIGUE_LABEL[fatigueId] });
  }

  // Pain (body areas; values may be weighted for injury)
  if (painMap && Object.keys(painMap).length) {
    const sum = Object.values(painMap).reduce((s, v) => s + (v || 0), 0);
    const s = Math.max(25, 100 - sum * 8);
    const count = Object.values(painMap).filter(v => v > 0).length;
    comps.push({ key: 'Dolor', score: Math.round(s), weight: 0.20, detail: `${count} zona${count !== 1 ? 's' : ''}` });
  }

  // Mental mood (0-4)
  if (mentalMood != null) {
    const s = 40 + mentalMood * 15; // 0→40 … 4→100
    comps.push({ key: 'Ánimo', score: s, weight: 0.15, detail: `${mentalMood + 1}/5` });
  }

  // Resting heart rate (phone) — needs baseline to judge; otherwise light/neutral
  if (healthData?.rhr) {
    if (rhrBaseline) {
      const diff = healthData.rhr - rhrBaseline;
      let s = 100 - Math.max(0, diff) * 4;
      s = Math.max(40, Math.min(100, s));
      comps.push({ key: 'FC reposo', score: Math.round(s), weight: 0.10, detail: `${healthData.rhr} bpm` });
    } else {
      comps.push({ key: 'FC reposo', score: 85, weight: 0.05, detail: `${healthData.rhr} bpm` });
    }
  }

  if (!comps.length) return null;

  const totalW = comps.reduce((s, c) => s + c.weight, 0);
  const score = Math.max(0, Math.min(100, Math.round(comps.reduce((s, c) => s + c.score * c.weight, 0) / totalW)));

  let label, color;
  if (score >= 80)      { label = 'Listo';      color = '#34C759'; }
  else if (score >= 60) { label = 'Moderado';   color = '#42C5F5'; }
  else if (score >= 40) { label = 'Precaución'; color = '#F59E0B'; }
  else                  { label = 'Descansa';   color = '#DC2626'; }

  // biggest drag = lowest-scoring component
  const weakest = comps.slice().sort((a, b) => a.score - b.score)[0];

  return { score, label, color, components: comps, weakest };
}

// Human recommendation for a given score
export function readinessAdvice(score) {
  if (score >= 80) return 'Estás listo para entrenar fuerte. Aprovecha el día: puedes empujar intensidad o buscar un PR.';
  if (score >= 60) return 'Buen día para entrenar normal. Escucha tu cuerpo y ajusta si algo se siente mal.';
  if (score >= 40) return 'Energía moderada. Considera bajar la intensidad o el volumen, y enfócate en técnica.';
  return 'Tu cuerpo pide recuperación. Prioriza movilidad, caminata ligera, comida e hidratación, y duerme bien hoy.';
}

// Read today's self-report signals from localStorage
export function loadTodaySignals() {
  const today = new Date().toISOString().slice(0, 10);
  let fatigueId = null, painMap = {};
  try { fatigueId = JSON.parse(localStorage.getItem('soma_phys_mood') || '{}')[today] || null; } catch {}
  try {
    const raw = JSON.parse(localStorage.getItem('soma_body_areas') || '{}')[today];
    if (Array.isArray(raw)) {
      raw.forEach(a => { painMap[a] = 2; });
    } else if (raw && typeof raw === 'object') {
      Object.entries(raw).forEach(([a, v]) => {
        if (typeof v === 'number') painMap[a] = v;
        else if (v && typeof v === 'object' && v.level) painMap[a] = v.type === 'injury' ? v.level * 1.6 : v.level;
      });
    }
  } catch {}
  return { fatigueId, painMap };
}
