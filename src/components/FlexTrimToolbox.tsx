"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  TOOLBOX_SHAPES,
  calculateToolboxLength,
  dimensionFieldsFor,
  hasRequiredToolboxInputs,
  parseFtIn,
  type ToolboxFieldName,
  type ToolboxShape,
  type ToolboxValues,
} from "@/lib/flex-trim-toolbox";

const SHAPE_IMAGES: Partial<Record<ToolboxShape, { src: string; alt: string }>> = {
  "Half-round": {
    src: "/ordering-tips/Half Round.png",
    alt: "Half-round arch",
  },
  "Full circle": {
    src: "/ordering-tips/Full Circle.png",
    alt: "Full circle",
  },
  "Eyebrow arc & consistent radius curve": {
    src: "/ordering-tips/Eyebrow.png",
    alt: "Eyebrow arc and consistent radius curve",
  },
  Elliptical: {
    src: "/ordering-tips/Elliptical.png",
    alt: "Elliptical arch",
  },
  Oval: {
    src: "/ordering-tips/Oval.png",
    alt: "Oval",
  },
  "Radius only: crown & consistent radius curve": {
    src: "/ordering-tips/OSR.png",
    alt: "Radius crown OSR",
  },
};

type MeasureImage = { src: string; alt: string; width: number; height: number };

/** How-to-measure diagrams shown beside the dimension inputs. */
const MEASURE_IMAGES: Record<ToolboxShape, MeasureImage[]> = {
  "Half-round": [
    {
      src: "/how-to-measure/half-round.png",
      alt: "Half-round opening with diameter and optional straight leg length",
      width: 1400,
      height: 1050,
    },
  ],
  "Full circle": [
    {
      src: "/how-to-measure/circle-or-full-round.png",
      alt: "Circle or full round with diameter",
      width: 1400,
      height: 1050,
    },
  ],
  "Eyebrow arc & consistent radius curve": [
    {
      src: "/how-to-measure/eyebrow-arc.png",
      alt: "Eyebrow arc with width and rise",
      width: 1400,
      height: 1050,
    },
  ],
  Elliptical: [
    {
      src: "/how-to-measure/elliptical.png",
      alt: "Elliptical arch with width and rise",
      width: 1400,
      height: 1050,
    },
  ],
  Oval: [
    {
      src: "/how-to-measure/oval.png",
      alt: "Oval with overall width and height",
      width: 1400,
      height: 1050,
    },
  ],
  "Radius only: crown & consistent radius curve": [
    {
      src: "/how-to-measure/osr-crown.png",
      alt: "OSR crown measuring width, rise, and radiused piece length",
      width: 1228,
      height: 659,
    },
    {
      src: "/how-to-measure/isr-crown.png",
      alt: "ISR crown measuring width, rise, and radiused piece length",
      width: 1268,
      height: 634,
    },
  ],
};

const MEASURE_STACK_GAP_PX = 8;

type DimUnitMode = "inches" | "ft-in";

type DimDraft = {
  mode: DimUnitMode;
  /** Feet portion when mode is ft-in; unused in inches mode. */
  ft: string;
  /**
   * Inches-only mode: total inches.
   * ft-in mode: inches remainder (0–11.x).
   */
  inch: string;
};

const EMPTY_DIM: DimDraft = { mode: "inches", ft: "", inch: "" };

const INPUT_CLASS =
  "rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-center text-neutral-800 placeholder-neutral-400 transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

/** Format a length in feet as inches, rounded to the nearest 1/2". */
function formatRadiusInches(feet: number): string {
  if (!(feet > 0)) return "-";
  const inches = Math.round(feet * 12 * 2) / 2;
  return `${inches} in`;
}

/** Format a length in feet as ft + inches, with inches to the hundredth. */
function formatExactLengthFtIn(feet: number): string {
  if (!(feet > 0)) return "-";
  const totalInches = feet * 12;
  let wholeFt = Math.floor(totalInches / 12 + 1e-9);
  let inches = Math.round((totalInches - wholeFt * 12) * 100) / 100;
  if (inches >= 12) {
    wholeFt += 1;
    inches = Math.round((inches - 12) * 100) / 100;
  }
  const inchStr = inches.toFixed(2);
  if (wholeFt <= 0) return `${inchStr} in`;
  return `${wholeFt} ft ${inchStr} in`;
}

/** Format a radius in feet as inches, rounded to the hundredth. */
function formatExactRadiusInches(feet: number): string {
  if (!(feet > 0)) return "-";
  return `${(Math.round(feet * 12 * 100) / 100).toFixed(2)} in`;
}

function ExactRevealIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const EXACT_REVEAL_BTN =
  "inline-flex cursor-pointer items-center gap-1.5 text-sm text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const RADIUS_ONLY_SHAPE = "Radius only: crown & consistent radius curve" satisfies ToolboxShape;

function draftToFeet(draft: DimDraft): number {
  if (draft.mode === "inches") {
    return parseFtIn("", draft.inch);
  }
  return parseFtIn(draft.ft, draft.inch);
}

/** Convert between inches-only and feet+inches without losing the measured value. */
function convertDimMode(draft: DimDraft, nextMode: DimUnitMode): DimDraft {
  if (draft.mode === nextMode) return draft;

  const totalFeet = draftToFeet(draft);
  if (!(totalFeet > 0)) {
    return { mode: nextMode, ft: "", inch: "" };
  }

  const totalInches = totalFeet * 12;

  if (nextMode === "inches") {
    const rounded = Math.round(totalInches * 1000) / 1000;
    return { mode: "inches", ft: "", inch: String(rounded) };
  }

  const wholeFt = Math.floor(totalInches / 12 + 1e-9);
  const remIn = Math.round((totalInches - wholeFt * 12) * 1000) / 1000;
  return {
    mode: "ft-in",
    ft: wholeFt > 0 ? String(wholeFt) : "",
    inch: remIn > 0 ? String(remIn) : "",
  };
}

function UnitModeToggle({
  id,
  value,
  onChange,
}: {
  id: string;
  value: DimUnitMode;
  onChange: (mode: DimUnitMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Unit format"
      className="relative inline-grid grid-cols-2 rounded-md bg-neutral-100 p-0.5 text-xs font-semibold tracking-tight"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-[5px] bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-out ${
          value === "ft-in" ? "translate-x-[calc(100%+2px)]" : "translate-x-0.5"
        }`}
      />
      <button
        type="button"
        id={`${id}-mode-inches`}
        tabIndex={-1}
        aria-pressed={value === "inches"}
        onClick={() => onChange("inches")}
        className={`relative z-10 px-2.5 py-1 transition-colors ${
          value === "inches" ? "text-primary" : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        Inches
      </button>
      <button
        type="button"
        id={`${id}-mode-ft-in`}
        tabIndex={-1}
        aria-pressed={value === "ft-in"}
        onClick={() => onChange("ft-in")}
        className={`relative z-10 px-2.5 py-1 transition-colors ${
          value === "ft-in" ? "text-primary" : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        Feet + Inches
      </button>
    </div>
  );
}

function DimensionInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: DimDraft;
  onChange: (next: DimDraft) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={`${id}-primary`} className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      <UnitModeToggle
        id={id}
        value={value.mode}
        onChange={(mode) => onChange(convertDimMode(value, mode))}
      />

      {value.mode === "inches" ? (
        <div className="flex items-center gap-2">
          <input
            id={`${id}-primary`}
            type="text"
            inputMode="decimal"
            value={value.inch}
            onChange={(e) => onChange({ ...value, inch: e.target.value })}
            placeholder="0"
            aria-label={`${label} in inches`}
            className={`w-28 ${INPUT_CLASS}`}
          />
          <span className="text-sm text-neutral-500">in</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <input
              id={`${id}-primary`}
              type="text"
              inputMode="decimal"
              value={value.ft}
              onChange={(e) => onChange({ ...value, ft: e.target.value })}
              placeholder="0"
              aria-label={`${label} feet`}
              className={`w-16 ${INPUT_CLASS}`}
            />
            <span className="text-sm text-neutral-500">ft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              id={`${id}-in`}
              type="text"
              inputMode="decimal"
              value={value.inch}
              onChange={(e) => onChange({ ...value, inch: e.target.value })}
              placeholder="0"
              aria-label={`${label} inches`}
              className={`w-16 ${INPUT_CLASS}`}
            />
            <span className="text-sm text-neutral-500">in</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FlexTrimToolbox() {
  const [shape, setShape] = useState<ToolboxShape>("Eyebrow arc & consistent radius curve");
  const [drafts, setDrafts] = useState<Partial<Record<ToolboxFieldName, DimDraft>>>({});
  const [diagramOpen, setDiagramOpen] = useState(false);
  const [showExactLength, setShowExactLength] = useState(false);
  const [showExactRadius, setShowExactRadius] = useState(false);
  const [diagramHeight, setDiagramHeight] = useState<number | null>(null);
  const twoInputHeightRef = useRef<HTMLDivElement>(null);
  const diagramTitleId = useId();
  const measureImgs = MEASURE_IMAGES[shape];
  const isRadiusOnly = shape === RADIUS_ONLY_SHAPE;
  const measureStackWidth =
    diagramHeight && measureImgs.length > 1
      ? (diagramHeight - MEASURE_STACK_GAP_PX * (measureImgs.length - 1)) /
        measureImgs.reduce((sum, img) => sum + img.height / img.width, 0)
      : null;

  const fields = dimensionFieldsFor(shape);

  const values: ToolboxValues = useMemo(() => {
    const next: ToolboxValues = {};
    for (const field of fields) {
      next[field] = draftToFeet(drafts[field] ?? EMPTY_DIM);
    }
    return next;
  }, [drafts, fields]);

  const canShowResult = hasRequiredToolboxInputs(shape, values);
  const result = useMemo(
    () => (canShowResult ? calculateToolboxLength(shape, values) : { rawGeom: 0, finalReq: 0 }),
    [canShowResult, shape, values],
  );

  const setField = (field: ToolboxFieldName, next: DimDraft) => {
    setDrafts((prev) => ({ ...prev, [field]: next }));
  };

  useEffect(() => {
    setDiagramOpen(false);
    setShowExactLength(false);
    setShowExactRadius(false);
  }, [shape]);

  useEffect(() => {
    setShowExactLength(false);
    setShowExactRadius(false);
  }, [drafts]);

  useEffect(() => {
    const el = twoInputHeightRef.current;
    if (!el) return;
    const update = () => setDiagramHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!diagramOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDiagramOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [diagramOpen]);

  return (
    <section id="toolbox" className="scroll-mt-20 border-t border-neutral-200 bg-white pt-5 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-center font-sans text-3xl font-medium tracking-tight text-neutral-900">
          Length and radius calculator
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-600">
          Determine how much Flex Trim™ to order based on your application.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {TOOLBOX_SHAPES.map((option) => {
            const img = SHAPE_IMAGES[option];
            const selected = shape === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setShape(option)}
                className={`flex cursor-pointer flex-col items-center rounded-lg border-2 bg-white p-3 transition-colors ${
                  img ? "aspect-square min-h-32" : "min-h-32 justify-center"
                } ${
                  selected
                    ? "border-primary"
                    : "border-neutral-300 hover:border-primary"
                }`}
              >
                {img ? (
                  <div className="relative min-h-0 w-full flex-1">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 16vw"
                      className="object-contain"
                    />
                  </div>
                ) : null}
                <span className="mt-1 shrink-0 text-center text-sm font-medium leading-snug text-neutral-800">
                  {option === "Eyebrow arc & consistent radius curve" ? (
                    <>
                      Eyebrow arc &amp;
                      <br />
                      consistent radius curve
                    </>
                  ) : option === "Radius only: crown & consistent radius curve" ? (
                    <>
                      Radius only: crown &amp;
                      <br />
                      consistent radius curve
                    </>
                  ) : (
                    option
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[auto_minmax(20rem,1fr)] lg:items-start">
          <div className="flex w-fit max-w-full items-start gap-5 sm:gap-6">
            <button
              type="button"
              onClick={() => setDiagramOpen(true)}
              className="inline-flex h-fit w-fit shrink-0 cursor-pointer flex-col p-0 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={
                measureStackWidth
                  ? { width: measureStackWidth, gap: MEASURE_STACK_GAP_PX }
                  : undefined
              }
              aria-label={`View larger: ${shape}`}
            >
              {measureImgs.map((img) => (
                <Image
                  key={`${shape}-${img.src}`}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  style={
                    measureStackWidth
                      ? { width: "100%", height: "auto" }
                      : diagramHeight
                        ? { height: diagramHeight, width: "auto" }
                        : undefined
                  }
                  className="h-auto w-auto rounded-md object-contain"
                  sizes="560px"
                  quality={90}
                />
              ))}
            </button>

            <div className="w-fit max-w-full shrink-0 space-y-5 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              {fields.map((field) => (
                <DimensionInput
                  key={field}
                  id={field.replace(/\s+/g, "-").toLowerCase()}
                  label={field === "Straight Legs" ? "Straight Legs (optional)" : field}
                  value={drafts[field] ?? EMPTY_DIM}
                  onChange={(next) => setField(field, next)}
                />
              ))}
            </div>

            <div
              ref={twoInputHeightRef}
              aria-hidden
              className="pointer-events-none absolute -left-[9999px] top-0 w-fit space-y-5 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <DimensionInput id="diagram-height-a" label="Width" value={EMPTY_DIM} onChange={() => {}} />
              <DimensionInput id="diagram-height-b" label="Rise" value={EMPTY_DIM} onChange={() => {}} />
            </div>
          </div>

          {canShowResult && (result.finalReq > 0 || (result.radiusFt ?? 0) > 0) ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-0 w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              {!isRadiusOnly ? (
                <p className="text-2xl font-medium text-neutral-900">
                  Recommended part length:{" "}
                  <span className="text-primary">{result.finalReq} ft</span>
                </p>
              ) : null}
              {result.radiusFt ? (
                <p className={`text-2xl font-medium text-neutral-900 ${isRadiusOnly ? "" : "mt-1"}`}>
                  Radius: <span className="text-primary">{formatRadiusInches(result.radiusFt)}</span>
                </p>
              ) : null}
              {isRadiusOnly && (result.rawGeom > 0 || result.radiusFt) ? (
                <div className="mt-3 flex flex-col items-start gap-2">
                  {result.radiusFt ? (
                    !showExactRadius ? (
                      <button
                        type="button"
                        onClick={() => setShowExactRadius(true)}
                        className={EXACT_REVEAL_BTN}
                      >
                        <ExactRevealIcon />
                        See exact radius
                      </button>
                    ) : (
                      <p className="text-sm text-neutral-500">
                        Exact radius:{" "}
                        <span className="font-medium text-neutral-800">
                          {formatExactRadiusInches(result.radiusFt)}
                        </span>
                      </p>
                    )
                  ) : null}
                  {result.rawGeom > 0 ? (
                    !showExactLength ? (
                      <button
                        type="button"
                        onClick={() => setShowExactLength(true)}
                        className={EXACT_REVEAL_BTN}
                      >
                        <ExactRevealIcon />
                        See exact length
                      </button>
                    ) : (
                      <div className="space-y-1 text-sm text-neutral-500">
                        <p>
                          Exact length:{" "}
                          <span className="font-medium text-neutral-800">
                            {formatExactLengthFtIn(result.rawGeom)}
                          </span>
                        </p>
                        <p>This length should not be used when specifying the piece length.</p>
                      </div>
                    )
                  ) : null}
                </div>
              ) : null}
              {shape === "Full circle" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  Full circles will be sent as two individual half-rounds which can be joined on
                  site.
                </p>
              ) : null}
              {shape === "Oval" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  Ovals will be sent as two individual halves which can be joined on site.
                </p>
              ) : null}
              {shape === "Half-round" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  Our standard half-rounds have extra length continuing at the radius. If this
                  extra length needs to be straight to use as legs, this must be communicated
                  during ordering.
                </p>
              ) : null}
              {shape === "Elliptical" || shape === "Oval" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  These dimensions are required to quote, but a{" "}
                  <Link
                    href="/ordering/ordering-tips#irregular-radius"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    template
                  </Link>{" "}
                  is required to order.{" "}
                  <Link
                    href="/ordering/ordering-tips#irregular-radius"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Learn more
                  </Link>
                  .
                </p>
              ) : null}
            </motion.div>
          ) : (
            <div className="min-w-0 w-full rounded-lg border border-dashed border-neutral-300 bg-white/60 p-6 text-sm text-neutral-500">
              Choose a shape and enter measurements to see the required Flex Trim™ length.
            </div>
          )}
        </div>
      </div>

      {diagramOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="presentation"
          onClick={() => setDiagramOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={diagramTitleId}
            className="relative flex max-h-[90vh] w-auto max-w-[min(72rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg bg-white p-4 pt-12 shadow-lg sm:p-6 sm:pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDiagramOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <div
              className={
                measureImgs.length > 1
                  ? "mx-auto flex min-h-0 w-full max-w-3xl flex-col gap-3"
                  : "mx-auto flex w-full max-w-3xl flex-col"
              }
            >
              {measureImgs.map((img) => (
                <Image
                  key={`dialog-${img.src}`}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className={
                    measureImgs.length > 1
                      ? "h-auto max-h-[calc((90vh-9rem)/2)] w-full rounded-md object-contain"
                      : "mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded-md object-contain"
                  }
                  sizes="90vw"
                />
              ))}
            </div>
            <p id={diagramTitleId} className="mt-4 shrink-0 text-center text-sm font-medium text-neutral-800 sm:text-base">
              {shape}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
