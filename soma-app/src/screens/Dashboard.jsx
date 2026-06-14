import {
  ScreenFrame, StatusBar, MenuButton, MonoLabel,
  SectionHead, Fab,
} from '../chrome.jsx';
import { F5, WordmarkWithMark } from '../marks.jsx';
import {
  IconRecovery, IconDumbbellSmall, IconProtein,
  IconBalance, IconSleep, IconStreak,
} from '../icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// ─── 2×2 Widget ──────────────────────────────────────────────────────
function Widget({ t, Icon, lab, main, sub, col, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: t.surface, border: `1px solid ${t.divider}`, borderRadius: 16,
      padding: '14px 14px 12px', textAlign: 'left', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'inherit',
      width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: col + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: col }}>
          <Icon size={15} stroke={2}/>
        </div>
        <MonoLabel t={t} color={t.fgFaint}>{lab}</MonoLabel>
      </div>
      <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
        letterSpacing: '-0.04em', color: t.fg, lineHeight: 1 }}>
        {main}
      </div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 10.5, color: t.fgMuted, lineHeight: 1.3 }}>
        {sub}
      </div>
    </button>
  );
}

// ─── Streak day cell ─────────────────────────────────────────────────
const DAYS = ['L','M','M','J','V','S','D'];

function StreakBar({ t, filledDays = 0 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 10 }}>
      {DAYS.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%', height: 28, borderRadius: 6,
            background: i < filledDays ? t.accent : t.s2,
            opacity: i < filledDays ? 1 : 0.5,
          }}/>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
            color: i < filledDays ? t.accent : t.fgFaint, letterSpacing: '0.06em' }}>
            {d}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── DashboardScreen ─────────────────────────────────────────────────
export function DashboardScreen({ t, onNav, onMenu, onPlus }) {
  const { profile } = useAuth();

  const displayName = profile?.name || 'Atleta';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const now = new Date();
  const dateLabel = now.toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'long',
  });

  const widgets = [
    { Icon: IconDumbbellSmall, lab: 'WOD HOY',  main: 'Sin WOD',   sub: 'Sin WOD programado',  col: t.pillar.train,   go: 'train' },
    { Icon: IconProtein,       lab: 'MACROS',    main: '—',          sub: 'proteína · —',         col: t.pillar.eat,     go: 'eat'   },
    { Icon: IconBalance,       lab: 'NIVEL',     main: 'L01',        sub: 'The Spark',            col: t.pillar.records, go: 'level' },
    { Icon: IconSleep,         lab: 'SUEÑO',     main: '—',          sub: '— eficiencia',         col: t.fg,             go: null    },
  ];

  return (
    <ScreenFrame t={t} accentColor={t.fg}>
      <StatusBar t={t}/>

      {/* ── Top nav bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px' }}>
        <MenuButton t={t} onMenu={onMenu}/>
        <WordmarkWithMark Mark={F5} size={22} color={t.fg}/>
        {/* Avatar */}
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 11,
          color: t.onAccent, letterSpacing: '-0.02em', flexShrink: 0 }}>
          {initials}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ height: 'calc(100% - 56px)', overflowY: 'auto', paddingBottom: 100 }}>

        {/* Greeting */}
        <div style={{ padding: '10px 20px 0' }}>
          <MonoLabel t={t}>{dateLabel}</MonoLabel>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 30,
            letterSpacing: '-0.04em', lineHeight: 1.1, color: t.fg, marginTop: 6,
            whiteSpace: 'pre-line' }}>
            {`Buenas,\n${displayName}.`}
          </div>
        </div>

        {/* ── Recovery hero card ── */}
        <div style={{ margin: '18px 20px 0', background: t.accent, color: t.onAccent,
          borderRadius: 20, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>

          {/* F5 watermark inside card */}
          <div style={{ position: 'absolute', right: -14, bottom: -14, width: 110, height: 110,
            opacity: 0.18, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color={t.onAccent} stroke={7}/>
            </svg>
          </div>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <IconRecovery size={16} stroke={2} color={t.onAccent}/>
            <MonoLabel t={t} color={t.onAccent + 'CC'}>recovery</MonoLabel>
          </div>

          {/* Score row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 12 }}>
            <span style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 60,
              letterSpacing: '-0.06em', lineHeight: 1 }}>
              —
            </span>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 16,
              opacity: 0.55, marginBottom: 10 }}>/100</span>
          </div>

          {/* Subtag */}
          <div style={{ marginTop: 8, fontFamily: t.fonts.body, fontSize: 11, opacity: 0.7 }}>
            Sin datos de recuperación aún
          </div>
        </div>

        {/* ── 2×2 widget grid ── */}
        <div style={{ margin: '14px 20px 0', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {widgets.map((w) => (
            <Widget key={w.lab} t={t} {...w} onClick={w.go ? () => onNav(w.go) : undefined}/>
          ))}
        </div>

        {/* ── Streak strip ── */}
        <div style={{ margin: '14px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 14, padding: '14px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconStreak size={15} stroke={2} color={t.accent}/>
              <MonoLabel t={t}>committed · 0 días</MonoLabel>
            </div>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 11,
              color: t.accent }}>0/7</span>
          </div>
          <StreakBar t={t} filledDays={0}/>
        </div>

        {/* ── F5 bottom watermark ── */}
        <div style={{ position: 'relative', height: 80, marginTop: 8 }}>
          <div style={{ position: 'absolute', right: 14, bottom: 0, width: 90, height: 90,
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

export default DashboardScreen;
