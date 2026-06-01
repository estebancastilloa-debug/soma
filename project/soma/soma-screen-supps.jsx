// SOMA — Supplements tracker.
// Today's adherence at top + active supplement list + add new.
// Each card shows: name, dose, timing, why I take it, pros/cons.

const { useState: useStateSup } = React;
const {
  StatusBar, MonoLabel, ScreenFrame, PillarHeader, SectionHead, TabBar,
  MenuButton,
  IconCheck, IconPlus, IconChevronRight, IconSun, IconMoon, IconBolt,
} = window;

// ── Mock supplements list ────────────────────────────────────────
const SUPPS = [
  {
    id: 'creatine', name: 'Creatine monohydrate',
    dose: '5 g', timing: 'AM',
    why: 'Power output, cognitive function, sustained over years.',
    pros: ['Most-researched supplement', 'Cheap', 'No cycling needed'],
    cons: ['Slight water retention', 'Loading optional'],
    color: 'train',
  },
  {
    id: 'mg-glycinate', name: 'Magnesium glycinate',
    dose: '400 mg', timing: 'PM',
    why: 'Sleep quality, muscle relaxation, nervous-system tone.',
    pros: ['Bioavailable form', 'Doesn\u2019t cause GI distress',
      'Stacks with sleep protocols'],
    cons: ['Skip if low BP'],
    color: 'records',
  },
  {
    id: 'vit-d', name: 'Vitamin D3 + K2',
    dose: '5 000 IU + 100 µg', timing: 'AM',
    why: 'Hormonal baseline, immune function, calcium directed to bone.',
    pros: ['Cheap', 'K2 prevents arterial calcification'],
    cons: ['Lipid-soluble — take with fat'],
    color: 'eat',
  },
  {
    id: 'lions-mane', name: 'Lion\u2019s Mane',
    dose: '1 g · 2× day', timing: 'AM/PM',
    why: 'Nerve growth factor, focus, neurogenesis.',
    pros: ['Compounds over weeks', 'No side effects in trials'],
    cons: ['Cycle every 8 weeks (anecdotal)'],
    color: 'records',
  },
];

const TIMING_COLORS = {
  AM:     'eat',     // warm morning
  PM:     'records', // cool evening
  'AM/PM': 'train',
  PRE:    'train',
};

function SuppsScreen({ t, Mark, onTab, onPlus, onMenu }) {
  // Mock today's adherence
  const [taken, setTaken] = useStateSup(new Set(['creatine', 'vit-d']));
  const [expanded, setExpanded] = useStateSup(null);

  function toggleTaken(id) {
    setTaken(s => {
      const ns = new Set(s);
      if (ns.has(id)) ns.delete(id); else ns.add(id);
      return ns;
    });
  }

  const takenCount = SUPPS.filter(s => taken.has(s.id)).length;
  const adherencePct = SUPPS.length > 0
    ? Math.round((takenCount / SUPPS.length) * 100) : 0;

  return (
    <ScreenFrame t={t} accent={{ Mark, color: t.fg }}>
      <StatusBar t={t}/>
      <PillarHeader t={t}
        title="Suplementos" sub={`${takenCount} de ${SUPPS.length} hoy · ${adherencePct}% adherence`}
        onMenu={onMenu}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* ADHERENCE BAR */}
        <div style={{ margin: '14px 20px 0', padding: '14px 16px',
          background: t.accent, color: t.onAccent, borderRadius: 16,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start' }}>
            <div>
              <MonoLabel t={t} color={t.onAccent + 'AA'}>today\u2019s adherence</MonoLabel>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
                fontSize: 36, letterSpacing: '-0.04em',
                marginTop: 4, lineHeight: 1 }}>{adherencePct}%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <MonoLabel t={t} color={t.onAccent + 'AA'}>streak</MonoLabel>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
                fontSize: 22, letterSpacing: '-0.03em', marginTop: 4,
                lineHeight: 1 }}>14 d</div>
            </div>
          </div>
          <div style={{ marginTop: 12, height: 6, borderRadius: 3,
            background: t.onAccent + '22', overflow: 'hidden' }}>
            <div style={{ width: adherencePct + '%', height: '100%',
              background: t.onAccent, borderRadius: 3 }}></div>
          </div>
        </div>

        {/* ACTIVE LIST */}
        <SectionHead t={t} actionLabel="+ agregar">activos · {SUPPS.length}</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SUPPS.map(s => {
            const isTaken = taken.has(s.id);
            const isOpen  = expanded === s.id;
            const tint = t.pillar[s.color] || t.fg;
            const onTint = '#0A0908';
            const TimingIcon = s.timing.startsWith('AM') ? IconSun
                             : s.timing === 'PM' ? IconMoon
                             : IconBolt;
            return (
              <div key={s.id} style={{
                borderRadius: 14,
                border: `1px solid ${isOpen ? tint + '55' : t.divider}`,
                background: isOpen ? tint + '0E' : t.surface,
                overflow: 'hidden',
              }}>
                {/* Header row */}
                <div style={{
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 11,
                }}>
                  {/* Take checkbox */}
                  <button onClick={() => toggleTaken(s.id)} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: isTaken ? 'none' : `1.5px solid ${tint}88`,
                    background: isTaken ? tint : 'transparent',
                    color: isTaken ? onTint : 'transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isTaken && <IconCheck size={15} stroke={2.6}/>}
                  </button>
                  {/* Name + dose */}
                  <button onClick={() => setExpanded(isOpen ? null : s.id)}
                    style={{
                      flex: 1, minWidth: 0,
                      border: 'none', background: 'transparent',
                      padding: 0, cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'inherit',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'baseline',
                      gap: 6 }}>
                      <span style={{ fontFamily: t.fonts.body, fontWeight: 600,
                        fontSize: 13.5, color: t.fg,
                        textDecoration: isTaken ? 'line-through' : 'none',
                        opacity: isTaken ? 0.65 : 1,
                      }}>{s.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                      marginTop: 2 }}>
                      <span style={{ fontFamily: t.fonts.mono, fontSize: 10,
                        fontWeight: 700, letterSpacing: '0.14em',
                        color: tint, textTransform: 'uppercase' }}>{s.dose}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center',
                        gap: 4, fontFamily: t.fonts.mono, fontSize: 9.5,
                        fontWeight: 700, letterSpacing: '0.14em',
                        color: t.fgFaint, textTransform: 'uppercase' }}>
                        <TimingIcon size={10} stroke={2.2}/>{s.timing}
                      </span>
                    </div>
                  </button>
                  <div style={{ color: t.fgFaint, display: 'flex',
                    flexShrink: 0,
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s' }}>
                    <IconChevronRight size={15} stroke={2}/>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ padding: '0 14px 14px',
                    borderTop: `1px solid ${t.divider}`,
                    marginTop: 2, paddingTop: 12 }}>
                    <MonoLabel t={t} color={tint}>why you take it</MonoLabel>
                    <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                      color: t.fg, lineHeight: 1.5, marginTop: 4 }}>
                      {s.why}
                    </div>

                    <div style={{ marginTop: 12,
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ padding: 10, borderRadius: 10,
                        background: t.semantic.ok + '14',
                        border: `1px solid ${t.semantic.ok}44` }}>
                        <MonoLabel t={t} color={t.semantic.ok}>pros</MonoLabel>
                        <ul style={{ margin: '5px 0 0', paddingLeft: 14,
                          fontSize: 11, color: t.fg, lineHeight: 1.5 }}>
                          {s.pros.map((p, i) => (
                            <li key={i} style={{ marginBottom: 2 }}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ padding: 10, borderRadius: 10,
                        background: t.semantic.mid + '14',
                        border: `1px solid ${t.semantic.mid}44` }}>
                        <MonoLabel t={t} color={t.semantic.mid}>cons</MonoLabel>
                        <ul style={{ margin: '5px 0 0', paddingLeft: 14,
                          fontSize: 11, color: t.fg, lineHeight: 1.5 }}>
                          {s.cons.map((p, i) => (
                            <li key={i} style={{ marginBottom: 2 }}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                      <button style={{
                        flex: 1, padding: '9px', borderRadius: 9,
                        border: `1px solid ${t.divider}`,
                        background: 'transparent', color: t.fg,
                        cursor: 'pointer',
                        fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                      }}>edit</button>
                      <button style={{
                        flex: 1, padding: '9px', borderRadius: 9,
                        border: 'none', background: t.surface2, color: t.fg,
                        cursor: 'pointer',
                        fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                      }}>history</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add new */}
        <button style={{
          margin: '12px 20px 0', width: 'calc(100% - 40px)',
          padding: '14px', borderRadius: 12,
          background: 'transparent', border: `1px dashed ${t.divider}`,
          color: t.fg, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8,
        }}>
          <IconPlus size={14} stroke={2}/>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 10.5,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase' }}>Agregar suplemento</span>
        </button>

        {/* Note */}
        <div style={{ margin: '18px 20px 0', padding: 12,
          background: t.surface, borderRadius: 12,
          border: `1px solid ${t.divider}`,
          fontFamily: t.fonts.body, fontSize: 11.5,
          color: t.fgMuted, lineHeight: 1.5 }}>
          SOMA cross-references your supplement adherence with sleep, RHR
          and energy logs. After 30 days you\u2019ll see which ones moved
          your numbers — and which didn\u2019t.
        </div>
      </div>

      <TabBar t={t} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

Object.assign(window, { SuppsScreen, SUPPS });
