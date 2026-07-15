---
name: update-cv
description: Replace the downloadable CV PDF with a fresh version, update the seed reference, and re-seed. Use when Shenks drops a new CV file or says "update my CV".
---

# Update the downloadable CV

The CV is a **single canonical PDF** at `apps/web/public/assets/CV_Shendy Putra Perdana Yohansah.pdf` — no date suffix, no "Latest" tag. The downloaded file name follows this path's basename (the About section sets `download={cv.downloadPath.split("/").pop())}`), so keeping the on-disk filename clean is what gives the user a clean download name.

The path is referenced in:

- `prisma/seed.ts` → `cvInfo.downloadPath`
- DB row in the `CvInfo` table (until re-seeded)

## Steps

1. **Place the new PDF** at `apps/web/public/assets/CV_Shendy Putra Perdana Yohansah.pdf` — overwrite the existing canonical file. Do NOT append a date or version tag to the filename.
2. **Delete any other `CV_*.pdf`** in `public/assets/` — there should only ever be ONE current CV file.
3. **Update preview screenshot** if the layout changed: replace `public/assets/Screenshot_CV.png` with a fresh PNG, then run `npm run images:optimize` to convert it to WebP (the `previewImage` reference in `seed.ts` already points at `.webp`).
4. **`prisma/seed.ts`** — `cvInfo.downloadPath` should already read `/assets/CV_Shendy Putra Perdana Yohansah.pdf`. No change needed unless it drifted.
5. **Re-seed:**
   ```bash
   npm run db:seed
   ```
6. **Verify** the download works on `/` (About section → hover the portrait → DOWNLOAD CV button). The saved file should be named `CV_Shendy Putra Perdana Yohansah.pdf`.

## Caveats

- The filename includes spaces — keep quoting consistent in the seed file and any direct references.
- Don't commit screen recordings or alternate CV variants to `public/` — keep it lean (one canonical PDF).
- If you ever need to version CVs for your own records, keep those copies outside the repo — the public asset stays canonical.
