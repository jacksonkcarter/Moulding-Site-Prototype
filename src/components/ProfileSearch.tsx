"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BoundNumberInput } from "@/components/BoundNumberInput";
import { ContactLink } from "@/components/ContactLink";
import { FilterSection, FilterResetAllButton } from "@/components/FilterSection";
import { dimensionFilterBounds, toFractionalInches } from "@/lib/format-inches";
import {
  buildProfileSearchParams,
  parseProfileSearchParams,
  profileSearchHref,
} from "@/lib/profile-search-params";
import type { ProfileRegion, ProfileRow } from "@/lib/profiles";

type ProfileSearchProps = {
  initialProfiles: ProfileRow[];
  mouldingTypes: string[];
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getDimensionBounds(
  profiles: ProfileRow[],
  key: "width" | "thickness",
  fallbackMax: number
): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const p of profiles) {
    min = Math.min(min, p[key]);
    max = Math.max(max, p[key]);
  }
  if (min === Infinity) min = 0;
  if (max === -Infinity) max = fallbackMax;
  return [min, max];
}

const PROFILE_FILTER_OPTIONS = [
  { value: "contains", label: "Contains" },
  { value: "starts with", label: "Starts with" },
  { value: "ends with", label: "Ends with" },
  { value: "equals", label: "Equals" },
  { value: "does not contain", label: "Does not contain" },
] as const;

type ProfileFilterType = (typeof PROFILE_FILTER_OPTIONS)[number]["value"];

function profileMatchesFilter(
  profile: ProfileRow,
  query: string,
  filterType: ProfileFilterType
): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const fields = [
    profile.profileId,
    profile.description,
    profile.mouldingType,
    ...profile.searchTerms,
  ].map((value) => value.toLowerCase());

  switch (filterType) {
    case "contains":
      return fields.some((field) => field.includes(q));
    case "starts with":
      return fields.some((field) => field.startsWith(q));
    case "ends with":
      return fields.some((field) => field.endsWith(q));
    case "equals":
      return fields.some((field) => field === q);
    case "does not contain":
      return fields.every((field) => !field.includes(q));
    default:
      return fields.some((field) => field.includes(q));
  }
}

function profileMatchesMouldingFilter(profile: ProfileRow, selected: Set<string>): boolean {
  if (selected.size === 0) return true;
  return selected.has(profile.mouldingType.trim());
}

function profileMatchesRegionFilter(profile: ProfileRow, selected: Set<ProfileRegion>): boolean {
  if (selected.size === 0) return true;
  return selected.has(profile.region);
}

const PROFILE_REGION_OPTIONS: { value: ProfileRegion; label: string }[] = [
  { value: "east", label: "East coast profiles" },
  { value: "west", label: "West coast profiles" },
];

const PAGE_SIZE = 50;

const TILE_IMAGE_PADDING_PX = 12; // matches p-1.5

function ProfileTileImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nativeSize, setNativeSize] = useState<{ width: number; height: number } | null>(null);

  const measure = useCallback((img: HTMLImageElement) => {
    const container = containerRef.current;
    if (!container) return;

    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
    const availableWidth = Math.max(containerWidth - TILE_IMAGE_PADDING_PX, 1);
    const availableHeight = Math.max(containerHeight - TILE_IMAGE_PADDING_PX, 1);
    const { naturalWidth, naturalHeight } = img;
    if (!naturalWidth || !naturalHeight) return;

    const scale = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight);
    // Only avoid upscaling small/low-res drawings; still allow downscaling large ones.
    if (scale > 1) {
      setNativeSize({ width: naturalWidth, height: naturalHeight });
    } else {
      setNativeSize(null);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative flex aspect-square items-center justify-center bg-white p-1.5">
      {nativeSize ? (
        <Image
          src={src}
          alt={alt}
          width={nativeSize.width}
          height={nativeSize.height}
          className="object-contain"
          unoptimized
          onLoadingComplete={measure}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-1.5"
          unoptimized
          sizes="(max-width: 640px) 10vw, 10vw"
          onLoadingComplete={measure}
        />
      )}
    </div>
  );
}

type PageItem = number | "ellipsis";

function getVisiblePages(page: number, totalPages: number, siblingCount = 3): PageItem[] {
  // Show every page when the full list fits in a compact control.
  if (totalPages <= siblingCount * 2 + 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const firstPage = 1;
  const lastPage = totalPages;
  const leftSibling = Math.max(page - siblingCount, firstPage);
  const rightSibling = Math.min(page + siblingCount, lastPage);

  const showLeftEllipsis = leftSibling > firstPage + 1;
  const showRightEllipsis = rightSibling < lastPage - 1;

  const items: PageItem[] = [firstPage];

  if (showLeftEllipsis) {
    items.push("ellipsis");
  } else if (firstPage + 1 < leftSibling) {
    for (let i = firstPage + 1; i < leftSibling; i++) items.push(i);
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== firstPage && i !== lastPage) items.push(i);
  }

  if (showRightEllipsis) {
    items.push("ellipsis");
  } else if (rightSibling + 1 < lastPage) {
    for (let i = rightSibling + 1; i < lastPage; i++) items.push(i);
  }

  if (lastPage !== firstPage) items.push(lastPage);

  return items;
}

const navButtonClass =
  "rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-[#9f1b20] hover:text-[#9f1b20] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:text-neutral-700";

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={!canPrev}
        className={navButtonClass}
        aria-label="First page"
      >
        First
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        className={navButtonClass}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="mx-1 flex items-center gap-1">
        {visiblePages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="select-none px-1.5 text-xs font-medium text-neutral-400"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={`min-w-8 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${
                item === page
                  ? "bg-[#9f1b20] text-white shadow-sm"
                  : "border border-transparent text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-[#9f1b20]"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        className={navButtonClass}
        aria-label="Next page"
      >
        Next
      </button>
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={!canNext}
        className={navButtonClass}
        aria-label="Last page"
      >
        Last
      </button>
    </nav>
  );
}

export function ProfileSearch({ initialProfiles, mouldingTypes }: ProfileSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [profiles] = useState<ProfileRow[]>(initialProfiles);

  const initialFilters = useMemo(() => parseProfileSearchParams(searchParams), [searchParams]);
  const widthBoundsInitial = useMemo(
    () => getDimensionBounds(initialProfiles, "width", 12),
    [initialProfiles]
  );
  const thicknessBoundsInitial = useMemo(
    () => getDimensionBounds(initialProfiles, "thickness", 2),
    [initialProfiles]
  );

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    () => new Set(initialFilters.types)
  );

  useEffect(() => {
    const parsed = parseProfileSearchParams(searchParams);
    if (parsed.types.length === 0) return;
    setSelectedTypes((prev) => {
      const next = new Set(parsed.types);
      if (prev.size === next.size && [...prev].every((t) => next.has(t))) return prev;
      return next;
    });
  }, [searchParams]);

  useEffect(() => {
    const parsed = parseProfileSearchParams(searchParams);
    setPage((prev) => (prev !== parsed.page ? parsed.page : prev));
  }, [searchParams]);

  const mouldingFilterOptions = mouldingTypes;
  const [widthRange, setWidthRange] = useState<[number, number]>(() => [
    initialFilters.wmin ?? widthBoundsInitial[0],
    initialFilters.wmax ?? widthBoundsInitial[1],
  ]);
  const [thicknessRange, setThicknessRange] = useState<[number, number]>(() => [
    initialFilters.tmin ?? thicknessBoundsInitial[0],
    initialFilters.tmax ?? thicknessBoundsInitial[1],
  ]);
  const [profileQuery, setProfileQuery] = useState(() => initialFilters.q);
  const [profileFilterType, setProfileFilterType] = useState<ProfileFilterType>(() => {
    const match = initialFilters.match;
    return PROFILE_FILTER_OPTIONS.some((o) => o.value === match)
      ? (match as ProfileFilterType)
      : "contains";
  });
  const [profileOpen, setProfileOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);
  const [widthOpen, setWidthOpen] = useState(true);
  const [thicknessOpen, setThicknessOpen] = useState(true);
  const [regionOpen, setRegionOpen] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState<Set<ProfileRegion>>(
    () => new Set(initialFilters.regions.length > 0 ? initialFilters.regions : ["east"])
  );
  const [detectedRegionLabel, setDetectedRegionLabel] = useState<string | null>(null);
  const regionUserTouched = useRef(searchParams.toString().length > 0);
  const filterSnapshotRef = useRef<string | null>(null);
  const [page, setPage] = useState(() => initialFilters.page);

  const widthMinDebounced = useDebounce(widthRange[0], 150);
  const widthMaxDebounced = useDebounce(widthRange[1], 150);
  const thicknessMinDebounced = useDebounce(thicknessRange[0], 150);
  const thicknessMaxDebounced = useDebounce(thicknessRange[1], 150);

  useEffect(() => {
    if (regionUserTouched.current) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/geo-region");
        if (!response.ok) return;
        const data = (await response.json()) as {
          region?: "east" | "west" | "shared";
          state?: string | null;
        };
        if (cancelled || regionUserTouched.current) return;
        if (data.region !== "east" && data.region !== "west" && data.region !== "shared") return;

        if (data.region === "shared") {
          setSelectedRegions(new Set(["east", "west"]));
          setDetectedRegionLabel(
            data.state
              ? `${data.state} · showing East and West coast profiles`
              : "Showing East and West coast profiles based on your location"
          );
        } else {
          setSelectedRegions(new Set([data.region]));
          if (data.state) {
            setDetectedRegionLabel(
              `${data.state} · showing ${data.region === "west" ? "West" : "East"} coast profiles`
            );
          } else {
            setDetectedRegionLabel(
              `Showing ${data.region === "west" ? "West" : "East"} coast profiles based on your location`
            );
          }
        }
      } catch {
        // Keep the East coast default when lookup fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const toggleRegion = useCallback((region: ProfileRegion) => {
    regionUserTouched.current = true;
    setDetectedRegionLabel(null);
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  }, []);

  const widthBounds = useMemo(
    () => getDimensionBounds(profiles, "width", 12),
    [profiles]
  );

  const thicknessBounds = useMemo(
    () => getDimensionBounds(profiles, "thickness", 2),
    [profiles]
  );

  const resetAllFilters = useCallback(() => {
    setProfileQuery("");
    setProfileFilterType("contains");
    setSelectedTypes(new Set());
    setThicknessRange(thicknessBounds);
    setWidthRange(widthBounds);
    setPage(1);
  }, [thicknessBounds, widthBounds]);

  const profileQueryDebounced = useDebounce(profileQuery, 200);

  const filtered = useMemo(() => {
    const [widthMin, widthMax] = dimensionFilterBounds(widthMinDebounced, widthMaxDebounced);
    return profiles.filter((p) => {
      if (!profileMatchesFilter(p, profileQueryDebounced, profileFilterType)) return false;
      if (!profileMatchesMouldingFilter(p, selectedTypes)) return false;
      if (!profileMatchesRegionFilter(p, selectedRegions)) return false;
      if (p.width < widthMin || p.width > widthMax) return false;
      if (p.thickness < thicknessMinDebounced || p.thickness > thicknessMaxDebounced)
        return false;
      return true;
    });
  }, [
    profiles,
    profileQueryDebounced,
    profileFilterType,
    selectedTypes,
    selectedRegions,
    widthMinDebounced,
    widthMaxDebounced,
    thicknessMinDebounced,
    thicknessMaxDebounced,
  ]);

  useEffect(() => {
    const snapshot = JSON.stringify({
      profileQueryDebounced,
      profileFilterType,
      types: [...selectedTypes].sort(),
      regions: [...selectedRegions].sort(),
      widthMinDebounced,
      widthMaxDebounced,
      thicknessMinDebounced,
      thicknessMaxDebounced,
    });
    if (filterSnapshotRef.current === null) {
      filterSnapshotRef.current = snapshot;
      return;
    }
    if (filterSnapshotRef.current !== snapshot) {
      filterSnapshotRef.current = snapshot;
      setPage(1);
    }
  }, [
    profileQueryDebounced,
    profileFilterType,
    selectedTypes,
    selectedRegions,
    widthMinDebounced,
    widthMaxDebounced,
    thicknessMinDebounced,
    thicknessMaxDebounced,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(1, nextPage), totalPages));
      document.getElementById("profiles")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [totalPages]
  );

  // Keep the URL in sync so refresh / back from a profile restores filters.
  useEffect(() => {
    const params = buildProfileSearchParams({
      types: selectedTypes,
      q: profileQueryDebounced,
      match: profileFilterType,
      page: currentPage,
      widthRange: [widthMinDebounced, widthMaxDebounced],
      thicknessRange: [thicknessMinDebounced, thicknessMaxDebounced],
      widthBounds,
      thicknessBounds,
      regions: selectedRegions,
    });
    const next = params.toString();
    const current = searchParams.toString();
    if (next === current) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [
    selectedTypes,
    profileQueryDebounced,
    profileFilterType,
    currentPage,
    widthMinDebounced,
    widthMaxDebounced,
    thicknessMinDebounced,
    thicknessMaxDebounced,
    widthBounds,
    thicknessBounds,
    selectedRegions,
    pathname,
    router,
    searchParams,
  ]);

  const browseReturnHref = useMemo(() => {
    const params = buildProfileSearchParams({
      types: selectedTypes,
      q: profileQueryDebounced,
      match: profileFilterType,
      page: currentPage,
      widthRange: [widthMinDebounced, widthMaxDebounced],
      thicknessRange: [thicknessMinDebounced, thicknessMaxDebounced],
      widthBounds,
      thicknessBounds,
      regions: selectedRegions,
    });
    return profileSearchHref(params);
  }, [
    selectedTypes,
    profileQueryDebounced,
    profileFilterType,
    currentPage,
    widthMinDebounced,
    widthMaxDebounced,
    thicknessMinDebounced,
    thicknessMaxDebounced,
    widthBounds,
    thicknessBounds,
    selectedRegions,
  ]);

  const imageUrl = (profileId: string) => `/api/images/${encodeURIComponent(profileId)}`;

  return (
    <section id="profiles" className="scroll-mt-20 border-t border-neutral-200 bg-white pb-20 pt-5">
      <div className="w-full px-4 sm:px-6">
        <p className="text-neutral-600 text-center">
          <strong className="font-semibold text-neutral-900">Can&apos;t find the exact match?</strong> Our
          online browser only scratches the surface.{" "}
          <ContactLink action="popover" className="font-medium text-primary hover:underline">
            Send us your requirements
          </ContactLink>
          , and one of our sales specialists will explore the thousands of additional shapes not listed online.
        </p>

        <div className="mt-[calc(2rem-0.1875in)] flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4 lg:w-72">
            <FilterResetAllButton onClick={resetAllFilters} className="mb-3" />
            <div className="space-y-0">
              <FilterSection
                title="Item"
                open={profileOpen}
                onToggle={() => setProfileOpen((o) => !o)}
                onReset={() => {
                  setProfileQuery("");
                  setProfileFilterType("contains");
                }}
              >
                <div className="min-w-0 space-y-2">
                  <input
                    type="text"
                    value={profileQuery}
                    onChange={(e) => setProfileQuery(e.target.value)}
                    placeholder="Filter by name, type, or keyword…"
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
              <FilterSection
                title="Moulding type"
                open={typesOpen}
                onToggle={() => setTypesOpen((o) => !o)}
                onReset={() => setSelectedTypes(new Set())}
              >
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
                      step={0.125}
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
                      step={0.125}
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
              <FilterSection
                title="Region"
                open={regionOpen}
                onToggle={() => setRegionOpen((o) => !o)}
                onReset={() => {
                  regionUserTouched.current = true;
                  setDetectedRegionLabel(null);
                  setSelectedRegions(new Set(["east"]));
                }}
              >
                <div className="space-y-1">
                  {PROFILE_REGION_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-1.5 rounded border border-neutral-300 px-2 py-1.5 hover:border-[#9f1b20] hover:bg-red-50/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.has(option.value)}
                        onChange={() => toggleRegion(option.value)}
                        className="h-3 w-3 shrink-0 rounded border-neutral-400 text-[#9f1b20] focus:ring-[#9f1b20]"
                      />
                      <span className="text-xs text-neutral-700">{option.label}</span>
                      {option.value === "west" ? (
                        <span className="ml-auto text-[10px] text-neutral-400">Coming soon</span>
                      ) : null}
                    </label>
                  ))}
                </div>
                {detectedRegionLabel ? (
                  <p className="mt-2 text-[11px] leading-snug text-neutral-500">{detectedRegionLabel}</p>
                ) : null}
              </FilterSection>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-600">
                {filtered.length} profile{filtered.length !== 1 ? "s" : ""} found
                {filtered.length > 0 ? (
                  <span className="text-neutral-500">
                    {" "}
                    · Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
                  </span>
                ) : null}
              </p>
              <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
              {pageItems.map((p, i) => (
                <motion.div
                  key={`${p.profileId}-${p.mouldingType}-${p.width}-${p.thickness}-${pageStart + i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                >
                  <Link
                    href={`/product-info/select-profiles/${encodeURIComponent(p.profileId)}?return=${encodeURIComponent(browseReturnHref)}`}
                    className="block overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ProfileTileImage
                      src={imageUrl(p.profileId)}
                      alt={`${p.profileId} flexible moulding`}
                    />
                    <div className="p-1.5 text-center">
                      <p className="truncate text-xs font-medium text-neutral-800">
                        {p.profileId}
                      </p>
                      <p className="text-xs text-neutral-500">{p.mouldingType}</p>
                      <p className="text-xs text-neutral-500">
                        {toFractionalInches(p.thickness)} x {toFractionalInches(p.width)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-6">
              <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
