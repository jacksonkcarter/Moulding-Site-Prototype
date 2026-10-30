import { PageContent } from "@/components/PageContent";
import { PdfDocumentViewer } from "@/components/PdfDocumentViewer";

const BROCHURE_PDF = `/resources/${encodeURIComponent("Carter Millwork Brochure.pdf")}`;

export default function BrochurePage() {
  return (
    <PageContent fullWidth>
      <PdfDocumentViewer
        title="Carter Millwork brochure"
        pdfSrc={BROCHURE_PDF}
        minimal
      />
    </PageContent>
  );
}
