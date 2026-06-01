// SOMA — Icon set. Single visual line that matches the F1/F5 isotipos:
// 24×24 viewBox, stroke-based, rounded caps & joins, currentColor.
// Always pass color via `color` prop (defaults to currentColor inherit).

function Svg({ size = 22, stroke = 1.7, color, children, style, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}

// ─── Tab bar / navigation ──────────────────────────────────────────
function IconHome(p) { return (
  <Svg {...p}>
    <path d="M4 11.5 L12 4 L20 11.5 V20 H4 Z" />
    <path d="M10 20 V14 H14 V20" />
  </Svg>);
}

// Pesa — clearly a dumbbell: two end plates, bar, inner collars.
function IconTrain(p) { return (
  <Svg {...p}>
    {/* bar */}
    <line x1="7" y1="12" x2="17" y2="12" />
    {/* inner collars */}
    <line x1="7" y1="9.5" x2="7" y2="14.5" />
    <line x1="17" y1="9.5" x2="17" y2="14.5" />
    {/* end plates */}
    <rect x="3" y="7.5" width="3" height="9" rx="1" />
    <rect x="18" y="7.5" width="3" height="9" rx="1" />
  </Svg>);
}

// Plato — clearly a plate: outer rim, inner rim, fork on the left.
function IconEat(p) { return (
  <Svg {...p}>
    {/* plate */}
    <circle cx="14" cy="12" r="6.5" />
    <circle cx="14" cy="12" r="3.5" />
    {/* fork */}
    <line x1="4" y1="3.5" x2="4" y2="9" />
    <path d="M2.5 3.5 V7 A1.5 1.5 0 0 0 5.5 7 V3.5" />
    <line x1="4" y1="9" x2="4" y2="20.5" />
  </Svg>);
}

function IconRecords(p) { return (
  <Svg {...p}>
    <line x1="4"  y1="20" x2="4"  y2="14" />
    <line x1="10" y1="20" x2="10" y2="10" />
    <line x1="16" y1="20" x2="16" y2="6" />
    <line x1="3"  y1="20" x2="20" y2="20" />
  </Svg>);
}

function IconJournal(p) { return (
  <Svg {...p}>
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

// ─── UI utility ───────────────────────────────────────────────────
function IconPlus(p) { return (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5"  y1="12" x2="19" y2="12" />
  </Svg>);
}
function IconChevronRight(p) { return (
  <Svg {...p}><polyline points="9,5 16,12 9,19" /></Svg>);
}
function IconChevronLeft(p) { return (
  <Svg {...p}><polyline points="15,5 8,12 15,19" /></Svg>);
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
function IconCheck(p) { return (
  <Svg {...p}><polyline points="4,12 10,18 20,6" /></Svg>);
}
function IconMic(p) { return (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11 A7 7 0 0 0 19 11" />
    <line x1="12" y1="18" x2="12" y2="21" />
  </Svg>);
}
function IconCamera(p) { return (
  <Svg {...p}>
    <path d="M3 8 H7 L9 5 H15 L17 8 H21 V19 H3 Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>);
}

// ─── Data-entry / domain icons (replace plain numbers) ─────────────
function IconSleep(p) { return (
  <Svg {...p}>
    <path d="M19 14 A8 8 0 1 1 10 5 A6 6 0 0 0 19 14 Z" />
  </Svg>);
}
function IconRecovery(p) { return (
  <Svg {...p}>
    {/* waveform inside a circle — echoes the F5 onda */}
    <circle cx="12" cy="12" r="9" />
    <path d="M5 12 Q 8 7 11 12 T 17 12 T 21 12" />
  </Svg>);
}
function IconStreak(p) { return (
  <Svg {...p}>
    <path d="M12 3 C 9 8 7 9 7 13 A5 5 0 0 0 17 13 C 17 10 15 9 14 6 C 13.5 8 13 9 12 9 Z" />
  </Svg>);
}
function IconWater(p) { return (
  <Svg {...p}>
    <path d="M12 3 C 7 10 5 13 5 16 A7 7 0 0 0 19 16 C 19 13 17 10 12 3 Z" />
  </Svg>);
}
function IconProtein(p) { return (
  <Svg {...p}>
    {/* meat/leg silhouette */}
    <path d="M7 13 A5 5 0 1 1 13 7 L 18 12 L 14 16 L 9 11" />
    <line x1="4" y1="20" x2="9" y2="15" />
  </Svg>);
}
function IconCarbs(p) { return (
  <Svg {...p}>
    {/* wheat / grain */}
    <line x1="12" y1="4" x2="12" y2="20" />
    <path d="M12 7 Q 8 9 8 13 Q 12 12 12 9 Z" fill="currentColor" stroke="none" />
    <path d="M12 7 Q 16 9 16 13 Q 12 12 12 9 Z" fill="currentColor" stroke="none" />
    <path d="M12 12 Q 8 14 8 18 Q 12 17 12 14 Z" fill="currentColor" stroke="none" />
    <path d="M12 12 Q 16 14 16 18 Q 12 17 12 14 Z" fill="currentColor" stroke="none" />
  </Svg>);
}
function IconFat(p) { return (
  <Svg {...p}>
    {/* droplet */}
    <path d="M12 4 C 8 10 6 12 6 15 A6 6 0 0 0 18 15 C 18 12 16 10 12 4 Z" />
    <circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" />
  </Svg>);
}
function IconSun(p) { return (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="3" x2="12" y2="5.5" />
    <line x1="12" y1="18.5" x2="12" y2="21" />
    <line x1="3" y1="12" x2="5.5" y2="12" />
    <line x1="18.5" y1="12" x2="21" y2="12" />
    <line x1="5.6" y1="5.6" x2="7.4" y2="7.4" />
    <line x1="16.6" y1="16.6" x2="18.4" y2="18.4" />
    <line x1="5.6" y1="18.4" x2="7.4" y2="16.6" />
    <line x1="16.6" y1="7.4" x2="18.4" y2="5.6" />
  </Svg>);
}
function IconMoon(p) { return (
  <Svg {...p}>
    <path d="M20 14 A8 8 0 1 1 10 4 A6 6 0 0 0 20 14 Z" />
  </Svg>);
}
function IconSnack(p) { return (
  <Svg {...p}>
    {/* apple */}
    <path d="M12 7 C 8 7 5 9 5 13 C 5 17 8 20 12 20 C 16 20 19 17 19 13 C 19 9 16 7 12 7 Z" />
    <path d="M12 7 V 5 Q 13.5 4 15 4" />
  </Svg>);
}
function IconHeart(p) { return (
  <Svg {...p}>
    <path d="M12 20 C 4 14 4 8 8 6 C 10 5 12 7 12 9 C 12 7 14 5 16 6 C 20 8 20 14 12 20 Z" />
  </Svg>);
}
function IconDumbbellSmall(p) { return (
  <Svg {...p}>
    <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2.2"/>
    <rect x="4" y="8" width="3" height="8" rx="1" />
    <rect x="17" y="8" width="3" height="8" rx="1" />
  </Svg>);
}
function IconBolt(p) { return (
  <Svg {...p}>
    <polygon points="13,3 5,14 11,14 10,21 18,10 12,10" fill="currentColor" stroke="none"/>
  </Svg>);
}
function IconTimer(p) { return (
  <Svg {...p}>
    <circle cx="12" cy="13" r="7" />
    <line x1="12" y1="13" x2="12" y2="9" />
    <line x1="12" y1="13" x2="15" y2="13" />
    <line x1="9" y1="3" x2="15" y2="3" />
  </Svg>);
}
function IconFlame(p) { return (
  <Svg {...p}>
    <path d="M12 3 C 12 7 8 8 8 13 A4 4 0 0 0 16 13 C 16 11 14 10 14 8 C 13 9 12 9 12 3 Z" />
  </Svg>);
}
function IconBalance(p) { return (
  <Svg {...p}>
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="6" y1="20" x2="18" y2="20" />
    <line x1="5" y1="9" x2="19" y2="9" />
    <path d="M5 9 L 2 15 A3 3 0 0 0 8 15 Z" />
    <path d="M19 9 L 16 15 A3 3 0 0 0 22 15 Z" />
  </Svg>);
}

// ─── Mood faces · same graphic line as the brand ───────────────────
function MoodBase({ size, stroke = 1.8, color, children }) {
  return (
    <Svg size={size} stroke={stroke} color={color}>
      <circle cx="12" cy="12" r="8.5" />
      {children}
    </Svg>
  );
}

function MoodTired(p) { return (
  <MoodBase {...p}>
    <line x1="8.5"  y1="10" x2="10"   y2="10" />
    <line x1="14"   y1="10" x2="15.5" y2="10" />
    <path d="M9.5 15.5 Q12 14 14.5 15.5" />
  </MoodBase>);
}
function MoodNeutral(p) { return (
  <MoodBase {...p}>
    <circle cx="9.2"  cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <line x1="9.5" y1="15" x2="14.5" y2="15" />
  </MoodBase>);
}
function MoodOk(p) { return (
  <MoodBase {...p}>
    <circle cx="9.2"  cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <path d="M9.5 14.5 Q12 16 14.5 14.5" />
  </MoodBase>);
}
function MoodGood(p) { return (
  <MoodBase {...p}>
    <circle cx="9.2"  cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <path d="M9 14 Q12 17 15 14" />
  </MoodBase>);
}
function MoodGreat(p) { return (
  <Svg size={p.size} stroke={p.stroke || 1.8} color={p.color}>
    <circle cx="12" cy="13" r="8" />
    <circle cx="9.4"  cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.6" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    <path d="M8.5 14.5 Q12 18.2 15.5 14.5" />
    <path d="M19 4 Q19.5 5.2 20.5 5.5 Q19.5 5.8 19 7 Q18.5 5.8 17.5 5.5 Q18.5 5.2 19 4 Z"
      fill="currentColor" stroke="none" />
  </Svg>);
}

const MOOD_ICONS = [MoodTired, MoodNeutral, MoodOk, MoodGood, MoodGreat];

// ─── Intensity scale (1–5 dots growing in saturation/size) ─────────
// Replaces typing "5/10 RPE" with a tap-row.
function IntensityDot({ size = 14, filled = false, color, accent }) {
  const r = filled ? size * 0.42 : size * 0.32;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r={11} fill="none"
        stroke={color} strokeWidth="1.5" opacity={filled ? 0 : 0.5} />
      <circle cx="12" cy="12" r={r * 24 / size}
        fill={filled ? accent : 'none'}
        stroke={filled ? accent : color}
        strokeWidth="1.5" />
    </svg>
  );
}

// ─── Status bar bits ───────────────────────────────────────────────
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
  IconPlus, IconChevronRight, IconChevronLeft, IconBell,
  IconArrowUp, IconArrowDown, IconCheck, IconMic, IconCamera,
  // data-entry / domain
  IconSleep, IconRecovery, IconStreak, IconWater,
  IconProtein, IconCarbs, IconFat,
  IconSun, IconMoon, IconSnack, IconHeart,
  IconDumbbellSmall, IconBolt, IconTimer, IconFlame, IconBalance,
  // mood
  MoodTired, MoodNeutral, MoodOk, MoodGood, MoodGreat, MOOD_ICONS,
  IntensityDot,
  // status
  IconSignal, IconBattery, IconWifi,
});
