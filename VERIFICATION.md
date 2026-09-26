# Local verification — 2026-09-25

## Spacing revision

Shortened the statement track from 290svh to 175svh on desktop and 260svh to 155svh on mobile. Statement and closing content now start 24svh from the top (bounded to 96–240px), while each visible stage remains a full viewport. The word reveal finishes within 85% of the shortened sticky range. Production build passed and desktop/mobile spacing was reviewed in the browser.

The initial verification below describes the earlier spacing; its absolute scroll positions are historical.

Production build passed with JavaScript syntax checks and validation of direct HTML asset references. The built output was served at http://localhost:4173 and inspected in the browser.

| Viewport | Result |
| --- | --- |
| 1512 × 900 | Hero height 900; statement starts at y=900; no horizontal overflow; Paper statement matches three text lines. |
| 768 × 1024 | Hero height 1024; statement starts at y=1024; document width 768; header fits. |
| 390 × 844 | Mobile layout visually checked; no horizontal overflow; menu and creator dialog work; statement and closing screen inspected. |
| 320 × 740 | Hero height 740; document width 320; headline, buttons, statement, and network fit. |

Verified:

- Build, Scale, and Partner rotating states appeared during browser checks.
- Computed inactive headline blur is 20px, and active headline blur is 0px.
- Word reveal showed progressively different blur values during scrolling and all eleven words at blur(0px) after completion.
- Desktop full reveal at scroll y=2640; closing section begins 870px below the viewport top, with its text still outside the statement screen.
- Network canvas reports ready and visibly progresses from sparse nodes to the full linked pattern.
- The closing statement and body occupy a separate full-screen section.
- Mobile menu opens, navigation dialog opens and closes, and focusable controls are semantic buttons/links.
- No page JavaScript errors or warnings were reported in inspected runs.

Reduced-motion behavior is implemented in CSS and JavaScript; OS-level reduced-motion emulation was not exercised in this browser session. Real signup, login, and booking integrations are not included because destinations were not supplied. No deployment was performed.

## Collaboration workflow addition

Appended four scrollable chapters after the existing final section, based on the Attio platform showcase inspected live and the supplied screenshot. Each chapter has the exact requested sidebar label and description, plus a custom guapd product illustration made with HTML/CSS. The fictional Forme × Maya Chen campaign is consistent across the brief, offer history, signed contract, revision review, and payment milestones.

Desktop browser review at 1440px confirmed the 25% sticky sidebar, active blue marker, gray borders, layered product panels, and navigation between chapters. Mobile review at 390px confirmed horizontal chapter navigation, readable floating screens, and no document overflow. The existing localhost server serves the updated build. No browser errors or warnings were reported. Product screens are illustrative; sidebar navigation is interactive.

## Creator dashboard and footer — September 25, 2026
- Added a separate “Everything in one place” creator screen after the workflow, with illustrative collaboration, task, and payment data matching the earlier mockups.
- Verified desktop at 1440px and mobile at 390px and 320px. No document-level horizontal overflow; the collaboration table scrolls within its card on mobile.
- Verified completed filter, search results, clearing search, empty state, and cookie-preferences dialog.
- Added Granola-inspired footer composition with screenshot copy, official guapd navigation/social destinations, Archivo 900 wordmark, staggered reveal, pointer response, keyboard response, and reduced-motion support.
- Corrected animation script loading order; confirmed letter reveal completes with opacity 1 and neutral transforms. No new console errors after correction (console retained historical load-order errors).
- Contact links to the official guapd website; this preview does not submit contact forms. Dashboard data is illustrative, not connected to an account.
- Production build passes, including new JavaScript syntax check and asset validation. No deployment performed.

## Accessibility and interaction review
See ACCESSIBILITY.md for scope, fixes, evidence, and remaining manual coverage. Final axe-core 4.10.3 WCAG 2.0 A/AA scans at 1440px and 390px: zero automated violations. Filter height stability and keyboard menu/dialog focus verified. Local preview restored using scripts/serve.mjs --production on port 4173. Temporary audit tooling removed from the production output.

## Interactive product previews - September 26, 2026

The workflow screens now use local state and semantic controls in `src/demo.js` and `src/demo.css`: editable brief fields, sample sharing, contract tabs, review/approval and revision states, payment milestone replay, receipt dialogs, collaboration details/reordering, and selectable earnings months. Drag handles also support arrow keys and Home reset. Workspace/detail switching reserves the stage height and uses short transitions. No backend, signing, file upload or payment operation is performed.

Browser checks covered brief send/edit, pointer and keyboard panel movement, terms tabs, review/revision/undo, milestone replay, receipt Escape dismissal, collaboration reordering and month selection. Desktop and 390px mobile screens were inspected. A production build passed. Accessibility automation is supporting evidence only, not full WCAG conformance certification. Current header/footer destinations include disabled placeholders; earlier notes about linked destinations describe an earlier revision.

A seven-page screenshot comparison is available in `output/pdf/guapd-website-comparison.pdf`, separating desktop, mobile and implementation observations.
