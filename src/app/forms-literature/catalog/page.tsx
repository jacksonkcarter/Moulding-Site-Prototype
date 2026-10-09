import { PageContent } from "@/components/PageContent";
import { PdfViewerFrame } from "@/components/PdfDocumentViewer";
import { ContactLink } from "@/components/ContactLink";

const CATALOG_PDF = "/forms-literature/carter-millwork-catalog.pdf";

export default function CatalogPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl not-prose">
        <p className="mb-4 text-center text-sm leading-relaxed text-neutral-600 md:text-base">
          Looking for something specific? This catalog features just a fraction of our available profiles.{" "}
          <ContactLink action="popover" className="font-medium text-primary hover:underline">
            Reach out to our team
          </ContactLink>
          , and we&apos;ll track down exactly what you need.
        </p>
        <PdfViewerFrame
          title="Carter Millwork catalog"
          pdfSrc={CATALOG_PDF}
          compact
        />
      </div>
    </PageContent>
  );
}
