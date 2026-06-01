import { useState } from 'react';
import {
  ScreenFrame, StatusBar, PillarHeader,
  MonoLabel, SectionHead, Fab, MenuButton,
} from '../chrome.jsx';
import { F5 } from '../marks.jsx';
import {
  IconPlane, IconTimer, IconFlame, IconRun,
  IconDumbbellSmall, IconBolt, IconBalance, IconTarget,
  IconChevronRight,
} from '../icons.jsx';

// ─── Equipment options ────────────────────────────────────────────────
const EQUIPMENT = ['None', 'Resistance bands', 'Dumbbells', 'Full hotel gym'];

// ─── Travel workouts ─────────────────────────────────────────────────
const WORKOUTS = [
  {
    name: 'Hotel Room Hustle',
    type: 'AMRAP',
    time: '15 min',
    scheme: 'Burpees · Air squats · Push-ups · Lunges',
    detail: '5 / 15 / 10 / 10',
  },
  {
    name: 'Core & Carry',
    type: 'For Time',
    time: '~12 min',
    scheme: 'Plank holds · Hollow rocks · V-ups',
    detail: '60s / 20 / 15',
  },
  {
    name: 'Staircase Sprint',
    type: 'EMOM',
    time: '12 min',
    scheme: 'Stair runs + Push-ups',
    detail: '1 flight + 10 reps',
  },
];

// ─── Movement library ────────────────────────────────────────────────
const MOVEMENTS = [
  { name: 'Push-up',        cat: 'Upper',  color: '#E8854A' },
  { name: 'Air Squat',      cat: 'Lower',  color: '#4AAE8C' },
  { name: 'Burpee',         cat: 'Cardio', color: '#E84A4A' },
  { name: 'Hollow Rock',    cat: 'Core',   color: '#8C4AE8' },
  { name: 'Reverse Lunge',  cat: 'Lower',  color: '#4AAE8C' },
  { name: 'Pike Push-up',   cat: 'Upper',  color: '#E8854A' },
];

// ─── Type badge colors ────────────────────────────────────────────────
function typeBadgeStyle(type, trainColor) {
  const map = {
    'AMRAP':    { bg: trainColor,   fg: '#0A0908' },
    'For Time': { bg: '#E84A4A22', fg: '#E84A4A' },
    'EMOM':     { bg: '#4AAE8C22', fg: '#4AAE8C' },
  };
  return map[type] || { bg: '#88888822', fg: '#888' };
}

// ─── Workout card ─────────────────────────────────────────────────────
function WorkoutCard({ t, workout, isFirst }) {
  const badge = typeBadgeStyle(workout.type, t.pillar.train);
  return (
    <div style={{
      background: isFirst ? t.fg : t.surface,
      color: isFirst ? t.bg : t.fg,
      border: isFirst ? 'none' : `1px solid ${t.divider}`,
      borderRadius: 18,
      padding: '16px 16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {isFirst && (
        <div style={{ position: 'absolute', right: -14, bottom: -14, width: 100, height: 100,
          opacity: 0.06, pointerEvents: 'none' }}>
          <svg viewBox="0 0 80 80" width="100%" height="100%">
            <F5 color={t.bg} stroke={7}/>
          </svg>
        </div>
      )}

      {/* Type + time row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          background: badge.bg, color: badge.fg,
          padding: '3px 8px', borderRadius: 4,
        }}>
          {workout.type}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3,
          marginLeft: 'auto', opacity: 0.6 }}>
          <IconTimer size={12} stroke={2} color={isFirst ? t.bg : t.fgMuted}/>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
            color: isFirst ? t.bg : t.fgMuted, letterSpacing: '0.08em' }}>
            {workout.time}
          </span>
        </div>
      </div>

      {/* Name */}
      <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 19,
        letterSpacing: '-0.03em', lineHeight: 1.1,
        color: isFirst ? t.bg : t.fg }}>
        {workout.name}
      </div>

      {/* Movements */}
      <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
        color: isFirst ? t.bg + 'AA' : t.fgMuted, lineHeight: 1.4 }}>
        {workout.scheme}
      </div>

      {/* Rep scheme */}
      <div style={{ borderTop: `1px solid ${isFirst ? t.bg + '22' : t.divider}`,
        paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 11.5,
          color: isFirst ? t.pillar.train : t.pillar.train, letterSpacing: '-0.01em' }}>
          {workout.detail}
        </span>
        <IconChevronRight size={14} stroke={2} color={isFirst ? t.bg + '66' : t.fgFaint}/>
      </div>
    </div>
  );
}

// ─── Movement cell ────────────────────────────────────────────────────
function MovementCell({ t, movement }) {
  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.divider}`,
      borderRadius: 12,
      padding: '11px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: movement.color, flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12.5,
          color: t.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {movement.name}
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
          letterSpacing: '0.12em', color: t.fgFaint, textTransform: 'uppercase', marginTop: 1 }}>
          {movement.cat}
        </div>
      </div>
    </div>
  );
}

// ─── TravelScreen ─────────────────────────────────────────────────────
export function TravelScreen({ t, onNav, onMenu, onPlus }) {
  const [equipment, setEquipment] = useState('None');

  return (
    <ScreenFrame t={t} accentColor={t.pillar.train}>
      <StatusBar t={t}/>
      <PillarHeader
        t={t}
        title="Travel Mode"
        sub="Hotel · minimal equipment · anywhere"
        pillarColor={t.pillar.train}
        onMenu={onMenu}
      />

      {/* ── Scrollable body ── */}
      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* ── Hero section ── */}
        <div style={{ margin: '14px 20px 0', background: t.accent,
          borderRadius: 20, padding: '18px 18px 16px',
          position: 'relative', overflow: 'hidden' }}>

          <div style={{ position: 'absolute', right: -20, top: -20, width: 130, height: 130,
            opacity: t.mode === 'dark' ? 0.07 : 0.06, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.onAccent} stroke={6}/>
            </svg>
          </div>

          {/* Plane + heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IconPlane size={18} stroke={1.8} color={t.onAccent}/>
            <MonoLabel t={t} color={t.onAccent + 'CC'}>travel mode active</MonoLabel>
          </div>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 28,
            letterSpacing: '-0.04em', lineHeight: 1.05, color: t.onAccent, marginBottom: 4 }}>
            Train Anywhere.
          </div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 12, color: t.onAccent,
            opacity: 0.72, marginBottom: 16 }}>
            Minimal equipment · Hotel · Anywhere
          </div>

          {/* Equipment toggle */}
          <div style={{ borderTop: `1px solid ${t.onAccent}22`, paddingTop: 14 }}>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.16em', color: t.onAccent + 'CC',
              textTransform: 'uppercase', marginBottom: 8 }}>
              Equipment available
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {EQUIPMENT.map((eq) => {
                const on = equipment === eq;
                return (
                  <button key={eq}
                    onClick={() => setEquipment(eq)}
                    style={{
                      border: on ? 'none' : `1px solid ${t.onAccent}44`,
                      background: on ? t.onAccent : 'transparent',
                      color: on ? t.accent : t.onAccent,
                      borderRadius: 20,
                      padding: '5px 12px',
                      fontFamily: t.fonts.body,
                      fontWeight: 600,
                      fontSize: 11.5,
                      cursor: 'pointer',
                      transition: 'all 0.14s ease',
                    }}>
                    {eq}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Today's program ── */}
        <SectionHead t={t}>today's program</SectionHead>
        <div style={{ margin: '10px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WORKOUTS.map((w, i) => (
            <WorkoutCard key={w.name} t={t} workout={w} isFirst={i === 0}/>
          ))}
        </div>

        {/* ── Movement library ── */}
        <SectionHead t={t} actionLabel="See all" onAction={() => {}}>
          movement library
        </SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {MOVEMENTS.map((m) => (
            <MovementCell key={m.name} t={t} movement={m}/>
          ))}
        </div>

        {/* ── Sync button ── */}
        <div style={{ margin: '20px 20px 0' }}>
          <button style={{
            width: '100%',
            border: `1.5px dashed ${t.fgFaint}`,
            background: 'transparent',
            color: t.fgMuted,
            borderRadius: 14,
            padding: '14px 0',
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: '-0.01em',
          }}>
            <IconTarget size={16} stroke={1.9} color={t.fgMuted}/>
            Sync with main program
          </button>
        </div>

        {/* Bottom spacer / watermark */}
        <div style={{ position: 'relative', height: 70, marginTop: 10 }}>
          <div style={{ position: 'absolute', right: 14, bottom: 0, width: 80, height: 80,
            opacity: 0.04, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.fg} stroke={7}/>
            </svg>
          </div>
        </div>

      </div>

      <Fab t={t} onClick={onPlus}/>
    </ScreenFrame>
  );
}

export default TravelScreen;
