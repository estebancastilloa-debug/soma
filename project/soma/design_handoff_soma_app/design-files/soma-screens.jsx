// SOMA — 6 app screens, fully styled, using design tokens.
// All screens are 320 × 680 (iPhone proportion). They accept { Mark, weight, t }
// where t = tokens({mode, accentId}). weight = 700 | 800.

const {
  WordmarkWithMark,
  IconHome, IconTrain, IconEat, IconRecords, IconJournal, IconProfile,
  IconPlus, IconChevronRight, IconArrowUp,
  IconSignal, IconWifi, IconBattery,
  MOOD_ICONS,
} = window;

// ── Shared chrome ────────────────────────────────────────────────
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

function TabBar({ t, active = 0, Mark, onTab }) {
  const tabs = [
    { id: 'home',    label: 'Home',     Icon: IconHome },
    { id: 'train',   label: 'Entrena',  Icon: IconTrain },
    { id: 'eat',     label: 'Come',     Icon: IconEat },
    { id: 'records', label: 'Records',  Icon: IconRecords },
    { id: 'me',      label: 'Yo',       Icon: IconProfile },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: t.surface, borderTop: `1px solid ${t.divider}`,
      padding: '10px 0 22px',
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
    }}>
      {tabs.map((tab, i) => {
        const isActive = i === active;
        const { Icon } = tab;
        return (
          <button key={tab.id}
            onClick={() => onTab && onTab(tab.id)}
            style={{
              border: 'none', background: 'transparent',
              padding: 0, cursor: onTab ? 'pointer' : 'default',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: isActive ? t.fg : t.fgFaint,
              fontFamily: 'inherit',
            }}>
            <div style={{ width: 24, height: 24, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: isActive ? t.fg : t.fgFaint }}>
              <Icon size={22} stroke={isActive ? 2 : 1.6} />
            </div>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase' }}>{tab.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function ScreenHeader({ t, font, Mark, title, sub }) {
  return (
    <div style={{ padding: '8px 20px 0', display: 'flex',
      justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        {title && <div style={{
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 26,
          letterSpacing: '-0.035em', lineHeight: 1.05, color: t.fg,
        }}>{title}</div>}
        {sub && <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
          color: t.fgMuted, marginTop: 3, letterSpacing: 0.05 }}>{sub}</div>}
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: t.surface2,
        flexShrink: 0,
      }}></div>
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

function ScreenFrame({ t, children }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg, color: t.fg,
      position: 'relative', overflow: 'hidden',
      fontFamily: t.fonts.body,
    }}>
      {children}
    </div>
  );
}

// ── 1 · Dashboard ─────────────────────────────────────────────────
function DashboardScreen({ Mark, weight, t, font, onTab }) {
  return (
    <ScreenFrame t={t}>
      <StatusBar t={t} />
      <div style={{ padding: '14px 20px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <WordmarkWithMark font={font} Mark={Mark} size={22} color={t.fg} />
        <div style={{ width: 30, height: 30, borderRadius: '50%',
          background: t.surface2 }}></div>
      </div>

      <div style={{ padding: '18px 20px 6px' }}>
        <MonoLabel t={t}>jue 15 · semana 3 · bloque fuerza</MonoLabel>
        <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 30,
          letterSpacing: '-0.035em', lineHeight: 1.05, marginTop: 6, color: t.fg }}>
          Buenas,<br />Esteban.</div>
      </div>

      {/* Recovery widget — accent */}
      <div style={{ margin: '14px 20px 0', padding: '16px 16px 14px',
        background: t.accent, color: t.onAccent, borderRadius: 18,
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MonoLabel t={t} color={t.onAccent}>recovery</MonoLabel>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.14em', opacity: 0.7 }}>BUEN DÍA</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4,
          marginTop: 6, fontFamily: t.fonts.display, fontWeight: 800 }}>
          <span style={{ fontSize: 64, letterSpacing: '-0.045em',
            lineHeight: 0.9 }}>87</span>
          <span style={{ fontSize: 18, opacity: 0.55 }}>/100</span>
        </div>
        <svg width="100%" height="22" viewBox="0 0 240 22" style={{ marginTop: 4 }}>
          {/* mini sparkline */}
          <polyline fill="none" stroke={t.onAccent} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
            points="0,16 20,12 40,15 60,9 80,11 100,7 120,10 140,5 160,8 180,4 200,7 220,3 240,5" />
        </svg>
      </div>

      {/* Mini widget grid */}
      <div style={{ margin: '8px 20px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'WOD HOY',  main: 'Fran', sub: '21–15–9 · thr · pull', go: 'train' },
          { label: 'MACROS',   main: '38%',  sub: 'proteína · 142g',       go: 'eat' },
          { label: 'BITÁCORA', main: '+3',   sub: 'entradas esta semana', go: 'journal' },
          { label: 'SUEÑO',    main: '7:24', sub: '92% eficiencia',       go: null },
        ].map((w, i) => (
          <button key={i}
            onClick={() => w.go && onTab && onTab(w.go)}
            style={{
              border: 'none', textAlign: 'left',
              padding: 12, background: t.surface, borderRadius: 14,
              border: `1px solid ${t.divider}`,
              cursor: w.go && onTab ? 'pointer' : 'default',
              fontFamily: 'inherit',
            }}>
            <MonoLabel t={t}>{w.label}</MonoLabel>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
              fontSize: 22, letterSpacing: '-0.025em', marginTop: 5, color: t.fg }}>
              {w.main}</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
              color: t.fgMuted, marginTop: 1 }}>{w.sub}</div>
          </button>
        ))}
      </div>

      {/* Streak strip */}
      <div style={{ margin: '8px 20px 0', padding: 12,
        background: t.surface, borderRadius: 14,
        border: `1px solid ${t.divider}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center' }}>
          <MonoLabel t={t}>committed club · 12d</MonoLabel>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
            color: t.fgMuted }}>3 / 7</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4, marginTop: 8 }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                height: 22, borderRadius: 5,
                background: i < 3 ? t.accent : (i === 3 ? t.surface2 : t.surface2),
                opacity: i < 3 ? 1 : (i === 3 ? 1 : 0.5),
                border: i === 3 ? `1px solid ${t.fg}` : 'none',
              }}></div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
                color: t.fgFaint, marginTop: 3 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBar t={t} active={0} Mark={Mark} onTab={onTab} />
    </ScreenFrame>
  );
}

// ── 2 · Train / WOD ───────────────────────────────────────────────
function TrainScreen({ Mark, weight, t, font, onTab }) {
  return (
    <ScreenFrame t={t}>
      <StatusBar t={t} />
      <ScreenHeader t={t} font={font} title="Entrena" sub="Bloque 3 · semana 3 · día 4" />

      <div style={{ margin: '14px 20px 0', padding: '18px 18px 16px',
        background: t.fg, color: t.bg, borderRadius: 20,
        position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <MonoLabel t={t} color={t.bg + '99'}>wod · benchmark</MonoLabel>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.14em', background: t.accent, color: t.onAccent,
            padding: '3px 7px', borderRadius: 4 }}>MGW</div>
        </div>
        <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 44,
          letterSpacing: '-0.04em', lineHeight: 0.95, marginTop: 8 }}>Fran</div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 26, fontWeight: 700,
          letterSpacing: '-0.02em', marginTop: 8 }}>21 — 15 — 9</div>
        <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
          color: t.bg + 'AA', marginTop: 6, lineHeight: 1.45 }}>
          Thruster 95/65 · Pull-up<br/>For time
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 16, paddingTop: 14,
          borderTop: `1px solid ${t.bg}22` }}>
          <MonoLabel t={t} color={t.bg + '99'}>último pr</MonoLabel>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700 }}>
            5:42</span>
          <span style={{ fontFamily: t.fonts.body, fontSize: 11,
            color: t.bg + '88' }}>· hace 6 sem</span>
        </div>
      </div>

      <div style={{ margin: '14px 20px 0',
        display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, background: t.accent, color: t.onAccent,
          padding: '14px 16px', borderRadius: 14, textAlign: 'center',
          fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
        }}>Empezar WOD</div>
        <div style={{
          width: 50, background: t.surface, color: t.fg,
          padding: '14px 0', borderRadius: 14, textAlign: 'center',
          fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 16,
          border: `1px solid ${t.divider}`,
        }}><IconPlus size={18} stroke={2} color={t.fg} /></div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <MonoLabel t={t}>siguiente · viernes</MonoLabel>
      </div>
      {[
        { tag: 'M',  name: 'EMOM 12', sub: 'Run 200m · 10 kb swings · 5 burpees' },
        { tag: 'G',  name: 'Skill', sub: 'Hand-stand walk · 5×10m' },
      ].map((w, i) => (
        <div key={i} style={{ margin: '8px 20px 0',
          padding: 12, background: t.surface, borderRadius: 12,
          border: `1px solid ${t.divider}`,
          display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: t.surface2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 14, color: t.fg,
          }}>{w.tag}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
              fontSize: 13, color: t.fg }}>{w.name}</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 11,
              color: t.fgMuted, marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}>{w.sub}</div>
          </div>
        </div>
      ))}

      <TabBar t={t} active={1} Mark={Mark} onTab={onTab} />
    </ScreenFrame>
  );
}

// ── 3 · Eat / Macros ──────────────────────────────────────────────
function EatScreen({ Mark, weight, t, font, onTab }) {
  // Donut math — simple sectors for proteína / carbs / fat
  const total = 142 + 220 + 78; // arbitrary g totals
  const R = 56, C = 2 * Math.PI * R;
  const segs = [
    { val: 142, color: t.accent },
    { val: 220, color: t.fg },
    { val:  78, color: t.fgFaint },
  ];
  let acc = 0;
  const arcs = segs.map(s => {
    const len = (s.val / total) * C;
    const arc = (<circle key={s.val} cx="80" cy="80" r={R} fill="none"
      stroke={s.color} strokeWidth="16"
      strokeDasharray={`${len - 2} ${C - len + 2}`}
      strokeDashoffset={-acc}
      transform="rotate(-90 80 80)" />);
    acc += len;
    return arc;
  });

  return (
    <ScreenFrame t={t}>
      <StatusBar t={t} />
      <ScreenHeader t={t} font={font} title="Come" sub="Jueves · 1 842 kcal de 2 200" />

      <div style={{ margin: '14px 20px 0', padding: 18,
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}`,
        display: 'flex', alignItems: 'center', gap: 18 }}>
        <svg width="120" height="120" viewBox="0 0 160 160">
          {arcs}
          <text x="80" y="78" textAnchor="middle"
            fontFamily="Syne" fontWeight="800" fontSize="22"
            letterSpacing="-0.03em" fill={t.fg}>1842</text>
          <text x="80" y="95" textAnchor="middle"
            fontFamily="JetBrains Mono" fontWeight="600" fontSize="9"
            letterSpacing="0.2em" fill={t.fgMuted}>KCAL · 84%</text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { lab: 'Proteína', val: 142, max: 165, color: t.accent, unit: 'g' },
            { lab: 'Carbs',    val: 220, max: 250, color: t.fg, unit: 'g' },
            { lab: 'Grasa',    val:  78, max:  85, color: t.fgFaint, unit: 'g' },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline' }}>
                <span style={{ fontFamily: t.fonts.body, fontSize: 11.5,
                  fontWeight: 600, color: t.fg }}>{m.lab}</span>
                <span style={{ fontFamily: t.fonts.mono, fontSize: 11,
                  color: t.fgMuted }}>{m.val}<span style={{
                    color: t.fgFaint }}>/{m.max}{m.unit}</span></span>
              </div>
              <div style={{ height: 4, background: t.surface2,
                borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ width: `${(m.val / m.max) * 100}%`,
                  height: '100%', background: m.color, borderRadius: 2 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'baseline' }}>
        <MonoLabel t={t}>comidas de hoy</MonoLabel>
        <span style={{ fontFamily: t.fonts.mono, fontSize: 10,
          color: t.fgFaint }}>+ AGREGAR</span>
      </div>

      {[
        { time: '07:30', name: 'Avena · plátano · whey',  k: 420, tag: 'D' },
        { time: '12:45', name: 'Bowl de pollo y arroz',   k: 720, tag: 'A' },
        { time: '17:00', name: 'Manzana + nueces',         k: 280, tag: 'S' },
      ].map((m, i) => (
        <div key={i} style={{ margin: '8px 20px 0',
          padding: 12, background: t.surface, borderRadius: 12,
          border: `1px solid ${t.divider}`,
          display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: t.surface2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 12, color: t.fgMuted,
          }}>{m.time.slice(0,2)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
              fontSize: 12.5, color: t.fg,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}>{m.name}</div>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
              letterSpacing: '0.12em', color: t.fgFaint, marginTop: 2 }}>
              {m.time} · {m.tag}</div>
          </div>
          <div style={{ fontFamily: t.fonts.mono, fontWeight: 700,
            fontSize: 14, color: t.fg }}>{m.k}<span style={{
              fontSize: 9, color: t.fgFaint, marginLeft: 2 }}>k</span></div>
        </div>
      ))}

      <TabBar t={t} active={2} Mark={Mark} onTab={onTab} />
    </ScreenFrame>
  );
}

// ── 4 · Records / Analyze ─────────────────────────────────────────
function RecordsScreen({ Mark, weight, t, font, onTab }) {
  // Calendar heatmap — 6 rows × 7 cols. Mix of accent / surface2 cells.
  const days = Array.from({ length: 42 }, (_, i) => {
    if (i < 5 || i > 38) return 0;
    const r = ((i * 13) % 7);
    return r > 4 ? 2 : r > 2 ? 1 : r > 1 ? 0.5 : 0;
  });

  return (
    <ScreenFrame t={t}>
      <StatusBar t={t} />
      <ScreenHeader t={t} font={font} title="Records" sub="Tu progreso, cruzado." />

      {/* Fitness level card */}
      <div style={{ margin: '14px 20px 0', padding: '16px 18px',
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}`,
        display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: t.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 80 80">
            <Mark color={t.onAccent} stroke={7} />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <MonoLabel t={t}>fitness level</MonoLabel>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
            fontSize: 22, letterSpacing: '-0.025em', marginTop: 3, color: t.fg }}>
            Jaguar 31</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11,
            color: t.fgMuted, marginTop: 2 }}>top 18% · México</div>
        </div>
        <div style={{ color: t.fgFaint }}>
          <IconChevronRight size={16} stroke={1.8} />
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ margin: '14px 20px 0', padding: 16,
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline' }}>
          <MonoLabel t={t}>training days · mayo</MonoLabel>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 11,
            fontWeight: 700, color: t.fg }}>22 / 31</span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4, marginTop: 12,
        }}>
          {days.map((d, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 4,
              background: d === 0 ? t.surface2 :
                          d === 0.5 ? t.fgFaint :
                          d === 1 ? t.accent + 'AA' : t.accent,
              opacity: d === 0 ? 0.5 : 1,
            }}></div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 10, fontFamily: t.fonts.mono, fontSize: 9,
          color: t.fgFaint }}>
          <span style={{ display: 'inline-flex', color: t.fgFaint, opacity: 0.6 }}>
            <IconChevronRight size={9} stroke={2.2} />
          </span>
          <div style={{ width: 10, height: 10, background: t.surface2,
            borderRadius: 2 }}></div>
          <div style={{ width: 10, height: 10, background: t.accent + 'AA',
            borderRadius: 2 }}></div>
          <div style={{ width: 10, height: 10, background: t.accent,
            borderRadius: 2 }}></div>
          <span style={{ display: 'inline-flex', color: t.fgFaint }}>
            <IconPlus size={9} stroke={2.2} />
          </span>
        </div>
      </div>

      {/* PR row */}
      <div style={{ padding: '14px 20px 0' }}>
        <MonoLabel t={t}>prs · este mes</MonoLabel>
      </div>
      {[
        { lift: 'Back squat',  val: '142kg', delta: '+4', new: true },
        { lift: 'Snatch',       val: '78kg',  delta: '+2', new: false },
        { lift: 'Strict pull',  val: '14',    delta: '+1', new: false },
      ].map((p, i) => (
        <div key={i} style={{ margin: '6px 20px 0',
          padding: '11px 14px', background: t.surface, borderRadius: 11,
          border: `1px solid ${t.divider}`,
          display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, fontFamily: t.fonts.body, fontWeight: 600,
            fontSize: 13, color: t.fg }}>{p.lift}
            {p.new && <span style={{
              fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
              letterSpacing: '0.14em', background: t.accent, color: t.onAccent,
              padding: '2px 5px', borderRadius: 3, marginLeft: 8,
              verticalAlign: 'middle',
            }}>PR</span>}
          </div>
          <span style={{ fontFamily: t.fonts.mono, fontWeight: 700,
            fontSize: 14, color: t.fg, marginRight: 10 }}>{p.val}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2,
            fontFamily: t.fonts.mono, fontSize: 11, color: t.semantic.ok }}>
            <IconArrowUp size={11} stroke={2.2} />{p.delta}
          </span>
        </div>
      ))}

      <TabBar t={t} active={3} Mark={Mark} onTab={onTab} />
    </ScreenFrame>
  );
}

// ── 5 · Journal ───────────────────────────────────────────────────
function JournalScreen({ Mark, weight, t, font, onTab }) {
  const moodLabels = ['mal', 'neutral', 'ok', 'bien', 'pleno'];
  return (
    <ScreenFrame t={t}>
      <StatusBar t={t} />
      <div style={{ padding: '8px 20px 0', display: 'flex',
        alignItems: 'center', gap: 6 }}>
        <button onClick={() => onTab && onTab('home')}
          style={{ border: 'none', background: 'transparent', padding: 0,
            color: t.fg, cursor: 'pointer', display: 'flex' }}>
          <span style={{ transform: 'scaleX(-1)', display: 'inline-flex' }}>
            <IconChevronRight size={20} stroke={2} color={t.fg} />
          </span>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 26,
            letterSpacing: '-0.035em', lineHeight: 1.05, color: t.fg }}>Bitácora</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
            color: t.fgMuted, marginTop: 3, letterSpacing: 0.05 }}>Cómo te sentiste hoy.</div>
        </div>
      </div>

      {/* Mood scale */}
      <div style={{ margin: '14px 20px 0', padding: 16,
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}` }}>
        <MonoLabel t={t}>energía · ahora</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 8, marginTop: 12 }}>
          {MOOD_ICONS.map((MoodIcon, i) => {
            const selected = i === 3;
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 12,
                background: selected ? t.accent : t.surface2,
                color: selected ? t.onAccent : t.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <MoodIcon size={32} stroke={1.8} />
                {selected && <div style={{
                  position: 'absolute', bottom: -14, left: 0, right: 0,
                  textAlign: 'center', fontFamily: t.fonts.mono, fontSize: 8.5,
                  fontWeight: 700, letterSpacing: '0.14em', color: t.fgMuted,
                  textTransform: 'uppercase',
                }}>{moodLabels[i]}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's entry */}
      <div style={{ margin: '22px 20px 0', padding: 18,
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center' }}>
          <MonoLabel t={t}>jueves 15 · mayo</MonoLabel>
          <div style={{ display: 'flex', gap: 6 }}>
            {['gratitud', 'cuerpo'].map(tag => (
              <span key={tag} style={{
                fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '3px 7px', borderRadius: 4,
                background: t.surface2, color: t.fgMuted,
              }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
          fontSize: 19, letterSpacing: '-0.02em', marginTop: 10,
          lineHeight: 1.25, color: t.fg }}>
          "Hoy el squat se sintió ligero. Me costó arrancar pero a la mitad ya iba volando."
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 14, paddingTop: 12,
          borderTop: `1px solid ${t.divider}` }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%',
            background: t.accent, color: t.onAccent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700 }}>S</div>
          <div style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 11,
            color: t.fgMuted, lineHeight: 1.4 }}>
            <i>SOMA</i> · Tu tono fue 12% más positivo que tu promedio.
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 92, left: 0, right: 0,
        display: 'flex', justifyContent: 'center' }}>
        <div style={{
          padding: '12px 22px', borderRadius: 999,
          background: t.fg, color: t.bg,
          fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13,
          boxShadow: `0 6px 18px ${t.fg}33`,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <IconPlus size={14} stroke={2.4} color={t.bg} />
          <span>Nueva entrada</span>
        </div>
      </div>

      <TabBar t={t} active={0} Mark={Mark} onTab={onTab} />
    </ScreenFrame>
  );
}

// ── 6 · Profile / Yo ──────────────────────────────────────────────
function ProfileScreen({ Mark, weight, t, font, onTab }) {
  return (
    <ScreenFrame t={t}>
      <StatusBar t={t} />
      <div style={{ padding: '14px 20px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <WordmarkWithMark font={font} Mark={Mark} size={22} color={t.fg} />
        <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
          color: t.fgMuted, letterSpacing: '0.14em' }}>YO</div>
      </div>

      <div style={{ margin: '18px 20px 0',
        display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%',
          background: t.surface2, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
          letterSpacing: '-0.04em', color: t.fgMuted }}>EC</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
            fontSize: 22, letterSpacing: '-0.035em', color: t.fg }}>
            Esteban Castillo</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 12,
            color: t.fgMuted, marginTop: 2 }}>desde mar 2024 · 423 días</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ margin: '18px 20px 0',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}`, overflow: 'hidden' }}>
        {[
          { lab: 'ENTRENOS', val: '287' },
          { lab: 'STREAK',   val: '12d' },
          { lab: 'PRS',      val: '34' },
        ].map((s, i, arr) => (
          <div key={i} style={{
            padding: '14px 10px', textAlign: 'center',
            borderRight: i < arr.length - 1 ? `1px solid ${t.divider}` : 'none',
          }}>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
              fontSize: 24, letterSpacing: '-0.035em', color: t.fg }}>
              {s.val}</div>
            <MonoLabel t={t}>{s.lab}</MonoLabel>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div style={{ margin: '18px 20px 0' }}>
        <MonoLabel t={t}>tu perfil</MonoLabel>
      </div>
      {[
        { lab: 'Inventario de movimiento', sub: '47 movimientos' },
        { lab: 'Equipo de gym',            sub: '12 implementos' },
        { lab: 'Equipo de cocina',         sub: '8 utensilios' },
        { lab: 'Suplementos',              sub: '4 activos' },
        { lab: 'Lesiones',                 sub: 'ninguna activa' },
      ].map((m, i) => (
        <div key={i} style={{ margin: '6px 20px 0',
          padding: '13px 14px', background: t.surface, borderRadius: 11,
          border: `1px solid ${t.divider}`,
          display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
              fontSize: 13, color: t.fg }}>{m.lab}</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 11,
              color: t.fgMuted, marginTop: 1 }}>{m.sub}</div>
          </div>
          <span style={{ display: 'inline-flex', color: t.fgFaint }}>
            <IconChevronRight size={16} stroke={1.8} />
          </span>
        </div>
      ))}

      <TabBar t={t} active={4} Mark={Mark} onTab={onTab} />
    </ScreenFrame>
  );
}

Object.assign(window, {
  DashboardScreen, TrainScreen, EatScreen,
  RecordsScreen, JournalScreen, ProfileScreen,
});
