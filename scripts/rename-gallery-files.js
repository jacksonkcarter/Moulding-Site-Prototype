/**
 * Rename Project_Info/Gallery media to FlexTrim-<hex>.<ext> (video+poster share stem),
 * update public/gallery copies, and rewrite gallery-media.xlsx File column.
 * Credit keeps the old filename when it still matched (better for attribution).
 *
 * Run: node scripts/rename-gallery-files.js
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const XLSX = require("xlsx");

const ROOT = path.join(__dirname, "..");
const GALLERY_ROOT = path.join(ROOT, "Project_Info", "Gallery");
const PUBLIC_GALLERY = path.join(ROOT, "public", "gallery");
const WORKBOOK_PATH = path.join(GALLERY_ROOT, "gallery-media.xlsx");

const CATEGORY_META = [
  { folder: "Arched & Radius Casing", id: "arched-radius-casing" },
  { folder: "Curved Walls", id: "curved-walls" },
  { folder: "Vaulted & Domed Ceilings", id: "vaulted-domed-ceilings" },
  { folder: "Decorative Panel", id: "decorative-applied-mouldings" },
  { folder: "Stained Flex Trim", id: "stained-flex-trim" },
  { folder: "Outdoor Installations", id: "outdoor-installations" },
  { folder: "On the Job Site", id: "on-the-job-site" },
  { folder: "Featured", id: "featured" },
];

const MEDIA_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".mp4",
  ".webm",
  ".mov",
]);

function sheetNameForFolder(folder) {
  return folder.length <= 31 ? folder : folder.slice(0, 31);
}

function isRemoteUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

function randomToken(used) {
  let token;
  do {
    token = crypto.randomBytes(3).toString("hex");
  } while (used.has(token));
  used.add(token);
  return token;
}

function listMedia(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  return fs.readdirSync(folderPath).filter((name) => {
    const full = path.join(folderPath, name);
    return fs.statSync(full).isFile() && MEDIA_EXT.has(path.extname(name).toLowerCase());
  });
}

function renamePair(srcDir, destDir, oldName, newName) {
  const from = path.join(srcDir, oldName);
  const to = path.join(srcDir, newName);
  if (!fs.existsSync(from)) return;
  if (from.toLowerCase() === to.toLowerCase()) return;
  if (fs.existsSync(to)) throw new Error(`Target exists: ${to}`);
  fs.renameSync(from, to);
  if (!destDir) return;
  const pubFrom = path.join(destDir, oldName);
  if (!fs.existsSync(pubFrom)) return;
  const pubTo = path.join(destDir, newName);
  try {
    if (fs.existsSync(pubTo)) fs.unlinkSync(pubTo);
    fs.renameSync(pubFrom, pubTo);
  } catch (err) {
    try {
      fs.copyFileSync(pubFrom, pubTo);
      fs.unlinkSync(pubFrom);
    } catch (e2) {
      console.warn(`  public rename skipped: ${oldName} (${e2.code || e2.message})`);
    }
  }
}

function lookupNewName(map, oldFile) {
  if (map.has(oldFile)) return map.get(oldFile);
  const found = [...map.entries()].find(([k]) => k.toLowerCase() === oldFile.toLowerCase());
  return found ? found[1] : null;
}

const usedTokens = new Set();
const renameMapByFolder = new Map();

for (const meta of CATEGORY_META) {
  const folderPath = path.join(GALLERY_ROOT, meta.folder);
  const publicDir = path.join(PUBLIC_GALLERY, meta.id);
  const files = listMedia(folderPath);

  const byStem = new Map();
  for (const name of files) {
    const stem = path.basename(name, path.extname(name));
    if (!byStem.has(stem)) byStem.set(stem, []);
    byStem.get(stem).push(name);
  }

  const map = new Map();
  for (const [, group] of byStem) {
    const token = randomToken(usedTokens);
    for (const oldName of group) {
      const ext = path.extname(oldName);
      map.set(oldName, `FlexTrim-${token}${ext}`);
    }
  }

  for (const [oldName, newName] of map) {
    renamePair(folderPath, fs.existsSync(publicDir) ? publicDir : null, oldName, newName);
    console.log(`${meta.folder}: ${oldName} -> ${newName}`);
  }
  renameMapByFolder.set(meta.folder, map);
}

const workbook = XLSX.readFile(WORKBOOK_PATH);
for (const meta of CATEGORY_META) {
  const sheetName = sheetNameForFolder(meta.folder);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) continue;
  const map = renameMapByFolder.get(meta.folder) || new Map();
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  if (rows.length < 2) continue;

  for (let r = 1; r < rows.length; r++) {
    const oldFile = String(rows[r][1] ?? "").trim();
    if (!oldFile || isRemoteUrl(oldFile)) continue;
    const newFile = lookupNewName(map, oldFile);
    if (!newFile) {
      console.warn(`  Sheet row has file not on disk: ${sheetName} / ${oldFile}`);
      continue;
    }
    const oldCredit = String(rows[r][2] ?? "").trim();
    rows[r][1] = newFile;
    // Keep descriptive credit when it still matched the old filename
    if (!oldCredit || oldCredit === oldFile) rows[r][2] = oldFile;
  }

  const newSheet = XLSX.utils.aoa_to_sheet(rows);
  newSheet["!cols"] = [{ wch: 8 }, { wch: 28 }, { wch: 56 }];
  workbook.Sheets[sheetName] = newSheet;
}

XLSX.writeFile(workbook, WORKBOOK_PATH);
console.log("Updated", path.relative(ROOT, WORKBOOK_PATH));
