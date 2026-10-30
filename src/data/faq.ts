export type FaqLink = {
  label: string;
  href: string;
};

export type FaqStep = {
  title: string;
  body: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string[];
  stepsHeading?: string;
  steps?: FaqStep[];
  links?: FaqLink[];
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
  /** When false, category is omitted from the jump-chip nav (content still renders). */
  showInNav?: boolean;
  /** When true, category is never included in FAQ search results (still always listed on the page when not filtering). */
  excludeFromSearch?: boolean;
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "products",
    title: "Products & materials",
    items: [
      {
        id: "what-is-flex-trim",
        question: "What is Flex Trim™?",
        answer: [
          "Flex Trim™ is Carter Millwork’s original polymer resin blend. It is durable, consistent, and cost-effective, and the ideal choice for most applications. Carter Millwork flexible moulding is crafted from strong, long-lasting polyurethane that replicates complex profiles, decorative architectural accessories, and wood grain patterns.",
        ],
        links: [{ label: "Material details", href: "/products/material-details" }],
      },
      {
        id: "indoor-outdoor",
        question: "Can Flex Trim™ be used indoors and outdoors?",
        answer: [
          "Yes. Flexible moulding is highly durable and suited for both interior and exterior trim. It resists moisture and insects, and will not rot, swell, or deteriorate like wood.",
        ],
        links: [{ label: "Outdoor installations", href: "/gallery#outdoor-installations" }],
      },
      {
        id: "vs-wood",
        question: "Why choose flexible moulding instead of wood?",
        answer: [
          "It delivers authentic grain and architectural finish like curved wood, generally costs about 70% less than traditional machined wood millwork, and is significantly faster and more affordable to produce than comparable radius wood moulding.",
        ],
      },
      {
        id: "material-options",
        question: "What material options are available?",
        answer: [
          "Flex Trim™ is the standard choice for most jobs. Specialized upgrades include Zzz Flex® for tight radiuses, intricate patterns, and cold-weather climates, Ultra-Flex (lighter and pre-primed, Utah plant), Ultra-Fire Flex for commercial fire-rated applications (Utah), and Machinable S4S for short, straight-run stock milled with conventional woodworking equipment (Utah).",
        ],
        links: [{ label: "Compare materials", href: "/products/material-details" }],
      },
      {
        id: "stainable",
        question: "Do you offer stainable moulding?",
        answer: [
          "Yes. All Carter Millwork products are paint-grade, and many offer stainable finishes. Stain-grade flexible moulding, corbels, and appliques replicate real wood grain such as Knotty Alder, Mahogany, and Maple, so you can stain after installation. Use gel stain only, and never sand stain-grade material (that permanently removes the surface grain). We cannot create or change grain from a provided sample.",
        ],
        links: [{ label: "Stainable trim", href: "/products/stainable-product" }],
      },
      {
        id: "stock-vs-custom",
        question: "What’s the difference between stock and custom profiles?",
        answer: [
          "We carry 250+ stock items ready for immediate shipping. We also have 40,000+ profiles already tooled for custom applications, and our online catalog is only a fraction of what we can produce. If you need a profile that isn’t listed, send a tracing or use our Made-to-Match process.",
        ],
        links: [
          { label: "Quick-ship stock items", href: "/products/browse-stock-items" },
          { label: "Production-ready profiles", href: "/products/browse-select-profiles" },
        ],
      },
      {
        id: "warranty",
        question: "What warranty do your materials carry?",
        answer: [
          "Flex Trim™, Zzz Flex®, Ultra-Flex, Ultra-Fire Flex, and Machinable S4S carry a lifetime warranty. See the limited lifetime warranty for full terms, exclusions, and how to make a claim.",
        ],
        links: [
          { label: "Limited lifetime warranty", href: "/resources/warranty" },
          { label: "Material details", href: "/products/material-details" },
        ],
      },
    ],
  },
  {
    id: "ordering",
    title: "Ordering & lead times",
    items: [
      {
        id: "how-to-order",
        question: "How do I order Flex Trim™?",
        answer: [
          "You can browse stock items for ready-to-ship products, search our tooled profiles for custom applications, request a quote online, download arc/straight and crown order forms, find a dealer near you, or contact Flex Trim East or West directly.",
        ],
        links: [
          { label: "Get started", href: "/ordering/how-to-order" },
          { label: "Quote request", href: "/quote-request" },
          { label: "Find a dealer", href: "/ordering/dealer-search" },
          { label: "Order forms", href: "/resources/forms" },
        ],
      },
      {
        id: "lead-times",
        question: "What are typical lead times?",
        answer: [
          "In-stock products usually ship within 24 hours of receiving your order. Most custom orders that use an existing mold ship within 2 weeks or less. Most new-mold orders ship within 3 weeks or less.",
        ],
        links: [{ label: "Copy your unique profile in Flex Trim™", href: "/products/made-to-match" }],
      },
      {
        id: "made-to-match",
        question: "Can you match an existing or historic profile?",
        answer: [
          "Yes. Send a tracing and include the original manufacturer or supplier plus the profile’s thickness and width. If we don’t already have the style, our Made-to-Match process uses two 7′ pieces of your existing moulding to reproduce both shape and wood grain, from simple profiles to intricate designs.",
        ],
        links: [
          { label: "Made-to-Match", href: "/products/made-to-match" },
          { label: "Start a quote", href: "/quote-request" },
        ],
      },
      {
        id: "find-dealer",
        question: "How do I find a dealer?",
        answer: [
          "Contact us and we’ll help you find your nearest Flex Trim™ dealer or distributor. You can also shop through our listed online retailers.",
        ],
        links: [{ label: "Find a dealer", href: "/ordering/dealer-search" }],
      },
      {
        id: "radius-length",
        question: "How do I figure out moulding length for a radius?",
        answer: [
          "Use the Length and radius calculator: choose a shape (half-round, eyebrow arc, elliptical, oval, full circle, or radius-only crown), then enter dimensions or a measured length. It computes the geometric length and the required moulding length, rounding up to the next foot plus manufacturing allowance.",
        ],
        links: [{ label: "Length and radius calculator", href: "/ordering/length-and-radius-calculator" }],
      },
      {
        id: "pre-bent",
        question: "Can casing be pre-bent to my radius?",
        answer: [
          "Yes. Flexible casing can be pre-bent to your exact radius for arched doorways and round windows.",
        ],
        links: [{ label: "Gallery", href: "/gallery" }],
      },
    ],
  },
  {
    id: "installation",
    title: "Installation & finishing",
    items: [
      {
        id: "prepare",
        question: "How should I prepare flexible moulding before installing?",
        answer: [
          "Unroll it so it returns to its original shape and verify the profile and application. Warm it to about 80°F for maximum flexibility, and never use an open flame. Wipe with mineral spirits or soap and water, and make sure the mounting surface is completely flat. Always paint or stain after installation. A pre-applied finish will crack when the moulding flexes.",
        ],
        links: [{ label: "Installation guide", href: "/installation" }],
      },
      {
        id: "cut-machine",
        question: "Can I cut and machine it like wood?",
        answer: [
          "Yes. Treat it nearly the same as wood. Cut, sand, and shape with typical shop equipment. Hold firmly when cutting, take shallow passes when shaping, and use slower blade speeds. Never sand or shape stain-grade moulding.",
        ],
        links: [
          { label: "Machining tips", href: "/installation#machining" },
        ],
      },
      {
        id: "adhesive-fasteners",
        question: "What adhesive and fasteners should I use?",
        answer: [
          "Use adhesive compatible with polyurethane and non-porous materials, such as PL Premium Max. Standard wood glue will not bond. Pin nails are best. Trim screws, finish nails, and brad nails are also acceptable depending on size. Never use staples. Lower nail-gun pressure, set nails by hand when needed, and let adhesive do most of the holding work.",
        ],
        links: [
          { label: "Installing tips", href: "/installation#installing" },
        ],
      },
      {
        id: "paint-finish",
        question: "How do I paint or finish Flex Trim™?",
        answer: [
          "Install and clean before finishing. Use Bondo for nail holes and standard caulk for seams. Primer is recommended but not required for paint. Any interior or exterior paint works except pre-catalyzed epoxy.",
        ],
        links: [
          { label: "Finishing tips", href: "/installation#finishing" },
        ],
      },
      {
        id: "stain-how",
        question: "How do I stain Flex Trim™?",
        answer: [
          "Use gel stain only. The grain is surface-level. Never sand stain-grade material. Apply clearcoat after staining. Gel stain on resin dries slower than on wood and must be fully dry before recoating. For darker color, work pigment into embossed grain recesses and apply thin second coats as needed.",
        ],
        links: [
          { label: "Stainable trim", href: "/products/stainable-product" },
          { label: "Finishing tips", href: "/installation#finishing" },
        ],
      },
      {
        id: "videos",
        question: "Are there installation videos?",
        answer: [
          "Yes. The installation guide includes videos for Flex Trim™ crown installation and oval casing installation.",
        ],
        links: [{ label: "Installation guide", href: "/installation" }],
      },
    ],
  },
  {
    id: "company",
    title: "Locations, contact & returns",
    items: [
      {
        id: "facilities",
        question: "Where are your facilities located?",
        answer: [
          "Flex Trim East is in Lexington, NC (117 Cedar Lane Drive, Lexington, NC 27292). Flex Trim West is in Provo, UT (533 South 500 West, Provo, UT 84601). Operating on both coasts helps us serve customers nationwide with shorter lead times and local support.",
        ],
        links: [{ label: "Locations", href: "/about/locations" }],
      },
      {
        id: "which-facility",
        question: "Which facility serves my area?",
        answer: [
          "Service coverage varies by state. Some areas are served by the NC facility, some by UT, and some by both. Our locations page map shows coverage by state, and contact pages highlight the facility that typically serves your area.",
        ],
        links: [
          { label: "Locations map", href: "/about/locations" },
          { label: "Contact us", href: "/contact-us" },
        ],
      },
      {
        id: "returns",
        question: "What is your return policy?",
        answer: [
          "Contact us before shipping anything back. An RMA is required for all returns. Stock items may be returned when unused and resellable, and the customer pays return freight plus a 25% restocking fee. Custom items are generally not returnable. Exceptions for commonly sold items are evaluated case by case, and if approved the customer pays return freight plus a 30–50% restocking fee.",
        ],
        links: [{ label: "Returns", href: "/about/returns" }],
      },
      {
        id: "technical-docs",
        question: "Where can I find catalogs and technical documents?",
        answer: [
          "Download our catalog and brochure from Resources, or get product data sheets, MSDS, LEED information, and Prop 65 documents from Technical data.",
        ],
        links: [
          { label: "Catalog", href: "/resources/catalog" },
          { label: "Technical data", href: "/resources/technical-data" },
        ],
      },
    ],
  },
  {
    id: "radius-curved-trim",
    title: "Radius & curved trim overview",
    showInNav: false,
    excludeFromSearch: true,
    items: [
      {
        id: "create-curved-moulding",
        question: "How to create curved moulding for archways and radius walls",
        answer: [
          "Creating curved moulding can be done using traditional wood-bending techniques, such as steam bending and kerf cutting, or by utilizing flexible polymer alternatives. Because traditional wood bending is labor-intensive and prone to splitting, the most efficient method for modern construction is installing a flexible polyurethane composite trim that bends to the exact radius of the wall.",
        ],
        stepsHeading: "How to install curved trim:",
        steps: [
          {
            title: "Measure the radius",
            body: "Determine the exact curve of your archway, half-circle window, or curved wall.",
          },
          {
            title: "Select a flexible alternative",
            body: "Instead of bending rigid wood, use a flexible polyurethane moulding, such as Flex Trim™ by Carter Millwork, which can be manufactured to match any standard or custom wood profile.",
          },
          {
            title: "Acclimate the material",
            body: "Let the flexible trim sit at room temperature to ensure maximum pliability before installation.",
          },
          {
            title: "Install like standard wood",
            body: "Cut, nail, and glue the flexible moulding using standard woodworking tools and construction adhesive. Keep nails 6 inches apart and closer to the edges.",
          },
          {
            title: "Paint or stain",
            body: "Once installed, finish the moulding to match the surrounding straight wood trim.",
          },
        ],
        links: [
          { label: "Length and radius calculator", href: "/ordering/length-and-radius-calculator" },
          { label: "Installation guide", href: "/installation" },
        ],
      },
      {
        id: "flexible-vs-wood-radius",
        question: "Flexible moulding vs. wood for arched doorways and radius trim",
        answer: [
          "Wood moulding can be shaped for curves with steam bending or kerf cutting, but those methods are time-consuming, require specialized skill, and often risk splitting or spring-back. Flexible moulding is a polyurethane composite trim manufactured to match wood profiles and bend to the radius of an archway, half-circle window, or curved wall, so installers can cut, fasten, and finish it much like straight wood trim without bending the lumber itself.",
          "Flex Trim™ by Carter Millwork is a flexible polyurethane moulding designed for radius and curved applications indoors and outdoors. It can match stock or custom wood profiles, ships from facilities in North Carolina and Utah, and is typically finished with paint or gel stain after installation so it blends with surrounding straight millwork.",
        ],
        stepsHeading: "When flexible moulding is the better choice:",
        steps: [
          {
            title: "Tight or complex radiuses",
            body: "Choose a flexible polyurethane trim when the curve is too tight or intricate for practical steam bending, or when kerf cutting would weaken the profile.",
          },
          {
            title: "Matching existing wood profiles",
            body: "Use a flexible alternative that can be manufactured to match the thickness, width, and profile of your straight wood casing, base, or crown so curved and straight sections read as one system.",
          },
          {
            title: "Faster installation",
            body: "Install flexible moulding with standard woodworking tools and construction adhesive instead of building jigs or waiting on custom bent wood.",
          },
          {
            title: "Interior and exterior durability",
            body: "Flexible polyurethane trim resists moisture and insects and will not rot or swell like wood, making it suitable for many indoor and outdoor radius applications.",
          },
        ],
        links: [
          { label: "Material details", href: "/products/material-details" },
          { label: "Browse gallery", href: "/gallery" },
          { label: "Request a quote", href: "/quote-request" },
        ],
      },
    ],
  },
];
