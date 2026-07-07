export type MaterialUpgrade = {
  title: string;
  description: string;
  product?: string;
  footnote?: string;
  learnMoreHref?: string;
};

export const MATERIAL_UPGRADES: MaterialUpgrade[] = [
  {
    title: "Additional flexibility",
    product: "Zzz Flex®",
    description:
      "Our premium elastomer composite is highly pliable and unmatched in strength, durability, and stainability—making it the ultimate choice for small, intricate patterns, tight radiuses, and cold-weather climates.",
  },
  {
    title: "Reduced weight",
    product: "Ultra-Flex",
    description:
      "This syntactic polyurethane is 40–50% lighter than standard flexible moulding. It comes pre-primed for flawless finishing, back-sanded for maximum glue adhesion, and performs beautifully indoors or out.",
    footnote: "Manufactured exclusively at our Utah plant.",
  },
  {
    title: "Enhanced machinability",
    product: "Machinable S4S",
    description:
      "Engineered from our Ultra-Flex compound, this material can be milled with conventional woodworking machinery without dulling expensive carbide knives—perfect when you only need a small amount of straight, custom-tooled footage.",
    footnote: "Manufactured exclusively at our Utah plant.",
    learnMoreHref: "/product-info/machinable-s4s",
  },
  {
    title: "Commercial fire ratings",
    product: "Ultra-Fire Flex",
    description:
      "For commercial builds that require elevated fire performance, we offer specialized material options. Our team can help you select the right formulation for your application and specification.",
    footnote: "Manufactured exclusively at our Utah plant.",
    learnMoreHref: "/contact-us",
  },
];
