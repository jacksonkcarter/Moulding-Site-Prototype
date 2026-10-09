type PdfDocumentViewerProps = {
  title: string;
  pdfSrc: string;
  downloadName?: string;
  minimal?: boolean;
};

/** Default (+0.5in baked in as −2rem). Compact uses −5rem (no extra). */
const PDF_VIEWER_HEIGHT =
  "calc(100vh - var(--header-offset) - var(--content-top-buffer) - 2rem)";
const PDF_VIEWER_HEIGHT_COMPACT =
  "calc(100vh - var(--header-offset) - var(--content-top-buffer) - 5rem)";

export function PdfViewerFrame({
  title,
  pdfSrc,
  compact = false,
}: {
  title: string;
  pdfSrc: string;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
      <iframe
        src={pdfSrc}
        title={title}
        className="w-full bg-white"
        style={{ height: compact ? PDF_VIEWER_HEIGHT_COMPACT : PDF_VIEWER_HEIGHT }}
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
