import { useState } from 'react';
import {
  ScreenFrame, StatusBar, PillarHeader, MonoLabel, SectionHead,
  ScreenFrame as _, MenuButton,
} from '../chrome.jsx';
import {
  IconBarbell, IconTrendUp, IconActivity, IconRun, IconTimer,
  IconDumbbellSmall, IconFlame, IconCheck, IconPlus, IconTarget,
} from '../icons.jsx';
import { F5 } from '../marks.jsx';

// ─── Category definitions ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'barbell',    label: 'Barbell'     },
  { id: 'olympic',    label: 'Olympic'     },
  { id: 'gymnastics', label: 'Gymnastics'  },
  { id: 'endurance',  label: 'Endurance'   },
  { id: 'benchmark',  label: 'Benchmark'   },
];

// ─── PR Data ─────────────────────────────────────────────────────────
const PR_DATA = {
  barbell: [
    { name: 'Back Squat',     value: '140 kg', ago: '3 weeks ago', trend: '+10kg in 90d'  },
    { name: 'Front Squat',    value: '120 kg', ago: '6 weeks ago', trend: '+5kg in 90d'   },
    { name: 'Deadlift',       value: '180 kg', ago: '2 weeks ago', trend: '+15kg in 90d'  },
    { name: 'Bench Press',    value: '100 kg', ago: '1 week ago',  trend: '+5kg in 90d'   },
    { name: 'Overhead Press', value: '75 kg',  ago: '4 weeks ago', trend: '+2.5kg in 90d' },
  ],
  olympic: [
    { name: 'Snatch',       value: '85 kg',  ago: '1 week ago',  trend: null },
    { name: 'Clean & Jerk', value: '105 kg', ago: '3 weeks ago', trend: null },
    { name: 'Power Clean',  value: '95 kg',  ago: '2 weeks ago', trend: null },
  ],
  gymnastics: [
    { name: 'Pull-ups (max)',  value: '22 reps', ago: '2 weeks ago', trend: null },
    { name: 'Muscle-ups (max)', value: '8 reps', ago: '4 weeks ago', trend: null },
    { name: 'HSPU (max)',      value: '15 reps', ago: '1 week ago',  trend: null },
  ],
  endurance: [
    { name: '5K Run',   value: '21:34', ago: '3 weeks ago', trend: null },
    { name: '1 Mile',   value: '6:48',  ago: '2 weeks ago', trend: null },
    { name: 'Row 2K',   value: '7:12',  ago: '5 weeks ago', trend: null },
  ],
  benchmark: [
    { name: 'Fran',   value: '3:42',  ago: 'Rx', trend: null },
    { name: 'Murph',  value: '39:14', ago: 'Rx', trend: null },
    { name: 'Grace',  value: '2:58',  ago: 'Rx', trend: null },
    { name: 'Karen',  value: '8:45',  ago: 'Rx', trend: null },
  ],
};

// ─── Single PR row ────────────────────────────────────────────────────
function PRRow({ t, name, value, ago, trend }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: `1px solid ${t.divider}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      {/* Left: name + ago */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 14,
          color: t.fg,
          letterSpacing: '-0.01em',
        }}>{name}</div>
        <div style={{
          fontFamily: t.fonts.mono,
          fontSize: 9.5,
          fontWeight: 600,
          color: t.fgFaint,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginTop: 2,
        }}>{ago}</div>
      </div>

      {/* Right: value + trend chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trend && (
          <div style={{
            background: `${t.semantic.ok}22`,
            color: t.semantic.ok,
            fontFamily: t.fonts.mono,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 7px',
            borderRadius: 6,
          }}>
            {trend}
          </div>
        )}
        <div style={{
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '-0.02em',
          color: t.fg,
          minWidth: 60,
          textAlign: 'right',
        }}>{value}</div>
      </div>
    </div>
  );
}

// ─── PRTrackerScreen ─────────────────────────────────────────────────
export function PRTrackerScreen({ t, onNav, onMenu, onPlus }) {
  const [category, setCategory] = useState('barbell');
  const pillar = t.pillar.records;
  const prs = PR_DATA[category] || [];

  return (
    <ScreenFrame t={t} accentColor={pillar}>
      <StatusBar t={t} />
      <PillarHeader
        t={t}
        title="PR Tracker"
        sub="Personal records · all modalities"
        pillarColor={pillar}
        onMenu={onMenu}
      />

      {/* ── Category tabs ── */}
      <div style={{
        display: 'flex',
        gap: 7,
        padding: '14px 20px 0',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}>
        <style>{`.pr-tabs::-webkit-scrollbar { display:none; }`}</style>
        {CATEGORIES.map(cat => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 20,
                border: active ? 'none' : `1.5px solid ${t.border}`,
                background: active ? pillar : 'transparent',
                color: active ? '#0A0908' : t.fgMuted,
                fontFamily: t.fonts.mono,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.14s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{
        height: 'calc(100% - 130px)',
        overflowY: 'auto',
        paddingBottom: 100,
        marginTop: 14,
      }}>
        {/* Section header */}
        <div style={{
          padding: '0 20px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${t.divider}`,
        }}>
          <MonoLabel t={t}>{CATEGORIES.find(c => c.id === category)?.label} · PRs</MonoLabel>
          <div style={{
            fontFamily: t.fonts.mono,
            fontSize: 9,
            fontWeight: 700,
            color: pillar,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>{prs.length} lifts</div>
        </div>

        {/* PR rows */}
        {prs.map((pr, i) => (
          <PRRow key={i} t={t} {...pr} />
        ))}

        {/* ── Log New PR button ── */}
        <div style={{ padding: '20px 20px 0' }}>
          <button
            onClick={onPlus}
            style={{
              width: '100%',
              background: pillar,
              color: '#0A0908',
              border: 'none',
              borderRadius: 14,
              padding: '15px 0',
              fontFamily: t.fonts.body,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <IconPlus size={18} stroke={2.4} color="#0A0908" />
            Log New PR
          </button>
        </div>

        {/* F5 watermark */}
        <div style={{ position: 'relative', height: 60, marginTop: 10 }}>
          <div style={{
            position: 'absolute', right: 14, bottom: 0,
            width: 70, height: 70, opacity: 0.04, pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.fg} stroke={7} />
            </svg>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

export default PRTrackerScreen;
