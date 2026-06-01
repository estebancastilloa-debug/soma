import { useState } from 'react';
import {
  StatusBar, PillarHeader, MonoLabel, SectionHead, ScreenFrame, Fab,
  MenuButton, BackButton, PillarTag,
} from '../chrome.jsx';
import {
  IconDumbbellSmall, IconBolt, IconArrowUp, IconFlame, IconRecords,
  IconBalance, IconStreak, IconHeart, IconCheck, IconChevronRight,
  IconProfile, IconProtein, IconRecovery,
} from '../icons.jsx';
import { F5, WordmarkWithMark } from '../marks.jsx';
import { LEVELS, PHASES, LEVEL_RULES, LEVEL_PILLARS } from '../data/levels.js';

export function LevelScreen({ t, onNav, onMenu, onPlus }) {
  const [openRule, setOpenRule] = useState(null);
  const [openPillar, setOpenPillar] = useState(null);

  const current = LEVELS.find(l => l.id === 4); // Wellness Ranger
  const next = LEVELS.find(l => l.id === 5);
  const pillar = t.pillar.records;
  const onPillar = '#0A0908';

  return (
    <ScreenFrame t={t} accentColor={pillar}>
      <StatusBar t={t} />
      <PillarHeader t={t} title="SOMA" sub="Level" pillarColor={pillar} onMenu={onMenu} />

      {/* Hero */}
      <div style={{
        margin: '14px 20px 0', padding: '20px 18px', background: pillar,
        color: onPillar, borderRadius: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#0A090815',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="56" height="56" viewBox="0 0 80 80">
              <current.Mark color={onPillar} stroke={6} />
            </svg>
          </div>
          <div>
            <MonoLabel t={t} color={onPillar + '88'}>l4 of 12 · wellness</MonoLabel>
            <div style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
              letterSpacing: '-0.035em', lineHeight: 1.1, marginTop: 4,
            }}>
              {current.name}
            </div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 11.5, opacity: 0.75, marginTop: 4 }}>
              {current.summary}
            </div>
          </div>
        </div>
        {/* Progress to next */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #0A090820' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{
              fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.14em', opacity: 0.7,
            }}>
              HASTA {next?.name?.toUpperCase()}
            </span>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700 }}>78%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#0A090820' }}>
            <div style={{
              width: '78%', height: '100%', background: onPillar, borderRadius: 3, opacity: 0.8,
            }} />
          </div>
        </div>
        <svg
          width="140"
          height="140"
          viewBox="0 0 80 80"
          style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.1 }}
        >
          <F5 color={onPillar} stroke={4} />
        </svg>
      </div>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>
        {/* Confidence + imbalance flags */}
        <div style={{ margin: '12px 20px 0', display: 'flex', gap: 8 }}>
          {[
            { col: t.semantic.mid, lab: 'CONFIDENCE · YELLOW' },
            { col: t.semantic.ok,  lab: 'NO IMBALANCE FLAGS'  },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 999,
              background: f.col + '22', border: '1px solid ' + f.col,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: f.col }} />
              <span style={{
                fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                letterSpacing: '0.14em', color: f.col, textTransform: 'uppercase',
              }}>{f.lab}</span>
            </div>
          ))}
        </div>

        {/* Checklist "how to level up" */}
        <SectionHead t={t}>para subir al siguiente nivel</SectionHead>
        {[
          { Icon: IconStreak,   lab: '8 more training days',      prog: '36/45',   done: false },
          { Icon: IconFlame,    lab: 'Complete 1 more benchmark',  prog: '3/4',     done: false },
          { Icon: IconBalance,  lab: 'Add cardio modality',        prog: '2/3 mod', done: false },
          { Icon: IconRecovery, lab: 'Hit Green confidence',       prog: 'yellow',  done: false },
          { Icon: IconProtein,  lab: 'Log macros 7 days in a row', prog: '7/7',     done: true  },
          { Icon: IconHeart,    lab: 'Journal 5 days in a row',    prog: '5/5',     done: true  },
        ].map((c, i) => (
          <div key={i} style={{
            margin: '6px 20px 0', padding: '12px 14px', background: t.surface,
            borderRadius: 12, border: '1px solid ' + t.divider,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: c.done ? t.semantic.ok : t.s2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: c.done ? '#0A0908' : t.fgMuted,
            }}>
              {c.done
                ? <IconCheck size={18} stroke={2.2} />
                : <c.Icon size={18} stroke={1.9} />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg,
                textDecoration: c.done ? 'line-through' : 'none',
                opacity: c.done ? 0.5 : 1,
              }}>{c.lab}</div>
              <div style={{
                fontFamily: t.fonts.mono, fontSize: 10, color: t.fgMuted, marginTop: 1,
              }}>{c.prog}</div>
            </div>
            {c.done && <IconCheck size={16} stroke={2} color={t.semantic.ok} />}
          </div>
        ))}

        {/* 4 Pillars accordion */}
        <SectionHead t={t}>the 4 pillars</SectionHead>
        {LEVEL_PILLARS.map(p => (
          <div key={p.id} style={{
            margin: '6px 20px 0', borderRadius: 12,
            border: '1px solid ' + t.divider, overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpenPillar(openPillar === p.id ? null : p.id)}
              style={{
                width: '100%', padding: '13px 14px', background: t.surface,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg,
                }}>{p.title}</div>
                <div style={{
                  fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgMuted,
                  letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2,
                }}>{p.sub}</div>
              </div>
              <IconChevronRight
                size={16}
                color={t.fgFaint}
                style={{
                  transform: openPillar === p.id ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            {openPillar === p.id && (
              <div style={{
                padding: '0 14px 14px', background: t.surface,
                fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.5,
              }}>{p.body}</div>
            )}
          </div>
        ))}

        {/* 5 Rules accordion */}
        <SectionHead t={t}>the 5 core rules</SectionHead>
        {LEVEL_RULES.map(r => (
          <div key={r.id} style={{
            margin: '6px 20px 0', borderRadius: 12,
            border: '1px solid ' + t.divider, overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpenRule(openRule === r.id ? null : r.id)}
              style={{
                width: '100%', padding: '13px 14px', background: t.surface,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: pillar,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700,
                color: onPillar, flexShrink: 0,
              }}>
                {LEVEL_RULES.indexOf(r) + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg,
                }}>{r.title}</div>
                <div style={{
                  fontFamily: t.fonts.mono, fontSize: 9, color: t.fgMuted,
                  letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1,
                }}>{r.sub}</div>
              </div>
              <IconChevronRight size={16} color={t.fgFaint} />
            </button>
            {openRule === r.id && (
              <div style={{
                padding: '0 14px 14px', background: t.surface,
                fontFamily: t.fonts.body, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.5,
              }}>{r.body}</div>
            )}
          </div>
        ))}

        {/* Full roadmap */}
        <SectionHead t={t}>roadmap completo</SectionHead>
        {PHASES.map(phase => (
          <div key={phase.id} style={{ margin: '10px 20px 0' }}>
            <div style={{
              fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.18em', color: t.fgFaint, textTransform: 'uppercase',
              marginBottom: 6,
            }}>{phase.label} · {phase.range}</div>
            {LEVELS.filter(l => l.phase === phase.id).map(lv => (
              <div key={lv.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid ' + t.divider,
                opacity: lv.id < 4 ? 0.4 : lv.id === 4 ? 1 : 0.65,
              }}>
                <svg width="28" height="28" viewBox="0 0 80 80">
                  <lv.Mark color={lv.id === 4 ? pillar : t.fgFaint} stroke={7} />
                </svg>
                <div>
                  <div style={{
                    fontFamily: t.fonts.body,
                    fontWeight: lv.id === 4 ? 700 : 500,
                    fontSize: 12.5,
                    color: lv.id === 4 ? t.fg : t.fgMuted,
                  }}>L{lv.id} · {lv.name}</div>
                  <div style={{
                    fontFamily: t.fonts.body, fontSize: 11, color: t.fgFaint, marginTop: 1,
                  }}>{lv.goal}</div>
                </div>
                {lv.id === 4 && (
                  <div style={{
                    marginLeft: 'auto', fontFamily: t.fonts.mono,
                    fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em',
                    background: pillar, color: onPillar, padding: '3px 7px', borderRadius: 4,
                  }}>ACTUAL</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Fab t={t} onClick={onPlus} />
    </ScreenFrame>
  );
}
