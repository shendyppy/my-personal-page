// Re-encode oversize .webp files in public/ — caps max dimension and lowers quality.
// Idempotent: skips files already under the size threshold.
//
// Usage: node scripts/resize-large-webp.mjs [--threshold 250] [--max-dim 1600] [--quality 70] [--dry-run]

import { readdir, stat, readFile, writeFile, rename, unlink } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..", "public");

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? Number(args[i + 1]) : def;
};
const has = (name) => args.includes(`--${name}`);

const THRESHOLD_KB = flag("threshold", 250);
const MAX_DIM = flag("max-dim", 1600);
const QUALITY = flag("quality", 70);
const DRY_RUN = has("dry-run");

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(2)} MB`;
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

(async () => {
  let scanned = 0;
  let resized = 0;
  let skipped = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for await (const file of walk(ROOT)) {
    if (!file.toLowerCase().endsWith(".webp")) continue;
    scanned++;
    const beforeStat = await stat(file);
    if (beforeStat.size < THRESHOLD_KB * 1024) {
      skipped++;
      continue;
    }

    const rel = relative(ROOT, file);
    bytesBefore += beforeStat.size;

    if (DRY_RUN) {
      console.log(`◇ would resize ${rel} (${formatBytes(beforeStat.size)})`);
      continue;
    }

    try {
      const input = await readFile(file);
      const buf = await sharp(input)
        .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();
      // Only overwrite if the new buffer is actually smaller
      if (buf.length < beforeStat.size) {
        const tmp = `${file}.tmp`;
        await writeFile(tmp, buf);
        await unlink(file);
        await rename(tmp, file);
        bytesAfter += buf.length;
        resized++;
        const pct = Math.round((1 - buf.length / beforeStat.size) * 100);
        console.log(
          `✓ ${rel}  (${formatBytes(beforeStat.size)} → ${formatBytes(buf.length)}, -${pct}%)`
        );
      } else {
        bytesAfter += beforeStat.size;
        skipped++;
        console.log(`· no-gain ${rel} (already optimal)`);
      }
    } catch (err) {
      console.error(`✗ failed ${rel}: ${err.message}`);
    }
  }

  console.log("");
  console.log(`Scanned:   ${scanned}`);
  console.log(`Resized:   ${resized}`);
  console.log(`Skipped:   ${skipped}`);
  if (bytesBefore > 0) {
    const totalPct = Math.round((1 - bytesAfter / bytesBefore) * 100);
    console.log(
      `Total:     ${formatBytes(bytesBefore)} → ${formatBytes(bytesAfter)} (-${totalPct}%)`
    );
  }
  if (DRY_RUN) console.log("(dry-run — no files written)");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
