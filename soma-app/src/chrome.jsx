// SOMA shared chrome — StatusBar, DrawerMenu, Fab, PillarHeader, etc.
import { useRef } from 'react';
import { F5, WordmarkWithMark } from './marks.jsx';

// ─── Bottom-sheet drag handle + swipe-down to dismiss ───────────────
export function DragHandle({ t }) {
  return (
    <div style={{ width: 40, height: 5, borderRadius: 3, background: t.divider,
      margin: '0 auto 16px' }}/>
  );
}

// returns touch handlers; dragging the sheet down past a threshold closes it
export function useSwipeDown(onClose) {
  const startY = useRef(null);
  return {
    onTouchStart: e => { startY.current = e.touches[0].clientY; },
    onTouchEnd: e => {
      if (startY.current != null) {
        const dy = e.changedTouches[0].clientY - startY.current;
        if (dy > 70) onClose();
      }
      startY.current = null;
    },
  };
}
import {
  IconSignal, IconWifi, IconBattery,
  IconHome, IconTrain, IconEat, IconRecords, IconJournal, IconProfile,
  IconBell, IconPlus, IconChevronRight, IconChevronLeft, IconBalance,
  IconDumbbellSmall, IconHeart, IconWater, IconFat, IconSearch,
  IconFlame, IconImport, IconActivity,
} from './icons.jsx';

// ─── Status bar ───────────────────────────────────────────────────
export function StatusBar({ t }) {
  return null; // OS shows its own status bar in production
}

// ─── Hamburger menu button ─────────────────────────────────────────
export function MenuButton({ t, onMenu, color }) {
  const c = color || t.fg;
  return (
    <button onClick={onMenu} style={{ border:'none', background:'transparent', padding:0,
      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
      color:c, width:32, height:32, flexShrink:0 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <line x1="4" y1="7" x2="20" y2="7"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="17" x2="14" y2="17"/>
      </svg>
    </button>
  );
}

// ─── FAB ──────────────────────────────────────────────────────────
export function Fab({ t, onClick }) {
  return (
    <button onClick={onClick} style={{
      position:'absolute', right:18, bottom:26, zIndex:30,
      width:56, height:56, borderRadius:'50%',
      background:t.accent, color:t.onAccent, border:'none', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:`0 10px 26px ${t.accent}44, 0 4px 10px rgba(0,0,0,0.4)`,
    }}>
      <IconPlus size={26} stroke={2.4} color={t.onAccent}/>
    </button>
  );
}

// ─── Back button ──────────────────────────────────────────────────
export function BackButton({ t, onBack }) {
  return (
    <button onClick={onBack} style={{ border:'none', background:'transparent', padding:0,
      color:t.fg, cursor:'pointer', display:'flex', marginTop:4, width:32, height:32,
      alignItems:'center', justifyContent:'center' }}>
      <IconChevronLeft size={20} stroke={2} color={t.fg}/>
    </button>
  );
}

// ─── Drawer menu ──────────────────────────────────────────────────
export function DrawerMenu({ t, open, onClose, screen, onNav }) {
  if (!open) return null;

  const groups = [
    { title:'Today', items:[
      { id:'home',      lab:'Home',           Icon:IconHome,    color:t.fg },
    ]},
    { title:'Body', items:[
      { id:'train',     lab:'Entrena',        Icon:IconTrain,   color:t.pillar.train,   sub:'WODs · movements · history' },
      { id:'import',    lab:'Importar',       Icon:IconImport,  color:t.pillar.train,   sub:'Pega tu semana de NotebookLM' },
      { id:'eat',       lab:'Come',           Icon:IconEat,     color:t.pillar.eat,     sub:'Calories · meals · pantry' },
      { id:'records',   lab:'Records',        Icon:IconRecords, color:t.pillar.records, sub:'PRs · heatmap · imbalances' },
      { id:'prtracker', lab:'PR Tracker',     Icon:IconActivity,color:t.pillar.records, sub:'Lifts · gymnastics · endurance' },
      { id:'health',    lab:'Salud',          Icon:IconHeart,   color:t.secondary,      sub:'HRV · sleep · biometrics' },
    ]},
    { title:'Train', items:[
      { id:'wodlogger', lab:'WOD Logger',     Icon:IconDumbbellSmall, color:t.pillar.train, sub:'Quick · Standard · Full' },
      { id:'travel',    lab:'Travel Mode',    Icon:IconBalance, color:t.pillar.train,   sub:'Hotel · minimal · anywhere' },
      { id:'analytics', lab:'Analytics',      Icon:IconRecords, color:t.pillar.records, sub:'Programming · imbalances' },
    ]},
    { title:'Mind', items:[
      { id:'level',     lab:'SOMA Level',     Icon:IconBalance, color:t.pillar.records, sub:'Your holistic level · 1 of 12' },
      { id:'journal',   lab:'Bitácora',       Icon:IconJournal, color:t.fg,             sub:'Mood · habits · prompts' },
    ]},
    { title:'You', items:[
      { id:'me',        lab:'Yo · Profile',   Icon:IconProfile, color:t.fg,             sub:'Stats · inventories · settings' },
    ]},
  ];

  return (
    <div style={{ position:'absolute', inset:0, zIndex:100, display:'flex' }}>
      <div style={{
        width:'78%', maxWidth:300, height:'100%',
        background:t.bg, color:t.fg,
        display:'flex', flexDirection:'column',
        boxShadow:'12px 0 60px rgba(0,0,0,0.4)',
        animation:'slideIn 0.18s ease-out forwards',
      }}>
        {/* Header */}
        <div style={{ padding:'40px 20px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <WordmarkWithMark Mark={F5} size={30} color={t.fg}/>
          <button onClick={onClose} style={{ border:'none', background:t.s2, color:t.fg,
            width:30, height:30, borderRadius:'50%', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'inherit', fontSize:16, fontWeight:600 }}>×</button>
        </div>
        <div style={{ padding:'0 20px 20px', fontFamily:t.fonts.mono, fontSize:9,
          fontWeight:600, letterSpacing:'0.2em', color:t.fgFaint, textTransform:'uppercase' }}>
          body · mind · time
        </div>

        {/* Groups */}
        <div style={{ flex:1, overflow:'auto', paddingBottom:20 }}>
          {groups.map((g, gi) => (
            <div key={g.title} style={{ marginTop: gi > 0 ? 16 : 0 }}>
              <div style={{ padding:'0 20px 6px', fontFamily:t.fonts.mono, fontSize:9,
                fontWeight:700, letterSpacing:'0.18em', color:t.fgFaint, textTransform:'uppercase' }}>
                {g.title}
              </div>
              {g.items.map(it => {
                const on = screen === it.id;
                return (
                  <button key={it.id}
                    onClick={() => { onNav(it.id); onClose(); }}
                    style={{ width:'100%', border:'none',
                      background:on ? it.color : 'transparent',
                      color:on ? '#0A0908' : t.fg,
                      cursor:'pointer', textAlign:'left', padding:'10px 20px',
                      display:'flex', alignItems:'center', gap:12, fontFamily:'inherit' }}>
                    <div style={{ width:30, height:30, flexShrink:0, borderRadius:8,
                      background:on ? '#0A090815' : t.surface,
                      color:on ? '#0A0908' : it.color,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <it.Icon size={16} stroke={1.9}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:t.fonts.body, fontWeight:600, fontSize:13 }}>{it.lab}</div>
                      {it.sub && <div style={{ fontFamily:t.fonts.body, fontSize:10.5,
                        color:on ? '#0A090988' : t.fgMuted, marginTop:1 }}>{it.sub}</div>}
                    </div>
                    {on && <IconChevronRight size={14} color="#0A0908"/>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 20px', borderTop:`1px solid ${t.divider}`,
          fontFamily:t.fonts.mono, fontSize:9, fontWeight:600,
          letterSpacing:'0.16em', color:t.fgFaint, textTransform:'uppercase' }}>
          v1.0 · soma
        </div>
      </div>
      <div onClick={onClose} style={{ flex:1, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}/>
      <style>{`
        @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { transform:translateY(40px); opacity:0; } to { transform:translateY(0); opacity:1; } }
      `}</style>
    </div>
  );
}

// ─── Add / Quick-log sheet ─────────────────────────────────────────
export function AddSheet({ t, open, onClose, onNav }) {
  if (!open) return null;

  const quick = [
    { id:'workout',  lab:'Workout',  Icon:IconDumbbellSmall, col:t.pillar.train },
    { id:'meal',     lab:'Meal',     Icon:IconEat,           col:t.pillar.eat },
    { id:'mood',     lab:'Mood',     Icon:IconHeart,         col:t.secondary },
    { id:'water',    lab:'Water',    Icon:IconWater,         col:t.tertiary },
    { id:'weight',   lab:'Weight',   Icon:IconBalance,       col:t.fg },
  ];

  return (
    <div style={{ position:'absolute', inset:0, zIndex:50, animation:'fadeIn 0.18s ease-out' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0,
        background:'rgba(0,0,0,0.45)', backdropFilter:'blur(2px)' }}/>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        background:t.bg, borderRadius:'24px 24px 0 0',
        padding:'12px 0 32px', maxHeight:'85%', overflow:'auto',
        boxShadow:'0 -20px 60px rgba(0,0,0,0.4)',
        animation:'slideUp 0.22s ease-out',
      }}>
        <div style={{ width:40, height:4, borderRadius:2, background:t.fgFaint,
          opacity:0.5, margin:'0 auto 16px' }}/>
        <div style={{ padding:'0 20px' }}>
          <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:22,
            letterSpacing:'-0.03em', color:t.fg }}>Quick log</div>
        </div>

        {/* Quick grid */}
        <div style={{ margin:'14px 20px 0', display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
          {quick.map(q => (
            <button key={q.id}
              onClick={() => { onNav('log:'+q.id); onClose(); }}
              style={{ border:'none', cursor:'pointer', padding:'12px 6px', borderRadius:12,
                background:t.surface, color:q.col, fontFamily:'inherit',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <q.Icon size={20} stroke={1.9}/>
              <span style={{ fontFamily:t.fonts.mono, fontSize:8.5, fontWeight:700,
                letterSpacing:'0.14em', color:t.fg, textTransform:'uppercase' }}>{q.lab}</span>
            </button>
          ))}
        </div>

        {/* Featured: Import */}
        <button onClick={() => { onNav('import'); onClose(); }}
          style={{ margin:'14px 20px 0', width:'calc(100% - 40px)',
            border:'none', cursor:'pointer', textAlign:'left',
            padding:'14px 15px', borderRadius:16, background:t.accent, color:t.onAccent,
            display:'flex', alignItems:'center', gap:12, fontFamily:'inherit' }}>
          <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
            background:'#0A090815', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IconImport size={20} stroke={2}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:15, letterSpacing:'-0.02em' }}>
              Importar de NotebookLM</div>
            <div style={{ fontFamily:t.fonts.body, fontSize:11, opacity:0.82, marginTop:1 }}>
              Pega la semana entera → se crea sola</div>
          </div>
          <IconChevronRight size={18} stroke={2.4}/>
        </button>
      </div>
    </div>
  );
}

// ─── Pillar header ────────────────────────────────────────────────
export function PillarHeader({ t, title, sub, pillarColor, onMenu, onBack }) {
  return (
    <div style={{ padding:'4px 14px 0', display:'flex',
      justifyContent:'space-between', alignItems:'flex-start' }}>
      <div style={{ display:'flex', gap:6, alignItems:'flex-start', flex:1 }}>
        {onMenu && <MenuButton t={t} onMenu={onMenu}/>}
        {onBack && !onMenu && <BackButton t={t} onBack={onBack}/>}
        <div style={{ paddingTop:4 }}>
          {title && <div style={{ fontFamily:t.fonts.display, fontWeight:800, fontSize:26,
            letterSpacing:'-0.035em', lineHeight:1.05, color:t.fg }}>{title}</div>}
          {sub && <div style={{ fontFamily:t.fonts.body, fontSize:11.5,
            color:t.fgMuted, marginTop:3 }}>{sub}</div>}
        </div>
      </div>
      {pillarColor && (
        <div style={{ width:34, height:34, borderRadius:'50%', background:pillarColor, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center', marginTop:4 }}>
          <svg width="22" height="22" viewBox="0 0 80 80">
            <F5 color="#0A0908" stroke={8}/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────
export function MonoLabel({ t, children, color }) {
  return (
    <div style={{ fontFamily:t.fonts.mono, fontSize:9.5, fontWeight:700,
      letterSpacing:'0.18em', color:color||t.fgFaint, textTransform:'uppercase' }}>
      {children}
    </div>
  );
}

export function SectionHead({ t, children, actionLabel, onAction }) {
  return (
    <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <MonoLabel t={t}>{children}</MonoLabel>
      {actionLabel && (
        <button onClick={onAction} style={{ border:'none', background:'transparent', padding:0,
          cursor:'pointer', fontFamily:t.fonts.mono, fontSize:9.5, fontWeight:700,
          letterSpacing:'0.16em', color:t.fgMuted, textTransform:'uppercase' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ScreenFrame({ t, children, accentColor }) {
  return (
    <div style={{ width:'100%', height:'100%', background:t.bg, color:t.fg,
      position:'relative', overflow:'hidden', fontFamily:t.fonts.body }}>
      {accentColor && (
        <div style={{ position:'absolute', right:-60, top:200, width:280, height:280,
          opacity:t.mode==='dark'?0.04:0.05, pointerEvents:'none', zIndex:0 }}>
          <svg viewBox="0 0 80 80" width="100%" height="100%">
            <F5 color={accentColor} stroke={4}/>
          </svg>
        </div>
      )}
      <div style={{ position:'relative', zIndex:1, height:'100%' }}>{children}</div>
    </div>
  );
}

// ─── Bottom tab bar ───────────────────────────────────────────────
export function BottomTabBar({ t, screen, onNav, onPlus }) {
  const tabs = [
    { id:'home',    Icon:IconHome,    label:'Home' },
    { id:'train',   Icon:IconTrain,   label:'Entrena' },
    null,
    { id:'journal', Icon:IconJournal, label:'Diario' },
    { id:'me',      Icon:IconProfile, label:'Yo' },
  ];

  return (
    <div style={{
      display:'flex', alignItems:'center',
      height:68, flexShrink:0,
      paddingBottom:'env(safe-area-inset-bottom)',
      background:t.bg,
      borderTop:`1px solid ${t.divider}`,
    }}>
      {tabs.map((tab, i) => {
        if (!tab) return (
          <div key="fab" style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center' }}>
            <button onClick={onPlus} style={{
              width:58, height:58, borderRadius:'50%',
              background:t.accent, border:'none', cursor:'pointer',
              color:t.onAccent, display:'flex', alignItems:'center',
              justifyContent:'center', transform:'translateY(-10px)',
              boxShadow:`0 6px 20px ${t.accent}66`,
            }}>
              <IconPlus size={28} stroke={2.4}/>
            </button>
          </div>
        );
        const active = screen === tab.id;
        return (
          <button key={tab.id} onClick={() => onNav(tab.id)}
            style={{ flex:1, height:'100%', border:'none', background:'transparent',
              cursor:'pointer', display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:5,
              color: active ? t.accent : t.fgMuted }}>
            <tab.Icon size={27} stroke={active ? 2.3 : 1.8}/>
            <span style={{ fontFamily:t.fonts.body, fontSize:11.5, fontWeight: active ? 700 : 500,
              letterSpacing:'0' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PillarTag({ t, pillar, children }) {
  const map = {
    train:   { bg:t.pillar.train,   fg:'#0A0908' },
    eat:     { bg:t.pillar.eat,     fg:'#0A0908' },
    records: { bg:t.pillar.records, fg:'#0A0908' },
    journal: { bg:t.fg,             fg:t.bg },
  };
  const { bg, fg } = map[pillar] || { bg:t.s2, fg:t.fg };
  return (
    <span style={{ fontFamily:t.fonts.mono, fontSize:9, fontWeight:700, letterSpacing:'0.14em',
      textTransform:'uppercase', background:bg, color:fg, padding:'3px 7px', borderRadius:4 }}>
      {children}
    </span>
  );
}
