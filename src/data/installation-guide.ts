export type InstallationStep = {
  title: string;
  body: string;
};

export const INSTALLATION_GUIDE_TITLE = "Flex Trim™ Installation Guide";

export const PREPARING_STEPS: InstallationStep[] = [
  {
    title: "Allow the material to relax",
    body: "Unroll the molding so it can return to its original shape. This is a great time to verify your profile and application.",
  },
  {
    title: "Optimize flexibility",
    body: "Warm the material to 80°F for maximum flexibility. To prevent damage, never use an open flame to heat the moulding.",
  },
  {
    title: "Clean the moulding",
    body: "Wipe down the material with mineral spirits or soap and water to remove any dust prior to installation.",
  },
  {
    title: "Prepare a smooth surface",
    body: "Ensure your mounting area is completely flat. Because the molding is flexible, it will mirror any underlying bumps or dips.",
  },
  {
    title: "Wait to apply finishes",
    body: "Always paint or stain after installation. Flexing the molding while installing will crack and fracture a pre-applied finish.",
  },
];

export const MACHINING_STEPS: InstallationStep[] = [
  {
    title: "Use standard woodworking tools",
    body: "Treat flexible moulding nearly the same as wood. It can be easily cut, sanded, and shaped using your typical shop equipment.",
  },
  {
    title: "Secure the material",
    body: "Hold the moulding firmly against your table or fence when cutting to maintain control and ensure a clean, accurate line.",
  },
  {
    title: "Make shallow passes with shaping tools",
    body: "If shaping the profile with a router, take several shallow passes rather than attempting one deep cut to achieve the smoothest result.",
  },
  {
    title: "Lower your blade speeds when able",
    body: "Operate saws and routers at slower blade speeds, best for cutting materials cleanly without excessive heat buildup.",
  },
  {
    title: "Protect stain-grade finishes",
    body: "Never sand or shape stain-grade moulding as this will permanently remove the surface-level wood grain pattern.",
  },
];

export const INSTALLING_STEPS: InstallationStep[] = [
  {
    title: "Plan your layout",
    body: "Pre-determine the exact material placement and layout before applying any adhesive or fasteners.",
  },
  {
    title: "Install triangular blocking for floating crown",
    body: "When crown is mounted only to the wall, with no ceiling support, install wooden triangular blocking behind the moulding every 4-8 inches for continuous backing and a secure install.",
  },
  {
    title: "Select and apply the proper adhesive",
    body: "Use an adhesive compatible with polyurethane and non-porous materials, such as PL Premium Max. Never standard wood glue. Apply adhesive to the moulding ends so joints stay tight through seasonal movement, and to the back face where the moulding meets the wall or substrate.",
  },
  {
    title: "Fasten the material",
    body: "Although pin nails are the best as they recess cleanly into the piece, trim screws, finish nails, and brad nails are all acceptable fasteners depending on the moulding size. To reduce the chance of dimpling, lower the pressure on mechanical nail guns, set nails by hand, and pre-drill and pre-countersink trim screw holes. Never use staples as they will create linear dimples.",
  },
  {
    title: "Minimize nailing",
    body: "Position fasteners away from the edges to prevent the material from bumping or tearing, and let the adhesive do the work.",
  },
  {
    title: "Avoid excessive force",
    body: "Never stress the moulding into place. Material that is ordered to the correct specifications should install easily and naturally.",
  },
];

export const FINISHING_STEPS: InstallationStep[] = [
  {
    title: "Fill and caulk freely",
    body: "We recommend bondo-like fillers that are compatible with nonporous resin-based products for nail holes and your favorite caulk for seams. Standard products work perfectly with Flex Trim™.",
  },
  {
    title: "Clean and install first",
    body: "Always install the moulding and thoroughly clean the surface before applying any paint or stain to ensure a flawless finish.",
  },
  {
    title: "Painting Flex Trim™",
    body: "A primer coat is recommended, but not required. Any interior/exterior paint (other than pre-catalyzed epoxy) works great.",
  },
  {
    title: "Staining Flex Trim™ (gel only)",
    body: "Since the grain is only on the surface, our product requires a gel stain. Remember to never sand stain-grade material, as it will permanently remove the surface wood grain. Apply clearcoat after staining.",
  },
];

export const ADDITIONAL_STAINING_TIPS = {
  title: "Additional staining tips",
  body: "To achieve a darker color, apply the stain generously and work the pigment down into the recesses of the embossed grain. Wipe the excess stain with a soft cloth. Use a dry, soft brush to feather or remove any cloth marks for a blemish free finish, then let it cure completely. Gel stain on resin takes longer to dry than on wood and it must be completely dry to the touch, without any tackiness, before you move on. If the first coat isn't dark enough, apply a second, very thin coat of gel stain using the same process as the first coat. Because the first coat sealed the surface, this second layer will glide over the top, deepening the color without disturbing the layer underneath. Repeat if needed. You can also play with 2 different pigments: darker then lighter vs lighter then darker.",
};

export const INSTALLATION_GUIDE_SECTIONS = [
  { id: "preparing", title: "Preparing", steps: PREPARING_STEPS },
  { id: "machining", title: "Machining", steps: MACHINING_STEPS },
  { id: "installing", title: "Installing", steps: INSTALLING_STEPS },
  { id: "finishing", title: "Finishing", steps: FINISHING_STEPS },
] as const;
