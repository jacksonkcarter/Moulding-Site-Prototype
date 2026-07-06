"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { STOCK_ITEMS, STOCK_ITEM_SECTIONS } from "@/data/stock-items";
import type { ProfileRow } from "@/lib/profiles";
import {
  getStockMouldingFilterOptions,
  profileMatchesStockMouldingFilter,
} from "@/lib/stock-moulding-filter-options";

type ProfileSearchProps = {
  initialProfiles: ProfileRow[];
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Format decimal inches as fraction string, e.g. 0.5 → "1/2", 4.1875 → "4-3/16" */
function toFractionalInches(decimal: number): string {
  const sixteenths = Math.round(decimal * 16);
  const whole = Math.floor(sixteenths / 16);
  const num = sixteenths % 16;
  if (num === 0) return `${whole}"`;
  const denom = 16;
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const gcd = g(num, denom);
  const n = num / gcd;
  const d = denom / gcd;
  if (whole > 0) return `${whole}-${n}/${d}"`;
  return `${n}/${d}"`;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

const PROFILE_FILTER_OPTIONS = [
  { value: "contains", label: "Contains" },
  { value: "starts with", label: "Starts with" },
  { value: "ends with", label: "Ends with" },
  { value: "equals", label: "Equals" },
  { value: "does not contain", label: "Does not contain" },
] as const;

type ProfileFilterType = (typeof PROFILE_FILTER_OPTIONS)[number]["value"];

function profileMatchesFilter(profileId: string, query: string, filterType: ProfileFilterType): boolean {
  const id = profileId.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  switch (filterType) {
    case "contains":
      return id.includes(q);
    case "starts with":
      return id.startsWith(q);
    case "ends with":
      return id.endsWith(q);
    case "equals":
      return id === q;
    case "does not contain":
      return !id.includes(q);
    default:
      return id.includes(q);
  }
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

export function ProfileSearch({ initialProfiles }: ProfileSearchProps) {
  const searchParams = useSearchParams();
  const [profiles] = useState<ProfileRow[]>(initialProfiles);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => {
    const t = searchParams.get("types");
    if (!t) return new Set();
    return new Set(
      t.split(",")
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean)
    );
  });

  useEffect(() => {
    const t = searchParams.get("types");
    if (!t) return;
    setSelectedTypes(
      new Set(
        t.split(",")
          .map((s) => decodeURIComponent(s.trim()))
          .filter(Boolean)
      )
    );
  }, [searchParams]);

  const mouldingFilterOptions = useMemo(
    () => getStockMouldingFilterOptions(STOCK_ITEM_SECTIONS, STOCK_ITEMS),
    []
  );
  const [widthRange, setWidthRange] = useState<[number, number]>([0, 12]);
  const [thicknessRange, setThicknessRange] = useState<[number, number]>([0, 2]);
  const [profileQuery, setProfileQuery] = useState("");
  const [profileFilterType, setProfileFilterType] = useState<ProfileFilterType>("contains");
  const [profileOpen, setProfileOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);
  const [widthOpen, setWidthOpen] = useState(true);
  const [thicknessOpen, setThicknessOpen] = useState(true);

  const widthMinDebounced = useDebounce(widthRange[0], 150);
  const widthMaxDebounced = useDebounce(widthRange[1], 150);
  const thicknessMinDebounced = useDebounce(thicknessRange[0], 150);
  const thicknessMaxDebounced = useDebounce(thicknessRange[1], 150);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const widthBounds = useMemo(() => {
    let min = Infinity,
      max = -Infinity;
    for (const p of profiles) {
      min = Math.min(min, p.width);
      max = Math.max(max, p.width);
    }
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 12;
    return [min, max] as [number, number];
  }, [profiles]);

  const thicknessBounds = useMemo(() => {
    let min = Infinity,
      max = -Infinity;
    for (const p of profiles) {
      min = Math.min(min, p.thickness);
      max = Math.max(max, p.thickness);
    }
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 2;
    return [min, max] as [number, number];
  }, [profiles]);

  const profileQueryDebounced = useDebounce(profileQuery, 200);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (!profileMatchesFilter(p.profileId, profileQueryDebounced, profileFilterType)) return false;
      if (!profileMatchesStockMouldingFilter(p, selectedTypes)) return false;
      if (p.width < widthMinDebounced || p.width > widthMaxDebounced) return false;
      if (p.thickness < thicknessMinDebounced || p.thickness > thicknessMaxDebounced)
        return false;
      return true;
    });
  }, [
    profiles,
    profileQueryDebounced,
    profileFilterType,
    selectedTypes,
    widthMinDebounced,
    widthMaxDebounced,
    thicknessMinDebounced,
    thicknessMaxDebounced,
  ]);

  const imageUrl = (profileId: string) => `/api/images/${encodeURIComponent(profileId)}`;

  return (
    <section id="profiles" className="scroll-mt-20 border-t border-neutral-200 bg-white pb-20 pt-5">
      <div className="w-full px-4 sm:px-6">
        <h2 className="font-sans text-3xl font-medium uppercase tracking-[0.15em] text-neutral-900 text-center">
          Browse All Profiles
        </h2>
        <p className="mt-2 text-neutral-600 text-center">
          Over 50,000 profiles available. Filter by type, width, and thickness.
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4 lg:w-72">
            <div className="space-y-0">
              <FilterSection title="Item" open={profileOpen} onToggle={() => setProfileOpen((o) => !o)}>
                <div className="min-w-0 space-y-2">
                  <input
                    type="text"
                    value={profileQuery}
                    onChange={(e) => setProfileQuery(e.target.value)}
                    placeholder="Filter by profile name..."
                    className="w-full min-w-0 rounded border border-neutral-300 px-2 py-1.5 text-xs placeholder-neutral-400 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                    autoComplete="off"
                  />
                  <select
                    value={profileFilterType}
                    onChange={(e) => setProfileFilterType(e.target.value as ProfileFilterType)}
                    className="w-full min-w-0 rounded border border-neutral-300 px-2 py-1.5 text-xs focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                  >
                    {PROFILE_FILTER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FilterSection>
              <FilterSection title="Moulding Type" open={typesOpen} onToggle={() => setTypesOpen((o) => !o)}>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {mouldingFilterOptions.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-1.5 truncate rounded border border-neutral-300 px-2 py-1.5 hover:border-[#9f1b20] hover:bg-red-50/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.has(type)}
                        onChange={() => toggleType(type)}
                        className="h-3 w-3 shrink-0 rounded border-neutral-400 text-[#9f1b20] focus:ring-[#9f1b20]"
                      />
                      <span className="truncate text-xs text-neutral-700">{type}</span>
                    </label>
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
                      step={0.125}
                      value={widthRange[0]}
                      onChange={(e) =>
                        setWidthRange((prev) => [
                          Math.min(Number(e.target.value), prev[1] - 0.125),
                          prev[1],
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <input
                      type="number"
                      min={widthBounds[0]}
                      max={widthRange[1] - 0.125}
                      step={0.125}
                      value={widthRange[0]}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v))
                          setWidthRange((prev) => [
                            roundToStep(Math.min(Math.max(v, widthBounds[0]), prev[1] - 0.125), 0.125),
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
                      step={0.125}
                      value={widthRange[1]}
                      onChange={(e) =>
                        setWidthRange((prev) => [
                          prev[0],
                          Math.max(Number(e.target.value), prev[0] + 0.125),
                        ])
                      }
                      className="min-w-0 flex-1 accent-[#9f1b20]"
                    />
                    <input
                      type="number"
                      min={widthRange[0] + 0.125}
                      max={widthBounds[1]}
                      step={0.125}
                      value={widthRange[1]}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v))
                          setWidthRange((prev) => [
                            prev[0],
                            roundToStep(Math.max(Math.min(v, widthBounds[1]), prev[0] + 0.125), 0.125),
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
            <p className="mb-4 text-sm text-neutral-600">
              {filtered.length} profile{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {filtered.slice(0, 200).map((p, i) => (
                <motion.div
                  key={`${p.profileId}-${p.mouldingType}-${p.width}-${p.thickness}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-square bg-white">
                    <Image
                      src={imageUrl(p.profileId)}
                      alt={p.profileId}
                      fill
                      className="object-contain p-1.5"
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 20vw"
                    />
                  </div>
                  <div className="p-1.5 text-center">
                    <p className="truncate text-xs font-medium text-neutral-800">
                      {p.profileId}
                    </p>
                    <p className="text-xs text-neutral-500">{p.mouldingType}</p>
                    <p className="text-xs text-neutral-500">
                      {toFractionalInches(p.thickness)} x {toFractionalInches(p.width)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            {filtered.length > 200 && (
              <p className="mt-4 text-sm text-neutral-500">
                Showing first 200. Narrow filters to see fewer results.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
