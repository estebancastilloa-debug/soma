// SOMA — Design tokens v0.6
// ONE brand palette: Lime (primary) + Coral (secondary) + Blue (tertiary).
// THREE intensity modes ("intensities") that share hues — Vivid / Calm / Mono.
// Two color modes — Dark / Light.
//
// Rule: the brand colors don't change between themes — only the saturation
// shifts. Calm is the SAME palette, softened. Mono drops chroma entirely.

// ── Brand anchors (in HSL so we can derive intensities) ───────────
// Lime = energía / Entrena, Coral = vital / Come, Blue = dato / Records
const BRAND = {
  lime:  { h:  72, s: 78, l: 60 },  // #C8E84A vivid
  coral: { h:  18, s: 100, l: 58 }, // #FF6B2B vivid
  blue:  { h: 215, s: 100, l: 68 }, // #5B9BFF vivid
};

function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }

// Each intensity is a transform on saturation + lightness.
const INTENSITY_TRANSFORMS = {
  vivid: { dS: 0,   dL: 0   },  // full intensity
  calm:  { dS: -42, dL: +6  },  // softened, slightly lifted
  mono:  { dS: -100, dL: 0  },  // achromatic (still uses HSL → pure grey)
};

function buildPalette(intensityId) {
  const t = INTENSITY_TRANSFORMS[intensityId] || INTENSITY_TRANSFORMS.vivid;
  const tone = (c) => {
    const s = Math.max(0, Math.min(100, c.s + t.dS));
    const l = Math.max(0, Math.min(100, c.l + t.dL));
    return hsl(c.h, s, l);
  };
  return {
    lime:  tone(BRAND.lime),
    coral: tone(BRAND.coral),
    blue:  tone(BRAND.blue),
  };
}

// Intensities the user picks from. Same hues, different feel.
const INTENSITIES = {
  vivid: {
    id: 'vivid',
    label: 'Vivid · electric',
    note: 'paleta original, máxima intensidad',
  },
  calm: {
    id: 'calm',
    label: 'Calm · soft',
    note: 'mismos colores, menos saturados',
  },
  mono: {
    id: 'mono',
    label: 'Mono · sin color',
    note: 'solo neutros, la marca es tipografía',
  },
};

// Neutral palette — warm cream / warm black. Doesn't change with intensity.
const NEUTRALS = {
  light: {
    bg:        '#F2EFE6',
    surface:   '#FFFFFF',
    surface2:  '#E8E4D9',
    surfaceInk:'#15120E',
    fg:        '#15120E',
    fgMuted:   '#5F5B53',
    fgFaint:   '#9A968F',
    border:    '#D9D4C7',
    divider:   '#E3DFD3',
  },
  dark: {
    bg:        '#0A0908',
    surface:   '#15130F',
    surface2:  '#211D17',
    surfaceInk:'#F4F1EC',
    fg:        '#F4F1EC',
    fgMuted:   '#9A938A',
    fgFaint:   '#6B655B',
    border:    '#2A2620',
    divider:   '#1F1C17',
  },
};

// Semantic — locked to results only (verde=ok, amarillo=parcial, rojo=mal).
// Calibrated to feel like part of the SOMA palette, not stock UI colors.
const SEMANTIC = {
  ok:   '#7BD89A',
  mid:  '#F5C84B',
  low:  '#EF6B5C',
};

// Resolve full token set from { mode, intensityId }
function tokens({ mode = 'dark', intensityId = 'vivid' }) {
  const p = buildPalette(intensityId);
  const n = NEUTRALS[mode] || NEUTRALS.dark;

  // In Mono, the "primary" is literally the ink — brand becomes type.
  const isMono   = intensityId === 'mono';
  const primary  = isMono ? n.fg : p.lime;
  const onPrimary = isMono ? n.bg : '#0A0908';

  return {
    mode, intensityId,
    ...n,
    // Brand
    accent:    primary,
    onAccent:  onPrimary,
    primary:   primary,
    onPrimary: onPrimary,
    secondary:   isMono ? n.fg : p.coral,
    onSecondary: '#0A0908',
    tertiary:    isMono ? n.fg : p.blue,
    onTertiary:  '#0A0908',
    // Per-pillar — gives each section its own identity.
    pillar: {
      train:   isMono ? n.fg : p.lime,
      eat:     isMono ? n.fg : p.coral,
      records: isMono ? n.fg : p.blue,
      journal: n.fg,
    },
    semantic: SEMANTIC,
    fonts: {
      display: 'Syne, sans-serif',
      body: 'DM Sans, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
  };
}

// Backwards-compat shim (old code still passes `accentId`).
const _origTokens = tokens;
window.tokens = function ({ mode, accentId, intensityId } = {}) {
  // accept either name; old "lime/coral/indigo/bone" mapped to nearest intensity
  if (intensityId == null && accentId != null) {
    if (accentId === 'bone') intensityId = 'mono';
    else if (accentId === 'indigo') intensityId = 'calm';
    else intensityId = 'vivid'; // lime + coral → vivid (same palette)
  }
  return _origTokens({ mode, intensityId });
};

Object.assign(window, { BRAND, INTENSITIES, NEUTRALS, SEMANTIC, tokens, buildPalette });
