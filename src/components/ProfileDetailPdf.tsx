"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { ProfileRow } from "@/lib/profiles";

const PRIMARY = "#9f1b20";
const PAGE_WIDTH = 612; // US Letter points
const PAGE_HEIGHT = 792;
const MARGIN = 36;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2;
const GAP = 16;
/** Estimated height reserved for the info block when stacked below the drawing. */
const INFO_BELOW_HEIGHT = 100;

// Native SVG viewBox aspect ratios (width / height) — same as installation guide
const FLEX_TRIM_ASPECT = 561.74664 / 118.44;
const CARTER_ASPECT = 492.57333 / 100.61333;
const LOGO_GAP = 8;
const LOGO_DIVIDER_WIDTH = 1;
const LOGO_ROW_WIDTH = 220;
const LOGO_HEIGHT =
  (LOGO_ROW_WIDTH - LOGO_GAP * 2 - LOGO_DIVIDER_WIDTH) / (FLEX_TRIM_ASPECT + CARTER_ASPECT);
const LOGO_FLEX_TRIM_WIDTH = LOGO_HEIGHT * FLEX_TRIM_ASPECT;
const LOGO_CARTER_WIDTH = LOGO_HEIGHT * CARTER_ASPECT;
const LOGO_BLOCK_HEIGHT = LOGO_HEIGHT + 14; // logos + margin below

type ProfileLogos = {
  flexTrim: string;
  carterMillwork: string;
};

type ProfilePdfProps = {
  profile: ProfileRow;
  imageSrc: string;
  imageWidthPt: number;
  imageHeightPt: number;
  sideBySide: boolean;
  showLogos: boolean;
  logos: ProfileLogos;
  isNewDrawing: boolean;
};

const styles = StyleSheet.create({
  page: {
    padding: MARGIN,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#262626",
  },
  outer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  columnLayout: {
    flexDirection: "column",
    alignItems: "center",
    gap: GAP,
    width: "100%",
  },
  rowLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
    width: "100%",
  },
  image: {
    objectFit: "contain",
  },
  infoColumn: {
    alignItems: "center",
    minWidth: 140,
    maxWidth: 280,
  },
  info: {
    alignItems: "center",
    width: "100%",
  },
  logos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    gap: LOGO_GAP,
  },
  logoFlexTrim: {
    height: LOGO_HEIGHT,
    width: LOGO_FLEX_TRIM_WIDTH,
  },
  logoDivider: {
    width: LOGO_DIVIDER_WIDTH,
    height: LOGO_HEIGHT * 0.85,
    backgroundColor: "#d4d4d4",
  },
  logoCarter: {
    height: LOGO_HEIGHT,
    width: LOGO_CARTER_WIDTH,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: PRIMARY,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  label: {
    fontFamily: "Helvetica-Bold",
    color: "#525252",
    textAlign: "center",
  },
  value: {
    textAlign: "center",
  },
  scaleWarning: {
    marginTop: 12,
    fontSize: 9,
    color: PRIMARY,
    textAlign: "center",
    maxWidth: 260,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: MARGIN,
    right: MARGIN,
    fontSize: 8,
    color: "#a3a3a3",
    textAlign: "center",
  },
});

function LogoRow({ logos }: { logos: ProfileLogos }) {
  return (
    <View style={styles.logos}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
      <Image src={logos.flexTrim} style={styles.logoFlexTrim} />
      <View style={styles.logoDivider} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
      <Image src={logos.carterMillwork} style={styles.logoCarter} />
    </View>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function ProfilePdfDocument({
  profile,
  imageSrc,
  imageWidthPt,
  imageHeightPt,
  sideBySide,
  showLogos,
  logos,
  isNewDrawing,
}: ProfilePdfProps) {
  const facility = profile.region === "east" ? "North Carolina" : "Utah";

  const infoBody = (
    <View style={styles.info}>
      <Text style={styles.title}>{profile.profileId}</Text>
      <InfoLine label="Description" value={profile.description || "—"} />
      <InfoLine label="Moulding type" value={profile.mouldingType} />
      <InfoLine label="Production facility" value={facility} />
      {!isNewDrawing ? (
        <Text style={styles.scaleWarning}>
          Less than 1:1 scale. View &quot;Outline only&quot; PDF for 1:1 scale.
        </Text>
      ) : null}
    </View>
  );

  const profileImage = (
    // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image
    <Image
      src={imageSrc}
      style={{
        ...styles.image,
        width: imageWidthPt,
        height: imageHeightPt,
      }}
    />
  );

  return (
    <Document title={`Flex Trim ${profile.profileId}`} author="Carter Millwork">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.outer}>
          {sideBySide ? (
            <View style={styles.rowLayout}>
              {profileImage}
              <View style={styles.infoColumn}>
                {showLogos ? <LogoRow logos={logos} /> : null}
                {infoBody}
              </View>
            </View>
          ) : (
            <View style={styles.columnLayout}>
              {showLogos ? <LogoRow logos={logos} /> : null}
              {profileImage}
              {infoBody}
            </View>
          )}
        </View>
        <Text style={styles.footer} fixed>
          {isNewDrawing
            ? "Flex Trim™ / Carter Millwork — profile drawing at 1:1 scale"
            : "Flex Trim™ / Carter Millwork — drawing shown at less than 1:1 scale"}
        </Text>
      </Page>
    </Document>
  );
}

async function loadImageAsPng(url: string): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load profile image: ${url}`));
    image.src = url;
  });

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height) throw new Error("Profile image has no dimensions");

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas for profile PDF");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0);
  return { dataUrl: canvas.toDataURL("image/png"), width, height };
}

async function svgUrlToPngDataUrl(url: string, targetHeightPx: number): Promise<string> {
  const response = await fetch(url);
  const svgText = await response.text();
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load logo: ${url}`));
      image.src = objectUrl;
    });

    const aspect = img.naturalWidth / img.naturalHeight;
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(targetHeightPx * aspect * scale);
    canvas.height = Math.round(targetHeightPx * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context for logo");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Place the GIF at 1px = 1pt (1:1). If that leaves no room for info below,
 * put info to the right. Only shrink if the drawing cannot fit on the page.
 * Logos sit above the image when stacked (if they fit), or above the text when side-by-side.
 */
function layoutImage(naturalWidth: number, naturalHeight: number) {
  let widthPt = naturalWidth;
  let heightPt = naturalHeight;

  const sideBySide = heightPt + GAP + INFO_BELOW_HEIGHT > CONTENT_HEIGHT;

  if (sideBySide) {
    const infoCol = 180;
    const maxImgWidth = CONTENT_WIDTH - GAP - infoCol;
    const scale = Math.min(1, maxImgWidth / widthPt, CONTENT_HEIGHT / heightPt);
    widthPt *= scale;
    heightPt *= scale;
    // Side-by-side: logos always go above the text column
    return { widthPt, heightPt, sideBySide: true, showLogos: true };
  }

  const maxImgHeight = CONTENT_HEIGHT - GAP - INFO_BELOW_HEIGHT;
  const scale = Math.min(1, CONTENT_WIDTH / widthPt, maxImgHeight / heightPt);
  widthPt *= scale;
  heightPt *= scale;

  // Stacked: logos above the drawing only if everything still fits
  const showLogos =
    LOGO_BLOCK_HEIGHT + GAP + heightPt + GAP + INFO_BELOW_HEIGHT <= CONTENT_HEIGHT;

  return { widthPt, heightPt, sideBySide: false, showLogos };
}

export async function downloadProfilePdf(
  profile: ProfileRow,
  isNewDrawing = true,
  imageUrl?: string
) {
  const src = imageUrl ?? `/api/images/${encodeURIComponent(profile.profileId)}`;
  const [{ dataUrl, width, height }, flexTrim, carterMillwork] = await Promise.all([
    loadImageAsPng(src),
    svgUrlToPngDataUrl("/logos/flex-trim.svg", Math.ceil(LOGO_HEIGHT * 4)),
    svgUrlToPngDataUrl("/logos/carter-millwork.svg", Math.ceil(LOGO_HEIGHT * 4)),
  ]);
  const { widthPt, heightPt, sideBySide, showLogos } = layoutImage(width, height);

  const blob = await pdf(
    <ProfilePdfDocument
      profile={profile}
      imageSrc={dataUrl}
      imageWidthPt={widthPt}
      imageHeightPt={heightPt}
      sideBySide={sideBySide}
      showLogos={showLogos}
      logos={{ flexTrim, carterMillwork }}
      isNewDrawing={isNewDrawing}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  const partNumber = profile.profileId.replace(/[^\w.-]+/g, "_");
  anchor.download = `Flex Trim ${partNumber}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
