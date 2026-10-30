import type { NextConfig } from "next";

/**
 * Permanent redirects from legacy high-level paths to menu-aligned URLs.
 * Query strings are preserved by Next.js for these redirects.
 * Product asset files under /public/product-info stay put — only page routes redirect.
 */
const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx", "pdfjs-dist"],
  images: {
    // Hero slideshow sources go up to ~6000px; keep high-DPR desktop sizes available.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840, 5120, 6016],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
  async redirects() {
    return [
      // Products (explicit page routes so /public/product-info assets are untouched)
      {
        source: "/product-info/product-overview",
        destination: "/products/product-overview",
        permanent: true,
      },
      {
        source: "/product-info/material-details",
        destination: "/products/material-details",
        permanent: true,
      },
      {
        source: "/product-info/stainable-product",
        destination: "/products/stainable-product",
        permanent: true,
      },
      {
        source: "/product-info/browse-stock-items",
        destination: "/products/browse-stock-items",
        permanent: true,
      },
      {
        source: "/product-info/browse-select-profiles",
        destination: "/products/browse-select-profiles",
        permanent: true,
      },
      {
        source: "/product-info/accessories",
        destination: "/products/accessories",
        permanent: true,
      },
      {
        source: "/product-info/accessories/:path*",
        destination: "/products/accessories/:path*",
        permanent: true,
      },
      {
        source: "/product-info/replicate-custom-profiles",
        destination: "/products/made-to-match",
        permanent: true,
      },
      {
        source: "/products/replicate-custom-profiles",
        destination: "/products/made-to-match",
        permanent: true,
      },
      {
        source: "/products/copy-your-unique-profile",
        destination: "/products/made-to-match",
        permanent: true,
      },
      {
        source: "/product-info/tight-radii-bullnose-corners",
        destination: "/products/bullnose-corners-tight-radii",
        permanent: true,
      },
      {
        source: "/products/tight-radii-bullnose-corners",
        destination: "/products/bullnose-corners-tight-radii",
        permanent: true,
      },
      {
        source: "/product-info/profile-search",
        destination: "/products/profile-search",
        permanent: true,
      },
      {
        source: "/product-info/select-profiles/:path*",
        destination: "/products/select-profiles/:path*",
        permanent: true,
      },
      {
        source: "/product-info/stock-items",
        destination: "/products/stock-items",
        permanent: true,
      },
      {
        source: "/product-info/stock-items/:path*",
        destination: "/products/stock-items/:path*",
        permanent: true,
      },
      {
        source: "/product-info/profile-checker",
        destination: "/products/profile-checker",
        permanent: true,
      },
      {
        source: "/product-info/machinable-s4s",
        destination: "/products/machinable-s4s",
        permanent: true,
      },
      {
        source: "/product-info/ultra-fire-flex",
        destination: "/products/ultra-fire-flex",
        permanent: true,
      },
      {
        source: "/product-info/xtrulinear",
        destination: "/products/xtrulinear",
        permanent: true,
      },

      // Installation (before Ordering catch-all)
      {
        source: "/ordering-installation/installation-guide",
        destination: "/installation",
        permanent: true,
      },

      // FAQ moved under Resources
      {
        source: "/ordering-installation/faq",
        destination: "/resources/faq",
        permanent: true,
      },

      // Legacy calculator aliases
      {
        source: "/ordering-installation/radius-calculator",
        destination: "/ordering/length-and-radius-calculator",
        permanent: true,
      },
      {
        source: "/ordering/radius-calculator",
        destination: "/ordering/length-and-radius-calculator",
        permanent: true,
      },
      {
        source: "/ordering/flex-trim-toolbox",
        destination: "/ordering/length-and-radius-calculator",
        permanent: true,
      },
      {
        source: "/ordering-installation/flex-trim-toolbox",
        destination: "/ordering/length-and-radius-calculator",
        permanent: true,
      },

      // Ordering catch-all for remaining pages
      {
        source: "/ordering-installation/:path*",
        destination: "/ordering/:path*",
        permanent: true,
      },

      // Resources pages (explicit — do not catch-all, or PDF assets get redirected)
      {
        source: "/forms-literature/catalog",
        destination: "/resources/catalog",
        permanent: true,
      },
      {
        source: "/forms-literature/brochure",
        destination: "/resources/brochure",
        permanent: true,
      },
      {
        source: "/forms-literature/forms",
        destination: "/resources/forms",
        permanent: true,
      },
      {
        source: "/forms-literature/technical-data",
        destination: "/resources/technical-data",
        permanent: true,
      },
      {
        source: "/forms-literature/literature",
        destination: "/resources/literature",
        permanent: true,
      },
      // Legacy slug PDF paths → original Resource filenames under /public/resources
      {
        source: "/forms-literature/carter-millwork-catalog.pdf",
        destination: "/resources/Carter%20Millwork%20Catalog.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/carter-millwork-brochure.pdf",
        destination: "/resources/Carter%20Millwork%20Brochure.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/bullnose-corner-radius-gauge.pdf",
        destination: "/resources/Bullnose%20Corner%20Radius%20Gauge.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/quote-order-form-arc-straight.pdf",
        destination:
          "/resources/Carter%20Millwork%20Quote%20%26%20Order%20Form%20-%20Arc%20%26%20Straight.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/quote-order-form-crown.pdf",
        destination: "/resources/Carter%20Millwork%20Quote%20%26%20Order%20Form%20-%20Crown.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/product-data-sheet.pdf",
        destination: "/resources/Carter%20Millwork%20Product%20Data%20Sheet.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/msds.pdf",
        destination: "/resources/Carter%20Millwork%20MSDS.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/leed-information.pdf",
        destination: "/resources/Carter%20Millwork%20LEED%20Information.pdf",
        permanent: true,
      },
      {
        source: "/forms-literature/prop-65.pdf",
        destination: "/resources/Carter%20Millwork%20Prop%2065.pdf",
        permanent: true,
      },
      // Also map prior /resources slug URLs to original names
      {
        source: "/resources/carter-millwork-catalog.pdf",
        destination: "/resources/Carter%20Millwork%20Catalog.pdf",
        permanent: true,
      },
      {
        source: "/resources/carter-millwork-brochure.pdf",
        destination: "/resources/Carter%20Millwork%20Brochure.pdf",
        permanent: true,
      },
      {
        source: "/resources/bullnose-corner-radius-gauge.pdf",
        destination: "/resources/Bullnose%20Corner%20Radius%20Gauge.pdf",
        permanent: true,
      },
      {
        source: "/resources/quote-order-form-arc-straight.pdf",
        destination:
          "/resources/Carter%20Millwork%20Quote%20%26%20Order%20Form%20-%20Arc%20%26%20Straight.pdf",
        permanent: true,
      },
      {
        source: "/resources/quote-order-form-crown.pdf",
        destination: "/resources/Carter%20Millwork%20Quote%20%26%20Order%20Form%20-%20Crown.pdf",
        permanent: true,
      },
      {
        source: "/resources/product-data-sheet.pdf",
        destination: "/resources/Carter%20Millwork%20Product%20Data%20Sheet.pdf",
        permanent: true,
      },
      {
        source: "/resources/msds.pdf",
        destination: "/resources/Carter%20Millwork%20MSDS.pdf",
        permanent: true,
      },
      {
        source: "/resources/leed-information.pdf",
        destination: "/resources/Carter%20Millwork%20LEED%20Information.pdf",
        permanent: true,
      },
      {
        source: "/resources/prop-65.pdf",
        destination: "/resources/Carter%20Millwork%20Prop%2065.pdf",
        permanent: true,
      },

      // Warranty moved under Resources (before About page redirects)
      {
        source: "/company-info/warranty",
        destination: "/resources/warranty",
        permanent: true,
      },

      // About pages only (images stay under /public/company-info)
      {
        source: "/company-info/about-us",
        destination: "/about/about-us",
        permanent: true,
      },
      {
        source: "/company-info/management-philosophy",
        destination: "/about/management-philosophy",
        permanent: true,
      },
      {
        source: "/company-info/locations",
        destination: "/about/locations",
        permanent: true,
      },
      {
        source: "/company-info/returns",
        destination: "/about/returns",
        permanent: true,
      },
      {
        source: "/company-info/flex-trim-advantages",
        destination: "/about/flex-trim-advantages",
        permanent: true,
      },

      // Order status under Ordering → Tools
      {
        source: "/order-status",
        destination: "/ordering/order-status",
        permanent: true,
      },
      {
        source: "/order-status/:path*",
        destination: "/ordering/order-status/:path*",
        permanent: true,
      },

      // Gallery consolidated to /gallery
      {
        source: "/gallery/applications",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/gallery/styles",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/gallery/indoor-outdoor",
        destination: "/gallery",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
