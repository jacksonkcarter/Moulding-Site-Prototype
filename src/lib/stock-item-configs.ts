export const STRAIGHT_CONFIGS = ["12 FT", "10 FT", "8 FT"] as const;
export const HALF_ROUND_CONFIGS = ["6/0", "5/0", "4/0", "3/0", "2/6", "2/0"] as const;
export const ARC_CONFIGS = [
  '7\' @ 84"R',
  '12\' @ 48"R',
  '8\' @ 48"R',
  '7\' @ 48"R',
  '4.5\' @ 30"R',
] as const;

export type StockConfigGroup = {
  label: "Straight" | "Half-round" | "Arc";
  options: string[];
};

export const STOCK_CONFIG_STYLE_INFO: Partial<
  Record<StockConfigGroup["label"], { src: string; alt: string }>
> = {
  "Half-round": {
    src: "/order-form-images/Arch Style Half Round.png",
    alt: "Half-round arch with radius and diameter measurements",
  },
  Arc: {
    src: "/order-form-images/Arc Style Eyebrow.png",
    alt: "Arc or eyebrow arch with width and rise measurements",
  },
};

export function groupConfigs(configs: string[]): {
  straight: string[];
  halfRound: string[];
  arc: string[];
} {
  const straight = configs.filter((c) =>
    (STRAIGHT_CONFIGS as readonly string[]).includes(c),
  );
  const halfRound = configs.filter((c) =>
    (HALF_ROUND_CONFIGS as readonly string[]).includes(c),
  );
  const arc = configs.filter((c) => (ARC_CONFIGS as readonly string[]).includes(c));
  return { straight, halfRound, arc };
}

/** Groups with at least one available size, in display order. */
export function getStockConfigGroups(configs: string[]): StockConfigGroup[] {
  const { straight, halfRound, arc } = groupConfigs(configs);
  const groups: StockConfigGroup[] = [
    { label: "Straight", options: straight },
    { label: "Half-round", options: halfRound },
    { label: "Arc", options: arc },
  ];
  return groups.filter((g) => g.options.length > 0);
}

/** Half-round size label → public range diagram (e.g. "2/0" → `/stock-items/20 HR Range.png`). */
export function halfRoundRangeImageSrc(config: string): string | null {
  if (!(HALF_ROUND_CONFIGS as readonly string[]).includes(config)) return null;
  const slug = config.replace(/\//g, "");
  return `/stock-items/${encodeURIComponent(`${slug} HR Range.png`)}`;
}

/** Arc size label → public range diagram (e.g. `7' @ 48"R` → `/stock-items/7 48 Arc Range.png`). */
export function arcRangeImageSrc(config: string): string | null {
  if (!(ARC_CONFIGS as readonly string[]).includes(config)) return null;
  const match = config.match(/^([\d.]+)'\s*@\s*(\d+)"R$/);
  if (!match) return null;
  return `/stock-items/${encodeURIComponent(`${match[1]} ${match[2]} Arc Range.png`)}`;
}

/** Range diagram for a half-round or arc config, if one exists. */
export function stockConfigRangeImageSrc(config: string): string | null {
  return halfRoundRangeImageSrc(config) ?? arcRangeImageSrc(config);
}
