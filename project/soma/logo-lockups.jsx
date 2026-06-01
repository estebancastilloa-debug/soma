// SOMA — Wordmark + lockup primitives.
// The wordmark is "SOMA" set in the chosen display font. The mark
// either sits BESIDE the wordmark (stacked / inline) or REPLACES the O.

const FONT_OPTIONS = {
  bricolage: {
    family: 'Bricolage Grotesque',
    weight: 800,
    tracking: '-0.025em',
    stretch: 'normal',
    label: 'Bricolage 800',
  },
  bricolageNarrow: {
    family: 'Bricolage Grotesque',
    weight: 800,
    tracking: '-0.02em',
    stretch: '75%',
    label: 'Bricolage 800 · narrow',
  },
  hanken: {
    family: 'Hanken Grotesk',
    weight: 900,
    tracking: '-0.035em',
    stretch: 'normal',
    label: 'Hanken 900',
  },
  syne: {
    family: 'Syne',
    weight: 800,
    tracking: '-0.045em',
    stretch: 'normal',
    label: 'Syne 800',
  },
  syne700: {
    family: 'Syne',
    weight: 700,
    tracking: '-0.025em',
    stretch: 'normal',
    label: 'Syne 700',
  },
  archivo: {
    family: 'Archivo Black',
    weight: 400,
    tracking: '-0.025em',
    stretch: 'normal',
    label: 'Archivo Black',
  },
};

// Plain wordmark — uses the actual O letter.
function Wordmark({ font, size = 84, color = '#0A0A0A' }) {
  const f = FONT_OPTIONS[font] || FONT_OPTIONS.bricolage;
  return (
    <div style={{
      fontFamily: `'${f.family}', sans-serif`,
      fontWeight: f.weight,
      letterSpacing: f.tracking,
      fontStretch: f.stretch,
      fontSize: size,
      lineHeight: 1,
      color,
      whiteSpace: 'nowrap',
    }}>SOMA</div>
  );
}

// Mark replaces the O. The mark's SVG ellipse becomes the O's counter shape.
// `size` here is the visual cap-height of the SOMA wordmark.
function WordmarkWithMark({ font, Mark, size = 84, color = '#0A0A0A' }) {
  const f = FONT_OPTIONS[font] || FONT_OPTIONS.bricolage;
  // The SVG mark sits between S and MA. Sizing: the mark visually is the O.
  // For most grotesques the O is ~0.72 × cap-height. We size the SVG to that
  // and nudge it down slightly so it sits on the baseline like a letter.
  const oSize = size * 0.78;
  const baselineNudge = size * 0.005;
  const sideOffset = size * 0.005;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      fontFamily: `'${f.family}', sans-serif`,
      fontWeight: f.weight,
      letterSpacing: f.tracking,
      fontStretch: f.stretch,
      fontSize: size,
      lineHeight: 1,
      color,
      whiteSpace: 'nowrap',
    }}>
      <span>S</span>
      <span style={{
        display: 'inline-block',
        width: oSize,
        height: oSize,
        verticalAlign: 'baseline',
        transform: `translateY(${baselineNudge}px)`,
        marginLeft: -sideOffset,
        marginRight: -sideOffset,
        flexShrink: 0,
      }}>
        <svg width={oSize} height={oSize} viewBox="0 0 80 80"
          style={{ display: 'block' }}>
          <Mark color={color} stroke={9} />
        </svg>
      </span>
      <span>MA</span>
    </div>
  );
}

// Stacked lockup: mark above, wordmark below.
function StackedLockup({ font, Mark, markSize = 96, wordSize = 56, color = '#0A0A0A' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: wordSize * 0.32 }}>
      <svg width={markSize} height={markSize} viewBox="0 0 80 80"
        style={{ display: 'block' }}>
        <Mark color={color} stroke={8} />
      </svg>
      <Wordmark font={font} size={wordSize} color={color} />
    </div>
  );
}

// Inline lockup: mark on the left, wordmark on the right.
function InlineLockup({ font, Mark, size = 64, color = '#0A0A0A' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.28 }}>
      <svg width={size * 1.05} height={size * 1.05} viewBox="0 0 80 80"
        style={{ display: 'block' }}>
        <Mark color={color} stroke={8} />
      </svg>
      <Wordmark font={font} size={size} color={color} />
    </div>
  );
}

// Monogram: just the mark inside a square (for app icons etc.).
function Monogram({ Mark, size = 96, bg = '#0A0A0A', fg = '#FFFFFF', radius = 0.22 }) {
  return (
    <div style={{
      width: size, height: size, background: bg, borderRadius: size * radius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 80 80"
        style={{ display: 'block' }}>
        <Mark color={fg} stroke={7} />
      </svg>
    </div>
  );
}

Object.assign(window, {
  FONT_OPTIONS, Wordmark, WordmarkWithMark, StackedLockup, InlineLockup, Monogram,
});
