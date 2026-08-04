import Image from "next/image";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";
import ultraFireFlexLogo from "../../../../Project_Info/Website-Logos/Ultra-Fire-Flex.png";

const KEY_BENEFITS = [
  {
    title: "Commercial fire performance",
    description:
      "Formulated for projects that need elevated fire performance, helping you meet commercial specifications without giving up the look of traditional moulding.",
  },
  {
    title: "Tested to ASTM E84",
    description:
      "Ultra-Fire Flex carries Class B flame-spread performance per ASTM E84 testing—ideal when your plans call for documented fire-rated trim options.",
  },
  {
    title: "Lightweight Ultra-Flex foundation",
    description:
      "Built on our lightweight syntactic polyurethane platform, it stays easier to handle on large profiles and overhead installs while delivering durable indoor and outdoor performance.",
  },
] as const;

const PRODUCT_NOTES = [
  {
    title: "Finish",
    description: "Paint-ready surface for a clean commercial finish.",
  },
  {
    title: "Application",
    description:
      "Best suited for commercial interiors and exteriors where fire performance is part of the specification conversation.",
  },
  {
    title: "Origin",
    description: "Proudly manufactured exclusively at our Utah facility.",
  },
  {
    title: "Warranty",
    description: "1-year warranty.",
  },
] as const;

const DOCUMENTS = [
  {
    title: "Product data sheet",
    description: "Specifications and performance details",
    href: "/product-info/ultra-fire-flex-product-data-sheet.pdf",
  },
  {
    title: "ASTM E84 Class B report",
    description: "Fire test documentation",
    href: "/product-info/ultra-fire-flex-astm-e84.pdf",
  },
] as const;

export default function UltraFireFlexPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-center">
          <Image
            src={ultraFireFlexLogo}
            alt="Ultra-Fire Flex"
            width={560}
            height={160}
            className="h-auto w-[18rem] sm:w-[22rem] md:w-[26rem]"
            priority
          />
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
          <h2 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Flexible moulding built for commercial fire ratings
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            When a project demands more than standard flexible moulding, Ultra-Fire Flex delivers the architectural
            finish you expect with elevated fire performance for commercial builds. Our product specialists can help
            you confirm the right formulation for your application and specification requirements.
          </p>
        </div>

        <section className="mt-14" aria-labelledby="key-benefits-heading">
          <h2
            id="key-benefits-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Key benefits
          </h2>
          <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-3">
            {KEY_BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-white to-neutral-50 p-5 shadow-sm sm:p-6"
              >
                <div className="mb-3 h-1 w-8 rounded-full bg-primary" />
                <h3 className="text-sm font-semibold text-neutral-900 md:text-base">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{benefit.description}</p>
              </li>
            ))}
          </ul>
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

        <section className="mt-14" aria-labelledby="documents-heading">
          <h2
            id="documents-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Technical documents
          </h2>
          <ul className="mx-auto mt-6 max-w-2xl divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            {DOCUMENTS.map((doc) => (
              <li key={doc.href}>
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-red-50/40"
                >
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight text-neutral-900 transition group-hover:text-primary">
                      {doc.title}
                    </p>
                    <p className="mt-0.5 text-sm text-neutral-500">{doc.description}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-400 transition group-hover:text-primary">
                    PDF
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Need help matching a fire-rated specification?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Our team can help you select the right Ultra-Fire Flex option for your commercial application and project
            requirements.
          </p>
          <ContactLink action="popover" className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto">
            Contact our team
          </ContactLink>
        </section>
      </div>
    </PageContent>
  );
}
