import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const PROJECT_INFO = path.join(process.cwd(), "Project_Info");
const PROFILE_DATA_PATH = path.join(PROJECT_INFO, "Profile data.txt");
const IMAGES_LIST_PATH = path.join(PROJECT_INFO, "Website-Images", "files.txt");

export type ProfileRow = {
  profileId: string;
  mouldingType: string;
  width: number;
  thickness: number;
};

function normalizeId(id: string): string {
  return id.replace(/\s+/g, "").trim().toUpperCase();
}

function getImageBaseNames(): Set<string> {
  if (!fs.existsSync(IMAGES_LIST_PATH)) return new Set();
  const text = fs.readFileSync(IMAGES_LIST_PATH, "utf-8");
  const names = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "files.txt") continue;
    const ext = path.extname(trimmed).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) continue;
    const base = path.basename(trimmed, ext);
    names.add(normalizeId(base));
  }
  return names;
}

export function loadProfilesWithImages(): ProfileRow[] {
  const imageBaseNames = getImageBaseNames();
  if (!fs.existsSync(PROFILE_DATA_PATH)) return [];

  const raw = fs.readFileSync(PROFILE_DATA_PATH, "utf-8");
  const rows = parse(raw, {
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  }) as string[][];

  const seen = new Set<string>();
  const out: ProfileRow[] = [];

  for (const row of rows) {
    const profileId = (row[0] ?? "").replace(/^"|"$/g, "").trim();
    const mouldingType = (row[1] ?? "").replace(/^"|"$/g, "").trim();
    const widthRaw = row[4];
    const thicknessRaw = row[6];
    const width = typeof widthRaw === "number" ? widthRaw : parseFloat(String(widthRaw).replace(/^"|"$/g, "")) || 0;
    const thickness = typeof thicknessRaw === "number" ? thicknessRaw : parseFloat(String(thicknessRaw).replace(/^"|"$/g, "")) || 0;

    if (!profileId || !mouldingType) continue;
    const key = `${normalizeId(profileId)}|${mouldingType}|${width}|${thickness}`;
    if (seen.has(key)) continue;
    if (!imageBaseNames.has(normalizeId(profileId))) continue;

    seen.add(key);
    out.push({ profileId, mouldingType, width, thickness });
  }

  return out;
}

export function getUniqueMouldingTypes(profiles: ProfileRow[]): string[] {
  const set = new Set(profiles.map((p) => p.mouldingType));
  return Array.from(set).filter(Boolean).sort();
}

export function getImageFileName(profileId: string): string | null {
  if (!fs.existsSync(IMAGES_LIST_PATH)) return null;
  const text = fs.readFileSync(IMAGES_LIST_PATH, "utf-8");
  const norm = normalizeId(profileId);
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "files.txt") continue;
    const ext = path.extname(trimmed).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) continue;
    const base = path.basename(trimmed, ext);
    if (normalizeId(base) === norm) return trimmed;
  }
  return null;
}
