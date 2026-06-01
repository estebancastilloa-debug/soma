// SOMA — Habit Detail screen / overlay.
// Opened when a habit tile in Bitácora is tapped. Shows:
//   1. Header: habit name + category color + close
//   2. Why this habit matters
//   3. Today's log — list of entries, each tappable to mark done
//      · If user tries to add an entry that matches a recent one
//        AND habit.norepeat = true, we surface a "Repeat — doesn't count"
//        warning. They can still add it but it's flagged.
//   4. Examples grid — tap to fill the input
//   5. Add entry — text input + "Log" button (supports multiple/day)
//   6. History — last 7 days summary

const { useState: useStateHd } = React;
const {
  HABITS, HABIT_CATS, MOCK_HISTORY,
  IconCheck, IconPlus, IconChevronLeft, IconChevronRight, IconMic,
  MonoLabel,
} = window;

const HABIT_ICON_MAP_HD = {
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
function _icon(h) {
  const f = HABIT_ICON_MAP_HD[h.icon];
  return f ? f() : window.IconCheck;
}

// Simple similarity for repeat detection: lowercase + trim.
// In production this'd be Levenshtein or embeddings.
function isRepeat(text, history) {
  if (!text) return false;
  const t = text.trim().toLowerCase();
  if (t.length < 3) return false;
  return history.some(h => h.what.trim().toLowerCase() === t);
}

function HabitDetail({ t, open, habit, onClose }) {
  if (!open || !habit) return null;
  const cat = HABIT_CATS.find(c => c.id === habit.cat);
  const tint = t.pillar[cat ? cat.color : 'journal'] || t.fg;
  const onTint = '#0A0908';
  const Icon = _icon(habit);

  const initialHistory = MOCK_HISTORY[habit.id] || [];
  const [entries, setEntries] = useStateHd([]);
  const [draft, setDraft] = useStateHd('');
  const allHistory = [...entries, ...initialHistory];
  const repeatFlag = habit.norepeat && isRepeat(draft, allHistory);

  function addEntry() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setEntries(arr => [{
      id: 'e' + Date.now(),
      date: 'Today',
      time: `${hh}:${mm}`,
      what: text,
      repeat: repeatFlag,
    }, ...arr]);
    setDraft('');
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: '92%', background: t.bg, color: t.fg,
        borderRadius: '24px 24px 0 0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: t.fgFaint, opacity: 0.5,
          margin: '12px auto 14px' }}></div>

        {/* Header */}
        <div style={{ padding: '0 20px',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center',
            minWidth: 0, flex: 1 }}>
            <div style={{
              width: 40, height: 40, flexShrink: 0,
              borderRadius: 10, background: tint, color: onTint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={20} stroke={1.9}/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <MonoLabel t={t} color={tint}>
                {cat ? cat.lab.toUpperCase() : ''} · habit
              </MonoLabel>
              <div style={{ fontFamily: t.fonts.display, fontWeight: 800,
                fontSize: 22, letterSpacing: '-0.03em', lineHeight: 1.05,
                marginTop: 2, color: t.fg }}>{habit.lab}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: t.surface2, color: t.fg,
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
            flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 24px' }}>

          {/* Why */}
          {habit.why && (
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: tint + '12', border: `1px solid ${tint}44`,
            }}>
              <MonoLabel t={t} color={tint}>why this matters</MonoLabel>
              <div style={{ fontFamily: t.fonts.body, fontSize: 13,
                color: t.fg, lineHeight: 1.5, marginTop: 6 }}>
                {habit.why}</div>
            </div>
          )}

          {/* Today's log */}
          <div style={{ marginTop: 18,
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline' }}>
            <MonoLabel t={t}>today · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</MonoLabel>
            {habit.norepeat && (
              <span style={{ fontFamily: t.fonts.mono, fontSize: 9,
                fontWeight: 700, letterSpacing: '0.14em',
                color: t.semantic.mid, textTransform: 'uppercase' }}>
                no-repeat habit
              </span>
            )}
          </div>

          {entries.length === 0 ? (
            <div style={{ marginTop: 8, padding: '14px',
              borderRadius: 12, background: t.surface,
              border: `1px dashed ${t.divider}`,
              textAlign: 'center',
              fontFamily: t.fonts.body, fontSize: 12,
              color: t.fgMuted }}>
              No entries yet. Add what you did below.
            </div>
          ) : (
            <div style={{ marginTop: 8,
              display: 'flex', flexDirection: 'column', gap: 4 }}>
              {entries.map(e => (
                <div key={e.id} style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: t.surface, border: `1px solid ${t.divider}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                  opacity: e.repeat ? 0.55 : 1,
                }}>
                  <div style={{
                    width: 22, height: 22, flexShrink: 0,
                    borderRadius: '50%', background: e.repeat ? t.surface2 : tint,
                    color: e.repeat ? t.fgMuted : onTint,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconCheck size={13} stroke={2.4}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: t.fonts.body, fontSize: 12.5,
                      fontWeight: 600, color: t.fg,
                      textDecoration: e.repeat ? 'line-through' : 'none' }}>
                      {e.what}</div>
                    <div style={{ fontFamily: t.fonts.mono, fontSize: 9,
                      fontWeight: 700, letterSpacing: '0.14em',
                      color: t.fgFaint, textTransform: 'uppercase',
                      marginTop: 1 }}>
                      {e.time}{e.repeat ? ' · repeat — doesn\'t count' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add entry */}
          <div style={{ marginTop: 16,
            padding: '10px 12px', borderRadius: 12,
            background: t.surface,
            border: `1.5px solid ${repeatFlag ? t.semantic.mid : t.divider}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addEntry(); }}
                placeholder="What did you do?"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  background: 'transparent', color: t.fg,
                  fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13.5,
                  padding: '8px 0',
                }}/>
              <button style={{
                border: 'none', background: 'transparent',
                padding: 4, cursor: 'pointer', color: tint, display: 'flex',
              }}><IconMic size={18} stroke={1.9}/></button>
              <button onClick={addEntry} disabled={!draft.trim()}
                style={{
                  border: 'none',
                  background: draft.trim() ? tint : t.surface2,
                  color: draft.trim() ? onTint : t.fgFaint,
                  padding: '8px 14px', borderRadius: 8,
                  fontFamily: t.fonts.mono, fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: draft.trim() ? 'pointer' : 'default',
                }}>Log</button>
            </div>
            {repeatFlag && (
              <div style={{ marginTop: 8, paddingTop: 8,
                borderTop: `1px solid ${t.divider}`,
                fontFamily: t.fonts.body, fontSize: 11.5,
                color: t.semantic.mid, lineHeight: 1.4 }}>
                <b>Repeat.</b> You already did this — it won't count.
                Switch it up.
              </div>
            )}
          </div>

          {/* Examples */}
          {habit.examples && habit.examples.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <MonoLabel t={t}>examples · tap to fill</MonoLabel>
              <div style={{ marginTop: 8,
                display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {habit.examples.map((ex, i) => {
                  const alreadyDone = allHistory.some(h =>
                    h.what.trim().toLowerCase() === ex.trim().toLowerCase());
                  return (
                    <button key={i}
                      onClick={() => setDraft(ex)}
                      style={{
                        border: `1px solid ${alreadyDone ? t.divider : tint + '55'}`,
                        background: alreadyDone ? t.surface2 : 'transparent',
                        color: alreadyDone ? t.fgFaint : t.fg,
                        padding: '7px 11px', borderRadius: 999,
                        cursor: 'pointer',
                        fontFamily: t.fonts.body, fontWeight: 600, fontSize: 11.5,
                        textDecoration: alreadyDone ? 'line-through' : 'none',
                      }}>{ex}</button>
                  );
                })}
              </div>
              {habit.norepeat && (
                <div style={{ fontFamily: t.fonts.mono, fontSize: 9,
                  fontWeight: 600, letterSpacing: '0.14em',
                  color: t.fgFaint, textTransform: 'uppercase',
                  marginTop: 8 }}>
                  Strikethrough = used recently · won't count again
                </div>
              )}
            </div>
          )}

          {/* History */}
          <div style={{ marginTop: 22 }}>
            <MonoLabel t={t}>last 7 days</MonoLabel>
            <div style={{ marginTop: 8, display: 'flex',
              flexDirection: 'column', gap: 4 }}>
              {initialHistory.map(h => (
                <div key={h.id} style={{
                  padding: '9px 12px', borderRadius: 9,
                  background: t.surface,
                  display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5,
                    fontWeight: 700, letterSpacing: '0.14em',
                    color: t.fgFaint, textTransform: 'uppercase',
                    width: 36, flexShrink: 0 }}>{h.date}</span>
                  <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5,
                    color: t.fgFaint, flexShrink: 0 }}>{h.time}</span>
                  <span style={{ flex: 1, minWidth: 0,
                    fontFamily: t.fonts.body, fontSize: 12.5, color: t.fg,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' }}>{h.what}</span>
                </div>
              ))}
              {initialHistory.length === 0 && (
                <div style={{ padding: '14px', textAlign: 'center',
                  fontFamily: t.fonts.body, fontSize: 12,
                  color: t.fgMuted }}>
                  No history yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HabitDetail });
