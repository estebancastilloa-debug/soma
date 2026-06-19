import { createContext, useContext, useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

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
    bg:'#F5F6F8', surface:'#FFFFFF', s2:'#EDEFF2', surfaceInk:'#16181B',
    fg:'#16181B', fgMuted:'#5B6068', fgFaint:'#A2A8B0',
    border:'#E6E9ED', divider:'#EEF0F3',
  },
  dark: {
    bg:'#0A0908', surface:'#15130F', s2:'#211D17', surfaceInk:'#F4F1EC',
    fg:'#F4F1EC', fgMuted:'#9A938A', fgFaint:'#6B655B',
    border:'#2A2620', divider:'#1F1C17',
  },
};

const SEMANTIC = { ok:'#7BD89A', mid:'#F5C84B', low:'#EF6B5C' };

function computeTokens({ mode = 'dark', intensityId = 'vivid', accentId = 'lime' }) {
  const p = buildPalette(intensityId);
  const n = NEUTRALS[mode] || NEUTRALS.dark;
  const isMono = intensityId === 'mono';
  const accentMap = { lime: p.lime, blue: p.blue, coral: p.coral };
  const primary = isMono ? n.fg : (accentMap[accentId] || p.lime);
  const onPrimary = isMono ? n.bg : '#0A0908';
  return {
    mode, intensityId, accentId,
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
      display: 'Roboto, system-ui, sans-serif',
      body: 'Roboto, system-ui, sans-serif',
      mono: '"Roboto Mono", ui-monospace, monospace',
    },
  };
}

export { computeTokens };

// ─── Context ────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // One-time push to the new lighter, cleaner default (light + calm).
  // Respects the user's choices afterwards.
  try {
    if (localStorage.getItem('soma_theme_v') !== '2') {
      localStorage.setItem('soma_theme_mode', 'light');
      localStorage.setItem('soma_theme_intensity', 'calm');
      localStorage.setItem('soma_theme_v', '2');
    }
  } catch {}

  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('soma_theme_mode') || 'light'; } catch { return 'light'; }
  });
  const [intensityId, setIntensityId] = useState(() => {
    try { return localStorage.getItem('soma_theme_intensity') || 'calm'; } catch { return 'calm'; }
  });
  const [accentId, setAccentId] = useState(() => {
    try { return localStorage.getItem('soma_theme_accent') || 'lime'; } catch { return 'lime'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-intensity', intensityId);
    try {
      localStorage.setItem('soma_theme_mode', mode);
      localStorage.setItem('soma_theme_intensity', intensityId);
      localStorage.setItem('soma_theme_accent', accentId);
    } catch {}
    // keep the native status bar in sync with the theme
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
        StatusBar.setStyle({ style: mode === 'dark' ? Style.Dark : Style.Light }).catch(() => {});
        StatusBar.setBackgroundColor({ color: mode === 'dark' ? '#0A0908' : '#F5F6F8' }).catch(() => {});
      }).catch(() => {});
    }
  }, [mode, intensityId, accentId]);

  const t = computeTokens({ mode, intensityId, accentId });

  return (
    <ThemeContext.Provider value={{ mode, setMode, intensityId, setIntensityId, accentId, setAccentId, t }}>
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

// Accent color options. Hex previews shown at both intensities for the picker.
export const ACCENTS = {
  lime:  { id: 'lime',  label: 'Verde',   vivid: 'hsl(72 78% 60%)',  calm: 'hsl(72 36% 66%)'  },
  blue:  { id: 'blue',  label: 'Azul',    vivid: 'hsl(215 100% 68%)', calm: 'hsl(215 58% 74%)' },
  coral: { id: 'coral', label: 'Naranja', vivid: 'hsl(18 100% 58%)',  calm: 'hsl(18 58% 64%)'  },
};
