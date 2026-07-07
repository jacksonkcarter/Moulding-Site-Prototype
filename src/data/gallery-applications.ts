/**
 * Gallery Applications data. Add or edit categories, descriptions, and image arrays here.
 * Image paths are relative to the public folder (e.g. /gallery/applications/casing/...).
 */
export type ApplicationCategory = {
  id: string;
  title: string;
  description: string;
  /** Background image for the collapsed strip (first image used if not set). */
  stripImage?: string;
  /** Images for the expanded carousel. */
  images: string[];
};

const CASING_IMAGES = [
  "/gallery/applications/casing/1440-x-1200_RIGHT_ArchedWindowTreatment_Shutter.jpg",
  "/gallery/applications/casing/Colonial.png",
  "/gallery/applications/casing/Craftsman.png",
  "/gallery/applications/casing/Gemini_Generated_Image_3tibkw3tibkw3tib.png",
  "/gallery/applications/casing/Gemini_Generated_Image_3w38da3w38da3w38.png",
  "/gallery/applications/casing/Gemini_Generated_Image_92x3d792x3d792x3.png",
  "/gallery/applications/casing/Gemini_Generated_Image_dmmdkadmmdkadmmd.png",
  "/gallery/applications/casing/Gemini_Generated_Image_nshbi3nshbi3nshb.png",
  "/gallery/applications/casing/Modern-Farmhouse.png",
];

export const GALLERY_APPLICATIONS: ApplicationCategory[] = [
  {
    id: "arched-radius-casing",
    title: "Arched & radius casing",
    description:
      "Frame your most striking architectural features with precision. From elegant arched doorways to perfectly round windows, our radius casing bends seamlessly to create a flawless, gap-free border that traditional wood simply cannot match.",
    stripImage: CASING_IMAGES[0],
    images: CASING_IMAGES,
  },
  {
    id: "curved-walls",
    title: "Curved walls",
    description:
      "Transform sweeping architectural lines into finished masterpieces. Whether you are wrapping a grand staircase or trimming a radius hallway, our flexible baseboards, chair rails, and crown mouldings contour effortlessly to your wall's natural shape for a smooth, continuous flow.",
    stripImage: CASING_IMAGES[1],
    images: CASING_IMAGES,
  },
  {
    id: "vaulted-domed-ceilings",
    title: "Vaulted & domed ceilings",
    description:
      "Draw the eye upward with dramatic, flowing transitions. Perfect for domed entryways, barrel vaults, and arched ceiling details, our highly pliable materials make overhead installations simple, safe, and visually stunning.",
    stripImage: CASING_IMAGES[2],
    images: CASING_IMAGES,
  },
  {
    id: "decorative-applied-mouldings",
    title: "Decorative applied mouldings",
    description:
      "Add depth and sophisticated character to any space. Our flexible panel mouldings allow you to design intricate wainscoting, sweeping picture frames, and custom geometric wall features without the limitations of rigid millwork.",
    stripImage: CASING_IMAGES[3],
    images: CASING_IMAGES,
  },
  {
    id: "historical-reproductions",
    title: "Historical reproductions",
    description:
      "Preserve the integrity of the past with the technology of today. We specialize in custom-tooling and replicating ornate, century-old profiles, allowing you to seamlessly restore historic properties or match existing millwork with durable, modern precision.",
    stripImage: CASING_IMAGES[4],
    images: CASING_IMAGES,
  },
];
