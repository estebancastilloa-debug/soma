// SOMA — Logo marks v2. Five variations per direction × five directions = 25 marks.
// Each variation refines or stretches the base concept.

const R = 28;
const C = 2 * Math.PI * R;
const VIS = C * (315 / 360);
const GAP = C * (45 / 360);

// Ring primitive. rot=-115 puts the 45° gap at top-right (NE).
function Ring({ color, sw = 6, rot = -115 }) {
  return (
    <circle cx="40" cy="40" r={R} fill="none" stroke={color} strokeWidth={sw}
      strokeLinecap="round"
      strokeDasharray={`${VIS} ${GAP + 1}`}
      transform={`rotate(${rot} 40 40)`} />
  );
}

// ═══ TRIANGLE (Performance) — five variations ═══
function T1({ color }) { // Original — filled equilateral, centered
  return (<g><Ring color={color} />
    <polygon points="40,28.5 30,46 50,46" fill={color} /></g>);
}
function T2({ color }) { // Larger, apex pushed toward ring top
  return (<g><Ring color={color} />
    <polygon points="40,22 26,48 54,48" fill={color} /></g>);
}
function T3({ color }) { // Outlined triangle (stroke matches ring)
  return (<g><Ring color={color} />
    <polygon points="40,28 28,48 52,48" fill="none" stroke={color}
      strokeWidth="5" strokeLinejoin="round" /></g>);
}
function T4({ color }) { // Triangle aimed NE — toward the ring gap
  return (<g><Ring color={color} />
    <polygon points="52,26 30,38 44,54" fill={color} /></g>);
}
function T5({ color }) { // Compound — outline + small filled inside
  return (<g><Ring color={color} />
    <polygon points="40,26 26,50 54,50" fill="none" stroke={color}
      strokeWidth="3.5" strokeLinejoin="round" />
    <polygon points="40,37 34,46 46,46" fill={color} /></g>);
}

// ═══ DOT (Monolith) — five variations ═══
function D1({ color }) { // Original small dot
  return (<g><Ring color={color} /><circle cx="40" cy="40" r="4" fill={color} /></g>);
}
function D2({ color }) { // Larger dot
  return (<g><Ring color={color} /><circle cx="40" cy="40" r="8" fill={color} /></g>);
}
function D3({ color }) { // Concentric inner ring
  return (<g><Ring color={color} />
    <circle cx="40" cy="40" r="10" fill="none" stroke={color} strokeWidth="3" /></g>);
}
function D4({ color }) { // Disc + halo ring
  return (<g><Ring color={color} />
    <circle cx="40" cy="40" r="9" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
    <circle cx="40" cy="40" r="4.5" fill={color} /></g>);
}
function D5({ color }) { // Crosshair + tiny dot
  return (<g><Ring color={color} />
    <circle cx="40" cy="40" r="2.5" fill={color} />
    <line x1="40" y1="33" x2="40" y2="36" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <line x1="40" y1="44" x2="40" y2="47" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <line x1="33" y1="40" x2="36" y2="40" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <line x1="44" y1="40" x2="47" y2="40" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </g>);
}

// ═══ CHEVRONS (Editorial) — five variations, user's favorite ═══
function C1({ color }) { // Original — 3 equal chevrons
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Ring color={color} />
    <polyline points="32,34 40,28 48,34" strokeWidth="2.8" />
    <polyline points="32,42 40,36 48,42" strokeWidth="2.8" />
    <polyline points="32,50 40,44 48,50" strokeWidth="2.8" />
  </g>);
}
function C2({ color }) { // Variable thickness — growth (bottom thick → top thin)
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Ring color={color} />
    <polyline points="30,52 40,42 50,52" strokeWidth="4.5" />
    <polyline points="32,42 40,34 48,42" strokeWidth="3" />
    <polyline points="34,32 40,26 46,32" strokeWidth="2" />
  </g>);
}
function C3({ color }) { // 2 thick chevrons
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Ring color={color} />
    <polyline points="28,48 40,36 52,48" strokeWidth="5" />
    <polyline points="30,38 40,28 50,38" strokeWidth="5" />
  </g>);
}
function C4({ color }) { // 1 bold chevron
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Ring color={color} />
    <polyline points="26,48 40,32 54,48" strokeWidth="6.5" />
  </g>);
}
function C5({ color }) { // Asymmetric / staggered — telescoping
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Ring color={color} />
    <polyline points="28,52 40,44 52,52" strokeWidth="4.5" />
    <polyline points="32,40 40,32 48,40" strokeWidth="3.4" />
    <polyline points="36,28 40,24 44,28" strokeWidth="2.4" />
  </g>);
}

// ═══ AXIS (Instrument) — five variations ═══
function A1({ color }) { // Original — vertical line + endpoint dots
  return (<g><Ring color={color} />
    <line x1="40" y1="24" x2="40" y2="56" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="24" r="2" fill={color} />
    <circle cx="40" cy="56" r="2" fill={color} />
  </g>);
}
function A2({ color }) { // Vertical + short crossbar
  return (<g><Ring color={color} />
    <line x1="40" y1="24" x2="40" y2="56" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="40" x2="48" y2="40" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </g>);
}
function A3({ color }) { // Vertical line extending beyond the ring
  return (<g><Ring color={color} />
    <line x1="40" y1="14" x2="40" y2="66" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
  </g>);
}
function A4({ color }) { // Two parallel verticals (rails)
  return (<g><Ring color={color} />
    <line x1="34" y1="26" x2="34" y2="54" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <line x1="46" y1="26" x2="46" y2="54" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
  </g>);
}
function A5({ color }) { // Single thick vertical bar
  return (<g><Ring color={color} />
    <rect x="36.5" y="24" width="7" height="32" rx="3.5" fill={color} />
  </g>);
}

// ═══ ARC (Humanist) — five variations ═══
function R1({ color }) { // Original — small concentric arc at bottom
  const r = 13, c = 2 * Math.PI * r, v = c * (100 / 360), g = c - v;
  return (<g><Ring color={color} />
    <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="3"
      strokeLinecap="round" strokeDasharray={`${v} ${g + 1}`}
      transform="rotate(40 40 40)" />
  </g>);
}
function R2({ color }) { // Larger U-cradle
  const r = 19, c = 2 * Math.PI * r, v = c * (110 / 360), g = c - v;
  return (<g><Ring color={color} />
    <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="3.4"
      strokeLinecap="round" strokeDasharray={`${v} ${g + 1}`}
      transform="rotate(35 40 40)" />
  </g>);
}
function R3({ color }) { // Mirrored arcs — top + bottom
  const r = 13, c = 2 * Math.PI * r, v = c * (75 / 360), g = c - v;
  return (<g><Ring color={color} />
    <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="3"
      strokeLinecap="round" strokeDasharray={`${v} ${g + 1}`}
      transform="rotate(52 40 40)" />
    <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="3"
      strokeLinecap="round" strokeDasharray={`${v} ${g + 1}`}
      transform="rotate(232 40 40)" />
  </g>);
}
function R4({ color }) { // Crescent — body+mind / waxing
  return (<g><Ring color={color} />
    <path d="M 34 30 A 11 11 0 1 0 34 50 A 8 11 0 1 1 34 30 Z" fill={color} />
  </g>);
}
function R5({ color }) { // Filled hemisphere at the bottom — vessel
  return (<g><Ring color={color} />
    <path d="M 28 40 A 12 12 0 0 0 52 40 Z" fill={color} />
  </g>);
}

Object.assign(window, {
  T1, T2, T3, T4, T5,
  D1, D2, D3, D4, D5,
  C1, C2, C3, C4, C5,
  A1, A2, A3, A4, A5,
  R1, R2, R3, R4, R5,
});
