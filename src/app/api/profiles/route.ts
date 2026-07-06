import { getUniqueMouldingTypes, loadProfilesWithImages } from "@/lib/profiles";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profiles = loadProfilesWithImages();
    const mouldingTypes = getUniqueMouldingTypes(profiles);
    return NextResponse.json({ profiles, mouldingTypes });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load profiles" },
      { status: 500 }
    );
  }
}
