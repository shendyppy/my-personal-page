# apps/web — AGENTS.md

Web-app-specific conventions. Read root `AGENTS.md` first.

---

## Directory map

```
src/
├── app/                       # Next.js App Router
│   ├── api/                   # Route Handlers (kept for mutations + revalidation)
│   ├── projects/[slug]/       # dynamic project detail pages (surface HUD)
│   ├── providers/             # QueryProvider
│   ├── error.tsx, not-found.tsx, layout.tsx, page.tsx, globals.css
├── components/                # atomic design — strict layering
│   ├── atoms/                 # leaf primitives (ChapterHead, ScrollCue, TerminalLogo, …)
│   ├── molecules/             # small composites (RecordPanel, DiveSiteRecord, SonarReadout, …)
│   ├── organisms/             # DiveShell, ChapterFrame, DiveHud, DiveScene, SonarChart, …
│   ├── sections/dive/         # one server component per chapter (Surface … Seafloor)
│   ├── three/dive/            # R3F leaf components — imported only by DiveScene and SubEscort
│   └── ui/                    # shadcn-derived primitives (Button, Card, ImageModal) — prefer wrapping
├── server/queries/            # server-only data access, one file per content domain
├── hooks/                     # client hooks (useDive, useWibClock)
├── lib/                       # utilities (prisma, utils.ts, query-client.ts)
│   └── dive/                  # pure journey maths: depth, pose, lanes, water, sonar, spin, scatter, timelines
├── constants/                 # site config + dive.ts (chapter registry, copy, fallback poses)
└── types/                     # all TypeScript types — mirrors Prisma models
```

> **Atomic layering rule:** imports flow downward only.
> `sections` → `organisms` → `molecules` → `atoms` ↔ `ui`. A `molecule` importing another `molecule` is a smell — extract a shared atom instead.

---

## Data layer

`app/page.tsx` is an async server component: it calls the `server/queries/*` functions in one `Promise.all` and hands the results to the chapter sections as props. Chapters stay server components; only the interactive leaves (`ChapterFrame`, `SonarChart`, the HUD, the scene) are client.

- `/api/*` route handlers call the same `server/queries/*` functions — one source of truth.
- `QueryProvider` is still mounted in the layout for any future client-side refetch or mutation; nothing on the landing page uses `useQuery` today.
- **Don't** add `useEffect(() => { fetch() }, [])` patterns.

---

## Image conventions

- **Format:** WebP only. PNG/JPG are forbidden in `public/assets/img/`.
- **Component:** `next/image` for local assets. Width/height required (or `fill` + parent with `position: relative`). CDN skill logos (Simple Icons) stay a plain `<img>`.
- **Adding new assets:**
  1. Drop the source PNG/JPG/WebP in the right `public/assets/img/<dir>/`.
  2. Run `npm run images:optimize` — converts to `.webp` in place.
  3. Reference the `.webp` path in code/seed.
- **Remote images:** add the host to `next.config.ts` → `images.remotePatterns` before using.

---

## Scroll journey & animation conventions

- **GSAP timelines live only in `lib/dive/timelines.ts`** — one builder per chapter id, targets found through `data-*` attributes. `ChapterFrame` pins the stage and scrubs its builder; `scrubRange` (lib/dive/scrub) decides the range. Anything that must stay visible under reduced motion carries `[data-reveal]`.
- **Every pinned stage is a hard `100svh`.** Nothing clips or scrolls it, so overflow paints over the HUD and the next chapter. Verify new copy at short (1280×720, 844×390) and narrow (360×640) viewports.
- **No Framer Motion.** CSS transitions for hover states, CSS keyframes for loops (blink, sonar sweep, blip ping).
- **Reduced motion** is handled centrally: `ChapterFrame` skips pins and timelines, `DiveScene` renders no canvas, and the reduced-motion block kept last in `globals.css` resets at-rest styles.

---

## Theme & color tokens

- **Dark-only.** One palette on `:root` in `globals.css`; accent is the fixed lime `--accent`, HUD cyan is `--hud`.
- Tokens are exposed as Tailwind colors (`text-accent`, `text-hud`, `text-muted-foreground`, …). **Don't** hardcode hex values in components; add a token first.
- Behind the canvas, `body` steps through water colours per chapter via `<html data-chapter>`.

---

## 3D scene

- `organisms/DiveScene.tsx` dynamic-imports `DiveScene.impl.tsx` with `ssr: false`, so three.js is never in the first-paint bundle.
- One persistent `<Canvas>` for the whole page: `Water`, `Sunrays`, `MarineSnow`, `Bioluminescence`, `Seafloor`, `Submersible`. Components read `dive.get()` inside `useFrame` — never React state per frame.
- **The sub is placed by the layout.** Each chapter marks empty space with `[data-sub-anchor="lane"]`; `DiveShell` measures lanes on load/refresh (`lib/dive/lanes`) and `poseAt` parks the sub there, sized to fit. When you change a chapter layout, keep a lane free or the sub falls back to the head lane.
- Pointer events reach the scene through `eventSource={document.body}`; the sub's hull is the drag hit area.
- The dive opens at the sea surface: `Water` draws sky, coast and waterline, and `waterlineAt` (lib/dive/water) sinks the line off screen over the surface chapter.
- Project pages show the same sub in its own small canvas (`SubEscort`), with a fixed pose.
- The submersible is procedural (no `.glb`). Particle fields use the seeded `scatter` helper — `Math.random` in render fails the React compiler lint.

---

## Common gotchas

- **`window`/`document` in RSC:** will crash the build. If you need them, the component is client.
- **Prisma in client components:** never. Prisma is server-only — import only from `server/queries/*` or `app/api/*` routes.
- **Database content drifts from `prisma/seed.ts`.** Seeding wipes tables; for a one-field fix, update the row in place.
- **Dev server serving stale CSS:** make sure only one `next dev` is running (an orphaned one keeps port 3000). Turbopack's watcher can also miss `globals.css` rewritten by a script; an editor save picks it up.

---

## Verifying changes

```bash
npm run lint && npx tsc --noEmit && npm test
npm run build
```

For UI changes: start `npm run dev` and verify in the browser at several viewports. Type-check passing ≠ feature working.
