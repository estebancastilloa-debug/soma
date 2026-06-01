// SOMA — Bitácora screen. The mind/habits/journal hub.
// Sections:
//   1. Today's mood (5-face scale)
//   2. SOMA Holistic Habits — one-tap toggles for today's active habits
//   3. Prompt of the day (rotating, from frameworks: Stoic / Somatic / Polarity…)
//   4. Voice / text quick capture
//   5. Body metrics row (RHR · HRV · Grip · Sleep)
//   6. "Customize habits" link → opens habit picker overlay

const { useState } = React;
const { HABITS, HABIT_CATS, PROMPTS } = window;
const {
  StatusBar, MonoLabel, ScreenFrame, PillarHeader, SectionHead, TabBar,
  PillarTag,
} = window;
const {
  IconChevronRight, IconChevronLeft, IconPlus, IconCheck,
  IconMic, IconCamera, IconHeart, IconRecovery, IconSleep,
  IconBalance, IconBolt, IconFlame, IconWater, IconSun, IconMoon,
  IconDumbbellSmall, IconProtein, IconCarbs, IconTimer,
  MOOD_ICONS,
} = window;

// Map habit.icon strings → icon components
const HABIT_ICON_MAP = {
  balance:  () => window.IconBalance,
  water:    () => window.IconWater,
  flame:    () => window.IconFlame,
  dumbbell: () => window.IconDumbbellSmall,
  sun:      () => window.IconSun,
  recovery: () => window.IconRecovery,
  moon:     () => window.IconMoon,
  heart:    () => window.IconHeart,
  bolt:     () => window.IconBolt,
  protein:  () => window.IconProtein,
  carbs:    () => window.IconCarbs,
  timer:    () => window.IconTimer,
};
function habitIcon(h) {
  const f = HABIT_ICON_MAP[h.icon];
  return f ? f() : window.IconCheck;
}

// ── Habit picker overlay ──────────────────────────────────────────
function HabitPicker({ t, open, onClose, selected, onToggle }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      display: 'flex', flexDirection: 'column',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 60,
        background: t.bg, borderRadius: '24px 24px 0 0',
        padding: '12px 0', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: t.fgFaint, opacity: 0.5,
          margin: '0 auto 14px' }}></div>

        <div style={{ padding: '0 20px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
              fontSize: 22, letterSpacing: '-0.03em', color: t.fg }}>
              Holistic Habits</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 12,
              color: t.fgMuted, marginTop: 2 }}>
              {selected.length} active · tap to toggle</div>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: t.surface2, color: t.fg,
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 30px' }}>
          {HABIT_CATS.map(cat => {
            const items = HABITS.filter(h => h.cat === cat.id);
            const tint = t.pillar[cat.color] || t.fg;
            const onTint = '#0A0908';
            return (
              <div key={cat.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'baseline',
                  justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%',
                      background: tint }}></div>
                    <span style={{ fontFamily: t.fonts.display, fontWeight: 700,
                      fontSize: 16, letterSpacing: '-0.02em', color: t.fg }}>
                      {cat.lab}</span>
                  </div>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
                    fontWeight: 700, letterSpacing: '0.14em',
                    color: t.fgFaint, textTransform: 'uppercase' }}>
                    {cat.note}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {items.map(h => {
                    const isOn = selected.includes(h.id);
                    const Icon = habitIcon(h);
                    return (
                      <button key={h.id} onClick={() => onToggle(h.id)}
                        style={{
                          border: 'none', cursor: 'pointer',
                          padding: '11px 13px', borderRadius: 11,
                          background: isOn ? tint : t.surface,
                          color: isOn ? onTint : t.fg,
                          textAlign: 'left', fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 11,
                        }}>
                        <div style={{
                          width: 28, height: 28, flexShrink: 0,
                          borderRadius: 7,
                          background: isOn ? onTint + '15' : t.surface2,
                          color: isOn ? onTint : tint,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon size={15} stroke={1.9}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: t.fonts.body, fontWeight: 600,
                            fontSize: 13 }}>{h.lab}</div>
                          <div style={{ fontFamily: t.fonts.body, fontSize: 10.5,
                            color: isOn ? onTint + 'AA' : t.fgMuted,
                            marginTop: 1 }}>{h.sub}</div>
                        </div>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: isOn ? onTint + '22' : 'transparent',
                          border: isOn ? 'none' : `1.5px solid ${t.fgFaint}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isOn ? onTint : 'transparent', flexShrink: 0,
                        }}>
                          {isOn && <IconCheck size={13} stroke={2.4}/>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Bitácora screen ──────────────────────────────────────────
function JournalScreen({ t, Mark, font, onTab, onPlus, onMenu }) {
  const [mood, setMood] = useState(3);
  const [picker, setPicker] = useState(false);
  const [activeHabits, setActiveHabits] = useState([
    'mobility', 'cold', 'gratitude', 'protein', 'noalcohol', 'callus', 'connect',
  ]);
  const [doneToday, setDoneToday] = useState(new Set(['mobility', 'gratitude', 'protein']));

  // Promot of the day — pick stable one
  const todayPrompt = PROMPTS[2 % PROMPTS.length]; // "wound"
  const moodLabels  = ['low', 'meh', 'ok', 'good', 'full'];

  function toggleHabit(id) {
    setActiveHabits(arr => arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  }
  function toggleDone(id) {
    setDoneToday(s => {
      const ns = new Set(s);
      if (ns.has(id)) ns.delete(id); else ns.add(id);
      return ns;
    });
  }
  const doneCount = activeHabits.filter(id => doneToday.has(id)).length;
  const habitPct  = activeHabits.length > 0
    ? Math.round((doneCount / activeHabits.length) * 100) : 0;

  return (
    <ScreenFrame t={t} accent={{ Mark, color: t.fg }}>
      <StatusBar t={t}/>
      <PillarHeader t={t}
        title="Bitácora" sub="Mood · habits · mind"
        onMenu={onMenu}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto',
        paddingBottom: 100 }}>

        {/* MOOD */}
        <div style={{ margin: '14px 20px 0', padding: 16,
          background: t.surface, borderRadius: 18,
          border: `1px solid ${t.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconHeart size={14} color={t.secondary}/>
            <MonoLabel t={t}>how do you feel?</MonoLabel>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 6, marginTop: 12 }}>
            {MOOD_ICONS.map((MoodIcon, i) => {
              const selected = i === mood;
              return (
                <button key={i} onClick={() => setMood(i)} style={{
                  aspectRatio: '1', borderRadius: 12, border: 'none',
                  background: selected ? t.accent : t.surface2,
                  color: selected ? t.onAccent : t.fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', cursor: 'pointer',
                }}>
                  <MoodIcon size={30} stroke={1.8}/>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 6, marginTop: 6 }}>
            {moodLabels.map((lab, i) => (
              <div key={i} style={{
                textAlign: 'center',
                fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: i === mood ? t.fg : t.fgFaint,
              }}>{lab}</div>
            ))}
          </div>
        </div>

        {/* HOLISTIC HABITS — one-tap */}
        <div style={{ padding: '20px 20px 0', display: 'flex',
          justifyContent: 'space-between', alignItems: 'baseline' }}>
          <MonoLabel t={t}>holistic habits · {doneCount}/{activeHabits.length}</MonoLabel>
          <button onClick={() => setPicker(true)} style={{
            border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
            fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: t.accent,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>customize <IconPlus size={11} stroke={2.2}/></button>
        </div>

        {/* progress strip */}
        <div style={{ margin: '8px 20px 0', height: 6, borderRadius: 3,
          background: t.surface2, overflow: 'hidden' }}>
          <div style={{ width: habitPct + '%', height: '100%',
            background: t.accent, borderRadius: 3 }}></div>
        </div>

        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {activeHabits.map(id => {
            const h = HABITS.find(x => x.id === id);
            if (!h) return null;
            const Icon = habitIcon(h);
            const isDone = doneToday.has(id);
            const cat = HABIT_CATS.find(c => c.id === h.cat);
            const tint = t.pillar[cat ? cat.color : 'journal'] || t.fg;
            const onTint = '#0A0908';
            return (
              <button key={id} onClick={() => toggleDone(id)} style={{
                border: 'none', cursor: 'pointer',
                padding: '10px 11px', borderRadius: 11,
                background: isDone ? tint : t.surface,
                color: isDone ? onTint : t.fg,
                border: isDone ? 'none' : `1px solid ${t.divider}`,
                textAlign: 'left', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 9,
              }}>
                <div style={{ color: isDone ? onTint : tint, display: 'flex',
                  flexShrink: 0 }}>
                  <Icon size={15} stroke={1.9}/>
                </div>
                <div style={{ flex: 1, minWidth: 0,
                  fontFamily: t.fonts.body, fontWeight: 600, fontSize: 11.5,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap' }}>{h.lab}</div>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: isDone ? onTint + '22' : 'transparent',
                  border: isDone ? 'none' : `1.5px solid ${t.fgFaint}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isDone ? onTint : 'transparent', flexShrink: 0,
                }}>{isDone && <IconCheck size={10} stroke={2.6}/>}</div>
              </button>
            );
          })}
        </div>

        {/* DYNAMIC PROMPT */}
        <SectionHead t={t}>prompt of the day</SectionHead>
        <div style={{ margin: '10px 20px 0', padding: 18,
          background: t.fg, color: t.bg, borderRadius: 18,
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center' }}>
            <PillarTag t={t} pillar="train">{todayPrompt.cat}</PillarTag>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
              letterSpacing: '0.16em', opacity: 0.55,
              fontWeight: 700 }}>1 OF 3 TODAY</span>
          </div>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
            fontSize: 19, letterSpacing: '-0.02em', marginTop: 12,
            lineHeight: 1.25 }}>"{todayPrompt.q}"</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            <button style={{
              flex: 1, padding: '10px 14px', borderRadius: 999,
              border: 'none', background: t.accent, color: t.onAccent,
              fontFamily: t.fonts.body, fontWeight: 700, fontSize: 12.5,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}><IconMic size={14} stroke={2}/>Answer by voice</button>
            <button style={{
              padding: '10px 14px', borderRadius: 999,
              border: `1px solid ${t.bg}33`, background: 'transparent',
              color: t.bg, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12.5,
              cursor: 'pointer',
            }}>Type</button>
          </div>
          {/* watermark */}
          <svg width="140" height="140" viewBox="0 0 80 80"
            style={{ position: 'absolute', right: -40, bottom: -40,
              opacity: 0.06 }}>
            <Mark color={t.bg} stroke={4}/>
          </svg>
        </div>

        {/* TODAY'S ENTRY */}
        <SectionHead t={t} actionLabel="all entries">last entry</SectionHead>
        <div style={{ margin: '10px 20px 0', padding: 16,
          background: t.surface, borderRadius: 16,
          border: `1px solid ${t.divider}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center' }}>
            <MonoLabel t={t}>jueves 15 · mayo</MonoLabel>
            <div style={{ display: 'flex', gap: 5 }}>
              <PillarTag t={t} pillar="train">gratitud</PillarTag>
              <PillarTag t={t} pillar="records">cuerpo</PillarTag>
            </div>
          </div>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 700,
            fontSize: 16, letterSpacing: '-0.02em', marginTop: 10,
            lineHeight: 1.3, color: t.fg }}>
            "Hoy el squat se sintió ligero. Me costó arrancar pero a la mitad
             ya iba volando."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9,
            marginTop: 12, paddingTop: 10,
            borderTop: `1px solid ${t.divider}` }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%',
              background: t.accent, color: t.onAccent,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 80 80">
                <Mark color={t.onAccent} stroke={9}/>
              </svg>
            </div>
            <div style={{ flex: 1, fontFamily: t.fonts.body, fontSize: 11,
              color: t.fgMuted, lineHeight: 1.4 }}>
              <i>SOMA</i> · Your tone was 12% more positive than your average.
            </div>
          </div>
        </div>

        {/* BODY METRICS */}
        <SectionHead t={t}>body signals · today</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {[
            { Icon: IconSleep,    lab: 'Sleep',   val: '7:24', sub: '92% efficiency', col: t.tertiary },
            { Icon: IconRecovery, lab: 'HRV',     val: '64',   sub: 'ms · pristine',  col: t.pillar.records },
            { Icon: IconHeart,    lab: 'RHR',     val: '52',   sub: 'bpm · low',      col: t.semantic.ok },
            { Icon: IconDumbbellSmall, lab: 'Grip', val: '52kg', sub: 'cns ok',       col: t.pillar.train },
          ].map((m, i) => (
            <div key={i} style={{ padding: 12,
              background: t.surface, borderRadius: 12,
              border: `1px solid ${t.divider}`,
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, flexShrink: 0,
                borderRadius: 8, background: t.surface2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: m.col,
              }}>
                <m.Icon size={16} stroke={1.9}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <MonoLabel t={t}>{m.lab}</MonoLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4,
                  marginTop: 1 }}>
                  <span style={{ fontFamily: t.fonts.display, fontWeight: 700,
                    fontSize: 17, letterSpacing: '-0.025em', color: t.fg }}>
                    {m.val}</span>
                  <span style={{ fontFamily: t.fonts.body, fontSize: 9.5,
                    color: t.fgMuted }}>{m.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick capture */}
        <SectionHead t={t}>capture · raw</SectionHead>
        <div style={{ margin: '10px 20px 0',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { Icon: IconMic,    lab: 'Voice' },
            { Icon: IconCamera, lab: 'Photo' },
            { Icon: IconPlus,   lab: 'Text' },
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

      {/* Habit picker overlay */}
      <HabitPicker t={t} open={picker} onClose={() => setPicker(false)}
        selected={activeHabits} onToggle={toggleHabit}/>

      <TabBar t={t} active={-1} onTab={onTab} onPlus={onPlus}/>
    </ScreenFrame>
  );
}

Object.assign(window, { JournalScreen, HabitPicker });
