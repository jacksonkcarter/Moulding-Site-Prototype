const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const PROJECT_ROOT = path.join(__dirname, "..");
const XLSX_PATH = path.join(PROJECT_ROOT, "Project_Info", "State-vs-Facility.xlsx");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "state-facility-map.ts");

const STATE_ABBR = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  DC: "DC",
  "District of Columbia": "DC",
};

/**
 * @param {string} raw
 * @returns {"east" | "west" | "shared" | null}
 */
function parseLocation(raw) {
  const value = String(raw || "").trim().toLowerCase();
  if (value === "west") return "west";
  if (value === "east") return "east";
  if (value === "shared" || value === "both" || value === "east/west" || value === "east & west") {
    return "shared";
  }
  return null;
}

function main() {
  const rows = XLSX.utils
    .sheet_to_json(XLSX.readFile(XLSX_PATH).Sheets.Sheet1, { header: 1, defval: "" })
    .slice(1);

  /** @type {Record<string, 'east' | 'west' | 'shared'>} */
  const byName = {};
  /** @type {Record<string, 'east' | 'west' | 'shared'>} */
  const byAbbr = {};

  for (const row of rows) {
    const name = String(row[0] || "").trim();
    const region = parseLocation(row[1]);
    if (!name || !region) continue;
    byName[name] = region;
    const abbr = STATE_ABBR[name] || (name.length === 2 ? name.toUpperCase() : null);
    if (abbr) byAbbr[abbr] = region;
  }

  if (!byName["District of Columbia"] && byName.DC) {
    byName["District of Columbia"] = byName.DC;
  }

  const sharedCount = Object.values(byName).filter((r) => r === "shared").length;

  const output = `/**
 * State -> facility region mapping from Project_Info/State-vs-Facility.xlsx
 * Regenerate with: npm run generate-state-facility-map
 *
 * "shared" means the state is supported by both East and West facilities.
 */
export type FacilityRegion = "east" | "west";
export type FacilityAssignment = FacilityRegion | "shared";

export const STATE_NAME_TO_FACILITY: Record<string, FacilityAssignment> = ${JSON.stringify(byName, null, 2)};

export const STATE_ABBR_TO_FACILITY: Record<string, FacilityAssignment> = ${JSON.stringify(byAbbr, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output, "utf8");
  console.log(
    `Wrote ${Object.keys(byName).length} state names and ${Object.keys(byAbbr).length} abbreviations (${sharedCount} shared) to ${path.relative(PROJECT_ROOT, OUTPUT_PATH)}`
  );
}

main();
