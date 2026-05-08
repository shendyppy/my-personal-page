# apps/web — AGENTS.md

Web-app-specific conventions. Read root `AGENTS.md` first.

---

## Directory map

```
src/
├── app/                       # Next.js App Router
│   ├── (routes)               # page.tsx, layout.tsx, route.ts
│   ├── api/                   # Route Handlers (kept for mutations + revalidation)
│   ├── projects/[slug]/       # dynamic project detail pages
│   ├── providers/             # ThemeProvider, QueryProvider
│   ├── error.tsx, not-found.tsx, layout.tsx, page.tsx, globals.css
├── components/                # atomic design — strict layering
│   ├── atoms/                 # leaf primitives (Heading, GradientText, FloatingBlobs, …)
│   ├── molecules/             # small composites of atoms (ProjectCard, SocialButton, …)
│   ├── organisms/             # complex composites (Navigation, Footer, PageWrapper, …)
│   ├── sections/              # page-region organisms (Hero3D, Projects, About, …)
│   └── ui/                    # shadcn-derived primitives (Button, Card, Skeleton, …) — NEVER edit blindly, prefer wrapping
├── server/                    # server-only code: queries, prisma helpers (no "use client" here)
│   └── queries/               # one file per content domain — used by RSC prefetch + API routes
├── hooks/                     # custom client hooks (useResponsive, useTypingEffect, …)
├── lib/                       # client+server utilities (prisma, utils.ts, query-keys.ts)
├── constants/                 # site-wide constants (config, colors, query-keys)
├── types/                     # all TypeScript types — mirrors Prisma models
├── data/                      # static content (hero copy, hardcoded skills fallback)
└── generated/prisma/          # Prisma Client output — DO NOT edit by hand
```

> **Atomic layering rule:** imports flow downward only.
> `sections` → `organisms` → `molecules` → `atoms` ↔ `ui`. A `molecule` importing another `molecule` is a smell — extract a shared atom instead.

---

## Data layer — RSC prefetch + TanStack Query Hydration

This is the **only** sanctioned pattern for fetching content. It eliminates the loading-state-after-scroll UX while keeping the ergonomics of `useQuery` for any client-side refetch / mutation.

### The shape

```tsx
// 1) src/server/queries/projects.ts — server-only data source
import "server-only";
import { prisma } from "@/lib/prisma";

export const getProjects = () =>
  prisma.project.findMany({
    where: { isPublished: true },
    select: { slug: true, title: true, description: true, image: true },
  });

// 2) src/lib/query-keys.ts — single source of truth for cache keys
export const queryKeys = {
  projects: ["projects"] as const,
  experiences: ["experiences"] as const,
  // …
};

// 3) src/app/page.tsx — RSC prefetch + dehydrate
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getProjects } from "@/server/queries/projects";
import { queryKeys } from "@/lib/query-keys";
import { Projects } from "@/components/sections/projects";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.projects,
    queryFn: getProjects,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Projects />
    </HydrationBoundary>
  );
}

// 4) src/components/sections/projects.tsx — client consumer
"use client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export function Projects() {
  const { data: projects } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => fetch("/api/projects").then((r) => r.json()),
  });
  // data is hydrated → renders instantly on first paint, no skeleton
  // useQuery handles refetch / cache invalidation if we ever need it
}
```

### Why this shape (not pure RSC, not pure client)

- **Pure RSC:** no client cache → can't refetch / mutate without a full route refresh.
- **Pure client `useQuery`:** still ships an empty shell + loading state on first paint.
- **Hybrid (this one):** server fetch hydrates the cache → instant render + client-side caching, the best of both.

### Where the API routes fit in

`/api/*` routes still exist, but their role is narrower now:

- **Used for:** client-side refetch (`queryClient.invalidateQueries`), future mutations, occasional client-only data needs.
- **Not used for:** initial page load (RSC handles that directly via Prisma).
- Keep route handlers thin: they call the same `server/queries/*.ts` functions the RSC uses. Single source of truth.

### Don't

- Don't add `useEffect(() => { fetch() }, [])` patterns. If you see one in old code, refactor it.
- Don't pass dehydrated state through props — use `HydrationBoundary`.
- Don't gate prefetch on `isVisible`. RSC pre-renders the whole tree; intersection-observer-driven fetching no longer applies.

---

## Image conventions

- **Format:** WebP only. PNG/JPG are forbidden in `public/assets/img/`.
- **Component:** always `next/image`. Width/height required (or `fill` + parent with `position: relative`).
- **Adding new assets:**
  1. Drop the source PNG/JPG/WebP in the right `public/assets/img/<dir>/`.
  2. Run `npm run images:optimize` — converts to `.webp` in place.
  3. Reference the `.webp` path in code/seed.
- **Hero / above-the-fold:** add `priority`. Below-the-fold: omit (lazy by default).
- **Remote images:** add the host to `next.config.ts` → `images.remotePatterns` before using.

---

## Animation conventions

- **Framer Motion** for: page transitions, scroll-driven (`useScroll`, `useTransform`), gesture (`whileHover`, `whileTap`), layout animations.
- **Tailwind keyframes** for: simple looping decorative animations (firework blobs, gradient shifts, ambient bg motion).
- **CSS transitions** for: hover/focus state changes that don't need spring physics.
- **Reduced motion:** wrap any non-essential animation with `useReducedMotion()` from Framer Motion. Decorative effects must respect the user's OS preference.

---

## Theme & color tokens

- Theme state lives in `app/providers/ThemeProvider.tsx`. Read via `useThemeContext()`.
- Color tokens are CSS variables defined in `globals.css` and exposed as Tailwind colors (`text-primary`, `bg-accent`, `text-muted-foreground`, …).
- **Don't** hardcode hex values in components. If you need a new color, add it to the token set first.
- The gradient identity is `from-accent to-primary` — preserve it; it's part of the brand.

---

## 3D / Hero scene

- `components/sections/hero3d.tsx` is a heavy client component. It's intentionally lazy-loaded.
- `.glb` models live in `public/assets/models/`. They're pre-loaded via `useGLTF.preload(...)` when relevant.
- Adding a model: drop the `.glb`, register a preload, and Suspense-wrap the consumer.
- If you're optimizing payload, consider `meshopt` compression and `<Bvh />` from drei for raycast cost.

---

## Common gotchas

- **`window`/`document` in RSC:** will crash the build. If you need them, the component is client.
- **Prisma in client components:** never. Prisma is server-only — import only from `server/queries/*` or `app/api/*` routes.
- **`Image` from `next/image` with dynamic remote URLs:** must be in `next.config.ts` → `images.remotePatterns`.
- **`useQuery` on the server:** illegal — wrap in a client component, prefetch on server.
- **`generated/prisma/`:** auto-regenerated; never hand-edit, never lint.

---

## Verifying changes

After non-trivial edits:

```bash
npm run lint     # ESLint
npm run build    # type-check + production build
```

For DB schema changes:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed   # if seed data shape changed
```

For UI changes: start `npm run dev` and verify in the browser. Type-check passing ≠ feature working.
