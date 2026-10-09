import { ContactLink } from "@/components/ContactLink";
import { OrderingTips } from "@/components/OrderingTips";
import { PageContent } from "@/components/PageContent";

const EASY_POINTS = [
  {
    title: "Send us the details",
    body: "Share the profile, dimensions, application, and quantity. We’ll confirm stock, existing molds, or a Made-to-Match path and get you a clear next step.",
  },
  {
    title: "We handle the rest",
    body: "From in-stock ship-outs to custom tooling, Carter Millwork covers the manufacturing so you can focus on your customers and jobs.",
  },
  {
    title: "Same quality, two coasts",
    body: "Flex Trim East and West keep lead times practical nationwide, with local support when your customers need answers.",
  },
] as const;

export default function DealersDistributorsPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl not-prose">
        <header className="grid items-start gap-6 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-12">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Grow your moulding business without the fabrication headache
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Dealers and distributors choose Flex Trim™ because ordering is straightforward: send us what your
            customer needs, and we manufacture durable, consistent polyurethane moulding that installs like wood and
            outperforms bent lumber on curves.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="easy-heading">
          <h2
            id="easy-heading"
            className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            We make it easy
          </h2>
          <ul className="mt-6 space-y-5">
            {EASY_POINTS.map((point) => (
              <li key={point.title} className="border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0">
                <p className="font-medium text-neutral-900">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 md:text-base">{point.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <OrderingTips />
        </div>

        <section className="mt-12 border-t border-neutral-200 pt-10 space-y-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
              Interested in becoming a dealer or distributor?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              We&apos;d like to hear from you.{" "}
              <ContactLink action="popover" className="font-medium text-primary hover:underline">
                Contact us
              </ContactLink>{" "}
              to discuss partnership opportunities and how Flex Trim™ fits your market.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
              Already a partner?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              Reach out to your inside sales representative, or{" "}
              <ContactLink action="popover" className="font-medium text-primary hover:underline">
                contact us
              </ContactLink>{" "}
              anytime for product questions, orders, and support.
            </p>
          </div>
        </section>
      </div>
    </PageContent>
  );
}
