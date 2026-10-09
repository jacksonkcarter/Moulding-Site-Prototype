import { getOutlinePdfFileName, PROFILE_PDFS_DIR } from "@/lib/profiles";
import { PDFDocument, PageSizes } from "pdf-lib";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

/** Place each source page centered on US Letter (8.5×11") at original scale (never upscale). */
async function wrapOutlineOnLetter(
  sourceBuffer: Buffer,
  title: string,
): Promise<Uint8Array> {
  const source = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
  const output = await PDFDocument.create();
  output.setTitle(title);
  output.setAuthor("Carter Millwork");
  const pageCount = source.getPageCount();
  const [letterW, letterH] = PageSizes.Letter;

  for (let i = 0; i < pageCount; i++) {
    const [embedded] = await output.embedPdf(source, [i]);
    const page = output.addPage(PageSizes.Letter);
    // Fit to the full letter page - do not inset with margins or letter-sized
    // sources (already 8.5×11) get scaled down.
    const scale = Math.min(1, letterW / embedded.width, letterH / embedded.height);
    const drawW = embedded.width * scale;
    const drawH = embedded.height * scale;
    page.drawPage(embedded, {
      x: (letterW - drawW) / 2,
      y: (letterH - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  }

  return output.save();
}

function outlineDownloadBaseName(profileId: string): string {
  const partNumber = profileId.replace(/[^\w.-]+/g, "_");
  return `Flex Trim ${partNumber} Outline`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId: rawId } = await params;
  const profileId = decodeURIComponent(rawId);
  const fileName = getOutlinePdfFileName(profileId);
  if (!fileName) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }
  const filePath = path.join(PROFILE_PDFS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const downloadName = `${outlineDownloadBaseName(profileId)}.pdf`;
  const title = outlineDownloadBaseName(profileId);
  const sourceBuffer = fs.readFileSync(filePath);
  let body: Buffer | Uint8Array = sourceBuffer;
  try {
    body = await wrapOutlineOnLetter(sourceBuffer, title);
  } catch (error) {
    console.error("Failed to wrap outline PDF on letter; serving original.", error);
  }

  const download = request.nextUrl.searchParams.get("download") === "1";
  const headers: HeadersInit = {
    "Content-Type": "application/pdf",
  };
  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${downloadName.replace(/"/g, "")}"`;
  } else {
    headers["Content-Disposition"] = `inline; filename="${downloadName.replace(/"/g, "")}"`;
  }

  return new NextResponse(Buffer.from(body), { headers });
}
