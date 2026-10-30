import type { ProfileRegion } from "@/lib/profiles";

export const PROFILE_SEARCH_PATH = "/products/profile-search";

export type ProfileSearchFilterState = {
  types: string[];
  q: string;
  match: string;
  page: number;
  wmin: number | null;
  wmax: number | null;
  tmin: number | null;
  tmax: number | null;
  regions: ProfileRegion[];
};

function parseNumberParam(value: string | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseProfileSearchParams(
  searchParams: URLSearchParams | { get: (key: string) => string | null }
): ProfileSearchFilterState {
  const typesRaw = searchParams.get("types");
  const types = typesRaw
    ? typesRaw
        .split(",")
        .map((s) => {
          try {
            return decodeURIComponent(s.trim());
          } catch {
            return s.trim();
          }
        })
        .filter(Boolean)
    : [];

  const regionsRaw = searchParams.get("regions");
  const regions = regionsRaw
    ? (regionsRaw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s): s is ProfileRegion => s === "east" || s === "west"))
    : [];

  const page = Math.max(1, Math.floor(Number(searchParams.get("page")) || 1));

  return {
    types,
    q: searchParams.get("q") ?? "",
    match: searchParams.get("match") ?? "contains",
    page,
    wmin: parseNumberParam(searchParams.get("wmin")),
    wmax: parseNumberParam(searchParams.get("wmax")),
    tmin: parseNumberParam(searchParams.get("tmin")),
    tmax: parseNumberParam(searchParams.get("tmax")),
    regions,
  };
}

export function buildProfileSearchParams(state: {
  types: Iterable<string>;
  q: string;
  match: string;
  page: number;
  widthRange: [number, number];
  thicknessRange: [number, number];
  widthBounds: [number, number];
  thicknessBounds: [number, number];
  regions: Iterable<ProfileRegion>;
}): URLSearchParams {
  const params = new URLSearchParams();
  const types = [...state.types];
  if (types.length > 0) {
    params.set("types", types.join(","));
  }
  const q = state.q.trim();
  if (q) params.set("q", q);
  if (state.match && state.match !== "contains") params.set("match", state.match);
  if (state.page > 1) params.set("page", String(state.page));

  const [wmin, wmax] = state.widthRange;
  const [wbMin, wbMax] = state.widthBounds;
  if (wmin > wbMin) params.set("wmin", String(wmin));
  if (wmax < wbMax) params.set("wmax", String(wmax));

  const [tmin, tmax] = state.thicknessRange;
  const [tbMin, tbMax] = state.thicknessBounds;
  if (tmin > tbMin) params.set("tmin", String(tmin));
  if (tmax < tbMax) params.set("tmax", String(tmax));

  const regions = [...state.regions];
  if (regions.length > 0 && !(regions.length === 1 && regions[0] === "east")) {
    params.set("regions", regions.join(","));
  }

  return params;
}

export function profileSearchHref(params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `${PROFILE_SEARCH_PATH}?${qs}` : PROFILE_SEARCH_PATH;
}

/** Only allow returning to the profile search page. */
export function safeProfileSearchReturn(returnTo: string | null | undefined): string {
  if (!returnTo) return PROFILE_SEARCH_PATH;
  try {
    const decoded = decodeURIComponent(returnTo);
    if (decoded === PROFILE_SEARCH_PATH || decoded.startsWith(`${PROFILE_SEARCH_PATH}?`)) {
      return decoded;
    }
  } catch {
    // ignore
  }
  return PROFILE_SEARCH_PATH;
}
