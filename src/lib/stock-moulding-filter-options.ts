import type { ProfileRow } from "@/lib/profiles";
import type { StockItem, StockItemSection } from "@/data/stock-items";

/** Categories whose browse/filter chips come from parenthetical sublabels, not "A & B" splits. */
export const STOCK_SUBCATEGORY_SECTIONS = new Set([
  "Miscellaneous",
  "Corner & cove",
  "Shoe & quarter round",
]);

/** Same option list as Browse Stock Items (category parts + subcategory labels). */
export function getStockMouldingFilterOptions(
  sections: StockItemSection[],
  items: StockItem[]
): string[] {
  const set = new Set<string>();
  for (const s of sections) {
    if (STOCK_SUBCATEGORY_SECTIONS.has(s.label)) continue;
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

/** Match a stock item against moulding-type filter chips. */
export function stockItemMatchesMouldingFilter(
  item: StockItem,
  selected: Set<string>
): boolean {
  if (selected.size === 0) return true;
  if (item.miscellaneousLabel && selected.has(item.miscellaneousLabel)) return true;
  if (STOCK_SUBCATEGORY_SECTIONS.has(item.category)) {
    // Sublabel categories only match their parenthetical chip (like Miscellaneous).
    return false;
  }
  const categoryParts = item.category.split(/\s+&\s+/).map((p) => p.trim()).filter(Boolean);
  return categoryParts.some((part) => selected.has(part));
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
