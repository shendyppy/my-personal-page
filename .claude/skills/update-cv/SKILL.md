---
name: update-cv
description: Replace the downloadable CV PDF with a fresh version, update the seed reference, and re-seed. Use when Shenks drops a new CV file or says "update my CV".
---

# Update the downloadable CV

The CV is a single PDF in `apps/web/public/assets/CV_Shendy Putra Perdana Yohansah_<DD MMM YYYY>.pdf`. The path is referenced in:

- `prisma/seed.ts` → `cvInfo.downloadPath`
- DB row in the `CvInfo` table (until re-seeded)

## Steps

1. **Place the new PDF** at `apps/web/public/assets/CV_Shendy Putra Perdana Yohansah_<DD MMM YYYY>.pdf`. Use the date format `17 Mar 2026` (matches existing convention).
2. **Delete the old PDF.** There should only ever be ONE current CV file in `public/assets/`.
3. **Update preview screenshot** if the layout changed: replace `public/assets/Screenshot_CV.png` with a fresh PNG, then run `npm run images:optimize` to convert it to WebP and update the `previewImage` reference in `seed.ts` to `.webp`.
4. **Update `prisma/seed.ts`** — change `cvInfo.downloadPath` to the new filename.
5. **Re-seed:**
   ```bash
   npm run db:seed
   ```
6. **Verify** the download works on `/` (About section → orange download button).

## Caveats

- The filename includes a space — keep the quoting consistent in seed file and any direct references.
- Don't commit screen recordings or alternate CV variants to `public/` — keep it lean.
