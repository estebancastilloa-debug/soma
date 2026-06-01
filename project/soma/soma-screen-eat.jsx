// SOMA — Come (Eat) screen. Easy calorie tracking + meals + pantry.
// Three big sections:
//   1. CALORIE HERO — big remaining number, donut, macro chips
//   2. SEARCH/ADD BAR — "what did you eat?" quick add with camera/voice
//   3. MEALS TODAY — compact list, one row per meal
//   4. PANTRY — grid of ingredients with stock indicator
//
// Hamburger in the header (no back arrow). FAB handled by TabBar.

const {
  StatusBar, MonoLabel, ScreenFrame, PillarHeader, SectionHead, TabBar,
  PillarTag, PhotoPlaceholder, MenuButton,
} = window;
const {
  IconProtein, IconCarbs, IconFat, IconFlame, IconWater,
  IconSun, IconMoon, IconSnack, IconPlus, IconChevronRight,
  IconCamera, IconMic, IconCheck,
} = window;

// ── Pantry inventory (mock) ───────────────────────────────────────
const PANTRY = [
  { id: 'eggs',      name: 'Huevos',        unit: '12 pz',   stock: 0.7, cat: 'protein' },
  { id: 'chicken',   name: 'Pollo',         unit: '800g',    stock: 0.4, cat: 'protein' },
  { id: 'rice',      name: 'Arroz',         unit: '2 kg',    stock: 0.9, cat: 'carb' },
  { id: 'oats',      name: 'Avena',         unit: '500g',    stock: 0.3, cat: 'carb' },
  { id: 'avocado',   name: 'Aguacate',      unit: '4 pz',    stock: 0.6, cat: 'fat' },
  { id: 'oliveoil',  name: 'Aceite oliva',  unit: '500 ml',  stock: 0.8, cat: 'fat' },
  { id: 'broccoli',  name: 'Brócoli',       unit: '600g',    stock: 0.5, cat: 'veg' },
  { id: 'spinach',   name: 'Espinaca',      unit: '200g',    stock: 0.1, cat: 'veg' },
  { id: 'whey',      name: 'Whey protein',  unit: '1 kg',    stock: 0.85, cat: 'protein' },
  { id: 'banana',    name: 'Plátano',       unit: '6 pz',    stock: 0.0, cat: 'carb' },
];

function PantryStock({ t, level, color }) {
  // 4 bars filled to stock level
  const filled = Math.round(level * 4);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0,1,2,3].map(i => (
        <div key={i} style={{
          width: 4, height: 10, borderRadius: 1,
          background: i < filled ? color : t.surface2,
        }}></div>
      ))}
    </div>
  );
}

function EatScreen({ t, Mark, onTab, font, onPlus, onMenu }) {
  const pillar   = t.pillar.eat;
  const onPillar = '#0A0908';

  // Macro data
  const goal = { kcal: 2200, p: 165, c: 250, f: 85 };
  const now  = { kcal: 1842, p: 142, c: 220, f: 78 };
  const remaining = goal.kcal - now.kcal;

  // Donut
  const total = now.p + now.c + now.f;
  const R = 56, C = 2 * Math.PI * R;
  const segs = [
    { val: now.p, color: pillar     },
    { val: now.c, color: t.tertiary },
    { val: now.f, color: t.fg       },
  ];
  let acc = 0;
  const arcs = segs.map((s, i) => {
    const len = (s.val / total) * C;
    const arc = (<circle key={i} cx="80" cy="80" r={R} fill="none"
      stroke={s.color} strokeWidth="14"
      strokeDasharray={`${len - 3} ${C - len + 3}`}
      strokeDashoffset={-acc}
      transform="rotate(-90 80 80)"
      strokeLinecap="round"/>);
    acc += len;
    return arc;
  });

  return (
    <ScreenFrame t={t} accent={{ Mark, color: pillar }}>
      <StatusBar t={t}/>
      <PillarHeader t={t}
        title="Come"
        sub={`Jueves · ${remaining > 0 ? remaining + ' kcal restantes' : 'meta cumplida'}`}
        pillarColor={pillar} Mark={Mark} onMenu={onMenu}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* ── CALORIE HERO ─────────────────────────────────────── */}
        <div style={{ margin: '14px 20px 0', padding: '18px 18px 16px',
          background: pillar, color: onPillar, borderRadius: 20,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="130" height="130" viewBox="0 0 160 160"
              style={{ flexShrink: 0 }}>
              {/* track */}
              <circle cx="80" cy="80" r={R} fill="none"
                stroke={onPillar + '15'} strokeWidth="14"/>
              {arcs}
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <MonoLabel t={t} color={onPillar + 'AA'}>restantes</MonoLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4,
                marginTop: 2 }}>
                <span style={{ fontFamily: t.fonts.display, fontWeight: 800,
                  fontSize: 44, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                  {remaining}</span>
                <span style={{ fontFamily: t.fonts.body, fontSize: 12,
                  fontWeight: 600, opacity: 0.7 }}>kcal</span>
              </div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
                fontWeight: 600, letterSpacing: '0.14em',
                color: onPillar + 'AA', marginTop: 4 }}>
                {now.kcal} de {goal.kcal} · {Math.round((now.kcal/goal.kcal)*100)}%
              </div>
            </div>
          </div>

          {/* Macro chips with icons */}
          <div style={{ marginTop: 14, display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[
              { I: IconProtein, lab: 'Proteína', now: now.p, goal: goal.p },
              { I: IconCarbs,   lab: 'Carbs',    now: now.c, goal: goal.c },
              { I: IconFat,     lab: 'Grasa',    now: now.f, goal: goal.f },
            ].map((m, i) => (
              <div key={i} style={{
                padding: '8px 10px', borderRadius: 10,
                background: onPillar + '14',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <m.I size={11} stroke={2}/>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
                    fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', opacity: 0.7 }}>{m.lab}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3,
                  marginTop: 2 }}>
                  <span style={{ fontFamily: t.fonts.display, fontWeight: 700,
                    fontSize: 17, letterSpacing: '-0.025em' }}>{m.now}</span>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
                    opacity: 0.55 }}>/{m.goal}g</span>
                </div>
                {/* mini bar */}
                <div style={{ height: 3, borderRadius: 1.5,
                  background: onPillar + '22', marginTop: 4,
                  overflow: 'hidden' }}>
                  <div style={{ width: `${(m.now/m.goal)*100}%`, height: '100%',
                    background: onPillar }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Water bar */}
          <div style={{ marginTop: 12,
            display: 'flex', alignItems: 'center', gap: 9 }}>
            <IconWater size={15} stroke={2}/>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
              fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', opacity: 0.7 }}>agua</span>
            <div style={{ flex: 1, display: 'flex', gap: 2 }}>
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 7, borderRadius: 2,
                  background: i < 5 ? onPillar : onPillar + '22',
                }}></div>
              ))}
            </div>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 11,
              fontWeight: 700 }}>5<span style={{ opacity: 0.6,
                fontWeight: 500 }}>/8</span></span>
          </div>
        </div>

        {/* ── SEARCH / QUICK ADD ──────────────────────────────── */}
        <div style={{ margin: '12px 20px 0' }}>
          <div style={{ padding: '11px 14px', borderRadius: 14,
            background: t.surface, border: `1px solid ${t.divider}`,
            display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: t.fgFaint, display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <line x1="16.5" y1="16.5" x2="20" y2="20"/>
              </svg>
            </span>
            <span style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 13,
              color: t.fgMuted }}>What did you eat?</span>
            <button style={{ border: 'none', background: 'transparent',
              padding: 4, cursor: 'pointer', color: pillar, display: 'flex' }}>
              <IconCamera size={18} stroke={1.9}/>
            </button>
            <button style={{ border: 'none', background: 'transparent',
              padding: 4, cursor: 'pointer', color: pillar, display: 'flex' }}>
              <IconMic size={18} stroke={1.9}/>
            </button>
          </div>
        </div>

        {/* ── MEALS TODAY ─────────────────────────────────────── */}
        <SectionHead t={t} actionLabel="ver todas">comidas de hoy</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { Icon: IconSun,   time: '07:30', tag: 'Desayuno',
              name: 'Avena · plátano · whey',          k: 420 },
            { Icon: IconEat || IconCheck, time: '12:45', tag: 'Almuerzo',
              name: 'Bowl de pollo · arroz · aguacate', k: 720 },
            { Icon: IconSnack, time: '17:00', tag: 'Snack',
              name: 'Manzana + nueces',                 k: 280 },
            { Icon: IconMoon,  time: '20:30', tag: 'Cena',
              name: 'Salmón · quinoa · brócoli',         k: 480, planned: true },
          ].map((m, i) => (
            <div key={i} style={{
              padding: 11, background: t.surface, borderRadius: 12,
              border: `1px solid ${t.divider}`,
              display: 'flex', alignItems: 'center', gap: 11,
              opacity: m.planned ? 0.6 : 1,
            }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                borderRadius: 10, background: pillar + '14', color: pillar,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.Icon && <m.Icon size={18} stroke={1.9}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
                  fontSize: 13, color: t.fg,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap' }}>{m.name}</div>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 9,
                  fontWeight: 700, letterSpacing: '0.14em',
                  color: t.fgFaint, textTransform: 'uppercase',
                  marginTop: 2 }}>{m.time} · {m.tag}{m.planned ? ' · planeada' : ''}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
                  fontSize: 17, letterSpacing: '-0.025em', color: t.fg }}>{m.k}
                  <span style={{ fontSize: 9, color: t.fgFaint, marginLeft: 2,
                    fontWeight: 500 }}>k</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PANTRY ─────────────────────────────────────────── */}
        <SectionHead t={t} actionLabel="ver todo">despensa</SectionHead>
        <div style={{ margin: '10px 20px 0' }}>
          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6, marginBottom: 8 }}>
            {[
              { lab: 'TOTAL',   val: PANTRY.length, col: t.fg },
              { lab: 'BAJOS',   val: PANTRY.filter(p => p.stock > 0 && p.stock < 0.35).length, col: t.semantic.mid },
              { lab: 'AGOTADOS', val: PANTRY.filter(p => p.stock === 0).length, col: t.semantic.low },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '9px 12px', borderRadius: 10,
                background: t.surface, border: `1px solid ${t.divider}`,
              }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
                  fontWeight: 700, letterSpacing: '0.14em',
                  color: t.fgFaint }}>{s.lab}</div>
                <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
                  fontSize: 20, letterSpacing: '-0.025em',
                  color: s.col, marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Pantry grid */}
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {PANTRY.slice(0, 8).map(item => {
              const catColors = {
                protein: pillar,
                carb:    t.tertiary,
                fat:     t.fg,
                veg:     t.pillar.train,
              };
              const isOut = item.stock === 0;
              const isLow = item.stock > 0 && item.stock < 0.35;
              const dotCol = isOut ? t.semantic.low
                          : isLow ? t.semantic.mid
                          : catColors[item.cat] || t.fg;
              return (
                <div key={item.id} style={{
                  padding: '10px 11px', borderRadius: 11,
                  background: t.surface, border: `1px solid ${t.divider}`,
                  opacity: isOut ? 0.55 : 1,
                  display: 'flex', alignItems: 'center', gap: 9,
                }}>
                  <PantryStock t={t} level={item.stock} color={dotCol}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
                      fontSize: 12, color: t.fg,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textDecoration: isOut ? 'line-through' : 'none',
                    }}>{item.name}</div>
                    <div style={{ fontFamily: t.fonts.mono, fontSize: 9,
                      letterSpacing: '0.1em', color: t.fgFaint,
                      marginTop: 1 }}>{item.unit}</div>
                  </div>
                  {isLow && (
                    <span style={{
                      fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: t.semantic.mid, flexShrink: 0,
                    }}>LOW</span>
                  )}
                  {isOut && (
                    <button style={{
                      border: 'none', background: t.semantic.low,
                      color: t.bg,
                      padding: '3px 7px', borderRadius: 4, cursor: 'pointer',
                      fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>+ list</button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Shopping list shortcut */}
          <button style={{
            width: '100%', marginTop: 8,
            padding: '11px 14px', borderRadius: 12,
            background: 'transparent', border: `1px dashed ${t.divider}`,
            color: t.fg, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8,
          }}>
            <IconPlus size={14} stroke={2}/>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 10.5,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase' }}>Ver lista de compras</span>
          </button>
        </div>
      </div>

      <TabBar t={t} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

Object.assign(window, { EatScreen });
