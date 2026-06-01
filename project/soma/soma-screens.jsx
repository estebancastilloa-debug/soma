// SOMA — remaining screens: Home, Train, Records, Journal, Profile.
// Use the per-pillar palette + the F5 watermark + icon-based data entry.

const {
  StatusBar, MonoLabel, ScreenFrame, PillarHeader, SectionHead, TabBar,
  PillarTag, PhotoPlaceholder,
  WordmarkWithMark,
  IconRecovery, IconSleep, IconStreak, IconFlame, IconBalance,
  IconProtein, IconCarbs, IconFat, IconHeart,
  IconChevronRight, IconChevronLeft, IconPlus, IconArrowUp,
  IconDumbbellSmall, IconTimer, IconBolt,
  IconMic, IconCamera, IconCheck,
  MOOD_ICONS, LEVELS,
} = window;

// ════════════════════ 1 · HOME ════════════════════════════════════
function DashboardScreen({ t, Mark, font, onTab, onPlus, onMenu }) {
  return (
    <ScreenFrame t={t} accent={{ Mark: window.F5, color: t.fg }}>
      <StatusBar t={t}/>
      {/* Header row: hamburger + wordmark + avatar */}
      <div style={{ padding: '8px 14px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <window.MenuButton t={t} onMenu={onMenu}/>
          <WordmarkWithMark font={font} Mark={Mark} size={22} color={t.fg}/>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%',
          background: t.surface2, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%',
            background: t.accent, position: 'absolute', top: 4, right: 4 }}></div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
            fontWeight: 700, color: t.fgMuted }}>EC</div>
        </div>
      </div>

      <div style={{ padding: '18px 20px 6px' }}>
        <MonoLabel t={t}>jue 15 · semana 3 · bloque fuerza</MonoLabel>
        <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 30,
          letterSpacing: '-0.035em', lineHeight: 1.05, marginTop: 6, color: t.fg }}>
          Buenas,<br/>Esteban.</div>
      </div>

      {/* Recovery hero — uses primary accent + icon, not just a number */}
      <div style={{ margin: '14px 20px 0', padding: '16px 18px 14px',
        background: t.accent, color: t.onAccent, borderRadius: 20,
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconRecovery size={16} stroke={1.9}/>
            <MonoLabel t={t} color={t.onAccent}>recovery</MonoLabel>
          </div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.14em', opacity: 0.7 }}>BUEN DÍA</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4,
          marginTop: 6, fontFamily: t.fonts.display, fontWeight: 800 }}>
          <span style={{ fontSize: 60, letterSpacing: '-0.045em',
            lineHeight: 0.9 }}>87</span>
          <span style={{ fontSize: 18, opacity: 0.55 }}>/100</span>
        </div>
        {/* sparkline */}
        <svg width="100%" height="22" viewBox="0 0 240 22" style={{ marginTop: 4 }}>
          <polyline fill="none" stroke={t.onAccent} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
            points="0,16 20,12 40,15 60,9 80,11 100,7 120,10 140,5 160,8 180,4 200,7 220,3 240,5"/>
        </svg>
        {/* Big F5 watermark in corner */}
        <svg width="100" height="100" viewBox="0 0 80 80"
          style={{ position: 'absolute', right: -10, top: -10,
            opacity: 0.18 }}>
          <Mark color={t.onAccent} stroke={5}/>
        </svg>
      </div>

      {/* Quick widget grid — each tile color-coded by pillar */}
      <div style={{ margin: '10px 20px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { Icon: IconDumbbellSmall, lab: 'WOD HOY',  main: 'Fran',
            sub: '21–15–9 · thr · pull', col: t.pillar.train, go: 'train' },
          { Icon: IconProtein,       lab: 'MACROS',   main: '142g',
            sub: 'proteína · 86%',    col: t.pillar.eat, go: 'eat' },
          { Icon: IconBalance,       lab: 'NIVEL',    main: 'Current',
            sub: 'L4 · 12 niveles',    col: t.pillar.records, go: 'level' },
          { Icon: IconSleep,         lab: 'SUEÑO',    main: '7:24',
            sub: '92% eficiencia',     col: t.fg, go: null },
        ].map((w, i) => (
          <button key={i}
            onClick={() => w.go && onTab && onTab(w.go)}
            style={{
              textAlign: 'left',
              padding: 12, background: t.surface, borderRadius: 14,
              border: `1px solid ${t.divider}`,
              cursor: w.go && onTab ? 'pointer' : 'default',
              fontFamily: 'inherit',
              position: 'relative',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ color: w.col, display: 'flex' }}>
                <w.Icon size={14} stroke={1.8}/>
              </div>
              <MonoLabel t={t}>{w.lab}</MonoLabel>
            </div>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
              fontSize: 22, letterSpacing: '-0.025em', marginTop: 6, color: t.fg }}>
              {w.main}</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
              color: t.fgMuted, marginTop: 1 }}>{w.sub}</div>
          </button>
        ))}
      </div>

      {/* Streak strip — uses streak icon */}
      <div style={{ margin: '8px 20px 0', padding: 12,
        background: t.surface, borderRadius: 14,
        border: `1px solid ${t.divider}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ color: t.secondary, display: 'flex' }}>
              <IconStreak size={14} stroke={1.9}/>
            </div>
            <MonoLabel t={t}>committed · 12 días</MonoLabel>
          </div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 10,
            color: t.fgMuted }}>3 / 7</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4, marginTop: 8 }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                height: 22, borderRadius: 5,
                background: i < 3 ? t.accent : t.surface2,
                border: i === 3 ? `1px solid ${t.fg}` : 'none',
                opacity: i > 3 ? 0.5 : 1,
              }}></div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5,
                color: t.fgFaint, marginTop: 3 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBar t={t} active={0} onTab={onTab} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

// ════════════════════ 2 · TRAIN ═══════════════════════════════════
function TrainScreen({ t, Mark, font, onTab, onPlus, onMenu }) {
  const pillar = t.pillar.train;
  const onPillar = '#0A0908';
  return (
    <ScreenFrame t={t} accent={{ Mark, color: pillar }}>
      <StatusBar t={t}/>
      <PillarHeader t={t}
        title="Entrena" sub="Bloque 3 · semana 3 · día 4"
        pillarColor={pillar} Mark={Mark} onMenu={onMenu}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* WOD hero */}
        <div style={{ margin: '14px 20px 0', padding: '18px 18px 16px',
          background: t.fg, color: t.bg, borderRadius: 20,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconBolt size={14} color={pillar}/>
              <MonoLabel t={t} color={t.bg + '99'}>wod · benchmark</MonoLabel>
            </div>
            <PillarTag t={t} pillar="train">MGW</PillarTag>
          </div>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 46,
            letterSpacing: '-0.04em', lineHeight: 0.95, marginTop: 8 }}>Fran</div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 26, fontWeight: 700,
            letterSpacing: '-0.02em', marginTop: 8, color: pillar }}>21 — 15 — 9</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
            color: t.bg + 'AA', marginTop: 6, lineHeight: 1.45 }}>
            Thruster 95/65 · Pull-up<br/>For time
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            marginTop: 16, paddingTop: 14,
            borderTop: `1px solid ${t.bg}22` }}>
            <IconTimer size={14} color={t.bg + '99'}/>
            <MonoLabel t={t} color={t.bg + '99'}>último pr</MonoLabel>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 13, fontWeight: 700 }}>
              5:42</span>
            <span style={{ fontFamily: t.fonts.body, fontSize: 11,
              color: t.bg + '88' }}>· hace 6 sem</span>
          </div>
          {/* watermark */}
          <svg width="160" height="160" viewBox="0 0 80 80"
            style={{ position: 'absolute', right: -40, bottom: -50,
              opacity: 0.08 }}>
            <Mark color={pillar} stroke={4}/>
          </svg>
        </div>

        {/* CTA */}
        <div style={{ margin: '14px 20px 0', display: 'flex', gap: 8 }}>
          <button style={{
            flex: 1, background: pillar, color: onPillar,
            padding: '14px 16px', borderRadius: 14, border: 'none',
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 14,
            cursor: 'pointer',
          }}>Empezar WOD</button>
          <button style={{
            width: 50, background: t.surface, color: t.fg,
            padding: '14px 0', borderRadius: 14, textAlign: 'center',
            border: `1px solid ${t.divider}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconPlus size={18} stroke={2}/></button>
        </div>

        <SectionHead t={t}>siguiente · viernes</SectionHead>
        {[
          { tag: 'M', col: pillar, name: 'EMOM 12',
            sub: 'Run 200m · 10 kb swings · 5 burpees' },
          { tag: 'G', col: t.tertiary, name: 'Skill',
            sub: 'Hand-stand walk · 5×10m' },
          { tag: 'W', col: t.secondary, name: 'Strength',
            sub: 'Back squat · 5×5 @ 80%' },
        ].map((w, i) => (
          <div key={i} style={{ margin: '8px 20px 0',
            padding: 12, background: t.surface, borderRadius: 12,
            border: `1px solid ${t.divider}`,
            display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: w.col,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 14,
              color: '#0A0908',
            }}>{w.tag}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
                fontSize: 13, color: t.fg }}>{w.name}</div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 11,
                color: t.fgMuted, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' }}>{w.sub}</div>
            </div>
            <IconChevronRight size={16} color={t.fgFaint}/>
          </div>
        ))}

        {/* Quick capture */}
        <SectionHead t={t}>capturar entreno</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { Icon: IconDumbbellSmall, lab: 'Set' },
            { Icon: IconTimer,         lab: 'Tiempo' },
            { Icon: IconMic,           lab: 'Voz' },
          ].map((q, i) => (
            <div key={i} style={{
              padding: '14px 10px', borderRadius: 14,
              background: i === 0 ? pillar : t.surface,
              color: i === 0 ? onPillar : t.fg,
              border: i === 0 ? 'none' : `1px solid ${t.divider}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
            }}>
              <q.Icon size={22} stroke={1.8}/>
              <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5,
                fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase' }}>{q.lab}</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar t={t} active={1} onTab={onTab} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

// ════════════════════ 3 · RECORDS ═════════════════════════════════
function RecordsScreen({ t, Mark, font, onTab, onPlus, onMenu }) {
  const pillar = t.pillar.records;
  const onPillar = '#0A0908';
  const days = Array.from({ length: 42 }, (_, i) => {
    if (i < 5 || i > 38) return 0;
    const r = ((i * 13) % 7);
    return r > 4 ? 2 : r > 2 ? 1 : r > 1 ? 0.5 : 0;
  });
  const currentLevel = LEVELS.find(l => l.id === 4); // L4 Current

  return (
    <ScreenFrame t={t} accent={{ Mark, color: pillar }}>
      <StatusBar t={t}/>
      <PillarHeader t={t}
        title="Records" sub="Tu progreso, cruzado."
        pillarColor={pillar} Mark={Mark} onMenu={onMenu}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* SOMA Level card → tap to deep dive */}
        <button
          onClick={() => onTab && onTab('level')}
          style={{
            margin: '14px 20px 0', padding: '14px 16px',
            background: pillar, color: onPillar, borderRadius: 18,
            border: 'none', cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 14,
            width: 'calc(100% - 40px)',
            position: 'relative', overflow: 'hidden',
          }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: onPillar + '15', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="44" height="44" viewBox="0 0 80 80">
              <currentLevel.Mark color={onPillar} stroke={6}/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <MonoLabel t={t} color={onPillar + 'AA'}>soma level · l4 de 12</MonoLabel>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
              fontSize: 22, letterSpacing: '-0.03em', marginTop: 3 }}>
              {currentLevel.name}</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 11,
              opacity: 0.75, marginTop: 1 }}>
              78% al siguiente nivel · {currentLevel.es}</div>
          </div>
          <IconChevronRight size={18}/>
        </button>

        {/* Heatmap */}
        <div style={{ margin: '12px 20px 0', padding: 16,
          background: t.surface, borderRadius: 18,
          border: `1px solid ${t.divider}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconFlame size={14} color={t.secondary}/>
              <MonoLabel t={t}>training days · mayo</MonoLabel>
            </div>
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
                            d === 1 ? pillar + 'AA' : pillar,
                opacity: d === 0 ? 0.5 : 1,
              }}></div>
            ))}
          </div>
        </div>

        {/* PRs */}
        <SectionHead t={t}>prs · este mes</SectionHead>
        {[
          { lift: 'Back squat',  val: '142kg', delta: '+4', new: true,  Icon: IconDumbbellSmall, col: pillar },
          { lift: 'Snatch',      val: '78kg',  delta: '+2', new: false, Icon: IconBolt,          col: t.secondary },
          { lift: 'Strict pull', val: '14',    delta: '+1', new: false, Icon: IconArrowUp,       col: t.fg },
        ].map((p, i) => (
          <div key={i} style={{ margin: '6px 20px 0',
            padding: '11px 14px', background: t.surface, borderRadius: 12,
            border: `1px solid ${t.divider}`,
            display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, background: t.surface2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: p.col, flexShrink: 0,
            }}>
              <p.Icon size={15} stroke={1.9}/>
            </div>
            <div style={{ flex: 1, fontFamily: t.fonts.body, fontWeight: 600,
              fontSize: 13, color: t.fg }}>{p.lift}
              {p.new && <span style={{
                fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                letterSpacing: '0.14em', background: pillar, color: onPillar,
                padding: '2px 5px', borderRadius: 3, marginLeft: 8,
                verticalAlign: 'middle',
              }}>PR</span>}
            </div>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700,
              fontSize: 14, color: t.fg }}>{p.val}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2,
              fontFamily: t.fonts.mono, fontSize: 11, color: t.semantic.ok }}>
              <IconArrowUp size={11} stroke={2.2}/>{p.delta}
            </span>
          </div>
        ))}
      </div>

      <TabBar t={t} active={-1} onTab={onTab} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

// ════════════════════ 4 · JOURNAL (moved to soma-screen-journal.jsx) ═══
function _DEAD_JournalScreen({ t, Mark, font, onTab }) {
  const moodLabels = ['mal', 'neutral', 'ok', 'bien', 'pleno'];
  return (
    <ScreenFrame t={t} accent={{ Mark, color: t.fg }}>
      <StatusBar t={t}/>
      <PillarHeader t={t}
        title="Bitácora" sub="Cómo te sentiste hoy."
        onBack={() => onTab && onTab('home')}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* Mood scale */}
        <div style={{ margin: '14px 20px 0', padding: 16,
          background: t.surface, borderRadius: 18,
          border: `1px solid ${t.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconHeart size={14} color={t.secondary}/>
            <MonoLabel t={t}>energía · ahora</MonoLabel>
          </div>
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
                  <MoodIcon size={32} stroke={1.8}/>
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
              <PillarTag t={t} pillar="train">gratitud</PillarTag>
              <PillarTag t={t} pillar="records">cuerpo</PillarTag>
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
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 80 80">
                <Mark color={t.onAccent} stroke={9}/>
              </svg>
            </div>
            <div style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 11,
              color: t.fgMuted, lineHeight: 1.4 }}>
              <i>SOMA</i> · Tu tono fue 12% más positivo que tu promedio.
            </div>
          </div>
        </div>

        {/* Quick capture */}
        <SectionHead t={t}>capturar</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { Icon: IconMic, lab: 'Voz' },
            { Icon: IconCamera, lab: 'Foto' },
            { Icon: IconPlus, lab: 'Texto' },
          ].map((q, i) => (
            <div key={i} style={{
              padding: '14px 10px', borderRadius: 14,
              background: i === 0 ? t.fg : t.surface,
              color: i === 0 ? t.bg : t.fg,
              border: i === 0 ? 'none' : `1px solid ${t.divider}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
            }}>
              <q.Icon size={22} stroke={1.8}/>
              <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5,
                fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase' }}>{q.lab}</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar t={t} active={0} onTab={onTab}/>
    </ScreenFrame>
  );
}

// ════════════════════ 5 · PROFILE ═════════════════════════════════
function ProfileScreen({ t, Mark, font, onTab, onPlus, onMenu }) {
  const currentLevel = LEVELS.find(l => l.id === 4);
  return (
    <ScreenFrame t={t} accent={{ Mark, color: t.fg }}>
      <StatusBar t={t}/>
      <div style={{ padding: '4px 14px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <window.MenuButton t={t} onMenu={onMenu}/>
          <WordmarkWithMark font={font} Mark={Mark} size={22} color={t.fg}/>
        </div>
        <MonoLabel t={t}>yo</MonoLabel>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <svg width="16" height="16" viewBox="0 0 80 80">
              <currentLevel.Mark color={t.pillar.records} stroke={8}/>
            </svg>
            <span style={{ fontFamily: t.fonts.body, fontSize: 12,
              color: t.fgMuted }}>L4 · {currentLevel.name} · 423d</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ margin: '18px 20px 0',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        background: t.surface, borderRadius: 18,
        border: `1px solid ${t.divider}`, overflow: 'hidden' }}>
        {[
          { lab: 'ENTRENOS', val: '287', col: t.pillar.train },
          { lab: 'STREAK',   val: '12d', col: t.secondary },
          { lab: 'PRS',      val: '34',  col: t.pillar.records },
        ].map((s, i, arr) => (
          <div key={i} style={{
            padding: '14px 10px', textAlign: 'center',
            borderRight: i < arr.length - 1 ? `1px solid ${t.divider}` : 'none',
          }}>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
              fontSize: 24, letterSpacing: '-0.035em', color: t.fg }}>
              {s.val}</div>
            <div style={{ width: 16, height: 2, background: s.col,
              borderRadius: 1, margin: '4px auto 4px' }}></div>
            <MonoLabel t={t}>{s.lab}</MonoLabel>
          </div>
        ))}
      </div>

      <SectionHead t={t}>tu perfil</SectionHead>
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
          <IconChevronRight size={16} color={t.fgFaint}/>
        </div>
      ))}

      <TabBar t={t} active={4} onTab={onTab} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

Object.assign(window, {
  DashboardScreen, TrainScreen, RecordsScreen, ProfileScreen,
});
