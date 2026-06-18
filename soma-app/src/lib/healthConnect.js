import { Capacitor } from '@capacitor/core';
import { HealthConnect } from '@devmaxime/capacitor-health-connect';

// Records we read directly + aggregates we compute
const READ_TYPES  = ['Steps', 'Weight', 'SleepSession', 'RestingHeartRate', 'ActivitySession'];
const WRITE_TYPES = [];

// Common Health Connect exercise type codes → label (subset)
const EXERCISE_LABELS = {
  56: 'Carrera', 57: 'Carrera (cinta)', 79: 'Caminata', 8: 'Bici', 9: 'Bici estática',
  82: 'Remo', 83: 'Remo (máquina)', 66: 'Natación', 67: 'Natación (piscina)',
  37: 'Functional / HIIT', 36: 'Entrenamiento de fuerza', 70: 'Fuerza',
  13: 'Calistenia', 25: 'Elíptica', 48: 'Senderismo', 97: 'Yoga', 100: 'Pilates',
  2: 'Bádminton', 64: 'Fútbol', 11: 'Boxeo', 31: 'Escalada',
};

function isNative() {
  return Capacitor.isNativePlatform();
}

// 'Available' | 'NotInstalled' | 'NotSupported' | 'unavailable'
export async function checkAvailability() {
  if (!isNative()) return 'unavailable';
  try {
    const { availability } = await HealthConnect.checkAvailability();
    return availability || 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export async function requestPermissions() {
  if (!isNative()) return false;
  try {
    const res = await HealthConnect.requestPermissions({ read: READ_TYPES, write: WRITE_TYPES });
    return (res?.read?.length || 0) > 0;
  } catch {
    return false;
  }
}

// Verbose variant for diagnostics: returns { granted, granted_count, availability, error }
export async function requestPermissionsVerbose() {
  if (!isNative()) return { granted: false, availability: 'web', error: 'No es plataforma nativa' };
  let availability = 'unknown';
  try {
    const a = await HealthConnect.checkAvailability();
    availability = a?.availability || 'unknown';
  } catch (e) {
    availability = 'check-failed';
  }
  try {
    const res = await HealthConnect.requestPermissions({ read: READ_TYPES, write: WRITE_TYPES });
    const count = res?.read?.length || 0;
    return { granted: count > 0, granted_count: count, availability, error: null };
  } catch (e) {
    return { granted: false, granted_count: 0, availability, error: (e && (e.message || String(e))) || 'error desconocido' };
  }
}

export async function getGrantedPermissions() {
  if (!isNative()) return [];
  try {
    const res = await HealthConnect.getGrantedPermissions();
    return res?.read || [];
  } catch {
    return [];
  }
}

function iso(d) { return d.toISOString(); }

// Returns today's health summary: { rhr, sleepHours, steps, calories, weight, heartRate }
export async function getTodayHealthData() {
  if (!isNative()) return null;

  const now   = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end   = new Date(now);
  const yesterday = new Date(start); yesterday.setDate(start.getDate() - 1);

  const results = {};

  // Resting heart rate (read records)
  try {
    const { records } = await HealthConnect.readRecords({
      start: iso(yesterday), end: iso(end), type: 'RestingHeartRate',
    });
    if (records?.length) {
      const last = records[records.length - 1];
      const bpm = last.beatsPerMinute ?? last.bpm;
      if (bpm) results.rhr = Math.round(bpm);
    }
  } catch {}

  // Weight (read records)
  try {
    const { records } = await HealthConnect.readRecords({
      start: iso(yesterday), end: iso(end), type: 'Weight',
    });
    if (records?.length) {
      const last = records[records.length - 1];
      const kg = last.weight?.value ?? last.weight?.inKilograms ?? last.weight;
      if (kg) results.weight = Math.round(kg * 10) / 10;
    }
  } catch {}

  // Sleep (read records → sum durations of last night)
  try {
    const sleepStart = new Date(yesterday); sleepStart.setHours(18, 0, 0, 0);
    const { records } = await HealthConnect.readRecords({
      start: iso(sleepStart), end: iso(end), type: 'SleepSession',
    });
    if (records?.length) {
      const totalMs = records.reduce((s, r) => s + (new Date(r.endTime) - new Date(r.startTime)), 0);
      results.sleepHours = Math.round((totalMs / 3_600_000) * 10) / 10;
    }
  } catch {}

  // Steps (aggregate for the day)
  try {
    const { aggregates } = await HealthConnect.aggregateRecords({
      start: iso(start), end: iso(end), type: 'Steps', groupBy: 'day',
    });
    if (aggregates?.length) {
      results.steps = Math.round(aggregates.reduce((s, a) => s + (a.value || 0), 0));
    }
  } catch {}

  // Active calories (aggregate for the day)
  try {
    const { aggregates } = await HealthConnect.aggregateRecords({
      start: iso(start), end: iso(end), type: 'ActiveCaloriesBurned', groupBy: 'day',
    });
    if (aggregates?.length) {
      results.calories = Math.round(aggregates.reduce((s, a) => s + (a.value || 0), 0));
    }
  } catch {}

  // Average heart rate (aggregate for the day)
  try {
    const { aggregates } = await HealthConnect.aggregateRecords({
      start: iso(start), end: iso(end), type: 'HeartRate', groupBy: 'day',
    });
    if (aggregates?.length) {
      const vals = aggregates.map(a => a.value).filter(Boolean);
      if (vals.length) results.heartRate = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
    }
  } catch {}

  return Object.keys(results).length ? results : null;
}

// Recent exercise sessions logged on the phone (last `days` days)
// Returns [{ date, title, durationMin, type }]
export async function getRecentActivity(days = 21) {
  if (!isNative()) return [];
  const end = new Date();
  const start = new Date(); start.setDate(start.getDate() - days); start.setHours(0, 0, 0, 0);
  try {
    const { records } = await HealthConnect.readRecords({
      start: iso(start), end: iso(end), type: 'ActivitySession',
    });
    if (!records?.length) return [];
    return records.map(r => {
      const s = new Date(r.startTime), e = new Date(r.endTime);
      const durationMin = Math.max(1, Math.round((e - s) / 60000));
      const typeCode = r.exerciseType ?? r.activityType;
      const label = r.title || EXERCISE_LABELS[typeCode] || 'Actividad';
      return { date: s.toISOString().slice(0, 10), title: label, durationMin, type: typeCode };
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}
