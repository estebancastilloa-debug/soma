// SOMA — Round 3 canvas. Brand stake → mark concepts → wordmark shortlist. B&W only.

const { DesignCanvas, DCSection, DCArtboard } = window;
const { M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11 } = window;

// ─── Brand stake artboard (the why) ───
function BrandStake() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#fff', color: '#0A0A0A',
      padding: '40px 48px', boxSizing: 'border-box', position: 'relative',
      display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.18em', color: '#7A7A7A', textTransform: 'uppercase',
      }}>Brand Stake · Round 3</div>

      <div style={{
        fontFamily: 'Syne', fontWeight: 800, fontSize: 88, letterSpacing: '-0.045em',
        lineHeight: 0.95, marginTop: 14,
      }}>SOMA<span style={{ color: '#7A7A7A', fontWeight: 700 }}> — la totalidad</span></div>

      <div style={{
        fontFamily: 'DM Sans', fontSize: 15, lineHeight: 1.55, maxWidth: 600,
        marginTop: 18, color: '#2A2A2A',
      }}>Tres dimensiones convergen en un mismo sistema. La marca tiene que sostener esa idea sin recurrir a símbolos genéricos de fitness o de wellness.</div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28, marginTop: 26, padding: '22px 0', borderTop: '1px solid #E2E0DA', borderBottom: '1px solid #E2E0DA',
      }}>
        {[
          { glyph: <circle cx="20" cy="20" r="12" fill="#0A0A0A" />,
            label: 'CUERPO', sub: 'movimiento · entreno · presencia física' },
          { glyph: <rect x="8" y="8" width="24" height="24" fill="#0A0A0A" />,
            label: 'MENTE', sub: 'consciencia · journal · descanso' },
          { glyph: <polygon points="20,6 36,32 4,32" fill="#0A0A0A" />,
            label: 'TIEMPO', sub: 'ritmo · hábito · jornada acumulada' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">{d.glyph}</svg>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', color: '#0A0A0A' }}>{d.label}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: '#666',
              lineHeight: 1.5 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      <div style={{
        fontFamily: 'DM Sans', fontSize: 12, color: '#444', marginTop: 18,
        display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.5,
      }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', color: '#7A7A7A', textTransform: 'uppercase' }}>
          Reglas del round 3
        </div>
        <div>— Solo blanco y negro. Si funciona acá, funciona en color.</div>
        <div>— El ring deja de ser obligatorio. Si aparece, se gana el espacio.</div>
        <div>— Tres elementos como gramática base. Triada, no monolito.</div>
      </div>
    </div>
  );
}

// ─── Mark tile (B&W) ───
function MarkTile({ id, Mark, note, inverted = false }) {
  const bg = inverted ? '#0A0A0A' : '#FFFFFF';
  const fg = inverted ? '#FFFFFF' : '#0A0A0A';
  const sub = inverted ? '#7A7A7A' : '#7A7A7A';
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: fg,
      padding: 22, boxSizing: 'border-box', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 18,
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.16em', color: sub,
      }}>{id}</div>

      {Mark === 'logotype' ? <LogotypeMark fg={fg} /> : (
        <svg width="160" height="160" viewBox="0 0 80 80"><Mark color={fg} /></svg>
      )}

      <div style={{
        position: 'absolute', bottom: 14, left: 18, right: 18,
        fontFamily: 'DM Sans', fontSize: 11.5, color: sub,
        textAlign: 'center', lineHeight: 1.4,
      }}>{note}</div>
    </div>
  );
}

// ─── M12 special: logotype where the O is the ring ───
function LogotypeMark({ fg }) {
  const RING_R = 28, C = 2 * Math.PI * RING_R;
  const VIS = C * (315 / 360), GAP = C * (45 / 360);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline',
      fontFamily: 'Syne', fontWeight: 800, fontSize: 84,
      letterSpacing: '-0.045em', lineHeight: 1, color: fg,
    }}>
      <span>S</span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 64, height: 64, alignSelf: 'flex-end', marginBottom: 6,
        margin: '0 -4px 6px -4px',
      }}>
        <svg width="68" height="68" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={RING_R} fill="none" stroke={fg} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${VIS} ${GAP + 1}`}
            transform="rotate(-115 40 40)" />
        </svg>
      </span>
      <span>MA</span>
    </div>
  );
}

// ─── Mark catalog (grouped by seed) ───
const SEEDS = [
  {
    id: 'convergencia',
    title: '01 · Convergencia',
    subtitle: 'Tres elementos que se reúnen — la idea de tu nota: "el espacio en medio queda vacío y es un triangulo".',
    marks: [
      { id: 'M1', Mark: M1, note: 'tres círculos · triángulo en negativo' },
      { id: 'M2', Mark: M2, note: 'tres formas distintas · cada dimensión su glifo' },
      { id: 'M3', Mark: M3, note: 'tres líneas radiales · síntesis sin envolver' },
    ],
  },
  {
    id: 'equilibrio',
    title: '02 · Equilibrio',
    subtitle: 'Tu nota: "3 líneas horizontales del mismo tamaño demostrando que todo está balanceado".',
    marks: [
      { id: 'M4', Mark: M4, note: 'tres barras iguales · sin jerarquía' },
      { id: 'M5', Mark: M5, note: 'tres glifos alineados · ○ ▢ △' },
    ],
  },
  {
    id: 'progresion',
    title: '03 · Progresión',
    subtitle: 'Tu nota: "que sean 3, mismo grosor y ángulo, alineados". Crecimiento sin escándalo.',
    marks: [
      { id: 'M6', Mark: M6, note: 'tres chevrons uniformes · sin ring' },
      { id: 'M7', Mark: M7, note: 'tres barras ascendentes · crecimiento contenido' },
    ],
  },
  {
    id: 'bienestar',
    title: '04 · Bienestar',
    subtitle: 'Tu nota: "una sonrisa de que todo está bien, no de que paso algo". El arco sin ring.',
    marks: [
      { id: 'M8', Mark: M8, note: 'sonrisa sola · gesto único' },
      { id: 'M9', Mark: M9, note: 'sonrisa + tres puntos · chispa de plenitud' },
    ],
  },
  {
    id: 'gramatica',
    title: '05 · Gramática tripartita',
    subtitle: 'Cuando el ring sí gana su espacio — pero como triada, no como envoltura.',
    marks: [
      { id: 'M10', Mark: M10, note: 'ring en tres segmentos · patrones distintos por dimensión' },
      { id: 'M11', Mark: M11, note: 'tres triángulos anidados · capas de profundidad' },
      { id: 'M12', Mark: 'logotype', note: 'logotipo · la O es el mark, fusión wordmark+isotipo' },
    ],
  },
];

// ─── Wordmark shortlist (B&W) ───
const WORDMARKS = [
  { id: 'SY1', font: 'Syne', weight: 700, tracking: '0', size: 92 },
  { id: 'SY2', font: 'Syne', weight: 800, tracking: '-0.045em', size: 92 },
  { id: 'SY3', font: 'Syne', weight: 800, tracking: '0.16em', size: 76 },
  { id: 'BR3', font: 'Bricolage Grotesque', weight: 800, tracking: '-0.02em', size: 96, stretch: '75%' },
  { id: 'HK1', font: 'Hanken Grotesk', weight: 700, tracking: '-0.01em', size: 92 },
  { id: 'HK3', font: 'Hanken Grotesk', weight: 800, tracking: '0.12em', size: 76 },
  { id: 'AR2', font: 'Archivo Black', weight: 400, tracking: '0', size: 86 },
];

function WordmarkTile({ w, inverted = false }) {
  const bg = inverted ? '#0A0A0A' : '#FFFFFF';
  const fg = inverted ? '#FFFFFF' : '#0A0A0A';
  const sub = '#7A7A7A';
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: fg,
      padding: 24, boxSizing: 'border-box', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 20,
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.16em', color: sub,
      }}>{w.id}</div>
      <div style={{
        fontFamily: `'${w.font}', sans-serif`,
        fontWeight: w.weight,
        letterSpacing: w.tracking,
        fontSize: w.size,
        fontStretch: w.stretch || 'normal',
        lineHeight: 1,
      }}>SOMA</div>
      <div style={{
        position: 'absolute', bottom: 14, left: 20, right: 20,
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: sub,
        textAlign: 'center',
      }}>{w.font} · {w.weight} · {w.tracking || '0'} tracking</div>
    </div>
  );
}

// ─── App ───
function App() {
  return (
    <DesignCanvas>
      <DCSection id="stake" title="Stake — la idea que tiene que sostener la marca"
        subtitle="Antes de los marks. SOMA no es un símbolo de fitness — es la síntesis de tres dimensiones.">
        <DCArtboard id="stake-card" label="Brand Stake" width={720} height={500}>
          <BrandStake />
        </DCArtboard>
      </DCSection>

      {SEEDS.map(s => (
        <DCSection key={s.id} id={s.id} title={s.title} subtitle={s.subtitle}>
          {s.marks.map(m => (
            <DCArtboard key={m.id} id={`mk-${m.id}`} label={`${m.id} · ${m.note}`}
              width={m.id === 'M12' ? 380 : 260} height={300}>
              <MarkTile id={m.id} Mark={m.Mark} note={m.note} />
            </DCArtboard>
          ))}
          {/* Inverted test for the first mark in each seed */}
          <DCArtboard id={`mk-${s.marks[0].id}-inv`}
            label={`${s.marks[0].id} · invertido`}
            width={s.marks[0].id === 'M12' ? 380 : 260} height={300}>
            <MarkTile id={`${s.marks[0].id} ◐`} Mark={s.marks[0].Mark}
              note={`${s.marks[0].note} (sobre negro)`} inverted />
          </DCArtboard>
        </DCSection>
      ))}

      <DCSection id="wordmarks" title="Wordmarks · shortlist en B&W"
        subtitle="Los 7 que sobrevivieron del round 2. Sin isotipo: la letra sola.">
        {WORDMARKS.map((w, i) => (
          <DCArtboard key={w.id} id={`w-${w.id}`} label={`${w.id} · ${w.font}`}
            width={400} height={220}>
            <WordmarkTile w={w} inverted={i % 3 === 2} />
          </DCArtboard>
        ))}
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
