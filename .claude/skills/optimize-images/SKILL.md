---
name: optimize-images
description: Convert PNG/JPG assets to WebP and update all string references. Use when Shenks adds new image assets or asks to optimize / re-process the public/assets/img/ folder.
---

# Image optimization workflow

This project enforces **WebP-only** images in `public/assets/img/`. There is a one-shot script at `apps/web/scripts/optimize-images.mjs` that handles conversion idempotently.

## Steps

1. **Drop new sources** in the right `apps/web/public/assets/img/<dir>/`. PNG, JPG, or WebP all OK as input.
2. **Run the script** from repo root:
   ```bash
   npm run images:optimize
   ```
   This walks `public/assets/img/`, converts every PNG/JPG to `.webp` (quality 82, near-lossless for screenshots), and **deletes the original** PNG/JPG. Existing `.webp` files are left alone.
3. **Update references** — any code/seed string that pointed at `.png` or `.jpg` must now point at `.webp`. Use Grep:
   ```
   Grep("\\.(png|jpg|jpeg)\b", path: "apps/web/src", output_mode: "content")
   Grep("\\.(png|jpg|jpeg)\b", path: "apps/web/prisma", output_mode: "content")
   ```
   Replace each match with `.webp`. Watch for these specific spots:
   - `prisma/seed.ts` (CV preview, tech stacks, loves, projects)
   - `src/data/*.ts`
   - `src/constants/config.ts` (`SITE_CONFIG.profileImage`)
   - Component files using literal paths
4. **Re-seed** if any path in the DB seed changed:
   ```bash
   npm run db:seed
   ```
5. **Verify** by running `npm run dev` and visually checking each section that uses images.

## Caveats

- The script never touches files in `public/assets/models/` (`.glb`) or `public/assets/fonts/`.
- Animated images (`.gif`) are not currently in scope — if one is needed later, switch the script to use `sharp().webp({ animated: true })`.
- The CV PDF (`/assets/CV_*.pdf`) is left as-is — PDF stays PDF.

## When NOT to use this skill

- If the request is about a single user-uploaded image flowing through the API (different code path, runs in a route handler with `sharp` directly).
- If the request is about remote images — those go through `next/image` with `remotePatterns` in `next.config.ts`, no local conversion needed.
