import { PageContent } from "@/components/PageContent";
import { PdfViewerFrame } from "@/components/PdfDocumentViewer";

const ORDER_FORMS = [
  {
    title: "Quote & order form — Arc & straight",
    label: "Arc & straight",
    pdfSrc: `/resources/${encodeURIComponent("Carter Millwork Quote & Order Form - Arc & Straight.pdf")}`,
  },
  {
    title: "Quote & order form — Crown",
    label: "Crown",
    pdfSrc: `/resources/${encodeURIComponent("Carter Millwork Quote & Order Form - Crown.pdf")}`,
  },
] as const;

export default function FormsPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto grid w-full max-w-[96rem] grid-cols-1 gap-4 not-prose lg:grid-cols-2 lg:gap-6">
        {ORDER_FORMS.map((form) => (
          <section key={form.pdfSrc} aria-label={form.title}>
            <p className="mb-2 text-center text-sm font-semibold text-neutral-700">{form.label}</p>
            <PdfViewerFrame title={form.title} pdfSrc={form.pdfSrc} compact />
          </section>
        ))}
      </div>
    </PageContent>
  );
}
