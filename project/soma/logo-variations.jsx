// SOMA — Logo variations canvas (round 2)
// Section 1: 25 mark variations (5 per direction)
// Section 2: 12 wordmark studies (4 fonts × 3 treatments)

const { DesignCanvas, DCSection, DCArtboard } = window;

// Five direction palettes — tones adjusted per round-1 feedback.
// (Editorial cream slightly deeper, Humanist slightly cooler-warm.)
const TONES = {
  T: { bg: '#0B0B10', fg: '#F4F1EC', sub: '#7A746D', label: 'PERFORMANCE' },
  D: { bg: '#FFFFFF', fg: '#0A0A0A', sub: '#7A7A7A', label: 'MONOLITH' },
  C: { bg: '#E8DECD', fg: '#2D1F12', sub: '#8A7860', label: 'EDITORIAL' },
  A: { bg: '#14171C', fg: '#E6EBE5', sub: '#6E7A78', label: 'INSTRUMENT' },
  R: { bg: '#EEE7DA', fg: '#1F1B17', sub: '#8B7F70', label: 'HUMANIST' },
};

const MARK_VARIATIONS = [
  // Performance / Triangle
  { id: 'T1', dir: 'T', Mark: window.T1, note: 'original — filled equilateral' },
  { id: 'T2', dir: 'T', Mark: window.T2, note: 'larger, apex pushed up' },
  { id: 'T3', dir: 'T', Mark: window.T3, note: 'outlined, same stroke as ring' },
  { id: 'T4', dir: 'T', Mark: window.T4, note: 'aimed NE — toward the gap' },
  { id: 'T5', dir: 'T', Mark: window.T5, note: 'compound — outline + inner' },

  // Monolith / Dot
  { id: 'D1', dir: 'D', Mark: window.D1, note: 'original small dot' },
  { id: 'D2', dir: 'D', Mark: window.D2, note: 'large filled mass' },
  { id: 'D3', dir: 'D', Mark: window.D3, note: 'concentric inner ring' },
  { id: 'D4', dir: 'D', Mark: window.D4, note: 'disc + halo' },
  { id: 'D5', dir: 'D', Mark: window.D5, note: 'reticle / crosshair' },

  // Editorial / Chevrons
  { id: 'C1', dir: 'C', Mark: window.C1, note: 'original — 3 equal' },
  { id: 'C2', dir: 'C', Mark: window.C2, note: 'growth — varied thickness' },
  { id: 'C3', dir: 'C', Mark: window.C3, note: '2 thick chevrons' },
  { id: 'C4', dir: 'C', Mark: window.C4, note: '1 bold chevron' },
  { id: 'C5', dir: 'C', Mark: window.C5, note: 'telescoping' },

  // Instrument / Axis
  { id: 'A1', dir: 'A', Mark: window.A1, note: 'original — line + dots' },
  { id: 'A2', dir: 'A', Mark: window.A2, note: 'line + crossbar' },
  { id: 'A3', dir: 'A', Mark: window.A3, note: 'extended — crosses ring' },
  { id: 'A4', dir: 'A', Mark: window.A4, note: 'rails — two parallels' },
  { id: 'A5', dir: 'A', Mark: window.A5, note: 'single thick bar' },

  // Humanist / Arc
  { id: 'R1', dir: 'R', Mark: window.R1, note: 'original — small arc base' },
  { id: 'R2', dir: 'R', Mark: window.R2, note: 'larger U-cradle' },
  { id: 'R3', dir: 'R', Mark: window.R3, note: 'mirrored — top + bottom' },
  { id: 'R4', dir: 'R', Mark: window.R4, note: 'crescent — body / mind' },
  { id: 'R5', dir: 'R', Mark: window.R5, note: 'hemisphere — vessel' },
];

const WORDMARKS = [
  // Syne — user's #1 font
  { id: 'SY1', font: 'Syne', weight: 700, tracking: '0', label: 'Syne 700 · neutral', size: 84 },
  { id: 'SY2', font: 'Syne', weight: 800, tracking: '-0.045em', label: 'Syne 800 · tight (-4.5%)', size: 84 },
  { id: 'SY3', font: 'Syne', weight: 800, tracking: '0.16em', label: 'Syne 800 · spaced (+16%)', size: 72 },

  // Bricolage Grotesque — #2
  { id: 'BR1', font: 'Bricolage Grotesque', weight: 700, tracking: '-0.015em', label: 'Bricolage 700 · neutral', size: 84 },
  { id: 'BR2', font: 'Bricolage Grotesque', weight: 800, tracking: '-0.04em', label: 'Bricolage 800 · tight (-4%)', size: 84 },
  { id: 'BR3', font: 'Bricolage Grotesque', weight: 800, tracking: '-0.02em', label: 'Bricolage 800 · compressed', size: 88, fontStretch: '75%' },

  // Hanken Grotesk — #3
  { id: 'HK1', font: 'Hanken Grotesk', weight: 700, tracking: '-0.01em', label: 'Hanken 700 · neutral', size: 84 },
  { id: 'HK2', font: 'Hanken Grotesk', weight: 900, tracking: '-0.04em', label: 'Hanken 900 · tight (-4%)', size: 84 },
  { id: 'HK3', font: 'Hanken Grotesk', weight: 800, tracking: '0.12em', label: 'Hanken 800 · spaced (+12%)', size: 72 },

  // Archivo Black — #4
  { id: 'AR1', font: 'Archivo Black', weight: 400, tracking: '-0.025em', label: 'Archivo Black · tight (-2.5%)', size: 80 },
  { id: 'AR2', font: 'Archivo Black', weight: 400, tracking: '0', label: 'Archivo Black · neutral', size: 80 },
  { id: 'AR3', font: 'Archivo Black', weight: 400, tracking: '0.14em', label: 'Archivo Black · spaced (+14%)', size: 68 },
];

// ─── Tiles ───
function MarkTile({ v }) {
  const t = TONES[v.dir];
  const { Mark } = v;
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg, color: t.fg,
      padding: 22, boxSizing: 'border-box', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 18,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.14em', color: t.sub,
      }}>{v.id}</div>
      <div style={{
        position: 'absolute', top: 14, right: 18,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
        letterSpacing: '0.18em', color: t.sub, opacity: 0.7,
      }}>{t.label}</div>

      <svg width="150" height="150" viewBox="0 0 80 80">
        <Mark color={t.fg} />
      </svg>

      <div style={{
        position: 'absolute', bottom: 14, left: 18, right: 18,
        fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: 11, fontWeight: 500,
        textAlign: 'center', color: t.sub,
        textTransform: 'lowercase', fontFeatureSettings: '"liga" 1',
      }}>{v.note}</div>
    </div>
  );
}

function WordTile({ w }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#F7F5F0', color: '#15120E',
      padding: 24, boxSizing: 'border-box', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 20,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.14em', color: '#998F80',
      }}>{w.id}</div>

      <div style={{
        fontFamily: `'${w.font}', sans-serif`,
        fontWeight: w.weight,
        letterSpacing: w.tracking,
        fontSize: w.size,
        fontStretch: w.fontStretch || 'normal',
        lineHeight: 1,
      }}>SOMA</div>

      <div style={{
        position: 'absolute', bottom: 14, left: 20, right: 20,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: '#998F80',
        textAlign: 'center',
      }}>{w.label}</div>
    </div>
  );
}

// ─── App ───
function App() {
  // Group marks by direction so they read as a clear comparison row
  const byDir = ['T', 'D', 'C', 'A', 'R'];

  return (
    <DesignCanvas>
      {byDir.map(dir => {
        const t = TONES[dir];
        const variations = MARK_VARIATIONS.filter(v => v.dir === dir);
        return (
          <DCSection key={dir} id={`marks-${dir}`}
            title={`${dir} · ${t.label}`}
            subtitle={`Cinco refinamientos del mismo concepto base. Compara silueta, peso visual y carácter.`}>
            {variations.map(v => (
              <DCArtboard key={v.id} id={`m-${v.id}`} label={`${v.id} · ${v.note}`} width={220} height={260}>
                <MarkTile v={v} />
              </DCArtboard>
            ))}
          </DCSection>
        );
      })}

      <DCSection id="wordmarks" title="Wordmarks — estudios tipográficos"
        subtitle="El mismo SOMA en los 4 fonts top, con tres tratamientos cada uno (tight, neutral, spaced). Sin isotipo: juzga la letra.">
        {WORDMARKS.map(w => (
          <DCArtboard key={w.id} id={`w-${w.id}`} label={`${w.id} · ${w.label}`} width={360} height={200}>
            <WordTile w={w} />
          </DCArtboard>
        ))}
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
