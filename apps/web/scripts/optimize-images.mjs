// Convert every PNG/JPG under public/assets/img/ to .webp in place.
// Idempotent: existing .webp files are skipped; originals are deleted only after successful write.
//
// Usage: npm run images:optimize
//
// Options:
//   --quality <n>   default 82 — sharp WebP quality (60-95 reasonable)
//   --dry-run       list what would happen, don't write or delete
//   --keep-original keep PNG/JPG alongside .webp (no deletion)

import { readdir, stat, unlink, access } from "node:fs/promises";
import { join, parse, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..", "public", "assets", "img");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const KEEP_ORIGINAL = args.has("--keep-original");
const qualityIdx = process.argv.indexOf("--quality");
const QUALITY = qualityIdx > -1 ? Number(process.argv[qualityIdx + 1]) : 82;

const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg"]);

const exists = (p) => access(p).then(() => true, () => false);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(2)} MB`;
};

(async () => {
  if (!(await exists(ROOT))) {
    console.error(`✗ Image root not found: ${ROOT}`);
    process.exit(1);
  }

  let scanned = 0;
  let converted = 0;
  let skipped = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for await (const file of walk(ROOT)) {
    const { dir, name, ext } = parse(file);
    const lower = ext.toLowerCase();
    if (!SOURCE_EXT.has(lower)) continue;

    scanned++;
    const target = join(dir, `${name}.webp`);
    const rel = relative(ROOT, file);

    if (await exists(target)) {
      skipped++;
      console.log(`· skip   ${rel} (.webp already exists)`);
      if (!KEEP_ORIGINAL && !DRY_RUN) await unlink(file);
      continue;
    }

    const beforeStat = await stat(file);
    bytesBefore += beforeStat.size;

    if (DRY_RUN) {
      console.log(`◇ would convert ${rel} → ${name}.webp`);
      continue;
    }

    try {
      await sharp(file)
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(target);
      const afterStat = await stat(target);
      bytesAfter += afterStat.size;
      converted++;
      const pct = Math.round((1 - afterStat.size / beforeStat.size) * 100);
      console.log(
        `✓ ${rel} → ${name}.webp  (${formatBytes(beforeStat.size)} → ${formatBytes(afterStat.size)}, -${pct}%)`
      );
      if (!KEEP_ORIGINAL) await unlink(file);
    } catch (err) {
      console.error(`✗ failed ${rel}: ${err.message}`);
    }
  }

  console.log("");
  console.log(`Scanned:   ${scanned}`);
  console.log(`Converted: ${converted}`);
  console.log(`Skipped:   ${skipped}`);
  if (bytesBefore > 0) {
    const totalPct = Math.round((1 - bytesAfter / bytesBefore) * 100);
    console.log(
      `Total:     ${formatBytes(bytesBefore)} → ${formatBytes(bytesAfter)} (-${totalPct}%)`
    );
  }
  if (DRY_RUN) console.log("(dry-run — no files written or deleted)");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
