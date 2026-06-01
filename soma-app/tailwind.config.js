/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:          'var(--soma-bg)',
        surface:     'var(--soma-surface)',
        s2:          'var(--soma-s2)',
        fg:          'var(--soma-fg)',
        'fg-muted':  'var(--soma-fg-muted)',
        'fg-faint':  'var(--soma-fg-faint)',
        border:      'var(--soma-border)',
        divider:     'var(--soma-divider)',
        accent:      'var(--soma-accent)',
        'on-accent': 'var(--soma-on-accent)',
        train:       'var(--soma-train)',
        eat:         'var(--soma-eat)',
        records:     'var(--soma-records)',
        ok:          '#7BD89A',
        mid:         '#F5C84B',
        low:         '#EF6B5C',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px', md: '12px', lg: '14px', xl: '18px', '2xl': '20px',
        phone: '44px', pill: '999px',
      },
      letterSpacing: {
        display: '-0.035em',
        'mono-wide': '0.16em',
        'mono-wider': '0.18em',
      },
    },
  },
  plugins: [],
};


