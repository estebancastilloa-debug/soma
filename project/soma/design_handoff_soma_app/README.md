# Handoff · SOMA app redesign

## Overview

SOMA is a holistic fitness + wellness PWA (Cuerpo · Mente · Tiempo). This bundle is the **visual + interaction redesign** of the existing app (React + Vite + Tailwind, currently deployed at `fitnessecastillo.netlify.app`).

The brief: apply a new brand identity and visual system to the existing Fase-0-complete codebase. **No new features in Fase 1** — start with Dashboard as pilot, validate the system, then propagate.

## About these files

The files in `design-files/` are **design references created in HTML** — prototypes that show the intended look and behavior, not production code to copy directly. The HTML uses inline-styled React with Babel-in-the-browser, which is fine for a prototype but is not what should ship.

**The task: recreate these designs in the existing React + Vite + Tailwind codebase**, using its established patterns and component conventions. The JSX in the design files shows the intended structure; rewrite each component using Tailwind classes that consume the tokens defined in `tokens.css` (or the Tailwind preset in `tailwind.preset.js`).

## Fidelity

**High-fidelity.** All colors, typography, spacing, and interaction patterns are final. Reproduce pixel-faithfully:

- Exact hex values are in `tokens.css` and listed below
- Typography is locked: Syne 800 (display), Syne 700 (sub-display), DM Sans 400–700 (body), JetBrains Mono 500–700 (labels/numbers)
- The mark is **Onda (F5)** and the wordmark is **SOMA** in Syne 800 with the mark replacing the O. Lockup primitives are in `design-files/logo-lockups.jsx`.

## Brand decisions (locked)

| | |
|---|---|
| Mark | **Onda (F5)** — sine wave inside an oval that doubles as the O |
| Wordmark font | **Syne 800** |
| Body font | **DM Sans** |
| Numbers / mono labels | **JetBrains Mono** |
| Modes | **Dark (primary) + Light** — single brand, two modes |
| Accents | **4 user-selectable**: Lime, Coral, Indigo, Mono (no accent) |
| Semantic colors | Verde/Amarillo/Rojo — **results only**, never brand |

The accent system is NOT a multi-theme system anymore — it's a single brand color the user can pick (similar to the iOS accent color setting). All four work in both modes.

---

## Design tokens

### Neutrals — light mode

| Token | Hex |
|---|---|
| `bg` | `#F6F5F2` |
| `surface` | `#FFFFFF` |
| `surface-2` | `#ECEAE4` |
| `fg` | `#15120E` |
| `fg-muted` | `#5F5B53` |
| `fg-faint` | `#9A968F` |
| `border` | `#E3E0D9` |
| `divider` | `#ECE9E2` |

### Neutrals — dark mode

| Token | Hex |
|---|---|
| `bg` | `#0A0908` |
| `surface` | `#15130F` |
| `surface-2` | `#1F1C17` |
| `fg` | `#F4F1EC` |
| `fg-muted` | `#9A938A` |
| `fg-faint` | `#6B655B` |
| `border` | `#2A2620` |
| `divider` | `#1F1C17` |

### Accents

| Accent | `accent` | `on-accent` (text on top) | Notes |
|---|---|---|---|
| Lime | `#C8E84A` | `#0A0908` | Performance, electric. Default. |
| Coral | `#FF6B2B` | `#0A0908` | Vital, warm |
| Indigo | `#5B5BD6` | `#FFFFFF` | Calm, technical |
| Mono | (= `fg`) | (= `bg`) | No color. Mark / accents render as foreground neutral. |

### Semantic — for results ONLY

| Token | Hex | Use |
|---|---|---|
| `ok` | `#4ADE80` | Goal hit, PR positive delta |
| `mid` | `#F5C84B` | Partial / warning |
| `low` | `#EF5350` | Missed / negative |

**Rule:** semantic colors NEVER appear as brand or chrome. Only as result indicators (goal status, PR delta arrows, calendar heatmap if it shows hit/missed).

### Spacing / radius (observed from the design)

| Token | Value |
|---|---|
| Card radius | `14px` (small), `18px` (large) |
| Pill radius | `999px` |
| Button radius | `12–14px` |
| Section padding (horizontal) | `20px` |
| Card padding | `12–18px` |
| Tab bar bottom padding | `22px` (safe area) |

### Typography scale

| Use | Font | Weight | Size | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| App headline | Syne | 800 | 26–32px | -0.035em | 1.05 |
| Big number (recovery, kcal) | Syne | 800 | 30–64px | -0.04em | 0.9 |
| Card big-number | Syne | 700 | 22px | -0.025em | 1.1 |
| Body | DM Sans | 400 | 12.5–13px | 0 | 1.5 |
| Body strong | DM Sans | 600 | 13–14px | 0 | 1.4 |
| Mono label (all caps) | JetBrains Mono | 700 | 9.5–10px | 0.16–0.18em | — |
| Mono number | JetBrains Mono | 700 | 11–14px | -0.02em | — |

---

## Logo

The Onda mark is a horizontal sine wave inside an oval (`rx=32, ry=30, viewBox=0 0 80 80`). The oval is dimensioned to **replace the O letter** in SOMA when set in Syne 800.

**Lockups:**

1. **Wordmark with mark** (primary) — `S` + `[mark]` + `MA`. The mark sits on the baseline like a letter. Source: `design-files/logo-lockups.jsx` → `<WordmarkWithMark>`. Use this everywhere you would write "SOMA".

2. **Stacked** — mark above, wordmark below. For square formats (avatar, app icon, social profile).

3. **Inline** — mark left, wordmark right. For headers, email signatures.

4. **Monogram** — just the mark inside a rounded square. For app icon, favicon, watch face.

5. **Solo mark** — the SVG by itself. For loaders, tab-bar active indicators when chrome is tight.

The Onda SVG:

```jsx
function Onda({ color = 'currentColor', stroke = 8 }) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <ellipse cx="40" cy="40" rx="32" ry="30" strokeWidth={stroke} />
      <path d="M 16 40 Q 26 22 36 40 T 56 40 T 70 40" strokeWidth="3.4" />
    </g>
  );
}
```

The inner wave thickness stays at `3.4` regardless of the outer stroke (so the wave still reads at small sizes when the outer oval gets thicker).

---

## Icon system

All icons follow the same line-art language as the mark:

- viewBox `0 0 24 24`
- `fill="none"`, `stroke="currentColor"`
- `strokeWidth` 1.6–2 (1.7 default; 2 for active tab; 2.2–2.4 for emphasis)
- `strokeLinecap="round"`, `strokeLinejoin="round"`

Full set in `design-files/soma-icons.jsx`. The set:

**Navigation:** Home, Train, Eat, Records, Journal, Profile
**Utility:** Plus, ChevronRight, Bell, ArrowUp, ArrowDown
**Status bar:** Signal, Wifi, Battery
**Mood faces (5):** Tired, Neutral, Ok, Good, Great — share a circle base; differences are eyes (lines/dots) and mouth (arc). The 5th adds a chispa above the head, rhyming with the Onda mark's gesture.

The dev should drop the icons into the codebase's existing icon convention (probably a `<Icon name="home"/>` component or per-icon files in `/icons`).

---

## Screens

The demo (`design-files/06-soma-demo.html`) is the canonical reference. There are **5 primary screens** (one per tab) + **1 sub-screen** (Journal):

### 1. Dashboard (Home tab)

**Purpose:** entry point — recovery, today's WOD shortcut, mini widgets, streak.

**Layout (top to bottom):**
1. Header — Wordmark left, avatar circle right (32px)
2. Greeting — mono label ("jue 15 · semana 3 · bloque fuerza") + Syne 800 30px "Buenas, {firstName}."
3. **Recovery widget** — full-width card, `background: accent`, `color: on-accent`. Big number (Syne 800, 64px) + mini sparkline.
4. **2×2 grid of mini widgets** — `surface` cards, 14px radius, 12px padding. Each: mono label, Syne 700 22px main value, body 10.5px sub. Tappable (cursor pointer when navigable).
   - WOD HOY → navigate to Train
   - MACROS → navigate to Eat
   - BITÁCORA → navigate to Journal sub-screen
   - SUEÑO → (no nav, info-only for now)
5. **Streak strip** — "committed club · 12d" + 7-cell weekday grid showing days hit (accent), today (outlined `fg`), and remaining (`surface-2`).

### 2. Entrena (Train tab)

**Purpose:** today's WOD + upcoming.

**Layout:**
1. Header (title "Entrena", sub "Bloque 3 · semana 3 · día 4")
2. **WOD card** — full-width, `background: fg`, `color: bg` (inverted). Contains: mono "wod · benchmark" + modality tag chip (accent bg), Syne 800 44px name ("Fran"), JetBrains Mono 26px "21 — 15 — 9", body description, last-PR divider row.
3. **CTAs** — primary button "Empezar WOD" (accent bg, fg text), 50px square `+` button (surface, border).
4. **Upcoming list** — "siguiente · viernes" mono label, then cards: 36px square tag (M/G/W modality letter, surface-2 bg), name (body 13 600), sub line truncated (body 11).

### 3. Come (Eat tab)

**Purpose:** macros snapshot + meals.

**Layout:**
1. Header (title "Come", sub "{day} · {kcal} kcal de {target}")
2. **Macro card** — `surface`, 18px radius. Left: donut chart (120px) with kcal number inside (Syne 800 22px, no thin spaces — content must fit inside the donut). Right: 3 stacked macro bars (protein/carbs/fat) with values and progress bars.
   - Donut sectors: protein=`accent`, carbs=`fg`, fat=`fg-faint`
3. **Meals list** — "comidas de hoy" mono label + "AGREGAR" right-aligned action. Each meal card: 36px time-tag square + name/time-tag + kcal right-aligned. Cards truncate name with ellipsis.

### 4. Records (Records tab)

**Purpose:** progress, cross-data, PRs.

**Layout:**
1. Header (title "Records", sub "Tu progreso, cruzado.")
2. **Fitness level card** — 56px accent-bg circle holding the Onda mark (color=on-accent). Right: "FITNESS LEVEL" mono + "Jaguar 31" Syne 700 22px + sub "top 18% · México" + chevron.
3. **Heatmap card** — "training days · mayo" + "22 / 31" right. 7×6 grid of aspect-square cells: filled (`accent`), partial (`accent + 'AA'`), miss (`surface-2`). Legend below: chevron-left + 3 swatches (off / half / on) + plus.
4. **PRs list** — "prs · este mes" + rows. Each row: lift name (body 13 600), optional PR badge (accent chip), value (mono 14 700), delta with up-arrow icon in `ok` green.

### 5. Yo (Profile tab)

**Purpose:** identity, inventories, settings.

**Layout:**
1. Header — Wordmark left, "YO" mono label right.
2. **Avatar row** — 64px circle (surface-2, initials Syne 800 24px), name Syne 800 22px, sub body 12 ("desde mar 2024 · 423 días").
3. **Stats row** — 3 equal columns inside `surface` card with dividers: ENTRENOS / STREAK / PRS. Big Syne 800 24px values + mono labels.
4. **Menu** — "tu perfil" label + rows for: Inventario de movimiento, Equipo de gym, Equipo de cocina, Suplementos, Lesiones. Each: title + sub + right chevron.

### 6. Bitácora (Journal — sub-screen, accessed from Dashboard widget)

**Purpose:** quick mood capture + free text entry.

**Layout:**
1. Header with **back chevron** (left-flipped ChevronRight) → returns to Home tab.
2. **Mood scale card** — "energía · ahora" + 5 mood face icons in a row, 1:1 aspect, 12px radius. Selected one gets `background: accent`. Selected face shows a small mono label below ("mal / neutral / ok / bien / pleno").
3. **Today's entry card** — "jueves 15 · mayo" + tag chips. Quote in Syne 700 19px (italic style). Divider, then SOMA AI signature with 28px accent circle.
4. **Floating CTA** — "+ Nueva entrada" pill, `fg` background, `bg` text, positioned above the tab bar.

Active tab on Journal stays `home` (it's a sub-route).

---

## Tab bar (shared across all screens)

5 tabs, equally spaced (`grid-template-columns: repeat(5, 1fr)`):
- Home / Entrena / Come / Records / Yo

Each tab: icon (24px tap target, 22px visual) + mono 8.5px uppercase label below. Active tab: `color: fg`, stroke width 2. Inactive: `color: fg-faint`, stroke width 1.6.

Tab bar is **inside** the screen, `position: absolute; bottom: 0`. Background: `surface`, top border: `divider`. Padding `10px 0 22px` (the 22 is safe area on phones with home indicator).

---

## Phone frame (for the marketing/demo only)

The demo's outer phone shell (`PhoneFrame` in `soma-app.jsx`) is just for the showcase. In the real app you don't need it — the screens render at the device viewport.

---

## State management

**App-level state:**
- `accentId: 'lime' | 'coral' | 'indigo' | 'bone'` — user-selectable from Yo screen
- `mode: 'dark' | 'light'` — user toggle, default `dark`, follow system available
- Both persist to localStorage and apply via `data-theme` + `data-accent` on `<html>`

**Screen-local state:**
- Routing handled by the existing app's router (React Router probably)
- The Dashboard's tappable widgets dispatch route changes
- Journal back chevron pops to `/home`

The demo uses simple `useState` for everything; the production codebase has a more robust router/store — use that.

---

## Migration plan (recommended order)

1. **Install fonts.** Add Syne (400/600/700/800), DM Sans (400/500/600/700), JetBrains Mono (500/600/700) to the existing font loader (probably `index.html` `<link>` or via Tailwind `@import`).

2. **Drop in tokens.** Copy `tokens.css` to `src/styles/tokens.css` and import it from `index.css`. Add the Tailwind preset from `tailwind.preset.js` to `tailwind.config.js` extends.

3. **Theme switching.** Wire a small `<ThemeProvider>` that sets `data-theme` and `data-accent` on `<html>` from localStorage on mount. Add a settings UI in `Yo` (Profile) screen — 4 accent swatches + 2-button mode toggle.

4. **Logo component.** Implement `<Wordmark size={N} />` (just `SOMA` in Syne 800) and `<WordmarkWithMark size={N} />` (with the Onda mark in place of the O). Reference: `design-files/logo-lockups.jsx`. The mark itself is an inline SVG — implement as `<OndaMark color stroke />`.

5. **Icon set.** Port `soma-icons.jsx` into the codebase's existing icon convention. Each icon is a tiny stroke-based SVG that takes `size` and `stroke` props.

6. **Pilot: Dashboard.** Rebuild the Dashboard screen (`design-files/soma-screens.jsx` → `DashboardScreen`) using Tailwind classes. Verify all 4 accents × 2 modes. **This is the validation step — don't move on until Dashboard is solid in all 8 combinations.**

7. **Propagate.** Rebuild Entrena, Come, Records, Yo, Bitácora using the same patterns established in Dashboard.

8. **Polish.** Tab bar transitions (200ms ease), mode-switch crossfade, settings persistence, system-mode follow option.

---

## What's NOT covered (decide later)

- **Onboarding flow** — sign-up, profile setup, inventory builders. Not designed yet.
- **Auth screens** — login, signup. Not designed yet.
- **Movements DB** — the inventory of movement detail pages.
- **Cooking module** — pantry, recipes. Mentioned in brief but not designed.
- **Cycle tracking, mobility body-map, supplement detail, marketplace** — Fase 2.
- **Goals + Habits screens** — Fase 1 module list but not designed yet.

Pull these into Fase 2 once the visual core is shipped.

---

## Files in this bundle

```
design_handoff_soma_app/
├── README.md                 # This file
├── tokens.css                # CSS vars — drop into src/styles/
├── tailwind.preset.js        # Tailwind config preset
└── design-files/             # Original HTML prototype + JSX references
    ├── 06-soma-demo.html     # Open this in a browser — full interactive demo
    ├── soma-app.jsx          # Demo shell (phone frame + controls)
    ├── soma-screens.jsx      # 6 screens — your main reference
    ├── soma-icons.jsx        # Line-art icon set
    ├── soma-tokens.jsx       # Tokens as JS (same values as tokens.css)
    ├── logo-marks-final.jsx  # The Onda mark (and 7 unused alternatives)
    └── logo-lockups.jsx      # WordmarkWithMark, StackedLockup, etc.
```

Open `06-soma-demo.html` first — it's the interactive reference you'll keep coming back to.
