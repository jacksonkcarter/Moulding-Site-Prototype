/** Application options for Step 1 */
export const APPLICATION_OPTIONS = [
  "Doorway",
  "Window",
  "Baseboard",
  "Crown",
  "Panel/Chair Rail",
  "Accessory",
  "Other",
] as const;
export type ApplicationOption = (typeof APPLICATION_OPTIONS)[number];

/** Doorway arch styles */
export const ARCH_STYLES = [
  "Half Round",
  "Eyebrow",
  "Elliptical",
  "Radius Corners",
  "Gothic",
  "Straight",
  "Other",
  "Curved Wall",
] as const;
export type ArchStyle = (typeof ARCH_STYLES)[number];

/** Doorway components (for non–half-round flow) */
export const DOORWAY_COMPONENTS = [
  "Casing",
  "Jamb",
  "Back Band",
  "Brick Mould",
  "Stop",
  "Other",
] as const;
export type DoorwayComponent = (typeof DOORWAY_COMPONENTS)[number];

/** Components that show "Sides of Doorway/Wall" */
export const COMPONENTS_WITH_SIDES: DoorwayComponent[] = [
  "Casing",
  "Back Band",
  "Brick Mould",
  "Other",
];

export interface ProfileEntry {
  id: string;
  componentKey: string; // e.g. "Casing", "Other"
  componentOtherSpec?: string;
  profilePartNumber: string;
  thickness: string;
  width: string;
  matchingWood: string;
  finish: "painted" | "stained";
  woodGrainSpecies: string;
  sides: "one" | "both";
}

export interface DoorwayData {
  archStyle: ArchStyle | null;
  archStyleOther?: string;
  /** Curved wall option; can be true alongside any arch style */
  curvedWall?: boolean;
  halfRound?: {
    diameterIn: string;
    flexTrimLegs: boolean;
    straightLegLengthIn?: string;
  };
  /** Eyebrow arc dimensions; dimensionType set when user chooses which to provide */
  eyebrow?: {
    dimensionType: "width-rise" | "radius-length";
    widthIn?: string;
    riseIn?: string;
    radiusIn?: string;
    lengthIn?: string;
  };
  components: DoorwayComponent[];
  componentOtherSpec?: string;
  profiles: ProfileEntry[];
}

/** Crown curvature options */
export const CROWN_CURVATURES = ["ISR (Concave)", "OSR (Convex)"] as const;
export type CrownCurvature = (typeof CROWN_CURVATURES)[number];

/** OSR tight radii scenario options (multi-select) */
export const CROWN_OSR_TIGHT_RADII_OPTIONS = [
  "Column Wrap",
  "Half Round Straight/Radius/Straight",
  "Quarter Round Straight/Radius/Straight",
] as const;
export type CrownOsrTightRadiiOption = (typeof CROWN_OSR_TIGHT_RADII_OPTIONS)[number];

export interface CrownData {
  curvature: CrownCurvature;
  /** Selected tight radii scenarios when curvature is OSR (Convex) */
  tightRadiiScenarios?: CrownOsrTightRadiiOption[];
}

export interface QuoteItem {
  id: string;
  application: ApplicationOption;
  applicationOther?: string;
  doorway?: DoorwayData;
  crown?: CrownData;
}

export interface ContactInfo {
  business: string;
  location: string;
  yourName: string;
  email: string;
  phone: string;
  preferredMethod: "email" | "phone";
  existingAccount: "yes" | "no";
}
