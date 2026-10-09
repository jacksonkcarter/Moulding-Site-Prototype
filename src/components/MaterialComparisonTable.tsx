import Image from "next/image";
import Link from "next/link";
import {
  MATERIAL_COMPARISON_COLUMNS,
  MATERIAL_COMPARISON_ROWS,
} from "@/data/material-comparison";

import flexTrimLogo from "../../Project_Info/Website-Logos/Flex-Trim.jpg";
import machinableS4SLogo from "../../Project_Info/Website-Logos/Machinable-S4S.png";
import ultraFireFlexLogo from "../../Project_Info/Website-Logos/Ultra-Fire-Flex.png";
import ultraFlexLogo from "../../Project_Info/Website-Logos/Ultra-Flex.png";
import zzzFlexLogo from "../../Project_Info/Website-Logos/ZZZ-Flex.png";

const RATING_LEVELS = [
  { symbol: "O", label: "Basic", count: 1 },
  { symbol: "OO", label: "Standard", count: 2 },
  { symbol: "OOO", label: "Premium", count: 3 },
  { symbol: "OOOO", label: "Elite", count: 4 },
] as const;

const LEARN_MORE_LINKS: Partial<Record<(typeof MATERIAL_COMPARISON_COLUMNS)[number], string>> = {
  "Ultra-Fire Flex": "/product-info/ultra-fire-flex",
  "Machinable S4S": "/product-info/machinable-s4s",
};

const ROW_LINKS: Record<string, string> = {
  "Available as extended lengths": "/product-info/xtrulinear",
  Warranty: "/company-info/warranty",
};

const MATERIAL_COLUMN_LOGOS: Partial<
  Record<
    (typeof MATERIAL_COMPARISON_COLUMNS)[number],
    { src: typeof flexTrimLogo; alt: string; width?: string }
  >
> = {
  "Flex Trim": { src: flexTrimLogo, alt: "Flex Trim™ logo" },
  "Zzz Flex": { src: zzzFlexLogo, alt: "Zzz Flex logo", width: "6.25rem" },
  "Ultra-Flex": { src: ultraFlexLogo, alt: "Ultra-Flex logo" },
  "Ultra-Fire Flex": { src: ultraFireFlexLogo, alt: "Ultra-Fire Flex logo", width: "8rem" },
  "Machinable S4S": { src: machinableS4SLogo, alt: "Machinable S4S logo", width: "4.75rem" },
};

const LOGO_DISPLAY_WIDTH = "6.75rem";

function ColumnHeader({
  column,
  href,
}: {
  column: (typeof MATERIAL_COMPARISON_COLUMNS)[number];
  href?: string;
}) {
  const logo = MATERIAL_COLUMN_LOGOS[column];

  if (logo) {
    const displayWidth = logo.width ?? LOGO_DISPLAY_WIDTH;

    const image = (
      <span className="mx-auto flex w-full max-w-full items-center justify-center" style={{ maxWidth: displayWidth }}>
        <Image
          src={logo.src}
          alt={logo.alt}
          width={120}
          height={36}
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
        />
      </span>
    );

    if (href) {
      return (
        <Link href={href} className="mx-auto flex justify-center no-underline hover:opacity-80">
          {image}
        </Link>
      );
    }

    return <span className="mx-auto flex justify-center">{image}</span>;
  }

  if (href) {
    return (
      <Link href={href} className="text-inherit no-underline hover:text-inherit hover:no-underline">
        {column}
      </Link>
    );
  }

  return column;
}

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

  if (value === "X" || value === "x") {
    return (
      <span className="inline-flex items-center justify-center text-primary" aria-label="Yes">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  if (value === "N/A") {
    return <span className="text-sm text-neutral-400">N/A</span>;
  }

  return <span className="text-sm font-medium text-neutral-700">{value}</span>;
}

export function MaterialComparisonTable() {
  return (
    <section className="-mt-8" aria-labelledby="material-comparison-heading">
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
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-white">
                <th
                  scope="col"
                  className="sticky left-0 z-20 w-[8.5rem] border-r border-neutral-200 bg-white px-2 py-3 text-left sm:w-[9.5rem] sm:px-3"
                  aria-hidden
                />
                {MATERIAL_COMPARISON_COLUMNS.map((column) => {
                  const href = LEARN_MORE_LINKS[column];

                  return (
                    <th
                      key={column}
                      scope="col"
                      className="px-1.5 py-3 text-center font-semibold text-neutral-900 sm:px-2"
                    >
                      <ColumnHeader column={column} href={href} />
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
                    className="sticky left-0 z-10 border-r border-neutral-200 bg-inherit px-2 py-3 text-left text-xs font-medium text-neutral-900 sm:px-3 sm:text-sm"
                  >
                    {ROW_LINKS[row.attribute] ? (
                      <Link
                        href={ROW_LINKS[row.attribute]}
                        className="text-primary transition-colors hover:underline"
                      >
                        {row.attribute}
                      </Link>
                    ) : (
                      row.attribute
                    )}
                  </th>
                  {MATERIAL_COMPARISON_COLUMNS.map((column) => (
                    <td key={`${row.attribute}-${column}`} className="px-1.5 py-3 text-center sm:px-2">
                      <RatingDots value={row.values[column] ?? ""} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-neutral-100 bg-white">
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-neutral-200 bg-inherit px-2 py-1.5 sm:px-3"
                  aria-hidden
                />
                {MATERIAL_COMPARISON_COLUMNS.map((column) => (
                  <td key={`learn-more-${column}`} className="px-1.5 py-1.5 text-center sm:px-2">
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
