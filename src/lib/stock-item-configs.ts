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
  label: "Straight" | "Half Round" | "Arc";
  options: string[];
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
    { label: "Half Round", options: halfRound },
    { label: "Arc", options: arc },
  ];
  return groups.filter((g) => g.options.length > 0);
}

export function configToFolder(name: string): string {
  return name.replace(/\//g, "");
}
