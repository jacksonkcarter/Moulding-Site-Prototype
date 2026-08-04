import { PageContent } from "@/components/PageContent";

const TECHNICAL_DOCS = [
  {
    title: "Product data sheet",
    description: "Product specifications and performance data",
    pdfSrc: "/forms-literature/product-data-sheet.pdf",
  },
  {
    title: "MSDS",
    description: "Material safety data sheet",
    pdfSrc: "/forms-literature/msds.pdf",
  },
  {
    title: "LEED information",
    description: "LEED contribution details",
    pdfSrc: "/forms-literature/leed-information.pdf",
  },
  {
    title: "Prop 65",
    description: "California Proposition 65 notice",
    pdfSrc: "/forms-literature/prop-65.pdf",
  },
] as const;

export default function TechnicalDataPage() {
  return (
    <PageContent>
      <div className="mx-auto w-full max-w-2xl not-prose">
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          {TECHNICAL_DOCS.map((doc) => (
            <li key={doc.pdfSrc}>
              <a
                href={doc.pdfSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-red-50/40 focus:outline-none focus-visible:bg-red-50/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9f1b20]"
              >
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight text-neutral-900 transition group-hover:text-[#9f1b20]">
                    {doc.title}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-500">{doc.description}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-400 transition group-hover:text-[#9f1b20]">
                  PDF
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageContent>
  );
}
