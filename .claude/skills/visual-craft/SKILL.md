---
name: visual-craft
description: Shenks's craft standards for ANY UI/visual/styling/animation/3D work in this repo — precision, aesthetics-first, responsiveness, 3D maximization, proportion over symmetry, clean code. Invoke before building or restyling any component, section, animation, or 3D scene, and when reviewing visual work.
---

# Visual craft standards

Shenks is an explorative developer with strong UI/UX instincts. Every visual change in this repo is judged against these principles — treat them as acceptance criteria, not suggestions.

## 1. Precision coding

- Pixel values, easing curves, and durations are chosen deliberately — no copy-pasted magic numbers. If a value is shared (radius, gap, duration), lift it to a token (`globals.css` theme vars, `constants/`).
- Spacing follows the existing 4px grid (`gap-2/4/6/8`); don't introduce odd one-off values without reason.
- Match existing motion vocabulary: springs via `useTilt` / `useMagneticHover` defaults, reveals via `whileInView` (see `add-section` skill). One section = one consistent easing family.

## 2. Aesthetics first

- A change that works but looks flat is not done. Ask: does it have depth (shadow/gradient/glow), rhythm (stagger), and a focal point?
- Color identity per row/category (Phase 6 direction: "Playful 3D Tilt") — reuse aurora gradients and per-category tints, don't invent new palettes per component.
- Both themes always: every surface must be checked on light AND dark. Anything with a fixed color (white glow, dark canvas backdrop) needs a theme-aware variant or an explicit dark-on-both design (e.g. 3D scene cards).

## 3. Proportion over symmetry

- Prefer balanced asymmetry: 55/45 or 60/40 splits, golden-ratio-ish column weights — not rigid 50/50 grids.
- Visual weight (a 3D scene, a photo) earns the larger share; text gets breathing room. Centering everything is the boring default — offset focal elements deliberately.
- Whitespace is part of the proportion: don't crowd edges; content never touches viewport edges (respect container `max-w-6xl` + padding).

## 4. Responsiveness is non-negotiable

- Design mobile-first, then enhance: every new layout needs explicit answers for base / `sm` / `lg` at minimum.
- Heavy visuals (3D canvases, particle effects) are progressive enhancement — skipped or replaced with a cheap static treatment below `lg` (island pattern, `useMediaQuery`), never just squeezed.
- Verify no horizontal overflow and no clipped/cut-off absolutely-positioned decor at any breakpoint — decorations must be contained (`overflow-hidden` on the section *and* sane transform ranges).

## 5. Maximize 3D visualization

- 3D is a signature of this site — when a section can carry a 3D element (tilt, parallax, WebGL scene), prefer it over a flat alternative, within the perf budget.
- 3D scenes get a dedicated stage: a backdrop card/gradient that makes them readable on both themes, correct `z-index` layering against text (scene must never be overlapped/obscured by sibling sections or swallow pointer events meant for content).
- Perf guardrails still apply: lazy/split the runtime, skip below `lg`, respect `prefers-reduced-motion`, fade — don't translate — on scroll if translation causes clipping.

## 6. Clean code

- Atomic design boundaries hold: atoms → molecules → organisms → sections. No 300-line section files; extract molecules.
- Delete what you replace — no commented-out blocks, no orphaned exports/assets left behind.
- RSC shell + client island pattern for anything interactive (see `refactor-to-rsc`); the LCP element stays server-rendered static HTML.

## Review checklist (run mentally before declaring done)

1. Looks intentional on light AND dark?
2. Mobile, tablet, desktop all resolved (not just "doesn't crash")?
3. Any decor clipped, overflowing, or colliding with siblings while scrolling?
4. Motion respects reduced-motion and uses the shared spring/easing vocabulary?
5. Could a reviewer find a magic number that has no reason? Lift it.
6. Did the change leave dead code behind?
