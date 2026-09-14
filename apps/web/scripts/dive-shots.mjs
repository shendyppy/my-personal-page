// Usage: PLAYWRIGHT_ROOT="C:/Project/Shendy/Java Exploration/java-exploration/e2e" npm run shots
// Captures the six chapters at desktop + mobile into docs/superpowers/shots/.
// Playwright is not a dependency of this app; point PLAYWRIGHT_ROOT at any
// folder that has it installed.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = process.env.PLAYWRIGHT_ROOT;
if (!root) throw new Error("Set PLAYWRIGHT_ROOT to a folder that has playwright installed");
const { chromium } = createRequire(path.join(root, "package.json"))("playwright");

const base = process.env.SHOTS_URL ?? "http://localhost:3000";
const out = path.resolve("../../docs/superpowers/shots");
mkdirSync(out, { recursive: true });

const CHAPTERS = ["surface", "reef", "twilight", "descent", "midnight", "seafloor"];
const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];

const browser = await chromium.launch();
for (const [name, viewport] of VIEWPORTS) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  for (const id of CHAPTERS) {
    await page.evaluate((sel) => {
      const el = document.getElementById(sel);
      // Middle of the pin (or of the entrance, for the last chapter), where the
      // chapter is fully on screen.
      const travel = Math.max(0, el.offsetHeight - window.innerHeight);
      const top = travel > 0 ? el.offsetTop + travel / 2 : el.offsetTop;
      window.scrollTo({ top: Math.min(top, document.documentElement.scrollHeight), behavior: "instant" });
    }, `dive-${id}`);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, `${name}-${id}.png`) });
  }
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflowX) console.warn(`${name}: horizontal overflow`);
  await page.close();
}
await browser.close();
console.log("shots →", out);
