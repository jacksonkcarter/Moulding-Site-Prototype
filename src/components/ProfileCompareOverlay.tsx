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
import { PDFDocument } from "pdf-lib";
import { destroyPdfDocument, openPdfDocument, type PDFDocumentProxy } from "@/lib/pdfjs-client";
import { pdfPointsToDisplayPixels } from "@/lib/pdf-selection";
import { LoadingState } from "@/components/LoadingSpinner";

type OverlayState = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

type ProfileCompareOverlayProps = {
  referenceOutlinePdfUrl: string;
  cropImageUrl: string;
  cropWidthPts: number;
  cropHeightPts: number;
  flipH: boolean;
  flipV: boolean;
  rotation: number;
  onRotationChange: (rotation: number) => void;
  hideBoundingBox?: boolean;
  className?: string;
};

export type ProfileCompareOverlayHandle = {
  saveCompositePdf: (filename?: string) => Promise<boolean>;
  printComposite: () => Promise<boolean>;
};

type DragState = {
  mode: "move" | "rotate";
  pointerId: number;
  startX: number;
  startY: number;
  startAngle: number;
  startRotation: number;
  startOverlay: OverlayState;
};

const ROTATION_HANDLE_OFFSET = 32;
const EXPORT_TARGET_WIDTH = 2000;

function angleFromCenter(centerX: number, centerY: number, x: number, y: number) {
  return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image load failed"));
    image.src = src;
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("png encode failed"));
    }, "image/png");
  });
}

export const ProfileCompareOverlay = forwardRef<
  ProfileCompareOverlayHandle,
  ProfileCompareOverlayProps
>(function ProfileCompareOverlay(
  {
    referenceOutlinePdfUrl,
    cropImageUrl,
    cropWidthPts,
    cropHeightPts,
    flipH,
    flipV,
    rotation,
    onRotationChange,
    hideBoundingBox = false,
    className = "",
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const overlayRef = useRef<OverlayState | null>(null);
  const displayScaleRef = useRef(1);
  const flipHRef = useRef(flipH);
  const flipVRef = useRef(flipV);
  const rotationRef = useRef(rotation);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [outlineReady, setOutlineReady] = useState(false);

  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);

  useEffect(() => {
    flipHRef.current = flipH;
  }, [flipH]);

  useEffect(() => {
    flipVRef.current = flipV;
  }, [flipV]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const renderOutline = useCallback(async () => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!pdf || !canvas || !container) return null;

    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const availableHeight = container.clientHeight;
    const availableWidth = container.clientWidth;
    if (availableHeight <= 0 || availableWidth <= 0) return null;

    const scale = Math.min(
      availableHeight / baseViewport.height,
      availableWidth / baseViewport.width,
    );
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext("2d");
    if (!context) return null;

    const displayWidth = Math.floor(viewport.width);
    const displayHeight = Math.floor(viewport.height);

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    await page.render({ canvas, canvasContext: context, viewport }).promise;
    displayScaleRef.current = scale;
    setOutlineReady(true);
    return { width: displayWidth, height: displayHeight, displayScale: scale };
  }, []);

  const layoutOverlay = useCallback(
    (
      canvasWidth: number,
      canvasHeight: number,
      displayScale: number,
      previous: OverlayState | null,
    ): OverlayState => {
      const { width, height } = pdfPointsToDisplayPixels(
        cropWidthPts,
        cropHeightPts,
        displayScale,
      );

      if (!previous) {
        return {
          centerX: canvasWidth / 2,
          centerY: canvasHeight / 2,
          width,
          height,
        };
      }

      const frameWidth = frameRef.current?.clientWidth || canvasWidth;
      const frameHeight = frameRef.current?.clientHeight || canvasHeight;
      const centerX =
        frameWidth > 0 ? (previous.centerX / frameWidth) * canvasWidth : canvasWidth / 2;
      const centerY =
        frameHeight > 0 ? (previous.centerY / frameHeight) * canvasHeight : canvasHeight / 2;

      return {
        centerX,
        centerY,
        width,
        height,
      };
    },
    [cropHeightPts, cropWidthPts],
  );

  const initializeOverlay = useCallback(
    (canvasWidth: number, canvasHeight: number, displayScale: number) => {
      const image = new Image();
      image.onload = () => {
        setOverlay((current) => layoutOverlay(canvasWidth, canvasHeight, displayScale, current));
      };
      image.onerror = () => {
        setError("Could not load your profile selection.");
      };
      image.src = cropImageUrl;
    },
    [cropImageUrl, layoutOverlay],
  );

  const buildCompositeCanvas = useCallback(async () => {
    const pdf = pdfRef.current;
    const overlayState = overlayRef.current;
    const displayScale = displayScaleRef.current;
    if (!pdf || !overlayState || !(displayScale > 0)) return null;

    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const exportScale = Math.max(EXPORT_TARGET_WIDTH / baseViewport.width, displayScale);
    const viewport = page.getViewport({ scale: exportScale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) return null;

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const scaleRatio = exportScale / displayScale;
    const centerX = overlayState.centerX * scaleRatio;
    const centerY = overlayState.centerY * scaleRatio;
    const width = overlayState.width * scaleRatio;
    const height = overlayState.height * scaleRatio;

    const cropImage = await loadImage(cropImageUrl);
    context.save();
    context.translate(centerX, centerY);
    context.rotate((rotationRef.current * Math.PI) / 180);
    context.scale(flipHRef.current ? -1 : 1, flipVRef.current ? -1 : 1);
    context.globalAlpha = 0.5;
    context.drawImage(cropImage, -width / 2, -height / 2, width, height);
    context.restore();

    return canvas;
  }, [cropImageUrl]);

  const buildCompositePdfBytes = useCallback(async () => {
    const composite = await buildCompositeCanvas();
    if (!composite) return null;

    const pngBlob = await canvasToPngBlob(composite);
    const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

    const outlineBytes = new Uint8Array(await (await fetch(referenceOutlinePdfUrl)).arrayBuffer());
    const outlinePdf = await PDFDocument.load(outlineBytes);
    const [outlinePage] = outlinePdf.getPages();
    const { width, height } = outlinePage.getSize();

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([width, height]);
    const embedded = await pdf.embedPng(pngBytes);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
    return pdf.save();
  }, [buildCompositeCanvas, referenceOutlinePdfUrl]);

  useImperativeHandle(
    ref,
    () => ({
      async saveCompositePdf(filename = "profile-match-compare.pdf") {
        const bytes = await buildCompositePdfBytes();
        if (!bytes) return false;
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
        return true;
      },
      async printComposite() {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return false;
        printWindow.document.write(`<!DOCTYPE html>
<html>
  <head><title>Profile match compare</title></head>
  <body style="font-family: sans-serif; padding: 1.5rem; color: #444;">Preparing print…</body>
</html>`);
        printWindow.document.close();

        try {
          const composite = await buildCompositeCanvas();
          if (!composite) {
            printWindow.close();
            return false;
          }
          const dataUrl = composite.toDataURL("image/png");
          printWindow.document.open();
          printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>Profile match compare</title>
    <style>
      html, body { margin: 0; padding: 0; background: #fff; }
      img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
      @media print {
        img { max-width: 100%; width: 100%; page-break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" alt="Profile match compare" />
  </body>
</html>`);
          printWindow.document.close();
          const img = printWindow.document.querySelector("img");
          const triggerPrint = () => {
            printWindow.focus();
            printWindow.print();
          };
          if (img && !img.complete) {
            img.onload = triggerPrint;
          } else {
            triggerPrint();
          }
          return true;
        } catch {
          printWindow.close();
          return false;
        }
      },
    }),
    [buildCompositeCanvas, buildCompositePdfBytes],
  );

  useEffect(() => {
    let cancelled = false;
    let loadingTask: { destroy: () => Promise<void> } | null = null;
    let loadedDoc: PDFDocumentProxy | null = null;

    async function loadOutline() {
      setLoading(true);
      setError(null);
      setOverlay(null);
      setOutlineReady(false);

      const previous = pdfRef.current;
      pdfRef.current = null;
      destroyPdfDocument(previous);

      try {
        const response = await fetch(referenceOutlinePdfUrl);
        if (!response.ok) throw new Error("fetch failed");
        const data = new Uint8Array(await response.arrayBuffer());
        loadingTask = await openPdfDocument(data);
        const pdf = await loadingTask.promise;
        loadedDoc = pdf;

        if (cancelled) {
          destroyPdfDocument(pdf);
          return;
        }

        pdfRef.current = pdf;
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Could not load the outline PDF.");
          setLoading(false);
        }
      }
    }

    void loadOutline();

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
      const current = pdfRef.current;
      pdfRef.current = null;
      destroyPdfDocument(current);
      destroyPdfDocument(loadedDoc);
    };
  }, [referenceOutlinePdfUrl]);

  useEffect(() => {
    if (loading || error) return;

    let cancelled = false;

    async function paint() {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const size = await renderOutline();
      if (cancelled || !size) return;
      initializeOverlay(size.width, size.height, size.displayScale);
    }

    void paint();

    return () => {
      cancelled = true;
    };
  }, [error, initializeOverlay, loading, renderOutline]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loading || error) return;

    const observer = new ResizeObserver(() => {
      void (async () => {
        const size = await renderOutline();
        if (!size) return;

        setOverlay((current) => {
          if (!current) return current;
          return layoutOverlay(size.width, size.height, size.displayScale, current);
        });
      })();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [error, layoutOverlay, loading, renderOutline]);

  function framePoint(e: ReactPointerEvent | PointerEvent) {
    const bounds = frameRef.current?.getBoundingClientRect();
    if (!bounds) return { x: 0, y: 0 };
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
  }

  function endDrag(e: PointerEvent) {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
  }

  function onPointerMove(e: PointerEvent) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const point = framePoint(e);

    if (drag.mode === "move") {
      const dx = point.x - drag.startX;
      const dy = point.y - drag.startY;
      setOverlay({
        ...drag.startOverlay,
        centerX: drag.startOverlay.centerX + dx,
        centerY: drag.startOverlay.centerY + dy,
      });
      return;
    }

    const currentAngle = angleFromCenter(
      drag.startOverlay.centerX,
      drag.startOverlay.centerY,
      point.x,
      point.y,
    );
    const delta = currentAngle - drag.startAngle;
    onRotationChange(drag.startRotation + delta);
  }

  function startDrag(mode: DragState["mode"], e: ReactPointerEvent, startAngle = 0) {
    if (!overlay) return;
    e.preventDefault();
    e.stopPropagation();

    const point = framePoint(e);
    dragRef.current = {
      mode,
      pointerId: e.pointerId,
      startX: point.x,
      startY: point.y,
      startAngle,
      startRotation: rotation,
      startOverlay: overlay,
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  }

  function onMovePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    startDrag("move", e);
  }

  function onRotatePointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!overlay) return;
    const point = framePoint(e);
    const startAngle = angleFromCenter(overlay.centerX, overlay.centerY, point.x, point.y);
    startDrag("rotate", e, startAngle);
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
          <div ref={frameRef} className="relative inline-block max-h-full max-w-full">
            <canvas ref={canvasRef} className="block max-h-full max-w-full" />
            {!outlineReady ? (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-50/80">
                <LoadingState size="md" />
              </div>
            ) : null}
            {overlay ? (
              <div className="absolute inset-0">
                <div
                  className="absolute touch-none cursor-move"
                  style={{
                    left: overlay.centerX,
                    top: overlay.centerY,
                    width: overlay.width,
                    height: overlay.height,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    transformOrigin: "center center",
                  }}
                  onPointerDown={onMovePointerDown}
                >
                  <img
                    src={cropImageUrl}
                    alt="Your profile selection"
                    className="h-full w-full object-fill opacity-50"
                    draggable={false}
                  />
                  {!hideBoundingBox ? (
                    <>
                      <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-primary" />

                      <div
                        className="pointer-events-none absolute left-1/2 w-px bg-primary"
                        style={{
                          top: -(ROTATION_HANDLE_OFFSET - 8),
                          height: ROTATION_HANDLE_OFFSET - 8,
                          marginLeft: -0.5,
                        }}
                      />
                      <button
                        type="button"
                        aria-label="Rotate selection"
                        className="absolute left-1/2 h-4 w-4 -translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-white active:cursor-grabbing"
                        style={{ top: -(ROTATION_HANDLE_OFFSET + 8) }}
                        onPointerDown={onRotatePointerDown}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});
