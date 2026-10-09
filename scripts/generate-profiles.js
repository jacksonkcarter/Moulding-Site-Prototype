/**
 * Generate static profile catalog from All-Profiles.xlsx + Profile-Browser/GIFs.
 * Run after inventory / drawing changes:
 *   npm run generate-profiles
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const PROJECT_ROOT = path.join(__dirname, "..");
const PROJECT_INFO = path.join(PROJECT_ROOT, "Project_Info");
const XLSX_PATH = path.join(PROJECT_INFO, "All-Profiles.xlsx");
const IMAGES_DIR = path.join(PROJECT_INFO, "Profile-Browser", "GIFs");
const PROFILES_OUTPUT = path.join(PROJECT_ROOT, "src", "data", "profiles.ts");
const TYPES_OUTPUT = path.join(PROJECT_ROOT, "src", "data", "profile-moulding-types.ts");
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
  if (!fs.existsSync(XLSX_PATH)) {
    console.error(`Missing spreadsheet: ${XLSX_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Missing drawings folder: ${IMAGES_DIR}`);
    process.exit(1);
  }

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

  const keyRows = XLSX.utils.sheet_to_json(keySheet, { header: 1, defval: "" });
  const keyTypes = [];
  const searchTermsByType = new Map();
  const seenKeyTypes = new Set();

  for (let i = 1; i < keyRows.length; i++) {
    const row = keyRows[i] ?? [];
    const type = cellText(row[0]);
    if (!type || seenKeyTypes.has(type)) continue;
    seenKeyTypes.add(type);
    keyTypes.push(type);

    const terms = [];
    const termSeen = new Set();
    for (let col = 2; col < row.length; col++) {
      const term = cellText(row[col]);
      if (!term) continue;
      const key = term.toLowerCase();
      if (termSeen.has(key)) continue;
      termSeen.add(key);
      terms.push(term);
    }
    searchTermsByType.set(type, terms);
  }

  const inventoryRows = XLSX.utils.sheet_to_json(inventorySheet, { header: 1, defval: "" });
  const seen = new Set();
  const profiles = [];
  const typesWithDrawings = new Set();

  for (let i = 1; i < inventoryRows.length; i++) {
    const row = inventoryRows[i] ?? [];
    const profileId = cellText(row[0]);
    const description = cellText(row[1]);
    const thickness = parseNumber(row[2]);
    const width = parseNumber(row[3]);
    const mouldingType = cellText(row[4]);

    if (!profileId || !mouldingType) continue;
    if (!imageMap.has(normalizeId(profileId))) continue;

    const key = `${normalizeId(profileId)}|${mouldingType}|${width}|${thickness}|east`;
    if (seen.has(key)) continue;
    seen.add(key);
    typesWithDrawings.add(mouldingType);

    profiles.push({
      profileId,
      description,
      mouldingType,
      width,
      thickness,
      region: "east",
      searchTerms: searchTermsByType.get(mouldingType) ?? [],
    });
  }

  const mouldingTypes = keyTypes
    .filter((type) => typesWithDrawings.has(type))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const profilesOutput = `/**
 * Select-profile catalog for the profile browser.
 * Generated from All-Profiles.xlsx + Profile-Browser/GIFs.
 * Do not edit by hand.
 *
 * Regenerate after inventory or drawing changes:
 *   npm run generate-profiles
 */

export type GeneratedProfileRegion = "east" | "west";

export type GeneratedProfileRow = {
  profileId: string;
  description: string;
  mouldingType: string;
  width: number;
  thickness: number;
  region: GeneratedProfileRegion;
  searchTerms: string[];
};

export const GENERATED_PROFILES: GeneratedProfileRow[] = ${JSON.stringify(profiles, null, 2)};

export const GENERATED_PROFILE_MOULDING_TYPES: string[] = ${JSON.stringify(mouldingTypes, null, 2)};
`;

  const typesOutput = `/**
 * Moulding types for the profile browser nav/filters.
 * Generated from All-Profiles.xlsx Key sheet, limited to types with drawings,
 * sorted alphabetically.
 * Regenerate with: npm run generate-profiles
 */
export const PROFILE_MOULDING_TYPES = ${JSON.stringify(mouldingTypes, null, 2)} as const;
`;

  fs.writeFileSync(PROFILES_OUTPUT, profilesOutput, "utf8");
  fs.writeFileSync(TYPES_OUTPUT, typesOutput, "utf8");
  console.log(
    `Wrote ${profiles.length} profiles and ${mouldingTypes.length} moulding types → src/data/profiles.ts`,
  );
}

main();
