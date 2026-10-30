/**
 * Gallery media from Project_Info/Gallery/gallery-media.xlsx.
 *
 * One sheet per category folder. Columns: Order | File | Credit | URL
 * - File: local filename, or a YouTube/Instagram URL (or an Excel hyperlink on the cell)
 * - Credit: attribution shown in the lightbox (leave blank to hide the credit)
 * - URL: optional link target for the credit text (or an Excel hyperlink on the URL cell)
 * - Order: sort key (10, 20, 30… so you can insert between)
 *
 * Run: npm run generate-gallery
 * Seed / merge new folder files into the workbook: npm run generate-gallery -- --merge
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const XLSX = require("xlsx");

const ROOT = path.join(__dirname, "..");
const GALLERY_ROOT = path.join(ROOT, "Project_Info", "Gallery");
const WORKBOOK_PATH = path.join(GALLERY_ROOT, "gallery-media.xlsx");
const PUBLIC_GALLERY = path.join(ROOT, "public", "gallery");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "gallery-applications.ts");

let ffmpegPath = null;
try {
  ffmpegPath = require("ffmpeg-static");
} catch {
  ffmpegPath = null;
}

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

/** Folder name on disk → site metadata (public slug may differ from slugify). */
const CATEGORY_META = [
  {
    folder: "Arched & Radius Casing",
    id: "arched-radius-casing",
    title: "Arched & radius casing",
    description:
      "Frame your most striking architectural features with precision. From elegant arched doorways to perfectly round windows, our radius casing bends seamlessly to create a flawless, gap-free border that traditional wood simply cannot match.",
  },
  {
    folder: "Curved Walls",
    id: "curved-walls",
    title: "Curved walls",
    description:
      "Wrap continuous Flex Trim™ around curved walls and columns for a seamless, custom look that rigid moulding cannot achieve.",
  },
  {
    folder: "Vaulted & Domed Ceilings",
    id: "vaulted-domed-ceilings",
    title: "Vaulted & domed ceilings",
    description:
      "Follow vaults, domes, and tray ceilings with crown and trim that bends to the architecture instead of fighting it.",
  },
  {
    folder: "Decorative Panel",
    id: "decorative-applied-mouldings",
    title: "Decorative applied mouldings",
    description:
      "Add depth and sophisticated character to any space. Our flexible panel mouldings allow you to design intricate wainscoting, sweeping picture frames, and custom geometric wall features without the limitations of rigid millwork.",
  },
  {
    folder: "Stained Flex Trim",
    id: "stained-flex-trim",
    title: "Stained Flex Trim™",
    description:
      "See stain-grade Flex Trim™ finished to match real wood grain across mouldings, arches, and architectural details.",
  },
  {
    folder: "Outdoor Installations",
    id: "outdoor-installations",
    title: "Outdoor installations",
    description:
      "Flexible moulding built for exterior trim, arches, and architectural details that stand up to the elements.",
  },
  {
    folder: "On the Job Site",
    id: "on-the-job-site",
    title: "On the job site",
    description:
      "Mid-install photos of Flex Trim™ in place—installed and ready for paint or stain.",
  },
  {
    folder: "Featured",
    id: "featured",
    title: "Featured",
    description:
      "Flex Trim™ in the spotlight—creators, TV, and standout projects featuring our moulding.",
  },
];

const HEADERS = ["Order", "File", "Credit", "URL"];

function normalizeCredit(credit, file) {
  const value = String(credit || "").trim();
  if (!value) return undefined;
  const fileName = String(file || "").trim().split(/[/\\]/).pop();
  if (fileName && value === fileName) return undefined;
  // Placeholder left over from seeding / renames
  if (/^FlexTrim-[a-f0-9]+(\.[a-z0-9]+)?$/i.test(value)) return undefined;
  return value;
}

function normalizeCreditUrl(url) {
  const value = String(url || "").trim();
  if (!value) return undefined;
  if (isRemoteUrl(value)) return value;
  // Allow www.example.com without scheme
  if (/^[\w.-]+\.[a-z]{2,}([/:].*)?$/i.test(value)) return `https://${value}`;
  return undefined;
}

function sheetNameForFolder(folder) {
  // Excel sheet names max 31 chars
  return folder.length <= 31 ? folder : folder.slice(0, 31);
}

function isRemoteUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

function parseYoutubeId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return u.pathname.split("/").filter(Boolean)[0] || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/live/")) return u.pathname.split("/")[2] || null;
      return u.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function parseInstagram(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host !== "instagram.com" && host !== "instagr.am") return null;
    const parts = u.pathname.split("/").filter(Boolean);
    // /p/CODE /reel/CODE /reels/CODE /tv/CODE
    if (parts.length >= 2 && ["p", "reel", "reels", "tv"].includes(parts[0])) {
      const shortcode = parts[1];
      const kind = parts[0] === "reels" ? "reel" : parts[0];
      return {
        shortcode,
        url: `https://www.instagram.com/${kind}/${shortcode}/`,
        embedPath: kind === "p" ? "p" : kind === "tv" ? "tv" : "reel",
      };
    }
  } catch {
    return null;
  }
  return null;
}

function cellAddress(colIndex, rowIndex) {
  // 0-based → A1 style
  let col = colIndex;
  let name = "";
  while (col >= 0) {
    name = String.fromCharCode((col % 26) + 65) + name;
    col = Math.floor(col / 26) - 1;
  }
  return `${name}${rowIndex + 1}`;
}

function getCellHyperlink(sheet, address) {
  const cell = sheet[address];
  if (!cell || !cell.l) return null;
  const target = cell.l.Target || cell.l.target;
  return target ? String(target).trim() : null;
}

function listFolderMedia(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  const names = fs
    .readdirSync(folderPath)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      return MEDIA_EXT.has(ext) && fs.statSync(path.join(folderPath, name)).isFile();
    });

  const lowerSet = new Set(names.map((n) => n.toLowerCase()));
  // Skip poster stills that match a video basename, and .mov when .mp4 exists.
  return names
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      const base = path.basename(name, path.extname(name));
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        if (lowerSet.has(`${base}.mp4`.toLowerCase())) return false;
        if (lowerSet.has(`${base}.webm`.toLowerCase())) return false;
        if (lowerSet.has(`${base}.mov`.toLowerCase())) return false;
      }
      if (ext === ".mov" && lowerSet.has(`${base}.mp4`.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Prefer strip images that start with "1"
      const aStrip = /^1[\s._-]/.test(a) ? 0 : 1;
      const bStrip = /^1[\s._-]/.test(b) ? 0 : 1;
      if (aStrip !== bStrip) return aStrip - bStrip;
      return a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
    });
}

function headerIndex(headers, names) {
  const lower = headers.map((h) => String(h || "").trim().toLowerCase());
  for (const name of names) {
    const i = lower.indexOf(name);
    if (i >= 0) return i;
  }
  return -1;
}

function readSheetRows(workbook, folder) {
  const name = sheetNameForFolder(folder);
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];

  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  if (raw.length < 2) return [];

  const headers = raw[0] || [];
  const orderIdx = headerIndex(headers, ["order"]) >= 0 ? headerIndex(headers, ["order"]) : 0;
  const fileIdx = headerIndex(headers, ["file"]) >= 0 ? headerIndex(headers, ["file"]) : 1;
  const creditIdx = headerIndex(headers, ["credit"]) >= 0 ? headerIndex(headers, ["credit"]) : 2;
  const urlIdx = headerIndex(headers, ["url", "link", "credit url", "crediturl"]);

  const rows = [];
  for (let r = 1; r < raw.length; r++) {
    const orderRaw = raw[r][orderIdx];
    const fileRaw = String(raw[r][fileIdx] ?? "").trim();
    const creditRaw = String(raw[r][creditIdx] ?? "").trim();
    const urlRaw = urlIdx >= 0 ? String(raw[r][urlIdx] ?? "").trim() : "";
    if (!fileRaw && !creditRaw && !urlRaw) continue;

    const fileAddr = cellAddress(fileIdx, r);
    const fileHyperlink = getCellHyperlink(sheet, fileAddr);
    const creditAddr = cellAddress(creditIdx, r);
    const creditHyperlink = getCellHyperlink(sheet, creditAddr);
    const urlAddr = urlIdx >= 0 ? cellAddress(urlIdx, r) : null;
    const urlHyperlink = urlAddr ? getCellHyperlink(sheet, urlAddr) : null;

    const orderNum = Number(orderRaw);
    rows.push({
      order: Number.isFinite(orderNum) ? orderNum : r * 10,
      file: fileRaw,
      credit: creditRaw,
      // URL column, or Excel hyperlink on URL / Credit cells
      url:
        normalizeCreditUrl(urlRaw) ||
        normalizeCreditUrl(urlHyperlink) ||
        normalizeCreditUrl(creditHyperlink) ||
        "",
      hyperlink: fileHyperlink && isRemoteUrl(fileHyperlink) ? fileHyperlink : null,
      rowIndex: r,
    });
  }

  rows.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  return rows;
}

function buildSheetAoA(rows) {
  const aoa = [HEADERS];
  for (const row of rows) {
    aoa.push([row.order, row.file, row.credit || "", row.url || ""]);
  }
  return aoa;
}

function seedRowsFromFolder(folderPath) {
  const files = listFolderMedia(folderPath);
  return files.map((file, i) => ({
    order: (i + 1) * 10,
    file,
    credit: "",
    url: "",
    hyperlink: null,
  }));
}

function mergeRows(existing, folderPath) {
  const onDisk = listFolderMedia(folderPath);
  const known = new Set(
    existing
      .map((r) => r.file)
      .filter((f) => f && !isRemoteUrl(f))
      .map((f) => f.toLowerCase())
  );
  const maxOrder = existing.reduce((m, r) => Math.max(m, r.order || 0), 0);
  let next = Math.ceil((maxOrder || 0) / 10) * 10 + 10;
  const merged = [...existing];
  for (const file of onDisk) {
    if (known.has(file.toLowerCase())) continue;
    merged.push({ order: next, file, credit: "", url: "", hyperlink: null });
    next += 10;
  }
  merged.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  return merged;
}

function writeWorkbook(categoryRows) {
  const workbook = XLSX.utils.book_new();
  for (const meta of CATEGORY_META) {
    const rows = categoryRows.get(meta.folder) || [];
    const sheet = XLSX.utils.aoa_to_sheet(buildSheetAoA(rows));
    sheet["!cols"] = [{ wch: 8 }, { wch: 28 }, { wch: 40 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, sheet, sheetNameForFolder(meta.folder));
  }
  XLSX.writeFile(workbook, WORKBOOK_PATH);
}

function ensureWorkbook(doMerge) {
  const categoryRows = new Map();

  if (!fs.existsSync(WORKBOOK_PATH)) {
    for (const meta of CATEGORY_META) {
      const folderPath = path.join(GALLERY_ROOT, meta.folder);
      categoryRows.set(meta.folder, seedRowsFromFolder(folderPath));
    }
    writeWorkbook(categoryRows);
    console.log(`Created ${path.relative(ROOT, WORKBOOK_PATH)}`);
    return categoryRows;
  }

  const workbook = XLSX.readFile(WORKBOOK_PATH, { cellStyles: true });
  let needsUrlColumn = false;
  for (const meta of CATEGORY_META) {
    const sheet = workbook.Sheets[sheetNameForFolder(meta.folder)];
    if (!sheet) {
      needsUrlColumn = true;
      continue;
    }
    const headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" })[0] || [];
    const headers = headerRow.map((h) => String(h || "").trim().toLowerCase());
    if (!headers.includes("url") && !headers.includes("link") && !headers.includes("credit url")) {
      needsUrlColumn = true;
    }
  }

  for (const meta of CATEGORY_META) {
    let rows = readSheetRows(workbook, meta.folder);
    if (rows.length === 0) {
      rows = seedRowsFromFolder(path.join(GALLERY_ROOT, meta.folder));
    } else if (doMerge) {
      rows = mergeRows(rows, path.join(GALLERY_ROOT, meta.folder));
    }
    categoryRows.set(meta.folder, rows);
  }

  // Only rewrite the spreadsheet when explicitly merging. Never auto-write just to
  // add columns — that previously wiped user-entered URL values.
  if (doMerge) {
    writeWorkbook(categoryRows);
    console.log(`Merged new files into ${path.relative(ROOT, WORKBOOK_PATH)}`);
  } else if (needsUrlColumn) {
    console.warn(
      `Note: add a URL column (Order | File | Credit | URL) to ${path.relative(ROOT, WORKBOOK_PATH)} if missing. ` +
        `This script will not rewrite the workbook unless you pass --merge.`,
    );
  }

  return categoryRows;
}

function resolveRemote(file, hyperlink) {
  const candidates = [file, hyperlink].filter(Boolean);
  for (const c of candidates) {
    if (!isRemoteUrl(c)) continue;
    const yt = parseYoutubeId(c);
    if (yt) return { kind: "youtube", videoId: yt, url: c };
    const ig = parseInstagram(c);
    if (ig) return { kind: "instagram", ...ig };
  }
  return null;
}

function findPoster(folderPath, publicSlug, videoBasename) {
  const candidates = [
    `${videoBasename}.jpg`,
    `${videoBasename}.jpeg`,
    `${videoBasename}.png`,
    `${videoBasename}.webp`,
    `${videoBasename}.JPG`,
    `${videoBasename}.JPEG`,
    `${videoBasename}.PNG`,
  ];
  for (const name of candidates) {
    const inProject = path.join(folderPath, name);
    const inPublic = path.join(PUBLIC_GALLERY, publicSlug, name);
    if (fs.existsSync(inProject) || fs.existsSync(inPublic)) {
      return `/gallery/${publicSlug}/${name}`;
    }
  }
  return null;
}

/** Extract a poster frame next to the video (Project_Info + public). */
function ensureVideoPoster(folderPath, publicSlug, videoFilename) {
  const base = path.basename(videoFilename, path.extname(videoFilename));
  const existing = findPoster(folderPath, publicSlug, base);
  if (existing) return existing;

  if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
    console.warn(`  No poster for ${videoFilename} (ffmpeg unavailable)`);
    return null;
  }

  const posterName = `${base}.jpg`;
  const srcVideo = path.join(folderPath, videoFilename);
  const destProject = path.join(folderPath, posterName);
  const destPublic = path.join(PUBLIC_GALLERY, publicSlug, posterName);
  fs.mkdirSync(path.join(PUBLIC_GALLERY, publicSlug), { recursive: true });

  const result = spawnSync(
    ffmpegPath,
    ["-y", "-i", srcVideo, "-ss", "1", "-frames:v", "1", "-update", "1", "-q:v", "3", destProject],
    { encoding: "utf8" },
  );
  if (result.status !== 0 || !fs.existsSync(destProject)) {
    console.warn(`  Poster extract failed for ${videoFilename}`);
    return null;
  }
  copyFileResilient(destProject, destPublic);
  console.log(`  Poster: ${posterName}`);
  return `/gallery/${publicSlug}/${posterName}`;
}

async function downloadUrlToFile(url, destPath) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

/** Fetch Instagram reel/post thumbnail via oEmbed and cache under public/gallery. */
async function ensureInstagramPoster(publicSlug, shortcode, permalink) {
  const posterName = `ig-${shortcode}.jpg`;
  const destPublic = path.join(PUBLIC_GALLERY, publicSlug, posterName);
  const publicSrc = `/gallery/${publicSlug}/${posterName}`;
  if (fs.existsSync(destPublic) && fs.statSync(destPublic).size > 1000) {
    return publicSrc;
  }

  try {
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(permalink)}`;
    const res = await fetch(oembedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) throw new Error(`oEmbed HTTP ${res.status}`);
    const data = await res.json();
    const thumb = data.thumbnail_url;
    if (!thumb) throw new Error("oEmbed missing thumbnail_url");
    await downloadUrlToFile(thumb, destPublic);
    console.log(`  Instagram poster: ${posterName}`);
    return publicSrc;
  } catch (err) {
    console.warn(`  Instagram poster failed for ${shortcode}: ${err.message}`);
    return null;
  }
}

function copyFileResilient(src, dest) {
  try {
    if (fs.existsSync(dest)) {
      const s = fs.statSync(src);
      const d = fs.statSync(dest);
      if (s.size === d.size && s.mtimeMs <= d.mtimeMs) return true;
    }
    fs.copyFileSync(src, dest);
    return true;
  } catch (err) {
    if (fs.existsSync(dest)) {
      console.warn(`  Could not refresh (using existing): ${path.relative(ROOT, dest)} (${err.code || err.message})`);
      return true;
    }
    console.warn(`  Copy failed (skipped): ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)} (${err.code || err.message})`);
    return false;
  }
}

function copyLocalFile(folderPath, publicSlug, filename) {
  const src = path.join(folderPath, filename);
  if (!fs.existsSync(src)) {
    console.warn(`  Missing file (skipped): ${metaPath(folderPath, filename)}`);
    return false;
  }
  const destDir = path.join(PUBLIC_GALLERY, publicSlug);
  fs.mkdirSync(destDir, { recursive: true });
  if (!copyFileResilient(src, path.join(destDir, filename))) return false;
  // Also copy matching poster if present
  const base = path.basename(filename, path.extname(filename));
  const ext = path.extname(filename).toLowerCase();
  if ([".mp4", ".webm", ".mov"].includes(ext)) {
    for (const pExt of [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG"]) {
      const posterName = `${base}${pExt}`;
      const posterSrc = path.join(folderPath, posterName);
      if (fs.existsSync(posterSrc)) {
        copyFileResilient(posterSrc, path.join(destDir, posterName));
      }
    }
  }
  return true;
}

function metaPath(folderPath, filename) {
  return path.relative(ROOT, path.join(folderPath, filename));
}

function withCreditFields(item, row) {
  const credit = normalizeCredit(row.credit, row.file);
  const creditUrl = normalizeCreditUrl(row.url);
  if (credit) item.credit = credit;
  if (creditUrl) item.creditUrl = creditUrl;
  return item;
}

async function toGalleryItem(meta, row) {
  const folderPath = path.join(GALLERY_ROOT, meta.folder);
  const credit = normalizeCredit(row.credit, row.file);
  const remote = resolveRemote(row.file, row.hyperlink);

  if (remote?.kind === "youtube") {
    return withCreditFields(
      {
        type: "youtube",
        videoId: remote.videoId,
        title: credit,
      },
      row,
    );
  }
  if (remote?.kind === "instagram") {
    const poster = await ensureInstagramPoster(meta.id, remote.shortcode, remote.url);
    return withCreditFields(
      {
        type: "instagram",
        url: remote.url,
        shortcode: remote.shortcode,
        embedPath: remote.embedPath,
        title: credit,
        poster: poster || undefined,
      },
      row,
    );
  }

  const filename = row.file;
  if (!filename || isRemoteUrl(filename)) {
    console.warn(`  Unrecognized media entry (skipped): ${filename || "(empty)"}`);
    return null;
  }

  if (!copyLocalFile(folderPath, meta.id, filename)) return null;

  const ext = path.extname(filename).toLowerCase();
  const publicSrc = `/gallery/${meta.id}/${filename}`;

  if ([".mp4", ".webm", ".mov"].includes(ext)) {
    const poster = ensureVideoPoster(folderPath, meta.id, filename) || "";
    return withCreditFields(
      {
        type: "video",
        src: publicSrc,
        poster,
      },
      row,
    );
  }

  return withCreditFields(
    {
      type: "image",
      src: publicSrc,
    },
    row,
  );
}

function serializeItem(item) {
  return JSON.stringify(item, null, 2).replace(/\n/g, "\n      ");
}

async function main() {
  const doMerge = process.argv.includes("--merge") || process.argv.includes("--init");
  if (!fs.existsSync(GALLERY_ROOT)) {
    console.error("Missing", GALLERY_ROOT);
    process.exit(1);
  }

  const categoryRows = ensureWorkbook(doMerge || !fs.existsSync(WORKBOOK_PATH));

  // Fresh public gallery dirs for categories we manage
  for (const meta of CATEGORY_META) {
    const dest = path.join(PUBLIC_GALLERY, meta.id);
    fs.mkdirSync(dest, { recursive: true });
  }

  const categories = [];
  for (const meta of CATEGORY_META) {
    const rows = categoryRows.get(meta.folder) || [];
    console.log(`${meta.folder}: ${rows.length} row(s)`);
    const images = [];
    for (const row of rows) {
      const item = await toGalleryItem(meta, row);
      if (item) images.push(item);
    }

    let stripImage = images.find(
      (it) => it.type === "image" && /^\/gallery\/[^/]+\/1[\s._-]/.test(it.src)
    )?.src;
    if (!stripImage) {
      const firstImage = images.find((it) => it.type === "image");
      const firstVideoPoster = images.find((it) => it.type === "video" && it.poster);
      const firstIgPoster = images.find((it) => it.type === "instagram" && it.poster);
      const firstYoutube = images.find((it) => it.type === "youtube");
      if (firstImage) stripImage = firstImage.src;
      else if (firstVideoPoster) stripImage = firstVideoPoster.poster;
      else if (firstIgPoster) stripImage = firstIgPoster.poster;
      else if (firstYoutube) stripImage = `https://img.youtube.com/vi/${firstYoutube.videoId}/hqdefault.jpg`;
    }

    categories.push({
      id: meta.id,
      title: meta.title,
      description: meta.description,
      stripImage,
      images,
    });
  }

  const body = categories
    .map((cat) => {
      const imagesLit = cat.images.map((item) => serializeItem(item)).join(",\n      ");
      return `  {
    id: ${JSON.stringify(cat.id)},
    title: ${JSON.stringify(cat.title)},
    description: ${JSON.stringify(cat.description)},
    stripImage: ${cat.stripImage ? JSON.stringify(cat.stripImage) : "undefined"},
    images: [
      ${imagesLit}
    ],
  }`;
    })
    .join(",\n");

  const out = `/**
 * Gallery categories — generated by scripts/generate-gallery.js
 * Source: Project_Info/Gallery/gallery-media.xlsx (and category folders).
 * Run: npm run generate-gallery
 * Merge new folder files into the spreadsheet: npm run generate-gallery -- --merge
 *
 * File column: local filename, or YouTube/Instagram URL.
 * Credit column: attribution (blank = no credit shown).
 * URL column: optional link for the credit text.
 * Excel hyperlinks on the File / URL cells also count.
 * Videos are not mounted until the lightbox opens.
 */

export type GalleryImage = {
  type: "image";
  src: string;
  credit?: string;
  creditUrl?: string;
};

export type GalleryFileVideo = {
  type: "video";
  src: string;
  poster: string;
  credit?: string;
  creditUrl?: string;
};

export type GalleryYoutubeVideo = {
  type: "youtube";
  videoId: string;
  poster?: string;
  title?: string;
  credit?: string;
  creditUrl?: string;
};

export type GalleryInstagramVideo = {
  type: "instagram";
  url: string;
  shortcode: string;
  /** Instagram embed path segment: p | reel | tv */
  embedPath: "p" | "reel" | "tv";
  poster?: string;
  title?: string;
  credit?: string;
  creditUrl?: string;
};

/** @deprecated Prefer GalleryFileVideo */
export type GalleryVideo = GalleryFileVideo;

export type GalleryItem =
  | GalleryImage
  | GalleryFileVideo
  | GalleryYoutubeVideo
  | GalleryInstagramVideo
  | string;

export function isGalleryImage(item: GalleryItem): item is GalleryImage {
  return typeof item === "object" && item.type === "image";
}

export function isGalleryFileVideo(item: GalleryItem): item is GalleryFileVideo {
  return typeof item === "object" && item.type === "video";
}

export function isGalleryYoutube(item: GalleryItem): item is GalleryYoutubeVideo {
  return typeof item === "object" && item.type === "youtube";
}

export function isGalleryInstagram(item: GalleryItem): item is GalleryInstagramVideo {
  return typeof item === "object" && item.type === "instagram";
}

/** True for local file videos, YouTube, or Instagram (play-button tiles). */
export function isGalleryVideo(
  item: GalleryItem,
): item is GalleryFileVideo | GalleryYoutubeVideo | GalleryInstagramVideo {
  return isGalleryFileVideo(item) || isGalleryYoutube(item) || isGalleryInstagram(item);
}

export function galleryYoutubePoster(videoId: string): string {
  return \`https://img.youtube.com/vi/\${videoId}/hqdefault.jpg\`;
}

export function galleryCredit(item: GalleryItem): string | undefined {
  if (typeof item === "string") return undefined;
  const credit = item.credit?.trim();
  return credit || undefined;
}

export function galleryCreditUrl(item: GalleryItem): string | undefined {
  if (typeof item === "string") return undefined;
  const url = item.creditUrl?.trim();
  return url || undefined;
}

/** Still used for strip backgrounds, grid tiles, and orientation probing. */
export function galleryPreviewSrc(item: GalleryItem): string | null {
  if (typeof item === "string") return item;
  if (item.type === "image") return item.src;
  if (item.type === "video") return item.poster || null;
  if (item.type === "youtube") return item.poster ?? galleryYoutubePoster(item.videoId);
  return item.poster || null;
}

/** Stable identity for thumbs / lightbox. */
export function galleryItemKey(item: GalleryItem): string {
  if (typeof item === "string") return item;
  if (item.type === "image") return item.src;
  if (item.type === "video") return item.src;
  if (item.type === "youtube") return \`youtube:\${item.videoId}\`;
  return \`instagram:\${item.shortcode}\`;
}

export type ApplicationCategory = {
  id: string;
  title: string;
  description: string;
  /** Background image for the collapsed strip (first image used if not set). */
  stripImage?: string;
  /** Media for the expanded grid (images and optional videos). */
  images: GalleryItem[];
};

export const GALLERY_APPLICATIONS: ApplicationCategory[] = [
${body}
];
`;

  fs.writeFileSync(OUTPUT_PATH, out, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
