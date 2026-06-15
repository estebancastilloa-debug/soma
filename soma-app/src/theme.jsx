import { createContext, useContext, useState, useEffect } from 'react';

// ─── Token computation (mirrors soma-tokens.jsx) ───────────────────
const BRAND = {
  lime:  { h: 72,  s: 78,  l: 60 },
  coral: { h: 18,  s: 100, l: 58 },
  blue:  { h: 215, s: 100, l: 68 },
};

const INTENSITY_TRANSFORMS = {
  vivid: { dS: 0,   dL: 0  },
  calm:  { dS: -42, dL: +6 },
  mono:  { dS: -100,dL: 0  },
};

function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }

function buildPalette(intensityId) {
  const t = INTENSITY_TRANSFORMS[intensityId] || INTENSITY_TRANSFORMS.vivid;
  const tone = (c) => {
    const s = Math.max(0, Math.min(100, c.s + t.dS));
    const l = Math.max(0, Math.min(100, c.l + t.dL));
    return hsl(c.h, s, l);
  };
  return { lime: tone(BRAND.lime), coral: tone(BRAND.coral), blue: tone(BRAND.blue) };
}

const NEUTRALS = {
  light: {
    bg:'#F2EFE6', surface:'#FFFFFF', s2:'#E8E4D9', surfaceInk:'#15120E',
    fg:'#15120E', fgMuted:'#5F5B53', fgFaint:'#9A968F',
    border:'#D9D4C7', divider:'#E3DFD3',
  },
  dark: {
    bg:'#0A0908', surface:'#15130F', s2:'#211D17', surfaceInk:'#F4F1EC',
    fg:'#F4F1EC', fgMuted:'#9A938A', fgFaint:'#6B655B',
    border:'#2A2620', divider:'#1F1C17',
  },
};

const SEMANTIC = { ok:'#7BD89A', mid:'#F5C84B', low:'#EF6B5C' };

function computeTokens({ mode = 'dark', intensityId = 'vivid' }) {
  const p = buildPalette(intensityId);
  const n = NEUTRALS[mode] || NEUTRALS.dark;
  const isMono = intensityId === 'mono';
  const primary = isMono ? n.fg : p.lime;
  const onPrimary = isMono ? n.bg : '#0A0908';
  return {
    mode, intensityId,
    ...n,
    accent: primary, onAccent: onPrimary,
    primary, onPrimary,
    secondary:   isMono ? n.fg : p.coral,
    onSecondary: '#0A0908',
    tertiary:    isMono ? n.fg : p.blue,
    onTertiary:  '#0A0908',
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

export { computeTokens };

// ─── Context ────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('soma_theme_mode') || 'dark'; } catch { return 'dark'; }
  });
  const [intensityId, setIntensityId] = useState(() => {
    try { return localStorage.getItem('soma_theme_intensity') || 'calm'; } catch { return 'calm'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-intensity', intensityId);
    try {
      localStorage.setItem('soma_theme_mode', mode);
      localStorage.setItem('soma_theme_intensity', intensityId);
    } catch {}
  }, [mode, intensityId]);

  const t = computeTokens({ mode, intensityId });

  return (
    <ThemeContext.Provider value={{ mode, setMode, intensityId, setIntensityId, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const INTENSITIES = {
  vivid: { id: 'vivid', label: 'Vivid · electric', note: 'paleta original, máxima intensidad' },
  calm:  { id: 'calm',  label: 'Calm · soft',      note: 'mismos colores, menos saturados' },
  mono:  { id: 'mono',  label: 'Mono · sin color',  note: 'solo neutros, la marca es tipografía' },
};
