---
name: add-section
description: Add a brand-new page section (Hero variant, Testimonials, Blog teaser, etc.) wired into the landing page with proper atomic decomposition + animation hooks. Use when Shenks asks to add a new visible block to the landing page.
---

# Adding a new landing-page section

## Decision tree

- **Backed by DB content?** → also follow the `add-content-model` skill first, then come back here for the UI piece.
- **Static content?** → put copy in `src/data/<section>.ts` and skip the DB layer.
- **Reuses existing data?** → just add the component; pull data via existing `queryKeys.*`.

## Component layout

```
src/components/sections/<name>.tsx              ← orchestrator (client)
src/components/molecules/<Name>Card.tsx         ← if section has repeated cards
src/components/atoms/<Name>Badge.tsx            ← any reusable primitive that doesn't fit existing atoms
```

Skeleton:

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { GradientHeading } from "@/components/atoms/GradientHeading";

export function NewSection() {
  const { data } = useQuery({ queryKey: queryKeys.<x>, queryFn: () => fetch("/api/<x>").then(r => r.json()) });
  const reduceMotion = useReducedMotion();

  return (
    <SectionContainer id="<x>">
      <GradientHeading>Title</GradientHeading>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* content */}
      </motion.div>
    </SectionContainer>
  );
}
```

## Wire-up checklist

1. Add the section to `app/page.tsx` (between existing sections).
2. If DB-backed, add `prefetchQuery` to `app/page.tsx`.
3. Register section ID in `constants/config.ts` → `SECTION_IDS` so it's reachable via `scrollToSection()`.
4. If it should appear in `Navigation`, add a nav link.
5. Add a content rendering check in `npm run dev`.

## Animation conventions to respect

- **Wrap section reveal** with Framer Motion `whileInView` — never use the legacy `useIntersectionObserver` + Tailwind `opacity-0/translate-y-8` toggle (that's the old pattern).
- **Respect reduced motion** via `useReducedMotion()` for any non-essential motion.
- **Decorative ambient motion** (floating blobs, gradient shifts) stays in Tailwind keyframes — they're already cheap.
