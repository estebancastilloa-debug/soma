import { useState, useEffect } from 'react';
import {
  ScreenFrame, StatusBar, MenuButton, MonoLabel,
  SectionHead, Fab, DragHandle, useSwipeDown,
} from '../chrome.jsx';
import { useBackClose } from '../lib/backstack.js';
import { F5, WordmarkWithMark } from '../marks.jsx';
import {
  IconRecovery, IconDumbbellSmall, IconProtein,
  IconBalance, IconSleep, IconStreak,
} from '../icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { checkAvailability, requestPermissions, getTodayHealthData } from '../lib/healthConnect.js';
import { computeReadiness, loadTodaySignals, readinessAdvice } from '../lib/readiness.js';

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
  const { profile, session } = useAuth();

  const [workoutCount, setWorkoutCount] = useState(null);
  const [prCount,      setPrCount]      = useState(null);
  const [weekStreak,   setWeekStreak]   = useState(0);
  const [todayWod,     setTodayWod]     = useState(null);
  const [habitsToday,  setHabitsToday]  = useState(0);
  const [healthData,   setHealthData]   = useState(null);
  const [hcStatus,     setHcStatus]     = useState('idle'); // idle|unavailable|needs-permission|connected
  const [todayMood,    setTodayMood]    = useState(null);
  const [showReadiness, setShowReadiness] = useState(false);
  useBackClose(showReadiness, () => setShowReadiness(false));
  const readinessSwipe = useSwipeDown(() => setShowReadiness(false));

  // Health Connect
  useEffect(() => {
    async function loadHealth() {
      const avail = await checkAvailability();
      if (avail !== 'Available') { setHcStatus('unavailable'); return; }
      const data = await getTodayHealthData();
      if (data) { setHealthData(data); setHcStatus('connected'); }
      else { setHcStatus('needs-permission'); }
    }
    loadHealth();
  }, []);

  async function handleConnectHealth() {
    const granted = await requestPermissions();
    if (granted) {
      const data = await getTodayHealthData();
      if (data) { setHealthData(data); setHcStatus('connected'); }
    }
  }

  useEffect(() => {
    if (!session?.user) return;
    const uid   = session.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const now   = new Date();
    const dow   = now.getDay();
    const mon   = new Date(now);
    mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
    const weekStart = mon.toISOString().slice(0, 10);

    Promise.all([
      supabase.from('workouts').select('*', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('prs').select('*', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('workouts').select('date').eq('user_id', uid).gte('date', weekStart).lte('date', today),
      supabase.from('workouts').select('*').eq('user_id', uid).eq('date', today).maybeSingle(),
      supabase.from('daily_log').select('habit_ids, mood').eq('user_id', uid).eq('date', today).maybeSingle(),
    ]).then(([w, p, ww, tw, dl]) => {
      setWorkoutCount(w.count ?? 0);
      setPrCount(p.count ?? 0);
      setWeekStreak((ww.data || []).length);
      setTodayWod(tw.data || null);
      setHabitsToday((dl.data?.habit_ids || []).length);
      setTodayMood(dl.data?.mood ?? null);
    });
  }, [session?.user?.id]);

  const displayName = profile?.name || 'Atleta';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Readiness from phone + self-report
  const { fatigueId, painMap } = loadTodaySignals();
  const readiness = computeReadiness({ healthData, fatigueId, mentalMood: todayMood, painMap });

  const now = new Date();
  const dateLabel = now.toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'long',
  });

  const widgets = [
    { Icon: IconDumbbellSmall, lab: 'ENTRENO HOY', main: todayWod?.name || 'Sin WOD',   sub: todayWod?.wod_type || 'Toca para registrar', col: t.pillar.train,   go: 'train' },
    { Icon: IconProtein,       lab: 'NUTRICIÓN',   main: '—',                            sub: 'Registra comidas',                           col: t.pillar.eat,     go: 'eat'   },
    { Icon: IconBalance,       lab: 'NIVEL',       main: 'L01',                          sub: 'The Spark',                                  col: t.pillar.records, go: 'level' },
    { Icon: IconSleep,         lab: 'HÁBITOS',     main: habitsToday > 0 ? `${habitsToday}` : '—', sub: habitsToday > 0 ? `completados hoy` : 'Ve a Bitácora', col: t.fg, go: 'journal' },
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
        <div onClick={readiness ? () => setShowReadiness(true) : undefined}
          style={{ margin: '18px 20px 0', background: readiness ? readiness.color : t.accent, color: '#0A0908',
          borderRadius: 20, padding: '16px 18px', position: 'relative', overflow: 'hidden',
          cursor: readiness ? 'pointer' : 'default' }}>

          {/* F5 watermark inside card */}
          <div style={{ position: 'absolute', right: -14, bottom: -14, width: 110, height: 110,
            opacity: 0.18, pointerEvents: 'none' }}>
            <svg viewBox="0 0 80 80" width="100%" height="100%">
              <F5 color="#0A0908" stroke={7}/>
            </svg>
          </div>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <IconRecovery size={16} stroke={2} color="#0A0908"/>
            <MonoLabel t={t} color="#0A0908CC">{readiness ? 'readiness' : 'recovery'}</MonoLabel>
            {readiness && (
              <span style={{ marginLeft: 'auto', fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
                color: '#0A0908', opacity: 0.6, display: 'flex', alignItems: 'center', gap: 4 }}>
                toca para ver
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A0908" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </span>
            )}
          </div>

          {/* Score row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 60,
              letterSpacing: '-0.06em', lineHeight: 1 }}>
              {readiness ? readiness.score : '—'}
            </span>
            {readiness && (
              <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 16,
                opacity: 0.55, marginBottom: 10 }}>/100 · {readiness.label}</span>
            )}
          </div>

          {/* Health chips row */}
          {healthData ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              {healthData.rhr && <div style={{ fontFamily: t.fonts.mono, fontSize: 10, opacity: 0.75 }}>RHR {healthData.rhr}</div>}
              {healthData.sleepHours && <div style={{ fontFamily: t.fonts.mono, fontSize: 10, opacity: 0.75 }}>Sueño {healthData.sleepHours}h</div>}
              {healthData.steps  != null && <div style={{ fontFamily: t.fonts.mono, fontSize: 10, opacity: 0.75 }}>{healthData.steps.toLocaleString()} pasos</div>}
              {healthData.calories != null && <div style={{ fontFamily: t.fonts.mono, fontSize: 10, opacity: 0.75 }}>{healthData.calories} kcal</div>}
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {hcStatus === 'needs-permission' && (
                <button onClick={handleConnectHealth} style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'rgba(0,0,0,0.15)', color: '#0A0908',
                  fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em',
                }}>
                  CONECTAR HEALTH CONNECT →
                </button>
              )}
              {(hcStatus === 'unavailable' || hcStatus === 'idle') && (
                <div style={{ fontFamily: t.fonts.body, fontSize: 11, opacity: 0.7 }}>
                  {hcStatus === 'unavailable' ? 'Instala Health Connect para ver datos' : 'Sin datos de recuperación aún'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 2×2 widget grid ── */}
        <div style={{ margin: '14px 20px 0', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {widgets.map((w) => (
            <Widget key={w.lab} t={t} {...w} onClick={w.go ? () => onNav(w.go) : undefined}/>
          ))}
        </div>

        {/* ── Stats chips ── */}
        <div style={{ margin: '14px 20px 0', display: 'flex', gap: 8 }}>
          {[
            { lab: 'ENTRENOS', val: workoutCount === null ? '—' : String(workoutCount), col: t.pillar.train },
            { lab: 'PRS',      val: prCount      === null ? '—' : String(prCount),      col: t.pillar.records },
          ].map(s => (
            <div key={s.lab} style={{ flex: 1, background: t.surface, border: `1px solid ${t.divider}`,
              borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 24, background: s.col, borderRadius: 2, flexShrink: 0 }}/>
              <div>
                <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
                  letterSpacing: '-0.035em', color: t.fg }}>{s.val}</div>
                <MonoLabel t={t}>{s.lab}</MonoLabel>
              </div>
            </div>
          ))}
        </div>

        {/* ── Streak strip ── */}
        <div style={{ margin: '14px 20px 0', background: t.surface,
          border: `1px solid ${t.divider}`, borderRadius: 14, padding: '14px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconStreak size={15} stroke={2} color={t.accent}/>
              <MonoLabel t={t}>esta semana · {weekStreak} día{weekStreak !== 1 ? 's' : ''}</MonoLabel>
            </div>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 11,
              color: t.accent }}>{weekStreak}/7</span>
          </div>
          <StreakBar t={t} filledDays={weekStreak}/>
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

      {/* Readiness detail modal */}
      {showReadiness && readiness && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowReadiness(false)}>
          <div onClick={e => e.stopPropagation()} {...readinessSwipe} style={{
            width: '100%', background: t.bg, borderRadius: '24px 24px 0 0', padding: '12px 20px 40px',
            maxHeight: '88%', overflowY: 'auto',
          }}>
            <DragHandle t={t}/>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 700, fontSize: 22, color: t.fg, marginBottom: 16 }}>Readiness</div>

            {/* Big score */}
            <div style={{ background: readiness.color, borderRadius: 18, padding: '18px 20px', marginBottom: 16, color: '#0A0908' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <span style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 52, lineHeight: 1, letterSpacing: '-0.04em' }}>{readiness.score}</span>
                <span style={{ fontFamily: t.fonts.mono, fontSize: 15, fontWeight: 700, opacity: 0.6, marginBottom: 8 }}>/100 · {readiness.label}</span>
              </div>
            </div>

            {/* What it measures */}
            <div style={{ fontFamily: t.fonts.body, fontSize: 13.5, color: t.fgMuted, lineHeight: 1.6, marginBottom: 18 }}>
              El readiness combina tus datos del día para estimar qué tan recuperado está tu cuerpo. Cada factor aporta un porcentaje del total.
            </div>

            {/* Factor breakdown */}
            <div style={{ fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 10 }}>Qué lo está midiendo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {readiness.components.map(c => {
                const col = c.score >= 75 ? '#34C759' : c.score >= 55 ? '#F59E0B' : '#DC2626';
                return (
                  <div key={c.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                      <span style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14, color: t.fg }}>{c.key}</span>
                      <span style={{ fontFamily: t.fonts.mono, fontSize: 12, color: t.fgMuted }}>{c.detail} · {c.score}/100</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 4, background: t.s2, overflow: 'hidden' }}>
                      <div style={{ width: `${c.score}%`, height: '100%', background: col, borderRadius: 4 }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why low / weakest */}
            {readiness.weakest && readiness.score < 80 && (
              <div style={{ background: t.surface, border: `1px solid ${t.divider}`, borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: t.fgFaint, textTransform: 'uppercase', marginBottom: 6 }}>Lo que más lo baja</div>
                <div style={{ fontFamily: t.fonts.body, fontSize: 14, color: t.fg, fontWeight: 600 }}>{readiness.weakest.key} ({readiness.weakest.score}/100)</div>
              </div>
            )}

            {/* Recommendation */}
            <div style={{ background: readiness.color + '20', border: `1px solid ${readiness.color}55`, borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: readiness.color, textTransform: 'uppercase', marginBottom: 6 }}>Qué hacer hoy</div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 14, color: t.fg, lineHeight: 1.6 }}>{readinessAdvice(readiness.score)}</div>
            </div>

            {/* Doesn't match how you feel */}
            <div style={{ fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.6 }}>
              ¿No coincide con cómo te sientes? El score se basa en lo que registraste. Ajusta tu <b style={{ color: t.fg }}>cansancio</b> o tu <b style={{ color: t.fg }}>dolor</b> en la Bitácora y el readiness se recalcula. Tú mandas sobre el número.
            </div>
            <button onClick={() => { setShowReadiness(false); onNav('journal'); }} style={{
              marginTop: 16, width: '100%', padding: '13px', borderRadius: 14, border: 'none',
              background: t.accent, color: '#0A0908', cursor: 'pointer',
              fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
            }}>
              Ajustar en Bitácora
            </button>
          </div>
        </div>
      )}

      <Fab t={t} onClick={onPlus}/>
    </ScreenFrame>
  );
}

export default DashboardScreen;
