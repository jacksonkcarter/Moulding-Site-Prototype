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

// Category display name: strip "(...)" from Miscellaneous, trim
function cleanCategory(cat) {
  if (!cat || typeof cat !== "string") return "";
  return cat.replace(/\s*\([^)]*\)\s*$/, "").trim().replace(/^\s+|\s+$/g, "");
}

// Extract parenthetical text, e.g. "Miscellaneous (Crown Backer)" -> "Crown Backer"
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

// Config key to folder name: "2/0" -> "20"
function configToFolder(name) {
  return String(name).replace(/\//g, "");
}

function main() {
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const headers = rows[1]; // Item, Category, Thickness, Width, Other (E), then config columns
  const OTHER_COLUMN_INDEX = 4; // Column E
  const configColumns = headers.slice(OTHER_COLUMN_INDEX + 1).filter(Boolean); // skip Other, then 12 FT, 10 FT, ...
  const items = [];
  const categoriesSeen = new Set();
  const categoryOrder = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const itemName = row[0] ? String(row[0]).trim() : "";
    if (!itemName) continue;
    const category = cleanCategory(row[1]);
    if (!category) continue;
    const thickness = row[2];
    const width = row[3];
    const other = row[OTHER_COLUMN_INDEX];
    let dimensions = `${decimalToMixed(thickness)}" x ${decimalToMixed(width)}"`;
    if (category === "Back Band" && (other !== "" && other != null && !String(other).trim().match(/^(X|x)$/i))) {
      const otherNum = typeof other === "number" && !Number.isNaN(other) ? other : parseFloat(String(other).replace(/[^\d.-]/g, ""), 10);
      if (!Number.isNaN(otherNum)) {
        dimensions += ` x ${decimalToMixed(otherNum)}" Rab`;
      }
    }

    const configs = [];
    for (let c = 0; c < configColumns.length; c++) {
      const val = row[OTHER_COLUMN_INDEX + 1 + c];
      if (val === "X" || val === "x" || val === true) {
        configs.push(configColumns[c]);
      }
    }

    const key = category.toLowerCase();
    if (!categoriesSeen.has(key)) {
      categoriesSeen.add(key);
      categoryOrder.push(category);
    }

    const thicknessNum = typeof thickness === "number" && !Number.isNaN(thickness) ? thickness : null;
    const widthNum = typeof width === "number" && !Number.isNaN(width) ? width : null;
    const rawCategory = row[1];
    const miscellaneousLabel =
      category === "Miscellaneous" && getParenthetical(rawCategory) ? getParenthetical(rawCategory) : null;
    items.push({
      item: itemName,
      category,
      categorySlug: categoryToSlug(row[1]),
      dimensions,
      thickness: thicknessNum,
      width: widthNum,
      configs,
      miscellaneousLabel,
    });
  }

  // Scan photo folders: item folder may have subfolders (config slug) and/or main image
  const itemPhotos = {};
  const itemConfigAssets = {};
  if (fs.existsSync(PHOTOS_ROOT)) {
    const dirs = fs.readdirSync(PHOTOS_ROOT, { withFileTypes: true });
    for (const d of dirs) {
      if (d.name === "STOCK ITEM LIST.xlsx") continue;
      const itemPath = path.join(PHOTOS_ROOT, d.name);
      if (!d.isDirectory()) continue;
      const subdirs = fs.readdirSync(itemPath, { withFileTypes: true })
        .filter((x) => x.isDirectory())
        .map((x) => x.name);
      const files = fs.readdirSync(itemPath, { withFileTypes: true })
        .filter((x) => x.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(x.name))
        .map((x) => x.name);
      const mainImage = files.find((f) => f.toLowerCase().startsWith(d.name.toLowerCase())) || files[0];
      itemPhotos[d.name] = { mainImage: mainImage || null, configFolders: subdirs };

      itemConfigAssets[d.name] = {};
      for (const sub of subdirs) {
        const subPath = path.join(itemPath, sub);
        const subFiles = fs.readdirSync(subPath, { withFileTypes: true })
          .filter((x) => x.isFile())
          .map((x) => x.name);
        const images = subFiles.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
        const glb = subFiles.find((f) => /\.glb$/i.test(f)) || null;
        itemConfigAssets[d.name][sub] = { images, glb };
      }
    }
  }

  // Build sections for categories that appear in the sheet, alphabetized by label
  const sections = categoryOrder
    .map((label) => ({
      label,
      id: categoryToSlug(label),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  // Main image path per item: /stock-items/ITEM or /stock-items/ITEM/filename
  const itemImagePaths = {};
  for (const [name, data] of Object.entries(itemPhotos)) {
    if (data.mainImage) {
      itemImagePaths[name] = `/stock-items/${name}/${data.mainImage}`;
    } else {
      itemImagePaths[name] = `/stock-items/${name}.png`;
    }
  }
  for (const it of items) {
    if (!itemImagePaths[it.item]) {
      itemImagePaths[it.item] = `/stock-items/${it.item}.png`;
    }
  }

  const out = `// Generated by scripts/generate-stock-items.js — do not edit by hand.
// Run: node scripts/generate-stock-items.js

export type StockItem = {
  item: string;
  category: string;
  categorySlug: string;
  dimensions: string;
  thickness: number | null;
  width: number | null;
  configs: string[];
  /** When category is Miscellaneous, the text that was in parentheses in the sheet (e.g. "Crown Backer"). */
  miscellaneousLabel: string | null;
};

export type StockItemSection = { label: string; id: string };

export const STOCK_ITEM_SECTIONS: StockItemSection[] = ${JSON.stringify(sections, null, 2)};

export const STOCK_ITEMS: StockItem[] = ${JSON.stringify(items, null, 2)};

/** Main image path for each item (under /stock-items/). */
export const STOCK_ITEM_IMAGES: Record<string, string> = ${JSON.stringify(itemImagePaths, null, 2)};

/** Per-item, per-config-folder (e.g. "20" for 2/0) assets: images and optional .glb. */
export const STOCK_ITEM_CONFIG_ASSETS: Record<string, Record<string, { images: string[]; glb: string | null }>> = ${JSON.stringify(itemConfigAssets, null, 2)};

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
