import type { ProfileRow } from "@/lib/profiles";
import type { StockItem, StockItemSection } from "@/data/stock-items";

/** Same option list as Browse Stock Items (category parts + miscellaneous labels). */
export function getStockMouldingFilterOptions(
  sections: StockItemSection[],
  items: StockItem[]
): string[] {
  const set = new Set<string>();
  for (const s of sections) {
    if (s.label === "Miscellaneous") continue;
    const parts = s.label
      .split(/\s+&\s+/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of parts) set.add(p);
  }
  for (const item of items) {
    if (item.miscellaneousLabel) set.add(item.miscellaneousLabel);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

/** Match profile moulding type to stock-style filter chips (exact or split on " & "). */
export function profileMatchesStockMouldingFilter(
  profile: ProfileRow,
  selected: Set<string>
): boolean {
  if (selected.size === 0) return true;
  const mt = profile.mouldingType.trim();
  if (selected.has(mt)) return true;
  const parts = mt.split(/\s+&\s+/).map((p) => p.trim()).filter(Boolean);
  return parts.some((part) => selected.has(part));
}
