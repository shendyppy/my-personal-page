---
name: add-content-model
description: End-to-end workflow for adding a new content type (Prisma model + types + seed + RSC query + API route + section component). Use this when Shenks asks to add a new section/feature backed by DB content (e.g. "add a Testimonials section", "add a Blog model").
---

# Adding a new content model

When a new content type is requested, walk through these steps **in order**. Don't skip — every layer depends on the previous.

## 1. Prisma schema

Edit `apps/web/prisma/schema.prisma`. Match existing model conventions:

- `id String @id @default(cuid())`
- `createdAt` / `updatedAt` timestamps
- `order Int @default(0)` if the records are user-orderable
- `isPublished Boolean @default(true)` if drafts are a thing
- Image fields are `String` paths to `/assets/img/...` (WebP only)

Then:

```bash
npm run db:generate
npm run db:migrate -- --name add_<model_name>
```

## 2. TypeScript types

Add the shape to `apps/web/src/types/index.ts`. Keep it close to the Prisma model but trimmed to what the UI needs (no internal DB fields like `id`/timestamps unless the UI uses them).

## 3. Server query

Create `apps/web/src/server/queries/<model-plural>.ts`:

```ts
import "server-only";
import { prisma } from "@/lib/prisma";

export const get<ModelPlural> = () =>
  prisma.<modelLower>.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { /* only what the UI needs */ },
  });
```

## 4. Query key

Register the cache key in `apps/web/src/lib/query-keys.ts`:

```ts
export const queryKeys = {
  // …existing
  <modelPlural>: ["<modelPlural>"] as const,
};
```

## 5. API route (optional but recommended)

Create `apps/web/src/app/api/<model-plural>/route.ts` that calls the same `server/queries/*` function:

```ts
import { NextResponse } from "next/server";
import { get<ModelPlural> } from "@/server/queries/<model-plural>";

export const GET = async () => NextResponse.json(await get<ModelPlural>());
```

The RSC and the API route must call the **same** query function — never duplicate Prisma calls.

## 6. Seed data

Add seed entries in `apps/web/prisma/seed.ts`. Use realistic content — Shenks uses the seed for local dev.

## 7. Page wiring

In the relevant `page.tsx`:

```tsx
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: queryKeys.<modelPlural>,
  queryFn: get<ModelPlural>,
});
return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <New<Section /> {/* client component using useQuery */}
  </HydrationBoundary>
);
```

## 8. Section component

Create `apps/web/src/components/sections/<name>.tsx` (client component). Use `useQuery` with the same key. Do **not** add a loading state — hydrated data renders synchronously.

For atomic decomposition: extract repeating row/card to `molecules/<Name>Card.tsx`, primitive bits (heading, badge, dot) to `atoms/`.

## 9. Verification

```bash
npm run lint
npm run build
npm run dev   # smoke-test in browser
```
