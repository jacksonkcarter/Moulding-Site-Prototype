export const navItems = [
  {
    label: "Products",
    landingHref: "/product-info/profile-search",
    children: [
      { label: "Product overview", href: "/product-info/product-overview" },
      { label: "Material details", href: "/product-info/material-details" },
      { label: "Browse stock items", href: "/product-info/stock-items" },
      { label: "Browse all profiles", href: "/product-info/profile-search" },
      { label: "Replicate custom profiles", href: "/quote-request" },
      { label: "Accessories", href: "/product-info/accessories" },
      { label: "Stainable trim", href: "/product-info/stainable-product" },
    ],
  },
  {
    label: "Ordering",
    landingHref: "/ordering-installation/how-to-order",
    children: [
      { label: "How to order", href: "/ordering-installation/how-to-order" },
      { label: "Dealer search", href: "/ordering-installation/dealer-search" },
      { label: "Quote request", href: "/quote-request" },
      { label: "Browse all profiles", href: "/product-info/profile-search" },
      { label: "Radius calculator", href: "/ordering-installation/radius-calculator" },
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
      { label: "Order forms", href: "/forms-literature/forms" },
    ],
  },
  { label: "FAQ", href: "/ordering-installation/faq" },
  { label: "About", href: "/company-info/about-us" },
] as const;
