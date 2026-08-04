import {
  STATE_ABBR_TO_FACILITY,
  STATE_NAME_TO_FACILITY,
  type FacilityAssignment,
  type FacilityRegion,
} from "@/data/state-facility-map";
import type { ProfileRegion } from "@/lib/profiles";

export function facilityRegionFromState(
  stateOrAbbr: string | null | undefined
): FacilityAssignment | null {
  if (!stateOrAbbr) return null;
  const raw = stateOrAbbr.trim();
  if (!raw) return null;

  const asAbbr = raw.toUpperCase();
  if (STATE_ABBR_TO_FACILITY[asAbbr]) return STATE_ABBR_TO_FACILITY[asAbbr];

  const asName = Object.keys(STATE_NAME_TO_FACILITY).find(
    (name) => name.toLowerCase() === raw.toLowerCase()
  );
  if (asName) return STATE_NAME_TO_FACILITY[asName];

  return null;
}

/** Profile coast filters implied by a facility assignment. */
export function profileRegionsForAssignment(assignment: FacilityAssignment): ProfileRegion[] {
  if (assignment === "shared") return ["east", "west"];
  return [assignment];
}

/** Facility contacts to emphasize for a visitor assignment. */
export function facilityRegionsForAssignment(assignment: FacilityAssignment): FacilityRegion[] {
  if (assignment === "shared") return ["east", "west"];
  return [assignment];
}

export function isFacilityAssignment(value: string | null | undefined): value is FacilityAssignment {
  return value === "east" || value === "west" || value === "shared";
}

export type GeoRegionResult = {
  region: FacilityAssignment;
  state: string | null;
  source: string;
};
