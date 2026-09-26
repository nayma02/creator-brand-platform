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

## Collaboration workflow showcase

The final `#workflow` section contains four scrollable product chapters, with a sticky sidebar and a horizontal navigation bar on mobile. The exact supplied copy is in `index.html`; visual styling is in `src/workflow.css`; sidebar behavior is at the end of `src/main.js`. Product screens are HTML/CSS illustrations using fictional campaign data, so they remain editable without replacing image files. The illustrations are not a connected campaign-management backend.

The final creator dashboard and oversized footer are implemented in `src/ending.css` and `src/ending.js`, with markup in `index.html`. The dashboard uses illustrative data; search and status filters work locally. Footer navigation points to official guapd pages. The Archivo 900 footer font is bundled in `public/assets/archivo-900.ttf`.

## Cookie consent

`src/consent.js` and `src/consent.css` handle cookie consent. No optional cookie or script runs until the visitor opts in.

- **Adding an optional tool:** add it as an inert placeholder, and it is activated only when its category is granted:
  `<script type="text/plain" data-consent="analytics" data-src="https://example.com/tag.js"></script>`
  Inline scripts work the same way; put the code inside the tag instead of using `data-src`.
- **Categories:** edit `CONFIG.categories` in `consent.js`. List the cookie-name patterns each category sets, so they are deleted when consent is withdrawn. Bump `CONFIG.version` whenever categories or purposes change, so visitors are asked again.
- **Stored choice:** one first-party, strictly necessary cookie, `guapd_consent` (SameSite=Lax, `Secure` on HTTPS), kept for 180 days.
- **Global Privacy Control:** browsers that send the signal get optional cookies off automatically, with no banner.
- **API:** `window.guapdConsent.granted('analytics')`, `window.guapdConsent.open()`, and a `guapd:consent` event on `document` whenever the choice changes.
- **No third-party requests:** Archivo is self-hosted (`public/assets/archivo-600-latin.woff2`) instead of loaded from Google Fonts, so no visitor data goes to another server by default.

## Performance

Lighthouse 12 on the production build: **99** performance on mobile and **100** on desktop, with 100 for accessibility and SEO on both. The design is unchanged; the gains come from delivery.

- **CSS is inlined.** `npm run build` inlines every stylesheet into `dist/index.html`, so there are no render-blocking CSS requests. Keep editing the separate files in `src/`.
- **Below-the-fold work waits for the visitor.** GSAP, the WebGL network and the interactive product demos load on the first scroll, touch, click or key press. Until then, the problem statement shows its starting reveal frame via the `motion-pending` class.
- **Offscreen sections skip rendering.** The workflow, dashboard and footer use `content-visibility: auto`, so the browser skips their layout until they approach the screen.
- **Production server behaves like the host.** `npm run preview` now serves brotli or gzip compression with cacheable headers, matching Vercel.
- **Known limit.** Best practices is 96 on mobile only because Lighthouse counts the small 9–11px labels inside the product mockups as "illegible font sizes". Fixing that would mean enlarging the mockup text, which changes the design.
