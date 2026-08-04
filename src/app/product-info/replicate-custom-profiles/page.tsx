import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";

const LEAD_TIMES = [
  {
    label: "In stock",
    detail: "Usually ships within 24 hours of receiving your order",
  },
  {
    label: "Existing mold",
    detail: "Most custom orders ship within 2 weeks or less",
  },
  {
    label: "New mold",
    detail: "Most custom orders ship within 3 weeks or less",
  },
] as const;

export default function ReplicateCustomProfilesPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-12">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Replicate custom profiles
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Our catalog represents only a fraction of what we can produce. If you can&apos;t find the profile you need,
            send us a tracing and we&apos;ll determine whether we already have the product or mold in stock.
          </p>
        </div>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-neutral-700 md:text-base">
          <p>
            Including the company that manufactured or supplied the original wood moulding—along with the
            profile&apos;s thickness and width—helps us make the best match. In-stock products usually ship within 24
            hours of receiving an order.
          </p>
          <p>
            If we don&apos;t have the style you need on hand, we can recreate it through our{" "}
            <strong className="font-semibold text-neutral-900">Made-to-Match</strong> process. We need just two 7&apos;
            pieces of your existing moulding to ensure an exact match. Our mold technology reproduces both the shape
            and the wood grain of your sample—from simple profiles to highly intricate designs.
          </p>
          <p>
            That precision is why Carter Millwork was chosen to replicate intricate 100-year-old mouldings and accents
            for the Turkish Embassy in Washington, D.C.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {LEAD_TIMES.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-neutral-700 md:text-base">
          Prefer to talk it through first?{" "}
          <ContactLink action="popover" className="font-medium text-primary hover:underline">
            Reach out to our team
          </ContactLink>
          , or{" "}
          <Link href="/quote-request" className="font-medium text-primary hover:underline">
            start a quote request
          </Link>
          .
        </p>
      </div>
    </PageContent>
  );
}
