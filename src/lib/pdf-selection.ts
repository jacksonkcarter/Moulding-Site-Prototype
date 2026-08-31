export type PdfSelectionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Cropped profile region exported from the user's uploaded PDF. */
export type PdfCropExport = {
  imageUrl: string;
  /** Selection width in PDF points (1 pt = 1/72 inch) on the uploaded page. */
  widthPts: number;
  /** Selection height in PDF points on the uploaded page. */
  heightPts: number;
  pageNumber: number;
};

/** Convert on-screen selection pixels to PDF points using the page render scale. */
export function selectionPixelsToPdfPoints(
  widthPx: number,
  heightPx: number,
  renderScale: number,
): { widthPts: number; heightPts: number } {
  return {
    widthPts: widthPx / renderScale,
    heightPts: heightPx / renderScale,
  };
}

/** Size of a PDF-point region when the page is rendered at the given scale. */
export function pdfPointsToDisplayPixels(
  widthPts: number,
  heightPts: number,
  renderScale: number,
): { width: number; height: number } {
  return {
    width: widthPts * renderScale,
    height: heightPts * renderScale,
  };
}
