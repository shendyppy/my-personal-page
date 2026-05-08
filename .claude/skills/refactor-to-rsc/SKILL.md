---
name: refactor-to-rsc
description: Refactor a legacy "useState + useEffect + fetch" client section to the project's RSC prefetch + TanStack Query Hydration pattern. Use when modernizing existing sections or when Shenks reports a section feels slow on first paint.
---

# Refactor a section to RSC + TanStack Query Hydration

Legacy pattern (the bad one — what to remove):

```tsx
"use client";
const [data, setData] = useState();
const [loading, setLoading] = useState(true);
useEffect(() => {
  if (!isVisible) return;
  fetch("/api/foo").then(r => r.json()).then(setData).finally(() => setLoading(false));
}, [isVisible]);
if (loading) return <Skeleton />;
```

Target pattern (the good one):

```tsx
// page.tsx (server)
const qc = new QueryClient();
await qc.prefetchQuery({ queryKey: queryKeys.foo, queryFn: getFoo });
<HydrationBoundary state={dehydrate(qc)}><Foo /></HydrationBoundary>

// foo.tsx (client)
"use client";
const { data } = useQuery({ queryKey: queryKeys.foo, queryFn: () => fetch("/api/foo").then(r => r.json()) });
```

## Steps

1. **Identify the section's data needs.** Read the legacy `useEffect` to find: endpoint hit, response shape mapping, derived state.
2. **Move the Prisma call to a server query.** Create or update `apps/web/src/server/queries/<domain>.ts`. Mirror the response-shape mapping that the old `useEffect` did inline — do it server-side now.
3. **Slim the API route.** `apps/web/src/app/api/<domain>/route.ts` should `return NextResponse.json(await get<Domain>())` — no inline mapping, no Prisma calls.
4. **Add a query key** to `lib/query-keys.ts`.
5. **Refactor the section component:**
   - Drop `useState` for data.
   - Drop `useEffect`.
   - Drop the `loading` branch entirely (data is hydrated → renders synchronously).
   - Drop the intersection-observer-driven fetch gating.
   - Keep `useIntersectionObserver` only if it's used for **animation** (e.g. `opacity-0 translate-y-8` reveal); strip it if its only purpose was gating fetch.
   - Replace fetch with `useQuery({ queryKey: queryKeys.<x>, queryFn: () => fetch(...).then(...) })`.
6. **Wire the page.** Add `prefetchQuery` + `HydrationBoundary` in the `page.tsx` that hosts the section.
7. **Verify:** open Network tab in dev — the section's `/api/*` request should NOT fire on initial load (data already hydrated). It should only fire on explicit `invalidateQueries` or when the user lands on the page after a stale time has passed.

## Don'ts

- Don't keep the loading skeleton "just in case" — if it never renders, delete it. The skeleton stays only if the query is explicitly client-only (e.g. user-triggered).
- Don't mix in Suspense + `useSuspenseQuery` unless you've added an `error.tsx` and `loading.tsx` boundary; that's a future evolution but not required for this refactor.
- Don't forget to handle the `data` being possibly `undefined` on the type level if the queryFn can fail — TanStack Query's types reflect that.
