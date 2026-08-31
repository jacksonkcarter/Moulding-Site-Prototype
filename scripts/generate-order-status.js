const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const PROJECT_ROOT = path.join(__dirname, "..");
const CSV_PATH = path.join(PROJECT_ROOT, "Project_Info", "Order-Status.csv");
const EXCEL_PATH = path.join(PROJECT_ROOT, "Project_Info", "Order-Status.xlsx");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "order-status.json");

function trimCell(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeZip(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.slice(0, 5).padStart(5, "0");
}

function normalizeHeaderKey(key) {
  return String(key ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/** Pick a cell by trying several header aliases (CSV headers vary in case). */
function cell(row, ...aliases) {
  const map = {};
  for (const [key, value] of Object.entries(row)) {
    map[normalizeHeaderKey(key)] = value;
  }
  for (const alias of aliases) {
    const key = normalizeHeaderKey(alias);
    if (key in map) return map[key];
  }
  return null;
}

/**
 * Parse dates from CSV (M/D/YYYY or M/D/YY) or Excel serials → YYYY-MM-DD.
 * Blank / (Null) → null.
 */
function toIsoDate(value) {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = trimCell(value);
  if (!raw || raw.toLowerCase() === "(null)") return null;

  const mdY = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (mdY) {
    const month = Number(mdY[1]);
    const day = Number(mdY[2]);
    let year = Number(mdY[3]);
    if (mdY[3].length === 2) {
      // Two-digit years: 00–69 → 2000s, 70–99 → 1900s
      year += year < 70 ? 2000 : 1900;
    }
    const date = new Date(Date.UTC(year, month - 1, day));
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  }

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const serial = Number(raw);
  if (Number.isFinite(serial) && serial > 20000 && serial < 100000) {
    const date = new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  }

  return null;
}

function normalizeTracking(value) {
  const raw = trimCell(value);
  if (!raw || raw.toLowerCase() === "(null)" || raw.toUpperCase() === "OPEN") return "";
  return raw;
}

function toQty(value) {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function main() {
  const sourcePath = fs.existsSync(CSV_PATH) ? CSV_PATH : EXCEL_PATH;
  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing order status file: ${CSV_PATH} (or ${EXCEL_PATH})`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(sourcePath, { cellDates: true, raw: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true });

  const lines = rows.map((row) => ({
    orderNo: trimCell(cell(row, "ORDER_NO", "order_no")),
    recordNo: trimCell(cell(row, "RECORD_NO", "record_no")),
    part: trimCell(cell(row, "PART", "part")),
    description: trimCell(cell(row, "DESCRIPTION", "description")),
    qtyOrdered: toQty(cell(row, "QTY_ORDERED", "qty_ordered")),
    qtyShipped: toQty(cell(row, "qty_shipped", "QTY_SHIPPED")),
    qtyCompleted: toQty(cell(row, "QTY_COMPLETED", "qty_completed")),
    productLine: trimCell(cell(row, "PRODUCT_LINE", "product_line")).toUpperCase(),
    customerPo: trimCell(cell(row, "CUSTOMER_PO", "customer_po")),
    dateOrder: toIsoDate(cell(row, "DATE_ORDER", "date_order")),
    dateDue: toIsoDate(cell(row, "DATE_DUE", "date_due")),
    dateShipped: toIsoDate(cell(row, "date_shipped", "DATE_SHIPPED")),
    customerName: trimCell(cell(row, "NAME_CUSTOMER", "name_customer")),
    zip: normalizeZip(cell(row, "zip", "ZIP")),
    trackingNo: normalizeTracking(cell(row, "tracking_no", "TRACKING_NO")),
  }));

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(lines)}\n`, "utf8");
  console.log(
    `Wrote ${lines.length} order lines from ${path.relative(PROJECT_ROOT, sourcePath)} → ${path.relative(PROJECT_ROOT, OUTPUT_PATH)}`,
  );
}

main();
