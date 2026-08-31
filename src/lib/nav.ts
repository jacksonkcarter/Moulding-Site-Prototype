export const navItems = [
  {
    label: "Products",
    landingHref: "/product-info/browse-select-profiles",
    children: [
      { label: "Product overview", href: "/product-info/product-overview" },
      { label: "Material details", href: "/product-info/material-details" },
      { label: "Browse stock items", href: "/product-info/browse-stock-items" },
      { label: "Browse select profiles", href: "/product-info/browse-select-profiles" },
      { label: "Replicate custom profiles", href: "/product-info/replicate-custom-profiles" },
      { label: "Accessories", href: "/product-info/accessories" },
      { label: "Tight radii & bullnose corners", href: "/product-info/tight-radii-bullnose-corners" },
      { label: "Stainable trim", href: "/product-info/stainable-product" },
    ],
  },
  {
    label: "Ordering",
    landingHref: "/ordering-installation/architects-designers",
    children: [
      { label: "Architects & designers", href: "/ordering-installation/architects-designers" },
      { label: "Contractors & builders", href: "/ordering-installation/contractors-builders" },
      { label: "Dealers & distributors", href: "/ordering-installation/dealers-distributors" },
      { label: "Homeowners", href: "/ordering-installation/homeowners" },
      { label: "Dealer search", href: "/ordering-installation/dealer-search" },
      { label: "Check order status", href: "/order-status" },
      { label: "Get started", href: "/ordering-installation/how-to-order" },
      { label: "Quote request", href: "/quote-request" },
      { label: "Products and profiles", href: "/product-info/stock-items" },
      { label: "Flex Trim Toolbox", href: "/ordering-installation/flex-trim-toolbox" },
    ],
  },
  {
    label: "Installation",
    landingHref: "/ordering-installation/installation-guide",
    children: [
      { label: "Overview", href: "/ordering-installation/installation-guide" },
      { label: "Preparing", href: "/ordering-installation/installation-guide#preparing" },
      { label: "Machining", href: "/ordering-installation/installation-guide#machining" },
      { label: "Installing", href: "/ordering-installation/installation-guide#installing" },
      { label: "Finishing", href: "/ordering-installation/installation-guide#finishing" },
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
      { label: "Catalog", href: "/forms-literature/catalog" },
      { label: "Brochure", href: "/forms-literature/brochure" },
      { label: "Technical data", href: "/forms-literature/technical-data" },
      { label: "Order forms", href: "/forms-literature/forms" },
      { label: "FAQ", href: "/ordering-installation/faq" },
    ],
  },
  {
    label: "About",
    landingHref: "/company-info/about-us",
    children: [
      { label: "Our company", href: "/company-info/about-us" },
      { label: "Locations", href: "/company-info/locations" },
      { label: "Returns", href: "/company-info/returns" },
    ],
  },
] as const;
