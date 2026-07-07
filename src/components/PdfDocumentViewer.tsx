type PdfDocumentViewerProps = {
  title: string;
  pdfSrc: string;
  downloadName?: string;
  minimal?: boolean;
};

function pdfViewerHeight(extra = "0.5in") {
  return `calc(100vh - var(--header-offset) - var(--content-top-buffer) - 5rem + ${extra})`;
}

export function PdfViewerFrame({
  title,
  pdfSrc,
  heightExtra = "0.5in",
}: {
  title: string;
  pdfSrc: string;
  heightExtra?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
      <iframe
        src={pdfSrc}
        title={title}
        className="w-full bg-white"
        style={{ height: pdfViewerHeight(heightExtra) }}
      />
    </div>
  );
}

export function PdfDocumentViewer({ title, pdfSrc, downloadName, minimal = false }: PdfDocumentViewerProps) {
  if (minimal) {
    return (
      <div className="mx-auto w-full max-w-6xl not-prose">
        <PdfViewerFrame title={title} pdfSrc={pdfSrc} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl not-prose">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">Use the viewer below or download a copy to keep offline.</p>
        {downloadName ? (
          <a
            href={pdfSrc}
            download={downloadName}
            className="inline-flex items-center justify-center rounded-full border-2 border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Download PDF
          </a>
        ) : null}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
        <iframe src={pdfSrc} title={title} className="h-[min(82vh,920px)] w-full bg-white" />
      </div>
    </div>
  );
}
