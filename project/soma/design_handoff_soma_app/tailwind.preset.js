/**
 * SOMA — Tailwind preset.
 *
 * Add to your tailwind.config.js:
 *
 *   module.exports = {
 *     presets: [require('./tailwind.preset.js')],
 *     content: [...],
 *   };
 *
 * Then in your CSS, import tokens.css FIRST so the CSS variables exist
 * before Tailwind tries to consume them via `var(--soma-...)`.
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Neutrals — pull from CSS vars (auto light/dark via data-theme).
        bg:          'var(--soma-bg)',
        surface:     'var(--soma-surface)',
        'surface-2': 'var(--soma-surface-2)',
        fg:          'var(--soma-fg)',
        'fg-muted':  'var(--soma-fg-muted)',
        'fg-faint':  'var(--soma-fg-faint)',
        border:      'var(--soma-border)',
        divider:     'var(--soma-divider)',

        // Accent — pulls from CSS var (auto swaps via data-accent).
        accent:      'var(--soma-accent)',
        'on-accent': 'var(--soma-on-accent)',

        // Semantic — fixed hex (NEVER use as brand).
        ok:          '#4ADE80',
        mid:         '#F5C84B',
        low:         '#EF5350',
      },

      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      borderRadius: {
        // Match the design's actual scale, don't lean on Tailwind's defaults.
        DEFAULT: '12px',
        sm:      '4px',
        md:      '12px',
        lg:      '14px',
        xl:      '18px',
      },

      letterSpacing: {
        // The design's specific tracking values.
        'display-tight': '-0.035em',
        'display':       '-0.025em',
        'mono-wide':     '0.16em',
        'mono-wider':    '0.18em',
      },

      fontSize: {
        // Mono utility labels used everywhere as section heads.
        'mono-xs': ['9.5px', { lineHeight: '1' }],
        'mono-sm': ['10px',  { lineHeight: '1' }],
      },
    },
  },

  plugins: [],
};
