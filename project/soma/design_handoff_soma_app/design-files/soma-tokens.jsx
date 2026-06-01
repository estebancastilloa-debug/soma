// SOMA — Design tokens. Light + Dark. Single brand accent (tweakable).
// No more multi-theme system — just two modes and one accent color.

const ACCENTS = {
  lime: {
    id: 'lime',
    label: 'Lime · performance',
    note: 'electric, distinto del verde de health apps',
    hex: '#C8E84A',
    onAccent: '#0A0908', // text on the accent
  },
  coral: {
    id: 'coral',
    label: 'Coral · vital',
    note: 'cálido, energético, humano',
    hex: '#FF6B2B',
    onAccent: '#0A0908',
  },
  indigo: {
    id: 'indigo',
    label: 'Indigo · calm',
    note: 'sereno, técnico, performance moderno',
    hex: '#5B5BD6',
    onAccent: '#FFFFFF',
  },
  bone: {
    id: 'bone',
    label: 'Mono · sin acento',
    note: 'la marca es solo tipografía + neutros',
    hex: '#15120E', // becomes fg in light, fg in dark too via swap
    onAccent: '#FAF8F3',
  },
};

// Neutral palette tuned warm (cream + warm black) — editorial, not sterile.
const NEUTRALS = {
  light: {
    bg:        '#F6F5F2',
    surface:   '#FFFFFF',
    surface2:  '#ECEAE4',
    fg:        '#15120E',
    fgMuted:   '#5F5B53',
    fgFaint:   '#9A968F',
    border:    '#E3E0D9',
    divider:   '#ECE9E2',
  },
  dark: {
    bg:        '#0A0908',
    surface:   '#15130F',
    surface2:  '#1F1C17',
    fg:        '#F4F1EC',
    fgMuted:   '#9A938A',
    fgFaint:   '#6B655B',
    border:    '#2A2620',
    divider:   '#1F1C17',
  },
};

// Semantic — ONLY for results (verde=bien, amarillo=parcial, rojo=mal).
// Never used as a brand color — locked.
const SEMANTIC = {
  ok:   '#4ADE80',
  mid:  '#F5C84B',
  low:  '#EF5350',
};

// Resolve full token set from { mode, accentId }
function tokens({ mode = 'dark', accentId = 'lime' }) {
  const a = ACCENTS[accentId] || ACCENTS.lime;
  const n = NEUTRALS[mode] || NEUTRALS.dark;
  // For "mono" accent, the brand color literally IS the foreground.
  const accentHex = accentId === 'bone' ? n.fg : a.hex;
  const onAccent  = accentId === 'bone' ? n.bg : a.onAccent;
  return {
    mode, accentId,
    ...n,
    accent: accentHex,
    onAccent,
    semantic: SEMANTIC,
    fonts: {
      display: 'Syne, sans-serif',
      body: 'DM Sans, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
  };
}

Object.assign(window, { ACCENTS, NEUTRALS, SEMANTIC, tokens });
