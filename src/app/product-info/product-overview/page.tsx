import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { ProductApplicationShowcase } from "@/components/ProductApplicationShowcase";

const NEXT_STEPS = [
  {
    title: "Material details",
    body: "Compare Flex Trim™ and specialized upgrades so you can specify the right formulation for the job.",
    href: "/product-info/material-details",
    cta: "Explore materials",
  },
  {
    title: "Browse stock items",
    body: "Shop 250+ ready-to-ship profiles when you need common shapes without custom tooling.",
    href: "/product-info/browse-stock-items",
    cta: "Shop stock",
  },
  {
    title: "Browse select profiles",
    body: "Search our growing library of 40,000+ tooled profiles for custom applications.",
    href: "/product-info/browse-select-profiles",
    cta: "Browse profiles",
  },
  {
    title: "Replicate custom profiles",
    body: "Match an existing or historic moulding with our Made-to-Match process.",
    href: "/product-info/replicate-custom-profiles",
    cta: "Learn about matching",
  },
] as const;

export default function ProductOverviewPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <ProductApplicationShowcase />

        <section
          className="mt-20 border-t border-neutral-200 pt-12 sm:mt-24 sm:pt-14"
          aria-labelledby="continue-exploring-heading"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="continue-exploring-heading"
              className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
            >
              Continue exploring products
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
              From materials to stock, tooled profiles, and custom matching—here&apos;s where to go next.
            </p>
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {NEXT_STEPS.map((step) => (
              <li key={step.href} className="flex min-w-0 flex-col">
                <p className="font-medium text-neutral-900">{step.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-5 inline-flex w-fit items-center justify-center rounded-full border-2 border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {step.cta}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageContent>
  );
}
