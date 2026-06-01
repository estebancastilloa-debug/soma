// SOMA — Round 3 marks. B&W only. Ring is optional, triad is the grammar.
// All marks render in viewBox 0 0 80 80, centered at (40, 40).
// Each receives { color } and renders dark-on-light or light-on-dark based on tile bg.

// ═══ 1 · CONVERGENCIA ═══════════════════════════════════════════
// Three filled circles at triangle corners — negative space = triangle (down-pointing)
function M1({ color }) {
  return (<g fill={color}>
    <circle cx="40" cy="18" r="9" />
    <circle cx="20" cy="54" r="9" />
    <circle cx="60" cy="54" r="9" />
  </g>);
}

// Three different shapes at triangle corners — each is a "dimension"
function M2({ color }) {
  return (<g fill={color}>
    <circle cx="40" cy="18" r="9" />
    <rect x="11" y="44" width="18" height="18" />
    <polygon points="60,40 70,60 50,60" />
  </g>);
}

// Three thick lines radiating from center at 120° — peace/synthesis without enclosure
function M3({ color }) {
  return (<g stroke={color} strokeWidth="6" strokeLinecap="round">
    <line x1="40" y1="40" x2="40" y2="14" />
    <line x1="40" y1="40" x2="62.5" y2="53" />
    <line x1="40" y1="40" x2="17.5" y2="53" />
  </g>);
}

// ═══ 2 · EQUILIBRIO ═════════════════════════════════════════════
// Three equal horizontal bars stacked — balanced, no hierarchy
function M4({ color }) {
  return (<g fill={color}>
    <rect x="14" y="28" width="52" height="6" rx="3" />
    <rect x="14" y="38" width="52" height="6" rx="3" />
    <rect x="14" y="48" width="52" height="6" rx="3" />
  </g>);
}

// Three different glyphs aligned horizontally
function M5({ color }) {
  return (<g fill={color}>
    <circle cx="18" cy="40" r="8.5" />
    <rect x="31" y="31.5" width="17" height="17" />
    <polygon points="62,32 71,49 53,49" />
  </g>);
}

// ═══ 3 · PROGRESIÓN ═════════════════════════════════════════════
// Three uniform chevrons stacked — ringless, equal weight & angle
function M6({ color }) {
  return (<g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,28 40,16 60,28" />
    <polyline points="20,42 40,30 60,42" />
    <polyline points="20,56 40,44 60,56" />
  </g>);
}

// Three ascending vertical bars — growth without exaggeration
function M7({ color }) {
  return (<g fill={color}>
    <rect x="18" y="44" width="11" height="20" rx="2" />
    <rect x="34.5" y="34" width="11" height="30" rx="2" />
    <rect x="51" y="22" width="11" height="42" rx="2" />
  </g>);
}

// ═══ 4 · BIENESTAR ══════════════════════════════════════════════
// Smile arc alone, no ring
function M8({ color }) {
  return (<path d="M 14 30 Q 40 64 66 30" stroke={color} strokeWidth="6"
    strokeLinecap="round" fill="none" />);
}

// Smile + 3 small dots above (sparks of wellbeing)
function M9({ color }) {
  return (<g>
    <path d="M 14 40 Q 40 66 66 40" stroke={color} strokeWidth="5.5"
      strokeLinecap="round" fill="none" />
    <circle cx="24" cy="24" r="2.8" fill={color} />
    <circle cx="40" cy="18" r="2.8" fill={color} />
    <circle cx="56" cy="24" r="2.8" fill={color} />
  </g>);
}

// ═══ 5 · GRAMÁTICA TRIPARTITA ═══════════════════════════════════
// Broken ring in 3 segments with three different stroke patterns
function M10({ color }) {
  // 3 arcs of 90° each, separated by 30° gaps, centered around top/bottom-right/bottom-left
  return (<g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
    {/* top, solid */}
    <path d="M 22.32 22.32 A 25 25 0 0 1 57.68 22.32" />
    {/* bottom-right, dashed */}
    <path d="M 64.15 33.53 A 25 25 0 0 1 46.47 64.15" strokeDasharray="6 4" />
    {/* bottom-left, dotted */}
    <path d="M 33.53 64.15 A 25 25 0 0 1 15.85 33.53" strokeDasharray="0.1 5.5" />
  </g>);
}

// Three nested triangles, each with different treatment
function M11({ color }) {
  return (<g>
    <polygon points="40,12 12,62 68,62" fill="none" stroke={color}
      strokeWidth="4" strokeLinejoin="round" />
    <polygon points="40,26 24,54 56,54" fill="none" stroke={color}
      strokeWidth="3" strokeLinejoin="round" strokeDasharray="4 3" />
    <polygon points="40,40 32,52 48,52" fill={color} />
  </g>);
}

Object.assign(window, { M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11 });
