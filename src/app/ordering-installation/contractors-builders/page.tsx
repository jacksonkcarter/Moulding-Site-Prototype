import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { OrderingTips } from "@/components/OrderingTips";
import { PageContent } from "@/components/PageContent";

const JOBSITE_POINTS = [
  {
    title: "Installs like wood",
    body: "Cut, nail, and glue with standard tools. Pin nails and polyurethane-compatible adhesive (such as PL Premium Max) hold best—skip staples and wood glue.",
  },
  {
    title: "Built for the field",
    body: "Flexible enough for on-site adjustments when the radius or fit needs a tweak—without sending the piece back to the shop.",
  },
  {
    title: "Finish after install",
    body: "Paint or gel-stain once the moulding is in place so finishes don’t crack when the piece flexes. Primer is optional for paint.",
  },
] as const;

const PRODUCT_PATHS = [
  {
    label: "Shop stock items",
    href: "/product-info/browse-stock-items",
    detail: "250+ profiles ready to ship",
  },
  {
    label: "Browse select profiles",
    href: "/product-info/browse-select-profiles",
    detail: "40,000+ tooled shapes",
  },
  {
    label: "Replicate a profile",
    href: "/product-info/replicate-custom-profiles",
    detail: "Match existing or historic trim",
  },
] as const;

export default function ContractorsBuildersPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl not-prose">
        <header className="grid items-start gap-6 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-12">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Radius trim that keeps the job moving
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Flex Trim™ replaces steam-bending and kerf-cutting with flexible polyurethane moulding that follows the
            arch or curve—putting your crew ahead of schedule when it matters most, and typically saving about 70%
            versus traditional machined wood millwork. Stock when you need speed, custom when you need an exact match.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="jobsite-heading">
          <h2
            id="jobsite-heading"
            className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            What contractors care about on site
          </h2>
          <ul className="mt-6 space-y-5">
            {JOBSITE_POINTS.map((point) => (
              <li key={point.title} className="border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0">
                <p className="font-medium text-neutral-900">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 md:text-base">{point.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-neutral-700 md:text-base">
            Full prep, machining, fastening, and finishing steps are in the{" "}
            <Link
              href="/ordering-installation/installation-guide"
              className="font-medium text-primary hover:underline"
            >
              installation guide
            </Link>
            , including field videos.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="source-heading">
          <h2
            id="source-heading"
            className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Source the right profile
          </h2>
          <ul className="mt-6 space-y-3 text-sm md:text-base">
            {PRODUCT_PATHS.map((path) => (
              <li key={path.href}>
                <Link href={path.href} className="font-medium text-primary hover:underline">
                  {path.label}
                </Link>
                <span className="text-neutral-600"> — {path.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <OrderingTips />
        </div>

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Where to buy
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
            Purchase through a Flex Trim™ dealer near you. Use our{" "}
            <Link
              href="/ordering-installation/dealer-search"
              className="font-medium text-primary hover:underline"
            >
              dealer search
            </Link>{" "}
            to find locations by zip code. You&apos;re also welcome to{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              reach out to our team
            </ContactLink>{" "}
            anytime to learn more about products, materials, or installation.
          </p>
        </section>
      </div>
    </PageContent>
  );
}
