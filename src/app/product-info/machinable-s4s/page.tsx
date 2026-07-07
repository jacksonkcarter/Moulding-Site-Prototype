import Image from "next/image";
import Link from "next/link";
import { MachinableBenefitsGrid } from "@/components/MachinableBenefitsGrid";
import { PageContent } from "@/components/PageContent";

const SPECIFICATIONS = [
  { label: "Thickness", value: '1/2" to 2"' },
  { label: "Width", value: '1-3/4" to 16"' },
  { label: "Length", value: "8' to 12'" },
] as const;

const PRODUCT_NOTES = [
  {
    title: "Finish",
    description: "Paint grade material only.",
  },
  {
    title: "Application",
    description:
      "Designed exclusively for short, straight-run applications. Cannot be used for arched casing or radius crown.",
  },
  {
    title: "Origin",
    description: "Proudly manufactured in our UT facility.",
  },
] as const;

export default function MachinableS4SPage() {
  return (
    <PageContent title="Machinable S4S" fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
          <h2 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Mill your own flexible profiles using your existing knives
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Engineered for ultimate versatility, this machinable flexible moulding stock shares the premium
            performance of our Ultra-Flex formulation, but is specifically designed to be milled using your
            conventional woodworking equipment. Treat it just like real wood. Run it through moulders, shapers, and
            routers using the traditional woodworking practices that you know best.
          </p>
        </div>

        <MachinableBenefitsGrid />

        <section className="mt-14" aria-labelledby="specifications-heading">
          <h2
            id="specifications-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Standard specifications
          </h2>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-8 lg:gap-10">
            <div className="relative mx-auto aspect-[1201/300] w-full max-w-lg shrink-0 md:mx-0 md:max-w-none md:w-[70%] lg:w-[76%]">
              <Image
                src="/product-info/machinable-s4s.jpg"
                alt="Machinable S4S flexible moulding stock"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 512px, 800px"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {SPECIFICATIONS.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-neutral-500">{spec.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="product-notes-heading">
          <h2
            id="product-notes-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Product notes
          </h2>
          <ul className="mt-6 space-y-3">
            {PRODUCT_NOTES.map((note) => (
              <li
                key={note.title}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-primary">{note.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{note.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Need dimensions outside our standard range?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            We are here to help you find the right fit for your build. Contact our team to explore custom sizing
            alternatives for your specific architectural needs.
          </p>
          <Link
            href="/contact-us"
            className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
          >
            Contact our team
          </Link>
        </section>
      </div>
    </PageContent>
  );
}
