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

export function ProfileScreen({ t, onNav, onMenu, onPlus }) {
  const currentLevel = LEVELS.find(l => l.id === 4);

  return (
    <ScreenFrame t={t} accentColor={t.fg}>
      <StatusBar t={t} />
      <div style={{
        padding: '4px 14px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MenuButton t={t} onMenu={onMenu} />
          <WordmarkWithMark Mark={F5} size={22} color={t.fg} />
        </div>
        <MonoLabel t={t}>yo</MonoLabel>
      </div>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>
        {/* Avatar + name */}
        <div style={{ margin: '18px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: t.s2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
            letterSpacing: '-0.04em', color: t.fgMuted,
          }}>
            EC
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
              letterSpacing: '-0.035em', color: t.fg,
            }}>Esteban Castillo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 80 80">
                <currentLevel.Mark color={t.pillar.records} stroke={8} />
              </svg>
              <span style={{ fontFamily: t.fonts.body, fontSize: 12, color: t.fgMuted }}>
                L4 · {currentLevel.name} · CrossFit RX · 423d
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          margin: '18px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          background: t.surface, borderRadius: 18,
          border: '1px solid ' + t.divider, overflow: 'hidden',
        }}>
          {[
            { lab: 'ENTRENOS', val: '287', col: t.pillar.train   },
            { lab: 'STREAK',   val: '12d', col: t.secondary       },
            { lab: 'PRS',      val: '34',  col: t.pillar.records  },
          ].map((s, i, arr) => (
            <div key={i} style={{
              padding: '14px 10px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid ' + t.divider : 'none',
            }}>
              <div style={{
                fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
                letterSpacing: '-0.035em', color: t.fg,
              }}>{s.val}</div>
              <div style={{
                width: 16, height: 2, background: s.col,
                borderRadius: 1, margin: '4px auto 4px',
              }} />
              <MonoLabel t={t}>{s.lab}</MonoLabel>
            </div>
          ))}
        </div>

        <SectionHead t={t}>tu perfil</SectionHead>
        {[
          { lab: 'Inventario de movimiento', sub: '47 movimientos'                   },
          { lab: 'Equipo de gym',            sub: '12 implementos'                   },
          { lab: 'Equipo de cocina',         sub: '8 utensilios'                     },
          { lab: 'Suplementos',              sub: '4 activos'                         },
          { lab: 'Lesiones',                 sub: 'ninguna activa'                    },
          { lab: 'Ciclo menstrual',          sub: 'Fase folicular · día 8'            },
          { lab: 'Biotipos & Psicología',    sub: 'ADHD · Energía masculina/femenina' },
        ].map((m, i) => (
          <div key={i} style={{
            margin: '6px 20px 0', padding: '13px 14px', background: t.surface,
            borderRadius: 11, border: '1px solid ' + t.divider,
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg,
              }}>{m.lab}</div>
              <div style={{
                fontFamily: t.fonts.body, fontSize: 11, color: t.fgMuted, marginTop: 1,
              }}>{m.sub}</div>
            </div>
            <IconChevronRight size={16} color={t.fgFaint} />
          </div>
        ))}

        <SectionHead t={t}>ajustes</SectionHead>
        {['Unidades (kg / lb)', 'Idioma', 'Dark mode', 'Notificaciones', 'Privacidad'].map((s, i) => (
          <div key={i} style={{
            margin: '6px 20px 0', padding: '13px 14px', background: t.surface,
            borderRadius: 11, border: '1px solid ' + t.divider,
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{
              flex: 1, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13, color: t.fg,
            }}>{s}</div>
            <IconChevronRight size={16} color={t.fgFaint} />
          </div>
        ))}
      </div>

      <Fab t={t} onClick={onPlus} />
    </ScreenFrame>
  );
}
