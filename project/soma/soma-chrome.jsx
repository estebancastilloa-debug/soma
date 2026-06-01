// SOMA — shared screen chrome.
// All screen-level building blocks live here so individual screens stay short.
// Tokens come in as `t` (from tokens({mode,accentId})).

const {
  IconSignal, IconWifi, IconBattery,
  IconHome, IconTrain, IconEat, IconRecords, IconJournal, IconProfile,
  IconBell, IconPlus, IconChevronRight, IconChevronLeft,
} = window;

// Status bar — top of every screen
function StatusBar({ t }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 20px 0', color: t.fg, fontFamily: t.fonts.body,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ fontFamily: t.fonts.mono, letterSpacing: '-0.02em' }}>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center', color: t.fg }}>
        <IconSignal size={14} stroke={1.6} />
        <IconWifi size={14} stroke={1.6} />
        <IconBattery size={20} stroke={1.6} />
      </span>
    </div>
  );
}

// Hamburger button — top-left of every screen, opens the DrawerMenu.
function MenuButton({ t, onMenu, color }) {
  const c = color || t.fg;
  return (
    <button onClick={onMenu} style={{
      border: 'none', background: 'transparent', padding: 0,
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: c, width: 32, height: 32,
      flexShrink: 0,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <line x1="4" y1="7"  x2="20" y2="7"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="17" x2="14" y2="17"/>
      </svg>
    </button>
  );
}

// FAB — floating + button at bottom-right. Opens AddSheet (quick log).
function Fab({ t, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', right: 18, bottom: 26, zIndex: 30,
      width: 56, height: 56, borderRadius: '50%',
      background: t.accent, color: t.onAccent, border: 'none',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: t.mode === 'dark'
        ? `0 10px 26px ${t.accent}44, 0 4px 10px rgba(0,0,0,0.4)`
        : `0 10px 26px ${t.accent}66, 0 4px 10px rgba(0,0,0,0.12)`,
    }}>
      <IconPlus size={26} stroke={2.4}/>
    </button>
  );
}

// Legacy TabBar — now renders ONLY the FAB. The bottom tab bar is gone.
// Screens still call <TabBar t={t} onPlus={...}/> at the end; they get a FAB.
// `active` and `onTab` are ignored (kept for backwards compatibility).
function TabBar({ t, onPlus }) {
  return <Fab t={t} onClick={onPlus}/>;
}

// ── Drawer Menu ───────────────────────────────────────────────────
// Slides in from the LEFT. Replaces the bottom tab bar entirely.
// Lists every screen the user can reach, grouped by domain.
function DrawerMenu({ t, open, onClose, tab, onTab, Mark }) {
  if (!open) return null;
  const onPillar = '#0A0908';

  const groups = [
    { title: 'Today', items: [
      { id: 'home',    lab: 'Home',         Icon: IconHome,    color: t.fg },
    ]},
    { title: 'Body', items: [
      { id: 'train',   lab: 'Entrena',      Icon: IconTrain,   color: t.pillar.train,
        sub: 'WODs · movements · history' },
      { id: 'import',  lab: 'Importar',     Icon: IconJournal, color: t.pillar.train,
        sub: 'Pega tu semana de NotebookLM' },
      { id: 'eat',     lab: 'Come',         Icon: IconEat,     color: t.pillar.eat,
        sub: 'Calories · meals · pantry' },
      { id: 'records', lab: 'Records',      Icon: IconRecords, color: t.pillar.records,
        sub: 'PRs · heatmap · imbalances' },
    ]},
    { title: 'Mind', items: [
      { id: 'level',   lab: 'SOMA Level',   Icon: window.IconBalance, color: t.pillar.records,
        sub: 'Your holistic level · 1 of 12' },
      { id: 'journal', lab: 'Bitácora',     Icon: IconJournal, color: t.fg,
        sub: 'Mood · habits · prompts' },
    ]},
    { title: 'You', items: [
      { id: 'me',      lab: 'Yo · Profile', Icon: IconProfile, color: t.fg,
        sub: 'Stats · inventories · settings' },
    ]},
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex',
    }}>
      {/* Drawer panel */}
      <div style={{
        width: '78%', maxWidth: 300, height: '100%',
        background: t.bg, color: t.fg,
        display: 'flex', flexDirection: 'column',
        boxShadow: '12px 0 60px rgba(0,0,0,0.4)',
        animation: 'slideIn 0.18s ease-out forwards',
      }}>
        {/* Logo + close */}
        <div style={{ padding: '40px 20px 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline',
            fontFamily: t.fonts.display, fontWeight: 800,
            fontSize: 30, letterSpacing: '-0.04em', color: t.fg,
            lineHeight: 1 }}>
            <span>S</span>
            <span style={{ display: 'inline-block', width: 26, height: 26,
              margin: '0 -1px' }}>
              <svg viewBox="0 0 80 80" width="26" height="26"
                style={{ display: 'block' }}>
                <Mark color={t.fg} stroke={9}/>
              </svg>
            </span>
            <span>MA</span>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: t.surface2, color: t.fg,
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
          }}>×</button>
        </div>
        <div style={{ padding: '0 20px',
          fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.2em', color: t.fgFaint, textTransform: 'uppercase' }}>
          body · mind · time
        </div>

        {/* Groups */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 0 30px' }}>
          {groups.map((g, gi) => (
            <div key={g.title} style={{ marginTop: gi > 0 ? 20 : 0 }}>
              <div style={{ padding: '0 20px 8px' }}>
                <MonoLabel t={t}>{g.title}</MonoLabel>
              </div>
              {g.items.map(it => {
                const on = tab === it.id;
                return (
                  <button key={it.id}
                    onClick={() => { onTab && onTab(it.id); onClose && onClose(); }}
                    style={{
                      width: '100%', border: 'none',
                      background: on ? it.color : 'transparent',
                      color: on ? onPillar : t.fg,
                      cursor: 'pointer', textAlign: 'left',
                      padding: '11px 20px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      fontFamily: 'inherit',
                    }}>
                    <div style={{
                      width: 30, height: 30, flexShrink: 0,
                      borderRadius: 8,
                      background: on ? onPillar + '15' : t.surface,
                      color: on ? onPillar : it.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <it.Icon size={17} stroke={1.9}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
                        fontSize: 13.5 }}>{it.lab}</div>
                      {it.sub && <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
                        color: on ? onPillar + 'BB' : t.fgMuted, marginTop: 1 }}>
                        {it.sub}</div>}
                    </div>
                    {on && <IconChevronRight size={14} color={onPillar}/>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px 20px',
          borderTop: `1px solid ${t.divider}`,
          fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.16em', color: t.fgFaint, textTransform: 'uppercase',
          lineHeight: 1.8 }}>
          <div>v0.7 · soma</div>
        </div>
      </div>

      {/* Scrim */}
      <div onClick={onClose} style={{
        flex: 1, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(2px)',
      }}/>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ── + Action Sheet ────────────────────────────────────────────────
// Bottom-sheet that slides up when + tab is tapped. Provides:
//   1) Quick log row (Workout / Meal / Mood / Weight / Water)
//   2) Sections (Records, Bitácora, Level, Movements, Equipment, …)
function AddSheet({ t, open, onClose, onNav }) {
  if (!open) return null;
  const onPillar = '#0A0908';

  const quick = [
    { id: 'workout', lab: 'Workout', Icon: window.IconDumbbellSmall, col: t.pillar.train },
    { id: 'meal',    lab: 'Meal',    Icon: window.IconEat,           col: t.pillar.eat },
    { id: 'mood',    lab: 'Mood',    Icon: window.IconHeart,         col: t.secondary },
    { id: 'water',   lab: 'Water',   Icon: window.IconWater,         col: t.tertiary },
    { id: 'weight',  lab: 'Weight',  Icon: window.IconBalance,       col: t.fg },
  ];

  const sections = [
    {
      title: 'Workout entry',
      items: [
        { id: 'movement',    lab: 'New movement',       Icon: window.IconPlus,           sub: 'Multiple-movement templates', color: t.pillar.train },
        { id: 'editmove',    lab: 'Edit movement',      Icon: window.IconDumbbellSmall,  sub: 'Reps · weight · time',         color: t.pillar.train },
        { id: 'searchmove',  lab: 'Search movements',   Icon: window.IconSignal,         sub: '500+ catalog',                 color: t.pillar.train },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { id: 'gym-eq',   lab: 'Gym equipment',  Icon: window.IconDumbbellSmall,  sub: '12 items',         color: t.fg },
        { id: 'machines', lab: 'Machines',       Icon: window.IconRecords,        sub: 'Concept2, Rogue…', color: t.fg },
        { id: 'kitchen',  lab: 'Kitchen tools',  Icon: window.IconEat,            sub: '8 utensilios',     color: t.fg },
        { id: 'supps',    lab: 'Supplements',    Icon: window.IconFat,            sub: '4 active',         color: t.fg },
      ],
    },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 0.18s ease-out',
    }}>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)',
      }}/>
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: t.bg, borderRadius: '24px 24px 0 0',
        padding: '12px 0 24px',
        maxHeight: '85%', overflow: 'auto',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: t.fgFaint, opacity: 0.5,
          margin: '0 auto 16px' }}></div>

        {/* Header */}
        <div style={{ padding: '0 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
            fontSize: 22, letterSpacing: '-0.03em', color: t.fg }}>
            Quick log</div>
          <button onClick={onClose} style={{
            border: 'none', background: t.surface2, color: t.fg,
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
          }}>×</button>
        </div>

        {/* Quick log grid */}
        <div style={{ margin: '14px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {quick.map((q, i) => (
            <button key={q.id}
              onClick={() => { onNav && onNav('log:' + q.id); onClose && onClose(); }}
              style={{
                border: 'none', cursor: 'pointer',
                padding: '12px 6px', borderRadius: 12,
                background: t.surface, color: q.col,
                fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 5,
              }}>
              {q.Icon && <q.Icon size={20} stroke={1.9}/>}
              <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
                fontWeight: 700, letterSpacing: '0.14em',
                color: t.fg, textTransform: 'uppercase' }}>{q.lab}</span>
            </button>
          ))}
        </div>

        {/* Featured — import a full week from NotebookLM */}
        <button onClick={() => { onNav && onNav('import'); onClose && onClose(); }}
          style={{
            margin: '14px 20px 0', width: 'calc(100% - 40px)',
            border: 'none', cursor: 'pointer', textAlign: 'left',
            padding: '14px 15px', borderRadius: 16,
            background: t.accent, color: t.onAccent,
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: 'inherit',
          }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: '#0A090815', display: 'flex', alignItems: 'center',
            justifyContent: 'center' }}>
            {window.IconJournal && <window.IconJournal size={20} stroke={2}/>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 15,
              letterSpacing: '-0.02em' }}>Importar de NotebookLM</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 11, opacity: 0.82,
              marginTop: 1 }}>Pega la semana entera → se crea sola</div>
          </div>
          {window.IconChevronRight && <window.IconChevronRight size={18} stroke={2.4}/>}
        </button>

        {/* Sections */}
        {sections.map(sec => (
          <div key={sec.title} style={{ marginTop: 22 }}>
            <div style={{ padding: '0 20px 8px' }}>
              <MonoLabel t={t}>{sec.title}</MonoLabel>
            </div>
            <div style={{ margin: '0 20px', borderRadius: 14,
              background: t.surface, border: `1px solid ${t.divider}`,
              overflow: 'hidden' }}>
              {sec.items.map((it, i) => (
                <button key={it.id}
                  onClick={() => { onNav && onNav(it.id); onClose && onClose(); }}
                  style={{
                    width: '100%', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    padding: '13px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: 'inherit', textAlign: 'left',
                    borderTop: i > 0 ? `1px solid ${t.divider}` : 'none',
                  }}>
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    borderRadius: 8, background: t.surface2,
                    color: it.color || t.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {it.Icon && <it.Icon size={17} stroke={1.9}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
                      fontSize: 13, color: t.fg }}>{it.lab}</div>
                    <div style={{ fontFamily: t.fonts.body, fontSize: 11,
                      color: t.fgMuted, marginTop: 1 }}>{it.sub}</div>
                  </div>
                  <IconChevronRight size={16} color={t.fgFaint}/>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pillar header — large title + small Mark dot in pillar color (top-right).
// Now always shows a hamburger MenuButton on the left.
function PillarHeader({ t, title, sub, pillarColor, Mark, onMenu, onBack }) {
  return (
    <div style={{ padding: '4px 14px 0', display: 'flex',
      justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flex: 1 }}>
        {onMenu && <MenuButton t={t} onMenu={onMenu}/>}
        {onBack && !onMenu && (
          <button onClick={onBack}
            style={{ border: 'none', background: 'transparent', padding: 0,
              color: t.fg, cursor: 'pointer', display: 'flex', marginTop: 4 }}>
            <IconChevronLeft size={20} stroke={2} color={t.fg} />
          </button>
        )}
        <div style={{ paddingTop: 4 }}>
          {title && <div style={{
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 26,
            letterSpacing: '-0.035em', lineHeight: 1.05, color: t.fg,
          }}>{title}</div>}
          {sub && <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
            color: t.fgMuted, marginTop: 3, letterSpacing: 0.05 }}>{sub}</div>}
        </div>
      </div>
      {pillarColor && Mark && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: pillarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 80 80">
            <Mark color={pillarColor === t.pillar.eat || pillarColor === t.pillar.train
              ? '#0A0908' : (t.mode === 'dark' ? '#0A0908' : '#FAF8F3')} stroke={8} />
          </svg>
        </div>
      )}
    </div>
  );
}

function MonoLabel({ t, children, color }) {
  return (
    <div style={{
      fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
      letterSpacing: '0.18em', color: color || t.fgFaint,
      textTransform: 'uppercase',
    }}>{children}</div>
  );
}

function ScreenFrame({ t, children, accent }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg, color: t.fg,
      position: 'relative', overflow: 'hidden',
      fontFamily: t.fonts.body,
    }}>
      {/* Big watermark Mark — gives every screen brand presence */}
      {accent && accent.Mark && (
        <div style={{
          position: 'absolute', right: -60, top: 200,
          width: 280, height: 280,
          opacity: t.mode === 'dark' ? 0.04 : 0.05,
          pointerEvents: 'none', zIndex: 0,
        }}>
          <svg viewBox="0 0 80 80" width="100%" height="100%">
            <accent.Mark color={accent.color || t.fg} stroke={4}/>
          </svg>
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

// Section heading inside a screen.
function SectionHead({ t, children, actionLabel, onAction }) {
  return (
    <div style={{ padding: '20px 20px 0', display: 'flex',
      justifyContent: 'space-between', alignItems: 'baseline' }}>
      <MonoLabel t={t}>{children}</MonoLabel>
      {actionLabel && (
        <button onClick={onAction} style={{
          border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
          fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.16em', color: t.fgMuted, textTransform: 'uppercase',
        }}>{actionLabel}</button>
      )}
    </div>
  );
}

// Pillar tag — colored chip used inside cards
function PillarTag({ t, pillar, children }) {
  const map = {
    train:   { bg: t.pillar.train,   fg: '#0A0908' },
    eat:     { bg: t.pillar.eat,     fg: '#0A0908' },
    records: { bg: t.pillar.records, fg: '#0A0908' },
    journal: { bg: t.fg,             fg: t.bg },
  };
  const { bg, fg } = map[pillar] || { bg: t.surface2, fg: t.fg };
  return (
    <span style={{
      fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      background: bg, color: fg, padding: '3px 7px', borderRadius: 4,
    }}>{children}</span>
  );
}

// Photo placeholder — for food, exercise, profile. Pattern based on pillar.
function PhotoPlaceholder({ t, pillar, label, size = 'sq' }) {
  const colors = {
    eat:     [t.pillar.eat, '#FFA776', '#F2EFE6'],
    train:   [t.pillar.train, '#A3C638', '#15120E'],
    records: [t.pillar.records, '#A0C0FF', '#15120E'],
  };
  const palette = colors[pillar] || [t.fg, t.fgMuted, t.bg];
  const aspectStyle = size === 'wide' ? { aspectRatio: '16 / 9' }
                    : size === 'tall' ? { aspectRatio: '3 / 4' }
                    : { aspectRatio: '1' };
  return (
    <div style={{
      ...aspectStyle, width: '100%', borderRadius: 12, overflow: 'hidden',
      position: 'relative',
      background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
    }}>
      {/* abstract food/plate decoration */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <circle cx="50" cy="55" r="34" fill="none" stroke={palette[2]}
          strokeWidth="1.5" />
        <circle cx="50" cy="55" r="22" fill="none" stroke={palette[2]}
          strokeWidth="1" opacity="0.6" />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', bottom: 8, left: 10, right: 10,
          fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.14em', color: palette[2], textTransform: 'uppercase',
          opacity: 0.7,
        }}>{label}</div>
      )}
    </div>
  );
}

Object.assign(window, {
  StatusBar, TabBar, AddSheet, PillarHeader, MonoLabel,
  ScreenFrame, SectionHead, PillarTag, PhotoPlaceholder,
  MenuButton, Fab, DrawerMenu,
});
