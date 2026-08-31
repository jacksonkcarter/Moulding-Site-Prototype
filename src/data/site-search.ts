import { FAQ_CATEGORIES } from "@/data/faq";
import { GALLERY_APPLICATIONS } from "@/data/gallery-applications";
import { MATERIAL_UPGRADES } from "@/data/material-upgrades";
import { PRODUCT_APPLICATIONS } from "@/data/product-applications";
import { PROFILE_MOULDING_TYPES } from "@/data/profile-moulding-types";
import { STOCK_ITEMS, STOCK_ITEM_SECTIONS, getStockItemDisplayName } from "@/data/stock-items";
import { navItems } from "@/lib/nav";

export type SiteSearchCategory =
  | "Pages"
  | "Products"
  | "Stock items"
  | "Profiles"
  | "FAQ"
  | "Gallery"
  | "Resources";

export type SiteSearchEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: SiteSearchCategory;
  keywords: string[];
};

function uniqueById(entries: SiteSearchEntry[]): SiteSearchEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

const STATIC_PAGES: SiteSearchEntry[] = [
  {
    id: "home",
    title: "Home",
    description: "Curved trim made easy — Flex Trim™ flexible moulding by Carter Millwork.",
    href: "/",
    category: "Pages",
    keywords: ["flex trim", "carter millwork", "flexible moulding", "home"],
  },
  {
    id: "contact-us",
    title: "Contact us",
    description: "Reach Flex Trim East or West for sales, orders, and support.",
    href: "/contact-us",
    category: "Pages",
    keywords: ["phone", "email", "sales", "support", "facility"],
  },
  {
    id: "quote-request",
    title: "Quote request",
    description: "Tell us about your project for pricing and lead times.",
    href: "/quote-request",
    category: "Pages",
    keywords: ["pricing", "estimate", "custom quote"],
  },
  {
    id: "product-overview",
    title: "Product overview",
    description: "Applications and benefits of Flex Trim™ flexible moulding.",
    href: "/product-info/product-overview",
    category: "Products",
    keywords: ["overview", "applications", "curved", "radius"],
  },
  {
    id: "material-details",
    title: "Material details",
    description: "Compare Flex Trim™, Zzz Flex®, Ultra-Flex, Ultra-Fire Flex, and Machinable S4S.",
    href: "/product-info/material-details",
    category: "Products",
    keywords: ["polyurethane", "materials", "warranty", "comparison"],
  },
  {
    id: "stock-items",
    title: "Browse stock items",
    description: "Browse ready-to-ship stock moulding by category, or view the full stock list.",
    href: "/product-info/browse-stock-items",
    category: "Stock items",
    keywords: ["inventory", "in stock", "ready to ship", "browse by category"],
  },
  {
    id: "stock-items-all",
    title: "Browse all stock items",
    description: "Search and filter the full Flex Trim™ stock catalogue.",
    href: "/product-info/stock-items",
    category: "Stock items",
    keywords: ["stock search", "all stock"],
  },
  {
    id: "profile-search",
    title: "Browse select profiles",
    description: "Browse tooled profiles by moulding type, or search the full library.",
    href: "/product-info/browse-select-profiles",
    category: "Profiles",
    keywords: ["custom profiles", "moulding types", "tooled", "browse by category"],
  },
  {
    id: "profile-search-all",
    title: "Browse all profiles",
    description: "Search and filter the full select-profile library.",
    href: "/product-info/profile-search",
    category: "Profiles",
    keywords: ["profile search", "all profiles"],
  },
  {
    id: "replicate",
    title: "Replicate custom profiles",
    description: "Made-to-Match process to recreate existing or historic moulding profiles.",
    href: "/product-info/replicate-custom-profiles",
    category: "Products",
    keywords: ["made to match", "tracing", "historic", "custom mold", "lead times"],
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Architectural accessories for Flex Trim™ projects.",
    href: "/product-info/accessories",
    category: "Products",
    keywords: ["corbels", "appliques", "blocks"],
  },
  {
    id: "tight-radii-bullnose-corners",
    title: "Tight radii & bullnose corners",
    description: "Flexible moulding solutions for tight radiuses and bullnose corner applications.",
    href: "/product-info/tight-radii-bullnose-corners",
    category: "Products",
    keywords: ["tight radius", "bullnose", "corners", "small radius", "zzz flex"],
  },
  {
    id: "stainable",
    title: "Stainable trim",
    description: "Stain-grade flexible moulding that replicates real wood grain.",
    href: "/product-info/stainable-product",
    category: "Products",
    keywords: ["gel stain", "wood grain", "alder", "mahogany", "maple"],
  },
  {
    id: "xtrulinear",
    title: "Xtrulinear® extended lengths",
    description:
      "Continuous Flex Trim™ or Zzz Flex moulding from 12' to 500' on a spool—cut to length with fewer joints and less waste.",
    href: "/product-info/xtrulinear",
    category: "Products",
    keywords: [
      "xtrulinear",
      "spool",
      "extended length",
      "coil",
      "500 foot",
      "cut to length",
      "zzz flex",
      "north carolina",
      "utah",
    ],
  },
  {
    id: "machinable-s4s",
    title: "Machinable S4S",
    description: "Flexible stock milled with conventional woodworking equipment for straight runs.",
    href: "/product-info/machinable-s4s",
    category: "Products",
    keywords: ["s4s", "moulder", "router", "straight run", "utah"],
  },
  {
    id: "ultra-fire-flex",
    title: "Ultra-Fire Flex",
    description: "Commercial fire-rated flexible moulding with Class B flame-spread performance.",
    href: "/product-info/ultra-fire-flex",
    category: "Products",
    keywords: ["fire rated", "astm", "commercial", "flame"],
  },
  {
    id: "architects-designers",
    title: "Architects & designers",
    description: "Specifying and ordering Flex Trim™ for design projects.",
    href: "/ordering-installation/architects-designers",
    category: "Pages",
    keywords: ["architect", "designer", "specify", "ordering"],
  },
  {
    id: "contractors-builders",
    title: "Contractors & builders",
    description: "Ordering Flex Trim™ for construction and jobsite projects.",
    href: "/ordering-installation/contractors-builders",
    category: "Pages",
    keywords: ["contractor", "builder", "jobsite", "ordering"],
  },
  {
    id: "dealers-distributors",
    title: "Dealers & distributors",
    description: "Partner resources for stocking and ordering Flex Trim™.",
    href: "/ordering-installation/dealers-distributors",
    category: "Pages",
    keywords: ["dealer", "distributor", "partner", "ordering"],
  },
  {
    id: "homeowners",
    title: "Homeowners",
    description: "Learn about Flex Trim™ and how to order for your home.",
    href: "/ordering-installation/homeowners",
    category: "Pages",
    keywords: ["homeowner", "home", "residential", "ordering"],
  },
  {
    id: "how-to-order",
    title: "Get started",
    description: "Guidance for ordering Flex Trim™ stock and custom products.",
    href: "/ordering-installation/how-to-order",
    category: "Pages",
    keywords: ["ordering", "minimums", "dealers", "how to order", "get started"],
  },
  {
    id: "dealer-search",
    title: "Dealer search",
    description: "Find Flex Trim™ dealers by zip code and radius.",
    href: "/ordering-installation/dealer-search",
    category: "Pages",
    keywords: ["distributor", "local dealer", "zip code"],
  },
  {
    id: "flex-trim-toolbox",
    title: "Flex Trim Toolbox",
    description: "Estimate Flex Trim™ length for half rounds, arcs, ellipses, ovals, and custom shapes.",
    href: "/ordering-installation/flex-trim-toolbox",
    category: "Pages",
    keywords: ["radius", "calculator", "arc", "curve", "length", "rise", "oval", "elliptical", "half round", "toolbox"],
  },
  {
    id: "installation-guide",
    title: "Installation guide",
    description: "Preparing, machining, installing, and finishing Flex Trim™ flexible moulding.",
    href: "/ordering-installation/installation-guide",
    category: "Pages",
    keywords: ["install", "adhesive", "fasteners", "paint", "stain", "videos"],
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Frequently asked questions about products, ordering, installation, and support.",
    href: "/ordering-installation/faq",
    category: "FAQ",
    keywords: ["questions", "help", "answers"],
  },
  {
    id: "gallery-applications",
    title: "Gallery — Applications",
    description: "Photos of Flex Trim™ used on arches, curved walls, ceilings, and more.",
    href: "/gallery/applications",
    category: "Gallery",
    keywords: ["photos", "inspiration", "projects"],
  },
  {
    id: "gallery-styles",
    title: "Gallery — Styles",
    description: "Style inspiration for Flex Trim™ installations.",
    href: "/gallery/styles",
    category: "Gallery",
    keywords: ["style", "design"],
  },
  {
    id: "gallery-indoor-outdoor",
    title: "Gallery — Indoor & outdoor",
    description: "Indoor and outdoor Flex Trim™ application examples.",
    href: "/gallery/indoor-outdoor",
    category: "Gallery",
    keywords: ["exterior", "interior", "outdoor", "indoor"],
  },
  {
    id: "catalog",
    title: "Catalog",
    description: "Download the Carter Millwork catalog.",
    href: "/forms-literature/catalog",
    category: "Resources",
    keywords: ["pdf", "download", "literature"],
  },
  {
    id: "brochure",
    title: "Brochure",
    description: "Download the Carter Millwork brochure.",
    href: "/forms-literature/brochure",
    category: "Resources",
    keywords: ["pdf", "download", "literature"],
  },
  {
    id: "technical-data",
    title: "Technical data",
    description: "Product data sheets, MSDS, LEED information, and Prop 65 documents.",
    href: "/forms-literature/technical-data",
    category: "Resources",
    keywords: ["msds", "leed", "prop 65", "specs", "data sheet"],
  },
  {
    id: "order-forms",
    title: "Order forms",
    description: "Arc & straight and crown quote/order forms.",
    href: "/forms-literature/forms",
    category: "Resources",
    keywords: ["pdf", "order form", "crown form"],
  },
  {
    id: "about-us",
    title: "Our company",
    description: "Carter Millwork history, timeline, and company story.",
    href: "/company-info/about-us",
    category: "Pages",
    keywords: ["about", "history", "family", "lexington"],
  },
  {
    id: "locations",
    title: "Locations",
    description: "Flex Trim East (Lexington, NC) and Flex Trim West (Provo, UT) facilities and coverage map.",
    href: "/company-info/locations",
    category: "Pages",
    keywords: ["north carolina", "utah", "facility", "map", "east", "west"],
  },
  {
    id: "returns",
    title: "Returns",
    description: "Return policy, RMA requirements, and restocking fees.",
    href: "/company-info/returns",
    category: "Pages",
    keywords: ["rma", "restocking", "refund", "return policy"],
  },
  {
    id: "warranty",
    title: "Limited lifetime warranty",
    description:
      "Warranty coverage, exclusions, remedies, and how to make a claim for Flex Trim™ flexible moulding.",
    href: "/company-info/warranty",
    category: "Pages",
    keywords: ["warranty", "lifetime", "defects", "claim", "guarantee"],
  },
  {
    id: "order-status",
    title: "Check order status",
    description: "Look up your Flex Trim™ order with your order number and billing zip code.",
    href: "/order-status",
    category: "Pages",
    keywords: ["order status", "tracking", "zip", "shipment"],
  },
];

function buildNavEntries(): SiteSearchEntry[] {
  const entries: SiteSearchEntry[] = [];
  for (const item of navItems) {
    if (!("children" in item)) continue;
    for (const child of item.children) {
      entries.push({
        id: `nav-${item.label}-${child.label}`,
        title: child.label,
        description: `${item.label} — ${child.label}`,
        href: child.href,
        category: "Pages",
        keywords: [item.label, child.label],
      });
    }
  }
  return entries;
}

function buildStockEntries(): SiteSearchEntry[] {
  const sectionEntries: SiteSearchEntry[] = STOCK_ITEM_SECTIONS.map((section) => ({
    id: `stock-section-${section.id}`,
    title: `${section.label} stock items`,
    description: `Browse ${section.label} flexible moulding in stock.`,
    href: `/product-info/stock-items#${section.id}`,
    category: "Stock items" as const,
    keywords: [section.label, "stock", "inventory"],
  }));

  const itemEntries: SiteSearchEntry[] = STOCK_ITEMS.map((item) => ({
    id: `stock-${item.categorySlug}-${item.item}`,
    title: getStockItemDisplayName(item),
    description: [
      item.category,
      item.dimensions ? `${item.dimensions}` : null,
      item.miscellaneousLabel,
    ]
      .filter(Boolean)
      .join(" · "),
    href: `/product-info/stock-items/${item.categorySlug}/${encodeURIComponent(item.item)}`,
    category: "Stock items" as const,
    keywords: [
      item.item,
      item.alternateName ?? "",
      item.category,
      item.miscellaneousLabel ?? "",
      ...(item.configs ?? []),
    ],
  }));

  return [...sectionEntries, ...itemEntries];
}

function buildFaqEntries(): SiteSearchEntry[] {
  return FAQ_CATEGORIES.filter((category) => !category.excludeFromSearch).flatMap((category) =>
    category.items.map((item) => ({
      id: `faq-${item.id}`,
      title: item.question,
      description: item.answer[0] ?? category.title,
      href: `/ordering-installation/faq#${item.id}`,
      category: "FAQ" as const,
      keywords: [category.title, ...(item.steps?.map((step) => step.title) ?? [])],
    }))
  );
}

function buildMaterialEntries(): SiteSearchEntry[] {
  return MATERIAL_UPGRADES.map((upgrade) => {
    const productLabel = upgrade.products?.join(" & ") || upgrade.title;
    return {
      id: `material-${upgrade.products?.[0] ?? upgrade.title}`,
      title: productLabel,
      description: upgrade.description,
      href: upgrade.learnMoreHref ?? "/product-info/material-details",
      category: "Products" as const,
      keywords: [upgrade.title, ...(upgrade.products ?? []), "material", "upgrade"],
    };
  });
}

function buildGalleryEntries(): SiteSearchEntry[] {
  return GALLERY_APPLICATIONS.map((app) => ({
    id: `gallery-${app.id}`,
    title: app.title,
    description: app.description,
    href: `/gallery/applications`,
    category: "Gallery" as const,
    keywords: [app.title, "gallery", "application"],
  }));
}

function buildProductApplicationEntries(): SiteSearchEntry[] {
  return PRODUCT_APPLICATIONS.map((app) => ({
    id: `product-app-${app.id}`,
    title: app.title,
    description: app.description,
    href: "/product-info/product-overview",
    category: "Products" as const,
    keywords: [app.title, "application", "overview"],
  }));
}

function buildProfileTypeEntries(): SiteSearchEntry[] {
  return PROFILE_MOULDING_TYPES.map((type) => ({
    id: `profile-type-${type}`,
    title: `${type} profiles`,
    description: `Browse select ${type.toLowerCase()} profiles in the profile search.`,
    href: `/product-info/profile-search?types=${encodeURIComponent(type)}`,
    category: "Profiles" as const,
    keywords: [type, "profile", "moulding"],
  }));
}

/** Full site search corpus used by the header search and /search page. */
export const SITE_SEARCH_INDEX: SiteSearchEntry[] = uniqueById([
  ...STATIC_PAGES,
  ...buildNavEntries(),
  ...buildStockEntries(),
  ...buildFaqEntries(),
  ...buildMaterialEntries(),
  ...buildGalleryEntries(),
  ...buildProductApplicationEntries(),
  ...buildProfileTypeEntries(),
]);
