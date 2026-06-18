// Computes a daily readiness score (0-100) from all available signals.
// Inputs are optional; the score is based on whatever data exists.

const FATIGUE_PENALTY = {
  great:   0,
  good:    8,
  ok:      18,
  tired:   30,
  drained: 45,
};

// Returns { score, label, color, parts } or null if there's not enough data
export function computeReadiness({ healthData, fatigueId, mentalMood, painMap } = {}) {
  let score = 100;
  const parts = [];
  let signals = 0;

  // Sleep (phone) — ideal 7.5-9h
  const sleep = healthData?.sleepHours;
  if (sleep != null) {
    signals++;
    let pen = 0;
    if (sleep < 5)      pen = 30;
    else if (sleep < 6) pen = 20;
    else if (sleep < 7) pen = 10;
    else if (sleep > 9.5) pen = 5;
    score -= pen;
    parts.push({ key: 'Sueño', detail: `${sleep}h`, penalty: pen });
  }

  // Fatigue (self-report)
  if (fatigueId && FATIGUE_PENALTY[fatigueId] != null) {
    signals++;
    const pen = FATIGUE_PENALTY[fatigueId];
    score -= pen;
    parts.push({ key: 'Cansancio', detail: fatigueId, penalty: pen });
  }

  // Pain (body areas with intensity 1-3)
  if (painMap && Object.keys(painMap).length) {
    signals++;
    const sum = Object.values(painMap).reduce((s, v) => s + (v || 0), 0);
    const pen = Math.min(35, sum * 6); // each intensity point ~6, capped
    score -= pen;
    const count = Object.values(painMap).filter(v => v > 0).length;
    parts.push({ key: 'Dolor', detail: `${count} zona${count !== 1 ? 's' : ''}`, penalty: pen });
  }

  // Mental mood (0-4, higher better)
  if (mentalMood != null) {
    signals++;
    const pen = Math.max(0, (2 - mentalMood)) * 6; // below "ok" costs points
    score -= pen;
    parts.push({ key: 'Ánimo', detail: `${mentalMood + 1}/5`, penalty: pen });
  }

  if (signals === 0) return null;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label, color;
  if (score >= 80)      { label = 'Listo';      color = '#34C759'; }
  else if (score >= 60) { label = 'Moderado';   color = '#42C5F5'; }
  else if (score >= 40) { label = 'Precaución'; color = '#F59E0B'; }
  else                  { label = 'Descansa';   color = '#DC2626'; }

  return { score, label, color, parts, signals };
}

// Read today's self-report signals from localStorage
export function loadTodaySignals() {
  const today = new Date().toISOString().slice(0, 10);
  let fatigueId = null, painMap = {};
  try { fatigueId = JSON.parse(localStorage.getItem('soma_phys_mood') || '{}')[today] || null; } catch {}
  try {
    const raw = JSON.parse(localStorage.getItem('soma_body_areas') || '{}')[today];
    if (Array.isArray(raw)) {
      raw.forEach(a => { painMap[a] = 2; }); // legacy
    } else if (raw && typeof raw === 'object') {
      Object.entries(raw).forEach(([a, v]) => {
        if (typeof v === 'number') painMap[a] = v;
        else if (v && typeof v === 'object' && v.level) painMap[a] = v.type === 'injury' ? v.level * 1.6 : v.level;
      });
    }
  } catch {}
  return { fatigueId, painMap };
}
