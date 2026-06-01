// SOMA — Logo system canvas. Six directions, three lenses each.

const { DesignCanvas, DCSection, DCArtboard } = window;
const { MarkTriangle, MarkCompass, MarkDot, MarkChevrons, MarkAxis, MarkArc } = window;

// ─── Six directions ───
// Each = mark + wordmark font + tonal pairing. Color sketch only — palette TBD.
const DIRECTIONS = [
  {
    id: 'performance',
    n: '01',
    name: 'PERFORMANCE',
    voice: 'Heavy, athletic, no apologies. Reads as a sports brand.',
    font: 'Syne',
    weight: 800,
    tracking: '-0.04em',
    Mark: MarkTriangle,
    bg: '#0B0B10',
    fg: '#F4F1EC',
    sub: '#8B8782',
    skins: ['#F4F1EC', '#FF5A1F', '#22D27D'],
  },
  {
    id: 'cerebral',
    n: '02',
    name: 'CEREBRAL',
    voice: 'Data-forward, clinical clarity. Reads as a scientific instrument.',
    font: 'Space Grotesk',
    weight: 700,
    tracking: '-0.025em',
    Mark: MarkCompass,
    bg: '#F2F4FB',
    fg: '#0E1A3D',
    sub: '#5868A0',
    skins: ['#0E1A3D', '#3B5BFF', '#0BB18D'],
  },
  {
    id: 'monolith',
    n: '03',
    name: 'MONOLITH',
    voice: 'Condensed, sober, heritage. No softness.',
    font: 'Archivo Black',
    weight: 400,
    tracking: '-0.015em',
    Mark: MarkDot,
    bg: '#FFFFFF',
    fg: '#0A0A0A',
    sub: '#8A8A8A',
    skins: ['#0A0A0A', '#E63946', '#1D9BF0'],
  },
  {
    id: 'editorial',
    n: '04',
    name: 'EDITORIAL',
    voice: 'Premium lifestyle. Reads like a magazine spread.',
    font: 'Bricolage Grotesque',
    weight: 800,
    tracking: '-0.03em',
    Mark: MarkChevrons,
    bg: '#EFE7D8',
    fg: '#2D1F12',
    sub: '#85735C',
    skins: ['#2D1F12', '#A2553F', '#5B7A4E'],
  },
  {
    id: 'instrument',
    n: '05',
    name: 'INSTRUMENT',
    voice: 'Tactical / control panel. Reads as a tracker dashboard.',
    font: 'JetBrains Mono',
    weight: 700,
    tracking: '-0.02em',
    Mark: MarkAxis,
    bg: '#14171C',
    fg: '#E6EBE5',
    sub: '#6E7A78',
    skins: ['#E6EBE5', '#D4F562', '#FF6B47'],
  },
  {
    id: 'humanist',
    n: '06',
    name: 'HUMANIST',
    voice: 'Soft, modern, holistic. Body-mind without losing structure.',
    font: 'Hanken Grotesk',
    weight: 900,
    tracking: '-0.035em',
    Mark: MarkArc,
    bg: '#F6F1E9',
    fg: '#1F1B17',
    sub: '#8B7F70',
    skins: ['#1F1B17', '#D97757', '#6B8E68'],
  },
];

// ─── helpers ───
const css = `
  .ds-card { width: 100%; height: 100%; padding: 36px 40px; position: relative;
             box-sizing: border-box; overflow: hidden; }
  .ds-top  { display: flex; justify-content: space-between; align-items: baseline;
             font-family: 'JetBrains Mono', monospace; font-size: 11px;
             font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
  .ds-num  { opacity: 0.5; }
  .ds-name { font-family: 'JetBrains Mono', monospace; font-size: 13px;
             font-weight: 700; letter-spacing: 0.16em; }
  .ds-voice { font-family: 'DM Sans', system-ui, sans-serif; font-size: 13px;
              line-height: 1.5; max-width: 340px; margin-top: 14px;
              font-weight: 400; }
  .ds-hero { display: flex; align-items: center; gap: 32px; margin-top: 30px; }
  .ds-wordmark { font-size: 96px; line-height: 0.85; }
  .ds-rule { height: 1px; margin: 26px 0 22px; }
  .ds-lockup-row { display: flex; align-items: center; gap: 14px; }
  .ds-lockup-word { font-size: 36px; line-height: 1; }
  .ds-foot { position: absolute; left: 40px; right: 40px; bottom: 28px;
             display: flex; align-items: flex-end; justify-content: space-between; }
  .ds-icons { display: flex; gap: 10px; }
  .ds-icon { border-radius: 22%; display: flex; align-items: center; justify-content: center; }
  .ds-caption { font-family: 'JetBrains Mono', monospace; font-size: 10px;
                letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.55;
                text-align: right; max-width: 240px; line-height: 1.5; }
`;

// ─── SystemCard: the big artboard per direction ───
function SystemCard({ d }) {
  const { Mark } = d;
  return (
    <div className="ds-card" style={{ background: d.bg, color: d.fg, fontFamily: d.font }}>
      <div className="ds-top" style={{ color: d.sub }}>
        <span><span className="ds-num">/</span> {d.n} <span className="ds-num">·</span> {d.name}</span>
        <span style={{ color: d.sub }}>{d.font} {d.weight}</span>
      </div>

      <div className="ds-voice" style={{ color: d.fg, opacity: 0.78 }}>{d.voice}</div>

      <div className="ds-hero">
        <svg width="170" height="170" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
          <Mark color={d.fg} />
        </svg>
        <div className="ds-wordmark" style={{
          fontFamily: d.font, fontWeight: d.weight, letterSpacing: d.tracking,
        }}>SOMA</div>
      </div>

      <div className="ds-rule" style={{ background: d.fg, opacity: 0.15 }}></div>

      <div className="ds-lockup-row">
        <svg width="44" height="44" viewBox="0 0 80 80">
          <Mark color={d.fg} sw={7} />
        </svg>
        <div className="ds-lockup-word" style={{
          fontFamily: d.font, fontWeight: d.weight, letterSpacing: d.tracking,
        }}>SOMA</div>
        <div style={{
          marginLeft: 'auto', fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500,
          color: d.sub, fontStyle: 'italic',
        }}>Live whole.</div>
      </div>

      <div className="ds-foot">
        <div className="ds-icons">
          {d.skins.map((c, i) => (
            <div key={i} className="ds-icon" style={{
              width: 60, height: 60,
              background: i === 0 ? d.fg : c,
              border: i === 0 ? `1px solid ${d.sub}` : 'none',
            }}>
              <svg width="38" height="38" viewBox="0 0 80 80">
                <Mark color={i === 0 ? d.bg : (c === d.fg ? d.bg : '#fff')} sw={7} />
              </svg>
            </div>
          ))}
        </div>
        <div className="ds-caption" style={{ color: d.sub }}>
          App icon · 3 skin tones<br/>color sketch · palette TBD
        </div>
      </div>
    </div>
  );
}

// ─── IsoOnly: just the mark, big, on dark + light side-by-side ───
function IsoOnly({ d }) {
  const { Mark } = d;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        flex: 1, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="110" height="110" viewBox="0 0 80 80"><Mark color={d.fg} /></svg>
      </div>
      <div style={{
        flex: 1, background: d.fg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="110" height="110" viewBox="0 0 80 80"><Mark color={d.bg} /></svg>
      </div>
      <div style={{
        position: 'absolute', bottom: 6, left: 8, right: 8,
        fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: d.sub, display: 'flex',
        justifyContent: 'space-between', pointerEvents: 'none',
      }}>
        <span>{d.n}</span><span>{d.name}</span>
      </div>
    </div>
  );
}

// ─── AppIcon: small iOS-style rounded square in a phone-corner mock ───
function AppIcon({ d }) {
  const { Mark } = d;
  return (
    <div style={{
      width: '100%', height: '100%', background: '#1a1a1f', padding: 22,
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start', gap: 8,
    }}>
      <div style={{
        width: 124, height: 124, borderRadius: '26%',
        background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 12px 30px ${d.bg === '#FFFFFF' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.55)'}`,
        border: d.bg === '#FFFFFF' ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}>
        <svg width="74" height="74" viewBox="0 0 80 80"><Mark color={d.fg} sw={7} /></svg>
      </div>
      <div style={{
        fontFamily: d.font, fontWeight: d.weight, color: '#fff',
        fontSize: 16, letterSpacing: d.tracking, marginTop: 6,
      }}>SOMA</div>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: '#5a5a64',
      }}>{d.n} · {d.name}</div>
    </div>
  );
}

// ─── App entry ───
function App() {
  return (
    <React.Fragment>
      <style>{css}</style>
      <DesignCanvas>
        <DCSection id="systems" title="Sistemas completos"
          subtitle="Cada tarjeta es una dirección de marca: mark + wordmark + lockup + variantes de app icon en tres skins. Color es sketch, no decisión.">
          {DIRECTIONS.map(d => (
            <DCArtboard key={d.id} id={d.id} label={`${d.n} · ${d.name}`} width={720} height={540}>
              <SystemCard d={d} />
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection id="iso" title="Solo isotipos"
          subtitle="El símbolo aislado, sobre fondo claro y oscuro. Compara cómo escala la idea por sí sola.">
          {DIRECTIONS.map(d => (
            <DCArtboard key={d.id} id={`iso-${d.id}`} label={`${d.n} · ${d.name}`} width={260} height={300}>
              <IsoOnly d={d} />
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection id="appicons" title="App icons"
          subtitle="Cómo se ve en el home screen. El test real es a 60×60 px — ¿se lee?">
          {DIRECTIONS.map(d => (
            <DCArtboard key={d.id} id={`app-${d.id}`} label={`${d.n} · ${d.name}`} width={220} height={260}>
              <AppIcon d={d} />
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
