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
