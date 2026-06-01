// SOMA — Round 4. The 8 favorites refined.
// Each mark lives in viewBox 0 0 80 80 with an outer ELLIPSE (the "O")
// so the mark can literally replace the O letter in the SOMA wordmark.
// All marks accept { color, stroke }. Strokes are tunable so the mark
// scales cleanly into app icons, watch faces, and tiny avatars.

// Outer oval is slightly wider than tall to echo the SOMA "O" letterform
// (Bricolage 800 ExtraBold). 40,40 center · rx 32 · ry 30.
function Oval({ color, stroke = 8 }) {
  return (<ellipse cx="40" cy="40" rx="32" ry="30"
    fill="none" stroke={color} strokeWidth={stroke} />);
}

// F1 — Sonrisa pequeña. Un guiño contenido, no una emoción exagerada.
function F1({ color, stroke = 8 }) {
  return (<g fill="none" strokeLinecap="round">
    <Oval color={color} stroke={stroke} />
    <path d="M 30 40 Q 40 50 50 40" stroke={color} strokeWidth="3.6" />
  </g>);
}

// F2 — Sonrisa grande. La media luna llena la base del óvalo.
function F2({ color, stroke = 8 }) {
  return (<g fill="none" strokeLinecap="round">
    <Oval color={color} stroke={stroke} />
    <path d="M 22 38 Q 40 60 58 38" stroke={color} strokeWidth="5" />
  </g>);
}

// F3 — Chevron doble · filled. Convergencia hacia arriba.
function F3({ color, stroke = 8 }) {
  return (<g>
    <Oval color={color} stroke={stroke} />
    <path d="M 22 38 L 40 22 L 58 38 L 50 38 L 40 30 L 30 38 Z" fill={color} />
    <path d="M 22 56 L 40 40 L 58 56 L 50 56 L 40 48 L 30 56 Z" fill={color} />
  </g>);
}

// F4 — Chevron doble · outline. Mismo gesto, más ligero.
function F4({ color, stroke = 8 }) {
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Oval color={color} stroke={stroke} />
    <polyline points="24,42 40,28 56,42" strokeWidth="4.5" />
    <polyline points="24,54 40,40 56,54" strokeWidth="4.5" />
  </g>);
}

// F5 — Onda / sine. Ritmo continuo. (Trazo grueso para legibilidad pequeña.)
function F5({ color, stroke = 8 }) {
  return (<g fill="none" stroke={color} strokeLinecap="round">
    <Oval color={color} stroke={stroke} />
    <path d="M 16 40 Q 26 22 36 40 T 56 40 T 70 40" strokeWidth="3.4" />
  </g>);
}

// F6 — Pulso / ECG. Línea base + pico cardíaco centrado.
function F6({ color, stroke = 8 }) {
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Oval color={color} stroke={stroke} />
    <polyline points="14,40 28,40 32,30 38,52 44,28 50,52 54,40 66,40"
      strokeWidth="3.2" />
  </g>);
}

// F7 — S-form. Una S geométrica trazada de un solo gesto.
function F7({ color, stroke = 8 }) {
  return (<g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <Oval color={color} stroke={stroke} />
    {/* S as a single bold polyline — top hook, middle slash, bottom hook */}
    <path d="M 54 26 Q 36 26 36 36 Q 36 42 44 42 Q 52 42 52 50 Q 52 58 32 56"
      strokeWidth="4.5" fill="none" />
  </g>);
}

// F8 — X de flechas convergentes. Cuatro arrows apuntando al centro.
function F8({ color, stroke = 8 }) {
  return (<g strokeLinecap="round">
    <Oval color={color} stroke={stroke} />
    {/* shafts */}
    <line x1="22" y1="22" x2="36" y2="36" stroke={color} strokeWidth="3.4" />
    <line x1="58" y1="22" x2="44" y2="36" stroke={color} strokeWidth="3.4" />
    <line x1="22" y1="58" x2="36" y2="44" stroke={color} strokeWidth="3.4" />
    <line x1="58" y1="58" x2="44" y2="44" stroke={color} strokeWidth="3.4" />
    {/* arrowheads at the inner tips, pointing into the center */}
    <polygon points="36,36 30,36 36,30" fill={color} />
    <polygon points="44,36 50,36 44,30" fill={color} />
    <polygon points="36,44 30,44 36,50" fill={color} />
    <polygon points="44,44 50,44 44,50" fill={color} />
  </g>);
}

const FINAL_MARKS = [
  { id: 'F1', Mark: F1, name: 'Sonrisa · sutil',     note: 'el guiño contenido' },
  { id: 'F2', Mark: F2, name: 'Sonrisa · plena',     note: 'la media luna llena' },
  { id: 'F3', Mark: F3, name: 'Chevron · filled',    note: 'convergencia sólida' },
  { id: 'F4', Mark: F4, name: 'Chevron · outline',   note: 'el mismo gesto, ligero' },
  { id: 'F5', Mark: F5, name: 'Onda',                note: 'ritmo continuo' },
  { id: 'F6', Mark: F6, name: 'Pulso',               note: 'el latido en la línea' },
  { id: 'F7', Mark: F7, name: 'S-form',              note: 'la inicial como gesto' },
  { id: 'F8', Mark: F8, name: 'X · convergencia',    note: 'cuatro flechas, un centro' },
];

Object.assign(window, { F1, F2, F3, F4, F5, F6, F7, F8, FINAL_MARKS });
