"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  TOOLBOX_SHAPES,
  calculateToolboxLength,
  dimensionFieldsFor,
  parseFtIn,
  type ToolboxFieldName,
  type ToolboxShape,
  type ToolboxValues,
} from "@/lib/flex-trim-toolbox";

const SHAPE_IMAGES: Partial<Record<ToolboxShape, { src: string; alt: string }>> = {
  "Half Round": {
    src: "/ordering-tips/Half Round.png",
    alt: "Half round arch",
  },
  "Full Circle": {
    src: "/ordering-tips/Full Circle.png",
    alt: "Full circle",
  },
  "Arc/Eyebrow": {
    src: "/ordering-tips/Eyebrow.png",
    alt: "Arc or eyebrow",
  },
  Elliptical: {
    src: "/ordering-tips/Elliptical.png",
    alt: "Elliptical arch",
  },
  Oval: {
    src: "/ordering-tips/Oval.png",
    alt: "Oval",
  },
};

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
  const [shape, setShape] = useState<ToolboxShape>("Arc/Eyebrow");
  const [drafts, setDrafts] = useState<Partial<Record<ToolboxFieldName, DimDraft>>>({});

  const fields = dimensionFieldsFor(shape);

  const values: ToolboxValues = useMemo(() => {
    const next: ToolboxValues = {};
    for (const field of fields) {
      next[field] = draftToFeet(drafts[field] ?? EMPTY_DIM);
    }
    return next;
  }, [drafts, fields]);

  const result = useMemo(
    () => calculateToolboxLength(shape, values),
    [shape, values],
  );

  const setField = (field: ToolboxFieldName, next: DimDraft) => {
    setDrafts((prev) => ({ ...prev, [field]: next }));
  };

  return (
    <section id="toolbox" className="scroll-mt-20 border-t border-neutral-200 bg-neutral-50 pt-5 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-center font-sans text-3xl font-medium tracking-tight text-neutral-900">
          Length and radius calculator
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-600">
          Estimate how much Flex Trim™ to order from an arch or oval.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center px-2 pt-1">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={200}
                      height={200}
                      className="max-h-full max-w-[80%] object-contain"
                    />
                  </div>
                ) : null}
                <span className="mt-1 shrink-0 text-center text-sm font-medium text-neutral-800">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[auto_minmax(20rem,1fr)] lg:items-start">
          <div className="w-fit min-w-[min(100%,20rem)] max-w-full space-y-5 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            {fields.map((field) => (
              <DimensionInput
                key={field}
                id={field.replace(/\s+/g, "-").toLowerCase()}
                label={field}
                value={drafts[field] ?? EMPTY_DIM}
                onChange={(next) => setField(field, next)}
              />
            ))}
          </div>

          {result.finalReq > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-0 w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-2xl font-medium text-neutral-900">
                Recommended part length:{" "}
                <span className="text-primary">{result.finalReq} ft</span>
              </p>
              {result.radiusFt ? (
                <p className="mt-1 text-lg font-medium text-neutral-900">
                  Radius: <span className="text-primary">{formatRadiusInches(result.radiusFt)}</span>
                </p>
              ) : null}
              <p className="mt-3 text-sm text-neutral-500">
                This recommended length includes extra length for miter cuts and on site adjustments.
              </p>
              {shape === "Full Circle" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  Full circles will be sent as two individual half rounds which can be joined on
                  site.
                </p>
              ) : null}
              {shape === "Oval" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  Ovals will be sent as two individual halves which can be joined on site.
                </p>
              ) : null}
              {shape === "Half Round" ? (
                <p className="mt-2 text-sm text-neutral-500">
                  Our standard half rounds have extra length continuing at the radius. If this
                  extra length needs to be straight to use as legs, this must be communicated
                  during ordering.
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
    </section>
  );
}
