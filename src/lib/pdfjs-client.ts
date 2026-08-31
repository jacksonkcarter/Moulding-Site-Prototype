import type { PDFDocumentProxy } from "pdfjs-dist";

let workerConfigured = false;

export async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");

  if (!workerConfigured && typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    workerConfigured = true;
  }

  return pdfjs;
}

/** Safely tear down a pdf.js document (no-op if already destroyed or invalid). */
export function destroyPdfDocument(doc: PDFDocumentProxy | null | undefined) {
  if (!doc || typeof doc.destroy !== "function") return;
  try {
    doc.destroy();
  } catch {
    // Document may already be destroyed during rapid step/file changes.
  }
}

export type { PDFDocumentProxy };
