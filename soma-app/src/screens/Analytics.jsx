import { useState } from 'react';
import {
  ScreenFrame, StatusBar, PillarHeader,
  MonoLabel, SectionHead, Fab,
} from '../chrome.jsx';
import { F5 } from '../marks.jsx';
import {
  IconActivity, IconTarget, IconTrendUp,
  IconCheck, IconBolt, IconCalendar,
} from '../icons.jsx';

// ─── Fitness dimensions data ──────────────────────────────────────────
const DIMENSIONS = [
  { name: 'Power Lifts',       pct: 88 },
  { name: 'Olympic Lifts',     pct: 72 },
  { name: 'Endurance',         pct: 65 },
  { name: 'Speed',             pct: 58 },
  { name: 'Bodyweight Metcons', pct: 80 },
  { name: 'Light Metcons',     pct: 76 },
  { name: 'Heavy Metcons',     pct: 70 },
  { name: 'Long Metcons',      pct: 45 },
];

// ─── Imbalance flags ──────────────────────────────────────────────────
const FLAGS = [
  {
    name: 'Push / Pull ratio',
    value: '1.4 : 1',
    status: 'Slightly off',
    level: 'mid',
  },
  {
    name: 'Left / Right squat',
    value: '4% asymmetry',
    status: 'Balanced',
    level: 'ok',
  },
  {
    name: 'Long aerobic exposure',
    value: '45% of target',
    status: 'Flag',
    level: 'low',
  },
];

// ─── 8-week volume data ───────────────────────────────────────────────
const VOLUME_WEEKS = [6, 7, 5, 8, 6, 7, 8, 6];
const MAX_SESSIONS = 10; // scale reference

// ─── Dimension bar row ────────────────────────────────────────────────
function DimensionBar({ t, name, pct }) {
  const isLow = pct < 60;
  const fillColor = isLow ? t.semantic.low : t.pillar.train;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
      {/* Name */}
      <div style={{ width: 130, fontFamily: t.fonts.body, fontSize: 12,
        fontWeight: 500, color: t.fg, flexShrink: 0,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </div>

      {/* Bar track */}
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: t.s2, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          borderRadius: 3, background: fillColor,
          transition: 'width 0.4s ease',
        }}/>
      </div>

      {/* Percent */}
      <div style={{ width: 34, textAlign: 'right', flexShrink: 0,
        fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 11,
        color: isLow ? t.semantic.low : t.fgMuted, letterSpacing: '-0.01em' }}>
        {pct}%
      </div>
    </div>
  );
}

// ─── Imbalance flag row ───────────────────────────────────────────────
function FlagRow({ t, flag }) {
  const colorMap = {
    ok:  t.semantic.ok,
    mid: t.semantic.mid,
    low: t.semantic.low,
  };
  const color = colorMap[flag.level] || t.fgMuted;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
      {/* Color dot */}
      <div style={{ width: 7, height: 7, borderRadius: '50%',
        background: color, flexShrink: 0 }}/>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13,
          color: t.fg }}>{flag.name}</div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
          color: t.fgMuted, letterSpacing: '0.1em', marginTop: 1 }}>
          {flag.value}
        </div>
      </div>

      {/* Status pill */}
      <div style={{
        background: color + '22',
        color,
        borderRadius: 20,
        padding: '4px 10px',
        fontFamily: t.fonts.mono,
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {flag.status}
      </div>
    </div>
  );
}

// ─── 8-week volume bar chart ──────────────────────────────────────────
function VolumeBars({ t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5,
      padding: '14px 0 0', height: 90 }}>
      {VOLUME_WEEKS.map((sessions, i) => {
        const fillRatio = sessions / MAX_SESSIONS;
        const totalH = 62;
        const fillH = Math.round(fillRatio * totalH);
        const emptyH = totalH - fillH;
        const isLast = i === VOLUME_WEEKS.length - 1;

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3 }}>
            {/* Session count */}
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              color: isLast ? t.accent : t.fgMuted, letterSpacing: '0.04em' }}>
              {sessions}
            </span>

            {/* Full bar (track = surface, fill = accent) */}
            <div style={{ width: '100%', height: totalH, borderRadius: '4px 4px 2px 2px',
              background: t.s2, display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end', overflow: 'hidden' }}>
              <div style={{
                width: '100%', height: fillH,
                background: isLast ? t.accent : t.pillar.train,
                opacity: isLast ? 1 : 0.72,
              }}/>
            </div>

            {/* Week label */}
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 700,
              letterSpacing: '0.04em',
              color: isLast ? t.accent : t.fgFaint }}>
              W{i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── AnalyticsScreen ──────────────────────────────────────────────────
export function AnalyticsScreen({ t, onNav, onMenu, onPlus }) {
  return (
    <ScreenFrame t={t} accentColor={t.pillar.records}>
      <StatusBar t={t}/>
      <PillarHeader
        t={t}
        title="Analytics"
        sub="Programming · imbalances · trends"
        pillarColor={t.pillar.records}
        onMenu={onMenu}
      />

      {/* ── Scrollable body ── */}
      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* ── Hero ── */}
        <div style={{ margin: '14px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 20,
          padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>

          <div style={{ position: 'absolute', right: -16, top: -16, width: 120, height: 120,
            opacity: 0.04, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.fg} stroke={7}/>
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <IconActivity size={15} stroke={2} color={t.pillar.records}/>
            <MonoLabel t={t}>programming analysis</MonoLabel>
          </div>

          <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 26,
            letterSpacing: '-0.04em', lineHeight: 1.05, color: t.fg, marginBottom: 4 }}>
            Programming Analysis
          </div>

          <div style={{ fontFamily: t.fonts.body, fontSize: 12,
            color: t.fgMuted, marginBottom: 14 }}>
            Last 42 days · 38 sessions
          </div>

          {/* Confidence badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            background: t.semantic.ok + '1A',
            border: `1px solid ${t.semantic.ok}44`,
            borderRadius: 20,
            padding: '5px 12px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%',
              background: t.semantic.ok }}/>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: t.semantic.ok }}>
              GREEN · VERIFIED
            </span>
          </div>
        </div>

        {/* ── Fitness dimensions ── */}
        <SectionHead t={t}>fitness dimensions</SectionHead>
        <div style={{ margin: '10px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 16,
          padding: '4px 16px 8px' }}>
          {DIMENSIONS.map((d) => (
            <DimensionBar key={d.name} t={t} name={d.name} pct={d.pct}/>
          ))}
        </div>

        {/* ── Imbalance flags ── */}
        <SectionHead t={t}>imbalance flags</SectionHead>
        <div style={{ margin: '10px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 16,
          padding: '4px 16px' }}>
          {FLAGS.map((f, i) => (
            <div key={f.name} style={{ borderBottom: i < FLAGS.length - 1
              ? `1px solid ${t.divider}` : 'none' }}>
              <FlagRow t={t} flag={f}/>
            </div>
          ))}
        </div>

        {/* ── Volume by week ── */}
        <SectionHead t={t} actionLabel="12w" onAction={() => {}}>
          volume by week · 8w
        </SectionHead>
        <div style={{ margin: '10px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 16,
          padding: '8px 16px 14px' }}>

          {/* Y-axis hint */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <MonoLabel t={t} color={t.fgFaint}>sessions</MonoLabel>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              color: t.fgFaint, letterSpacing: '0.1em' }}>max 10</span>
          </div>

          <VolumeBars t={t}/>
        </div>

        {/* ── Trend summary row ── */}
        <div style={{ margin: '14px 20px 0', display: 'flex', gap: 8 }}>
          {[
            { label: 'Avg / week', value: '6.8', Icon: IconCalendar, color: t.accent },
            { label: 'Consistency', value: '91%', Icon: IconCheck, color: t.semantic.ok },
            { label: 'Load trend', value: '+8%', Icon: IconTrendUp, color: t.pillar.train },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: t.surface,
              border: `1px solid ${t.divider}`, borderRadius: 14,
              padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6,
                background: s.color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color }}>
                <s.Icon size={13} stroke={2}/>
              </div>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 18,
                letterSpacing: '-0.03em', color: t.fg, lineHeight: 1 }}>
                {s.value}
              </div>
              <MonoLabel t={t} color={t.fgFaint}>{s.label}</MonoLabel>
            </div>
          ))}
        </div>

        {/* Bottom watermark */}
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

export default AnalyticsScreen;
