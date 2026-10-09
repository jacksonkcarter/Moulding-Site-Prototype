import fs from "fs";
import path from "path";
import {
  GENERATED_PROFILES,
  GENERATED_PROFILE_MOULDING_TYPES,
  type GeneratedProfileRow,
} from "@/data/profiles";

const PROJECT_INFO = path.join(process.cwd(), "Project_Info");
/** Profile drawings live here (moved from Website-Images). */
export const PROFILE_GIFS_DIR = path.join(PROJECT_INFO, "Profile-Browser", "GIFs");
/** Pre-made outline PDFs for profile downloads. */
export const PROFILE_PDFS_DIR = path.join(PROJECT_INFO, "Profile-Browser", "PDFs");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif"]);

/** Drawings modified in 2012 or later are treated as 1:1 / “new”. */
export const NEW_PROFILE_DRAWING_YEAR = 2012;

export type ProfileRegion = "east" | "west";

export type ProfileRow = GeneratedProfileRow;

function normalizeId(id: string): string {
  return id.replace(/\s+/g, "").trim().toUpperCase();
}

/** PDF filenames use `ID~suffix`; match on the part before `~`. */
function normalizePdfBaseName(fileBaseName: string): string {
  return normalizeId(fileBaseName.split("~")[0] ?? fileBaseName);
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

/**
 * Select profiles with drawings.
 * Sourced from `src/data/profiles.ts` (run `npm run generate-profiles` after Excel changes).
 */
export function loadProfilesWithImages(): ProfileRow[] {
  return GENERATED_PROFILES;
}

/**
 * Key-sheet moulding types that have at least one profile with a drawing.
 * Sorted alphabetically for filters and navigation.
 */
export function getMouldingTypesWithDrawings(
  _profiles: ProfileRow[] = GENERATED_PROFILES
): string[] {
  return GENERATED_PROFILE_MOULDING_TYPES;
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
  return GENERATED_PROFILES.find((p) => normalizeId(p.profileId) === key) ?? null;
}
