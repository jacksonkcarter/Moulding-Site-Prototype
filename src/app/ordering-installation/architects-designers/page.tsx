import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { OrderingTips } from "@/components/OrderingTips";
import { PageContent } from "@/components/PageContent";

const PRODUCT_PATHS = [
  {
    title: "Stock items",
    body: "250+ ready-to-ship profiles for common radius and curved applications.",
    href: "/product-info/browse-stock-items",
    cta: "Browse stock",
  },
  {
    title: "Existing custom profiles",
    body: "Search a growing library of 40,000+ profiles ready for custom applications.",
    href: "/product-info/browse-select-profiles",
    cta: "Browse profiles",
  },
  {
    title: "Made-to-Match",
    body: "Send a tracing or sample—we can replicate virtually any wood profile.",
    href: "/product-info/replicate-custom-profiles",
    cta: "Learn about matching",
  },
] as const;

export default function ArchitectsDesignersPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl not-prose">
        <header className="grid items-start gap-6 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-12">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Specify curves without the compromise
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Flex Trim™ by Carter Millwork delivers the look of custom wood millwork for arches, radius walls, and
            complex transitions—typically at about 70% less than traditional machined wood millwork, with shorter lead
            times than bent wood. Paint-grade or stainable, interior or exterior, with the consistency your drawings
            demand.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="specify-paths-heading">
          <h2
            id="specify-paths-heading"
            className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Three ways to match your design
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {PRODUCT_PATHS.map((path) => (
              <li key={path.href} className="min-w-0">
                <p className="font-medium text-neutral-900">{path.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{path.body}</p>
                <Link href={path.href} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                  {path.cta}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="install-overview-heading">
          <h2
            id="install-overview-heading"
            className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Installation at a glance
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
            Flexible moulding cuts and fastens much like wood. Warm it for maximum pliability, use polyurethane-compatible
            adhesive, and finish after installation. For detailing and field guidance, see our{" "}
            <Link
              href="/ordering-installation/installation-guide"
              className="font-medium text-primary hover:underline"
            >
              installation guide
            </Link>
            .
          </p>
        </section>

        <div className="mt-12">
          <OrderingTips />
        </div>

        <section className="mt-12 border-t border-neutral-200 pt-10 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Talk through a specification
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Reach out directly to learn more about Flex Trim™ materials, profile matching, and ordering for your
            next project.
          </p>
          <ContactLink
            action="popover"
            className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Contact our team
          </ContactLink>
        </section>
      </div>
    </PageContent>
  );
}
