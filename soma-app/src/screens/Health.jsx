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


// ─── HRV SVG sparkline (30d) ─────────────────────────────────────────
function HRVSparkline({ t }) {
  return (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: t.fonts.mono, fontSize: 13, color: t.fgFaint }}>--</span>
    </div>
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '14px 20px 0', height: 100 }}>
      <span style={{ fontFamily: t.fonts.mono, fontSize: 13, color: t.fgFaint }}>--</span>
    </div>
  );
}

// ─── Body comp metric ─────────────────────────────────────────────────
function BodyCompMetric({ t, label }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4,
      padding: '12px 10px', background: t.surface,
      border: `1px solid ${t.divider}`, borderRadius: 14 }}>
      <MonoLabel t={t} color={t.fgFaint}>{label}</MonoLabel>
      <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 17,
        letterSpacing: '-0.03em', color: t.fg, lineHeight: 1 }}>
        --
      </div>
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
              --
            </span>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 18,
              color: t.fgMuted, marginBottom: 10 }}>ms</span>
          </div>

          <MonoLabel t={t} color={t.fgFaint}>heart rate variability</MonoLabel>
        </div>

        {/* ── 2×2 Metrics grid ── */}
        <div style={{ margin: '12px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <MetricCard t={t}
            Icon={IconHeart} label="RHR" value="--"
            iconColor={t.semantic.ok}/>
          <MetricCard t={t}
            Icon={IconSleep} label="Sleep" value="--"
            iconColor={t.semantic.mid}/>
          <MetricCard t={t}
            Icon={IconWeight} label="Body Wt" value="--"
            iconColor={t.accent}/>
          <MetricCard t={t}
            Icon={IconRecovery} label="Recovery" value="--"
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
          <BodyCompMetric t={t} label="Body Fat" />
          <BodyCompMetric t={t} label="Lean Mass" />
          <BodyCompMetric t={t} label="Muscle" />
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

        {/* Connect device note */}
        <div style={{ margin: '16px 20px 0', textAlign: 'center',
          fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted }}>
          Conecta un dispositivo de salud para ver datos reales.
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
