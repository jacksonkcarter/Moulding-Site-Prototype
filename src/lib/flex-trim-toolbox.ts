/** Shape-based Flex Trim™ length math, ported from the internal Python calculator. */

export const TOOLBOX_SHAPES = [
  "Half Round",
  "Arc/Eyebrow",
  "Elliptical",
  "Oval",
  "Custom Shape",
] as const;

export type ToolboxShape = (typeof TOOLBOX_SHAPES)[number];

export type ToolboxFieldName =
  | "Width"
  | "Height"
  | "Rise"
  | "Diameter"
  | "Straight Legs"
  | "Length Around Outside";

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
    case "Arc/Eyebrow":
      return ["Width", "Rise"];
    case "Half Round":
      return ["Diameter", "Straight Legs"];
    case "Custom Shape":
      return [];
  }
}

export function calculateToolboxLength(
  shape: ToolboxShape,
  lrSelected: boolean,
  isMeasuredMode: boolean,
  values: ToolboxValues,
): ToolboxResult {
  if (isMeasuredMode) {
    const length = val(values, "Length Around Outside");
    if (length === 0) return { rawGeom: 0, finalReq: 0 };

    if (lrSelected) {
      const rawGeom = length / 2;
      return { rawGeom, finalReq: ceilPlus(rawGeom, 1) };
    }

    if (shape === "Custom Shape") {
      return { rawGeom: length, finalReq: ceilPlus(length, 2) };
    }
    if (shape === "Oval") {
      const halfLen = length / 2;
      return { rawGeom: length, finalReq: (Math.ceil(halfLen) + 1) * 2 };
    }
    return { rawGeom: length, finalReq: ceilPlus(length, 1) };
  }

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
      if (!lrSelected) {
        const rawGeom = archLen + legs * 2;
        return { rawGeom, finalReq: ceilPlus(rawGeom, 2) };
      }
      const rawGeom = archLen / 2 + legs;
      return { rawGeom, finalReq: ceilPlus(rawGeom, 1) };
    }
  } else if (shape === "Arc/Eyebrow") {
    const width = val(values, "Width");
    const rise = val(values, "Rise");
    if (width > 0) {
      let arcLen: number;
      let radiusFt: number | undefined;
      if (rise > 0) {
        const radius = rise / 2 + width ** 2 / (8 * rise);
        radiusFt = radius;
        let ratio = width / (2 * radius);
        if (ratio > 1) ratio = 1;
        const theta = 2 * Math.asin(ratio);
        arcLen = radius * theta;
      } else {
        arcLen = width;
      }
      if (lrSelected) {
        const rawGeom = arcLen / 2;
        return { rawGeom, finalReq: ceilPlus(rawGeom, 1), radiusFt };
      }
      return { rawGeom: arcLen, finalReq: ceilPlus(arcLen, 1), radiusFt };
    }
  } else if (shape === "Half Round") {
    const diameter = val(values, "Diameter");
    const legs = val(values, "Straight Legs");
    if (diameter > 0) {
      const halfCirc = (Math.PI * diameter) / 2;
      if (!lrSelected) {
        const rawGeom = halfCirc + legs * 2;
        return { rawGeom, finalReq: ceilPlus(rawGeom, 1) };
      }
      const rawGeom = halfCirc + legs;
      return { rawGeom, finalReq: ceilPlus(rawGeom, 1) };
    }
  }

  return { rawGeom: 0, finalReq: 0 };
}
