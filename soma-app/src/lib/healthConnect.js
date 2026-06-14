import { Capacitor } from '@capacitor/core';

// Lazy-load the plugin so the web build doesn't break
let HC = null;
async function getPlugin() {
  if (HC) return HC;
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const mod = await import('@devmaxime/capacitor-health-connect');
    HC = mod.HealthConnect;
    return HC;
  } catch {
    return null;
  }
}

const PERMISSIONS = [
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'RestingHeartRate' },
  { accessType: 'read', recordType: 'HeartRateVariabilitySdnn' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'Weight' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
];

export async function checkAvailability() {
  const hc = await getPlugin();
  if (!hc) return 'unavailable';
  try {
    const { availability } = await hc.checkAvailability();
    return availability; // 'Available' | 'NotInstalled' | 'NotSupported'
  } catch {
    return 'unavailable';
  }
}

export async function requestPermissions() {
  const hc = await getPlugin();
  if (!hc) return false;
  try {
    const result = await hc.requestHealthPermissions({ permissions: PERMISSIONS });
    return result.grantedPermissions?.length > 0;
  } catch {
    return false;
  }
}

// Returns today's health summary: { hrv, rhr, heartRate, sleepHours, steps, calories, weight }
export async function getTodayHealthData() {
  const hc = await getPlugin();
  if (!hc) return null;

  const now   = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end   = new Date(now);
  const yesterday = new Date(start); yesterday.setDate(start.getDate() - 1);

  function iso(d) { return d.toISOString(); }

  const results = {};

  try {
    const { records: hrvRecs } = await hc.readRecords({
      recordType: 'HeartRateVariabilitySdnn',
      timeRangeFilter: { type: 'between', startTime: iso(yesterday), endTime: iso(end) },
    });
    if (hrvRecs?.length) {
      results.hrv = Math.round(hrvRecs[hrvRecs.length - 1].heartRateVariabilityMillis);
    }
  } catch {}

  try {
    const { records: rhrRecs } = await hc.readRecords({
      recordType: 'RestingHeartRate',
      timeRangeFilter: { type: 'between', startTime: iso(yesterday), endTime: iso(end) },
    });
    if (rhrRecs?.length) {
      results.rhr = Math.round(rhrRecs[rhrRecs.length - 1].beatsPerMinute);
    }
  } catch {}

  try {
    const { records: hrRecs } = await hc.readRecords({
      recordType: 'HeartRate',
      timeRangeFilter: { type: 'between', startTime: iso(start), endTime: iso(end) },
    });
    if (hrRecs?.length) {
      const samples = hrRecs.flatMap(r => r.samples || []);
      if (samples.length) {
        results.heartRate = Math.round(samples.reduce((s, x) => s + x.beatsPerMinute, 0) / samples.length);
      }
    }
  } catch {}

  try {
    // Sleep: look at last night (yesterday 8pm → today 12pm)
    const sleepStart = new Date(yesterday); sleepStart.setHours(20, 0, 0, 0);
    const sleepEnd   = new Date(now);       sleepEnd.setHours(12, 0, 0, 0);
    const { records: sleepRecs } = await hc.readRecords({
      recordType: 'SleepSession',
      timeRangeFilter: { type: 'between', startTime: iso(sleepStart), endTime: iso(sleepEnd) },
    });
    if (sleepRecs?.length) {
      const totalMs = sleepRecs.reduce((s, r) => {
        const dur = new Date(r.endTime) - new Date(r.startTime);
        return s + dur;
      }, 0);
      results.sleepHours = Math.round((totalMs / 3_600_000) * 10) / 10;
    }
  } catch {}

  try {
    const { records: stepRecs } = await hc.readRecords({
      recordType: 'Steps',
      timeRangeFilter: { type: 'between', startTime: iso(start), endTime: iso(end) },
    });
    if (stepRecs?.length) {
      results.steps = stepRecs.reduce((s, r) => s + (r.count || 0), 0);
    }
  } catch {}

  try {
    const { records: calRecs } = await hc.readRecords({
      recordType: 'ActiveCaloriesBurned',
      timeRangeFilter: { type: 'between', startTime: iso(start), endTime: iso(end) },
    });
    if (calRecs?.length) {
      results.calories = Math.round(calRecs.reduce((s, r) => s + (r.energy?.inKilocalories || 0), 0));
    }
  } catch {}

  try {
    const { records: weightRecs } = await hc.readRecords({
      recordType: 'Weight',
      timeRangeFilter: { type: 'between', startTime: iso(yesterday), endTime: iso(end) },
    });
    if (weightRecs?.length) {
      results.weight = Math.round(weightRecs[weightRecs.length - 1].weight.inKilograms * 10) / 10;
    }
  } catch {}

  return Object.keys(results).length ? results : null;
}
