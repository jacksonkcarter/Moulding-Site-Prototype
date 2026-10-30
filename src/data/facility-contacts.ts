import type { FacilityAssignment, FacilityRegion } from "@/data/state-facility-map";
import { facilityRegionsForAssignment } from "@/lib/state-facility";

export type FacilityContact = {
  region: FacilityRegion;
  label: string;
  addressLines: string[];
  phoneDisplay: string;
  phoneTel: string;
  emails: string[];
};

export const FACILITY_CONTACTS: Record<FacilityRegion, FacilityContact> = {
  east: {
    region: "east",
    label: "Flex Trim East",
    addressLines: ["117 Cedar Lane Drive", "Lexington, NC 27292"],
    phoneDisplay: "(800) 861-0734",
    phoneTel: "8008610734",
    emails: ["orders@carterflex.com", "support@carterflex.com"],
  },
  west: {
    region: "west",
    label: "Flex Trim West",
    addressLines: ["533 South 500 West", "Provo, UT 84601"],
    phoneDisplay: "(877) 877-4595",
    phoneTel: "8778774595",
    emails: ["orders@flextrim.com"],
  },
};

export const FACILITY_CONTACT_ORDER: FacilityRegion[] = ["east", "west"];

export function getFacilityContact(region: FacilityRegion): FacilityContact {
  return FACILITY_CONTACTS[region];
}

export function parseFacilityAssignment(value: string | null | undefined): FacilityAssignment | null {
  if (value === "east" || value === "west" || value === "shared") return value;
  return null;
}

/** @deprecated Use parseFacilityAssignment */
export function parseFacilityRegion(value: string | null | undefined): FacilityAssignment | null {
  return parseFacilityAssignment(value);
}

export function contactUsHref(region?: FacilityAssignment | null): string {
  if (!region) return "/contact-us";
  return `/contact-us?region=${region}`;
}

export function contactsForAssignment(assignment: FacilityAssignment): FacilityContact[] {
  return facilityRegionsForAssignment(assignment).map((region) => FACILITY_CONTACTS[region]);
}
