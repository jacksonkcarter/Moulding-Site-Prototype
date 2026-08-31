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
    src: "/order-form-images/Arch Style Half Round.png",
    alt: "Half round arch",
  },
  "Arc/Eyebrow": {
    src: "/order-form-images/Eyebrow Width Rise.png",
    alt: "Arc or eyebrow with width and rise",
  },
  Elliptical: {
    src: "/order-form-images/Arch Style Elliptical.png",
    alt: "Elliptical arch",
  },
};

type FtInDraft = { ft: string; inch: string };

const EMPTY_FT_IN: FtInDraft = { ft: "", inch: "" };

function formatFeet(n: number): string {
  if (!(n > 0)) return "—";
  const rounded = Math.round(n * 100) / 100;
  const whole = Math.floor(rounded);
  let inches = Math.round((rounded - whole) * 12 * 10) / 10;
  if (inches >= 12) {
    return `${whole + 1} ft`;
  }
  if (inches === 0) return `${whole} ft`;
  return `${whole} ft ${inches} in`;
}

function FtInInputs({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: FtInDraft;
  onChange: (next: FtInDraft) => void;
}) {
  return (
    <div>
      <label htmlFor={`${id}-ft`} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="mt-1 flex min-w-0 items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <input
            id={`${id}-ft`}
            type="text"
            inputMode="decimal"
            value={value.ft}
            onChange={(e) => onChange({ ...value, ft: e.target.value })}
            placeholder="0"
            className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="shrink-0 text-sm text-neutral-500">ft</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <input
            id={`${id}-in`}
            type="text"
            inputMode="decimal"
            value={value.inch}
            onChange={(e) => onChange({ ...value, inch: e.target.value })}
            placeholder="0"
            className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="shrink-0 text-sm text-neutral-500">in</span>
        </div>
      </div>
    </div>
  );
}

export function FlexTrimToolbox() {
  const [shape, setShape] = useState<ToolboxShape>("Half Round");
  const [measuredMode, setMeasuredMode] = useState(false);
  const [lrSelected, setLrSelected] = useState(false);
  const [drafts, setDrafts] = useState<Partial<Record<ToolboxFieldName, FtInDraft>>>({});

  const isCustom = shape === "Custom Shape";
  const isMeasured = measuredMode || isCustom;
  const showLr = !(shape === "Oval" && !isMeasured);
  const fields = isMeasured ? (["Length Around Outside"] as ToolboxFieldName[]) : dimensionFieldsFor(shape);

  const values: ToolboxValues = useMemo(() => {
    const next: ToolboxValues = {};
    for (const field of fields) {
      const draft = drafts[field] ?? EMPTY_FT_IN;
      next[field] = parseFtIn(draft.ft, draft.inch);
    }
    return next;
  }, [drafts, fields]);

  const result = useMemo(
    () => calculateToolboxLength(shape, lrSelected && showLr, isMeasured, values),
    [shape, lrSelected, showLr, isMeasured, values],
  );

  const setField = (field: ToolboxFieldName, next: FtInDraft) => {
    setDrafts((prev) => ({ ...prev, [field]: next }));
  };

  const selectShape = (next: ToolboxShape) => {
    setShape(next);
    if (next === "Custom Shape") setMeasuredMode(true);
  };

  const shapeImage = SHAPE_IMAGES[shape];

  return (
    <section id="toolbox" className="scroll-mt-20 border-t border-neutral-200 bg-neutral-50 pt-5 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-center font-sans text-3xl font-medium tracking-tight text-neutral-900">
          Flex Trim Toolbox
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-600">
          Estimate how much Flex Trim™ to order from an arch, oval, or measured length. Required length is rounded
          up to the next foot, plus extra for manufacturing.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLBOX_SHAPES.map((option) => {
            const img = SHAPE_IMAGES[option];
            const selected = shape === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => selectShape(option)}
                className={`flex cursor-pointer flex-col items-center justify-end rounded-lg border-2 p-3 transition-colors ${
                  img ? "aspect-square min-h-32" : "min-h-32 justify-center"
                } ${
                  selected
                    ? "border-primary bg-red-50/50"
                    : "border-neutral-300 bg-white hover:border-primary hover:bg-red-50/30"
                }`}
              >
                {img ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={200}
                    height={200}
                    className="mb-1 h-auto w-full flex-1 object-contain"
                  />
                ) : null}
                <span className="text-center text-sm font-medium text-neutral-800">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            {!isCustom ? (
              <fieldset>
                <legend className="text-sm font-medium text-neutral-800">How do you want to measure?</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-full border-2 px-3 py-2 text-sm font-medium ${
                      !measuredMode
                        ? "border-primary bg-red-50/50 text-neutral-900"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="toolbox-mode"
                      className="sr-only"
                      checked={!measuredMode}
                      onChange={() => setMeasuredMode(false)}
                    />
                    From dimensions
                  </label>
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-full border-2 px-3 py-2 text-sm font-medium ${
                      measuredMode
                        ? "border-primary bg-red-50/50 text-neutral-900"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="toolbox-mode"
                      className="sr-only"
                      checked={measuredMode}
                      onChange={() => setMeasuredMode(true)}
                    />
                    I measured the length
                  </label>
                </div>
              </fieldset>
            ) : (
              <p className="text-sm text-neutral-600">
                For a custom shape, enter the length around the outside of the piece.
              </p>
            )}

            {showLr ? (
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={lrSelected}
                  onChange={(e) => setLrSelected(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-400 text-primary focus:ring-primary"
                />
                <span>
                  <span className="text-sm font-medium text-neutral-800">Left / right half only</span>
                  <span className="mt-0.5 block text-sm text-neutral-600">
                    Check this if you only need one side of the opening.
                  </span>
                </span>
              </label>
            ) : null}

            <div className="space-y-4">
              {fields.map((field) => (
                <FtInInputs
                  key={field}
                  id={field.replace(/\s+/g, "-").toLowerCase()}
                  label={field}
                  value={drafts[field] ?? EMPTY_FT_IN}
                  onChange={(next) => setField(field, next)}
                />
              ))}
            </div>

            {shapeImage && isMeasured ? (
              <p className="text-xs text-neutral-500">
                Measured length should follow the outside of the moulding path.
              </p>
            ) : null}
          </div>

          {result.finalReq > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-neutral-500">Results</p>
              <p className="mt-2 text-2xl font-medium text-neutral-900">
                Geometric length:{" "}
                <span className="text-primary">{formatFeet(result.rawGeom)}</span>
              </p>
              <p className="mt-1 text-2xl font-medium text-neutral-900">
                Required length:{" "}
                <span className="text-primary">{result.finalReq} ft</span>
              </p>
              {result.radiusFt ? (
                <p className="mt-1 text-lg font-medium text-neutral-900">
                  Radius: <span className="text-primary">{formatFeet(result.radiusFt)}</span>
                </p>
              ) : null}
              <p className="mt-3 text-sm text-neutral-500">
                Order the required length. It includes rounding up to the next foot plus manufacturing allowance.
              </p>
            </motion.div>
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-white/60 p-6 text-sm text-neutral-500">
              Choose a shape and enter measurements to see the required Flex Trim™ length.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
