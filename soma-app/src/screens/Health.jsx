import { useState } from 'react';
import {
  ScreenFrame, StatusBar, PillarHeader,
  MonoLabel, SectionHead, Fab,
} from '../chrome.jsx';
import { F5 } from '../marks.jsx';
import {
  IconHRV, IconSleep, IconHeart, IconWeight,
  IconRecovery, IconTrendUp, IconActivity,
} from '../icons.jsx';

// ─── Sleep data (Mon–Sun) ─────────────────────────────────────────────
const SLEEP_DATA = [
  { day: 'Mon', hrs: 7.5 },
  { day: 'Tue', hrs: 8.0 },
  { day: 'Wed', hrs: 6.5 },
  { day: 'Thu', hrs: 7.8 },
  { day: 'Fri', hrs: 7.2 },
  { day: 'Sat', hrs: 8.1 },
  { day: 'Sun', hrs: 7.4 },
];

// ─── HRV trend (30d) — 30 points bouncing 58–72 ──────────────────────
const HRV_TREND = [
  62, 65, 60, 68, 70, 66, 63, 67, 71, 64,
  59, 63, 68, 72, 69, 65, 61, 66, 70, 68,
  64, 60, 65, 69, 72, 67, 63, 68, 71, 68,
];

// ─── Small sparkline for body comp ───────────────────────────────────
function MiniSparkline({ data, color, width = 40, height = 18 }) {
  const max = Math.max(...data);
  const min = Math.min(...data) - 1;
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
    </svg>
  );
}

// ─── HRV SVG sparkline (30d) ─────────────────────────────────────────
function HRVSparkline({ t }) {
  const W = 280, H = 56;
  const max = Math.max(...HRV_TREND);
  const min = Math.min(...HRV_TREND) - 2;
  const range = max - min;
  const step = W / (HRV_TREND.length - 1);

  const pts = HRV_TREND.map((v, i) => {
    const x = i * step;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  // Area fill path
  const firstX = 0;
  const lastX = (HRV_TREND.length - 1) * step;
  const areaPath = `M ${firstX},${H} ` +
    HRV_TREND.map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * (H - 6) - 3;
      return `L ${x},${y}`;
    }).join(' ') +
    ` L ${lastX},${H} Z`;

  return (
    <svg width="100%" height={H + 8} viewBox={`0 0 ${W} ${H + 8}`}
      style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="hrv-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={t.accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#hrv-fill)"/>
      <polyline points={pts} fill="none" stroke={t.accent} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      {/* Last point dot */}
      {(() => {
        const last = HRV_TREND[HRV_TREND.length - 1];
        const lx = (HRV_TREND.length - 1) * step;
        const ly = H - ((last - min) / range) * (H - 6) - 3;
        return <circle cx={lx} cy={ly} r="3.5" fill={t.accent}/>;
      })()}
    </svg>
  );
}

// ─── Metric card (2×2 grid) ───────────────────────────────────────────
function MetricCard({ t, Icon, label, value, delta, deltaColor, iconColor }) {
  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.divider}`,
      borderRadius: 16,
      padding: '13px 13px 11px',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 26, height: 26, borderRadius: 7,
          background: iconColor + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
          <Icon size={14} stroke={2}/>
        </div>
        <MonoLabel t={t} color={t.fgFaint}>{label}</MonoLabel>
      </div>
      <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 21,
        letterSpacing: '-0.04em', color: t.fg, lineHeight: 1 }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
          color: deltaColor || t.fgMuted, lineHeight: 1 }}>
          {delta}
        </div>
      )}
    </div>
  );
}

// ─── Sleep bar chart ──────────────────────────────────────────────────
function SleepBars({ t }) {
  const maxHrs = Math.max(...SLEEP_DATA.map(d => d.hrs));

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6,
      padding: '14px 20px 0', height: 100 }}>
      {SLEEP_DATA.map((d) => {
        const ratio = d.hrs / maxHrs;
        const barH = Math.round(ratio * 60);
        const opacity = 0.45 + ratio * 0.55;
        return (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            {/* Hours label above bar */}
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 700,
              color: t.fgMuted, letterSpacing: '0.04em' }}>
              {d.hrs}
            </span>
            {/* Bar */}
            <div style={{
              width: '100%', height: barH,
              borderRadius: '4px 4px 2px 2px',
              background: t.accent,
              opacity,
            }}/>
            {/* Day label */}
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 700,
              letterSpacing: '0.06em', color: t.fgFaint }}>
              {d.day.slice(0, 1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Body comp metric ─────────────────────────────────────────────────
function BodyCompMetric({ t, label, value, sparkData, sparkColor }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4,
      padding: '12px 10px', background: t.surface,
      border: `1px solid ${t.divider}`, borderRadius: 14 }}>
      <MonoLabel t={t} color={t.fgFaint}>{label}</MonoLabel>
      <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 17,
        letterSpacing: '-0.03em', color: t.fg, lineHeight: 1 }}>
        {value}
      </div>
      <MiniSparkline data={sparkData} color={sparkColor}/>
    </div>
  );
}

// ─── HealthScreen ─────────────────────────────────────────────────────
export function HealthScreen({ t, onNav, onMenu, onPlus }) {
  return (
    <ScreenFrame t={t} accentColor={t.secondary}>
      <StatusBar t={t}/>
      <PillarHeader
        t={t}
        title="Salud"
        sub="HRV · sleep · biometrics"
        pillarColor={t.secondary}
        onMenu={onMenu}
      />

      {/* ── Scrollable body ── */}
      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* ── HRV Hero ── */}
        <div style={{ margin: '14px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 20,
          padding: '18px 18px 16px', position: 'relative', overflow: 'hidden' }}>

          <div style={{ position: 'absolute', right: -16, bottom: -16, width: 120, height: 120,
            opacity: 0.04, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.fg} stroke={7}/>
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <IconHRV size={16} stroke={2} color={t.secondary}/>
            <MonoLabel t={t}>heart rate variability</MonoLabel>
          </div>

          {/* Big HRV value */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 64,
              letterSpacing: '-0.06em', lineHeight: 1, color: t.fg }}>
              68
            </span>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 18,
              color: t.fgMuted, marginBottom: 10 }}>ms</span>
            <span style={{ fontFamily: t.fonts.body, fontSize: 12,
              color: t.semantic.ok, marginBottom: 11, marginLeft: 2, fontWeight: 600 }}>
              +4 vs yesterday
            </span>
          </div>

          <MonoLabel t={t} color={t.fgFaint}>heart rate variability</MonoLabel>
        </div>

        {/* ── 2×2 Metrics grid ── */}
        <div style={{ margin: '12px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <MetricCard t={t}
            Icon={IconHeart} label="RHR" value="52 bpm"
            delta="−2 vs avg" deltaColor={t.semantic.ok}
            iconColor={t.semantic.ok}/>
          <MetricCard t={t}
            Icon={IconSleep} label="Sleep" value="7:24"
            delta="−0:36 vs avg" deltaColor={t.semantic.mid}
            iconColor={t.semantic.mid}/>
          <MetricCard t={t}
            Icon={IconWeight} label="Body Wt" value="84.2 kg"
            delta="−0.3 kg" deltaColor={t.semantic.ok}
            iconColor={t.accent}/>
          <MetricCard t={t}
            Icon={IconRecovery} label="Recovery" value="87/100"
            delta="Optimal range" deltaColor={t.fgMuted}
            iconColor={t.secondary}/>
        </div>

        {/* ── Sleep last 7 days ── */}
        <SectionHead t={t}>sleep · last 7 days</SectionHead>
        <div style={{ margin: '0 20px',
          background: t.surface, border: `1px solid ${t.divider}`,
          borderRadius: 16, paddingBottom: 12, marginTop: 10 }}>
          <SleepBars t={t}/>
          {/* Target line label */}
          <div style={{ padding: '8px 14px 0', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              letterSpacing: '0.12em', color: t.fgFaint, textTransform: 'uppercase' }}>
              target 8h
            </span>
          </div>
        </div>

        {/* ── Body composition ── */}
        <SectionHead t={t}>body composition</SectionHead>
        <div style={{ margin: '10px 20px 0', display: 'flex', gap: 8 }}>
          <BodyCompMetric t={t}
            label="Body Fat"
            value="16.2%"
            sparkData={[17.1, 16.9, 16.8, 16.6, 16.5, 16.3, 16.2]}
            sparkColor={t.semantic.ok}
          />
          <BodyCompMetric t={t}
            label="Lean Mass"
            value="70.6 kg"
            sparkData={[69.8, 69.9, 70.0, 70.2, 70.3, 70.5, 70.6]}
            sparkColor={t.accent}
          />
          <BodyCompMetric t={t}
            label="Muscle"
            value="8.4/10"
            sparkData={[8.2, 8.3, 8.3, 8.4, 8.3, 8.4, 8.4]}
            sparkColor={t.secondary}
          />
        </div>

        {/* ── HRV trend (30d) ── */}
        <SectionHead t={t} actionLabel="90d" onAction={() => {}}>
          hrv trend · 30 days
        </SectionHead>
        <div style={{ margin: '10px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 16,
          padding: '14px 16px 12px' }}>

          {/* Range labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between',
            marginBottom: 2 }}>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              color: t.fgFaint, letterSpacing: '0.1em' }}>58 ms</span>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              color: t.fgFaint, letterSpacing: '0.1em' }}>72 ms</span>
          </div>

          <HRVSparkline t={t}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
              color: t.fgFaint, letterSpacing: '0.08em' }}>30d ago</span>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
              color: t.fgFaint, letterSpacing: '0.08em' }}>today</span>
          </div>
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

export default HealthScreen;
