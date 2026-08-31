import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const PROJECT_INFO = path.join(process.cwd(), "Project_Info");
const PROFILES_XLSX_PATH = path.join(PROJECT_INFO, "All-Profiles.xlsx");
/** Profile drawings live here (moved from Website-Images). */
export const PROFILE_GIFS_DIR = path.join(PROJECT_INFO, "Profile-Browser", "GIFs");
/** Pre-made outline PDFs for profile downloads. */
export const PROFILE_PDFS_DIR = path.join(PROJECT_INFO, "Profile-Browser", "PDFs");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif"]);

/** Drawings modified in 2012 or later are treated as 1:1 / “new”. */
export const NEW_PROFILE_DRAWING_YEAR = 2012;

export type ProfileRegion = "east" | "west";

export type ProfileRow = {
  profileId: string;
  description: string;
  mouldingType: string;
  width: number;
  thickness: number;
  region: ProfileRegion;
  /** Aliases from the Key sheet Search Term columns for this moulding type. */
  searchTerms: string[];
};

function normalizeId(id: string): string {
  return id.replace(/\s+/g, "").trim().toUpperCase();
}

/** PDF filenames use `ID~suffix`; match on the part before `~`. */
function normalizePdfBaseName(fileBaseName: string): string {
  return normalizeId(fileBaseName.split("~")[0] ?? fileBaseName);
}

function parseNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = parseFloat(String(value ?? "").replace(/[",]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function cellText(value: unknown): string {
  return String(value ?? "").trim();
}

/** Map of normalized profile id -> image filename in Profile-Browser/GIFs. */
let imageFileMapCache: Map<string, string> | null = null;

function getImageFileMap(): Map<string, string> {
  if (imageFileMapCache) return imageFileMapCache;

  const map = new Map<string, string>();
  if (!fs.existsSync(PROFILE_GIFS_DIR)) {
    imageFileMapCache = map;
    return map;
  }

  for (const name of fs.readdirSync(PROFILE_GIFS_DIR)) {
    const originalExt = path.extname(name);
    const ext = originalExt.toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    const base = path.basename(name, originalExt);
    map.set(normalizeId(base), name);
  }

  imageFileMapCache = map;
  return map;
}

/** Map of normalized profile id -> outline PDF filename in Profile-Browser/PDFs. */
let pdfFileMapCache: Map<string, string> | null = null;

function getPdfFileMap(): Map<string, string> {
  if (pdfFileMapCache) return pdfFileMapCache;

  const map = new Map<string, string>();
  if (!fs.existsSync(PROFILE_PDFS_DIR)) {
    pdfFileMapCache = map;
    return map;
  }

  for (const name of fs.readdirSync(PROFILE_PDFS_DIR)) {
    if (path.extname(name).toLowerCase() !== ".pdf") continue;
    const base = path.basename(name, path.extname(name));
    const key = normalizePdfBaseName(base);
    // Prefer an exact id match file if multiple ~variants exist; keep first seen otherwise
    if (!map.has(key)) map.set(key, name);
  }

  pdfFileMapCache = map;
  return map;
}

function loadWorkbook() {
  if (!fs.existsSync(PROFILES_XLSX_PATH)) return null;
  // Use fs + XLSX.read so Next.js/Webpack does not block XLSX.readFile paths.
  const buffer = fs.readFileSync(PROFILES_XLSX_PATH);
  return XLSX.read(buffer, { type: "buffer" });
}

type KeySheetData = {
  types: string[];
  searchTermsByType: Map<string, string[]>;
};

let keySheetCache: KeySheetData | null = null;

/** Moulding types + search-term aliases from the Key sheet. */
function loadKeySheetData(): KeySheetData {
  if (keySheetCache) return keySheetCache;

  const empty: KeySheetData = { types: [], searchTermsByType: new Map() };
  const workbook = loadWorkbook();
  if (!workbook) {
    keySheetCache = empty;
    return keySheetCache;
  }

  const keySheet = workbook.Sheets.Key ?? workbook.Sheets[workbook.SheetNames[1]];
  if (!keySheet) {
    keySheetCache = empty;
    return keySheetCache;
  }

  const rows = XLSX.utils.sheet_to_json(keySheet, { header: 1, defval: "" }) as unknown[][];
  const types: string[] = [];
  const searchTermsByType = new Map<string, string[]>();
  const seen = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const type = cellText(row[0]);
    if (!type || seen.has(type)) continue;
    seen.add(type);
    types.push(type);

    const terms: string[] = [];
    const termSeen = new Set<string>();
    // Columns C+ are Search Term 1..N (Length is column B / index 1).
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

  keySheetCache = { types, searchTermsByType };
  return keySheetCache;
}

/** Moulding types from the Key sheet (column A), in sheet order. */
export function loadKeyMouldingTypes(): string[] {
  return loadKeySheetData().types;
}

export function loadSearchTermsByMouldingType(): Map<string, string[]> {
  return loadKeySheetData().searchTermsByType;
}

let profilesCache: ProfileRow[] | null = null;

export function loadProfilesWithImages(): ProfileRow[] {
  if (profilesCache) return profilesCache;

  const workbook = loadWorkbook();
  if (!workbook) {
    profilesCache = [];
    return profilesCache;
  }

  const inventorySheet =
    workbook.Sheets.Inventory ?? workbook.Sheets[workbook.SheetNames[0]];
  if (!inventorySheet) {
    profilesCache = [];
    return profilesCache;
  }

  const imageMap = getImageFileMap();
  const searchTermsByType = loadSearchTermsByMouldingType();
  const rows = XLSX.utils.sheet_to_json(inventorySheet, {
    header: 1,
    defval: "",
  }) as unknown[][];

  const seen = new Set<string>();
  const out: ProfileRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
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

    out.push({
      profileId,
      description,
      mouldingType,
      width,
      thickness,
      region: "east",
      searchTerms: searchTermsByType.get(mouldingType) ?? [],
    });
  }

  // West coast inventory/images will be merged here when available.

  profilesCache = out;
  return out;
}

/**
 * Key-sheet moulding types that have at least one profile with a drawing.
 * Sorted alphabetically for filters and navigation.
 */
export function getMouldingTypesWithDrawings(
  profiles: ProfileRow[] = loadProfilesWithImages()
): string[] {
  const typesWithDrawings = new Set(profiles.map((p) => p.mouldingType));
  return loadKeyMouldingTypes()
    .filter((type) => typesWithDrawings.has(type))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

/** @deprecated Prefer getMouldingTypesWithDrawings. */
export function getUniqueMouldingTypes(profiles: ProfileRow[]): string[] {
  return getMouldingTypesWithDrawings(profiles);
}

export function getImageFileName(profileId: string): string | null {
  return getImageFileMap().get(normalizeId(profileId)) ?? null;
}

export function getOutlinePdfFileName(profileId: string): string | null {
  return getPdfFileMap().get(normalizeId(profileId)) ?? null;
}

/** Resolve outline PDF by trying each candidate id (stock item + alternate name). */
export function getOutlinePdfFileNameFromIds(ids: Array<string | null | undefined>): string | null {
  for (const id of ids) {
    if (!id) continue;
    const file = getOutlinePdfFileName(id);
    if (file) return file;
  }
  return null;
}

/** First candidate id that has an outline PDF (for download API lookup). */
export function getOutlinePdfLookupId(ids: Array<string | null | undefined>): string | null {
  for (const id of ids) {
    if (!id) continue;
    if (getOutlinePdfFileName(id)) return id;
  }
  return null;
}

/** True when the GIF’s modified year is 2012 or later (1:1 / new drawings). */
export function isNewProfileDrawing(profileId: string): boolean {
  const fileName = getImageFileName(profileId);
  if (!fileName) return false;
  const filePath = path.join(PROFILE_GIFS_DIR, fileName);
  if (!fs.existsSync(filePath)) return false;
  return fs.statSync(filePath).mtime.getFullYear() >= NEW_PROFILE_DRAWING_YEAR;
}

/**
 * Prefer profile-browser GIF date for stock items (item or alternate name).
 * If none exist, treat as new so we don’t show a false scale warning.
 */
export function isNewDrawingFromIds(ids: Array<string | null | undefined>): boolean {
  for (const id of ids) {
    if (!id || !getImageFileName(id)) continue;
    return isNewProfileDrawing(id);
  }
  return true;
}

export function getProfileById(profileId: string): ProfileRow | null {
  const key = normalizeId(profileId);
  if (!key) return null;
  return loadProfilesWithImages().find((p) => normalizeId(p.profileId) === key) ?? null;
}
