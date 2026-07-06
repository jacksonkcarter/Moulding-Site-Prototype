"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useCallback, type ReactNode } from "react";
import type { StockItem, StockItemSection } from "@/data/stock-items";
import { getStockMouldingFilterOptions } from "@/lib/stock-moulding-filter-options";

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

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-neutral-700 hover:text-[#9f1b20]"
      >
        {title}
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function StockItemsView({ sections, items, images }: StockItemsViewProps) {
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<Set<string>>(new Set());
  const [typesOpen, setTypesOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(true);
  const [thicknessOpen, setThicknessOpen] = useState(true);
  const [widthOpen, setWidthOpen] = useState(true);
  const [itemQuery, setItemQuery] = useState("");
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>("contains");
  const [thicknessRange, setThicknessRange] = useState<[number, number]>([0, 2]);
  const [widthRange, setWidthRange] = useState<[number, number]>([0, 12]);

  const itemQueryDebounced = useDebounce(itemQuery, 150);
  const thicknessMinDebounced = useDebounce(thicknessRange[0], 150);
  const thicknessMaxDebounced = useDebounce(thicknessRange[1], 150);
  const widthMinDebounced = useDebounce(widthRange[0], 150);
  const widthMaxDebounced = useDebounce(widthRange[1], 150);

  const filterOptions = useMemo(
    () => getStockMouldingFilterOptions(sections, items),
    [sections, items]
  );

  const thicknessBounds = useMemo(() => {
    let min = Infinity, max = -Infinity;
    for (const item of items) {
      if (item.thickness != null) {
        min = Math.min(min, item.thickness);
        max = Math.max(max, item.thickness);
      }
    }
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 2;
    return [min, max] as [number, number];
  }, [items]);

  const widthBounds = useMemo(() => {
    let min = Infinity, max = -Infinity;
    for (const item of items) {
      if (item.width != null) {
        min = Math.min(min, item.width);
        max = Math.max(max, item.width);
      }
    }
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 12;
    return [min, max] as [number, number];
  }, [items]);

  const toggleFilterOption = useCallback((option: string) => {
    setSelectedFilterOptions((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }, []);

  const itemMatchesTypeFilter = useCallback((item: StockItem): boolean => {
    if (selectedFilterOptions.size === 0) return true;
    if (item.category === "Miscellaneous" && item.miscellaneousLabel) {
      return selectedFilterOptions.has(item.miscellaneousLabel);
    }
    const categoryParts = item.category.split(/\s+&\s+/).map((p) => p.trim()).filter(Boolean);
    return categoryParts.some((part) => selectedFilterOptions.has(part));
  }, [selectedFilterOptions]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedFilterOptions.size > 0) {
      result = result.filter(itemMatchesTypeFilter);
    }
    result = result.filter((item) =>
      itemMatchesSearch(item.item, itemQueryDebounced, searchFilterType)
    );
    result = result.filter((item) => {
      if (item.thickness != null) {
        if (item.thickness < thicknessMinDebounced || item.thickness > thicknessMaxDebounced) return false;
      }
      return true;
    });
    result = result.filter((item) => {
      if (item.width != null) {
        if (item.width < widthMinDebounced || item.width > widthMaxDebounced) return false;
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

  return (
    <section id="stock-items" className="scroll-mt-20 border-t border-neutral-200 bg-white pb-20 pt-5">
      <div className="w-full px-4 sm:px-6">
        <h2 className="text-3xl font-medium uppercase tracking-[0.15em] text-neutral-900 text-center">
          Browse Stock Items
        </h2>
        <p className="mt-2 text-neutral-600 text-center">
          Browse stock items by category. Select one or more moulding types to filter.
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4 lg:w-72">
            <div className="space-y-0">
              <FilterSection title="Item" open={searchOpen} onToggle={() => setSearchOpen((o) => !o)}>
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
              <FilterSection title="Moulding Type" open={typesOpen} onToggle={() => setTypesOpen((o) => !o)}>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {filterOptions.map((option) => (
                    <div
                      key={option}
                      className="flex cursor-pointer items-center gap-1.5 truncate rounded border border-neutral-300 px-2 py-1.5 hover:border-[#9f1b20] hover:bg-red-50/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilterOptions.has(option)}
                        onChange={() => toggleFilterOption(option)}
                        className="h-3 w-3 shrink-0 rounded border-neutral-400 text-[#9f1b20] focus:ring-[#9f1b20]"
                        aria-label={`Filter stock items by ${option}`}
                      />
                      <Link
                        href={`/product-info/profile-search?types=${encodeURIComponent(option)}`}
                        className="min-w-0 flex-1 truncate text-xs text-neutral-700 hover:text-[#9f1b20]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {option}
                      </Link>
                    </div>
                  ))}
                </div>
              </FilterSection>
              <FilterSection title="Thickness (in)" open={thicknessOpen} onToggle={() => setThicknessOpen((o) => !o)}>
                <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-neutral-500">Min</span>
                    <input
                      type="range"
                      min={thicknessBounds[0]}
                      max={thicknessBounds[1]}
                      step={0.0625}
                      value={thicknessRange[0]}
                      onChange={(e) =>
                        setThicknessRange((prev) => [
                          Math.min(Number(e.target.value), prev[1] - 0.0625),
                          prev[1],
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <input
                      type="number"
                      min={thicknessBounds[0]}
                      max={thicknessRange[1] - 0.0625}
                      step={0.0625}
                      value={thicknessRange[0]}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v))
                          setThicknessRange((prev) => [
                            roundToStep(Math.min(Math.max(v, thicknessBounds[0]), prev[1] - 0.0625), 0.0625),
                            prev[1],
                          ]);
                      }}
                      className="w-14 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
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
                      onChange={(e) =>
                        setThicknessRange((prev) => [
                          prev[0],
                          Math.max(Number(e.target.value), prev[0] + 0.0625),
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <input
                      type="number"
                      min={thicknessRange[0] + 0.0625}
                      max={thicknessBounds[1]}
                      step={0.0625}
                      value={thicknessRange[1]}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v))
                          setThicknessRange((prev) => [
                            prev[0],
                            roundToStep(Math.max(Math.min(v, thicknessBounds[1]), prev[0] + 0.0625), 0.0625),
                          ]);
                      }}
                      className="w-14 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                    />
                  </div>
                </div>
              </FilterSection>
              <FilterSection title="Width (in)" open={widthOpen} onToggle={() => setWidthOpen((o) => !o)}>
                <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-neutral-500">Min</span>
                    <input
                      type="range"
                      min={widthBounds[0]}
                      max={widthBounds[1]}
                      step={0.0625}
                      value={widthRange[0]}
                      onChange={(e) =>
                        setWidthRange((prev) => [
                          Math.min(Number(e.target.value), prev[1] - 0.0625),
                          prev[1],
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <input
                      type="number"
                      min={widthBounds[0]}
                      max={widthRange[1] - 0.0625}
                      step={0.0625}
                      value={widthRange[0]}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v))
                          setWidthRange((prev) => [
                            roundToStep(Math.min(Math.max(v, widthBounds[0]), prev[1] - 0.0625), 0.0625),
                            prev[1],
                          ]);
                      }}
                      className="w-14 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
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
                      onChange={(e) =>
                        setWidthRange((prev) => [
                          prev[0],
                          Math.max(Number(e.target.value), prev[0] + 0.0625),
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <input
                      type="number"
                      min={widthRange[0] + 0.0625}
                      max={widthBounds[1]}
                      step={0.0625}
                      value={widthRange[1]}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v))
                          setWidthRange((prev) => [
                            prev[0],
                            roundToStep(Math.max(Math.min(v, widthBounds[1]), prev[0] + 0.0625), 0.0625),
                          ]);
                      }}
                      className="w-14 shrink-0 rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
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
                    <div className="mt-3 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {categoryItems.map((item) => {
                        const imageSrc = images[item.item] ?? `/stock-items/${item.item}.png`;
                        const href = `/product-info/stock-items/${item.categorySlug}/${encodeURIComponent(item.item)}`;
                        return (
                          <Link
                            key={item.item}
                            href={href}
                            className="group relative block w-full transition hover:opacity-90"
                          >
                            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                              <Image
                                src={imageSrc}
                                alt={item.item}
                                fill
                                className="object-contain pt-1 px-4 pb-px transition group-hover:opacity-95"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                unoptimized
                              />
                            </div>
                            <div className="pt-0 pl-[18px] pr-1">
                              <p className="font-bold text-neutral-900">{item.item}</p>
                              <p className="text-sm text-neutral-600">{item.dimensions}</p>
                              {item.miscellaneousLabel && (
                                <p className="text-sm text-neutral-600">{item.miscellaneousLabel}</p>
                              )}
                            </div>
                          </Link>
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
