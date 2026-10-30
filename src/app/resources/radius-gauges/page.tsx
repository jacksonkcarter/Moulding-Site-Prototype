import { PageContent } from "@/components/PageContent";
import { PdfViewerFrame } from "@/components/PdfDocumentViewer";

const RADIUS_GAUGES = [
  {
    title: "Radius gauge",
    label: "Radius gauge",
    pdfSrc: `/resources/${encodeURIComponent("Radius Gauge.pdf")}`,
  },
  {
    title: "Bullnose corner radius gauge",
    label: "Bullnose corner",
    pdfSrc: `/resources/${encodeURIComponent("Bullnose Corner Radius Gauge.pdf")}`,
  },
] as const;

export default function RadiusGaugesPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-[96rem] space-y-6 not-prose">
        <p className="text-center text-sm leading-relaxed text-neutral-600 md:text-base">
          For small radii where measuring is difficult, try out our printable radius gauges. Be sure to print at
          &quot;Actual&quot; or &quot;100%&quot; scale.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {RADIUS_GAUGES.map((gauge) => (
            <section key={gauge.pdfSrc} aria-label={gauge.title}>
              <p className="mb-2 text-center text-sm font-semibold text-neutral-700">{gauge.label}</p>
              <PdfViewerFrame title={gauge.title} pdfSrc={gauge.pdfSrc} compact />
            </section>
          ))}
        </div>
      </div>
    </PageContent>
  );
}
