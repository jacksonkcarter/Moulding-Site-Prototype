"use client";

import { useState } from "react";
import { SpliceExampleLink } from "@/components/SpliceExampleLink";

const DEFAULT_MOLD_FT = 12;
const MIN_MOLD_FT = 1;
const MAX_MOLD_FT = 40;
/** Max high end of the per-piece length range for multi-piece grades. */
const MAX_PIECE_FT = 8;

function formatFt(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatRange(min: number, max: number): string {
  return `${formatFt(min)}-${formatFt(max)}`;
}

/** Round to the nearest 0.5 ft (whole or half-foot values only). */
function roundToHalfFt(n: number): number {
  return Math.round(n * 2) / 2;
}

/**
 * Multi-piece length: (mold + 1) / pieceCount, rounded to nearest half-ft for the low end;
 * high end is low + 0.5 ft and must stay ≤ 8 ft (add pieces if needed).
 */
function multiPieceRequirement(moldFt: number): string {
  const baseTotal = moldFt + 1;
  let pieceCount = Math.max(2, Math.ceil(baseTotal / MAX_PIECE_FT));
  let pieceMin = roundToHalfFt(baseTotal / pieceCount);
  let pieceMax = pieceMin + 0.5;

  while (pieceMax > MAX_PIECE_FT) {
    pieceCount += 1;
    pieceMin = roundToHalfFt(baseTotal / pieceCount);
    pieceMax = pieceMin + 0.5;
  }

  const pcsLabel = pieceCount === 1 ? "pc" : "pcs";
  return `Send ${pieceCount} ${pcsLabel} @ ${formatRange(pieceMin, pieceMax)} ft each`;
}

type Requirement = {
  grade: string;
  requirement: string;
  spliceExample?: boolean;
};

function requirementsForMold(moldFt: number): Requirement[] {
  const fullMin = moldFt + 1;
  const fullMax = moldFt + 2;
  const multiPc = multiPieceRequirement(moldFt);
  return [
    { grade: "Paint grade", requirement: multiPc },
    { grade: "Stain grade with center splice", requirement: multiPc, spliceExample: true },
    {
      grade: "Stain grade without center splice",
      requirement: `Send 1 pc @ ${formatRange(fullMin, fullMax)} ft`,
    },
  ];
}

function GradeLabel({ grade, spliceExample }: { grade: string; spliceExample?: boolean }) {
  if (!spliceExample) return <>{grade}</>;
  const marker = "with center splice";
  const index = grade.indexOf(marker);
  if (index === -1) return <>{grade}</>;
  return (
    <>
      {grade.slice(0, index)}
      <SpliceExampleLink>{marker}</SpliceExampleLink>
      {grade.slice(index + marker.length)}
    </>
  );
}

export function MoldLengthCalculator() {
  const [moldFt, setMoldFt] = useState(DEFAULT_MOLD_FT);
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? String(moldFt);
  const rows = requirementsForMold(moldFt);

  const commit = (raw: string) => {
    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      setMoldFt(Math.min(Math.max(parsed, MIN_MOLD_FT), MAX_MOLD_FT));
    }
    setDraft(null);
  };

  return (
    <div className="not-prose my-6 flex w-full flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-center sm:gap-[1in]">
      <div className="flex shrink-0 flex-col items-center">
        <label htmlFor="mold-length" className="block text-sm font-medium text-neutral-800">
          Mold length
        </label>
        <div className="relative mt-1">
          <input
            id="mold-length"
            type="text"
            inputMode="decimal"
            value={display}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => commit(display)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit(display);
              }
            }}
            className="w-16 rounded border border-neutral-300 bg-white px-2 py-2 text-center text-neutral-900 focus:border-primary focus:outline-none"
          />
          <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 text-sm text-neutral-600">
            ft
          </span>
        </div>
        <button
          type="button"
          onClick={() => commit(display)}
          className="mt-3 rounded-full border-2 border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Calculate
        </button>
      </div>

      <div className="min-w-0 overflow-x-auto">
        <div className="overflow-hidden rounded-lg shadow-sm">
          <table className="w-full border-collapse text-left text-sm sm:w-auto">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  scope="colgroup"
                  className="bg-primary px-4 py-2.5 text-center text-sm font-bold text-white"
                >
                  Sample length required ({formatFt(moldFt)} ft mold)
                </th>
              </tr>
              <tr className="bg-neutral-200">
                <th scope="col" className="px-4 py-2.5 font-bold text-neutral-800">
                  Flex Trim™ finish grade
                </th>
                <th scope="col" className="px-4 py-2.5 font-bold text-neutral-800">
                  Length to send
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.grade} className={index % 2 === 0 ? "bg-white" : "bg-neutral-100"}>
                  <td className="px-4 py-2.5 text-neutral-800">
                    <GradeLabel grade={row.grade} spliceExample={row.spliceExample} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap font-semibold text-primary">
                    {row.requirement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
