// SOMA — Import screen. Paste a week from NotebookLM → review parsed
// programming → save. Three phases: 'paste' | 'review' | 'saved'.
// Relies on parseProgram / SAMPLE_PROGRAM (soma-import.jsx) and the
// shared chrome (ScreenFrame, PillarHeader, MonoLabel, StatusBar).

const { useState: useImpState, useEffect: useImpEffect } = React;

// Visual identity per block type.
function impBlockStyle(type, t) {
  switch (type) {
    case 'warmup':    return { col: t.tertiary,     Icon: window.IconStretch };
    case 'skill':     return { col: t.fg,           Icon: window.IconTarget };
    case 'strength':  return { col: t.pillar.train, Icon: window.IconBarbell };
    case 'wod':       return { col: t.secondary,    Icon: window.IconBolt };
    case 'accessory': return { col: t.fgMuted,      Icon: window.IconDumbbellSmall };
    case 'cooldown':  return { col: t.tertiary,     Icon: window.IconLotus };
    default:          return { col: t.fg,           Icon: window.IconBolt };
  }
}

// Pretty block name: pull a quoted name, else strip the type keyword.
function impBlockName(b) {
  const q = b.title.match(/[""“”']([^""“”']+)[""“”']/);
  if (q) return q[1];
  let s = b.title
    .replace(/\([^)]*\)/g, '')
    .replace(/^(calentamiento|warm.?up|movilidad|activaci[oó]n|skill|t[eé]cnica|pr[aá]ctica|gimnasia|fuerza|strength|halterofilia|levantamiento|met.?con|wod|conditioning|condicionamiento|aer[oó]bico|accesorio|accessory|complementario|bodybuilding|enfriamiento|cool.?down|estiramiento)\b/i, '')
    .replace(/[—–\-:"""'']+/g, ' ')
    .trim();
  return s || b.typeLabel;
}

function impLoadStr(load) {
  if (!load) return null;
  if (load.rx) return `${load.rx}/${load.scaled} ${load.unit}`;
  if (load.pct) return `@ ${load.pct}%`;
  if (load.single) return `${load.single} ${load.unit}`;
  return null;
}

// ── Phase: PASTE ────────────────────────────────────────────────────
function ImpPaste({ t, text, setText, onAnalyze }) {
  const [pasteNote, setPasteNote] = useImpState(null);

  async function pasteClipboard() {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip && clip.trim()) { setText(clip); setPasteNote('Pegado desde el portapapeles'); }
      else setPasteNote('Portapapeles vacío');
    } catch (e) {
      setPasteNote('Pega manualmente con ⌘V');
    }
    setTimeout(() => setPasteNote(null), 2200);
  }

  return (
    <div style={{ padding: '14px 18px 120px', overflow: 'auto', height: '100%' }}>
      {/* Source hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', borderRadius: 14, background: t.surface,
        border: `1px solid ${t.divider}` }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: t.surface2, color: t.tertiary,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <window.IconJournal size={18} stroke={1.9}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 12.5,
            color: t.fg }}>Desde NotebookLM</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11, color: t.fgMuted,
            marginTop: 1, lineHeight: 1.4 }}>
            Copia la semana completa y pégala. SOMA detecta días, bloques,
            cargas y qué medir en cada WOD.</div>
        </div>
      </div>

      {/* Textarea */}
      <div style={{ marginTop: 14, position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={'Pega aquí tu programación…\n\nLUNES — Fuerza\nBack Squat 5x5 @ 75%\nMetCon "Fran" (For Time)\n21-15-9\n- Thrusters (43/30 kg)\n- Pull-ups'}
          spellCheck={false}
          style={{
            width: '100%', minHeight: 260, resize: 'vertical',
            boxSizing: 'border-box', padding: '14px',
            borderRadius: 16, border: `1px solid ${t.border}`,
            background: t.surface, color: t.fg,
            fontFamily: t.fonts.mono, fontSize: 11.5, lineHeight: 1.7,
            outline: 'none',
          }}/>
        {text && (
          <button onClick={() => setText('')} style={{
            position: 'absolute', top: 10, right: 10,
            border: 'none', background: t.surface2, color: t.fgMuted,
            borderRadius: 999, width: 24, height: 24, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><window.IconClose size={13} stroke={2}/></button>
        )}
      </div>

      {/* Helper buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={pasteClipboard} style={{
          flex: 1, padding: '11px 0', borderRadius: 11,
          border: `1px solid ${t.border}`, background: t.surface, color: t.fg,
          fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <window.IconDownload size={15} stroke={1.9}/> Portapapeles
        </button>
        <button onClick={() => setText(window.SAMPLE_PROGRAM)} style={{
          flex: 1, padding: '11px 0', borderRadius: 11,
          border: `1px dashed ${t.border}`, background: 'transparent', color: t.fgMuted,
          fontFamily: t.fonts.body, fontWeight: 600, fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <window.IconInfo size={15} stroke={1.9}/> Ejemplo
        </button>
      </div>
      {pasteNote && (
        <div style={{ marginTop: 8, fontFamily: t.fonts.mono, fontSize: 9.5,
          letterSpacing: '0.08em', color: t.tertiary, textAlign: 'center',
          textTransform: 'uppercase' }}>{pasteNote}</div>
      )}

      {/* What gets captured */}
      <div style={{ marginTop: 22 }}>
        <window.MonoLabel t={t}>Qué se captura</window.MonoLabel>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8 }}>
          {[
            [window.IconCalendarDays, 'Días + foco'],
            [window.IconBarbell, 'Cargas RX/escalado'],
            [window.IconTimer, 'Tipo de resultado'],
            [window.IconRadar, 'Métricas por movimiento'],
          ].map(([Ic, lab], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9,
              padding: '11px 12px', borderRadius: 12, background: t.surface,
              border: `1px solid ${t.divider}` }}>
              <span style={{ color: t.pillar.train, display: 'flex' }}><Ic size={17}/></span>
              <span style={{ fontFamily: t.fonts.body, fontSize: 11.5, fontWeight: 600,
                color: t.fg }}>{lab}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 18px 22px',
        background: `linear-gradient(to top, ${t.bg} 70%, ${t.bg}00)` }}>
        <button disabled={!text.trim()} onClick={onAnalyze} style={{
          width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
          background: text.trim() ? t.accent : t.surface2,
          color: text.trim() ? t.onAccent : t.fgFaint,
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 15,
          letterSpacing: '-0.01em', cursor: text.trim() ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Analizar programa <window.IconChevronRight size={18} stroke={2.4}/>
        </button>
      </div>
    </div>
  );
}

// ── Movement row ────────────────────────────────────────────────────
function ImpMoveRow({ mv, t }) {
  const Equip = window[mv.equip] || window.IconBodyweight;
  const load = impLoadStr(mv.load);
  return (
    <div style={{ display: 'flex', gap: 10, padding: '9px 0',
      borderTop: `1px solid ${t.divider}` }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: t.surface2, color: t.pillar.train,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Equip size={16} stroke={1.8}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          {mv.reps && <span style={{ fontFamily: t.fonts.mono, fontSize: 11,
            fontWeight: 700, color: t.fg }}>{mv.reps}</span>}
          <span style={{ fontFamily: t.fonts.body, fontSize: 12.5, fontWeight: 600,
            color: t.fg }}>{mv.name}</span>
          {load && <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5,
            fontWeight: 700, letterSpacing: '0.04em', color: t.onAccent,
            background: t.pillar.train, padding: '2px 6px', borderRadius: 5 }}>
            {load}</span>}
        </div>
        {/* what we measure */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
          {mv.measures.map(m => (
            <span key={m.key} style={{ fontFamily: t.fonts.mono, fontSize: 8,
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: t.fgMuted, background: t.surface2, padding: '2px 5px',
              borderRadius: 4 }}>{m.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Block card ──────────────────────────────────────────────────────
function ImpBlockCard({ b, t }) {
  const { col, Icon } = impBlockStyle(b.type, t);
  const name = impBlockName(b);
  const badges = [b.rounds, b.scheme, b.timeCap].filter(Boolean);
  return (
    <div style={{ marginTop: 10, borderRadius: 14, background: t.surface,
      border: `1px solid ${t.divider}`, overflow: 'hidden' }}>
      {/* Block head */}
      <div style={{ padding: '11px 13px 9px', display: 'flex',
        alignItems: 'center', gap: 9 }}>
        <span style={{ color: col, display: 'flex' }}><Icon size={17} stroke={1.9}/></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: col }}>
            {b.typeLabel}</div>
          <div style={{ fontFamily: t.fonts.display, fontSize: 15, fontWeight: 700,
            letterSpacing: '-0.02em', color: t.fg, lineHeight: 1.1 }}>{name}</div>
        </div>
        {b.score && (
          <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: t.secondary, border: `1px solid ${t.secondary}`,
            padding: '3px 7px', borderRadius: 6 }}>{b.score.label}</span>
        )}
      </div>

      {/* badges */}
      {badges.length > 0 && (
        <div style={{ padding: '0 13px 4px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {badges.map((bd, i) => (
            <span key={i} style={{ fontFamily: t.fonts.mono, fontSize: 9,
              fontWeight: 600, letterSpacing: '0.06em', color: t.fgMuted,
              background: t.surface2, padding: '3px 7px', borderRadius: 6 }}>{bd}</span>
          ))}
        </div>
      )}

      {/* result type */}
      {b.score && (
        <div style={{ margin: '4px 13px 0', padding: '7px 10px', borderRadius: 9,
          background: t.surface2, display: 'flex', alignItems: 'center', gap: 7 }}>
          <window.IconTarget size={13} color={t.secondary}/>
          <span style={{ fontFamily: t.fonts.body, fontSize: 10.5, color: t.fgMuted }}>
            Resultado a registrar:</span>
          <span style={{ fontFamily: t.fonts.body, fontSize: 10.5, fontWeight: 700,
            color: t.fg }}>{b.score.result}</span>
        </div>
      )}

      {/* movements */}
      {b.movements.length > 0 && (
        <div style={{ padding: '6px 13px 11px', marginTop: 6 }}>
          {b.movements.map((mv, i) => <ImpMoveRow key={i} mv={mv} t={t}/>)}
        </div>
      )}

      {/* notes only (no movements) */}
      {b.movements.length === 0 && b.notes.length > 0 && (
        <div style={{ padding: '2px 13px 12px' }}>
          {b.notes.map((n, i) => (
            <div key={i} style={{ fontFamily: t.fonts.body, fontSize: 11.5,
              color: t.fgMuted, lineHeight: 1.5 }}>{n}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Day card ────────────────────────────────────────────────────────
function ImpDayCard({ day, t, open, onToggle }) {
  const moveCount = day.blocks.reduce((n, b) => n + b.movements.length, 0);
  return (
    <div style={{ marginTop: 10, borderRadius: 18, overflow: 'hidden',
      border: `1px solid ${open ? t.border : t.divider}`,
      background: open ? t.surface : 'transparent' }}>
      <button onClick={onToggle} style={{ width: '100%', border: 'none',
        background: 'transparent', cursor: 'pointer', textAlign: 'left',
        padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: t.fg, color: t.bg, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 800,
            letterSpacing: '0.04em' }}>{day.abbr}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: t.fonts.display, fontSize: 16, fontWeight: 800,
            letterSpacing: '-0.02em', color: t.fg, textTransform: 'capitalize',
            lineHeight: 1.05 }}>{day.name.toLowerCase()}</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 11, color: t.fgMuted,
            marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' }}>
            {day.focus || `${day.blocks.length} bloques`}
            {day.focus && ` · ${moveCount} mov`}</div>
        </div>
        <span style={{ color: t.fgFaint, display: 'flex',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <window.IconChevronDown size={18} stroke={2}/></span>
      </button>
      {open && (
        <div style={{ padding: '0 12px 13px' }}>
          {day.blocks.map((b, i) => <ImpBlockCard key={i} b={b} t={t}/>)}
        </div>
      )}
    </div>
  );
}

// ── Phase: REVIEW ───────────────────────────────────────────────────
function ImpReview({ t, result, onSave, onBack }) {
  const [openId, setOpenId] = useImpState(result.days[0] ? result.days[0].id : null);
  const s = result.stats;

  return (
    <div style={{ padding: '8px 18px 110px', overflow: 'auto', height: '100%' }}>
      {/* Summary banner */}
      <div style={{ borderRadius: 18, padding: '16px 16px 4px',
        background: t.surface, border: `1px solid ${t.divider}` }}>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.16em', color: t.tertiary, textTransform: 'uppercase' }}>
          Detectado</div>
        <div style={{ fontFamily: t.fonts.display, fontSize: 19, fontWeight: 800,
          letterSpacing: '-0.03em', color: t.fg, marginTop: 3, lineHeight: 1.1 }}>
          {result.weekTitle || 'Programación semanal'}</div>
        <div style={{ display: 'flex', marginTop: 14, paddingBottom: 14 }}>
          {[
            [s.days, 'días'], [s.blocks, 'bloques'],
            [s.movements, 'mov'], [s.scored, 'con score'],
          ].map(([n, lab], i, arr) => (
            <div key={i} style={{ flex: 1, textAlign: 'center',
              borderRight: i < arr.length - 1 ? `1px solid ${t.divider}` : 'none' }}>
              <div style={{ fontFamily: t.fonts.display, fontSize: 24, fontWeight: 800,
                letterSpacing: '-0.04em', color: t.fg }}>{n}</div>
              <div style={{ fontFamily: t.fonts.mono, fontSize: 8, fontWeight: 600,
                letterSpacing: '0.12em', color: t.fgFaint, textTransform: 'uppercase',
                marginTop: 2 }}>{lab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div style={{ marginTop: 10, borderRadius: 12, padding: '11px 13px',
          background: t.semantic.mid + '1A', border: `1px solid ${t.semantic.mid}55` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <window.IconInfo size={14} color={t.semantic.mid}/>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.12em', color: t.semantic.mid, textTransform: 'uppercase' }}>
              Revisa {result.warnings.length}</span>
          </div>
          {result.warnings.slice(0, 3).map((w, i) => (
            <div key={i} style={{ fontFamily: t.fonts.body, fontSize: 10.5,
              color: t.fgMuted, marginTop: 5, lineHeight: 1.4 }}>· {w}</div>
          ))}
        </div>
      )}

      {/* Days */}
      <div style={{ marginTop: 14 }}>
        <window.MonoLabel t={t}>La semana</window.MonoLabel>
      </div>
      {result.days.map(d => (
        <ImpDayCard key={d.id} day={d} t={t}
          open={openId === d.id}
          onToggle={() => setOpenId(openId === d.id ? null : d.id)}/>
      ))}

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 18px 22px',
        background: `linear-gradient(to top, ${t.bg} 70%, ${t.bg}00)`,
        display: 'flex', gap: 8 }}>
        <button onClick={onBack} style={{
          padding: '15px 16px', borderRadius: 14, border: `1px solid ${t.border}`,
          background: t.surface, color: t.fg, cursor: 'pointer',
          fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13 }}>
          Editar</button>
        <button onClick={onSave} style={{
          flex: 1, padding: '15px 0', borderRadius: 14, border: 'none',
          background: t.accent, color: t.onAccent, cursor: 'pointer',
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 14.5,
          letterSpacing: '-0.01em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Guardar en Entrena <window.IconCheck size={18} stroke={2.6}/>
        </button>
      </div>
    </div>
  );
}

// ── Phase: SAVED ────────────────────────────────────────────────────
function ImpSaved({ t, result, onGoTrain, onAgain }) {
  const s = result.stats;
  return (
    <div style={{ padding: '40px 22px', height: '100%', overflow: 'auto',
      display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.accent,
        color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '20px auto 0' }}>
        <window.IconCheck size={32} stroke={2.6}/>
      </div>
      <div style={{ fontFamily: t.fonts.display, fontSize: 26, fontWeight: 800,
        letterSpacing: '-0.035em', color: t.fg, textAlign: 'center', marginTop: 20,
        lineHeight: 1.05 }}>
        Semana guardada</div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted,
        textAlign: 'center', marginTop: 8, lineHeight: 1.5, maxWidth: 280,
        alignSelf: 'center' }}>
        {s.days} días y {s.movements} movimientos quedaron listos en Entrena.
        Cada WOD abre con su tipo de resultado y campos para registrar.</div>

      <div style={{ marginTop: 24, borderRadius: 16, background: t.surface,
        border: `1px solid ${t.divider}`, overflow: 'hidden' }}>
        {[
          [window.IconCalendarDays, `${s.days} días programados`, 'agendados esta semana'],
          [window.IconTimer, `${s.scored} WODs con score`, 'tiempo · rondas · carga'],
          [window.IconRadar, `${s.movements} movimientos`, 'con sus métricas a medir'],
        ].map(([Ic, a, b], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12,
            padding: '13px 14px', borderTop: i > 0 ? `1px solid ${t.divider}` : 'none' }}>
            <span style={{ color: t.pillar.train, display: 'flex' }}><Ic size={19}/></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.fonts.body, fontSize: 13, fontWeight: 700,
                color: t.fg }}>{a}</div>
              <div style={{ fontFamily: t.fonts.body, fontSize: 10.5, color: t.fgMuted }}>{b}</div>
            </div>
            <window.IconCheck size={16} color={t.semantic.ok}/>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex',
        flexDirection: 'column', gap: 8 }}>
        <button onClick={onGoTrain} style={{
          width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
          background: t.accent, color: t.onAccent, cursor: 'pointer',
          fontFamily: t.fonts.display, fontWeight: 800, fontSize: 14.5 }}>
          Ir a Entrena</button>
        <button onClick={onAgain} style={{
          width: '100%', padding: '13px 0', borderRadius: 14,
          border: `1px solid ${t.border}`, background: 'transparent', color: t.fg,
          cursor: 'pointer', fontFamily: t.fonts.body, fontWeight: 600, fontSize: 13 }}>
          Importar otra semana</button>
      </div>
    </div>
  );
}

// ── Container ───────────────────────────────────────────────────────
function ImportScreen({ t, Mark, onMenu, onTab }) {
  const [phase, setPhase] = useImpState('paste');
  const [text, setText]   = useImpState(() => {
    try { return localStorage.getItem('soma_import_text') || ''; } catch (e) { return ''; }
  });
  const [result, setResult] = useImpState(null);

  useImpEffect(() => {
    try { localStorage.setItem('soma_import_text', text); } catch (e) {}
  }, [text]);

  function analyze() {
    const r = window.parseProgram(text);
    setResult(r);
    setPhase('review');
  }
  function save() {
    try { localStorage.setItem('soma_saved_week', JSON.stringify(result)); } catch (e) {}
    setPhase('saved');
  }

  const subMap = {
    paste:  'Pega tu semana desde NotebookLM',
    review: 'Revisa lo que se detectó',
    saved:  'Listo para entrenar',
  };

  return (
    <window.ScreenFrame t={t} accent={{ Mark, color: t.pillar.train }}>
      <window.StatusBar t={t}/>
      <window.PillarHeader t={t} title="Importar"
        sub={subMap[phase]}
        pillarColor={t.pillar.train} Mark={Mark}
        onMenu={phase === 'paste' ? onMenu : undefined}
        onBack={phase !== 'paste' ? () => setPhase(phase === 'saved' ? 'review' : 'paste') : undefined}/>
      <div style={{ position: 'absolute', top: 92, left: 0, right: 0, bottom: 0 }}>
        {phase === 'paste' && (
          <ImpPaste t={t} text={text} setText={setText} onAnalyze={analyze}/>
        )}
        {phase === 'review' && result && (
          <ImpReview t={t} result={result} onSave={save}
            onBack={() => setPhase('paste')}/>
        )}
        {phase === 'saved' && result && (
          <ImpSaved t={t} result={result}
            onGoTrain={() => onTab && onTab('train')}
            onAgain={() => { setText(''); setResult(null); setPhase('paste'); }}/>
        )}
      </div>
    </window.ScreenFrame>
  );
}

Object.assign(window, { ImportScreen });
