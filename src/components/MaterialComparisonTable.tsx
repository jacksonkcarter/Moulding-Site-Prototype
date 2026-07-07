import Link from "next/link";
import {
  MATERIAL_COMPARISON_COLUMNS,
  MATERIAL_COMPARISON_ROWS,
} from "@/data/material-comparison";

const RATING_LEVELS = [
  { symbol: "O", label: "Good", count: 1 },
  { symbol: "OO", label: "Better", count: 2 },
  { symbol: "OOO", label: "Best", count: 3 },
] as const;

const LEARN_MORE_LINKS: Partial<Record<(typeof MATERIAL_COMPARISON_COLUMNS)[number], string>> = {
  "Machinable S4S": "/product-info/machinable-s4s",
  "Ultra-Fire Flex": "/contact-us",
};

function RatingDots({ value }: { value: string }) {
  const rating = RATING_LEVELS.find((level) => level.symbol === value);

  if (rating) {
    return (
      <div className="flex items-center justify-center gap-1" aria-label={`${rating.label} (${value})`}>
        {Array.from({ length: rating.count }).map((_, index) => (
          <span key={index} className="h-2.5 w-2.5 rounded-full bg-primary" />
        ))}
      </div>
    );
  }

  if (value === "N/A") {
    return <span className="text-sm text-neutral-400">N/A</span>;
  }

  return <span className="text-sm font-medium text-neutral-700">{value}</span>;
}

export function MaterialComparisonTable() {
  return (
    <section className="mt-8" aria-labelledby="material-comparison-heading">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-5">
          <h2
            id="material-comparison-heading"
            className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl"
          >
            Material comparison
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-white">
                <th
                  scope="col"
                  className="sticky left-0 z-20 min-w-[11rem] border-r border-neutral-200 bg-white px-4 py-4 text-left"
                  aria-hidden
                />
                {MATERIAL_COMPARISON_COLUMNS.map((column) => {
                  const href = LEARN_MORE_LINKS[column];

                  return (
                    <th
                      key={column}
                      scope="col"
                      className="min-w-[8.5rem] px-3 py-4 text-center font-semibold text-neutral-900"
                    >
                      {href ? (
                        <Link href={href} className="text-inherit no-underline hover:text-inherit hover:no-underline">
                          {column}
                        </Link>
                      ) : (
                        column
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {MATERIAL_COMPARISON_ROWS.map((row, index) => (
                <tr
                  key={row.attribute}
                  className={`border-b border-neutral-100 transition-colors hover:bg-primary/[0.03] ${
                    index % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                  }`}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-neutral-200 bg-inherit px-4 py-3.5 text-left font-medium text-neutral-900"
                  >
                    {row.attribute}
                  </th>
                  {MATERIAL_COMPARISON_COLUMNS.map((column) => (
                    <td key={`${row.attribute}-${column}`} className="px-3 py-3.5 text-center">
                      <RatingDots value={row.values[column] ?? ""} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-neutral-100 bg-white">
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-neutral-200 bg-inherit px-4 py-1.5"
                  aria-hidden
                />
                {MATERIAL_COMPARISON_COLUMNS.map((column) => (
                  <td key={`learn-more-${column}`} className="px-3 py-1.5 text-center">
                    {LEARN_MORE_LINKS[column] ? (
                      <Link
                        href={LEARN_MORE_LINKS[column]}
                        className="text-[11px] font-medium text-primary transition-colors hover:underline"
                      >
                        Learn more
                      </Link>
                    ) : null}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {RATING_LEVELS.map((level) => (
              <div key={level.symbol} className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: level.count }).map((_, index) => (
                    <span key={index} className="h-2.5 w-2.5 rounded-full bg-primary" />
                  ))}
                </div>
                <span className="text-sm text-neutral-700">{level.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
