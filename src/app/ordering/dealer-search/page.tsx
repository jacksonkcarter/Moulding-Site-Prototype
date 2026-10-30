import { ContactLink } from "@/components/ContactLink";
import { ContactPhoneLink } from "@/components/ContactPhoneLink";
import { ONLINE_DEALERS } from "@/data/online-dealers";

export default function DealerSearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[60rem] px-4 pt-5 pb-16 sm:px-6">
        <h1 className="text-center font-sans text-3xl font-medium tracking-tight text-neutral-900">
          Find a dealer
        </h1>

        <section id="local-dealers" className="mt-12 scroll-mt-20" aria-labelledby="local-dealers-heading">
          <h2
            id="local-dealers-heading"
            className="font-sans text-xl font-medium tracking-tight text-neutral-900 md:text-2xl"
          >
            Local dealers
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              Contact us
            </ContactLink>{" "}
            to find your nearest Flex Trim™ dealer or distributor.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
            Interested in becoming a dealer?{" "}
            <ContactPhoneLink className="font-medium text-primary hover:underline">
              Give us a call
            </ContactPhoneLink>
            . We&apos;ll walk you through territory availability, product support, and how to get
            started with Flex Trim™.
          </p>
        </section>

        <section id="online-dealers" className="mt-12 scroll-mt-20" aria-labelledby="online-dealers-heading">
          <h2
            id="online-dealers-heading"
            className="font-sans text-xl font-medium tracking-tight text-neutral-900 md:text-2xl"
          >
            Online dealers
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
            Prefer to order online? Flex Trim™ is also available through these retailers:
          </p>
          <ul className="mt-4 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
            {ONLINE_DEALERS.map((dealer) => (
              <li key={dealer.href}>
                <a
                  href={dealer.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline md:text-base"
                >
                  {dealer.label}
                </a>
                <p className="text-sm leading-snug text-neutral-600">{dealer.details}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="international-dealers"
          className="mt-12 scroll-mt-20"
          aria-labelledby="international-dealers-heading"
        >
          <h2
            id="international-dealers-heading"
            className="font-sans text-xl font-medium tracking-tight text-neutral-900 md:text-2xl"
          >
            Outside the United States?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
            Looking for a dealer outside the U.S.?{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              Contact us
            </ContactLink>{" "}
            and we&apos;ll help you find the right out-of-country dealer or ordering option.
          </p>
        </section>
      </div>
    </main>
  );
}
