# AYO — Pre-Seed Investor Deck

A premium, presentation-grade pitch deck for **AYO**, the privacy-first AI copilot
for Windows. Built with **React + Vite** and animated with **GSAP**, styled in a
**Swiss / International Typographic** system on paper-white with a living **nebula**
accent.

## Run

```bash
npm install
npm run dev      # local presentation at http://localhost:5173
npm run build    # production build → /dist
npm run preview  # preview the production build
```

## Presenting

- **Navigate:** arrow keys (`←` `→` / `↑` `↓`), `Space`, `PageUp`/`PageDown`
- **Jump:** `Home` (first) · `End` (last) · click the dots on the right
- **Also:** mouse-wheel / trackpad scroll, and swipe on touch devices
- Press `F11` for fullscreen before presenting to investors.

## Structure

| File | Role |
| --- | --- |
| `src/App.jsx` | Deck engine — navigation, transitions, chrome, progress |
| `src/slides.jsx` | All 14 pitch slides + content |
| `src/components/Nebula.jsx` | Animated nebula backdrop |
| `src/hooks/useReveal.js` | Staggered GSAP entrance for each slide |
| `src/styles.css` | Design system: tokens, typography, layout |

## Design notes

- **Swiss system:** strict 12-column grid substrate, mono numbering, generous
  whitespace, `Inter Tight` display + `JetBrains Mono` labels.
- **Nebula accent:** soft drifting color clouds (`violet → blue → magenta → ember`)
  used sparingly so the white stays premium and the content stays legible.
- **Accessibility:** respects `prefers-reduced-motion`; full keyboard control.

## Links

- Website — https://heyayo.com/
- Instagram — https://www.instagram.com/ayosystems
- YouTube — https://www.youtube.com/@AyoSystems
- X — https://x.com/AYO_systems
