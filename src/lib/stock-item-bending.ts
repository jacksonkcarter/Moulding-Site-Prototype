import type { StockItem, StockItemBendingLimits } from "@/data/stock-items";
import {
  ARC_CONFIGS,
  HALF_ROUND_CONFIGS,
  STRAIGHT_CONFIGS,
} from "@/lib/stock-item-configs";
import { toFractionalInches } from "@/lib/format-inches";

export type StockBendingLimitationContent =
  | { kind: "select" }
  | { kind: "lines"; intro: string; lines: string[] };

/** Convert half-round size like "2/0" / "2/6" (ft/in) to neutral diameter in inches. */
export function halfRoundNeutralDiameterInches(config: string): number | null {
  const m = /^(\d+)\/(\d+)$/.exec(config.trim());
  if (!m) return null;
  return Number(m[1]) * 12 + Number(m[2]);
}

/** Extract neutral radius inches from an arc config like `7' @ 84"R`. */
export function arcNeutralRadiusInches(config: string): number | null {
  const m = /(\d+(?:\.\d+)?)\s*"?\s*R\b/i.exec(config);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isNaN(n) ? null : n;
}

function formatInches(n: number): string {
  return toFractionalInches(n);
}

function isStraightConfig(config: string): boolean {
  return (STRAIGHT_CONFIGS as readonly string[]).includes(config);
}

function isHalfRoundConfig(config: string): boolean {
  return (HALF_ROUND_CONFIGS as readonly string[]).includes(config);
}

function isArcConfig(config: string): boolean {
  return (ARC_CONFIGS as readonly string[]).includes(config);
}

function straightLines(
  limits: StockItemBendingLimits,
  isCrown: boolean,
): StockBendingLimitationContent | null {
  const style1 = limits.straightStyle1;
  const style2 = limits.straightStyle2;
  const lines: string[] = [];

  if (isCrown) {
    if (style1 != null) lines.push(formatInches(style1));
    if (style2 != null) lines.push(formatInches(style2));
    if (lines.length === 0) return null;
    return {
      kind: "lines",
      intro:
        "This item is manufactured as straight, but is bendable down to the following minimum wall radii:",
      lines,
    };
  }

  if (style1 != null) lines.push(`Style 1 - ${formatInches(style1)}`);
  if (style2 != null) lines.push(`Style 2 - ${formatInches(style2)}`);
  if (lines.length === 0) return null;
  return {
    kind: "lines",
    intro:
      "This item is manufactured as straight, but is bendable down to the following minimum radii:",
    lines,
  };
}

function halfRoundLines(
  limits: StockItemBendingLimits,
  config: string,
): StockBendingLimitationContent | null {
  const neutral = halfRoundNeutralDiameterInches(config);
  const pair = limits.halfRound[config];
  if (neutral == null || !pair) return null;

  const lines: string[] = [];
  if (pair.minDiameter != null) {
    lines.push(`Minimum diameter = ${formatInches(pair.minDiameter)}`);
  }
  if (pair.maxDiameter != null) {
    lines.push(`Maximum diameter = ${formatInches(pair.maxDiameter)}`);
  }
  if (lines.length === 0) return null;

  return {
    kind: "lines",
    intro: `This item is manufactured to a ${formatInches(neutral)} neutral position diameter, but can flex in & out to the following diameter range:`,
    lines,
  };
}

function arcLines(
  limits: StockItemBendingLimits,
  config: string,
): StockBendingLimitationContent | null {
  const neutral = arcNeutralRadiusInches(config);
  if (neutral == null) return null;
  const pair = limits.arc[String(neutral)];
  if (!pair) return null;

  const lines: string[] = [];
  if (pair.minRadius != null) {
    lines.push(`Minimum radius = ${formatInches(pair.minRadius)}`);
  }
  if (pair.maxRadius != null) {
    lines.push(`Maximum radius = ${formatInches(pair.maxRadius)}`);
  }
  if (lines.length === 0) return null;

  return {
    kind: "lines",
    intro: `This item is manufactured to a ${formatInches(neutral)} neutral position radius, but can flex in & out to the following radius range:`,
    lines,
  };
}

/**
 * Resolve which size drives bending copy: explicit selection, or the sole available size.
 */
export function resolveBendingConfig(
  item: Pick<StockItem, "configs">,
  selectedConfig: string | null,
): string | null {
  if (selectedConfig && item.configs.includes(selectedConfig)) return selectedConfig;
  if (item.configs.length === 1) return item.configs[0];
  return null;
}

/** Build application/bending limitation copy for the active size, if any. */
export function getStockBendingLimitationContent(
  item: Pick<StockItem, "category" | "configs" | "bendingLimits">,
  selectedConfig: string | null,
): StockBendingLimitationContent | null {
  const config = resolveBendingConfig(item, selectedConfig);
  if (!config) {
    if (item.configs.length > 1) return { kind: "select" };
    return null;
  }

  const isCrown = item.category === "Crown";
  if (isStraightConfig(config)) {
    return straightLines(item.bendingLimits, isCrown);
  }
  if (isHalfRoundConfig(config)) {
    return halfRoundLines(item.bendingLimits, config);
  }
  if (isArcConfig(config)) {
    return arcLines(item.bendingLimits, config);
  }
  return null;
}
