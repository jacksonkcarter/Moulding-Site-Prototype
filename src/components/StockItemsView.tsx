"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import { BendingStylesCard } from "@/components/BendingStylesCard";
import { BoundNumberInput } from "@/components/BoundNumberInput";
import { ContactLink } from "@/components/ContactLink";
import { FilterSection, FilterResetAllButton } from "@/components/FilterSection";
import type { StockItem, StockItemSection } from "@/data/stock-items";
import { getStockItemDisplayName, STOCK_ITEM_IMAGE_SIZES } from "@/data/stock-items";
import { getStockConfigGroups } from "@/lib/stock-item-configs";
import {
  getStockMouldingFilterOptions,
  stockItemMatchesMouldingFilter,
} from "@/lib/stock-moulding-filter-options";
import { dimensionFilterBounds } from "@/lib/format-inches";

type StockItemsViewProps = {
  sections: StockItemSection[];
  items: StockItem[];
  images: Record<string, string>;
};

const SEARCH_FILTER_OPTIONS = [
  { value: "contains", label: "Contains" },
  { value: "starts with", label: "Starts with" },
  { value: "ends with", label: "Ends with" },
  { value: "equals", label: "Equals" },
  { value: "does not contain", label: "Does not contain" },
] as const;

type SearchFilterType = (typeof SEARCH_FILTER_OPTIONS)[number]["value"];

function categoryImageCanvas(
  categoryItems: StockItem[],
): { width: number; height: number } | null {
  let width = 0;
  let height = 0;
  for (const item of categoryItems) {
    const size = STOCK_ITEM_IMAGE_SIZES[item.item];
    if (!size) continue;
    width = Math.max(width, size.width);
    height = Math.max(height, size.height);
  }
  return width > 0 && height > 0 ? { width, height } : null;
}

function itemMatchesSearch(itemName: string, query: string, filterType: SearchFilterType): boolean {
  const name = itemName.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  switch (filterType) {
    case "contains":
      return name.includes(q);
    case "starts with":
      return name.startsWith(q);
    case "ends with":
      return name.endsWith(q);
    case "equals":
      return name === q;
    case "does not contain":
      return !name.includes(q);
    default:
      return name.includes(q);
  }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getStockDimensionBounds(
  items: StockItem[],
  key: "thickness" | "width",
  fallbackMax: number,
): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const item of items) {
    const value = item[key];
    if (value != null) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  if (min === Infinity) min = 0;
  if (max === -Infinity) max = fallbackMax;
  return [min, max];
}

export function StockItemsView({ sections, items, images }: StockItemsViewProps) {
  const searchParams = useSearchParams();
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<Set<string>>(() => {
    const t = searchParams.get("types");
    if (!t) return new Set();
    return new Set(
      t
        .split(",")
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean),
    );
  });

  useEffect(() => {
    const t = searchParams.get("types");
    if (!t) return;
    setSelectedFilterOptions(
      new Set(
        t
          .split(",")
          .map((s) => decodeURIComponent(s.trim()))
          .filter(Boolean),
      ),
    );
  }, [searchParams]);

  const [typesOpen, setTypesOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(true);
  const [thicknessOpen, setThicknessOpen] = useState(true);
  const [widthOpen, setWidthOpen] = useState(true);
  const [itemQuery, setItemQuery] = useState("");
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>("contains");
  const [thicknessRange, setThicknessRange] = useState<[number, number]>(() =>
    getStockDimensionBounds(items, "thickness", 2),
  );
  const [widthRange, setWidthRange] = useState<[number, number]>(() =>
    getStockDimensionBounds(items, "width", 12),
  );

  const itemQueryDebounced = useDebounce(itemQuery, 150);
  const thicknessMinDebounced = useDebounce(thicknessRange[0], 150);
  const thicknessMaxDebounced = useDebounce(thicknessRange[1], 150);
  const widthMinDebounced = useDebounce(widthRange[0], 150);
  const widthMaxDebounced = useDebounce(widthRange[1], 150);

  const filterOptions = useMemo(
    () => getStockMouldingFilterOptions(sections, items),
    [sections, items]
  );

  const thicknessBounds = useMemo(
    () => getStockDimensionBounds(items, "thickness", 2),
    [items],
  );

  const widthBounds = useMemo(
    () => getStockDimensionBounds(items, "width", 12),
    [items],
  );

  const toggleFilterOption = useCallback((option: string) => {
    setSelectedFilterOptions((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }, []);

  const resetAllFilters = useCallback(() => {
    setItemQuery("");
    setSearchFilterType("contains");
    setSelectedFilterOptions(new Set());
    setThicknessRange(thicknessBounds);
    setWidthRange(widthBounds);
  }, [thicknessBounds, widthBounds]);

  const itemMatchesTypeFilter = useCallback((item: StockItem): boolean => {
    return stockItemMatchesMouldingFilter(item, selectedFilterOptions);
  }, [selectedFilterOptions]);

  const filteredItems = useMemo(() => {
    const [widthMin, widthMax] = dimensionFilterBounds(widthMinDebounced, widthMaxDebounced);
    let result = items;
    if (selectedFilterOptions.size > 0) {
      result = result.filter(itemMatchesTypeFilter);
    }
    result = result.filter((item) => {
      const haystack = item.alternateName
        ? `${item.item} ${item.alternateName}`
        : item.item;
      return itemMatchesSearch(haystack, itemQueryDebounced, searchFilterType);
    });
    result = result.filter((item) => {
      if (item.thickness != null) {
        if (item.thickness < thicknessMinDebounced || item.thickness > thicknessMaxDebounced) return false;
      }
      return true;
    });
    result = result.filter((item) => {
      if (item.width != null) {
        if (item.width < widthMin || item.width > widthMax) return false;
      }
      return true;
    });
    return result;
  }, [
    items,
    selectedFilterOptions,
    itemQueryDebounced,
    searchFilterType,
    thicknessMinDebounced,
    thicknessMaxDebounced,
    widthMinDebounced,
    widthMaxDebounced,
    itemMatchesTypeFilter,
  ]);

  const sectionsToShow = useMemo(() => {
    const categoryIdsWithResults = new Set(filteredItems.map((i) => i.categorySlug));
    return sections.filter((s) => categoryIdsWithResults.has(s.id));
  }, [sections, filteredItems]);

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, StockItem[]>();
    for (const item of filteredItems) {
      const list = map.get(item.categorySlug) ?? [];
      list.push(item);
      map.set(item.categorySlug, list);
    }
    return map;
  }, [filteredItems]);

  const canvasByCategory = useMemo(() => {
    const bySlug = new Map<string, StockItem[]>();
    for (const item of items) {
      if (item.categorySlug === "miscellaneous") continue;
      const list = bySlug.get(item.categorySlug) ?? [];
      list.push(item);
      bySlug.set(item.categorySlug, list);
    }
    const canvases = new Map<string, { width: number; height: number }>();
    for (const [slug, categoryItems] of bySlug) {
      const canvas = categoryImageCanvas(categoryItems);
      if (canvas) canvases.set(slug, canvas);
    }
    return canvases;
  }, [items]);

  return (
    <section id="stock-items" className="scroll-mt-20 border-t border-neutral-200 bg-white pb-20 pt-5">
      <div className="w-full px-4 sm:px-6">
        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 text-center">
          Browse stock items
        </h2>
        <p className="mt-2 text-neutral-600 text-center">
          View custom profiles in our{" "}
          <Link href="/product-info/profile-search" className="font-medium text-primary hover:underline">
            browser
          </Link>{" "}
          or{" "}
          <Link href="/forms-literature/catalog" className="font-medium text-primary hover:underline">
            catalog
          </Link>
          , or{" "}
          <ContactLink action="popover" className="font-medium text-primary hover:underline">
            contact us
          </ContactLink>{" "}
          for even more options
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 self-start min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 lg:w-72">
            <BendingStylesCard flush />
            <div className="border-b border-neutral-200 px-4 pb-3 pt-3">
              <FilterResetAllButton onClick={resetAllFilters} />
            </div>
            <div className="space-y-0 p-4">
              <FilterSection
                title="Item"
                open={searchOpen}
                onToggle={() => setSearchOpen((o) => !o)}
                onReset={() => {
                  setItemQuery("");
                  setSearchFilterType("contains");
                }}
              >
                <div className="min-w-0 space-y-2">
                  <input
                    type="text"
                    value={itemQuery}
                    onChange={(e) => setItemQuery(e.target.value)}
                    placeholder="Filter by item name..."
                    className="w-full min-w-0 rounded border border-neutral-300 px-2 py-1.5 text-xs placeholder-neutral-400 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                  />
                  <select
                    value={searchFilterType}
                    onChange={(e) => setSearchFilterType(e.target.value as SearchFilterType)}
                    className="w-full min-w-0 rounded border border-neutral-300 px-2 py-1.5 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                  >
                    {SEARCH_FILTER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FilterSection>
              <FilterSection
                title="Moulding type"
                open={typesOpen}
                onToggle={() => setTypesOpen((o) => !o)}
                onReset={() => setSelectedFilterOptions(new Set())}
              >
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {filterOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-1.5 truncate rounded border border-neutral-300 px-2 py-1.5 hover:border-[#9f1b20] hover:bg-red-50/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilterOptions.has(option)}
                        onChange={() => toggleFilterOption(option)}
                        className="h-3 w-3 shrink-0 rounded border-neutral-400 text-[#9f1b20] focus:ring-[#9f1b20]"
                      />
                      <span className="min-w-0 flex-1 truncate text-xs text-neutral-700">{option}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
              <FilterSection
                title="Thickness (in)"
                open={thicknessOpen}
                onToggle={() => setThicknessOpen((o) => !o)}
                onReset={() => setThicknessRange(thicknessBounds)}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-neutral-500">Min</span>
                    <input
                      type="range"
                      min={thicknessBounds[0]}
                      max={thicknessBounds[1]}
                      step={0.0625}
                      value={thicknessRange[0]}
                      tabIndex={-1}
                      onChange={(e) =>
                        setThicknessRange((prev) => [
                          Math.min(Number(e.target.value), prev[1]),
                          prev[1],
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <BoundNumberInput
                      value={thicknessRange[0]}
                      min={thicknessBounds[0]}
                      max={thicknessRange[1]}
                      onCommit={(n) => setThicknessRange((prev) => [n, prev[1]])}
                      className="w-16 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                    />
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-neutral-500">Max</span>
                    <input
                      type="range"
                      min={thicknessBounds[0]}
                      max={thicknessBounds[1]}
                      step={0.0625}
                      value={thicknessRange[1]}
                      tabIndex={-1}
                      onChange={(e) =>
                        setThicknessRange((prev) => [
                          prev[0],
                          Math.max(Number(e.target.value), prev[0]),
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <BoundNumberInput
                      value={thicknessRange[1]}
                      min={thicknessRange[0]}
                      max={thicknessBounds[1]}
                      onCommit={(n) => setThicknessRange((prev) => [prev[0], n])}
                      className="w-16 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                    />
                  </div>
                </div>
              </FilterSection>
              <FilterSection
                title="Width (in)"
                open={widthOpen}
                onToggle={() => setWidthOpen((o) => !o)}
                onReset={() => setWidthRange(widthBounds)}
                headerTabIndex={-1}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-neutral-500">Min</span>
                    <input
                      type="range"
                      min={widthBounds[0]}
                      max={widthBounds[1]}
                      step={0.0625}
                      value={widthRange[0]}
                      tabIndex={-1}
                      onChange={(e) =>
                        setWidthRange((prev) => [
                          Math.min(Number(e.target.value), prev[1]),
                          prev[1],
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <BoundNumberInput
                      value={widthRange[0]}
                      min={widthBounds[0]}
                      max={widthRange[1]}
                      onCommit={(n) => setWidthRange((prev) => [n, prev[1]])}
                      className="w-16 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                    />
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-neutral-500">Max</span>
                    <input
                      type="range"
                      min={widthBounds[0]}
                      max={widthBounds[1]}
                      step={0.0625}
                      value={widthRange[1]}
                      tabIndex={-1}
                      onChange={(e) =>
                        setWidthRange((prev) => [
                          prev[0],
                          Math.max(Number(e.target.value), prev[0]),
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <BoundNumberInput
                      value={widthRange[1]}
                      min={widthRange[0]}
                      max={widthBounds[1]}
                      onCommit={(n) => setWidthRange((prev) => [prev[0], n])}
                      className="w-16 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                    />
                  </div>
                </div>
              </FilterSection>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="space-y-[65px]">
              {sectionsToShow.map(({ label, id }) => {
                const categoryItems = itemsByCategory.get(id) ?? [];
                if (categoryItems.length === 0) return null;
                return (
                  <section key={id} id={id} className="scroll-mt-24">
                    <h3 className="border-b border-neutral-300 pb-1.5 text-xl font-medium text-primary">
                      {label}
                    </h3>
                    <div
                      className={`mt-3 grid gap-6 sm:grid-cols-2 md:grid-cols-3 ${
                        id === "flat-stock"
                          ? "lg:grid-cols-9"
                          : id === "shoe-quarter-round" || id === "stop" || id === "corner-cove"
                            ? "lg:grid-cols-8"
                            : id === "casing"
                              ? "lg:grid-cols-5"
                              : "lg:grid-cols-6"
                      }`}
                    >
                      {categoryItems.map((item) => {
                        const imageSrc = images[item.item];
                        const href = `/product-info/stock-items/${item.categorySlug}/${encodeURIComponent(item.item)}`;
                        const sizeGroups = getStockConfigGroups(item.configs);
                        const displayName = getStockItemDisplayName(item);
                        const canvas = id === "miscellaneous" ? null : canvasByCategory.get(id) ?? null;
                        const imageSize = STOCK_ITEM_IMAGE_SIZES[item.item] ?? null;
                        const scaleToCategory = Boolean(canvas && imageSize && imageSrc);
                        // Flat stock 9-across @ 8/9; shoe/stop/corner 8-across @ 1 keep prior 6×(4/3) image height
                        const tileAspect =
                          id === "base"
                            ? "2/3"
                            : id === "casing"
                              ? "3/2"
                              : id === "shoe-quarter-round" || id === "stop" || id === "corner-cove"
                                ? "1"
                                : id === "chair-rail" || id === "flat-stock" || id === "crown" || id === "rake"
                                  ? "8/9"
                                  : "4/3";
                        return (
                          <div
                            key={item.item}
                            className="relative w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
                          >
                            <Link
                              href={href}
                              className="group block transition hover:opacity-90"
                            >
                              <div
                                className="relative w-full bg-white"
                                style={{ aspectRatio: tileAspect }}
                              >
                                {imageSrc ? (
                                  scaleToCategory && canvas && imageSize ? (
                                    <div className="absolute inset-0 flex items-center justify-center p-2">
                                      <div
                                        className="relative h-full w-auto max-w-full"
                                        style={{ aspectRatio: `${canvas.width} / ${canvas.height}` }}
                                      >
                                        <div
                                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                          style={{
                                            width: `${(imageSize.width / canvas.width) * 100}%`,
                                            height: `${(imageSize.height / canvas.height) * 100}%`,
                                          }}
                                        >
                                          <Image
                                            src={imageSrc}
                                            alt={`${displayName} flexible moulding`}
                                            fill
                                            className="object-contain transition group-hover:opacity-95"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                            unoptimized
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <Image
                                      src={imageSrc}
                                      alt={`${displayName} flexible moulding`}
                                      fill
                                      className="object-contain pt-1 px-4 pb-px transition group-hover:opacity-95"
                                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                      unoptimized
                                    />
                                  )
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-neutral-50 px-4">
                                    <p className="text-center text-sm font-medium text-neutral-400">
                                      Image coming soon
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className={`px-3 pt-0 text-center ${sizeGroups.length > 0 ? "pb-1" : "pb-3"}`}>
                                <p className="font-bold text-neutral-900">{displayName}</p>
                                <p className="text-sm text-neutral-600">{item.dimensions}</p>
                                {item.miscellaneousLabel && (
                                  <p className="text-sm text-neutral-600">{item.miscellaneousLabel}</p>
                                )}
                              </div>
                            </Link>
                            {sizeGroups.length > 0 && (
                              <div className="space-y-2 px-3 pb-3 text-center">
                                {sizeGroups.map(({ label, options }) => (
                                  <div key={label}>
                                    <p className="text-[11px] font-semibold tracking-wide text-neutral-500">
                                      {label}
                                    </p>
                                    <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                                      {options.map((opt) => (
                                        <Link
                                          key={opt}
                                          href={`${href}?config=${encodeURIComponent(opt)}`}
                                          className="rounded border border-neutral-300 bg-white px-1 py-px text-[10px] font-medium leading-tight text-neutral-700 transition-colors hover:border-primary hover:bg-red-50/50 hover:text-primary"
                                        >
                                          {opt}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
