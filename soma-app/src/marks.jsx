// ─── SOMA SVG Marks ─────────────────────────────────────────────────
// All live in viewBox 0 0 80 80. Accept { color, stroke }.

function Oval({ color, stroke = 8 }) {
  return <ellipse cx="40" cy="40" rx="32" ry="30" fill="none" stroke={color} strokeWidth={stroke} />;
}

export function F5({ color = 'currentColor', stroke = 8 }) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <Oval color={color} stroke={stroke} />
      <path d="M 16 40 Q 26 22 36 40 T 56 40 T 70 40" strokeWidth="3.4" />
    </g>
  );
}

export function F1({ color = 'currentColor', stroke = 8 }) {
  return (
    <g fill="none" strokeLinecap="round">
      <Oval color={color} stroke={stroke} />
      <path d="M 30 40 Q 40 50 50 40" stroke={color} strokeWidth="3.6" />
    </g>
  );
}

export function F2({ color = 'currentColor', stroke = 8 }) {
  return (
    <g fill="none" strokeLinecap="round">
      <Oval color={color} stroke={stroke} />
      <path d="M 22 38 Q 40 60 58 38" stroke={color} strokeWidth="5" />
    </g>
  );
}

export function F4({ color = 'currentColor', stroke = 8 }) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <Oval color={color} stroke={stroke} />
      <polyline points="24,42 40,28 56,42" strokeWidth="4.5" />
      <polyline points="24,54 40,40 56,54" strokeWidth="4.5" />
    </g>
  );
}

// ─── Level marks (F5 wave evolution) ────────────────────────────────
function LevelOval({ color, stroke = 8 }) {
  return <ellipse cx="40" cy="40" rx="32" ry="30" fill="none" stroke={color} strokeWidth={stroke} />;
}

function wavePath({ amp, freq, y = 40, x0 = 16, span = 48 }) {
  const segLen = span / freq;
  let d = `M ${x0} ${y}`;
  for (let i = 0; i < freq; i++) {
    const up = i % 2 === 0;
    const cx = x0 + segLen * i + segLen / 2;
    const cy = up ? y - amp : y + amp;
    const ex = x0 + segLen * (i + 1);
    d += ` Q ${cx} ${cy} ${ex} ${y}`;
  }
  return d;
}

function wavePathShifted({ amp, freq, y = 40, x0 = 16, span = 48, phase = 0.5 }) {
  const segLen = span / freq;
  const startUp = phase < 0.5;
  let d = `M ${x0} ${y}`;
  for (let i = 0; i < freq; i++) {
    const up = startUp ? i % 2 === 0 : i % 2 !== 0;
    const cx = x0 + segLen * i + segLen / 2;
    const cy = up ? y - amp : y + amp;
    const ex = x0 + segLen * (i + 1);
    d += ` Q ${cx} ${cy} ${ex} ${y}`;
  }
  return d;
}

export function L01({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><circle cx="40" cy="40" r="3" fill={color}/></g>; }
export function L02({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><circle cx="28" cy="40" r="2.4" fill={color}/><circle cx="40" cy="40" r="2.4" fill={color}/><circle cx="52" cy="40" r="2.4" fill={color}/></g>; }
export function L03({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><line x1="14" y1="40" x2="66" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/></g>; }
export function L04({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:3.5,freq:2})} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/></g>; }
export function L05({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:6,freq:2})} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round"/></g>; }
export function L06({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:8,freq:3})} fill="none" stroke={color} strokeWidth="3.6" strokeLinecap="round"/></g>; }
export function L07({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:5,freq:2,y:34})} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/><path d={wavePath({amp:5,freq:2,y:46})} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/></g>; }
export function L08({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:6.5,freq:3,y:33})} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round"/><path d={wavePath({amp:6.5,freq:3,y:47})} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round"/></g>; }
export function L09({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:7,freq:4,y:32})} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round"/><path d={wavePath({amp:7,freq:4,y:48})} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round"/></g>; }
export function L10({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:7,freq:3})} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round"/><path d={wavePathShifted({amp:7,freq:3,phase:0.7})} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" opacity="0.85"/></g>; }
export function L11({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:8,freq:3,y:36})} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/><path d={wavePathShifted({amp:8,freq:3,y:44,phase:0.7})} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/><path d={wavePath({amp:5,freq:5,y:40})} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity="0.7"/></g>; }
export function L12({ color, stroke = 8 }) { return <g><LevelOval color={color} stroke={stroke}/><path d={wavePath({amp:9,freq:3,y:32})} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round"/><path d={wavePathShifted({amp:9,freq:3,y:48,phase:0.7})} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round"/><path d={wavePath({amp:6,freq:5,y:40})} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity="0.85"/><path d="M62 18 Q62.5 20 64 20.5 Q62.5 21 62 23 Q61.5 21 60 20.5 Q61.5 20 62 18 Z" fill={color} stroke="none"/></g>; }

// ─── Wordmark ────────────────────────────────────────────────────────
export function WordmarkWithMark({ Mark = F5, size = 84, color = 'currentColor' }) {
  const oSize = size * 0.78;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline',
      fontFamily: 'Syne, sans-serif', fontWeight: 800,
      letterSpacing: '-0.045em', fontSize: size,
      lineHeight: 1, color, whiteSpace: 'nowrap',
    }}>
      <span>S</span>
      <span style={{ display:'inline-block', width:oSize, height:oSize, flexShrink:0 }}>
        <svg width={oSize} height={oSize} viewBox="0 0 80 80" style={{ display:'block' }}>
          <Mark color={color} stroke={9} />
        </svg>
      </span>
      <span>MA</span>
    </div>
  );
}
