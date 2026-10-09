export type MaterialUpgradeEmblem =
  | "flexibility"
  | "feather"
  | "fire"
  | "tooling"
  | "spiral";

export type MaterialUpgrade = {
  title: string;
  description: string;
  emblem: MaterialUpgradeEmblem;
  /** Product names shown on the collapsed card header. */
  products?: string[];
  footnote?: string;
  footnotes?: string[];
  learnMoreHref?: string;
};

export const MATERIAL_UPGRADES: MaterialUpgrade[] = [
  {
    title: "Additional flexibility",
    emblem: "flexibility",
    products: ["Zzz Flex®"],
    description:
      "Our premium elastomer composite is highly pliable and unmatched in strength, durability, and stainability, making it the ultimate choice for small, intricate patterns, tight radiuses, and cold-weather climates.",
  },
  {
    title: "Reduced weight",
    emblem: "feather",
    products: ["Ultra-Flex"],
    description:
      "This syntactic polyurethane is 40–50% lighter than standard flexible moulding. It comes pre-primed for flawless finishing, back-sanded for maximum glue adhesion, and performs beautifully indoors or out.",
    footnote: "Manufactured exclusively at our Utah plant.",
  },
  {
    title: "Commercial fire ratings",
    emblem: "fire",
    products: ["Ultra-Fire Flex"],
    description:
      "For commercial builds that require elevated fire performance, Ultra-Fire Flex delivers specialized fire-rated moulding. Our team can help you confirm it for your application and specification.",
    footnote: "Manufactured exclusively at our Utah plant.",
    learnMoreHref: "/product-info/ultra-fire-flex",
  },
  {
    title: "Enhanced machinability",
    emblem: "tooling",
    products: ["Machinable S4S"],
    description:
      "Engineered from our Ultra-Flex compound, this material can be milled with conventional woodworking machinery without dulling expensive carbide knives. It is perfect when you only need a small amount of straight, custom-tooled footage.",
    footnote: "Manufactured exclusively at our Utah plant.",
    learnMoreHref: "/product-info/machinable-s4s",
  },
  {
    title: "Extended lengths",
    emblem: "spiral",
    products: ["Xtrulinear®"],
    description:
      "Order Flex Trim™ or Zzz Flex in continuous lengths from 12' up to 500', wound on a spool for easy cut-to-length dispensing with virtually no waste and fewer joints on long runs.",
    footnote: "Available from our North Carolina and Utah plants.",
    learnMoreHref: "/product-info/xtrulinear",
  },
];
