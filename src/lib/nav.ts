export const navItems = [
  {
    label: "Our Products",
    landingHref: "/product-info/profile-search",
    children: [
      { label: "Browse Stock Items", href: "/product-info/stock-items" },
      { label: "Browse All Profiles", href: "/product-info/profile-search" },
      { label: "New Profile Process", href: "/quote-request" },
      { label: "Product Details", href: "/product-info/material-info" },
      { label: "Accessories", href: "/product-info/accessories" },
      { label: "Stainable", href: "/product-info/stainable-product" },
    ],
  },
  {
    label: "Ordering",
    landingHref: "/quote-request",
    children: [
      { label: "Quote Request", href: "/quote-request" },
      { label: "Browse All Profiles", href: "/product-info/profile-search" },
      { label: "Dealer Search", href: "/ordering-installation/dealer-search" },
      { label: "Radius Calculator", href: "/ordering-installation/radius-calculator" },
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
      { label: "Indoor & Outdoor", href: "/gallery/indoor-outdoor" },
    ],
  },
  {
    label: "Resources",
    landingHref: "/forms-literature/literature",
    children: [
      { label: "Catalog", href: "/forms-literature/literature" },
      { label: "Brochure", href: "/forms-literature/literature" },
      { label: "Order Forms", href: "/forms-literature/forms" },
    ],
  },
  { label: "FAQ", href: "/ordering-installation/faq" },
  { label: "About", href: "/company-info/about-us" },
] as const;
