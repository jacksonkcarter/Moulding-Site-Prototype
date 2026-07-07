export type ProductApplication = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const PRODUCT_APPLICATIONS: ProductApplication[] = [
  {
    id: "arched-radius-casing",
    title: "Arched & radius casing",
    description:
      "Frame arched doorways and round windows flawlessly without the costly manufacturing and installation process. Our flexible casing is pre-bent to your exact radius for a seamless, professional finish.",
    image: "/product-info/product-overview/arched-radius-casing.png",
    imageAlt: "Arched doorway and round window with flexible radius casing",
  },
  {
    id: "curved-walls",
    title: "Curved walls",
    description:
      "Wrap sweeping staircases and radius walls effortlessly with our flexible baseboard, chair rail, and crown mouldings. Our material conforms tightly to any contour, eliminating the need for steam-bending or kerf-cutting.",
    image: "/product-info/product-overview/curved-walls.png",
    imageAlt: "Curved wall with flexible baseboard and chair rail moulding",
  },
  {
    id: "vaulted-domed-ceilings",
    title: "Vaulted & domed ceilings",
    description:
      "Elevate complex ceiling designs with flexible crown moulding that easily navigates changing pitches and tight radii. Achieve stunning architectural transitions in barrel vaults and domes using your standard installation tools.",
    image: "/product-info/product-overview/vaulted-domed-ceilings.png",
    imageAlt: "Vaulted ceiling with flexible crown moulding",
  },
  {
    id: "decorative-applied-mouldings",
    title: "Decorative applied mouldings",
    description:
      "Create intricate custom wall panels, curved wainscoting, and unique architectural details with ease. Our flexible profiles allow you to bring complex geometric patterns to life without the high cost and lead time of custom milling.",
    image: "/product-info/product-overview/decorative-applied-mouldings.png",
    imageAlt: "Decorative wall panels with flexible applied mouldings",
  },
  {
    id: "historical-reproductions",
    title: "Historical reproductions",
    description:
      "Faithfully restore older buildings by matching antique profiles in a modern, highly durable flexible material. We can replicate original, hard-to-find millwork designs or accessory items to preserve architectural integrity while saving hours of replication and installation labor.",
    image: "/product-info/product-overview/historical-reproductions.png",
    imageAlt: "Historic building interior with reproduced flexible millwork profiles",
  },
];
