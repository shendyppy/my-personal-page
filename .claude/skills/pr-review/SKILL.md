---
name: pr-review
description: Guide for reviewing pull requests in this repo — code quality, visual fidelity, architecture compliance, and testing. Invoke when reviewing a PR, preparing a self-review before pushing, or helping the user write PR descriptions.
---

# PR review standards

Use this skill when reviewing code changes (yours or someone else's), writing PR descriptions, or doing a self-review before pushing.

## PR title

Same format as a commit message — `<type>(<scope>): <subject>`. If the PR contains multiple commits, the title summarizes the overall intent. Max ~70 chars.

```
feat(hero): add mobile desktop-experience nudge with tilt
fix(skills): resolve Three.js canvas resize stuck at 577px
```

## PR description

Use this template:

```markdown
## Summary

One or two sentences describing what this PR does and why.

## Changes

- Bullet list of notable changes, grouped by area if needed
- Focus on the "what" and "why", not line-by-line diffs

## Test plan

- [ ] `npm run build` passes
- [ ] Verified on mobile / tablet / desktop
- [ ] Light and dark theme checked
- [ ] (if applicable) Tested resize behavior
- [ ] (if applicable) Tested reduced-motion
```

## Review checklist

When reviewing a PR (or self-reviewing), check each of these areas:

### Architecture & conventions

- [ ] Atomic design boundaries respected — no sideways imports
- [ ] Server Components by default — `"use client"` only where truly needed
- [ ] No `useEffect + fetch` — TanStack Query pattern used
- [ ] Types mirror Prisma models — `types/index.ts` updated if schema changed
- [ ] No commented-out code in the diff

### Visual & UX

- [ ] Both themes tested — nothing breaks on light or dark
- [ ] Responsive at all breakpoints — mobile / sm / md / lg / xl
- [ ] No horizontal overflow or clipped decorations
- [ ] Motion uses shared vocabulary (Framer springs, Tailwind keyframes)
- [ ] `prefers-reduced-motion` respected for non-essential animations
- [ ] 3D elements lazy-loaded and skipped on mobile

### Code quality

- [ ] No magic numbers — values lifted to tokens or constants
- [ ] No dead imports, unused variables, or orphaned files
- [ ] Naming is descriptive — component names match what they render
- [ ] Props are typed — no `any`, no implicit typing where explicit is clearer

### Performance

- [ ] Heavy dependencies (Three.js, Spline) lazy-loaded with `dynamic()`
- [ ] Images use `next/image` with WebP format
- [ ] No unnecessary re-renders (stable callbacks, proper deps arrays)

### Testing (when applicable)

- [ ] Unit tests cover new utility functions or hooks
- [ ] E2E smoke tests cover critical user flows
- [ ] Test commands documented in the PR description

## Review tone

- Be direct but constructive — explain _why_ something should change
- Distinguish between blocking issues and suggestions (use "nit:" prefix for non-blocking)
- Praise good patterns worth preserving — it reinforces the codebase style
- If a change is good but could be better, say so explicitly: "This works, but consider X for Y reason"

## Testing guidance

This project supports two levels of testing:

### Unit tests (Vitest / Jest)

Good candidates:
- Utility functions (`lib/utils.ts`)
- Custom hooks (`hooks/useTilt.tsx`, `hooks/useResponsive.tsx`)
- Data transformations (filtering, sorting, grouping logic)
- Type guards and validators

### E2E tests (Playwright)

Good candidates:
- Navigation flows (click nav link → scrolls to section)
- Theme toggle (click → classes change, persists on reload)
- Responsive behavior (resize → layout changes correctly)
- 3D scene loading (canvas element appears on desktop, hidden on mobile)
- Mobile nudge card (appears on small viewport, dismissible)

### Test file conventions

```
apps/web/
├── __tests__/          # unit tests (mirrors src/ structure)
│   ├── hooks/
│   ├── lib/
│   └── components/
├── e2e/                # Playwright specs
│   ├── navigation.spec.ts
│   ├── theme.spec.ts
│   └── responsive.spec.ts
└── playwright.config.ts
```
