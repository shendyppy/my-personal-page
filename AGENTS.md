# AGENTS.md — Working with this repo as an AI assistant

This file tells AI coding agents (Claude Code, Cursor, Copilot, etc.) the **minimum context** needed to make safe, idiomatic changes here. Read this **first**, then read `apps/web/AGENTS.md` for web-app specifics.

> **Convention:** when both `AGENTS.md` and a tool-specific file (e.g. `CLAUDE.md`) exist, AGENTS.md is the single source of truth. Tool-specific files only contain harness/preference settings, not project knowledge.

---

## What this repo is

Personal portfolio of **Shendy Putra Perdana Yohansah** (https://shendyppy.vercel.app). Public-facing landing page + per-project deep-dive subpages, backed by a small Postgres CMS-ish schema for easy content updates without redeploys.

This is an **npm-workspaces monorepo** with one app today (`apps/web`) and room to grow (`apps/api`, `packages/ui`, etc.).

```
my-personal-page/
├── AGENTS.md                  ← you are here
├── package.json               ← workspace root, scripts proxy to apps/web
├── apps/
│   └── web/                   ← Next.js 15 App Router (RSC + TanStack Query Hydration)
│       ├── AGENTS.md          ← web-app-specific conventions
│       ├── prisma/            ← schema + seed
│       └── src/
└── .claude/
    ├── settings.json          ← shared harness settings (committed)
    ├── settings.local.json    ← per-user overrides (gitignored)
    └── skills/                ← project-specific Claude skills
```

---

## Tech stack at a glance

| Layer       | Choice                                            | Notes                                                                |
| ----------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| Runtime     | Node ≥ 18.18                                      | enforced via `engines` in root `package.json`                        |
| Framework   | Next.js 15 (App Router, Turbopack)                | RSC-first, client only when needed                                   |
| UI          | React 19 + Tailwind CSS 4 + Radix primitives      | atomic design (`atoms/molecules/organisms/sections`)                 |
| Data fetch  | **RSC prefetch + `@tanstack/react-query` hydrate** | never use raw `useEffect + fetch` in new code                        |
| ORM / DB    | Prisma 6 + PostgreSQL (Neon)                      | content models: Project, Experience, Skill, AboutSection, etc.       |
| 3D          | Three.js + `@react-three/fiber` + `drei`          | `.glb` models in `apps/web/public/assets/models/`                    |
| Animation   | Framer Motion + Tailwind keyframes                | prefer Framer for component animations, Tailwind for static motion   |
| Images      | `next/image` + WebP-only assets                   | converted via `npm run images:optimize` (sharp script)               |
| Analytics   | `@vercel/analytics`                               | already wired in `app/layout.tsx`                                    |

---

## How to run things

All scripts can be invoked from **repo root** via workspace proxy — you almost never need to `cd apps/web`:

```bash
npm install                     # install all workspaces
npm run dev                     # start Next.js dev server (Turbopack)
npm run build                   # production build
npm run lint                    # ESLint across web app
npm run db:generate             # prisma generate
npm run db:migrate              # prisma migrate dev
npm run db:studio               # open Prisma Studio
npm run db:seed                 # seed Postgres with portfolio content
npm run images:optimize         # WebP conversion (idempotent; safe to re-run)
```

If you need to invoke something not listed, prefer adding a script to `apps/web/package.json` and a proxy in root `package.json` over telling the user to `cd`.

---

## Branching & PR conventions

- **Default branch:** `development` (everything merges here; production deploys from this branch via Vercel).
- **Feature branches:** `feat/<short-kebab-description>` per phase or feature. One PR per branch back to `development`.
- **Commit prefix:** `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`. Subject in imperative present tense ("add X", not "added X").
- **PRs:** title under 70 chars; body should have a short Summary + Test plan checklist.
- **Never** commit, push, or open a PR without the user explicitly asking.
- **Never** force-push to `development` or `main`.

---

## Hard rules — do these and don't ask

1. **Use the dedicated tools.** When you're an AI agent: `Read` not `cat`, `Edit` not `sed`, `Glob` not `find`, `Grep` not `grep`. Saves tokens, surfaces nicer diffs to the user.
2. **Server Components by default.** Add `"use client"` only when the file actually uses hooks, browser APIs, or event handlers. Co-locate client logic in the smallest possible leaf component.
3. **No raw `useEffect` for data fetching.** Use TanStack Query (`useQuery`/`useSuspenseQuery`) on the client and `prefetchQuery` in the matching RSC. The pattern is documented in `apps/web/AGENTS.md`.
4. **Images are always WebP and always `next/image`.** No `<img>`, no PNG/JPG checked into `public/`. Run `npm run images:optimize` after adding new assets.
5. **Atomic design boundary discipline.** A `molecule` may import `atoms/` and `ui/` only. An `organism` may import everything below it. A `section` is an organism that owns layout for a page region. Never import sideways.
6. **Type-safe content.** All content types live in `apps/web/src/types/index.ts` and mirror Prisma models. If you change `schema.prisma`, run `npm run db:generate` and update `types/index.ts` in the same PR.
7. **Don't break the seed.** `prisma/seed.ts` is the source of truth for development content. If you add a new model or field, extend the seed.
8. **No commented-out code in commits.** Delete it; git history remembers.

---

## Where to look first

| If you're touching…           | Read first                                                  |
| ----------------------------- | ----------------------------------------------------------- |
| Visual / layout               | `apps/web/src/app/globals.css` + `components/sections/*`    |
| A new content type            | `apps/web/prisma/schema.prisma` + `src/types/index.ts`      |
| Data fetching                 | `apps/web/AGENTS.md` → "Data layer"                         |
| Theme / colors                | `app/providers/ThemeProvider.tsx` + `constants/colors.ts`   |
| 3D scene                      | `components/sections/hero3d.tsx` + `public/assets/models/`  |
| Adding a Claude skill         | `.claude/skills/` + Anthropic's skills docs                 |

---

## When in doubt

- Ask the user before destructive operations (deleting files, dropping DB tables, force-pushing, changing CI).
- Prefer one focused PR over a sprawling one. If a task naturally splits, propose phases first.
- Surface trade-offs explicitly — Shenks values understanding the "why" behind a choice over a polished but opaque result.
