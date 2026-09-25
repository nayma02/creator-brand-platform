# Reference inspection

Inspected https://www.tryprofound.com/ on 2026-09-25 using the rendered DOM, screenshots at multiple scroll positions, and publicly delivered animation source.

Paper source: Jubilant hill, Page 1, primary 1512 × 2368 artboard. Direct JSX export saved alongside this document. The second artboard was empty.

## Rotation

The reference `RotatingAiPlatforms` component uses a 3000ms interval, 20px inactive blur, opacity 0 → 1, visibility hidden → visible, and a 600ms ease-in-out transition. Rotation pauses outside the viewport, while the document is hidden, or when reduced motion is requested.

## Word reveal

Reference `ScrollTextReveal`: from #505050, blur(8px), opacity .8; to white, blur(0px), opacity 1; duration 1.2; power3.out; stagger .5; scrub 1. The problem section overrides the scroll range to `top top` → `center 20%`.

Adaptations: final color is near-black to match Paper; every word animates instead of keeping the reference's first two words static.

## Network

Preserved the renderer delivered in the reference's network chunk, removing the application-specific module loader and React lifecycle. The new local lifecycle feeds the same renderer scroll progress, viewport and title dimensions, pointer position, reduced-motion state, and elapsed time.

Preserved seed 14842, settings, particles, links, force simulation, GPU shaders, sprite atlas, depth-of-field, and progressive activation. Local atlas source: https://www.tryprofound.com/homepage/problem-statement/atlas.png.

Adaptation: canvas uses `invert(1) hue-rotate(180deg)` and multiply blending on Paper's white surface. This preserves network geometry and motion while changing the dark-background rendering for the supplied light design. The network is decorative; content remains available when WebGL cannot initialize.

## Typography

Inter variable font with optical sizing was necessary to match Paper's line breaks. The older static font files produced different widths and were replaced by the variable font. Desktop hero: 96px/100px, weight 600, -4.6px tracking. Statement: 48px/50px, weight 600, -2.1px tracking. Body: 20px/28px, -.125px tracking.

## User-requested spacing revision

The scroll track was shortened to 175svh desktop / 155svh mobile. The reveal now ends at 85% of the available sticky travel, retaining the blur, stagger, easing, and scrub settings. Content moves upward to reduce the blank interval between full-screen sections.
