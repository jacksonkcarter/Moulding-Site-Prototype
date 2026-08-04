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
import {
  ADDITIONAL_STAINING_TIPS,
  FINISHING_STEPS,
  INSTALLING_STEPS,
  MACHINING_STEPS,
  PREPARING_STEPS,
  INSTALLATION_GUIDE_TITLE,
  type InstallationStep,
} from "@/data/installation-guide";
import { FACILITY_CONTACTS } from "@/data/facility-contacts";

const PRIMARY = "#9f1b20";

// Native SVG viewBox aspect ratios (width / height)
const FLEX_TRIM_ASPECT = 561.74664 / 118.44;
const CARTER_ASPECT = 492.57333 / 100.61333;
const COLUMN_LEFT_WIDTH = 194;
const LOGO_GAP = 8;
const LOGO_DIVIDER_WIDTH = 1;
const LOGO_HEIGHT =
  (COLUMN_LEFT_WIDTH - LOGO_GAP * 2 - LOGO_DIVIDER_WIDTH) /
  (FLEX_TRIM_ASPECT + CARTER_ASPECT);
const LOGO_FLEX_TRIM_WIDTH = LOGO_HEIGHT * FLEX_TRIM_ASPECT;
const LOGO_CARTER_WIDTH = LOGO_HEIGHT * CARTER_ASPECT;

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 32,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.3,
    color: "#262626",
    textAlign: "justify",
  },
  columns: {
    flexDirection: "row",
    gap: 34, // was 16; +0.25" (18pt) center margin
  },
  // Letter content width ≈ 548pt; equal columns ≈ 266pt each. Shift divider left 1" (72pt).
  columnLeft: {
    width: COLUMN_LEFT_WIDTH,
  },
  columnRight: {
    flex: 1,
  },
  logos: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 14,
    marginBottom: 4,
    color: "#171717",
    textAlign: "justify",
  },
  intro: {
    marginBottom: 10,
    fontSize: 9,
    color: "#404040",
    textAlign: "justify",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: PRIMARY,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY,
    textAlign: "justify",
  },
  step: {
    marginBottom: 5,
  },
  stepTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: "#171717",
    marginBottom: 1,
    textAlign: "justify",
  },
  stepBody: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#404040",
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    fontSize: 8,
    color: "#737373",
    textAlign: "justify",
  },
});

function StepBlock({ index, step }: { index: number; step: InstallationStep }) {
  return (
    <View style={styles.step} wrap={false}>
      <Text style={styles.stepTitle}>
        {index}. {step.title}
      </Text>
      <Text style={styles.stepBody}>{step.body}</Text>
    </View>
  );
}

function SectionBlock({
  title,
  steps,
  startIndex = 1,
}: {
  title: string;
  steps: InstallationStep[];
  startIndex?: number;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {steps.map((step, i) => (
        <StepBlock key={step.title} index={startIndex + i} step={step} />
      ))}
    </View>
  );
}

type LogoSources = {
  flexTrim: string;
  carterMillwork: string;
};

export function InstallationGuidePdfDocument({ logos }: { logos: LogoSources }) {
  const east = FACILITY_CONTACTS.east.phoneDisplay;
  const west = FACILITY_CONTACTS.west.phoneDisplay;

  return (
    <Document title={INSTALLATION_GUIDE_TITLE} author="Flex Trim™ / Carter Millwork">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.columns}>
          <View style={styles.columnLeft}>
            <View style={styles.logos}>
              <Image src={logos.flexTrim} style={styles.logoFlexTrim} />
              <View style={styles.logoDivider} />
              <Image src={logos.carterMillwork} style={styles.logoCarter} />
            </View>
            <Text style={styles.title}>{INSTALLATION_GUIDE_TITLE}</Text>
            <Text style={styles.intro}>
              For further assistance, please call a product specialist at {east} (East) or {west}{" "}
              (West).
            </Text>
            <SectionBlock title="Preparing" steps={PREPARING_STEPS} />
            <SectionBlock title="Machining" steps={MACHINING_STEPS} />
          </View>
          <View style={styles.columnRight}>
            <SectionBlock title="Installing" steps={INSTALLING_STEPS} />
            <SectionBlock title="Finishing" steps={FINISHING_STEPS} />
            <StepBlock index={FINISHING_STEPS.length + 1} step={ADDITIONAL_STAINING_TIPS} />
          </View>
        </View>

        <Text style={styles.footer} fixed>
          Flex Trim™ / Carter Millwork, Inc.
        </Text>
      </Page>
    </Document>
  );
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

export async function downloadInstallationGuidePdf() {
  const [flexTrim, carterMillwork] = await Promise.all([
    svgUrlToPngDataUrl("/logos/flex-trim.svg", Math.ceil(LOGO_HEIGHT * 4)),
    svgUrlToPngDataUrl("/logos/carter-millwork.svg", Math.ceil(LOGO_HEIGHT * 4)),
  ]);

  const blob = await pdf(
    <InstallationGuidePdfDocument logos={{ flexTrim, carterMillwork }} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "Flex-Trim-Installation-Guide.pdf";
  anchor.click();
  URL.revokeObjectURL(url);
}
