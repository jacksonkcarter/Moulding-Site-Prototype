const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const p = path.join(__dirname, "..", "Project_Info", "Stock-Items", "STOCK ITEM LIST.xlsx");
const wb = XLSX.readFile(p);
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
console.log(JSON.stringify(rows.slice(0, 50), null, 2));
