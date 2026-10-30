/** Shape-based Flex Trim™ length math, ported from the internal Python calculator. */

export const TOOLBOX_SHAPES = [
  "Eyebrow arc & consistent radius curve",
  "Half-round",
  "Elliptical",
  "Full circle",
  "Oval",
  "Radius only: crown & consistent radius curve",
] as const;

export type ToolboxShape = (typeof TOOLBOX_SHAPES)[number];

export type ToolboxFieldName =
  | "Width"
  | "Height"
  | "Rise"
  | "Diameter"
  | "Straight Legs";

export type ToolboxValues = Partial<Record<ToolboxFieldName, number>>;

export type ToolboxResult = {
  rawGeom: number;
  finalReq: number;
  radiusFt?: number;
};

function val(values: ToolboxValues, name: ToolboxFieldName): number {
  const n = values[name];
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0;
}

function ceilPlus(n: number, extra: number): number {
  return Math.ceil(n) + extra;
}

/** Ramanujan ellipse circumference: π [3(a+b) − √((3a+b)(a+3b))]. */
function ellipseCircumference(a: number, b: number): number {
  const term1 = 3 * (a + b);
  const term2 = Math.sqrt((3 * a + b) * (a + 3 * b));
  return Math.PI * (term1 - term2);
}

export function parseFtIn(ftStr: string, inStr: string): number {
  const ft = Number.parseFloat(ftStr);
  const inch = Number.parseFloat(inStr);
  const feet = Number.isFinite(ft) && ft > 0 ? ft : 0;
  const inches = Number.isFinite(inch) && inch > 0 ? inch : 0;
  return feet + inches / 12;
}

export function dimensionFieldsFor(shape: ToolboxShape): ToolboxFieldName[] {
  switch (shape) {
    case "Oval":
      return ["Width", "Height"];
    case "Elliptical":
      return ["Width", "Rise", "Straight Legs"];
    case "Eyebrow arc & consistent radius curve":
      return ["Width", "Rise"];
    case "Half-round":
      return ["Diameter", "Straight Legs"];
    case "Full circle":
      return ["Diameter"];
    case "Radius only: crown & consistent radius curve":
      return ["Width", "Rise"];
  }
}

/** Required fields for a result; Straight Legs is never required. */
export function requiredFieldsFor(shape: ToolboxShape): ToolboxFieldName[] {
  return dimensionFieldsFor(shape).filter((field) => field !== "Straight Legs");
}

export function hasRequiredToolboxInputs(
  shape: ToolboxShape,
  values: ToolboxValues,
): boolean {
  return requiredFieldsFor(shape).every((field) => val(values, field) > 0);
}

export function calculateToolboxLength(
  shape: ToolboxShape,
  values: ToolboxValues,
): ToolboxResult {
  if (shape === "Oval") {
    const width = val(values, "Width");
    const height = val(values, "Height");
    if (width > 0 && height > 0) {
      const circumference = ellipseCircumference(width / 2, height / 2);
      const halfCirc = circumference / 2;
      return {
        rawGeom: circumference,
        finalReq: (Math.ceil(halfCirc) + 1) * 2,
      };
    }
  } else if (shape === "Elliptical") {
    const width = val(values, "Width");
    const rise = val(values, "Rise");
    const legs = val(values, "Straight Legs");
    if (width > 0 && rise > 0) {
      const fullCirc = ellipseCircumference(width / 2, rise);
      const archLen = fullCirc / 2;
      const rawGeom = archLen + legs * 2;
      return { rawGeom, finalReq: ceilPlus(rawGeom, 2) };
    }
  } else if (shape === "Eyebrow arc & consistent radius curve") {
    const width = val(values, "Width");
    const rise = val(values, "Rise");
    if (width > 0 && rise > 0) {
      const radius = rise / 2 + width ** 2 / (8 * rise);
      let ratio = width / (2 * radius);
      if (ratio > 1) ratio = 1;
      const theta = 2 * Math.asin(ratio);
      const arcLen = radius * theta;
      return { rawGeom: arcLen, finalReq: ceilPlus(arcLen, 1), radiusFt: radius };
    }
  } else if (shape === "Half-round") {
    const diameter = val(values, "Diameter");
    const legs = val(values, "Straight Legs");
    if (diameter > 0) {
      const halfCirc = (Math.PI * diameter) / 2;
      const rawGeom = halfCirc + legs * 2;
      return { rawGeom, finalReq: ceilPlus(rawGeom, 1), radiusFt: diameter / 2 };
    }
  } else if (shape === "Full circle") {
    // Two half-rounds of the same diameter (no legs).
    const diameter = val(values, "Diameter");
    if (diameter > 0) {
      const halfCirc = (Math.PI * diameter) / 2;
      const halfReq = ceilPlus(halfCirc, 1);
      return { rawGeom: halfCirc * 2, finalReq: halfReq * 2, radiusFt: diameter / 2 };
    }
  } else if (shape === "Radius only: crown & consistent radius curve") {
    const width = val(values, "Width");
    const rise = val(values, "Rise");
    if (width > 0 && rise > 0) {
      const radius = rise / 2 + width ** 2 / (8 * rise);
      let ratio = width / (2 * radius);
      if (ratio > 1) ratio = 1;
      const theta = 2 * Math.asin(ratio);
      const arcLen = radius * theta;
      return { rawGeom: arcLen, finalReq: ceilPlus(arcLen, 1), radiusFt: radius };
    }
  }

  return { rawGeom: 0, finalReq: 0 };
}
