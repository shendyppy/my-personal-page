# Deep Dive — scroll-story landing page (design spec)

**Date:** 2026-09-11 · **Branch:** `feat/deep-dive` (off `development`) · **Status:** draft for review

## 1. Goal

Rebuild the landing page as a single scroll-driven story. One persistent WebGL scene ("the ocean") sits behind the whole page; scrolling maps to **depth (0 → 4000 m)**. Every chapter is a pinned, scrubbed section whose DOM panels animate in sync with the scene. The reference for the *mechanics* is https://dev.nazyli.com/ (GSAP ScrollTrigger + Lenis + one persistent object + HUD + numbered rail). The *metaphor* is ours: a deep-sea dive, not a space observatory.

Success looks like:

- A visitor scrolls once, top to bottom, and reads the whole profile as one continuous descent. No section feels like a separate page glued on.
- The submersible is visible in every chapter and its position/lighting tells the story (surface → reef → twilight → midnight → seafloor).
- LCP is still the server-rendered H1. Lighthouse mobile ≥ 85, desktop ≥ 95, CLS = 0.
- Project subpages keep working unchanged in content; only their header changes.

## 2. Non-goals

- Certificates chapter (no data today).
- Light theme, accent picker, theme toggle — **removed**, site is dark-only.
- Prisma schema / seed changes. All chapters render from the existing queries.
- Replacing Framer Motion everywhere. It stays for hover springs (`useTilt`, `useMagneticHover`) and small reveals. GSAP owns scroll choreography only.
- A downloadable `.glb` submersible. The sub is procedural (primitives).

## 3. Decisions already made (with Shenks, 2026-09-11)

| Topic | Decision |
| --- | --- |
| Scope | Full journey rebuild of `/` |
| Metaphor | Deep-sea dive; scroll = depth |
| Theme | Dark-only; accent stays lime `#D7FF3E` (reads as bioluminescence); cyan `#3EE0C8` as HUD line colour |
| Chapters | Surface (hero) → Reef (projects) → Twilight (about) → Descent (career) → Midnight (toolbox/sonar) → Seafloor (contact) |
| Playground | Dropped as a section; the sub itself becomes draggable at the seafloor |
| Stack | GSAP 3 + ScrollTrigger (free), Lenis, React Three Fiber (already a dependency) |
| Fonts | Unchanged: Syne (display), Space Grotesk (body), Space Mono (labels) |

## 4. Architecture

Three layers, each with one job:

```
┌─ DiveHud (fixed, z-30) ───────────── top bar · right rail · depth readout ─┐
│ ┌─ DOM chapters (z-10, in normal flow, pinned by ScrollTrigger) ─────────┐ │
│ │  Surface · Reef · Twilight · Descent · Midnight · Seafloor            │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ DiveScene (fixed, z-0, full viewport R3F canvas) ─────────────────────┐ │
│ │  Water · Sunrays · MarineSnow · Submersible · Bioluminescence · Floor  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                 ▲ writes                          ▲ reads
        ScrollTrigger (scrub) ──► depth store ◄── useFrame / HUD
```

### 4.1 Depth store — `src/lib/dive/depth.ts`

A tiny module-level store, no React context, no zustand:

```ts
type DiveState = { progress: number; depth: number; chapter: ChapterId };
export const dive = { get(): DiveState; set(progress): void; subscribe(cb): () => void };
export const depthForProgress = (p: number) => Math.round(p * MAX_DEPTH_M);
export const chapterAt = (depth: number): ChapterId;   // from CHAPTERS ranges
```

- One `ScrollTrigger` over `<main>` (`start: "top top"`, `end: "bottom bottom"`, `scrub: true`) calls `dive.set(self.progress)` in `onUpdate`.
- R3F components read `dive.get()` inside `useFrame` (no re-renders).
- The HUD subscribes and updates two text nodes via refs, throttled to animation frames.
- `depthForProgress` and `chapterAt` are pure and unit-tested.

### 4.2 Chapter registry — `src/constants/dive.ts`

```ts
export const MAX_DEPTH_M = 4000;
export const CHAPTERS = [
  { id: "surface",  index: 0, name: "Surface",  label: "SURFACE",  depth: [0, 200],      beats: 1 },
  { id: "reef",     index: 1, name: "Reef",     label: "DIVE SITES", depth: [200, 1000],  beats: 5 }, // = projects.length
  { id: "twilight", index: 2, name: "Twilight", label: "DIVER RECORD", depth: [1000, 1600], beats: 1.5 },
  { id: "descent",  index: 3, name: "Descent",  label: "DESCENT LOG", depth: [1600, 3000], beats: 3 }, // = experiences.length
  { id: "midnight", index: 4, name: "Midnight", label: "SONAR", depth: [3000, 3800], beats: 1.5 },
  { id: "seafloor", index: 5, name: "Seafloor", label: "SURFACE LINK", depth: [3800, 4000], beats: 1 },
] as const;
```

- `beats` = how many viewport-heights the chapter's pinned stage scrolls. Section height = `beats × 100vh` (`--beats` CSS var), so depth ranges and pin lengths stay proportional. `reef.beats` and `descent.beats` are computed from data length at render time.
- Everything that names a chapter (HUD, rail, scene keyframes, section ids `#dive-<id>`) reads from this array. No string duplication.

### 4.3 Scroll engine — `src/components/organisms/DiveShell.tsx` (client)

- Creates Lenis (`lerp: 0.1`, `smoothWheel: true`) and wires it to GSAP: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`.
- Registers the global depth ScrollTrigger (§4.1) and one **pin** ScrollTrigger per chapter: `trigger: section, pin: ".stage", start: "top top", end: "bottom bottom", scrub: true`. Chapter timelines are attached to that trigger's progress.
- All GSAP setup lives in `useGSAP` (from `@gsap/react`) inside `gsap.matchMedia()` so `(prefers-reduced-motion: reduce)` gets the fallback (§8) and `(max-width: 767px)` gets lighter timelines.
- Exposes `scrollToChapter(id)` (Lenis `scrollTo("#dive-<id>")`) used by the HUD rail and the hero cue.
- Mounted once in `app/page.tsx`, wrapping the chapters. Project pages do **not** mount it.

### 4.4 Scene — `src/components/organisms/DiveScene.tsx` + `src/components/three/dive/*` (client)

Loaded with `next/dynamic(() => import(...), { ssr: false })` so nothing from three/R3F is in the first-paint bundle. `<Canvas>` is `position: fixed; inset: 0; z-index: 0; pointer-events: none` (pointer events re-enabled only in Seafloor, §6.6). `dpr={[1, 1.5]}`, `gl={{ antialias: false, powerPreference: "high-performance" }}`, `frameloop="always"`.

| Component | What it does | Driven by depth |
| --- | --- | --- |
| `Water` | Full-screen background quad with a vertical gradient shader; also sets `scene.fog` | Top/bottom colours lerp through the palette in §7; fog density 0.02 → 0.12 |
| `Sunrays` | 5 tall translucent planes, additive, slow rotation, only while depth < 700 m | Opacity 0.35 → 0 |
| `MarineSnow` | `Points`, 1400 desktop / 500 mobile, drifting up slowly (we descend) | Drift speed scales with scroll velocity; opacity 0.35 → 0.7 |
| `Submersible` | Group: capsule hull, torus viewport ring, 2 lamp discs (emissive accent) + `SpotLight`s, propeller guard torus, antenna line. Idle bob (sin), pointer parallax (±4°) | Position/rotation/scale keyframed per chapter (table below); lamp intensity 0 → 3 |
| `Bioluminescence` | Sparse accent-coloured points with pulse, depth > 2800 m | Count fades in 0 → 120 |
| `Seafloor` | Displaced plane (simplex noise), sub's lamps light it; a one-shot silt puff when the sub lands | Visible from 3600 m; lands at 3950 m |
| `Caustics` *(stretch)* | Animated caustic pattern near the top edge at the surface | Opacity 0.25 → 0, only if perf budget allows |

Submersible keyframes (viewport-relative, x/y in scene units at z = 0; camera fixed at z = 8, fov 40):

| Chapter | x | y | scale | rot.z | Notes |
| --- | --- | --- | --- | --- | --- |
| surface | +2.4 | +0.6 | 1.0 | 0 | Floats right of the H1, lamps off, hull lit by sun |
| reef | +2.8 | −0.2 | 0.9 | −6° | Panels enter from the left; sub cruises past each site (slight x sway per beat) |
| twilight | −2.6 | +0.2 | 1.0 | +4° | Left of the diver record; lamps at 1.2 |
| descent | 0 | slides +1.5 → −1.5 | 0.8 | 0 | Rides down the pressure line behind the entries |
| midnight | 0 | +0.4 | 0.55 | 0 | Small, behind the sonar; lamps 2.5, beams become the main light |
| seafloor | 0 | −1.4 | 1.0 | 0 | Lands on the floor; draggable spin (§6.6) |

Values between keyframes are interpolated on `progress` with `gsap.utils.interpolate` in `useFrame`; easing `power2.inOut` per segment.

## 5. Page layout — `app/page.tsx`

```tsx
<DiveHud />
<DiveScene />
<main id="main-content">
  <DiveShell>                              // client wrapper, receives server-rendered children
    <SurfaceChapter />                     // static SSR H1 (LCP)
    <ReefChapter projects={…} />           // server: getProjects()
    <TwilightChapter about={…} />          // server: getAbout()
    <DescentChapter experiences={…} />     // server: getExperiences()
    <MidnightChapter skills={…} />         // server: getSkills()
    <SeafloorChapter cv={…} />             // server: getAbout().cvInfo
  </DiveShell>
</main>
```

Each `*Chapter` is a server component that fetches and renders static markup; interactive bits are small client islands (same pattern as today). `revalidate = 3600` stays. `PageWrapper`, `Navigation`, `Footer`, `Marquee`, `Hero3D`, `Playground` are deleted from `/`.

## 6. Chapters

Shared anatomy for every chapter:

```html
<section id="dive-reef" data-chapter="reef" class="chapter" style="--beats: 5">
  <div class="stage">          <!-- pinned, 100svh, grid -->
    <header class="chapter-head">03 · CAREER  <span class="chapter-sub">DESCENT LOG</span></header>
    …
  </div>
</section>
```

`chapter-head` = mono 12px, accent index, muted subtitle — the equivalent of nazyli's "02 · EXPERTISE  STAR SYSTEM CATALOG". Content panels use one molecule, `RecordPanel` (hairline border, `bg-card/60` + `backdrop-blur`, mono header row "RECORD NAME ······ REC-01", body rows `label | value`).

### 6.1 Surface — hero (0–200 m)

- Keeps the current H1 markup and type scale (`Software / Engineer.`), the bio paragraph and the status line, rendered as static server HTML. The old particle icosahedron is gone; the sub and sunrays are the visual.
- Replaces "SEE WORK ↓" with the cue `[ SCROLL TO DIVE ]` (mono, blinking bracket), which also calls `scrollToChapter("reef")`.
- Right side: `RecordPanel` "DIVER IDENTIFICATION" — `SINCE <year> · PATH Front-end → Full-stack · DIVE SITES <n> · EXPERIENCE <n>+ yrs · BASE Tangerang Selatan`. `SINCE` and the years figure are derived from the earliest `Experience.period` (`getExperiences()`), `DIVE SITES` from `getProjects().length`; nothing hard-coded except PATH and BASE (constants in `DIVE_COPY`).
- Beat: H1 rises 40 px and fades to 0 over the first 60 % of the scroll; panel drifts up slower (parallax).

### 6.2 Reef — dive sites (200–1000 m) · beats = projects.length

- One beat per project. `DiveSiteRecord` (molecule): `SITE-0n` index, `year` chip, title, description, `tags` chips, `next/image` screenshot inside a rounded porthole mask (4:3 on desktop, 16:10 mobile), CTA **OPEN SITE LOG →** = `<Link href="/projects/[slug]">`.
- Layout: 5/7 split. Record on the left (5), screenshot on the right (7) so the sub (x = +2.8) sits above/behind the image, not over text.
- Timeline per beat *i* (each beat = 1/n of the pin): record *i* enters (`y: 40 → 0, opacity 0 → 1`) during the first 30 %, holds, exits (`y: 0 → −40, opacity → 0`) in the last 20 %; screenshot cross-fades. `snap` to beat boundaries with `directional: true, duration: 0.3` so a lazy scroll settles on a site.
- Mobile: same beats, single column; screenshot above record.

### 6.3 Twilight — diver record (1000–1600 m) · 1.5 beats

- Left (7): `professional_bio` and `current_learning` from `getAbout().aboutSections`, display type at `clamp(28px, 3.4vw, 48px)` for the first sentence, body for the rest.
- Right (5): `RecordPanel` "DIVER RECORD" — `DIVER Shendy Putra Perdana Yohansah · ROLE Software Engineer · FOCUS Front-end · Full-stack · 3D web · INSTRUMENTS React · Next.js · TypeScript · Three.js · Node · Postgres · BASE Tangerang Selatan, ID`. Instruments = first 6 `techStacks` by `order`.
- Portrait: `ProfilePhoto` inside a circular porthole (`rounded-full`, hairline ring, inner glow) at the panel's top-left corner, 96 px; grayscale, colour on hover.
- Timeline: text lines stagger in (`splitText` not needed; per-paragraph), panel slides from the right. Water darkens noticeably here (palette step 2).

### 6.4 Descent — career log (1600–3000 m) · beats = experiences.length

- A vertical hairline "pressure line" in the centre (desktop) / left edge (mobile) with depth ticks every 200 m and the current depth marker that tracks progress.
- Each `Experience` = `DescentLogEntry` (molecule): period (mono, accent when `current`), role, company, `employmentType` badge, 1-line `description`. Entries alternate left/right of the line on desktop (asymmetry, like the reference's mission log); stacked on mobile.
- Timeline: entry *i* fades/slides in as the marker passes its tick; earlier entries dim to 55 % once passed. The sub rides the line (keyframe y slides with progress).

### 6.5 Midnight — sonar (3000–3800 m) · 1.5 beats

- `SonarChart` (organism, client): SVG, 6 concentric rings + crosshair + a sweeping wedge (CSS `animate-sonar-sweep`, 6 s loop). One **blip** per skill category (`Frontend, Backend, Database, DevOps, AI, Project Management`), placed by `blipPosition(index, count, ring)` (pure, tested): evenly spaced angles, ring = category order so the stack reads inside-out. Blip = `<button aria-pressed>` with a mono label on a rotated path (label follows the ring like the reference's "AI PLATFORMS").
- Hover/focus/tap a blip → `SonarReadout` (`RecordPanel` "OBJECT READOUT"): `OBJECT <category>` · `CLASS <label>` · `STACK` = the category's tools as chips with their CDN logos (reuse `ToolboxCell` visuals at 24 px). Readout is `aria-live="polite"`. Default state text: `AWAITING CONTACT · HOVER A BLIP`.
- Timeline: rings draw in (`stroke-dashoffset`), blips pop with stagger; the sweep runs independently of scroll. Water is near-black here; bioluminescence appears in the scene.

### 6.6 Seafloor — contact (3800–4000 m) · 1 beat

- Centre stack: `05 · CONTACT  SURFACE LINK` → display headline **Have something worth building?** → mono sub `LET'S BUILD SOMETHING GOOD.` → channels row `CH-01 GITHUB · CH-02 LINKEDIN · CH-03 EMAIL · CH-04 CALENDLY` (mono links, hairline top border, accent on hover) → `CvDownloadCard` (existing molecule) → footer meta line `© 2026 SHENDY PUTRA PERDANA YOHANSAH · BUILT WITH CURIOSITY IN TANGERANG SELATAN · ↑ BACK TO SURFACE`.
- Scene: sub lands, silt puff once (guarded by a ref so it never replays on scrub-back within 200 m), lamps light the floor. Inside this chapter the canvas gets `pointer-events: auto` on a bounded hit area around the sub; pointer drag spins the sub with inertia (port the maths from `PlaygroundIsland`), cue text `DRAG THE SUB — IT'S YOURS TO SPIN` appears under the channels on hover-capable devices.

## 7. HUD, navigation, theme

**`DiveHud`** (organism, client, `position: fixed`):

- Top-left: `TerminalLogo` (kept) + `· DEEP DIVE`. Top-centre (≥ md): `DIVE 0n · <CHAPTER LABEL>`. Top-right: depth readout `0284 m` (tabular mono, 4 digits) + WIB clock (move `HeroStatus`'s interval into a `useWibClock` hook and reuse).
- Right rail (≥ md): `01 … 06`, active one shows its name to the left (`REEF —— 02`), click → `scrollToChapter`. `aria-current="true"` on the active item; the rail is a `<nav aria-label="Chapters">`.
- Mobile (< md): top bar only, `SHENDY · DIVE` left, depth right. No rail; the chapter head inside each stage carries the orientation.
- Auto-hide is gone (the bar is 40 px and translucent, `backdrop-blur`); it never covers content because every stage reserves 56 px top padding.

**Project pages** (`/projects/[slug]`): get a `DiveHud` variant `mode="surface"` — logo + `← BACK TO DIVE` (links to `/#dive-reef`) + clock. No canvas, no rail. Their content and `ProjectPageContent` are unchanged.

**Theme:** `globals.css` collapses to one palette. `:root` receives today's `.dark` values plus new water tokens; the `.dark` block, the light palette, `@property --accent` transition and the pre-paint `themeInitScript` are removed; `<html class="dark">` is static and `color-scheme: dark`. `ThemeProvider`, `AccentPicker`, `ACCENTS`, `Theme` type: deleted. `--accent` is a plain constant.

Water palette (top → bottom of the viewport at each keyframe; interpolated on depth):

| Depth | Top | Bottom |
| --- | --- | --- |
| 0 m | `#0e4a6e` | `#083352` |
| 1000 m | `#06263f` | `#041a2c` |
| 2000 m | `#03141f` | `#020c14` |
| 3000 m | `#020a10` | `#010508` |
| 4000 m | `#010508` | `#000203` |

Text tokens stay `--foreground #f2f0ea`, `--subtle #b9b7b0`, `--muted-foreground #8a8a85`; `--border` becomes `rgba(242,240,234,.12)` so hairlines read on every water shade; `--hud` = `#3EE0C8`.

## 8. Reduced motion, mobile, performance

- **`prefers-reduced-motion: reduce`** (via `gsap.matchMedia`): Lenis not created; no pins; chapters are normal stacked sections with `min-height: 100svh`; content is visible without scroll triggers (only `opacity` fades on `toggleActions: "play none none none"`); `DiveScene` is not mounted — the `Water` gradient is replicated as a CSS background on `<body>` that steps per chapter with plain scroll-linked CSS (`animation-timeline: scroll()`, progressive; falls back to the 2000 m colours). The sub is absent; nothing is lost content-wise.
- **Mobile (< 768 px):** pins stay (they are the journey), but timelines are simpler (no parallax layers), `MarineSnow` 500 points, `dpr` 1, `Sunrays` 3 planes, no `Caustics`. Touch scrolling through Lenis uses `syncTouch: false` (native momentum) to avoid the rubber-band feel.
- **Budget:** GSAP core + ScrollTrigger ≈ 28 KB gz, `@gsap/react` 1 KB, Lenis ≈ 4 KB — all in the `DiveShell` chunk, loaded after hydration. three/R3F/drei already exist in the bundle graph; the scene chunk is dynamic. Target: first-load JS on `/` not larger than today + 35 KB gz.
- **CLS:** every pinned `section` has its explicit height (`calc(var(--beats) * 100svh)`) in server HTML, so pinning adds no layout shift. `pinSpacing` stays default (true) with heights already reserved; if measurement shows a jump, switch to `pinSpacing: false` and keep the explicit heights.
- **Tab hidden / offscreen:** R3F pauses on `visibilitychange`; Lenis is destroyed on unmount.

## 9. Data

No schema or seed changes. Consumers:

| Chapter | Query | Fields used |
| --- | --- | --- |
| Surface | `getProjects()` (count), `getExperiences()` (earliest `period`) | `length`, `period` |
| Reef | `getProjects()` | `slug, title, description, image, year, tags` |
| Twilight | `getAbout()` | `aboutSections[professional_bio, current_learning]`, `techStacks[0..5]` |
| Descent | `getExperiences()` | `period, title, company, description, employmentType, current` |
| Midnight | `getSkills()` | `name, category, logo` |
| Seafloor | `getAbout().cvInfo` | `title, downloadPath` |

The RSC prefetch + TanStack hydration pattern from `apps/web/AGENTS.md` remains the rule for anything that needs client refetch; these chapters are read-once and render from server props like today's sections.

## 10. Dependencies

Add: `gsap@^3.13`, `@gsap/react@^2`, `lenis@^1.3`. Dev: `vitest@^3` (+ `@vitest/coverage-v8` not needed). Remove: nothing yet (Framer Motion stays; `@splinetool/*` is already unused today and is deleted as part of cleanup, see §11).

## 11. File map

**New**

```
apps/web/src/constants/dive.ts
apps/web/src/lib/dive/depth.ts               (+ depth.test.ts)
apps/web/src/lib/dive/sonar.ts               blipPosition (+ sonar.test.ts)
apps/web/src/hooks/useWibClock.ts
apps/web/src/components/organisms/DiveShell.tsx
apps/web/src/components/organisms/DiveHud.tsx
apps/web/src/components/organisms/DiveScene.tsx
apps/web/src/components/three/dive/{Water,Sunrays,MarineSnow,Submersible,Bioluminescence,Seafloor}.tsx
apps/web/src/components/sections/dive/{Surface,Reef,Twilight,Descent,Midnight,Seafloor}Chapter.tsx
apps/web/src/components/organisms/SonarChart.tsx
apps/web/src/components/molecules/{RecordPanel,DiveSiteRecord,DescentLogEntry,SonarReadout,ScrollCue}.tsx
apps/web/vitest.config.ts
docs/superpowers/specs/2026-09-11-deep-dive-journey-design.md   (this file)
```

**Modified**

```
apps/web/src/app/page.tsx                    new composition (§5)
apps/web/src/app/layout.tsx                  drop ThemeProvider + themeInitScript; static class="dark"; single themeColor
apps/web/src/app/globals.css                 single palette + water tokens + sonar/cue keyframes; delete marquee/firework/etc. keyframes that lose their last consumer
apps/web/src/app/projects/[slug]/page.tsx    header → <DiveHud mode="surface" />
apps/web/src/constants/config.ts             remove ACCENTS/DEFAULT_ACCENT/AccentId/SECTION_IDS; add DIVE_COPY (headline strings)
apps/web/src/types/index.ts                  remove Theme
apps/web/package.json                        deps above; "test": "vitest run"
AGENTS.md, apps/web/AGENTS.md                animation conventions: GSAP owns scroll, Framer owns gestures; dark-only note; chapter registry rule
.claude/skills/visual-craft/SKILL.md         "both themes always" → "dark-only, check on OLED-black and on the 0 m water colour"
```

**Deleted** (with their last consumers)

```
components/sections/{hero3d,projects,about,experiences,skills,playground}.tsx
components/organisms/{Navigation,Footer,PageWrapper,ProjectsScroll,AboutSection,ExperiencesList,Toolbox,ToolboxStage}.tsx
components/molecules/{HeroParticles,HeroBodyIsland,PlaygroundIsland,ProjectTile,ExperienceCard,MagneticEmailButton,AvailabilityStatus}.tsx
components/atoms/{Marquee,AccentPicker,BackToTop}.tsx
app/providers/ThemeProvider.tsx
@splinetool/react-spline, @splinetool/runtime (unused deps) and components/ui/splite.tsx
```

Anything in the deleted list that a project subpage still imports (e.g. `ProjectPagination`, `ImageModal`) is kept. Because `tsc` does not flag unused files, step 5 of the rollout also greps every file under `components/`, `hooks/` and `ui/` for importers and deletes those with none (candidates today: `BioCard`, `LearningQuote`, `LoveCard`, `TechStackCard`, `TechStackItem`, `TraitBadge`, `AboutBackdrop`, `HeroSceneIsland`, `container-scroll-animation`, `shader-background`, `spotlight`, `useTypingEffect`). The list is then verified by `npx tsc --noEmit` + `npm run lint` before the PR.

## 12. Verification

- `npm run lint`, `npm run build` clean.
- `npm test` (Vitest): `depthForProgress`, `chapterAt` (boundaries at 200/1000/1600/3000/3800), `blipPosition` (angles evenly spaced, ring radius by order).
- Manual scroll-through in Chrome at 1440×900 and 390×844 with the checklist: every chapter reachable from the rail; pinned stage never overlaps the next; no horizontal scroll; the sub visible in all six chapters; reduced-motion run shows all content without a canvas.
- Lighthouse (mobile + desktop) on the Vercel preview: performance thresholds from §1, CLS 0, LCP element = H1.
- Screenshot pass with Playwright (script in `scripts/dive-shots.mjs`, same approach used for the reference capture) at six scroll positions, attached to the PR.

## 13. Rollout

1. `feat/deep-dive` from `development`. One PR, but built in the order below so each step is runnable:
   1. Deps + dark-only palette + `DiveHud` + `DiveShell` (Lenis/GSAP) with **placeholder** chapters (heights only) → scroll engine and HUD verified alone.
   2. `DiveScene` with `Water` + `Submersible` keyframes → the descent reads before any content exists.
   3. Chapters in journey order, each with its molecules and timeline.
   4. `MarineSnow`, `Sunrays`, `Bioluminescence`, `Seafloor` + drag.
   5. Cleanup (deleted list), AGENTS/skill updates, Vitest, screenshots, Lighthouse.
2. Vercel preview link reviewed by Shenks before merge to `development`.
3. No `db push`, no seed changes, no env changes.

## 14. Risks and how the design absorbs them

- **Pinning + `overflow-x: clip` on `:root`** — the repo already learned that `overflow-x: hidden` breaks sticky; ScrollTrigger pins use transforms/fixed, not sticky, and `clip` is kept. Verified in step 1 before any content exists.
- **GSAP + React strict mode double-invoke** — all GSAP lives in `useGSAP` with a scope ref; `matchMedia.revert()` on cleanup.
- **Scene overpowering text** — panels have `bg-card/60 + backdrop-blur`, the sub's keyframes are chosen to avoid text columns, and the water's bottom colour is always darker than its top so type on the lower half stays high-contrast.
- **Scroll hijack feeling** — Lenis `lerp 0.1`, no `snap` outside Reef, `syncTouch: false` on touch.
- **Perf on low-end mobile** — DPR 1, particle counts halved, no caustics, and a hard fallback: if `WEBGL` context creation fails, `DiveScene` renders nothing and the CSS gradient body background takes over (same path as reduced motion).
