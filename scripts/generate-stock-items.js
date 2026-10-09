const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const PROJECT_ROOT = path.join(__dirname, "..");
const EXCEL_PATH = path.join(PROJECT_ROOT, "Project_Info", "Stock-Items", "STOCK ITEM LIST.xlsx");
const PHOTOS_ROOT = path.join(PROJECT_ROOT, "Project_Info", "Stock-Items");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "stock-items.ts");
const PUBLIC_STOCK = path.join(PROJECT_ROOT, "public", "stock-items");

// Convert decimal inches to mixed number string, e.g. 1.0625 -> "1-1/16"
function decimalToMixed(n) {
  if (n == null || Number.isNaN(n)) return "";
  const whole = Math.floor(n);
  const frac = n - whole;
  if (frac < 0.001) return whole ? String(whole) : "0";
  // Use 16ths for inches
  const sixteenths = Math.round(frac * 16);
  if (sixteenths === 0) return whole ? String(whole) : "0";
  const g = (a, b) => (b ? g(b, a % b) : a);
  const g16 = g(sixteenths, 16);
  const num = sixteenths / g16;
  const den = 16 / g16;
  const fracStr = den === 1 ? String(num) : `${num}/${den}`;
  return whole ? `${whole}-${fracStr}` : fracStr;
}

// Category display name: strip trailing "(...)", trim
function cleanCategory(cat) {
  if (!cat || typeof cat !== "string") return "";
  return cat.replace(/\s*\([^)]*\)\s*$/, "").trim().replace(/^\s+|\s+$/g, "");
}

// Extract parenthetical text, e.g. "Corner & cove (Cove)" -> "Cove"
function getParenthetical(cat) {
  if (!cat || typeof cat !== "string") return null;
  const m = cat.match(/\s*\(([^)]+)\)\s*$/);
  return m ? m[1].trim() : null;
}

// Slug for section id: "Back Band" -> "back-band"
function categoryToSlug(cat) {
  return cleanCategory(cat)
    .toLowerCase()
    .replace(/\s+&\s+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Photo folders drop "/" from item names (e.g. C42R3/4 -> C42R34). */
function photoFolderKey(name) {
  return String(name).replace(/\//g, "").toLowerCase();
}

/** Parse a bending-limit cell; empty / N/A → null. */
function parseLimit(val) {
  if (val === "" || val == null) return null;
  if (typeof val === "string" && /^\s*n\/?a\s*$/i.test(val)) return null;
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  const n = parseFloat(String(val).replace(/[^\d.-]/g, ""));
  return Number.isNaN(n) ? null : n;
}

/**
 * Bending sheet columns (after Item):
 * Style 1 / Style 2 min radius;
 * half-round min/max diameter pairs for 2/0…6/0;
 * arc min/max radius pairs for 30"R, 48"R, 84"R.
 */
function parseBendingLimits(row) {
  const halfRoundSizes = ["2/0", "2/6", "3/0", "4/0", "5/0", "6/0"];
  const halfRound = {};
  for (let i = 0; i < halfRoundSizes.length; i++) {
    const minDiameter = parseLimit(row[3 + i * 2]);
    const maxDiameter = parseLimit(row[4 + i * 2]);
    if (minDiameter != null || maxDiameter != null) {
      halfRound[halfRoundSizes[i]] = { minDiameter, maxDiameter };
    }
  }

  const arcRadii = [30, 48, 84];
  const arc = {};
  for (let i = 0; i < arcRadii.length; i++) {
    const minRadius = parseLimit(row[15 + i * 2]);
    const maxRadius = parseLimit(row[16 + i * 2]);
    if (minRadius != null || maxRadius != null) {
      arc[String(arcRadii[i])] = { minRadius, maxRadius };
    }
  }

  return {
    straightStyle1: parseLimit(row[1]),
    straightStyle2: parseLimit(row[2]),
    halfRound,
    arc,
  };
}

function emptyBendingLimits() {
  return {
    straightStyle1: null,
    straightStyle2: null,
    halfRound: {},
    arc: {},
  };
}

function findSheet(wb, ...candidates) {
  const names = wb.SheetNames;
  for (const candidate of candidates) {
    const want = candidate.toLowerCase().replace(/\s+/g, " ").trim();
    const exact = names.find((n) => n.toLowerCase().replace(/\s+/g, " ").trim() === want);
    if (exact) return wb.Sheets[exact];
  }
  // Tolerate the spreadsheet typo "Limtations"
  const bending = names.find((n) => /bending\s+lim/i.test(n));
  if (bending && candidates.some((c) => /bending/i.test(c))) return wb.Sheets[bending];
  const sizes = names.find((n) => /^sizes$/i.test(n.trim()));
  if (sizes && candidates.some((c) => /^sizes$/i.test(c))) return wb.Sheets[sizes];
  return null;
}

function normalizeHeader(val) {
  return String(val).toLowerCase().replace(/\s+/g, " ").trim();
}

function headerIndex(headers, ...names) {
  for (let i = 0; i < headers.length; i++) {
    const h = normalizeHeader(headers[i]);
    if (names.some((n) => h === normalizeHeader(n))) return i;
  }
  return -1;
}

function textOrNull(val) {
  if (val === "" || val == null) return null;
  const s = String(val).trim();
  return s || null;
}

function loadCategoryDescriptions(wb) {
  const sheet = findSheet(wb, "Description by Category");
  const map = {};
  if (!sheet) return map;
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  for (let i = 1; i < rows.length; i++) {
    const key = textOrNull(rows[i][0]);
    const desc = textOrNull(rows[i][1]);
    if (key && desc) map[key] = desc;
  }
  return map;
}

function categoryDescriptionKey(rawCategory, descMap) {
  const s = String(rawCategory).trim();
  if (descMap[s]) return descMap[s];
  const paren = getParenthetical(s);
  const base = cleanCategory(s);
  const tries = [
    paren ? `${base} (${paren})` : null,
    paren && /S4S/i.test(base) ? `Flat stock (${paren})` : null,
    base,
    base.replace(/ \/ S4S$/, ""),
  ].filter(Boolean);
  for (const t of tries) {
    if (descMap[t]) return descMap[t];
  }
  return null;
}

function loadItemSpecificNotes(wb) {
  const sheet = findSheet(wb, "Item Specific Notes");
  const map = {};
  if (!sheet) return map;
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const headers = rows[0] || [];
  const itemCol = headerIndex(headers, "Item");
  const finishCol = headerIndex(headers, "Finish Grade");
  const matchCol = headerIndex(headers, "Matching Wood Profiles");
  const notesCol = headerIndex(headers, "Notes");
  if (itemCol < 0) return map;
  const startRow = normalizeHeader(headers[itemCol]) === "item" ? 1 : 0;
  for (let i = startRow; i < rows.length; i++) {
    const item = textOrNull(rows[i][itemCol]);
    if (!item) continue;
    map[item.toLowerCase()] = {
      finishGrade: finishCol >= 0 ? textOrNull(rows[i][finishCol]) : null,
      matchingWoodProfiles: matchCol >= 0 ? textOrNull(rows[i][matchCol]) : null,
      notes: notesCol >= 0 ? textOrNull(rows[i][notesCol]) : null,
    };
  }
  return map;
}

function readImageSize(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".gif" && buf.length >= 10) {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    }
    if (ext === ".png" && buf.length >= 24 && buf.toString("ascii", 12, 16) === "IHDR") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if ((ext === ".jpg" || ext === ".jpeg") && buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) break;
        const marker = buf[i + 1];
        const size = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + size;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function main() {
  const wb = XLSX.readFile(EXCEL_PATH);
  const sizesSheet =
    findSheet(wb, "Sizes") || wb.Sheets[wb.SheetNames[0]];
  const bendingSheet = findSheet(wb, "Bending Limitations", "Bending Limtations");
  const categoryDescriptions = loadCategoryDescriptions(wb);
  const itemSpecificNotes = loadItemSpecificNotes(wb);
  const rows = XLSX.utils.sheet_to_json(sizesSheet, { header: 1, defval: "" });

  const bendingByItem = {};
  if (bendingSheet) {
    const bendRows = XLSX.utils.sheet_to_json(bendingSheet, { header: 1, defval: "" });
    for (let i = 2; i < bendRows.length; i++) {
      const bendRow = bendRows[i];
      const itemName = bendRow[0] ? String(bendRow[0]).trim() : "";
      if (!itemName) continue;
      bendingByItem[itemName.toLowerCase()] = parseBendingLimits(bendRow);
    }
  } else {
    console.warn("Bending limitations sheet not found; bendingLimits will be empty.");
  }

  // Item, Alternate Name, Category, Thickness, Width, Rabbet, then config columns (G–T)
  const headers = rows[1];
  const OTHER_COLUMN_INDEX = 5; // Column F (Rabbet)
  const CONFIG_COL_START = 6; // Column G
  const CONFIG_COL_END = 19; // Column T (inclusive)
  const configColumns = [];
  for (let c = CONFIG_COL_START; c <= CONFIG_COL_END; c++) {
    if (headers[c]) configColumns.push({ index: c, name: String(headers[c]) });
  }
  const items = [];
  const categoriesSeen = new Set();
  const categoryOrder = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const itemName = row[0] ? String(row[0]).trim() : "";
    if (!itemName) continue;
    const alternateRaw = row[1] ? String(row[1]).trim() : "";
    const alternateName = alternateRaw
      ? alternateRaw.replace(/^\(+/, "").replace(/\)+$/, "").trim() || null
      : null;
    const category = cleanCategory(row[2]);
    if (!category) continue;
    const thickness = row[3];
    const width = row[4];
    const other = row[OTHER_COLUMN_INDEX];
    let dimensions = `${decimalToMixed(thickness)}" x ${decimalToMixed(width)}"`;
    if (other !== "" && other != null && !String(other).trim().match(/^(X|x)$/i)) {
      const otherNum =
        typeof other === "number" && !Number.isNaN(other)
          ? other
          : parseFloat(String(other).replace(/[^\d.-]/g, ""), 10);
      if (!Number.isNaN(otherNum)) {
        dimensions += ` x ${decimalToMixed(otherNum)}" Rab`;
      }
    }

    const configs = [];
    for (const col of configColumns) {
      const val = row[col.index];
      if (val === "X" || val === "x" || val === true) {
        configs.push(col.name);
      }
    }

    const key = category.toLowerCase();
    if (!categoriesSeen.has(key)) {
      categoriesSeen.add(key);
      categoryOrder.push(category);
    }

    const thicknessNum = typeof thickness === "number" && !Number.isNaN(thickness) ? thickness : null;
    const widthNum = typeof width === "number" && !Number.isNaN(width) ? width : null;
    const rawCategory = row[2];
    const miscellaneousLabel = getParenthetical(rawCategory);
    const itemNotes = itemSpecificNotes[itemName.toLowerCase()] || {};
    items.push({
      item: itemName,
      alternateName,
      category,
      categorySlug: categoryToSlug(row[2]),
      dimensions,
      thickness: thicknessNum,
      width: widthNum,
      configs,
      miscellaneousLabel,
      categoryDescription: categoryDescriptionKey(rawCategory, categoryDescriptions),
      itemNote: itemNotes.notes ?? null,
      finishGrade: itemNotes.finishGrade ?? null,
      matchingWoodProfiles: itemNotes.matchingWoodProfiles ?? null,
      bendingLimits: bendingByItem[itemName.toLowerCase()] || emptyBendingLimits(),
    });
  }

  // Scan photo folders for each item's main image
  const itemPhotos = {};
  if (fs.existsSync(PHOTOS_ROOT)) {
    const dirs = fs.readdirSync(PHOTOS_ROOT, { withFileTypes: true });
    for (const d of dirs) {
      if (d.name === "STOCK ITEM LIST.xlsx") continue;
      const itemPath = path.join(PHOTOS_ROOT, d.name);
      if (!d.isDirectory()) continue;
      const files = fs
        .readdirSync(itemPath, { withFileTypes: true })
        .filter((x) => x.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(x.name))
        .map((x) => x.name);
      const namePrefix = d.name.toLowerCase();
      const gifs = files.filter((f) => /\.gif$/i.test(f));
      const mainImage =
        gifs.find((f) => f.toLowerCase().startsWith(namePrefix)) ||
        gifs[0] ||
        files.find((f) => f.toLowerCase().startsWith(namePrefix)) ||
        files[0] ||
        null;
      const mainImageSize = mainImage ? readImageSize(path.join(itemPath, mainImage)) : null;
      itemPhotos[d.name] = { mainImage, mainImageSize };
    }
  }

  // Case-insensitive lookup from Excel item name -> photo folder data
  // Also index by "/"-stripped names (Windows folders cannot contain "/").
  const photosByItemLower = {};
  for (const [folderName, data] of Object.entries(itemPhotos)) {
    const entry = { folderName, data };
    photosByItemLower[folderName.toLowerCase()] = entry;
    photosByItemLower[photoFolderKey(folderName)] = entry;
  }

  // Build sections for categories that appear in the sheet, alphabetized by label
  const sections = categoryOrder
    .map((label) => ({
      label,
      id: categoryToSlug(label),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  // Only include image paths when a real file exists (no placeholder path for missing photos)
  const itemImagePaths = {};
  const itemImageSizes = {};
  for (const it of items) {
    const match =
      photosByItemLower[it.item.toLowerCase()] || photosByItemLower[photoFolderKey(it.item)];
    if (match?.data.mainImage) {
      itemImagePaths[it.item] = `/stock-items/${match.folderName}/${match.data.mainImage}`;
      if (match.data.mainImageSize) {
        itemImageSizes[it.item] = match.data.mainImageSize;
      }
    }
  }

  const out = `// Generated by scripts/generate-stock-items.js - do not edit by hand.
// Run: node scripts/generate-stock-items.js

export type StockItemHalfRoundLimit = {
  minDiameter: number | null;
  maxDiameter: number | null;
};

export type StockItemArcLimit = {
  minRadius: number | null;
  maxRadius: number | null;
};

/** Bending limits from the Bending Limitations sheet (inches). Null / missing = empty or N/A. */
export type StockItemBendingLimits = {
  straightStyle1: number | null;
  straightStyle2: number | null;
  /** Keyed by half-round size (e.g. "2/0"). */
  halfRound: Record<string, StockItemHalfRoundLimit>;
  /** Keyed by neutral radius inches as string (e.g. "48" for 48"R). */
  arc: Record<string, StockItemArcLimit>;
};

export type StockItem = {
  item: string;
  /** Alternate / industry name from column B; shown in parentheses next to item. */
  alternateName: string | null;
  category: string;
  categorySlug: string;
  dimensions: string;
  thickness: number | null;
  width: number | null;
  configs: string[];
  /** Parenthetical subcategory from the sheet (e.g. "Crown backer", "Cove", "Shoe"). */
  miscellaneousLabel: string | null;
  /** Opening copy from Description by Category (matched to the sheet category). */
  categoryDescription: string | null;
  /** Optional per-item note appended to the opening sentence (Item Specific Notes → Notes). */
  itemNote: string | null;
  finishGrade: string | null;
  matchingWoodProfiles: string | null;
  bendingLimits: StockItemBendingLimits;
};

export type StockItemSection = { label: string; id: string };

export function getStockItemDisplayName(item: Pick<StockItem, "item" | "alternateName">): string {
  return item.alternateName ? item.item + " (" + item.alternateName + ")" : item.item;
}

export const STOCK_ITEM_SECTIONS: StockItemSection[] = ${JSON.stringify(sections, null, 2)};

export const STOCK_ITEMS: StockItem[] = ${JSON.stringify(items, null, 2)};

/** Main image path for each item that has a photo (under /stock-items/). Missing keys = no image yet. */
export const STOCK_ITEM_IMAGES: Record<string, string> = ${JSON.stringify(itemImagePaths, null, 2)};

/** Pixel size of each main photo (artwork is 1:1 scale). */
export const STOCK_ITEM_IMAGE_SIZES: Record<string, { width: number; height: number }> = ${JSON.stringify(itemImageSizes, null, 2)};

export function getStockItemByModel(model: string): StockItem | undefined {
  return STOCK_ITEMS.find((i) => i.item.toUpperCase() === model.toUpperCase());
}

export function getStockItemsByCategory(categorySlug: string): StockItem[] {
  return STOCK_ITEMS.filter((i) => i.categorySlug === categorySlug);
}
`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, out, "utf8");
  console.log("Wrote", OUTPUT_PATH);

  // Copy Project_Info/Stock-Items to public/stock-items (excluding xlsx)
  if (fs.existsSync(PHOTOS_ROOT)) {
    fs.mkdirSync(PUBLIC_STOCK, { recursive: true });
    const dirs = fs.readdirSync(PHOTOS_ROOT, { withFileTypes: true });
    for (const d of dirs) {
      if (d.name === "STOCK ITEM LIST.xlsx") continue;
      const src = path.join(PHOTOS_ROOT, d.name);
      const dest = path.join(PUBLIC_STOCK, d.name);
      if (d.isDirectory()) {
        copyDirSync(src, dest);
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    console.log("Copied photos to public/stock-items");
  }
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

main();
