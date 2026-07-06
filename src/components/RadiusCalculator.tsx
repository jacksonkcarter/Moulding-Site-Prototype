"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export function RadiusCalculator() {
  const [width, setWidth] = useState("");
  const [rise, setRise] = useState("");

  const result = useMemo(() => {
    const W = parseFloat(width);
    const R = parseFloat(rise);
    if (Number.isNaN(W) || Number.isNaN(R) || W <= 0 || R <= 0) return null;
    // Radius: r = (W² + 4R²) / (8R)
    const radius = (W * W + 4 * R * R) / (8 * R);
    // Arc length (radians): theta = 2 * asin(W / (2*r)), length = r * theta
    const theta = 2 * Math.asin(W / (2 * radius));
    const lengthFt = (radius * theta) / 12; // assume measurements in inches -> feet
    // Round length UP to nearest foot, then add 1 extra foot
    const requiredLengthFt = Math.ceil(lengthFt) + 1;
    return { radius: radius / 12, requiredLengthFt };
  }, [width, rise]);

  return (
    <section id="calculator" className="scroll-mt-20 border-t border-neutral-200 bg-neutral-50 pt-5 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-sans text-3xl font-medium uppercase tracking-[0.15em] text-neutral-900 text-center">
          Radius Calculator
        </h2>
        <p className="mt-2 text-neutral-600 text-center">
          Enter width and rise (in inches) to get arc radius and required moulding length.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Width (inches)</label>
              <input
                type="number"
                min="0"
                step="0.25"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-300 bg-white px-4 py-2 text-neutral-800 placeholder-neutral-400 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                placeholder="e.g. 48"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Rise (inches)</label>
              <input
                type="number"
                min="0"
                step="0.25"
                value={rise}
                onChange={(e) => setRise(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-300 bg-white px-4 py-2 text-neutral-800 placeholder-neutral-400 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                placeholder="e.g. 12"
              />
            </div>
          </div>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-neutral-500">Results</p>
              <p className="mt-2 text-2xl font-medium text-neutral-900">
                Radius: <span className="text-[#9f1b20]">{result.radius.toFixed(2)} ft</span>
              </p>
              <p className="mt-1 text-2xl font-medium text-neutral-900">
                Required length: <span className="text-[#9f1b20]">{result.requiredLengthFt} ft</span>
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                (Length rounded up to nearest foot, plus 1 extra foot.)
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
