/** Format decimal inches as a fraction string, e.g. 0.5 → `1/2"`, 4.1875 → `4-3/16"`. */
export function toFractionalInches(decimal: number): string {
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

/**
 * Parse a user-typed inch value that may be a decimal or fraction.
 * Supports `1.0625`, `1/2`, `1-1/16`, `1 1/16`, and optional trailing `"`.
 */
export function parseInchesInput(raw: string): number | null {
  const s = raw.trim().replace(/["″]/g, "").replace(/,/g, "").trim();
  if (!s) return null;

  // Mixed number: 1-1/16 or 1 1/16
  const mixed = /^(-?\d+)\s*[-\s]\s*(\d+)\s*\/\s*(\d+)$/.exec(s);
  if (mixed) {
    const whole = Number(mixed[1]);
    const num = Number(mixed[2]);
    const den = Number(mixed[3]);
    if (!den || Number.isNaN(whole) || Number.isNaN(num) || Number.isNaN(den)) return null;
    const sign = whole < 0 ? -1 : 1;
    return sign * (Math.abs(whole) + num / den);
  }

  // Simple fraction: 1/16 or 3/4
  const frac = /^(-?\d+)\s*\/\s*(\d+)$/.exec(s);
  if (frac) {
    const num = Number(frac[1]);
    const den = Number(frac[2]);
    if (!den || Number.isNaN(num) || Number.isNaN(den)) return null;
    return num / den;
  }

  const decimal = Number(s);
  return Number.isNaN(decimal) ? null : decimal;
}

/** Expand a user-entered min/max to match stored values rounded to `places` decimals. */
export function dimensionFilterBounds(
  min: number,
  max: number,
  places = 2,
): [number, number] {
  const factor = 10 ** places;
  const minBound = Math.floor(min * factor + 1e-9) / factor;
  const maxBound = Math.ceil(max * factor - 1e-9) / factor;
  return [minBound, maxBound];
}
