// SOMA Level screen — Holistic Level Guide.
// Layout:
//   1. HERO — current level mark + name on 2 lines + phase
//   2. Confidence + Imbalance flags
//   3. "What to do to level up" — interactive checklist
//   4. The 4 Pillars (tappable cards)
//   5. The 5 Core Rules (expandable)
//   6. The 12 Roadmap grouped by phase
//   7. Foot signature

const { useState } = React;
const { LEVELS, PHASES, LEVEL_RULES, LEVEL_PILLARS, F5 } = window;
const {
  StatusBar, MonoLabel, ScreenFrame, PillarHeader, SectionHead, TabBar,
} = window;
const {
  IconChevronRight, IconChevronLeft, IconCheck,
  IconStreak, IconFlame, IconBalance, IconHeart, IconBolt,
  IconDumbbellSmall, IconProtein, IconRecovery,
} = window;

// Confidence flag pill (red/yellow/green)
function ConfidenceFlag({ t, level }) {
  const map = {
    red:    { bg: t.semantic.low, lab: 'BUILDING' },
    yellow: { bg: t.semantic.mid, lab: 'YELLOW · MEDIUM' },
    green:  { bg: t.semantic.ok,  lab: 'GREEN · READY' },
  };
  const { bg, lab } = map[level] || map.yellow;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: 999,
      background: bg + '22', border: `1px solid ${bg}`,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: bg }}></div>
      <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
        letterSpacing: '0.14em', color: bg, textTransform: 'uppercase' }}>{lab}</span>
    </div>
  );
}

function LevelScreen({ t, Mark, onTab, onPlus, onMenu, currentLevelId = 4 }) {
  const [openRule, setOpenRule] = useState('confidence');
  const [openPillar, setOpenPillar] = useState(null);

  const current = LEVELS.find(l => l.id === currentLevelId) || LEVELS[3];
  const next    = LEVELS.find(l => l.id === currentLevelId + 1);
  const phase   = PHASES.find(p => p.id === current.phase);

  const pillar   = t.pillar.records;
  const onPillar = '#0A0908';

  // Mock interactive checklist for "How to level up"
  const checklist = [
    { Icon: IconStreak,        lab: 'Log 8 more training days', done: false, prog: '36 / 45 días' },
    { Icon: IconFlame,         lab: 'Complete 1 more benchmark', done: false, prog: '3 / 4 std' },
    { Icon: IconBalance,       lab: 'Add 1 modality (cardio)',   done: false, prog: '2 / 3 mod' },
    { Icon: IconRecovery,      lab: 'Hit Green confidence',      done: false, prog: 'yellow' },
    { Icon: IconProtein,       lab: 'Log macros 7 days in a row', done: true,  prog: '7 / 7' },
  ];
  const checkedCount = checklist.filter(c => c.done).length;
  const checkPct = Math.round((checkedCount / checklist.length) * 100);

  return (
    <ScreenFrame t={t} accent={{ Mark: current.Mark, color: pillar }}>
      <StatusBar t={t}/>

      {/* Custom header — hamburger + 2-line title */}
      <div style={{ padding: '4px 14px 0', display: 'flex',
        alignItems: 'flex-start', gap: 6 }}>
        <window.MenuButton t={t} onMenu={onMenu}/>
        <div style={{ flex: 1, paddingTop: 2 }}>
          <div style={{
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 30,
            letterSpacing: '-0.04em', lineHeight: 0.95, color: t.fg,
          }}>SOMA<br/>Level</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
            color: t.fgMuted, marginTop: 6, letterSpacing: 0.05 }}>
            Your fitness, measured holistically.</div>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: pillar,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 80 80">
            <current.Mark color={onPillar} stroke={8}/>
          </svg>
        </div>
      </div>

      <div style={{ height: 'calc(100% - 96px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* HERO */}
        <div style={{ margin: '14px 20px 0', padding: '20px 20px 18px',
          background: pillar, color: onPillar, borderRadius: 22,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 12 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <MonoLabel t={t} color={onPillar + 'AA'}>
                Level {current.id} of 12 · {phase ? phase.label : ''}
              </MonoLabel>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
                fontSize: 34, letterSpacing: '-0.04em', lineHeight: 0.98,
                marginTop: 10 }}>{current.name}</div>
              <ConfidenceFlag t={t} level="yellow"/>
            </div>
            <div style={{ width: 80, height: 80, flexShrink: 0,
              background: onPillar + '12', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="66" height="66" viewBox="0 0 80 80">
                <current.Mark color={onPillar} stroke={6}/>
              </svg>
            </div>
          </div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 13,
            lineHeight: 1.5, marginTop: 14, opacity: 0.88 }}>
            "{current.detail}"
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px',
            background: onPillar + '14', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconBolt size={14} color={onPillar}/>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5,
              fontWeight: 700, letterSpacing: '0.14em',
              color: onPillar + 'BB' }}>YOUR GOAL</span>
            <span style={{ fontFamily: t.fonts.body, fontSize: 12.5,
              fontWeight: 600, color: onPillar }}>{current.goal}</span>
          </div>
        </div>

        {/* Active flags */}
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ padding: 12, background: t.surface, borderRadius: 12,
            border: `1px solid ${t.divider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%',
                background: t.semantic.mid }}></div>
              <MonoLabel t={t}>confidence</MonoLabel>
            </div>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
              fontSize: 16, letterSpacing: '-0.02em', marginTop: 4,
              color: t.fg }}>Yellow</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
              color: t.fgMuted, marginTop: 1 }}>9 more days of logs</div>
          </div>
          <div style={{ padding: 12, background: t.surface, borderRadius: 12,
            border: `1px solid ${t.divider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%',
                background: t.semantic.ok }}></div>
              <MonoLabel t={t}>imbalance</MonoLabel>
            </div>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
              fontSize: 16, letterSpacing: '-0.02em', marginTop: 4,
              color: t.fg }}>Balanced</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
              color: t.fgMuted, marginTop: 1 }}>no red flags</div>
          </div>
        </div>

        {/* How to level up — interactive checklist */}
        <SectionHead t={t}>how to reach {next ? next.name : 'mastery'}</SectionHead>
        <div style={{ margin: '10px 20px 0', padding: '12px 14px 16px',
          background: t.surface, borderRadius: 16,
          border: `1px solid ${t.divider}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center' }}>
            <MonoLabel t={t}>{checkedCount} of {checklist.length} steps</MonoLabel>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 12,
              fontWeight: 700, color: pillar }}>{checkPct}%</span>
          </div>
          {/* progress */}
          <div style={{ marginTop: 8, height: 6, borderRadius: 3,
            background: t.surface2, overflow: 'hidden' }}>
            <div style={{ width: checkPct + '%', height: '100%',
              background: pillar, borderRadius: 3 }}></div>
          </div>
          {/* steps */}
          <div style={{ marginTop: 14, display: 'flex',
            flexDirection: 'column', gap: 4 }}>
            {checklist.map((c, i) => (
              <div key={i} style={{
                padding: '10px 4px',
                display: 'flex', alignItems: 'center', gap: 11,
                borderTop: i > 0 ? `1px solid ${t.divider}` : 'none',
              }}>
                <div style={{
                  width: 22, height: 22, flexShrink: 0,
                  borderRadius: '50%',
                  background: c.done ? pillar : 'transparent',
                  border: c.done ? 'none' : `1.5px solid ${t.fgFaint}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c.done ? onPillar : 'transparent',
                }}>
                  {c.done && <IconCheck size={14} stroke={2.4}/>}
                </div>
                <div style={{ color: c.done ? t.fgMuted : t.fg,
                  display: 'flex', alignItems: 'center', gap: 6, marginLeft: -2 }}>
                  <c.Icon size={14} stroke={1.8} color={c.done ? t.fgFaint : pillar}/>
                </div>
                <div style={{ flex: 1, minWidth: 0,
                  fontFamily: t.fonts.body, fontSize: 12.5, fontWeight: 600,
                  textDecoration: c.done ? 'line-through' : 'none',
                  color: c.done ? t.fgFaint : t.fg }}>{c.lab}</div>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
                  fontWeight: 700, color: t.fgMuted,
                  textTransform: 'uppercase' }}>{c.prog}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Pillars of Progression */}
        <SectionHead t={t}>the 4 pillars of progression</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {LEVEL_PILLARS.map((p, i) => {
            const isOpen = openPillar === p.id;
            const colors = [t.pillar.train, t.pillar.eat, t.pillar.records, t.fg];
            const c = colors[i] || pillar;
            return (
              <button key={p.id}
                onClick={() => setOpenPillar(isOpen ? null : p.id)}
                style={{
                  textAlign: 'left', cursor: 'pointer',
                  padding: '12px 14px', borderRadius: 12,
                  background: isOpen ? c : t.surface,
                  color: isOpen ? (i === 3 ? t.bg : '#0A0908') : t.fg,
                  border: `1px solid ${isOpen ? c : t.divider}`,
                  fontFamily: 'inherit',
                  gridColumn: isOpen ? 'span 2' : 'span 1',
                  transition: 'all 0.2s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%',
                    background: isOpen ? 'currentColor' : c }}></div>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
                    fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    opacity: isOpen ? 0.75 : 1, color: 'inherit' }}>
                    Pillar {i + 1}</span>
                </div>
                <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
                  fontSize: 15, letterSpacing: '-0.02em', marginTop: 6,
                  lineHeight: 1.15 }}>{p.title}</div>
                {isOpen ? (
                  <div style={{ fontFamily: t.fonts.body, fontSize: 12,
                    lineHeight: 1.5, marginTop: 8, opacity: 0.85 }}>{p.body}</div>
                ) : (
                  <div style={{ fontFamily: t.fonts.body, fontSize: 11,
                    color: t.fgMuted, marginTop: 3 }}>{p.sub}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* 5 Core Rules — expandable */}
        <SectionHead t={t}>the 5 core rules</SectionHead>
        <div style={{ margin: '10px 20px 0', borderRadius: 16,
          overflow: 'hidden', border: `1px solid ${t.divider}`,
          background: t.surface }}>
          {LEVEL_RULES.map((r, i) => {
            const isOpen = openRule === r.id;
            return (
              <button key={r.id}
                onClick={() => setOpenRule(isOpen ? null : r.id)}
                style={{
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                  width: '100%', padding: '12px 14px',
                  borderTop: i > 0 ? `1px solid ${t.divider}` : 'none',
                  fontFamily: 'inherit',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: t.fonts.display, fontWeight: 800,
                      fontSize: 18, letterSpacing: '-0.03em', color: pillar }}>
                      0{i + 1}</span>
                    <div>
                      <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
                        fontSize: 14.5, letterSpacing: '-0.02em', color: t.fg }}>
                        {r.title}</div>
                      <div style={{ fontFamily: t.fonts.mono, fontSize: 9,
                        fontWeight: 700, letterSpacing: '0.14em',
                        color: t.fgFaint, textTransform: 'uppercase',
                        marginTop: 2 }}>{r.sub}</div>
                    </div>
                  </div>
                  <div style={{ color: t.fgFaint,
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s', display: 'flex' }}>
                    <IconChevronRight size={14} stroke={2}/>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                    color: t.fg, lineHeight: 1.55, marginTop: 10,
                    paddingTop: 10, borderTop: `1px solid ${t.divider}` }}>
                    {r.body}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Roadmap by phase */}
        <SectionHead t={t}>the 12 ranks of mastery</SectionHead>
        <div style={{ margin: '10px 20px 0' }}>
          {PHASES.map((ph, pi) => {
            const phaseLevels = LEVELS.filter(l => l.phase === ph.id);
            return (
              <div key={ph.id} style={{ marginTop: pi > 0 ? 14 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'baseline', padding: '0 4px 6px' }}>
                  <span style={{ fontFamily: t.fonts.display, fontWeight: 700,
                    fontSize: 13.5, letterSpacing: '-0.02em', color: t.fg }}>
                    {ph.label}</span>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
                    fontWeight: 700, letterSpacing: '0.14em',
                    color: t.fgFaint, textTransform: 'uppercase' }}>
                    {ph.range}</span>
                </div>
                <div style={{ background: t.surface, borderRadius: 14,
                  border: `1px solid ${t.divider}`, overflow: 'hidden' }}>
                  {phaseLevels.map((lv, i) => {
                    const isCurrent = lv.id === currentLevelId;
                    const isPast    = lv.id <  currentLevelId;
                    const isFuture  = lv.id >  currentLevelId;
                    const bg = isCurrent ? pillar : 'transparent';
                    const fg = isCurrent ? onPillar : t.fg;
                    return (
                      <div key={lv.id} style={{
                        padding: '10px 12px',
                        display: 'flex', alignItems: 'center', gap: 11,
                        background: bg,
                        borderBottom: i < phaseLevels.length - 1
                          ? `1px solid ${t.divider}` : 'none',
                        opacity: isFuture ? 0.55 : 1,
                      }}>
                        <div style={{
                          width: 34, height: 34, flexShrink: 0,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                          background: isCurrent ? onPillar + '15'
                                    : isPast ? pillar + '22' : t.surface2,
                          borderRadius: 9,
                        }}>
                          <svg width="26" height="26" viewBox="0 0 80 80">
                            <lv.Mark color={isCurrent ? onPillar
                              : isPast ? pillar : t.fgMuted} stroke={7}/>
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{
                              fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                              letterSpacing: '0.14em',
                              color: isCurrent ? onPillar + 'AA' : t.fgFaint,
                            }}>L{String(lv.id).padStart(2, '0')}</span>
                            <span style={{ fontFamily: t.fonts.display, fontWeight: 700,
                              fontSize: 14, letterSpacing: '-0.02em', color: fg }}>
                              {lv.name}
                            </span>
                          </div>
                          <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
                            color: isCurrent ? onPillar + 'CC' : t.fgMuted,
                            marginTop: 1, lineHeight: 1.35,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>{lv.summary}</div>
                        </div>
                        {isPast && (
                          <div style={{ color: pillar }}>
                            <IconCheck size={14} stroke={2.4}/>
                          </div>
                        )}
                        {isCurrent && (
                          <div style={{
                            fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                            letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: onPillar, background: onPillar + '22',
                            padding: '3px 7px', borderRadius: 4,
                          }}>NOW</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Foot */}
        <div style={{ margin: '24px 20px 30px', textAlign: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 80 80"
            style={{ opacity: 0.4 }}>
            <F5 color={t.fg} stroke={6}/>
          </svg>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 600,
            letterSpacing: '0.22em', color: t.fgFaint, marginTop: 6,
            textTransform: 'uppercase' }}>
            SOMA · holistic level guide</div>
        </div>
      </div>

      <TabBar t={t} active={-1} onTab={onTab} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

Object.assign(window, { LevelScreen });
