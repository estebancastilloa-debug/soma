// SOMA — Icon set, EXTENDED.
// Same visual line as soma-icons.jsx: 24×24 viewBox, stroke-based,
// rounded caps & joins, currentColor, ~1.7 stroke. Designed to cover
// every new screen: equipment inventory, travel, biometrics, PR
// categories, analytics, psychology, biohacking habits, vices,
// supplements, integrations.
//
// All icons take { size, stroke, color, style }.

function IcoSvg({ size = 22, stroke = 1.7, color, children, style, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}
const _F = (c) => ({ fill: 'currentColor', stroke: 'none' });

// ═══════════════ UI · navigation & actions ═══════════════════════
function IconSearch(p) { return (
  <IcoSvg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="20" y2="20" />
  </IcoSvg>); }
function IconSettings(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5 V5 M12 19 V21.5 M21.5 12 H19 M5 12 H2.5
             M18.7 5.3 L17 7 M7 17 L5.3 18.7 M18.7 18.7 L17 17 M7 7 L5.3 5.3" />
  </IcoSvg>); }
function IconClose(p) { return (
  <IcoSvg {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </IcoSvg>); }
function IconChevronDown(p) { return (
  <IcoSvg {...p}><polyline points="5,9 12,16 19,9" /></IcoSvg>); }
function IconChevronUp(p) { return (
  <IcoSvg {...p}><polyline points="5,15 12,8 19,15" /></IcoSvg>); }
function IconCalendar(p) { return (
  <IcoSvg {...p}>
    <rect x="4" y="5" width="16" height="16" rx="2.5" />
    <line x1="4" y1="9.5" x2="20" y2="9.5" />
    <line x1="8" y1="3" x2="8" y2="6.5" />
    <line x1="16" y1="3" x2="16" y2="6.5" />
  </IcoSvg>); }
function IconCalendarDays(p) { return (
  <IcoSvg {...p}>
    <rect x="4" y="5" width="16" height="16" rx="2.5" />
    <line x1="4" y1="9.5" x2="20" y2="9.5" />
    <line x1="8" y1="3" x2="8" y2="6.5" />
    <line x1="16" y1="3" x2="16" y2="6.5" />
    <circle cx="8.5" cy="13.5" r="0.6" {..._F()} />
    <circle cx="12" cy="13.5" r="0.6" {..._F()} />
    <circle cx="15.5" cy="13.5" r="0.6" {..._F()} />
    <circle cx="8.5" cy="17" r="0.6" {..._F()} />
    <circle cx="12" cy="17" r="0.6" {..._F()} />
  </IcoSvg>); }
function IconEdit(p) { return (
  <IcoSvg {...p}>
    <path d="M4 20 L4.5 16.5 L15 6 L18 9 L7.5 19.5 Z" />
    <path d="M14 7 L17 10" />
    <path d="M16 5 L18 3 A1.4 1.4 0 0 1 20 5 L18 7" />
  </IcoSvg>); }
function IconTrash(p) { return (
  <IcoSvg {...p}>
    <path d="M5 7 H19 L18 20 A1 1 0 0 1 17 21 H7 A1 1 0 0 1 6 20 Z" />
    <path d="M9 7 V5 A1 1 0 0 1 10 4 H14 A1 1 0 0 1 15 5 V7" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </IcoSvg>); }
function IconShare(p) { return (
  <IcoSvg {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="17" cy="6" r="2.5" />
    <circle cx="17" cy="18" r="2.5" />
    <line x1="8.2" y1="10.8" x2="14.8" y2="7.2" />
    <line x1="8.2" y1="13.2" x2="14.8" y2="16.8" />
  </IcoSvg>); }
function IconExport(p) { return (
  <IcoSvg {...p}>
    <path d="M5 14 V19 A1 1 0 0 0 6 20 H18 A1 1 0 0 0 19 19 V14" />
    <line x1="12" y1="3" x2="12" y2="14" />
    <polyline points="8,7 12,3 16,7" />
  </IcoSvg>); }
function IconDownload(p) { return (
  <IcoSvg {...p}>
    <path d="M5 14 V19 A1 1 0 0 0 6 20 H18 A1 1 0 0 0 19 19 V14" />
    <line x1="12" y1="3" x2="12" y2="14" />
    <polyline points="8,10 12,14 16,10" />
  </IcoSvg>); }
function IconPlay(p) { return (
  <IcoSvg {...p}><polygon points="7,4 20,12 7,20" {..._F()} /></IcoSvg>); }
function IconInfo(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <circle cx="12" cy="7.6" r="0.7" {..._F()} />
  </IcoSvg>); }
function IconFilter(p) { return (
  <IcoSvg {...p}>
    <path d="M3 5 H21 L14 13 V19 L10 21 V13 Z" />
  </IcoSvg>); }
function IconStar(p) { return (
  <IcoSvg {...p}>
    <polygon points="12,3 14.6,9 21,9.6 16,14 17.5,20.5 12,17 6.5,20.5 8,14 3,9.6 9.4,9" />
  </IcoSvg>); }
function IconTarget(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.2" {..._F()} />
  </IcoSvg>); }
function IconShield(p) { return (
  <IcoSvg {...p}>
    <path d="M12 3 L19 6 V11 C19 16 16 19.5 12 21 C8 19.5 5 16 5 11 V6 Z" />
  </IcoSvg>); }
function IconLink(p) { return (
  <IcoSvg {...p}>
    <path d="M9.5 14.5 L14.5 9.5" />
    <path d="M8 12 L6 14 A3 3 0 0 0 10 18 L12 16" />
    <path d="M16 8 L18 6 A3 3 0 0 0 14 2.2 L12 4.2" transform="translate(0 2)" />
  </IcoSvg>); }
function IconSync(p) { return (
  <IcoSvg {...p}>
    <path d="M5 12 A7 7 0 0 1 17 7 L19 9" />
    <polyline points="19,4 19,9 14,9" />
    <path d="M19 12 A7 7 0 0 1 7 17 L5 15" />
    <polyline points="5,20 5,15 10,15" />
  </IcoSvg>); }
function IconDevice(p) { return (
  <IcoSvg {...p}>
    <rect x="7" y="3" width="10" height="18" rx="3" />
    <circle cx="12" cy="12" r="3.2" />
    <line x1="12" y1="3" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="21" />
  </IcoSvg>); }
function IconLock(p) { return (
  <IcoSvg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11 V8 A4 4 0 0 1 16 8 V11" />
    <circle cx="12" cy="15.5" r="1" {..._F()} />
  </IcoSvg>); }

// ═══════════════ Travel ══════════════════════════════════════════
function IconPlane(p) { return (
  <IcoSvg {...p}>
    <path d="M10 4 C10 3 11 2.5 12 2.5 C13 2.5 14 3 14 4 V9 L21 13.5 V16 L14 13.5 V18 L16.5 20 V21.5 L12 20 L7.5 21.5 V20 L10 18 V13.5 L3 16 V13.5 L10 9 Z" />
  </IcoSvg>); }
function IconSuitcase(p) { return (
  <IcoSvg {...p}>
    <rect x="4" y="8" width="16" height="12" rx="2.5" />
    <path d="M9 8 V6 A1.5 1.5 0 0 1 10.5 4.5 H13.5 A1.5 1.5 0 0 1 15 6 V8" />
    <line x1="9.5" y1="11" x2="9.5" y2="17" />
    <line x1="14.5" y1="11" x2="14.5" y2="17" />
  </IcoSvg>); }
function IconMapPin(p) { return (
  <IcoSvg {...p}>
    <path d="M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z" />
    <circle cx="12" cy="9" r="2.5" />
  </IcoSvg>); }
function IconHotel(p) { return (
  <IcoSvg {...p}>
    <path d="M4 21 V5 A1 1 0 0 1 5 4 H19 A1 1 0 0 1 20 5 V21" />
    <line x1="2.5" y1="21" x2="21.5" y2="21" />
    <line x1="8" y1="8" x2="9.5" y2="8" /><line x1="14.5" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="9.5" y2="12" /><line x1="14.5" y1="12" x2="16" y2="12" />
    <path d="M10 21 V17 H14 V21" />
  </IcoSvg>); }
function IconBoxGym(p) { return (
  <IcoSvg {...p}>
    <path d="M3 9 L12 4 L21 9 V20 H3 Z" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="14" x2="15" y2="14" strokeWidth="2.2" />
    <rect x="6.5" y="11.5" width="2.5" height="5" rx="0.6" />
    <rect x="15" y="11.5" width="2.5" height="5" rx="0.6" />
  </IcoSvg>); }
function IconCompass(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="12,7 14,12 12,17 10,12" {..._F()} />
  </IcoSvg>); }

// ═══════════════ Equipment inventory ═════════════════════════════
function IconBarbell(p) { return (
  <IcoSvg {...p}>
    <line x1="6.5" y1="12" x2="17.5" y2="12" strokeWidth="2" />
    <rect x="3" y="9" width="2" height="6" rx="0.8" />
    <rect x="5.2" y="7.5" width="2" height="9" rx="0.8" />
    <rect x="16.8" y="7.5" width="2" height="9" rx="0.8" />
    <rect x="19" y="9" width="2" height="6" rx="0.8" />
  </IcoSvg>); }
function IconKettlebell(p) { return (
  <IcoSvg {...p}>
    <path d="M9 7 A3 3 0 0 1 15 7" />
    <path d="M8.5 8 C7 9 6 11 6 14 A6 6 0 0 0 18 14 C18 11 17 9 15.5 8" />
  </IcoSvg>); }
function IconPullupBar(p) { return (
  <IcoSvg {...p}>
    <line x1="3" y1="5" x2="21" y2="5" strokeWidth="2" />
    <line x1="6" y1="5" x2="6" y2="9" />
    <line x1="18" y1="5" x2="18" y2="9" />
    <path d="M9 5 V8" /><path d="M15 5 V8" />
    <path d="M9 8 A1.5 1.5 0 0 0 12 8" /><path d="M12 8 A1.5 1.5 0 0 0 15 8" />
    <line x1="10.5" y1="9.5" x2="10.5" y2="16" />
    <line x1="13.5" y1="9.5" x2="13.5" y2="16" />
  </IcoSvg>); }
function IconBands(p) { return (
  <IcoSvg {...p}>
    <ellipse cx="12" cy="6" rx="5" ry="2.5" />
    <path d="M7 6 C7 12 6 18 9 20" />
    <path d="M17 6 C17 12 18 18 15 20" />
  </IcoSvg>); }
function IconTRX(p) { return (
  <IcoSvg {...p}>
    <path d="M12 3 V7" />
    <path d="M12 7 L7 19" /><path d="M12 7 L17 19" />
    <path d="M6 19 A1.6 1.6 0 0 0 8 19" />
    <path d="M16 19 A1.6 1.6 0 0 0 18 19" />
    <rect x="10.5" y="3" width="3" height="2" rx="0.6" />
  </IcoSvg>); }
function IconRower(p) { return (
  <IcoSvg {...p}>
    <line x1="3" y1="18" x2="21" y2="18" />
    <circle cx="6" cy="11" r="3" />
    <path d="M9 11 H15" />
    <path d="M15 9 L19 7" />
    <line x1="12" y1="14" x2="12" y2="18" />
  </IcoSvg>); }
function IconBike(p) { return (
  <IcoSvg {...p}>
    <circle cx="6.5" cy="16" r="3.5" />
    <circle cx="17.5" cy="16" r="3.5" />
    <path d="M6.5 16 L10 8 H15" />
    <path d="M10 8 L13.5 16" />
    <line x1="9" y1="8" x2="12" y2="8" />
    <line x1="15" y1="6" x2="15" y2="8" />
  </IcoSvg>); }
function IconJumpRope(p) { return (
  <IcoSvg {...p}>
    <path d="M6 4 V8 A6 9 0 0 0 18 8 V4" />
    <circle cx="6" cy="3" r="1.4" />
    <circle cx="18" cy="3" r="1.4" />
    <line x1="6" y1="9" x2="6" y2="20" />
    <line x1="18" y1="9" x2="18" y2="20" />
  </IcoSvg>); }
function IconPlyoBox(p) { return (
  <IcoSvg {...p}>
    <path d="M4 9 L12 6 L20 9 L12 12 Z" />
    <path d="M4 9 V16 L12 19 V12" />
    <path d="M20 9 V16 L12 19" />
  </IcoSvg>); }
function IconBench(p) { return (
  <IcoSvg {...p}>
    <rect x="4" y="9" width="16" height="3.5" rx="1.2" />
    <line x1="6" y1="12.5" x2="6" y2="19" />
    <line x1="18" y1="12.5" x2="18" y2="19" />
    <line x1="4" y1="19" x2="8" y2="19" />
    <line x1="16" y1="19" x2="20" y2="19" />
  </IcoSvg>); }
function IconCable(p) { return (
  <IcoSvg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <path d="M9 7 H14 A1.5 1.5 0 0 1 15.5 8.5 V11" />
    <path d="M15.5 11 A1.5 1.5 0 0 1 12.5 11" />
    <line x1="14" y1="12" x2="14" y2="15" />
  </IcoSvg>); }
function IconSandbag(p) { return (
  <IcoSvg {...p}>
    <path d="M7 8 C7 6 9 5 12 5 C15 5 17 6 17 8 L18 17 A2 2 0 0 1 16 19 H8 A2 2 0 0 1 6 17 Z" />
    <path d="M7.5 8 H16.5" />
    <path d="M9 5.4 L9.5 3.5 H14.5 L15 5.4" />
  </IcoSvg>); }
function IconMedBall(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M5 9 Q12 13 19 9" />
    <path d="M5 15 Q12 11 19 15" />
  </IcoSvg>); }
function IconParallettes(p) { return (
  <IcoSvg {...p}>
    <path d="M4 8 H10 M5 8 V17 M9 8 V17 M4 17 H10" />
    <path d="M14 8 H20 M15 8 V17 M19 8 V17 M14 17 H20" />
  </IcoSvg>); }
function IconBodyweight(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="5" r="2.2" />
    <path d="M12 7.5 V13" />
    <path d="M12 9 L6 11" /><path d="M12 9 L18 11" />
    <path d="M12 13 L8 20" /><path d="M12 13 L16 20" />
  </IcoSvg>); }
function IconRings(p) { return (
  <IcoSvg {...p}>
    <line x1="8" y1="3" x2="8" y2="11" />
    <line x1="16" y1="3" x2="16" y2="11" />
    <circle cx="8" cy="15" r="4" />
    <circle cx="16" cy="15" r="4" />
  </IcoSvg>); }

// ═══════════════ Biometrics / health ═════════════════════════════
function IconScale(p) { return (
  <IcoSvg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
    <path d="M9 8 A4 4 0 0 1 15 8" />
    <line x1="12" y1="8" x2="13.5" y2="9.5" />
    <circle cx="12" cy="17" r="0.7" {..._F()} />
  </IcoSvg>); }
function IconRuler(p) { return (
  <IcoSvg {...p}>
    <rect x="3" y="7" width="18" height="10" rx="1.5" transform="rotate(-45 12 12)" />
    <path d="M9 9 L10.5 10.5 M11.5 6.5 L13.5 8.5 M14 4 L15.5 5.5" />
  </IcoSvg>); }
function IconBodyComp(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M9 9 C9 7.5 15 7.5 15 9 L14 15 H10 Z" />
    <path d="M10 15 L9.5 21" /><path d="M14 15 L14.5 21" />
    <path d="M9.3 10.5 L7 13" /><path d="M14.7 10.5 L17 13" />
  </IcoSvg>); }
function IconPulse(p) { return (
  <IcoSvg {...p}>
    <path d="M3 12 H7 L9 7 L12 17 L14.5 12 H21" />
  </IcoSvg>); }
function IconHeartRate(p) { return (
  <IcoSvg {...p}>
    <path d="M12 20 C5 14.5 4 9.5 7 7 C9 5.3 11 6.5 12 8.3 C13 6.5 15 5.3 17 7 C20 9.5 19 14.5 12 20 Z" />
    <path d="M7.5 12.5 H10 L11 10.5 L12.5 14 L13.5 12.5 H16.5" />
  </IcoSvg>); }
function IconBloodPressure(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 12 L16 8.5" />
    <circle cx="12" cy="12" r="1.2" {..._F()} />
    <line x1="12" y1="3.5" x2="12" y2="5.5" />
    <line x1="20.5" y1="12" x2="18.5" y2="12" />
  </IcoSvg>); }
function IconThermometer(p) { return (
  <IcoSvg {...p}>
    <path d="M10 13 V5 A2 2 0 0 1 14 5 V13 A4 4 0 1 1 10 13 Z" />
    <circle cx="12" cy="17" r="2" {..._F()} />
    <line x1="12" y1="9" x2="12" y2="16" />
  </IcoSvg>); }
function IconBloodDrop(p) { return (
  <IcoSvg {...p}>
    <path d="M12 3 C7.5 9.5 6 12 6 15 A6 6 0 0 0 18 15 C18 12 16.5 9.5 12 3 Z" />
    <path d="M12 12 V17 M9.5 14.5 H14.5" />
  </IcoSvg>); }
function IconGlucose(p) { return (
  <IcoSvg {...p}>
    <rect x="6" y="3" width="12" height="18" rx="3" />
    <path d="M9 8 H15 M9 11.5 H15" />
    <path d="M12 14.5 C10.5 16.5 10 17.5 10 18.5 A2 2 0 0 0 14 18.5 C14 17.5 13.5 16.5 12 14.5 Z" {..._F()} />
  </IcoSvg>); }
function IconBone(p) { return (
  <IcoSvg {...p}>
    <path d="M6.5 6.5 A2 2 0 1 0 8.5 8.5 L15.5 15.5 A2 2 0 1 0 17.5 17.5 A2 2 0 1 0 15.5 15.5 L8.5 8.5 A2 2 0 1 0 6.5 6.5 Z" />
  </IcoSvg>); }

// ═══════════════ PR categories / achievements ════════════════════
function IconTrophy(p) { return (
  <IcoSvg {...p}>
    <path d="M7 4 H17 V9 A5 5 0 0 1 7 9 Z" />
    <path d="M7 5.5 H4 V7 A3 3 0 0 0 7 10" />
    <path d="M17 5.5 H20 V7 A3 3 0 0 1 17 10" />
    <line x1="12" y1="14" x2="12" y2="17" />
    <path d="M8.5 20 H15.5 L14.5 17 H9.5 Z" />
  </IcoSvg>); }
function IconMedal(p) { return (
  <IcoSvg {...p}>
    <path d="M8 3 L10.5 9 M16 3 L13.5 9" />
    <circle cx="12" cy="15" r="5.5" />
    <path d="M12 12 L12.9 13.8 L14.9 14 L13.4 15.4 L13.8 17.4 L12 16.4 L10.2 17.4 L10.6 15.4 L9.1 14 L11.1 13.8 Z" {..._F()} />
  </IcoSvg>); }
function IconRun(p) { return (
  <IcoSvg {...p}>
    <circle cx="15" cy="4.5" r="2" />
    <path d="M14 8 L9 11 L12 13 L11 19" />
    <path d="M12 13 L16 15 L17 19" />
    <path d="M9 11 L5 12" />
    <path d="M14 8 L17 9" />
  </IcoSvg>); }
function IconGymnastics(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="19.5" r="1.8" />
    <path d="M12 17.7 V11 L7 6" />
    <path d="M12 11 L17 6" />
    <path d="M12 13.5 L8 16" /><path d="M12 13.5 L16 16" />
  </IcoSvg>); }

// ═══════════════ Analytics / data viz ════════════════════════════
function IconBarsStacked(p) { return (
  <IcoSvg {...p}>
    <line x1="3" y1="21" x2="21" y2="21" />
    <rect x="5" y="13" width="3.5" height="8" rx="0.6" />
    <rect x="5" y="9" width="3.5" height="4" rx="0.6" {..._F()} opacity="0.5" />
    <rect x="10.2" y="15" width="3.5" height="6" rx="0.6" />
    <rect x="10.2" y="10" width="3.5" height="5" rx="0.6" {..._F()} opacity="0.5" />
    <rect x="15.4" y="11" width="3.5" height="10" rx="0.6" />
    <rect x="15.4" y="7" width="3.5" height="4" rx="0.6" {..._F()} opacity="0.5" />
  </IcoSvg>); }
function IconDonut(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.8" />
    <path d="M12 3.5 A8.5 8.5 0 0 1 19.5 9" strokeWidth={(p.stroke||1.7)+1.4} />
  </IcoSvg>); }
function IconRadar(p) { return (
  <IcoSvg {...p}>
    <polygon points="12,3 20,9 17,19 7,19 4,9" />
    <polygon points="12,7.5 16.2,10.6 14.6,15.6 9.4,15.6 7.8,10.6" {..._F()} opacity="0.35" />
    <line x1="12" y1="3" x2="12" y2="12" opacity="0.4" />
    <line x1="4" y1="9" x2="12" y2="12" opacity="0.4" />
    <line x1="20" y1="9" x2="12" y2="12" opacity="0.4" />
  </IcoSvg>); }
function IconTrend(p) { return (
  <IcoSvg {...p}>
    <polyline points="3,16 9,10 13,13 21,5" />
    <polyline points="16,5 21,5 21,10" />
  </IcoSvg>); }

// ═══════════════ Psychology / mental ═════════════════════════════
// Biotypes use the 4 elements: fire / sun / moon / wave.
function IconFire(p) { return (
  <IcoSvg {...p}>
    <path d="M12 3 C12 7 8.5 8 8.5 13 A5 5 0 0 0 15.5 17.5 C17 16 17.5 13.5 16 11 C15.5 13 14.5 13 14 11 C13.5 9 12 8 12 3 Z" />
  </IcoSvg>); }
function IconWaveEl(p) { return (
  <IcoSvg {...p}>
    <path d="M3 9 Q7 5 11 9 T 21 9" />
    <path d="M3 14 Q7 10 11 14 T 21 14" />
    <path d="M3 19 Q7 15 11 19 T 21 19" />
  </IcoSvg>); }
function IconBrain(p) { return (
  <IcoSvg {...p}>
    <path d="M12 5 A3 3 0 0 0 6.5 6.5 A3 3 0 0 0 5 12 A3 3 0 0 0 7 17 A3 3 0 0 0 12 19 Z" />
    <path d="M12 5 A3 3 0 0 1 17.5 6.5 A3 3 0 0 1 19 12 A3 3 0 0 1 17 17 A3 3 0 0 1 12 19" />
    <line x1="12" y1="5" x2="12" y2="19" />
  </IcoSvg>); }
function IconPolarity(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3 A4.5 4.5 0 0 0 12 12 A4.5 4.5 0 0 1 12 21" {..._F()} />
    <circle cx="12" cy="7.5" r="1" fill="none" />
    <circle cx="12" cy="16.5" r="1" {..._F()} />
  </IcoSvg>); }
function IconWound(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 7 L13 11 L9.5 13 L14 17" strokeDasharray="0.1 3.2" />
  </IcoSvg>); }
function IconLocus(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <circle cx="14.5" cy="12" r="2.2" {..._F()} />
  </IcoSvg>); }

// ═══════════════ Biohacking / habits ═════════════════════════════
function IconSnowflake(p) { return (
  <IcoSvg {...p}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="4" y1="7.5" x2="20" y2="16.5" />
    <line x1="4" y1="16.5" x2="20" y2="7.5" />
    <path d="M9.5 4.5 L12 6 L14.5 4.5 M9.5 19.5 L12 18 L14.5 19.5" />
  </IcoSvg>); }
function IconSauna(p) { return (
  <IcoSvg {...p}>
    <path d="M8 3 C7 5 9 6 8 8 M12 3 C11 5 13 6 12 8 M16 3 C15 5 17 6 16 8" />
    <path d="M4 11 H20 L18.5 20 A1.5 1.5 0 0 1 17 21 H7 A1.5 1.5 0 0 1 5.5 20 Z" />
  </IcoSvg>); }
function IconFasting(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7 V12 L15.5 14" />
    <line x1="6" y1="6" x2="18" y2="18" opacity="0.55" />
  </IcoSvg>); }
function IconLotus(p) { return (
  <IcoSvg {...p}>
    <path d="M12 5 C10 8 10 11 12 13 C14 11 14 8 12 5 Z" />
    <path d="M12 13 C9 10 6 10 4 12 C5 15 8 16 12 14" />
    <path d="M12 13 C15 10 18 10 20 12 C19 15 16 16 12 14" />
    <path d="M4.5 16 Q12 20 19.5 16" />
  </IcoSvg>); }
function IconFloat(p) { return (
  <IcoSvg {...p}>
    <ellipse cx="12" cy="14" rx="9" ry="4.5" />
    <path d="M7 13 Q9.5 11 12 13 T 17 13" />
    <circle cx="12" cy="7" r="2" />
  </IcoSvg>); }
function IconPhoneOff(p) { return (
  <IcoSvg {...p}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <line x1="11" y1="18" x2="13" y2="18" />
    <line x1="5" y1="4" x2="19" y2="20" strokeWidth={(p.stroke||1.7)+0.3} />
  </IcoSvg>); }
function IconFocus(p) { return (
  <IcoSvg {...p}>
    <path d="M4 4 H8 M4 4 V8 M20 4 H16 M20 4 V8 M4 20 H8 M4 20 V16 M20 20 H16 M20 20 V16" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="0.8" {..._F()} />
  </IcoSvg>); }
function IconMountain(p) { return (
  <IcoSvg {...p}>
    <path d="M3 19 L9 8 L13 14 L15.5 10 L21 19 Z" />
    <path d="M7.5 10.5 L9 8 L10.5 10.5" />
  </IcoSvg>); }
function IconStretch(p) { return (
  <IcoSvg {...p}>
    <circle cx="7" cy="5" r="2" />
    <path d="M7 7 L7 13 L4 20" />
    <path d="M7 9 L13 11" />
    <path d="M7 13 L13 13 L20 11" />
  </IcoSvg>); }

// ═══════════════ Vices (use IconProhibit overlay) ════════════════
function IconProhibit(p) { return (
  <IcoSvg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
  </IcoSvg>); }
function IconGlass(p) { return (
  <IcoSvg {...p}>
    <path d="M7 4 H17 L15.5 13 A3.5 3.5 0 0 1 8.5 13 Z" />
    <line x1="12" y1="16.5" x2="12" y2="20" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <path d="M8 8 H16" opacity="0.5" />
  </IcoSvg>); }
function IconCigarette(p) { return (
  <IcoSvg {...p}>
    <rect x="3" y="13" width="15" height="4" rx="1" />
    <line x1="14" y1="13" x2="14" y2="17" />
    <path d="M19 4 C18 5.5 20 6.5 19 8" />
    <path d="M21 13 V11" /><path d="M18 8 V11" />
  </IcoSvg>); }
function IconLeaf(p) { return (
  <IcoSvg {...p}>
    <path d="M12 21 C12 14 14 8 20 4 C20 12 17 18 12 21 Z" />
    <path d="M12 21 C12 14 10 8 4 4 C4 12 7 18 12 21 Z" />
    <line x1="12" y1="21" x2="12" y2="11" />
  </IcoSvg>); }
function IconBurger(p) { return (
  <IcoSvg {...p}>
    <path d="M4 8 A8 4 0 0 1 20 8 Z" />
    <path d="M4 12 Q12 14 20 12" />
    <path d="M4 11 H20" />
    <path d="M5 15 H19 A3 3 0 0 1 16 18 H8 A3 3 0 0 1 5 15 Z" />
  </IcoSvg>); }
function IconSugar(p) { return (
  <IcoSvg {...p}>
    <path d="M5 8 L9 5 L19 8 L15 11 Z" />
    <path d="M5 8 V15 L11 18 V11" />
    <path d="M15 11 V18 L11 18" opacity="0.6" />
  </IcoSvg>); }

// ═══════════════ Nutrition / kitchen ═════════════════════════════
function IconJar(p) { return (
  <IcoSvg {...p}>
    <path d="M7 8 H17 V19 A2 2 0 0 1 15 21 H9 A2 2 0 0 1 7 19 Z" />
    <rect x="6.5" y="4" width="11" height="4" rx="1.2" />
    <line x1="9" y1="13" x2="15" y2="13" opacity="0.55" />
  </IcoSvg>); }
function IconCart(p) { return (
  <IcoSvg {...p}>
    <path d="M3 4 H5 L7 15 H18 L20 7 H6" />
    <circle cx="8.5" cy="19" r="1.6" />
    <circle cx="16.5" cy="19" r="1.6" />
  </IcoSvg>); }
function IconFridge(p) { return (
  <IcoSvg {...p}>
    <rect x="6" y="3" width="12" height="18" rx="2.5" />
    <line x1="6" y1="10" x2="18" y2="10" />
    <line x1="9" y1="6" x2="9" y2="8" />
    <line x1="9" y1="13" x2="9" y2="16" />
  </IcoSvg>); }
function IconScoop(p) { return (
  <IcoSvg {...p}>
    <path d="M4 12 A8 7 0 0 1 20 12 Z" />
    <path d="M6 12 V16 A6 3 0 0 0 18 16 V12" />
    <line x1="18" y1="9" x2="21" y2="6" />
    <circle cx="21" cy="5.5" r="1.2" />
  </IcoSvg>); }
function IconCapsule(p) { return (
  <IcoSvg {...p}>
    <rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-30 12 12)" />
    <line x1="9.5" y1="14.5" x2="14.5" y2="9.5" transform="rotate(-30 12 12)" />
  </IcoSvg>); }
function IconFish(p) { return (
  <IcoSvg {...p}>
    <path d="M3 12 C7 7 14 7 18 12 C14 17 7 17 3 12 Z" />
    <path d="M18 12 L21 9 V15 Z" />
    <circle cx="7" cy="11" r="0.7" {..._F()} />
  </IcoSvg>); }

Object.assign(window, {
  // ui
  IconSearch, IconSettings, IconClose, IconChevronDown, IconChevronUp,
  IconCalendar, IconCalendarDays, IconEdit, IconTrash, IconShare,
  IconExport, IconDownload, IconPlay, IconInfo, IconFilter, IconStar,
  IconTarget, IconShield, IconLink, IconSync, IconDevice, IconLock,
  // travel
  IconPlane, IconSuitcase, IconMapPin, IconHotel, IconBoxGym, IconCompass,
  // equipment
  IconBarbell, IconKettlebell, IconPullupBar, IconBands, IconTRX,
  IconRower, IconBike, IconJumpRope, IconPlyoBox, IconBench, IconCable,
  IconSandbag, IconMedBall, IconParallettes, IconBodyweight, IconRings,
  // biometrics
  IconScale, IconRuler, IconBodyComp, IconPulse, IconHeartRate,
  IconBloodPressure, IconThermometer, IconBloodDrop, IconGlucose, IconBone,
  // PR / achievements
  IconTrophy, IconMedal, IconRun, IconGymnastics,
  // analytics
  IconBarsStacked, IconDonut, IconRadar, IconTrend,
  // psychology
  IconFire, IconWaveEl, IconBrain, IconPolarity, IconWound, IconLocus,
  // biohacking
  IconSnowflake, IconSauna, IconFasting, IconLotus, IconFloat,
  IconPhoneOff, IconFocus, IconMountain, IconStretch,
  // vices
  IconProhibit, IconGlass, IconCigarette, IconLeaf, IconBurger, IconSugar,
  // nutrition / kitchen
  IconJar, IconCart, IconFridge, IconScoop, IconCapsule, IconFish,
});
