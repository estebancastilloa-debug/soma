import { Capacitor } from '@capacitor/core';
import { HealthConnect } from '@devmaxime/capacitor-health-connect';

// Records we read directly + aggregates we compute
const READ_TYPES  = ['Steps', 'Weight', 'SleepSession', 'RestingHeartRate'];
const WRITE_TYPES = [];

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
