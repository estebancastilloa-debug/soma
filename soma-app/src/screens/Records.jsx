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

export function RecordsScreen({ t, onNav, onMenu, onPlus }) {
  const pillar = t.pillar.records;
  const onPillar = '#0A0908';

  // 42 days for heatmap
  const days = Array.from({ length: 42 }, (_, i) => {
    if (i < 5 || i > 38) return 0;
    const r = ((i * 13) % 7);
    return r > 4 ? 2 : r > 2 ? 1 : r > 1 ? 0.5 : 0;
  });

  const currentLevel = LEVELS.find(l => l.id === 4); // Wellness Ranger

  return (
    <ScreenFrame t={t} accentColor={pillar}>
      <StatusBar t={t} />
      <PillarHeader
        t={t}
        title="Records"
        sub="Tu progreso, cruzado."
        pillarColor={pillar}
        onMenu={onMenu}
      />

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>
        {/* Level card — tap goes to level screen */}
        <button
          onClick={() => onNav('level')}
          style={{
            margin: '14px 20px 0',
            padding: '14px 16px',
            background: pillar,
            color: onPillar,
            borderRadius: 18,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            width: 'calc(100% - 40px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#0A090815', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="44" height="44" viewBox="0 0 80 80">
              <currentLevel.Mark color={onPillar} stroke={6} />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <MonoLabel t={t} color={onPillar + 'AA'}>soma level · l4 de 12</MonoLabel>
            <div style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
              letterSpacing: '-0.03em', marginTop: 3,
            }}>
              {currentLevel.name}
            </div>
            <div style={{
              fontFamily: t.fonts.body, fontSize: 11, opacity: 0.75, marginTop: 1,
            }}>
              78% al siguiente nivel · {currentLevel.es}
            </div>
          </div>
          <IconChevronRight size={18} />
          <svg
            width="120"
            height="120"
            viewBox="0 0 80 80"
            style={{ position: 'absolute', right: -20, top: -20, opacity: 0.12 }}
          >
            <F5 color={onPillar} stroke={4} />
          </svg>
        </button>

        {/* Heatmap */}
        <div style={{
          margin: '12px 20px 0', padding: 16, background: t.surface,
          borderRadius: 18, border: '1px solid ' + t.divider,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconFlame size={14} color={t.secondary} />
              <MonoLabel t={t}>training days · mayo</MonoLabel>
            </div>
            <span style={{
              fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700, color: t.fg,
            }}>22/31</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 12,
          }}>
            {days.map((d, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: 4,
                  background: d === 0 ? t.s2 : d === 0.5 ? t.fgFaint : d === 1 ? pillar + 'AA' : pillar,
                  opacity: d === 0 ? 0.5 : 1,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'center' }}>
            {[[t.s2, 'Ninguno'], [pillar + 'AA', 'Parcial'], [pillar, 'Completo']].map(([bg, lab]) => (
              <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: bg }} />
                <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5, color: t.fgFaint }}>{lab}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRs */}
        <SectionHead t={t}>prs · este mes</SectionHead>
        {[
          { lift: 'Back squat',  val: '142kg', delta: '+4',   isNew: true,  Icon: IconDumbbellSmall, col: pillar       },
          { lift: 'Snatch',      val: '78kg',  delta: '+2',   isNew: false, Icon: IconBolt,          col: t.secondary  },
          { lift: 'Strict pull', val: '14',    delta: '+1',   isNew: false, Icon: IconArrowUp,       col: t.fg         },
          { lift: 'Fran',        val: '5:42',  delta: '-18s', isNew: false, Icon: IconFlame,         col: t.tertiary   },
        ].map((p, i) => (
          <div key={i} style={{
            margin: '6px 20px 0', padding: '11px 14px', background: t.surface,
            borderRadius: 12, border: '1px solid ' + t.divider,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, background: t.s2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: p.col, flexShrink: 0,
            }}>
              <p.Icon size={15} stroke={1.9} />
            </div>
            <div style={{
              flex: 1, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg,
            }}>
              {p.lift}
              {p.isNew && (
                <span style={{
                  fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                  letterSpacing: '0.14em', background: pillar, color: onPillar,
                  padding: '2px 5px', borderRadius: 3, marginLeft: 8, verticalAlign: 'middle',
                }}>PR</span>
              )}
            </div>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 14, color: t.fg }}>
              {p.val}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              fontFamily: t.fonts.mono, fontSize: 11, color: t.semantic.ok,
            }}>
              <IconArrowUp size={11} stroke={2.2} />{p.delta}
            </span>
          </div>
        ))}

        {/* Modality breakdown */}
        <SectionHead t={t}>modalidad · últimas 8 semanas</SectionHead>
        <div style={{
          margin: '10px 20px 0', padding: 16, background: t.surface,
          borderRadius: 16, border: '1px solid ' + t.divider,
        }}>
          {[
            { lab: 'Fuerza',       pct: 35, col: pillar       },
            { lab: 'MetCon',       pct: 28, col: t.secondary   },
            { lab: 'Halterofilia', pct: 20, col: t.tertiary    },
            { lab: 'Gimnasia',     pct: 17, col: t.fg          },
          ].map((m, i) => (
            <div key={i} style={{ marginTop: i > 0 ? 10 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontFamily: t.fonts.body, fontSize: 12, color: t.fg }}>{m.lab}</span>
                <span style={{
                  fontFamily: t.fonts.mono, fontSize: 12, fontWeight: 700, color: t.fg,
                }}>{m.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: t.s2, overflow: 'hidden' }}>
                <div style={{
                  width: m.pct + '%', height: '100%', background: m.col, borderRadius: 3,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Fab t={t} onClick={onPlus} />
    </ScreenFrame>
  );
}
