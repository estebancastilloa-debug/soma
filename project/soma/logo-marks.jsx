// SOMA logo marks — 6 directions, all 80x80 viewBox, centered at (40,40)
// Each mark is a function returning the inner <svg> children, accepting a `color` and optional `accent`.
// The ring is always the same primitive (open 315°, 45° gap at top-right).
// What changes between directions is what lives inside.

const RING_R = 28;
const RING_C = 2 * Math.PI * RING_R;            // ~175.93
const RING_VISIBLE = RING_C * (315 / 360);       // ~153.94
const RING_GAP = RING_C * (45 / 360);            // ~21.99

// The ring primitive — open 315°, gap at top-right.
function Ring({ color, sw = 6 }) {
  return (
    <circle
      cx="40" cy="40" r={RING_R}
      fill="none" stroke={color} strokeWidth={sw}
      strokeLinecap="round"
      strokeDasharray={`${RING_VISIBLE} ${RING_GAP + 1}`}
      transform="rotate(-115 40 40)"
    />
  );
}

// 1 · PERFORMANCE — confident filled triangle, weight = certainty
function MarkTriangle({ color, sw = 6 }) {
  return (
    <g>
      <Ring color={color} sw={sw} />
      <polygon points="40,28.5 30,46 50,46" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}

// 2 · CEREBRAL — compass needle, points NE (toward the gap, "hits the target")
function MarkCompass({ color, sw = 6 }) {
  return (
    <g>
      <Ring color={color} sw={sw} />
      {/* needle shaft */}
      <line x1="40" y1="40" x2="52.5" y2="27.5" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* arrow tip */}
      <polygon points="52.5,27.5 47,28 52,33" fill={color} />
      {/* base pivot */}
      <circle cx="40" cy="40" r="2.4" fill={color} />
    </g>
  );
}

// 3 · MONOLITH — center dot reticle, minimal
function MarkDot({ color, sw = 6 }) {
  return (
    <g>
      <Ring color={color} sw={sw} />
      <circle cx="40" cy="40" r="4" fill={color} />
    </g>
  );
}

// 4 · EDITORIAL — three stacked chevrons, progression upward
function MarkChevrons({ color, sw = 6 }) {
  return (
    <g fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <Ring color={color} sw={sw} />
      <polyline points="32,34 40,28 48,34" />
      <polyline points="32,42 40,36 48,42" />
      <polyline points="32,50 40,44 48,50" />
    </g>
  );
}

// 5 · INSTRUMENT — vertical body-axis line, anatomical/sagittal feel
function MarkAxis({ color, sw = 6 }) {
  return (
    <g>
      <Ring color={color} sw={sw} />
      <line x1="40" y1="24" x2="40" y2="56" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="24" r="2" fill={color} />
      <circle cx="40" cy="56" r="2" fill={color} />
    </g>
  );
}

// 6 · HUMANIST — small concentric arc at bottom, "horizon / ground / base"
function MarkArc({ color, sw = 6 }) {
  // small arc 100° at the bottom, radius 13, concentric
  const r = 13;
  const c = 2 * Math.PI * r;
  const visible = c * (100 / 360);
  const gap = c - visible;
  return (
    <g>
      <Ring color={color} sw={sw} />
      <circle
        cx="40" cy="40" r={r}
        fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${visible} ${gap + 1}`}
        transform="rotate(40 40 40)"
      />
    </g>
  );
}

// Expose for the next script
Object.assign(window, {
  MarkTriangle, MarkCompass, MarkDot, MarkChevrons, MarkAxis, MarkArc,
});
