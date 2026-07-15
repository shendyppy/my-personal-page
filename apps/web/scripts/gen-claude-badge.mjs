// One-off: render the Claude Code badge WebP for the Toolbox — a white Claude
// "burst" mark on the Anthropic clay brand color, matching the existing
// rounded-badge convention (see gen-toolbox-badges.mjs) so it reads on both
// themes. Self-contained: the burst is drawn inline, no external SVG needed.
//
// Usage: node scripts/gen-claude-badge.mjs

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "img", "content");

const BADGE = 128;
const RX = 28; // ~22% corner radius — app-icon proportion, matches the others
const BRAND = "#D97757"; // Anthropic clay
const CENTER = BADGE / 2;
const RAYS = 12;

// One tapered petal pointing up, sharp tip near the rim, widest at mid-length,
// base near (but not touching) the center — the rays radiate as full blades so
// the burst reads as the Claude mark rather than a thin sparkle.
const ray = `M ${CENTER} 18 C ${CENTER + 5} 36, ${CENTER + 5} 52, ${CENTER} 58 C ${CENTER - 5} 52, ${CENTER - 5} 36, ${CENTER} 18 Z`;

const rays = Array.from(
  { length: RAYS },
  (_, i) =>
    `<path d="${ray}" transform="rotate(${(360 / RAYS) * i} ${CENTER} ${CENTER})"/>`,
).join("\n    ");

const composite = `<svg xmlns="http://www.w3.org/2000/svg" width="${BADGE}" height="${BADGE}" viewBox="0 0 ${BADGE} ${BADGE}">
  <rect width="${BADGE}" height="${BADGE}" rx="${RX}" fill="${BRAND}"/>
  <g fill="#FFFFFF">
    ${rays}
  </g>
</svg>`;

const out = join(OUT_DIR, "claude.webp");
await sharp(Buffer.from(composite))
  .resize(BADGE, BADGE)
  .webp({ quality: 95, effort: 6 })
  .toFile(out);
console.log(`✓ wrote ${out}`);
