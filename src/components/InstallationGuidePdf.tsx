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
  getInstallationGuideCopy,
  type InstallationLocale,
  type InstallationStep,
} from "@/data/installation-guide";
import { FACILITY_CONTACTS } from "@/data/facility-contacts";

const PRIMARY = "#9f1b20";

// Native SVG viewBox aspect ratios (width / height)
const FLEX_TRIM_ASPECT = 561.74664 / 118.44;
const CARTER_ASPECT = 492.57333 / 100.61333;
const COLUMN_LEFT_WIDTH = 176; // was 171.5; shift divider right 1/16" (4.5pt)
const LOGO_GAP = 8;
const LOGO_DIVIDER_WIDTH = 1;
const LOGO_HEIGHT =
  (COLUMN_LEFT_WIDTH - LOGO_GAP * 2 - LOGO_DIVIDER_WIDTH) /
  (FLEX_TRIM_ASPECT + CARTER_ASPECT);
const LOGO_FLEX_TRIM_WIDTH = LOGO_HEIGHT * FLEX_TRIM_ASPECT;
const LOGO_CARTER_WIDTH = LOGO_HEIGHT * CARTER_ASPECT;

function createPdfStyles(fontDelta = 0) {
  return StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 32,
      paddingHorizontal: 32,
      fontFamily: "Helvetica",
      fontSize: 9.5 + fontDelta,
      lineHeight: 1.3,
      color: "#262626",
      textAlign: "justify",
    },
    columns: {
      flexDirection: "row",
      gap: 25, // was 29.5; −1/16" (4.5pt) center margin again
    },
    // Letter content width ≈ 548pt. Shift divider left vs equal columns (left was 194pt).
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
      fontSize: 12 + fontDelta,
      marginBottom: 4,
      color: "#171717",
      textAlign: "justify",
    },
    intro: {
      marginBottom: 3,
      fontSize: 9 + fontDelta,
      color: "#404040",
      textAlign: "justify",
    },
    section: {
      marginBottom: 3,
    },
    sectionTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 12 + fontDelta,
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
      fontSize: 9.5 + fontDelta,
      color: "#171717",
      marginBottom: 1,
      textAlign: "justify",
    },
    stepBody: {
      fontFamily: "Helvetica",
      fontSize: 9 + fontDelta,
      color: "#404040",
      textAlign: "justify",
    },
    footer: {
      position: "absolute",
      bottom: 16,
      left: 32,
      right: 32,
      fontSize: 8 + fontDelta,
      color: "#737373",
      textAlign: "justify",
    },
  });
}

type PdfStyles = ReturnType<typeof createPdfStyles>;

function StepBlock({
  index,
  step,
  styles,
}: {
  index: number;
  step: InstallationStep;
  styles: PdfStyles;
}) {
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
  styles,
  startIndex = 1,
}: {
  title: string;
  steps: InstallationStep[];
  styles: PdfStyles;
  startIndex?: number;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {steps.map((step, i) => (
        <StepBlock key={step.title} index={startIndex + i} step={step} styles={styles} />
      ))}
    </View>
  );
}

type LogoSources = {
  flexTrim: string;
  carterMillwork: string;
};

export function InstallationGuidePdfDocument({
  logos,
  locale = "en",
}: {
  logos: LogoSources;
  locale?: InstallationLocale;
}) {
  const copy = getInstallationGuideCopy(locale);
  const east = FACILITY_CONTACTS.east.phoneDisplay;
  const west = FACILITY_CONTACTS.west.phoneDisplay;
  const finishing = copy.sections.finishing;
  const styles = createPdfStyles(locale === "es" ? -1 : 0);

  return (
    <Document title={copy.title} author="Flex Trim™ / Carter Millwork" language={locale}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.columns}>
          <View style={styles.columnLeft}>
            <View style={styles.logos}>
              <Image src={logos.flexTrim} style={styles.logoFlexTrim} />
              <View style={styles.logoDivider} />
              <Image src={logos.carterMillwork} style={styles.logoCarter} />
            </View>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.intro}>
              {copy.pdfIntroBefore}
              {"\n"}
              {east} {copy.pdfIntroBetween} {west}
            </Text>
            <SectionBlock
              title={copy.sections.preparing.title}
              steps={copy.sections.preparing.steps}
              styles={styles}
            />
            <SectionBlock
              title={copy.sections.machining.title}
              steps={copy.sections.machining.steps}
              styles={styles}
            />
          </View>
          <View style={styles.columnRight}>
            <SectionBlock
              title={copy.sections.installing.title}
              steps={copy.sections.installing.steps}
              styles={styles}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{finishing.title}</Text>
              {finishing.steps.map((step, i) => (
                <StepBlock key={step.title} index={i + 1} step={step} styles={styles} />
              ))}
              <StepBlock
                index={finishing.steps.length + 1}
                step={finishing.additionalStainingTips}
                styles={styles}
              />
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          {copy.pdfFooter}
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

export async function downloadInstallationGuidePdf(locale: InstallationLocale = "en") {
  const copy = getInstallationGuideCopy(locale);
  const [flexTrim, carterMillwork] = await Promise.all([
    svgUrlToPngDataUrl("/logos/flex-trim.svg", Math.ceil(LOGO_HEIGHT * 4)),
    svgUrlToPngDataUrl("/logos/carter-millwork.svg", Math.ceil(LOGO_HEIGHT * 4)),
  ]);

  const blob = await pdf(
    <InstallationGuidePdfDocument logos={{ flexTrim, carterMillwork }} locale={locale} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = copy.pdfFilename;
  anchor.click();
  URL.revokeObjectURL(url);
}
