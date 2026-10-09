# Mobile demo audit — 9 October 2026

## Changes
- Stack editable brief fields and use 16px inputs on phones.
- Increase mobile action targets, wrap toolbars, stack asset cards and payment totals.
- Keep panels fixed on phones so dragging does not intercept page scrolling. Desktop panel movement remains available; collaboration reordering also has buttons.
- Remove obscured workspace controls from the mobile accessibility tree until the workspace is opened.
- Combine brief search and status filters; show an empty state and make newly added creators selectable.
- Refresh review filters after approval; retain each file's version, revision allowance and feedback independently.
- Show payment progress until both payment milestones are complete.

## Verified in the browser
- Viewport widths: 320, 360, 390, 430, 768 and 1440px. Document width equals viewport width at each size.
- Mobile brief editing, send/edit toggle, combined search/filter, empty result, adding and selecting a creator.
- Contract dialog and all four workspace tabs.
- Review approval removes the file from In review; selecting the other file updates its filename/version; adding its next version updates the correct file. Preview play/pause and revision limit checked.
- Payment replay from unpaid through partial to fully paid; receipt content matches all three states.
- Dashboard search plus status filter, empty state, collaboration detail dialog, reorder buttons and monthly earnings selection.
- Workflow chapter navigation and workspace/detail switching.
- 320px receipt and 390px dashboard screenshots inspected; mobile input font size verified as 16px.
- No browser error-level log entries during the checks. Production build and git whitespace check pass.

## Scope
Browser viewport checks, not physical iOS/Android device certification or an exhaustive WCAG audit. Demo actions use local sample state; payment, signing, upload and account backends are not part of this landing page.

Local visual evidence: output/mobile-audit/receipt-320.png and output/mobile-audit/dashboard-390.png (ignored generated files).

## Follow-up — 10 October 2026
A phone screenshot exposed a visual defect missed by the earlier width checks: the oversized background workspace remained visible behind the detail sheet. Mobile previews now display one complete surface at a time. Controls participate in normal layout instead of absolute positioning, with a consistent 16px gap above either surface. Removed the desktop fade, drag marker and redundant reset control on phones.

Rechecked all four chapters in both modes at 320, 360, 390 and 430px: no page overflow, each active workspace fits its container, no overlap with the controls, and detail sheets hide in workspace mode. Browser error log empty. Desktop styles remain outside this mobile-only override.
