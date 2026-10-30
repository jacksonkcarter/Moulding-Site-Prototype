import { PageContent } from "@/components/PageContent";
import { PdfDocumentViewer } from "@/components/PdfDocumentViewer";

const STOCK_LIST_PDF = `/resources/${encodeURIComponent("Carter Millwork Stock List.pdf")}`;

export default function StockListPage() {
  return (
    <PageContent fullWidth>
      <PdfDocumentViewer
        title="Carter Millwork stock list"
        pdfSrc={STOCK_LIST_PDF}
        minimal
      />
    </PageContent>
  );
}
