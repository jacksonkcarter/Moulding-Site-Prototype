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
  { label: "What you need to know to order", href: "/ordering-installation/ordering-tips" },
  { label: "Moulding types", href: "/product-info/browse-select-profiles" },
  {
    label: "Length and radius calculator",
    href: "/ordering-installation/flex-trim-toolbox",
  },
  { label: "Find a dealer", href: "/ordering-installation/dealer-search" },
  { label: "Check order status", href: "/order-status" },
] as const satisfies readonly NavLink[];

export const navItems = [
  {
    label: "Products",
    landingHref: "/product-info/product-overview",
    columns: [
      {
        title: "What is Flex Trim™?",
        links: [
          { label: "Product overview", href: "/product-info/product-overview" },
          { label: "Material details", href: "/product-info/material-details" },
          { label: "Stainable trim", href: "/product-info/stainable-product" },
        ],
      },
      {
        title: "Browse existing products",
        links: [
          { label: "Quick-ship stock items", href: "/product-info/browse-stock-items" },
          { label: "Select custom profiles", href: "/product-info/browse-select-profiles" },
          { label: "Architectural accessories", href: "/product-info/accessories" },
        ],
      },
      {
        title: "New tooling",
        links: [
          { label: "Replicate new custom profiles", href: "/product-info/replicate-custom-profiles" },
          { label: "Tight radii & bullnose corners", href: "/product-info/tight-radii-bullnose-corners" },
        ],
      },
    ],
  },
  {
    label: "Ordering",
    landingHref: "/ordering-installation/architects-designers",
    columns: [
      {
        title: "Get started",
        href: "/ordering-installation/how-to-order",
        links: [
          { label: "Architects & designers", href: "/ordering-installation/architects-designers" },
          { label: "Contractors & builders", href: "/ordering-installation/contractors-builders" },
          { label: "Dealers & distributors", href: "/ordering-installation/dealers-distributors" },
          { label: "Homeowners & end users", href: "/ordering-installation/homeowners" },
          { label: "Existing customers", href: "/ordering-installation/existing-customers" },
        ],
      },
      {
        title: "Tools and information",
        links: TOOLS_AND_INFORMATION_LINKS,
      },
      {
        title: "Browse products and profiles",
        links: [
          { label: "Quick-ship stock items", href: "/product-info/browse-stock-items" },
          { label: "Select custom profiles", href: "/product-info/browse-select-profiles" },
          { label: "Architectural accessories", href: "/product-info/accessories" },
          { label: "Replicate new custom profiles", href: "/product-info/replicate-custom-profiles" },
          { label: "Tight radii & bullnose corners", href: "/product-info/tight-radii-bullnose-corners" },
        ],
      },
    ],
  },
  {
    label: "Installation",
    landingHref: "/ordering-installation/installation-guide",
    children: [
      { label: "Overview", href: "/ordering-installation/installation-guide" },
      { label: "Preparing", href: "/ordering-installation/installation-guide?section=preparing" },
      { label: "Machining", href: "/ordering-installation/installation-guide?section=machining" },
      { label: "Installing", href: "/ordering-installation/installation-guide?section=installing" },
      { label: "Finishing", href: "/ordering-installation/installation-guide?section=finishing" },
    ],
  },
  {
    label: "Gallery",
    landingHref: "/gallery/applications",
    children: [
      { label: "Applications", href: "/gallery/applications" },
      { label: "Styles", href: "/gallery/styles" },
      { label: "Indoor & outdoor", href: "/gallery/indoor-outdoor" },
    ],
  },
  {
    label: "Resources",
    landingHref: "/forms-literature/catalog",
    children: [
      {
        label: "Tools and information",
        href: TOOLS_AND_INFORMATION_LINKS[0].href,
      },
      { label: "Catalog", href: "/forms-literature/catalog" },
      { label: "Brochure", href: "/forms-literature/brochure" },
      { label: "Order forms", href: "/forms-literature/forms" },
      { label: "Technical data", href: "/forms-literature/technical-data" },
      { label: "FAQ", href: "/ordering-installation/faq" },
      { label: "Warranty", href: "/company-info/warranty" },
    ],
  },
  {
    label: "About",
    landingHref: "/company-info/about-us",
    children: [
      { label: "Our company", href: "/company-info/about-us" },
      { label: "Management philosophy", href: "/company-info/management-philosophy" },
      { label: "Locations", href: "/company-info/locations" },
      { label: "Returns", href: "/company-info/returns" },
    ],
  },
] as const;

