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

        {/* ── Empty state ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '80px 40px', textAlign: 'center',
        }}>
          <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 24, opacity: 0.12 }}>
            <svg viewBox="0 0 80 80" width="80" height="80">
              <F5 color={t.fg} stroke={4}/>
            </svg>
          </div>
          <div style={{
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
            letterSpacing: '-0.03em', color: t.fg, marginBottom: 10,
          }}>
            Sin datos suficientes aún
          </div>
          <div style={{
            fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, lineHeight: 1.5,
          }}>
            Completa al menos 2 semanas de entrenamiento para ver tu análisis.
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

export default AnalyticsScreen;
