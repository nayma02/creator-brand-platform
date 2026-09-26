# Accessibility review — September 25, 2026

Target: WCAG 2.0 Level AA, using https://www.w3.org/TR/WCAG20/.
Scope: this local landing page and its local interactions, not linked external guapd pages.

## Changes

- Darkened secondary text while keeping the neutral and pastel palette. Corrected white text on avatar backgrounds and blue mockup buttons.
- Removed the product-panel fade that obscured text.
- Added persistent Pause motion control; it stops automatic headline rotation, reveals the full statement, hides the moving network, and stops decorative animation. OS reduced-motion is also respected.
- Added focus indicators for inputs and keyboard-scrollable table regions, table caption and column headers.
- Mobile navigation moves focus into the menu, cycles within it, and returns focus to the menu button on Escape. Native dialogs retain their keyboard dismissal and focus restoration.
- Dashboard links now focus their destination without an immediate hash jump, then scroll smoothly. Reduced-motion navigation is instant.
- Removed the dashboard entrance movement. Filtering preserves a 277px table area: measured app height was unchanged at 1022px before/after filtering at an 803px viewport.
- Removed the collaborations navigation badge and heading total. Kept meaningful live filter-result announcements.
- Removed the footer Back to top text and the giant wordmark's back-to-top action.

## Verification

- axe-core 4.10.3, tags `wcag2a` and `wcag2aa`: final desktop and 390px mobile scans reported zero automated violations.
- Automated contrast checks still require human adjudication for overlapping illustrative mockup layers, clipped portions of horizontally scrollable regions, and non-text symbol glyphs. These are not reported as passes. The underlying text colors were darkened and the meaningful mockups have image descriptions.
- Verified All/Completed filtering: one completed row, stable table/card height; search has a visible label for assistive technology and live result count.
- Verified menu focus starts at For Creators, Escape closes it and returns to Open menu.
- Verified cookie dialog closes with Escape and returns to its trigger.
- Checked 390px mobile layout: document width equals viewport width. Desktop layout and footer retained their visual hierarchy.
- Production build validates JavaScript syntax and referenced assets.

## Criterion review and limits

| Criteria | Review |
| --- | --- |
| 1.1.1 | Decorative canvas hidden; illustrative screens and chart have text alternatives; social links named. |
| 1.2.1–1.2.5 | No playable audio/video; mock video controls are noninteractive illustration content. |
| 1.3.1–1.3.3 | Landmarks, headings, labeled search, table caption/headers; reading order follows DOM. No sensory-only instructions. |
| 1.4.1–1.4.3 | Status has text labels, no autoplay audio; text contrast corrections and automated checks above. |
| 1.4.4–1.4.5 | Responsive CSS and code-rendered text; full browser 200% text-resize coverage remains a manual follow-up. Logos are text. |
| 2.1.1–2.1.2 | Native buttons/links; scrollable table keyboard focus; menu and dialog can be exited with Escape. |
| 2.2.1–2.2.2 | No time limits; motion pause control added. |
| 2.3.1 | No intentional flashing/strobing content. |
| 2.4.1–2.4.7 | Skip link, document title, focus styles and meaningful names; anchor focus fixed. Single landing page. |
| 3.1.1–3.1.2 | English document language; no extended foreign-language passages. |
| 3.2.1–3.2.4 | Focus does not submit/change page; filtering is explicitly activated; consistent controls. |
| 3.3.1–3.3.4 | No account/payment submissions; search has a label and empty-results feedback. |
| 4.1.1–4.1.2 | Automated semantics checks passed; native control names/states used. |

This is an implementation review, not a conformance certificate. Remaining manual coverage: screen-reader reading and announcement behavior (VoiceOver/NVDA), full 200% browser/text zoom, and adjudication of every incomplete contrast result in all states. Zero automated violations does not establish complete WCAG conformance or AAA conformance.

## Follow-up audit — September 25, 2026

Re-audited against WCAG 2.0 A/AA at 1440×900, 375×812 and 720×450 (the 200% zoom equivalent of 1440). The goal was no visual change for mouse users.

### Fixes

| Criterion | Issue | Fix |
| --- | --- | --- |
| 1.4.3 Contrast | A network node can drift behind the problem statement; where a glyph crossed it, contrast fell to 1.14:1. | Soft white text halo on the statement (`accessibility.css`). Invisible on the white page. Sampled every pixel within 2px of the glyphs over a rendered end-state frame: the worst is now 7.49:1. |
| 2.4.7 Focus visible | The step-1 "Search creators" field sat fully under the brief panel, so keyboard focus landed on an invisible control. | `.product-window:has(:focus-visible)` raises the window above its floating panel, for keyboard focus only. |
| 2.4.7 Focus visible | "Add sample collaboration", "Add sample version" and the two "Next up" rows had focus rings clipped by their container. | Inset focus rings for those controls. |
| 2.4.3 Focus order | Closing a dialog opened from the mobile menu dropped focus to `<body>`, because the menu item that opened it had become inert. | Focus returns to the menu button (`main.js`). |
| 1.4.3 / 1.1.1 | The decorative "⌄" in the dashboard rail was announced by screen readers and measured 2.73:1. | Marked `aria-hidden` and darkened to `#767676`. |

### Verification

- axe-core 4.10.2 with the `wcag2a` and `wcag2aa` tags: zero violations at desktop and mobile, with the mobile menu open, and inside the info and demo dialogs.
- Custom contrast pass that resolves the real stacked background, including gradients and translucent layers, at each text run: 324 runs at desktop and 277 at mobile. None fall below AA; the decorative chevron was fixed.
- Keyboard walk over every focusable element: 113 at desktop, 110 at mobile and at 200% zoom. Each receives `:focus-visible`, shows a ring, is not covered, and its ring is not clipped on two or more sides. The one mobile exception is "Add sample version": the bar is wider than the phone-width stage, so the ring's left and right ends are cut off, but its top and bottom lines stay visible across the bar.
- Real key presses: the skip link appears on the first Tab. The menu takes focus, and Escape returns focus to the menu button. Dialogs take focus and return it to the control that opened them.
- 2.2.2: Pause motion stops the headline rotation, hides the network, and leaves no running animations. It exposes `aria-pressed` and the label "Resume motion".
- 1.4.4: at the 200% equivalent, no text is lost and there is no horizontal page scroll. The only hidden text is the decorative `aria-hidden` footer tagline.
- 4.1.1: no duplicate IDs. 3.1.1 / 2.4.2: `lang="en"` and a meaningful title. Heading order is one h1, then nested h2 to h4 with no skipped levels.

Still manual: screen-reader listening passes (VoiceOver and NVDA) and a physical 200% browser zoom on a real device.

## Change — September 25, 2026: external links disabled, Pause motion removed

- The 10 footer links to other websites (4 social, 6 guapd.com) no longer navigate. Each is `<a role="link" aria-disabled="true">` with no `href`: screen readers announce it as an unavailable link, it is out of the tab order, and it has no hover state. Colors are unchanged. WCAG 1.4.3 exempts inactive components from contrast.
- The Pause motion button was removed at the owner's request. Motion now stops only when the operating system's reduce-motion setting is on.
- **Open issue, 2.2.2 Pause, Stop, Hide (Level A):** the hero headline rotates automatically every 3 seconds, indefinitely, next to other content. Without a user-facing control this criterion is no longer met; the operating-system setting alone does not satisfy it. Compliant options that keep the look: stop the rotation within 5 seconds (for example, Build → Scale → Partner at 2-second steps, ending on Partner), or pause it while the pointer is over the headline or it has keyboard focus, with a control available.
