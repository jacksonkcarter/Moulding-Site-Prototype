"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { destroyPdfDocument, openPdfDocument, type PDFDocumentProxy } from "@/lib/pdfjs-client";
import {
  selectionPixelsToPdfPoints,
  type PdfCropExport,
  type PdfSelectionRect,
} from "@/lib/pdf-selection";
import { LoadingState } from "@/components/LoadingSpinner";

export type PdfPageSelectorHandle = {
  exportCrop: () => PdfCropExport | null;
  exportCropAsync: () => Promise<PdfCropExport | null>;
  getPageNumber: () => number;
};

type PdfPageSelectorProps = {
  file: File;
  selection: PdfSelectionRect | null;
  onSelectionChange: (rect: PdfSelectionRect | null) => void;
  minSelectionPx?: number;
  className?: string;
};

export const PdfPageSelector = forwardRef<PdfPageSelectorHandle, PdfPageSelectorProps>(
  function PdfPageSelector(
    {
      file,
      selection,
      onSelectionChange,
      minSelectionPx = 12,
      className = "",
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pdfRef = useRef<PDFDocumentProxy | null>(null);
    const displayScaleRef = useRef(1);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        exportCrop() {
          const canvas = canvasRef.current;
          if (!canvas || !selection || selection.width < minSelectionPx || selection.height < minSelectionPx) {
            return null;
          }

          const scaleX = canvas.width / canvas.clientWidth;
          const scaleY = canvas.height / canvas.clientHeight;
          const sourceX = Math.max(0, Math.floor(selection.x * scaleX));
          const sourceY = Math.max(0, Math.floor(selection.y * scaleY));
          const sourceW = Math.min(
            canvas.width - sourceX,
            Math.floor(selection.width * scaleX),
          );
          const sourceH = Math.min(
            canvas.height - sourceY,
            Math.floor(selection.height * scaleY),
          );
          if (sourceW <= 0 || sourceH <= 0) return null;

          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = sourceW;
          cropCanvas.height = sourceH;
          const context = cropCanvas.getContext("2d");
          if (!context) return null;

          context.drawImage(canvas, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

          const { widthPts, heightPts } = selectionPixelsToPdfPoints(
            sourceW,
            sourceH,
            displayScaleRef.current,
          );

          return {
            imageUrl: cropCanvas.toDataURL("image/png"),
            widthPts,
            heightPts,
            pageNumber,
          };
        },
        async exportCropAsync() {
          const canvas = canvasRef.current;
          const pdf = pdfRef.current;
          if (
            !canvas ||
            !pdf ||
            !selection ||
            selection.width < minSelectionPx ||
            selection.height < minSelectionPx
          ) {
            return null;
          }

          const scaleX = canvas.width / canvas.clientWidth;
          const scaleY = canvas.height / canvas.clientHeight;
          const sourceX = selection.x * scaleX;
          const sourceY = selection.y * scaleY;
          const sourceW = selection.width * scaleX;
          const sourceH = selection.height * scaleY;
          if (sourceW <= 0 || sourceH <= 0) return null;

          const exportScale = displayScaleRef.current * 2;
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: exportScale });
          const renderCanvas = document.createElement("canvas");
          renderCanvas.width = Math.floor(viewport.width);
          renderCanvas.height = Math.floor(viewport.height);
          const renderContext = renderCanvas.getContext("2d");
          if (!renderContext) return null;

          await page.render({
            canvas: renderCanvas,
            canvasContext: renderContext,
            viewport,
          }).promise;

          const ratio = exportScale / displayScaleRef.current;
          const cropX = Math.max(0, Math.floor(sourceX * ratio));
          const cropY = Math.max(0, Math.floor(sourceY * ratio));
          const cropW = Math.min(
            renderCanvas.width - cropX,
            Math.floor(sourceW * ratio),
          );
          const cropH = Math.min(
            renderCanvas.height - cropY,
            Math.floor(sourceH * ratio),
          );
          if (cropW <= 0 || cropH <= 0) return null;

          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = cropW;
          cropCanvas.height = cropH;
          const cropContext = cropCanvas.getContext("2d");
          if (!cropContext) return null;

          cropContext.drawImage(
            renderCanvas,
            cropX,
            cropY,
            cropW,
            cropH,
            0,
            0,
            cropW,
            cropH,
          );

          const { widthPts, heightPts } = selectionPixelsToPdfPoints(
            sourceW,
            sourceH,
            displayScaleRef.current,
          );

          return {
            imageUrl: cropCanvas.toDataURL("image/png"),
            widthPts,
            heightPts,
            pageNumber,
          };
        },
        getPageNumber() {
          return pageNumber;
        },
      }),
      [minSelectionPx, pageNumber, selection],
    );

    const renderPage = useCallback(async () => {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!pdf || !canvas || !container) return;

      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const availableHeight = container.clientHeight;
      const availableWidth = container.clientWidth;
      if (availableHeight <= 0 || availableWidth <= 0) return;

      const scale = Math.min(
        availableHeight / baseViewport.height,
        availableWidth / baseViewport.width,
      );
      displayScaleRef.current = scale;
      const viewport = page.getViewport({ scale });
      const context = canvas.getContext("2d");
      if (!context) return;

      const displayWidth = Math.floor(viewport.width);
      const displayHeight = Math.floor(viewport.height);

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      await page.render({ canvas, canvasContext: context, viewport }).promise;
    }, [pageNumber]);

    useEffect(() => {
      let cancelled = false;
      let loadingTask: { destroy: () => Promise<void> } | null = null;
      let loadedDoc: PDFDocumentProxy | null = null;

      async function loadPdf() {
        setLoading(true);
        setError(null);
        setPageNumber(1);

        const previous = pdfRef.current;
        pdfRef.current = null;
        destroyPdfDocument(previous);

        try {
          const data = new Uint8Array(await file.arrayBuffer());
          loadingTask = await openPdfDocument(data);
          const pdf = await loadingTask.promise;
          loadedDoc = pdf;

          if (cancelled) {
            destroyPdfDocument(pdf);
            return;
          }

          pdfRef.current = pdf;
          setNumPages(pdf.numPages);
          setLoading(false);
        } catch {
          if (!cancelled) {
            setError("Could not load this PDF. Try a different file.");
            setLoading(false);
          }
        }
      }

      void loadPdf();

      return () => {
        cancelled = true;
        void loadingTask?.destroy();
        const current = pdfRef.current;
        pdfRef.current = null;
        destroyPdfDocument(current);
        destroyPdfDocument(loadedDoc);
      };
    }, [file]);

    useEffect(() => {
      if (loading || error) return;
      void renderPage();
    }, [loading, error, renderPage]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
        void renderPage();
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, [renderPage]);

    function pointFromEvent(e: ReactPointerEvent<HTMLDivElement>) {
      const bounds = frameRef.current?.getBoundingClientRect();
      if (!bounds) return { x: 0, y: 0 };
      return {
        x: Math.min(Math.max(e.clientX - bounds.left, 0), bounds.width),
        y: Math.min(Math.max(e.clientY - bounds.top, 0), bounds.height),
      };
    }

    function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
      if (loading || error) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const start = pointFromEvent(e);
      dragStartRef.current = start;
      onSelectionChange({ x: start.x, y: start.y, width: 0, height: 0 });
    }

    function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
      if (!dragStartRef.current) return;
      const current = pointFromEvent(e);
      const x = Math.min(dragStartRef.current.x, current.x);
      const y = Math.min(dragStartRef.current.y, current.y);
      const width = Math.abs(current.x - dragStartRef.current.x);
      const height = Math.abs(current.y - dragStartRef.current.y);
      onSelectionChange({ x, y, width, height });
    }

    function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
      if (!dragStartRef.current) return;
      const current = pointFromEvent(e);
      const width = Math.abs(current.x - dragStartRef.current.x);
      const height = Math.abs(current.y - dragStartRef.current.y);
      dragStartRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (width < minSelectionPx || height < minSelectionPx) {
        onSelectionChange(null);
      }
    }

    function goToPage(next: number) {
      onSelectionChange(null);
      setPageNumber(next);
    }

    return (
      <div
        className={`flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 ${className}`}
      >
        <div
          ref={containerRef}
          className="flex min-h-0 flex-1 items-center justify-center p-2"
        >
          {loading ? (
            <LoadingState size="md" className="py-8" />
          ) : error ? (
            <p className="px-4 text-center text-sm text-primary">{error}</p>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div ref={frameRef} className="relative inline-block max-h-full max-w-full">
                <canvas ref={canvasRef} className="block max-h-full max-w-full" />
                <div
                  className="absolute inset-0 touch-none cursor-crosshair"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  {selection && selection.width > 0 && selection.height > 0 ? (
                    <div
                      className="absolute border-2 border-dashed border-primary bg-primary/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
                      style={{
                        left: selection.x,
                        top: selection.y,
                        width: selection.width,
                        height: selection.height,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {numPages > 1 ? (
          <div className="flex shrink-0 items-center justify-center gap-4 border-t border-neutral-200 px-4 py-3">
            <button
              type="button"
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1 || loading}
              className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous page
            </button>
            <p className="text-sm text-neutral-600">
              Page {pageNumber} of {numPages}
            </p>
            <button
              type="button"
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber >= numPages || loading}
              className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next page
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);
