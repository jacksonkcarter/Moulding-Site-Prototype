import Image from "next/image";
import { PageContent } from "@/components/PageContent";
import { RegionalContacts } from "@/components/RegionalContacts";

const MAP_LEGEND = [
  {
    color: "#9f1b20",
    border: false,
    label: "Served by both NC and UT facilities",
  },
  {
    color: "#ffffff",
    border: true,
    label: "Served by NC facility",
  },
  {
    color: "#bdbdbd",
    border: false,
    label: "Served by UT facility",
  },
] as const;

/** Pixel coords from Paint on the 4140×2614 map; tip of pin lands on these points. */
const MAP_PINS = [
  {
    id: "nc",
    label: "Flex Trim East — Lexington, NC",
    leftPct: (3398 / 4140) * 100,
    topPct: (1424 / 2614) * 100,
  },
  {
    id: "ut",
    label: "Flex Trim West — Provo, UT",
    leftPct: (1002 / 4140) * 100,
    topPct: (1029 / 2614) * 100,
  },
] as const;

function MapPin({ label }: { label: string }) {
  return (
    <span className="relative block h-7 w-5 drop-shadow-sm sm:h-8 sm:w-6" title={label}>
      <svg viewBox="0 0 24 36" className="h-full w-full" aria-hidden>
        <path
          d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
          fill="#9f1b20"
        />
        <circle cx="12" cy="12" r="4.5" fill="#fff" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function LocationsPage() {
  return (
    <PageContent title="Locations" fullWidth>
      <div className="mx-auto w-full max-w-6xl space-y-10 text-neutral-600 not-prose">
        <section>
          <p className="text-sm leading-relaxed md:text-base">
            Flex Trim™ operates facilities on both coasts: Flex Trim East in Lexington, North Carolina, and Flex Trim
            West in Provo, Utah. That lets us serve customers across the country with shorter lead times, local support,
            and the same high-quality flexible moulding wherever you build.
          </p>
        </section>

        <section aria-labelledby="coverage-map-heading">
          <h2
            id="coverage-map-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Service coverage by state
          </h2>

          <div className="relative mx-auto mt-6 aspect-[4140/2614] w-full max-w-[54.72rem] -translate-x-[1in]">
            <Image
              src="/company-info/state-vs-facility.png"
              alt="Map of U.S. states showing which Flex Trim facility serves each region"
              fill
              className="object-contain"
              sizes="(max-width: 1152px) 100vw, 1152px"
              priority
            />
            {MAP_PINS.map((pin) => (
              <div
                key={pin.id}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
                style={{ left: `${pin.leftPct}%`, top: `${pin.topPct}%` }}
              >
                <MapPin label={pin.label} />
              </div>
            ))}
            <ul className="absolute top-1/2 right-[-16.875rem] z-10 flex w-[min(42%,14rem)] -translate-y-1/2 flex-col gap-3 sm:right-[-15.8125rem] sm:w-[min(38%,16rem)] sm:gap-4 md:right-[-14.6875rem] md:w-64">
              {MAP_LEGEND.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-neutral-800">
                  <span
                    className="mt-0.5 h-6 w-6 shrink-0 rounded-sm sm:h-7 sm:w-7"
                    style={{
                      backgroundColor: item.color,
                      border: item.border ? "1px solid #a3a3a3" : undefined,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
                    }}
                    aria-hidden
                  />
                  <span className="text-sm font-medium leading-snug sm:text-base">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="facility-details-heading">
          <h2
            id="facility-details-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Facility details
          </h2>
          <div className="mt-6">
            <RegionalContacts sideBySide />
          </div>
        </section>
      </div>
    </PageContent>
  );
}
