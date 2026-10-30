"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

const RADIUS_GAUGE_HREF = "/resources/radius-gauges";
const BULLNOSE_RADIUS_GAUGE_PDF = `/resources/${encodeURIComponent("Bullnose Corner Radius Gauge.pdf")}`;
const STANDARD_RADIUS_GAUGE_PDF = `/resources/${encodeURIComponent("Radius Gauge.pdf")}`;
const IRREGULAR_RADIUS_HREF = "/ordering/ordering-tips#irregular-radius";
const TEMPLATE_NOTE_CAPTIONS = new Set(["Elliptical", "Oval"]);

type MeasureFigure = {
  src: string;
  alt: string;
  caption: string;
};

const QUARTER_ROUND_ORDERING_OPTIONS: MeasureFigure[] = [
  {
    src: "/how-to-measure/quarter-rounds.png",
    alt: "Quarter rounds layout diagram",
    caption: "Quarter rounds",
  },
  {
    src: "/how-to-measure/quarter-rounds-with-small-straight-legs.png",
    alt: "Quarter rounds with small straight legs",
    caption: "Quarter rounds with small straight legs",
  },
  {
    src: "/how-to-measure/quarter-round-full-arch-top.png",
    alt: "Quarter round full arch top measurement diagram",
    caption: "Quarter round full arch top",
  },
  {
    src: "/how-to-measure/quarter-rounds-with-full-legs-left-and-right.png",
    alt: "Quarter rounds with full legs left and right",
    caption: "Quarter rounds with full legs left & right",
  },
];

type MeasureSection = {
  id: string;
  title: string;
  intro?: string;
  figures: MeasureFigure[];
};

const SECTIONS: MeasureSection[] = [
  {
    id: "arches",
    title: "Radius casing",
    figures: [
      {
        src: "/how-to-measure/half-round.png",
        alt: "Half-round opening with diameter and optional straight leg length",
        caption: "Half-round",
      },
      {
        src: "/how-to-measure/eyebrow-arc.png",
        alt: "Eyebrow arc with width and rise measurements",
        caption: "Eyebrow arc",
      },
      {
        src: "/how-to-measure/quarter-round.png",
        alt: "Quarter round measurement diagram",
        caption: "Quarter round",
      },
      {
        src: "/how-to-measure/elliptical.png",
        alt: "Elliptical opening measurement diagram",
        caption: "Elliptical",
      },
      {
        src: "/how-to-measure/circle-or-full-round.png",
        alt: "Circle or full round measurement diagram",
        caption: "Circle or full round",
      },
      {
        src: "/how-to-measure/oval.png",
        alt: "Oval opening measurement diagram",
        caption: "Oval",
      },
    ],
  },
  {
    id: "crown",
    title: "Radius crown",
    figures: [
      {
        src: "/how-to-measure/isr-crown.png",
        alt: "ISR crown measuring width, rise, and radiused piece length",
        caption: "ISR crown",
      },
      {
        src: "/how-to-measure/osr-crown.png",
        alt: "OSR crown measuring width, rise, and radiused piece length",
        caption: "OSR crown",
      },
      {
        src: "/how-to-measure/isr-crown-corner.png",
        alt: "ISR crown corner measurement diagram",
        caption: "ISR crown corner",
      },
      {
        src: "/how-to-measure/osr-crown-corner.png",
        alt: "OSR crown corner measurement diagram",
        caption: "OSR crown corner",
      },
    ],
  },
  {
    id: "corners",
    title: "Bullnose corners",
    figures: [
      {
        src: "/how-to-measure/bullnose-corner.png",
        alt: "Bullnose corner radius measured with a straight edge",
        caption: "Measure using a straight edge",
      },
    ],
  },
  {
    id: "minimum-radius",
    title: "Minimum radius",
    intro:
      'Irregular radius applications often have tight radii on the shoulders (ellipticals) and the peaks (ovals). When paired with a larger casing, we may have to use a specialized tooling process. To help us determine if that process is needed, we need the minimum radius of the shape. The easiest way to identify the radius is by folding a piece of paper in half (5.5" width), then measuring the rise from the center of the paper to the curve.',
    figures: [
      {
        src: "/how-to-measure/elliptical-minimum-radius.png",
        alt: "Elliptical minimum radius measurement",
        caption: "Elliptical minimum radius",
      },
      {
        src: "/how-to-measure/oval-minimum-radius.png",
        alt: "Oval minimum radius measurement",
        caption: "Oval minimum radius",
      },
    ],
  },
];

const TEMPLATE_NOTE_LINE_1 = "These dimensions are required to quote,";
const TEMPLATE_NOTE_LINE_2 = "but a template is required to order. Learn more.";
const CIRCLE_NOTE = "Circles will be provided as two half-rounds.";
const OVAL_HALVES_NOTE = "Ovals will be provided as top and bottom halves.";

type FooterSpacer = "template" | "template-with-oval";

function MeasureFigureCard({
  figure,
  orderingOptions,
  footerSpacer,
}: {
  figure: MeasureFigure;
  orderingOptions?: MeasureFigure[];
  /** Invisible copy of a row partner's footer so images stay aligned. */
  footerSpacer?: FooterSpacer;
}) {
  const [open, setOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const titleId = useId();
  const optionsTitleId = useId();
  const dialogOpen = open || optionsOpen;
  const showTemplateNote = TEMPLATE_NOTE_CAPTIONS.has(figure.caption);
  const showCircleNote = figure.caption === "Circle or full round";
  const showOvalHalvesNote = figure.caption === "Oval";
  const showOrderingOptions = Boolean(orderingOptions && orderingOptions.length > 0);
  const showVisibleFooter = showTemplateNote || showOrderingOptions || showCircleNote;
  const showFooter = showVisibleFooter || Boolean(footerSpacer);

  useEffect(() => {
    if (!dialogOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOptionsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [dialogOpen]);

  return (
    <div className="h-full min-w-0">
      <figure className="flex h-full w-full flex-col">
        <figcaption className="mb-3 flex min-h-14 shrink-0 items-center justify-center text-center text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
          {figure.caption}
        </figcaption>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-auto inline-flex max-h-[42vh] max-w-full cursor-pointer rounded-md p-0 transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`View larger: ${figure.caption}`}
          >
            <Image
              src={figure.src}
              alt={figure.alt}
              width={1400}
              height={1050}
              className="mx-auto h-auto max-h-[42vh] w-auto max-w-full rounded-md object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </button>
        </div>
        {showFooter ? (
          <div
            className={
              showVisibleFooter
                ? "relative mt-3 w-full"
                : "relative mt-3 hidden w-full sm:block"
            }
          >
            {footerSpacer && !showTemplateNote ? (
              <p
                className="mx-auto max-w-md text-center text-sm leading-relaxed text-transparent md:text-base"
                aria-hidden="true"
              >
                {TEMPLATE_NOTE_LINE_1}
                <br />
                {TEMPLATE_NOTE_LINE_2}
                {footerSpacer === "template-with-oval" ? (
                  <>
                    <br />
                    {OVAL_HALVES_NOTE}
                  </>
                ) : null}
              </p>
            ) : null}
            <div
              className={
                footerSpacer && !showTemplateNote
                  ? "absolute inset-x-0 top-0 flex flex-col items-center"
                  : "flex flex-col items-center"
              }
            >
              {showOrderingOptions ? (
                <button
                  type="button"
                  onClick={() => setOptionsOpen(true)}
                  className="text-center text-sm font-medium text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:text-base"
                >
                  See options for flex configuration
                </button>
              ) : null}
              {showCircleNote ? (
                <p className="max-w-md text-center text-sm leading-relaxed text-neutral-600 md:text-base">
                  {CIRCLE_NOTE}
                </p>
              ) : null}
              {showTemplateNote ? (
                <p className="max-w-md text-center text-sm leading-relaxed text-neutral-600 md:text-base">
                  {TEMPLATE_NOTE_LINE_1}
                  <br />
                  but a{" "}
                  <Link
                    href={IRREGULAR_RADIUS_HREF}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    template
                  </Link>{" "}
                  is required to order.{" "}
                  <Link
                    href={IRREGULAR_RADIUS_HREF}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Learn more
                  </Link>
                  .
                  {showOvalHalvesNote ? (
                    <>
                      <br />
                      {OVAL_HALVES_NOTE}
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </figure>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[90vh] w-auto max-w-[min(72rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg bg-white p-4 pt-12 shadow-lg sm:p-6 sm:pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <Image
              src={figure.src}
              alt={figure.alt}
              width={1600}
              height={1200}
              className="mx-auto h-auto max-h-[75vh] w-auto max-w-full object-contain"
              sizes="90vw"
            />
            <p id={titleId} className="mt-4 text-center text-sm font-medium text-neutral-800 sm:text-base">
              {figure.caption}
            </p>
          </div>
        </div>
      ) : null}

      {optionsOpen && orderingOptions ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="presentation"
          onClick={() => setOptionsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={optionsTitleId}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white p-4 pt-12 shadow-lg sm:p-5 sm:pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOptionsOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <h3
              id={optionsTitleId}
              className="mb-4 shrink-0 text-center text-lg font-semibold tracking-tight text-neutral-900 md:text-xl"
            >
              Options for flex configuration
            </h3>
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-5">
              {orderingOptions.map((option) => (
                <figure key={option.src} className="flex min-h-0 flex-col items-center">
                  <figcaption className="mb-1.5 shrink-0 text-center text-sm font-semibold tracking-tight text-neutral-900 sm:text-base">
                    {option.caption}
                  </figcaption>
                  <div className="flex min-h-0 flex-1 items-center justify-center">
                    <Image
                      src={option.src}
                      alt={option.alt}
                      width={900}
                      height={700}
                      className="h-auto max-h-[28vh] w-auto max-w-full rounded-md object-contain"
                      sizes="40vw"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RadiusGaugePromo({
  pdfSrc = BULLNOSE_RADIUS_GAUGE_PDF,
  title = "Bullnose corner radius gauge",
  ariaLabel = "Open bullnose corner radius gauge",
}: {
  pdfSrc?: string;
  title?: string;
  ariaLabel?: string;
} = {}) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <p className="mb-3 flex min-h-14 shrink-0 flex-wrap items-center justify-center gap-x-1 text-center text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
        <span>Or try our</span>
        <Link
          href={RADIUS_GAUGE_HREF}
          className="text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          printable radius gauge
        </Link>
      </p>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Link
          href={RADIUS_GAUGE_HREF}
          className="relative mx-auto block w-full max-w-md overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={ariaLabel}
        >
          <span className="pointer-events-none relative mx-auto block aspect-[11/8.5] h-auto max-h-[42vh] w-full overflow-hidden rounded-md border border-neutral-300 bg-white">
            <iframe
              src={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
              title={title}
              className="absolute inset-0 h-full w-full border-0 bg-white"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

const RADIUS_GAUGE_FILTER_ID = "radius-gauge";

/** Figure-filter grid size under each section header: columns × 2 rows. */
const SECTION_FIGURE_COLUMNS: Record<string, number> = {
  arches: 3,
  crown: 2,
  corners: 1,
  "minimum-radius": 1,
};

type FigureFilter = {
  id: string;
  label: string;
  kind: "figure" | "gauge";
};

function figureFiltersForSection(section: MeasureSection): FigureFilter[] {
  const filters: FigureFilter[] = section.figures.map((figure) => ({
    id: figure.src,
    label: figure.caption,
    kind: "figure",
  }));
  if (section.id === "corners") {
    filters.push({
      id: RADIUS_GAUGE_FILTER_ID,
      label: "Printable radius gauge",
      kind: "gauge",
    });
  }
  return filters;
}

const filterTabClass = (selected: boolean) =>
  `min-w-0 px-1.5 py-1.5 text-center text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-2.5 sm:text-sm ${
    selected ? "bg-primary text-white" : "bg-white text-primary hover:bg-primary/5"
  }`;

function MeasureFilterBar({
  activeSection,
  activeFigure,
  onSelectSection,
  onSelectFigure,
}: {
  activeSection: string | null;
  activeFigure: string | null;
  onSelectSection: (id: string) => void;
  onSelectFigure: (id: string) => void;
}) {
  return (
    <div className="flex justify-center overflow-x-auto py-0.5">
      <div
        className="inline-flex gap-3"
        role="navigation"
        aria-label="How to measure filters"
      >
        {SECTIONS.map((section) => {
          const figureFilters = figureFiltersForSection(section);
          const columns = SECTION_FIGURE_COLUMNS[section.id] ?? Math.ceil(figureFilters.length / 2);
          const sectionSelected = activeSection === section.id;

          return (
            <div key={section.id} className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                role="tab"
                aria-selected={sectionSelected}
                onClick={() => onSelectSection(section.id)}
                className={`${filterTabClass(sectionSelected)} w-full rounded-md sm:whitespace-nowrap`}
              >
                {section.title}
              </button>
              {/*
                One outer border + a single border-l / border-t per internal edge
                (never both sides of a shared edge, which stacks to 4px).
              */}
              <div
                role="tablist"
                aria-label={`${section.title} diagrams`}
                className="overflow-hidden rounded-md border-2 border-primary"
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {figureFilters.map((filter, index) => {
                    const selected = activeFigure === filter.id;
                    const col = index % columns;
                    const row = Math.floor(index / columns);
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onSelectFigure(filter.id)}
                        className={`${filterTabClass(selected)} ${
                          col > 0 ? "border-l-2 border-primary" : ""
                        } ${row > 0 ? "border-t-2 border-primary" : ""}`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HowToMeasure() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeFigure, setActiveFigure] = useState<string | null>(null);

  const visibleSections = activeSection
    ? SECTIONS.filter((section) => section.id === activeSection)
    : SECTIONS;

  const selectSection = (id: string) => {
    if (activeSection === id && !activeFigure) {
      setActiveSection(null);
      setActiveFigure(null);
      return;
    }
    setActiveSection(id);
    setActiveFigure(null);
  };

  const selectFigure = (id: string) => {
    if (activeFigure === id) {
      setActiveFigure(null);
      return;
    }
    // Sub-filters stand alone — do not also select the section header.
    setActiveSection(null);
    setActiveFigure(id);
  };

  return (
    <div className="space-y-10 not-prose">
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
          We need radius, length, and shape, plus any straight legs you want included, to pre-bend your Flex Trim™ for an
          effortless installation. Don&apos;t know the radius, or working with an irregular curve? Use these diagrams to
          gather the measurements that we need and we&apos;ll take it from there. Be sure to check out our{" "}
          <Link
            href="/ordering/ordering-tips"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            What you need to know to order
          </Link>{" "}
          page for a comprehensive guide of our Flex Trim™ pieces.
        </p>

        <MeasureFilterBar
          activeSection={activeSection}
          activeFigure={activeFigure}
          onSelectSection={selectSection}
          onSelectFigure={selectFigure}
        />
      </div>

      {visibleSections.map((section) => {
        const visibleFigures = activeFigure
          ? section.figures.filter((figure) => figure.src === activeFigure)
          : section.figures;
        const showStraightEdge =
          section.id === "corners" &&
          (!activeFigure || activeFigure === section.figures[0]?.src);
        const showRadiusGauge =
          section.id === "corners" &&
          (!activeFigure || activeFigure === RADIUS_GAUGE_FILTER_ID);
        const showCornersRow = showStraightEdge || showRadiusGauge;

        if (activeFigure && visibleFigures.length === 0 && !showCornersRow) {
          return null;
        }

        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="scroll-mt-24"
          >
            <h2
              id={`${section.id}-heading`}
              className="border-y border-neutral-300 py-3 text-center text-base font-semibold tracking-tight text-neutral-900 md:text-lg"
            >
              {section.title}
            </h2>
            {section.intro ? (
              <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">{section.intro}</p>
            ) : null}
            {section.id === "corners" ? (
              showCornersRow ? (
                <div
                  className={`mt-6 grid grid-cols-1 items-stretch gap-8 sm:items-center sm:gap-x-8 sm:gap-y-10 ${
                    showStraightEdge && showRadiusGauge ? "sm:grid-cols-2" : "sm:grid-cols-1"
                  }`}
                >
                  {showStraightEdge ? <MeasureFigureCard figure={section.figures[0]} /> : null}
                  {showRadiusGauge ? <RadiusGaugePromo /> : null}
                </div>
              ) : null
            ) : (
              <>
                <div
                  className={`mt-6 grid grid-cols-1 items-stretch gap-8 sm:gap-x-8 sm:gap-y-10 ${
                    visibleFigures.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2"
                  }`}
                >
                  {visibleFigures.map((figure, index) => {
                    const partner = visibleFigures[index ^ 1];
                    const partnerHasTemplateNote =
                      Boolean(partner) && TEMPLATE_NOTE_CAPTIONS.has(partner.caption);
                    const needsFooterSpacer =
                      section.id === "arches" &&
                      !activeFigure &&
                      partnerHasTemplateNote &&
                      !TEMPLATE_NOTE_CAPTIONS.has(figure.caption);
                    const footerSpacer: FooterSpacer | undefined = needsFooterSpacer
                      ? partner.caption === "Oval"
                        ? "template-with-oval"
                        : "template"
                      : undefined;
                    return (
                      <MeasureFigureCard
                        key={figure.src}
                        figure={figure}
                        orderingOptions={
                          figure.caption === "Quarter round"
                            ? QUARTER_ROUND_ORDERING_OPTIONS
                            : undefined
                        }
                        footerSpacer={footerSpacer}
                      />
                    );
                  })}
                </div>
                {section.id === "minimum-radius" && !activeFigure ? (
                  <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-md">
                      <RadiusGaugePromo
                        pdfSrc={STANDARD_RADIUS_GAUGE_PDF}
                        title="Radius gauge"
                        ariaLabel="Open printable radius gauge"
                      />
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
