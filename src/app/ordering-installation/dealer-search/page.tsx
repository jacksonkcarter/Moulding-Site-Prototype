import { ContactLink } from "@/components/ContactLink";
import { DealerMapWrapper } from "@/components/DealerMapWrapper";
import { ONLINE_DEALERS } from "@/data/online-dealers";

export default function DealerSearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-16 sm:px-6">
        <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 text-center">
          Find a dealer
        </h1>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-3 lg:gap-8">
          <DealerMapWrapper />

          <aside className="flex min-w-0 flex-col gap-5 lg:col-span-1">
            <section id="online-dealers" className="scroll-mt-20" aria-labelledby="online-dealers-heading">
              <h2
                id="online-dealers-heading"
                className="font-sans text-lg font-medium tracking-tight text-neutral-900 md:text-xl"
              >
                Online dealers
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Prefer to order online? Flex Trim™ is also available through these retailers:
              </p>
              <ul className="mt-3 space-y-2.5">
                {ONLINE_DEALERS.map((dealer) => (
                  <li key={dealer.href}>
                    <a
                      href={dealer.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {dealer.label}
                    </a>
                    <p className="text-xs leading-snug text-neutral-600 sm:text-sm">{dealer.details}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              id="international-dealers"
              className="scroll-mt-20 border-t border-neutral-200 pt-5"
              aria-labelledby="international-dealers-heading"
            >
              <h2
                id="international-dealers-heading"
                className="font-sans text-lg font-medium tracking-tight text-neutral-900 md:text-xl"
              >
                Outside the United States?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Looking for a dealer outside the U.S.?{" "}
                <ContactLink action="popover" className="font-medium text-primary hover:underline">
                  Contact us
                </ContactLink>{" "}
                and we&apos;ll help you find the right out-of-country dealer or ordering option.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
