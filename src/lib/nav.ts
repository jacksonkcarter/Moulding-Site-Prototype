export type NavLink = {
  label: string;
  href: string;
};

export type NavColumn = {
  title: string;
  /** Optional link for the column header itself. */
  href?: string;
  links: readonly NavLink[];
};

/** Shared under Ordering → Tools and information, and Resources → Tools and information flyout. */
export const TOOLS_AND_INFORMATION_LINKS = [
  { label: "What you need to know to order", href: "/ordering/ordering-tips" },
  { label: "How to measure", href: "/ordering/how-to-measure" },
  {
    label: "Length and radius calculator",
    href: "/ordering/length-and-radius-calculator",
  },
  { label: "Moulding types", href: "/products/browse-select-profiles" },
  { label: "Find a dealer", href: "/ordering/dealer-search" },
  { label: "Check order status", href: "/ordering/order-status" },
] as const satisfies readonly NavLink[];

export const navItems = [
  {
    label: "Products",
    landingHref: "/products/product-overview",
    columns: [
      {
        title: "What is Flex Trim™?",
        links: [
          { label: "Product overview", href: "/products/product-overview" },
          { label: "Material details", href: "/products/material-details" },
          { label: "Stainable trim", href: "/products/stainable-product" },
        ],
      },
      {
        title: "Browse existing products",
        links: [
          { label: "Quick-ship stock items", href: "/products/browse-stock-items" },
          { label: "Production-ready profiles", href: "/products/browse-select-profiles" },
          { label: "Architectural accessories", href: "/products/accessories" },
        ],
      },
      {
        title: "New tooling",
        links: [
          { label: "Copy your profile in Flex Trim™", href: "/products/made-to-match" },
          { label: "Bullnose corners & tight radii", href: "/products/bullnose-corners-tight-radii" },
        ],
      },
    ],
  },
  {
    label: "Ordering",
    landingHref: "/ordering/architects-designers",
    columns: [
      {
        title: "Get started",
        href: "/ordering/how-to-order",
        links: [
          { label: "Architects & designers", href: "/ordering/architects-designers" },
          { label: "Contractors & builders", href: "/ordering/contractors-builders" },
          { label: "Dealers & distributors", href: "/ordering/dealers-distributors" },
          { label: "Homeowners & end users", href: "/ordering/homeowners" },
          { label: "Existing customers", href: "/ordering/existing-customers" },
        ],
      },
      {
        title: "Tools and information",
        links: TOOLS_AND_INFORMATION_LINKS,
      },
      {
        title: "Browse products and profiles",
        links: [
          { label: "Quick-ship stock items", href: "/products/browse-stock-items" },
          { label: "Production-ready profiles", href: "/products/browse-select-profiles" },
          { label: "Architectural accessories", href: "/products/accessories" },
          { label: "Copy your profile in Flex Trim™", href: "/products/made-to-match" },
          { label: "Bullnose corners & tight radii", href: "/products/bullnose-corners-tight-radii" },
        ],
      },
    ],
  },
  {
    label: "Installation",
    landingHref: "/installation",
    children: [
      { label: "Full guide", href: "/installation" },
      { label: "Preparing", href: "/installation?section=preparing" },
      { label: "Machining", href: "/installation?section=machining" },
      { label: "Installing", href: "/installation?section=installing" },
      { label: "Finishing", href: "/installation?section=finishing" },
    ],
  },
  {
    label: "Gallery",
    landingHref: "/gallery",
    children: [
      { label: "View all", href: "/gallery" },
      { label: "Arched & radius casing", href: "/gallery#arched-radius-casing" },
      { label: "Curved walls", href: "/gallery#curved-walls" },
      { label: "Vaulted & domed ceilings", href: "/gallery#vaulted-domed-ceilings" },
      { label: "Decorative applied mouldings", href: "/gallery#decorative-applied-mouldings" },
      { label: "Stained Flex Trim™", href: "/gallery#stained-flex-trim" },
      { label: "Outdoor installations", href: "/gallery#outdoor-installations" },
      { label: "On the job site", href: "/gallery#on-the-job-site" },
      { label: "Featured", href: "/gallery#featured" },
    ],
  },
  {
    label: "Resources",
    landingHref: "/resources/catalog",
    children: [
      {
        label: "Tools and information",
        href: TOOLS_AND_INFORMATION_LINKS[0].href,
      },
      { label: "Catalog", href: "/resources/catalog" },
      { label: "Brochure", href: "/resources/brochure" },
      { label: "Order forms", href: "/resources/forms" },
      { label: "Stock list", href: "/resources/stock-list" },
      { label: "Technical data", href: "/resources/technical-data" },
      { label: "Radius gauges", href: "/resources/radius-gauges" },
      { label: "FAQ", href: "/resources/faq" },
      { label: "Warranty", href: "/resources/warranty" },
    ],
  },
  {
    label: "About",
    landingHref: "/about/about-us",
    children: [
      { label: "Our company", href: "/about/about-us" },
      { label: "Our values", href: "/about/management-philosophy" },
      { label: "Locations", href: "/about/locations" },
      { label: "Returns", href: "/about/returns" },
    ],
  },
] as const;

