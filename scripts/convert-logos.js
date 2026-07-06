/**
 * Converts .eps logos in Project_Info/Website-Logos to SVG/PNG in public/logos.
 * Requires ImageMagick (magick) on PATH: https://imagemagick.org/
 *
 * Run: node scripts/convert-logos.js
 * Or with npx: npx node scripts/convert-logos.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const LOGOS_DIR = path.join(process.cwd(), "Project_Info", "Website-Logos");
const OUT_DIR = path.join(process.cwd(), "public", "logos");

const files = [
  { eps: "Carter-Millwork-Logo.eps", svg: "carter-millwork.svg", png: "carter-millwork.png" },
  { eps: "Flex-Trim-Logo.eps", svg: "flex-trim.svg", png: "flex-trim.png" },
];

if (!fs.existsSync(LOGOS_DIR)) {
  console.warn("Project_Info/Website-Logos not found. Skipping.");
  process.exit(0);
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

try {
  execSync("magick -version", { stdio: "ignore" });
} catch {
  console.warn("ImageMagick (magick) not found. Install from https://imagemagick.org/ and re-run to convert EPS logos.");
  process.exit(0);
}

for (const { eps, png } of files) {
  const src = path.join(LOGOS_DIR, eps);
  const destPng = path.join(OUT_DIR, png);
  if (!fs.existsSync(src)) continue;
  try {
    execSync(`magick "${src}" -resize 400x "${destPng}"`, { stdio: "inherit" });
    console.log("Created", destPng);
  } catch (e) {
    console.warn("Failed to convert", eps, e.message);
  }
}

console.log("Done. Use the generated PNGs in Header/Footer, or replace the SVGs with SVG export from your .eps in Illustrator.");
