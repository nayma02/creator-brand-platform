# guapd landing page

Responsive implementation of the open Paper design, with the requested Profound motion reference. All runtime assets are local. No deployment has been performed.

## Run

Requires Node.js 20 or newer. There are no npm dependencies to install.

```sh
npm run dev
```

Open http://localhost:4173. The server fails if this port is occupied instead of silently switching ports.

```sh
npm run build
npm run preview
```

## Vercel

Import this directory or its Git repository into Vercel. `vercel.json` configures:

- Framework preset: Other
- Build command: `npm run build`
- Output directory: `dist`

No environment variables or external runtime requests are required.

## Source

- `index.html`: exact Paper copy and semantic page structure.
- `src/styles.css`: Paper typography and colors, viewport sections, responsive layouts.
- `src/main.js`: rotating headline, word reveal, network lifecycle, mobile navigation, local dialogs.
- `src/network.js`: reference network renderer adapted to a standalone ES module.
- `public/assets`: Inter variable font and network atlas.
- `public/vendor`: bundled GSAP and ScrollTrigger, with upstream license headers preserved.
- `reference/paper-export.txt`: direct Paper export used as the baseline.
- `reference/motion.md`: measured reference values and adaptation notes.

## Motion

Build → Scale → Partner changes every three seconds, with a 20px blur and 600ms ease-in-out transition. The word reveal uses the same GSAP settings as the reference: 8px initial blur, .8 opacity, `power3.out`, 1.2 duration, .5 stagger, and `scrub: 1`. All words reveal, including the first two, as requested.

The opening hero occupies at least 100svh. The statement has its own sticky 100svh stage inside a 175svh desktop / 155svh mobile scroll track. The final statement and its description occupy another 100svh section. Reduced-motion mode disables word rotation and removes the extended scroll track.

The canvas preserves the reference simulation seed, topology, springs, depth blur, icon atlas, curved connections, and pointer response. Its output is inverted and hue-adjusted to work on Paper's white background.

## Links to finish before launch

Paper did not supply signup, login, or demo-booking URLs. These buttons currently open local informational dialogs and do not collect or transmit data. Replace the handlers in `src/main.js` with the real destinations when available. The Guide link scrolls to the final section.
