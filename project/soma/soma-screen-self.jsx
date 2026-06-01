// SOMA — Self / Inner Map screen.
// Answers four framings:
//   "What I am · How I should be · Why I'm different · What that means"
//
// Sections (each expandable):
//   1. Hero — "Inner map" + your 4-axis identity
//   2. Biotype — your dominant humoral type
//   3. Childhood Wounds — your active patterns (mock = 2 selected)
//   4. Polarity — current state slider + reset prescription
//   5. ADHD / Dopamine profile
//   6. Why I'm different · what that means

const { useState: useStateSelf } = React;
const {
  BIOTYPES, WOUNDS, POLARITY, ADHD_PROFILE,
  StatusBar, MonoLabel, ScreenFrame, PillarHeader, SectionHead, TabBar,
  PillarTag, MenuButton,
  IconChevronRight, IconChevronLeft, IconCheck, IconBalance, IconBolt,
  IconHeart, IconFlame, IconRecovery,
} = window;

// Mock — what the AI inferred about this user.
const USER_PROFILE = {
  biotypeId: 'choleric',
  wounds: ['rejection', 'injustice'],
  polarityNow: 'masculine', // current operating mode
  polarityValue: 0.74,       // 0..1 — toward masculine
};

function ExpandCard({ t, color, isOpen, onToggle, title, mono, summary, children }) {
  const onColor = '#0A0908';
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${isOpen ? color + '66' : t.divider}`,
      background: isOpen ? color + '0E' : t.surface,
      overflow: 'hidden',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', border: 'none', background: 'transparent',
        cursor: 'pointer', textAlign: 'left',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: 'inherit',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: color, flexShrink: 0,
        }}></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <MonoLabel t={t} color={color}>{mono}</MonoLabel>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
            fontSize: 18, letterSpacing: '-0.025em', color: t.fg,
            marginTop: 2, lineHeight: 1.15 }}>{title}</div>
          {summary && !isOpen && (
            <div style={{ fontFamily: t.fonts.body, fontSize: 12,
              color: t.fgMuted, marginTop: 3 }}>{summary}</div>
          )}
        </div>
        <div style={{ color: t.fgFaint, display: 'flex', flexShrink: 0,
          transform: isOpen ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s' }}>
          <IconChevronRight size={16} stroke={2}/>
        </div>
      </button>
      {isOpen && (
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ChipList({ items, t, color }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5,
      marginTop: 6 }}>
      {items.map((it, i) => (
        <span key={i} style={{
          padding: '5px 10px', borderRadius: 999,
          background: t.surface, border: `1px solid ${color + '55'}`,
          fontFamily: t.fonts.body, fontWeight: 500, fontSize: 11.5,
          color: t.fg,
        }}>{it}</span>
      ))}
    </div>
  );
}

function SelfScreen({ t, Mark, onTab, onPlus, onMenu }) {
  const biotype = BIOTYPES.find(b => b.id === USER_PROFILE.biotypeId);
  const activeWounds = WOUNDS.filter(w => USER_PROFILE.wounds.includes(w.id));
  const polarityNow = POLARITY[USER_PROFILE.polarityNow];
  const polarityOther = POLARITY[USER_PROFILE.polarityNow === 'masculine' ? 'feminine' : 'masculine'];

  const [open, setOpen] = useStateSelf('biotype');
  const toggle = id => setOpen(o => o === id ? null : id);

  const cBio = t.pillar.train;
  const cWound = t.secondary;
  const cPol = t.pillar.records;
  const cAdhd = t.fg;

  return (
    <ScreenFrame t={t} accent={{ Mark, color: t.fg }}>
      <StatusBar t={t}/>

      {/* Header — hamburger + 2-line title */}
      <div style={{ padding: '4px 14px 0',
        display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <MenuButton t={t} onMenu={onMenu}/>
        <div style={{ flex: 1, paddingTop: 2 }}>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
            fontSize: 30, letterSpacing: '-0.04em', lineHeight: 0.95,
            color: t.fg }}>Inner<br/>Map</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11.5,
            color: t.fgMuted, marginTop: 6, letterSpacing: 0.05 }}>
            What you are · why you\u2019re different · what to do about it.</div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: '50%',
          background: t.fg, color: t.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 80 80">
            <Mark color={t.bg} stroke={8}/>
          </svg>
        </div>
      </div>

      <div style={{ height: 'calc(100% - 96px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* Identity grid — 4 axes at a glance */}
        <div style={{ margin: '18px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { mono: 'WHAT I AM',        col: cBio,   val: biotype.lab,
              sub: biotype.nature },
            { mono: 'WHY I\u2019M DIFFERENT', col: cWound, val: activeWounds[0]?.lab || '—',
              sub: activeWounds.length + ' active' },
            { mono: 'OPERATING NOW',    col: cPol,   val: polarityNow.lab,
              sub: Math.round(USER_PROFILE.polarityValue * 100) + '%' },
            { mono: 'ATTENTION STYLE',  col: cAdhd,  val: 'Variable',
              sub: 'context-driven' },
          ].map((g, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 12,
              background: t.surface, border: `1px solid ${t.divider}`,
              borderLeft: `3px solid ${g.col}`,
            }}>
              <MonoLabel t={t} color={g.col}>{g.mono}</MonoLabel>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
                fontSize: 18, letterSpacing: '-0.025em', color: t.fg,
                marginTop: 3 }}>{g.val}</div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
                color: t.fgMuted, marginTop: 1 }}>{g.sub}</div>
            </div>
          ))}
        </div>

        {/* 1 · BIOTYPE */}
        <SectionHead t={t}>biotype · the humoral lens</SectionHead>
        <div style={{ margin: '10px 20px 0' }}>
          <ExpandCard t={t} color={cBio} mono={biotype.es}
            title={biotype.lab}
            summary={biotype.drive}
            isOpen={open === 'biotype'} onToggle={() => toggle('biotype')}>
            <p style={{ fontFamily: t.fonts.body, fontSize: 13,
              color: t.fg, lineHeight: 1.5, margin: '8px 0 0' }}>
              <b>Drive:</b> {biotype.drive}<br/>
              <b>Nature:</b> {biotype.nature} · {biotype.element}
            </p>

            <div style={{ marginTop: 12 }}>
              <MonoLabel t={t} color={cBio}>signs to watch</MonoLabel>
              <ChipList items={biotype.signs} t={t} color={cBio}/>
            </div>

            <div style={{ marginTop: 12, padding: 12, borderRadius: 10,
              background: t.surface2 }}>
              <MonoLabel t={t} color={t.semantic.low}>shadow</MonoLabel>
              <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                color: t.fg, marginTop: 4, lineHeight: 1.5 }}>
                {biotype.shadow}
              </div>
            </div>

            <div style={{ marginTop: 10, padding: 12, borderRadius: 10,
              background: cBio + '14', border: `1px solid ${cBio}55` }}>
              <MonoLabel t={t} color={cBio}>how you should be</MonoLabel>
              <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                color: t.fg, marginTop: 4, lineHeight: 1.5 }}>
                {biotype.intervention}
              </div>
            </div>

            <div style={{ marginTop: 10, fontFamily: t.fonts.body,
              fontSize: 11, color: t.fgMuted, lineHeight: 1.5 }}>
              <i>SOMA</i> · {biotype.appAction}
            </div>
          </ExpandCard>
        </div>

        {/* 2 · WOUNDS */}
        <SectionHead t={t}>active wounds · the pattern lens</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeWounds.map(w => (
            <ExpandCard key={w.id} t={t} color={cWound}
              mono="WOUND"
              title={w.lab}
              summary={w.pattern}
              isOpen={open === 'w-' + w.id}
              onToggle={() => toggle('w-' + w.id)}>
              <p style={{ fontFamily: t.fonts.body, fontSize: 13,
                color: t.fg, lineHeight: 1.5, margin: '8px 0 0' }}>
                <b>Pattern:</b> {w.pattern}
              </p>

              <div style={{ marginTop: 12 }}>
                <MonoLabel t={t} color={cWound}>triggers</MonoLabel>
                <ChipList items={w.triggers} t={t} color={cWound}/>
              </div>

              <div style={{ marginTop: 12, padding: 12, borderRadius: 10,
                background: t.surface2 }}>
                <MonoLabel t={t} color={cWound}>the mask</MonoLabel>
                <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                  color: t.fg, marginTop: 4, lineHeight: 1.5 }}>
                  {w.mask}
                </div>
              </div>

              <div style={{ marginTop: 10, padding: 12, borderRadius: 10,
                background: t.fg + '12', border: `1px solid ${t.divider}` }}>
                <MonoLabel t={t}>what to do today</MonoLabel>
                <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                  color: t.fg, marginTop: 4, lineHeight: 1.5 }}>
                  {w.intervention}
                </div>
              </div>

              <div style={{ marginTop: 10, padding: 12, borderRadius: 10,
                background: cWound + '14' }}>
                <MonoLabel t={t} color={cWound}>journal prompt</MonoLabel>
                <div style={{ fontFamily: t.fonts.display, fontWeight: 600,
                  fontSize: 14, lineHeight: 1.3, marginTop: 5,
                  color: t.fg, fontStyle: 'italic' }}>
                  "{w.prompt}"
                </div>
              </div>
            </ExpandCard>
          ))}
        </div>

        {/* 3 · POLARITY */}
        <SectionHead t={t}>polarity · your current state</SectionHead>
        <div style={{ margin: '10px 20px 0', padding: 16,
          background: t.surface, borderRadius: 14,
          border: `1px solid ${t.divider}` }}>
          {/* Slider */}
          <div style={{ display: 'flex', justifyContent: 'space-between',
            fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.16em', color: t.fgFaint,
            textTransform: 'uppercase' }}>
            <span style={{ color: USER_PROFILE.polarityNow === 'masculine' ? cPol : t.fgFaint }}>
              Masculine</span>
            <span style={{ color: USER_PROFILE.polarityNow === 'feminine' ? cPol : t.fgFaint }}>
              Feminine</span>
          </div>
          <div style={{ marginTop: 8, height: 8, borderRadius: 4,
            background: t.surface2, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -3,
              left: `calc(${USER_PROFILE.polarityValue * 100}% - 7px)`,
              width: 14, height: 14, borderRadius: '50%',
              background: cPol, border: `2px solid ${t.bg}`,
            }}></div>
          </div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 13,
            color: t.fg, lineHeight: 1.5, marginTop: 12 }}>
            You've been mostly <b>{polarityNow.lab}</b> today —
            {' '}{polarityNow.signs[0].toLowerCase()}, {polarityNow.signs[2].toLowerCase()}.
          </div>
          <div style={{ marginTop: 10, padding: 12, borderRadius: 10,
            background: cPol + '14', border: `1px solid ${cPol}55` }}>
            <MonoLabel t={t} color={cPol}>risk if stuck</MonoLabel>
            <div style={{ fontFamily: t.fonts.body, fontSize: 12,
              color: t.fg, marginTop: 4, lineHeight: 1.5 }}>
              {polarityNow.risk}
            </div>
          </div>
          <div style={{ marginTop: 8, padding: 12, borderRadius: 10,
            background: t.fg, color: t.bg }}>
            <MonoLabel t={t} color={t.bg + 'AA'}>prescription · reset</MonoLabel>
            <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
              marginTop: 4, lineHeight: 1.5 }}>
              {polarityOther.reset}
            </div>
          </div>
        </div>

        {/* 4 · ADHD / DOPAMINE */}
        <SectionHead t={t}>attention · the dopamine lens</SectionHead>
        <div style={{ margin: '10px 20px 0' }}>
          <ExpandCard t={t} color={cAdhd} mono="ATTENTION STYLE"
            title={ADHD_PROFILE.lab}
            summary="Context-dependent — not broken."
            isOpen={open === 'adhd'}
            onToggle={() => toggle('adhd')}>
            <p style={{ fontFamily: t.fonts.body, fontSize: 13,
              color: t.fg, lineHeight: 1.5, margin: '8px 0 0' }}>
              {ADHD_PROFILE.description}
            </p>

            <div style={{ marginTop: 12,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: 10, borderRadius: 10,
                background: t.semantic.ok + '14',
                border: `1px solid ${t.semantic.ok}55` }}>
                <MonoLabel t={t} color={t.semantic.ok}>pulls you in</MonoLabel>
                <ul style={{ margin: '6px 0 0', paddingLeft: 14,
                  fontSize: 11.5, color: t.fg, lineHeight: 1.5 }}>
                  {ADHD_PROFILE.pulls.map((p, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>{p}</li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: 10, borderRadius: 10,
                background: t.semantic.low + '12',
                border: `1px solid ${t.semantic.low}55` }}>
                <MonoLabel t={t} color={t.semantic.low}>drains you</MonoLabel>
                <ul style={{ margin: '6px 0 0', paddingLeft: 14,
                  fontSize: 11.5, color: t.fg, lineHeight: 1.5 }}>
                  {ADHD_PROFILE.drains.map((p, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <MonoLabel t={t}>your protocols</MonoLabel>
              <div style={{ marginTop: 8,
                display: 'flex', flexDirection: 'column', gap: 5 }}>
                {ADHD_PROFILE.protocols.map((p, i) => (
                  <div key={i} style={{
                    padding: '9px 11px', borderRadius: 9,
                    background: t.surface2,
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <span style={{
                      fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700,
                      color: cAdhd, flexShrink: 0,
                    }}>0{i + 1}</span>
                    <span style={{ flex: 1, fontFamily: t.fonts.body,
                      fontSize: 12, color: t.fg, lineHeight: 1.4 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </ExpandCard>
        </div>

        {/* Closing: what this means */}
        <SectionHead t={t}>what this means · for you</SectionHead>
        <div style={{ margin: '10px 20px 0', padding: 18,
          background: t.accent, color: t.onAccent, borderRadius: 16,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
            fontSize: 17, letterSpacing: '-0.025em', lineHeight: 1.3 }}>
            You\u2019re a {biotype.lab.toLowerCase()} carrying a
            {' '}{activeWounds[0]?.lab.toLowerCase()} wound, currently
            operating in {polarityNow.lab.toLowerCase()} mode, with
            dopamine-variable attention.
          </div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
            opacity: 0.85, marginTop: 10, lineHeight: 1.55 }}>
            This is not a diagnosis. It\u2019s a working model SOMA uses to
            choose which prompt to surface, which habit to push, and how to
            speak to you on a hard day.
          </div>
          <svg width="120" height="120" viewBox="0 0 80 80"
            style={{ position: 'absolute', right: -30, bottom: -40,
              opacity: 0.12 }}>
            <Mark color={t.onAccent} stroke={5}/>
          </svg>
        </div>

        {/* Footer */}
        <div style={{ margin: '24px 20px 30px', textAlign: 'center' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 600,
            letterSpacing: '0.22em', color: t.fgFaint,
            textTransform: 'uppercase' }}>
            SOMA · what you are · what to do about it</div>
        </div>
      </div>

      <TabBar t={t} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

Object.assign(window, { SelfScreen, USER_PROFILE });
