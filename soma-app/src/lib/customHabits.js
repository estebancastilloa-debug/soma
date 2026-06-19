import { HABITS } from '../data/habits.js';

const LS = 'soma_custom_habits';

export function loadCustomHabits() {
  try { return JSON.parse(localStorage.getItem(LS) || '[]'); } catch { return []; }
}
export function saveCustomHabits(v) {
  try { localStorage.setItem(LS, JSON.stringify(v)); } catch {}
}
export function getAllHabits() {
  return [...HABITS, ...loadCustomHabits()];
}
// Add a custom habit (idempotent). Returns the merged custom list.
export function addCustomHabit(h) {
  const cur = loadCustomHabits();
  if (cur.some(x => x.id === h.id) || HABITS.some(x => x.id === h.id)) return cur;
  const next = [...cur, h];
  saveCustomHabits(next);
  return next;
}
