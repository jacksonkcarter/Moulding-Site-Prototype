import { getImageFileName } from "@/lib/profiles";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const IMAGES_DIR = path.join(process.cwd(), "Project_Info", "Website-Images");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params;
  const fileName = getImageFileName(profileId);
  if (!fileName) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  const filePath = path.join(IMAGES_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".gif"
        ? "image/gif"
        : "image/jpeg";
  return new NextResponse(buffer, {
    headers: { "Content-Type": contentType },
  });
}
