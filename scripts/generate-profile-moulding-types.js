const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const PROJECT_ROOT = path.join(__dirname, "..");
const PROJECT_INFO = path.join(PROJECT_ROOT, "Project_Info");
const XLSX_PATH = path.join(PROJECT_INFO, "All-Profiles.xlsx");
const IMAGES_DIR = path.join(PROJECT_INFO, "Profile-Browser", "GIFs");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "profile-moulding-types.ts");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif"]);

function normalizeId(id) {
  return String(id).replace(/\s+/g, "").trim().toUpperCase();
}

function parseNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = parseFloat(String(value ?? "").replace(/[",]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function cellText(value) {
  return String(value ?? "").trim();
}

function main() {
  const workbook = XLSX.readFile(XLSX_PATH);
  const inventorySheet = workbook.Sheets.Inventory ?? workbook.Sheets[workbook.SheetNames[0]];
  const keySheet = workbook.Sheets.Key ?? workbook.Sheets[workbook.SheetNames[1]];

  const imageMap = new Map();
  for (const name of fs.readdirSync(IMAGES_DIR)) {
    const originalExt = path.extname(name);
    const ext = originalExt.toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    imageMap.set(normalizeId(path.basename(name, originalExt)), name);
  }

  const inventoryRows = XLSX.utils.sheet_to_json(inventorySheet, { header: 1, defval: "" });
  const keyRows = XLSX.utils.sheet_to_json(keySheet, { header: 1, defval: "" });

  const seen = new Set();
  const typesWithDrawings = new Set();

  for (let i = 1; i < inventoryRows.length; i++) {
    const row = inventoryRows[i] ?? [];
    const profileId = cellText(row[0]);
    const thickness = parseNumber(row[2]);
    const width = parseNumber(row[3]);
    const mouldingType = cellText(row[4]);

    if (!profileId || !mouldingType) continue;
    if (!imageMap.has(normalizeId(profileId))) continue;

    const key = `${normalizeId(profileId)}|${mouldingType}|${width}|${thickness}|east`;
    if (seen.has(key)) continue;
    seen.add(key);
    typesWithDrawings.add(mouldingType);
  }

  const keyTypes = [];
  const seenTypes = new Set();
  for (let i = 1; i < keyRows.length; i++) {
    const type = cellText(keyRows[i]?.[0]);
    if (!type || seenTypes.has(type)) continue;
    seenTypes.add(type);
    keyTypes.push(type);
  }

  const types = keyTypes
    .filter((type) => typesWithDrawings.has(type))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const output = `/**
 * Moulding types for the profile browser nav/filters.
 * Generated from All-Profiles.xlsx Key sheet, limited to types with drawings,
 * sorted alphabetically.
 * Regenerate with: npm run generate-profile-moulding-types
 */
export const PROFILE_MOULDING_TYPES = ${JSON.stringify(types, null, 2)} as const;
`;

  fs.writeFileSync(OUTPUT_PATH, output, "utf8");
  console.log(`Wrote ${types.length} moulding types (${seen.size} profiles with drawings)`);
}

main();
