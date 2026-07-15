// One-off: render white-silhouette-on-brand-badge WebP logos for the 4 new
// Toolbox entries (Java / Expo / Supabase / Railway). Matches the existing
// `nextjs.webp` rounded-badge convention so the marks stay visible on both
// themes (Expo `#1C2024` and Railway `#0B0D0E` are near-black and would
// vanish on the dark theme if rendered as bare transparent glyphs).
//
// Usage: node scripts/gen-toolbox-badges.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "img", "content");

const BADGE = 128;
const SILHOUETTE = 76; // ~60% of badge, ~20% padding each side
const PAD = (BADGE - SILHOUETTE) / 2; // 26
const RX = 28; // ~22% corner radius — app-icon proportion

// Bash `/tmp` maps to the Windows user temp dir — Node resolves a bare `/tmp`
// to the drive root, so use the real absolute path.
const TMP = "C:/Users/USER/AppData/Local/Temp";
const TOOLS = [
  { name: "java", brand: "#EA2D2E", file: `${TMP}/java.svg` },
  { name: "expo", brand: "#1C2024", file: `${TMP}/expo.svg` },
  { name: "supabase", brand: "#3FCF8E", file: `${TMP}/supabase.svg` },
  { name: "railway", brand: "#0B0D0E", file: `${TMP}/railway.svg` },
];

const extractPath = (svg) => {
  const m = svg.match(/<path[^>]*\sd="([^"]+)"/);
  if (!m) throw new Error("no <path d> found");
  return m[1];
};
const extractViewBox = (svg) => {
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!m) throw new Error("no viewBox found");
  return [Number(m[1]), Number(m[2])];
};

for (const t of TOOLS) {
  const svg = readFileSync(t.file, "utf8");
  const d = extractPath(svg);
  const [w] = extractViewBox(svg);
  const scale = SILHOUETTE / w;
  const composite = `<svg xmlns="http://www.w3.org/2000/svg" width="${BADGE}" height="${BADGE}" viewBox="0 0 ${BADGE} ${BADGE}">
  <rect width="${BADGE}" height="${BADGE}" rx="${RX}" fill="${t.brand}"/>
  <g transform="translate(${PAD} ${PAD}) scale(${scale.toFixed(6)})" fill="#FFFFFF">
    <path d="${d}"/>
  </g>
</svg>`;
  const out = join(OUT_DIR, `${t.name}.webp`);
  await sharp(Buffer.from(composite))
    .resize(BADGE, BADGE)
    .webp({ quality: 95, effort: 6 })
    .toFile(out);
  console.log(`✓ wrote ${out}`);
}
