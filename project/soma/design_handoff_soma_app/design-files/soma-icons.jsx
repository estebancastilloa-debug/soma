// SOMA — Icon set. Single visual line that matches the F1/F5 isotipos:
// 24×24 viewBox, stroke-based, rounded caps & joins, currentColor.
// Always pass color via `color` prop (defaults to currentColor inherit).

const ICON_DEFAULTS = {
  width: 22, height: 22, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.7,
  strokeLinecap: 'round', strokeLinejoin: 'round',
};

function Svg({ size = 22, stroke = 1.7, color, children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}

// ─── Tab bar / navigation ───
function IconHome(p) { return (
  <Svg {...p}>
    <path d="M4 11.5 L12 4 L20 11.5 V20 H4 Z" />
    <path d="M10 20 V14 H14 V20" />
  </Svg>);
}

function IconTrain(p) { return (
  <Svg {...p}>
    {/* barbell */}
    <line x1="2"  y1="12" x2="22" y2="12" />
    <line x1="5"  y1="8"  x2="5"  y2="16" />
    <line x1="19" y1="8"  x2="19" y2="16" />
    <line x1="8"  y1="6"  x2="8"  y2="18" />
    <line x1="16" y1="6"  x2="16" y2="18" />
  </Svg>);
}

function IconEat(p) { return (
  <Svg {...p}>
    {/* plate · circle + line for utensil */}
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
  </Svg>);
}

function IconRecords(p) { return (
  <Svg {...p}>
    {/* ascending bars */}
    <line x1="4"  y1="20" x2="4"  y2="14" />
    <line x1="10" y1="20" x2="10" y2="10" />
    <line x1="16" y1="20" x2="16" y2="6" />
    <line x1="3"  y1="20" x2="20" y2="20" />
  </Svg>);
}

function IconJournal(p) { return (
  <Svg {...p}>
    {/* notebook / lines */}
    <path d="M5 4 H17 A2 2 0 0 1 19 6 V20 H5 Z" />
    <line x1="9" y1="9"  x2="15" y2="9" />
    <line x1="9" y1="13" x2="15" y2="13" />
  </Svg>);
}

function IconProfile(p) { return (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21 A8 8 0 0 1 20 21" />
  </Svg>);
}

// ─── UI utility ───
function IconPlus(p) { return (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5"  y1="12" x2="19" y2="12" />
  </Svg>);
}
function IconChevronRight(p) { return (
  <Svg {...p}><polyline points="9,5 16,12 9,19" /></Svg>);
}
function IconBell(p) { return (
  <Svg {...p}>
    <path d="M6 16 V11 A6 6 0 0 1 18 11 V16 L20 18 H4 Z" />
    <path d="M10 21 A2 2 0 0 0 14 21" />
  </Svg>);
}
function IconArrowUp(p) { return (
  <Svg {...p}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="6,11 12,5 18,11" />
  </Svg>);
}
function IconArrowDown(p) { return (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="6,13 12,19 18,13" />
  </Svg>);
}

// ─── Mood faces · same graphic line as the brand ──────────────────
// All 5 share a base circle. Differences are eyes + mouth.
// Eyes are tiny dashes (closed) or dots (open). Mouth follows F1's
// gesture-arc language for consistency with the isotype family.

function MoodBase({ size, stroke = 1.8, color, children }) {
  return (
    <Svg size={size} stroke={stroke} color={color}>
      <circle cx="12" cy="12" r="8.5" />
      {children}
    </Svg>
  );
}

// 1 · agotado · ojos cerrados, boca caída
function MoodTired(p) { return (
  <MoodBase {...p}>
    <line x1="8.5"  y1="10" x2="10"   y2="10" />
    <line x1="14"   y1="10" x2="15.5" y2="10" />
    <path d="M9.5 15.5 Q12 14 14.5 15.5" />
  </MoodBase>);
}
// 2 · neutral · ojos punto, boca recta
function MoodNeutral(p) { return (
  <MoodBase {...p}>
    <circle cx="9.2"  cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <line x1="9.5" y1="15" x2="14.5" y2="15" />
  </MoodBase>);
}
// 3 · contento · sonrisa sutil (F1 vibe)
function MoodOk(p) { return (
  <MoodBase {...p}>
    <circle cx="9.2"  cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <path d="M9.5 14.5 Q12 16 14.5 14.5" />
  </MoodBase>);
}
// 4 · bien · sonrisa media
function MoodGood(p) { return (
  <MoodBase {...p}>
    <circle cx="9.2"  cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <path d="M9 14 Q12 17 15 14" />
  </MoodBase>);
}
// 5 · pleno · sonrisa amplia + chispa (la F5 onda como destello)
function MoodGreat(p) { return (
  <Svg size={p.size} stroke={p.stroke || 1.8} color={p.color}>
    <circle cx="12" cy="13" r="8" />
    <circle cx="9.4"  cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.6" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    <path d="M8.5 14.5 Q12 18.2 15.5 14.5" />
    {/* chispa arriba */}
    <path d="M19 4 Q19.5 5.2 20.5 5.5 Q19.5 5.8 19 7 Q18.5 5.8 17.5 5.5 Q18.5 5.2 19 4 Z"
      fill="currentColor" stroke="none" />
  </Svg>);
}

const MOOD_ICONS = [MoodTired, MoodNeutral, MoodOk, MoodGood, MoodGreat];

// ─── Status bar bits (line-style replacements for the unicode glyphs) ───
function IconSignal(p) { return (
  <Svg {...p} stroke={p.stroke || 1.5}>
    <line x1="3"  y1="14" x2="3"  y2="16" />
    <line x1="7"  y1="12" x2="7"  y2="16" />
    <line x1="11" y1="10" x2="11" y2="16" />
    <line x1="15" y1="8"  x2="15" y2="16" />
  </Svg>);
}
function IconBattery(p) { return (
  <Svg {...p} stroke={p.stroke || 1.5}>
    <rect x="2" y="9" width="18" height="8" rx="2" />
    <line x1="21" y1="11" x2="21" y2="15" />
    <rect x="4" y="11" width="11" height="4" fill="currentColor" stroke="none" rx="1" />
  </Svg>);
}
function IconWifi(p) { return (
  <Svg {...p} stroke={p.stroke || 1.5}>
    <path d="M3 10 A12 12 0 0 1 21 10" />
    <path d="M6 13 A8 8 0 0 1 18 13" />
    <path d="M9 16 A4 4 0 0 1 15 16" />
    <circle cx="12" cy="19" r="0.7" fill="currentColor" stroke="none" />
  </Svg>);
}

Object.assign(window, {
  // nav
  IconHome, IconTrain, IconEat, IconRecords, IconJournal, IconProfile,
  // util
  IconPlus, IconChevronRight, IconBell, IconArrowUp, IconArrowDown,
  // mood
  MoodTired, MoodNeutral, MoodOk, MoodGood, MoodGreat, MOOD_ICONS,
  // status
  IconSignal, IconBattery, IconWifi,
});
