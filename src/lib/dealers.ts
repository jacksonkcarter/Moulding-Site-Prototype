import { DEALERS, type Dealer } from "@/data/dealers";
import zipcodes from "zipcodes";

export type { Dealer };

export function getDealers(): Dealer[] {
  return DEALERS;
}

export function zipToCoords(zip: string): { lat: number; lng: number } | null {
  const cleaned = zip.replace(/\D/g, "").slice(0, 5).padStart(5, "0");
  if (cleaned.length !== 5) return null;
  const lookup = zipcodes.lookup(cleaned);
  if (!lookup || lookup.latitude == null || lookup.longitude == null) return null;
  return { lat: Number(lookup.latitude), lng: Number(lookup.longitude) };
}
