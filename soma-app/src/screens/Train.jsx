import {
  ScreenFrame, StatusBar, PillarHeader, PillarTag,
  MonoLabel, SectionHead, Fab,
} from '../chrome.jsx';
import { F5 } from '../marks.jsx';
import {
  IconBolt, IconPlus, IconTimer, IconMic, IconDumbbellSmall,
  IconChevronRight,
} from '../icons.jsx';

// ─── Pillar color dot tag ─────────────────────────────────────────────
function TagDot({ color }) {
  return (
    <div style={{ width: 8, height: 8, borderRadius: '50%',
      background: color, flexShrink: 0 }}/>
  );
}

// ─── Single next-WOD row ─────────────────────────────────────────────
function WodRow({ t, tag, name, sub }) {
  const colMap = {
    train:   t.pillar.train,
    eat:     t.pillar.eat,
    records: t.pillar.records,
  };
  const col = colMap[tag] || t.fg;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 20px', borderBottom: `1px solid ${t.divider}` }}>
      <TagDot color={col}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13.5,
          color: t.fg }}>{name}</div>
        <div style={{ fontFamily: t.fonts.body, fontSize: 11, color: t.fgMuted,
          marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sub}
        </div>
      </div>
      <IconChevronRight size={14} stroke={2} color={t.fgFaint}/>
    </div>
  );
}

// ─── Quick capture tile ───────────────────────────────────────────────
function CaptureTile({ t, Icon, lab, primary, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: primary ? t.pillar.train : t.surface,
      border: primary ? 'none' : `1px solid ${t.divider}`,
      borderRadius: 14, padding: '16px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      cursor: 'pointer', fontFamily: 'inherit',
      color: primary ? '#0A0908' : t.fg, flex: 1,
    }}>
      <Icon size={20} stroke={1.9} color={primary ? '#0A0908' : t.pillar.train}/>
      <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: primary ? '#0A090888' : t.fgMuted }}>
        {lab}
      </span>
    </button>
  );
}

// ─── TrainScreen ─────────────────────────────────────────────────────
export function TrainScreen({ t, onNav, onMenu, onPlus }) {
  return (
    <ScreenFrame t={t} accentColor={t.pillar.train}>
      <StatusBar t={t}/>
      <PillarHeader
        t={t}
        title="Entrena"
        sub={new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
        pillarColor={t.pillar.train}
        onMenu={onMenu}
      />

      {/* ── Scrollable body ── */}
      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* ── WOD Hero card ── */}
        <div style={{ margin: '14px 20px 0', background: t.fg, color: t.bg,
          borderRadius: 20, overflow: 'hidden', position: 'relative' }}>

          {/* F5 watermark */}
          <div style={{ position: 'absolute', right: -10, bottom: -10, width: 130, height: 130,
            opacity: 0.08, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.bg} stroke={7}/>
            </svg>
          </div>

          <div style={{ padding: '32px 18px', textAlign: 'center' }}>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
              letterSpacing: '-0.03em', lineHeight: 1.2, color: t.bg, marginBottom: 10 }}>
              Sin WOD programado para hoy
            </div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 13,
              color: t.bg, opacity: 0.55 }}>
              Usa + para registrar un entrenamiento.
            </div>
          </div>
        </div>

        {/* ── CTA buttons ── */}
        <div style={{ margin: '12px 20px 0', display: 'flex', gap: 8 }}>
          <button onClick={onPlus} style={{
            flex: 1, background: t.pillar.train, color: '#0A0908',
            border: 'none', borderRadius: 14, padding: '14px 0',
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14.5,
            cursor: 'pointer', letterSpacing: '-0.01em',
          }}>
            Empezar WOD
          </button>
          <button onClick={onPlus} style={{
            width: 50, height: 50, background: t.surface,
            border: `1px solid ${t.divider}`, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <IconPlus size={20} stroke={2} color={t.fg}/>
          </button>
        </div>

        {/* ── Quick capture ── */}
        <SectionHead t={t}>capturar entreno</SectionHead>
        <div style={{ margin: '10px 20px 0', display: 'flex', gap: 8 }}>
          <CaptureTile t={t} Icon={IconDumbbellSmall} lab="Set"    primary={true}  onClick={onPlus}/>
          <CaptureTile t={t} Icon={IconTimer}         lab="Tiempo" primary={false} onClick={onPlus}/>
          <CaptureTile t={t} Icon={IconMic}           lab="Voz"    primary={false} onClick={onPlus}/>
        </div>

        {/* ── F5 watermark ── */}
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

export default TrainScreen;
