// SOMA Icon System — 24×24 viewBox, stroke-based, rounded caps/joins
function Svg({ size = 22, stroke = 1.7, color, children, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function IconHome(p) { return <Svg {...p}><path d="M4 11.5 L12 4 L20 11.5 V20 H4 Z"/><path d="M10 20 V14 H14 V20"/></Svg>; }
export function IconTrain(p) { return <Svg {...p}><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="9.5" x2="7" y2="14.5"/><line x1="17" y1="9.5" x2="17" y2="14.5"/><rect x="3" y="7.5" width="3" height="9" rx="1"/><rect x="18" y="7.5" width="3" height="9" rx="1"/></Svg>; }
export function IconEat(p) { return <Svg {...p}><circle cx="14" cy="12" r="6.5"/><circle cx="14" cy="12" r="3.5"/><line x1="4" y1="3.5" x2="4" y2="9"/><path d="M2.5 3.5 V7 A1.5 1.5 0 0 0 5.5 7 V3.5"/><line x1="4" y1="9" x2="4" y2="20.5"/></Svg>; }
export function IconRecords(p) { return <Svg {...p}><line x1="4" y1="20" x2="4" y2="14"/><line x1="10" y1="20" x2="10" y2="10"/><line x1="16" y1="20" x2="16" y2="6"/><line x1="3" y1="20" x2="20" y2="20"/></Svg>; }
export function IconJournal(p) { return <Svg {...p}><path d="M5 4 H17 A2 2 0 0 1 19 6 V20 H5 Z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></Svg>; }
export function IconProfile(p) { return <Svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21 A8 8 0 0 1 20 21"/></Svg>; }
export function IconPlus(p) { return <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>; }
export function IconChevronRight(p) { return <Svg {...p}><polyline points="9,5 16,12 9,19"/></Svg>; }
export function IconChevronLeft(p) { return <Svg {...p}><polyline points="15,5 8,12 15,19"/></Svg>; }
export function IconChevronDown(p) { return <Svg {...p}><polyline points="5,9 12,16 19,9"/></Svg>; }
export function IconX(p) { return <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>; }
export function IconBell(p) { return <Svg {...p}><path d="M6 16 V11 A6 6 0 0 1 18 11 V16 L20 18 H4 Z"/><path d="M10 21 A2 2 0 0 0 14 21"/></Svg>; }
export function IconArrowUp(p) { return <Svg {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="6,11 12,5 18,11"/></Svg>; }
export function IconArrowDown(p) { return <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="6,13 12,19 18,13"/></Svg>; }
export function IconCheck(p) { return <Svg {...p}><polyline points="4,12 10,18 20,6"/></Svg>; }
export function IconMic(p) { return <Svg {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11 A7 7 0 0 0 19 11"/><line x1="12" y1="18" x2="12" y2="21"/></Svg>; }
export function IconCamera(p) { return <Svg {...p}><path d="M3 8 H7 L9 5 H15 L17 8 H21 V19 H3 Z"/><circle cx="12" cy="13" r="3.5"/></Svg>; }
export function IconSleep(p) { return <Svg {...p}><path d="M19 14 A8 8 0 1 1 10 5 A6 6 0 0 0 19 14 Z"/></Svg>; }
export function IconRecovery(p) { return <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M5 12 Q 8 7 11 12 T 17 12 T 21 12"/></Svg>; }
export function IconStreak(p) { return <Svg {...p}><path d="M12 3 C 9 8 7 9 7 13 A5 5 0 0 0 17 13 C 17 10 15 9 14 6 C 13.5 8 13 9 12 9 Z"/></Svg>; }
export function IconWater(p) { return <Svg {...p}><path d="M12 3 C 7 10 5 13 5 16 A7 7 0 0 0 19 16 C 19 13 17 10 12 3 Z"/></Svg>; }
export function IconProtein(p) { return <Svg {...p}><path d="M7 13 A5 5 0 1 1 13 7 L 18 12 L 14 16 L 9 11"/><line x1="4" y1="20" x2="9" y2="15"/></Svg>; }
export function IconCarbs(p) { return <Svg {...p}><line x1="12" y1="4" x2="12" y2="20"/><path d="M12 7 Q 8 9 8 13 Q 12 12 12 9 Z" fill="currentColor" stroke="none"/><path d="M12 7 Q 16 9 16 13 Q 12 12 12 9 Z" fill="currentColor" stroke="none"/><path d="M12 12 Q 8 14 8 18 Q 12 17 12 14 Z" fill="currentColor" stroke="none"/><path d="M12 12 Q 16 14 16 18 Q 12 17 12 14 Z" fill="currentColor" stroke="none"/></Svg>; }
export function IconFat(p) { return <Svg {...p}><path d="M12 4 C 8 10 6 12 6 15 A6 6 0 0 0 18 15 C 18 12 16 10 12 4 Z"/><circle cx="10" cy="14" r="1" fill="currentColor" stroke="none"/></Svg>; }
export function IconSun(p) { return <Svg {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="5.5"/><line x1="12" y1="18.5" x2="12" y2="21"/><line x1="3" y1="12" x2="5.5" y2="12"/><line x1="18.5" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="7.4" y2="7.4"/><line x1="16.6" y1="16.6" x2="18.4" y2="18.4"/><line x1="5.6" y1="18.4" x2="7.4" y2="16.6"/><line x1="16.6" y1="7.4" x2="18.4" y2="5.6"/></Svg>; }
export function IconMoon(p) { return <Svg {...p}><path d="M20 14 A8 8 0 1 1 10 4 A6 6 0 0 0 20 14 Z"/></Svg>; }
export function IconSnack(p) { return <Svg {...p}><path d="M12 7 C 8 7 5 9 5 13 C 5 17 8 20 12 20 C 16 20 19 17 19 13 C 19 9 16 7 12 7 Z"/><path d="M12 7 V 5 Q 13.5 4 15 4"/></Svg>; }
export function IconHeart(p) { return <Svg {...p}><path d="M12 20 C 4 14 4 8 8 6 C 10 5 12 7 12 9 C 12 7 14 5 16 6 C 20 8 20 14 12 20 Z"/></Svg>; }
export function IconDumbbellSmall(p) { return <Svg {...p}><line x1="7" y1="12" x2="17" y2="12" strokeWidth="2.2"/><rect x="4" y="8" width="3" height="8" rx="1"/><rect x="17" y="8" width="3" height="8" rx="1"/></Svg>; }
export function IconBolt(p) { return <Svg {...p} fill={p.color||'currentColor'}><polygon points="13,3 5,14 11,14 10,21 18,10 12,10"/></Svg>; }
export function IconTimer(p) { return <Svg {...p}><circle cx="12" cy="13" r="7"/><line x1="12" y1="13" x2="12" y2="9"/><line x1="12" y1="13" x2="15" y2="13"/><line x1="9" y1="3" x2="15" y2="3"/></Svg>; }
export function IconFlame(p) { return <Svg {...p}><path d="M12 3 C 12 7 8 8 8 13 A4 4 0 0 0 16 13 C 16 11 14 10 14 8 C 13 9 12 9 12 3 Z"/></Svg>; }
export function IconBalance(p) { return <Svg {...p}><line x1="12" y1="4" x2="12" y2="20"/><line x1="6" y1="20" x2="18" y2="20"/><line x1="5" y1="9" x2="19" y2="9"/><path d="M5 9 L 2 15 A3 3 0 0 0 8 15 Z"/><path d="M19 9 L 16 15 A3 3 0 0 0 22 15 Z"/></Svg>; }
export function IconSignal(p) { return <Svg {...p} stroke={p.stroke||1.5}><line x1="3" y1="14" x2="3" y2="16"/><line x1="7" y1="12" x2="7" y2="16"/><line x1="11" y1="10" x2="11" y2="16"/><line x1="15" y1="8" x2="15" y2="16"/></Svg>; }
export function IconBattery(p) { return <Svg {...p} stroke={p.stroke||1.5}><rect x="2" y="9" width="18" height="8" rx="2"/><line x1="21" y1="11" x2="21" y2="15"/><rect x="4" y="11" width="11" height="4" fill="currentColor" stroke="none" rx="1"/></Svg>; }
export function IconWifi(p) { return <Svg {...p} stroke={p.stroke||1.5}><path d="M3 10 A12 12 0 0 1 21 10"/><path d="M6 13 A8 8 0 0 1 18 13"/><path d="M9 16 A4 4 0 0 1 15 16"/><circle cx="12" cy="19" r="0.7" fill="currentColor" stroke="none"/></Svg>; }
export function IconBrief(p) { return <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></Svg>; }
export function IconBarbell(p) { return <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><rect x="1" y="9" width="4" height="6" rx="1"/><rect x="19" y="9" width="4" height="6" rx="1"/><rect x="5" y="10" width="3" height="4" rx="0.5"/><rect x="16" y="10" width="3" height="4" rx="0.5"/></Svg>; }
export function IconRun(p) { return <Svg {...p}><circle cx="15" cy="4" r="1.5"/><path d="M9 19 L12 13 L15 15 L17 9"/><path d="M7 13 L11 11 L13 7"/><path d="M13 19 L16 17"/></Svg>; }
export function IconMap(p) { return <Svg {...p}><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></Svg>; }
export function IconPlane(p) { return <Svg {...p}><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></Svg>; }
export function IconGear(p) { return <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>; }
export function IconActivity(p) { return <Svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Svg>; }
export function IconTrendUp(p) { return <Svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>; }
export function IconCalendar(p) { return <Svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>; }
export function IconTarget(p) { return <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Svg>; }
export function IconLotus(p) { return <Svg {...p}><path d="M12 22c-4.4 0-8-3.4-8-7.6 0-2.2.9-4.2 2.4-5.6C7.7 8 9 7.5 10 7.5c.8 0 1.5.3 2 .7.5-.4 1.2-.7 2-.7 1 0 2.3.5 3.6 1.3C19.1 10.2 20 12.2 20 14.4 20 18.6 16.4 22 12 22z"/><path d="M12 22V8"/><path d="M12 16c0-2-1.5-4-4-5"/><path d="M12 16c0-2 1.5-4 4-5"/></Svg>; }
export function IconHRV(p) { return <Svg {...p}><path d="M2 12 h4 l3-8 4 16 3-10 3 5 3-3"/></Svg>; }
export function IconWeight(p) { return <Svg {...p}><circle cx="12" cy="12" r="7"/><path d="M9 9 A4 4 0 0 1 15 9"/><line x1="12" y1="5" x2="12" y2="3"/><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"/></Svg>; }
export function IconBrain(p) { return <Svg {...p}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/></Svg>; }
export function IconSearch(p) { return <Svg {...p}><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="20" y2="20"/></Svg>; }
export function IconImport(p) { return <Svg {...p}><polyline points="8,17 12,21 16,17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></Svg>; }

// Mood faces
function MoodBase({ size, stroke = 1.8, color, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color||'currentColor'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5"/>
      {children}
    </svg>
  );
}
export function MoodTired(p) { return <MoodBase {...p}><line x1="8.5" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="15.5" y2="10"/><path d="M9.5 15.5 Q12 14 14.5 15.5"/></MoodBase>; }
export function MoodNeutral(p) { return <MoodBase {...p}><circle cx="9.2" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><line x1="9.5" y1="15" x2="14.5" y2="15"/></MoodBase>; }
export function MoodOk(p) { return <MoodBase {...p}><circle cx="9.2" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><path d="M9.5 14.5 Q12 16 14.5 14.5"/></MoodBase>; }
export function MoodGood(p) { return <MoodBase {...p}><circle cx="9.2" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="14.8" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><path d="M9 14 Q12 17 15 14"/></MoodBase>; }
export function MoodGreat(p) { return (
  <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none"
    stroke={p.color||'currentColor'} strokeWidth={p.stroke||1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8"/>
    <circle cx="9.4" cy="11.5" r="0.5" fill="currentColor" stroke="none"/>
    <circle cx="14.6" cy="11.5" r="0.5" fill="currentColor" stroke="none"/>
    <path d="M8.5 14.5 Q12 18.2 15.5 14.5"/>
    <path d="M19 4 Q19.5 5.2 20.5 5.5 Q19.5 5.8 19 7 Q18.5 5.8 17.5 5.5 Q18.5 5.2 19 4 Z" fill="currentColor" stroke="none"/>
  </svg>
); }

export const MOOD_ICONS = [MoodTired, MoodNeutral, MoodOk, MoodGood, MoodGreat];
export const MOOD_LABELS = ['mal', 'neutro', 'ok', 'bien', 'pleno'];
