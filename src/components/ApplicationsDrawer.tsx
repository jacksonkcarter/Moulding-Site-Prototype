"use client";

import { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  galleryCredit,
  galleryCreditUrl,
  galleryItemKey,
  galleryPreviewSrc,
  isGalleryFileVideo,
  isGalleryInstagram,
  isGalleryVideo,
  isGalleryYoutube,
  type ApplicationCategory,
  type GalleryItem,
} from "@/data/gallery-applications";

/** Strip height as a share of the drawer (parent must have a definite height). */
function stripHeightCss(categoryCount: number): string {
  const n = Math.max(1, categoryCount);
  return `calc((100% - var(--content-top-buffer)) / ${n})`;
}

/** Encode path segments so spaces, &, etc. work in CSS background-image. */
function cssBackgroundUrl(path: string): string {
  const encoded = path
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : ""))
    .join("/");
  return `url("${encoded}")`;
}

/** Persistent close bar height once a category is open. */
function measuredChromeHeight(oneStrip: number): number {
  return oneStrip > 0 ? oneStrip / 2 : 0;
}
/** Category open/close and image maximize/minimize share the same timing. */
const SLIDE_DURATION = 1.5;
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;
const LIGHTBOX_DURATION = SLIDE_DURATION;
const LIGHTBOX_EASE = EASE_SMOOTH;
/** Match tile rounding (0.25in) in px so Framer can interpolate cleanly. */
const LIGHTBOX_RADIUS_TILE_PX = 24;
const LIGHTBOX_RADIUS_OPEN_PX = 8;
const LIGHTBOX_VIEWPORT_PAD = 16;

type Rect = { left: number; top: number; width: number; height: number };

type LightboxState = {
  item: GalleryItem;
  imageIndex: number;
  items: GalleryItem[];
  /** Thumbnail frame the morph starts/ends on. */
  origin: Rect;
  /** Final object-fit frame (image aspect, centered) — full uncropped photo. */
  target: Rect;
};

function rectFromElement(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

/** Centered viewport rect that fits the image; never larger than native pixels (no upscale blur). */
function containRectForImage(
  naturalWidth: number,
  naturalHeight: number,
  viewportW = typeof window !== "undefined" ? window.innerWidth : 0,
  viewportH = typeof window !== "undefined" ? window.innerHeight : 0,
): Rect {
  const maxW = Math.max(0, viewportW - LIGHTBOX_VIEWPORT_PAD * 2);
  const maxH = Math.max(0, viewportH - LIGHTBOX_VIEWPORT_PAD * 2);
  const nw = naturalWidth > 0 ? naturalWidth : 4;
  const nh = naturalHeight > 0 ? naturalHeight : 3;
  // Cap at 1 so small photos stay at their sharp native size instead of filling the viewport.
  const scale = Math.min(maxW / nw, maxH / nh, 1);
  const width = nw * scale;
  const height = nh * scale;
  return {
    left: (viewportW - width) / 2,
    top: (viewportH - height) / 2,
    width,
    height,
  };
}

function findThumbForSrc(src: string): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>("[data-gallery-thumb]");
  for (const node of nodes) {
    if (node.getAttribute("data-gallery-thumb") === src) return node;
  }
  return null;
}

type ApplicationsDrawerProps = {
  categories: ApplicationCategory[];
};

function imageNeedsUnoptimized(src: string): boolean {
  return /\.bmp$/i.test(src) || /^https?:\/\//i.test(src);
}

type ImageOrientation = "portrait" | "landscape" | "square";

/** Row/col spans: tall → vertical pane, wide → horizontal pane, square-ish → 1×1. */
function spanForOrientation(orientation: ImageOrientation): [number, number] {
  switch (orientation) {
    case "portrait":
      return [2, 1];
    case "landscape":
      return [1, 2];
    default:
      return [1, 1];
  }
}

/**
 * Simulate dense packing. If a tile prefers 2 columns but the earliest open
 * slot is only 1 column (a hole), demote it to 1 column to fill that hole.
 */
function planColSpans(orientations: ImageOrientation[], columns: number): number[] {
  if (columns < 2) return orientations.map(() => 1);

  const occupied: boolean[][] = [];

  const ensureRow = (r: number) => {
    while (occupied.length <= r) occupied.push(Array.from({ length: columns }, () => false));
  };

  const fits = (r: number, c: number, colSpan: number, rowSpan: number) => {
    if (c + colSpan > columns) return false;
    for (let dy = 0; dy < rowSpan; dy++) {
      ensureRow(r + dy);
      for (let dx = 0; dx < colSpan; dx++) {
        if (occupied[r + dy][c + dx]) return false;
      }
    }
    return true;
  };

  const findFirstFit = (colSpan: number, rowSpan: number): { r: number; c: number } => {
    const maxR = occupied.length + 1;
    for (let r = 0; r <= maxR; r++) {
      for (let c = 0; c <= columns - colSpan; c++) {
        if (fits(r, c, colSpan, rowSpan)) return { r, c };
      }
    }
    return { r: occupied.length, c: 0 };
  };

  const occupy = (r: number, c: number, colSpan: number, rowSpan: number) => {
    for (let dy = 0; dy < rowSpan; dy++) {
      ensureRow(r + dy);
      for (let dx = 0; dx < colSpan; dx++) occupied[r + dy][c + dx] = true;
    }
  };

  const earlier = (
    a: { r: number; c: number },
    b: { r: number; c: number },
  ) => a.r < b.r || (a.r === b.r && a.c < b.c);

  return orientations.map((orientation) => {
    const [rowSpan, preferredCol] = spanForOrientation(orientation);
    const want = Math.min(preferredCol, columns);
    let colSpan = want;
    if (want >= 2) {
      const hole = findFirstFit(1, rowSpan);
      const wide = findFirstFit(want, rowSpan);
      // Hole exists earlier than a wide placement → use this tile to fill it.
      if (earlier(hole, wide)) colSpan = 1;
    }
    const place = findFirstFit(colSpan, rowSpan);
    occupy(place.r, place.c, colSpan, rowSpan);
    return colSpan;
  });
}

function classifyOrientation(width: number, height: number): ImageOrientation {
  if (width <= 0 || height <= 0) return "square";
  const ratio = width / height;
  // 3:4 … 4:3 (and anything closer to square) → square pane
  if (ratio < 3 / 4) return "portrait";
  if (ratio > 4 / 3) return "landscape";
  return "square";
}

const orientationCache = new Map<string, ImageOrientation>();
/** Full-file pixel size (not the Next.js thumb) — used for sharp lightbox framing. */
const naturalSizeCache = new Map<string, { w: number; h: number }>();

function probeImageMeta(src: string): Promise<{ orientation: ImageOrientation; w: number; h: number }> {
  const sizeCached = naturalSizeCache.get(src);
  const orientationCached = orientationCache.get(src);
  if (sizeCached && orientationCached) {
    return Promise.resolve({ orientation: orientationCached, ...sizeCached });
  }
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const orientation = classifyOrientation(w, h);
      naturalSizeCache.set(src, { w, h });
      orientationCache.set(src, orientation);
      resolve({ orientation, w, h });
    };
    img.onerror = () => {
      const fallback = { w: 4, h: 3 };
      naturalSizeCache.set(src, fallback);
      orientationCache.set(src, "square");
      resolve({ orientation: "square", ...fallback });
    };
    img.src = src;
  });
}

function probeOrientation(src: string): Promise<ImageOrientation> {
  return probeImageMeta(src).then((meta) => meta.orientation);
}

export function ApplicationsDrawer({ categories }: ApplicationsDrawerProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [slidePx, setSlidePx] = useState<{
    oneStrip: number;
    content: number;
    paddingTop: number;
  }>({ oneStrip: 0, content: 0, paddingTop: 0 });
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  /** True while arrow/keyboard swapping — frame jumps with no morph. */
  const [lightboxInstant, setLightboxInstant] = useState(false);
  const lightboxRef = useRef<LightboxState | null>(null);
  lightboxRef.current = lightbox;
  /** When user closes the drawer by clicking the header, we keep showing the grid and fade it out. */
  const [closingCategory, setClosingCategory] = useState<{
    cat: ApplicationCategory;
    openIndex: number;
  } | null>(null);
  /** src → orientation; bumped when probes finish so the grid can reflow. */
  const [orientationTick, setOrientationTick] = useState(0);
  /** 1 on mobile, 3 from md up — keeps col spans from creating implicit columns. */
  const [gridColumns, setGridColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prefetch aspect classes so the first open already has matching panes (posters for videos).
  useEffect(() => {
    let cancelled = false;
    const srcs = categories
      .flatMap((c) => c.images.map(galleryPreviewSrc))
      .filter((src): src is string => Boolean(src));
    void Promise.all(srcs.map((src) => probeOrientation(src))).then(() => {
      if (!cancelled) setOrientationTick((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [categories]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setGridColumns(mq.matches ? 3 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const openLightbox = useCallback((item: GalleryItem, el: HTMLElement, items: GalleryItem[]) => {
    const origin = rectFromElement(el);
    const key = galleryItemKey(item);
    const imageIndex = items.findIndex((entry) => galleryItemKey(entry) === key);
    const preview = galleryPreviewSrc(item);
    const apply = (w: number, h: number) => {
      setLightboxInstant(false);
      setLightbox({
        item,
        imageIndex: imageIndex >= 0 ? imageIndex : 0,
        items,
        origin,
        target: containRectForImage(w, h),
      });
      setLightboxClosing(false);
    };
    // Instagram / posterless video: default to a portrait-ish frame until we have pixels.
    if (!preview) {
      if (isGalleryInstagram(item) || isGalleryYoutube(item) || isGalleryFileVideo(item)) {
        apply(9, 16);
      } else {
        apply(4, 3);
      }
      return;
    }
    // Always measure the full file — thumb <img> is often a smaller Next.js derivative.
    const cached = naturalSizeCache.get(preview);
    if (cached) {
      apply(cached.w, cached.h);
      return;
    }
    void probeImageMeta(preview).then(({ w, h }) => apply(w, h));
  }, []);

  const closeLightbox = useCallback(() => {
    const prev = lightboxRef.current;
    if (!prev || lightboxClosing) return;
    setLightboxInstant(false);
    const thumb = findThumbForSrc(galleryItemKey(prev.item));
    if (thumb) {
      setLightbox({
        ...prev,
        origin: rectFromElement(thumb),
      });
    }
    setLightboxClosing(true);
  }, [lightboxClosing]);

  const handleLightboxAnimationComplete = useCallback(() => {
    if (lightboxClosing) {
      setLightbox(null);
      setLightboxClosing(false);
      setLightboxInstant(false);
    }
  }, [lightboxClosing]);

  const goToAdjacentImage = useCallback((direction: -1 | 1) => {
    const prev = lightboxRef.current;
    if (!prev || prev.items.length <= 1 || lightboxClosing) return;
    const nextIndex =
      direction === 1
        ? (prev.imageIndex + 1) % prev.items.length
        : prev.imageIndex <= 0
          ? prev.items.length - 1
          : prev.imageIndex - 1;
    const nextItem = prev.items[nextIndex];
    const thumb = findThumbForSrc(galleryItemKey(nextItem));
    const preview = galleryPreviewSrc(nextItem);
    const apply = (w: number, h: number) => {
      setLightboxInstant(true);
      setLightbox({
        ...prev,
        item: nextItem,
        imageIndex: nextIndex,
        origin: thumb ? rectFromElement(thumb) : prev.origin,
        target: containRectForImage(w, h),
      });
    };
    if (!preview) {
      if (isGalleryInstagram(nextItem) || isGalleryYoutube(nextItem) || isGalleryFileVideo(nextItem)) {
        apply(9, 16);
      } else {
        apply(4, 3);
      }
      return;
    }
    const cached = naturalSizeCache.get(preview);
    if (cached) {
      apply(cached.w, cached.h);
      return;
    }
    void probeImageMeta(preview).then(({ w, h }) => apply(w, h));
  }, [lightboxClosing]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToAdjacentImage(-1);
      if (e.key === "ArrowRight") goToAdjacentImage(1);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, closeLightbox, goToAdjacentImage]);

  const categoryCount = categories.length;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const content = el.clientHeight - paddingTop;
      const count = Math.max(1, categories.length);
      setSlidePx({ oneStrip: content / count, content, paddingTop });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories.length]);

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && categories.some((c) => c.id === id)) {
        setOpenId(id);
        return;
      }
      // "/gallery" or View all — show the full category list
      setOpenId(null);
      setClosingCategory(null);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [categories]);

  // Fill the viewport between header and footer; only the open category grid may scroll.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlHeight: html.style.height,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      bodyDisplay: body.style.display,
      bodyFlexDirection: body.style.flexDirection,
    };
    html.style.overflow = "hidden";
    html.style.height = "100dvh";
    body.style.overflow = "hidden";
    body.style.height = "100dvh";
    body.style.display = "flex";
    body.style.flexDirection = "column";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.height = prev.htmlHeight;
      body.style.overflow = prev.bodyOverflow;
      body.style.height = prev.bodyHeight;
      body.style.display = prev.bodyDisplay;
      body.style.flexDirection = prev.bodyFlexDirection;
    };
  }, []);

  const openIndex = openId != null ? categories.findIndex((c) => c.id === openId) : -1;
  const isAnyOpen = openId != null;
  const measured = slidePx.oneStrip > 0;

  const openCat = openId != null ? categories.find((c) => c.id === openId) : null;
  /** Thin bar that stays after strips part — click to close. */
  const chromeHeight = measuredChromeHeight(slidePx.oneStrip);
  const contentTopPx = slidePx.paddingTop + chromeHeight;

  /** Keep grid mounted while closing so strips can cover it again. */
  const gridCat = openCat ?? closingCategory?.cat ?? null;
  const gridOpenIndex = openCat ? openIndex : closingCategory?.openIndex ?? -1;
  /** Strip positions follow open state only — closingCategory must not keep them parted. */
  const partingIndex = isAnyOpen ? openIndex : closingCategory?.openIndex ?? -1;
  const stripsParted = isAnyOpen;

  /**
   * Grid rests under the chrome. It starts aligned with the selected strip and
   * pulls upward with that category as the curtains open.
   */
  const gridPullFrom =
    measured && partingIndex >= 0
      ? partingIndex * slidePx.oneStrip - chromeHeight
      : 0;

  const handleStripClick = useCallback(
    (cat: ApplicationCategory, isOpen: boolean) => {
      if (closingCategory) return;
      if (isOpen) {
        setClosingCategory({ cat, openIndex });
        setOpenId(null);
        if (typeof window !== "undefined" && window.location.hash) {
          const { pathname, search } = window.location;
          window.history.replaceState(null, "", `${pathname}${search}`);
        }
      } else {
        setOpenId(cat.id);
        if (typeof window !== "undefined") {
          const { pathname, search } = window.location;
          window.history.replaceState(null, "", `${pathname}${search}#${cat.id}`);
        }
      }
    },
    [openIndex, closingCategory]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white"
      style={{
        paddingTop: "var(--content-top-buffer)",
      }}
    >
      {/* Photo grid sits behind the strips and pulls up with the selected category. */}
      {gridCat && contentTopPx > 0 && gridOpenIndex >= 0 && (
        <motion.div
          key={gridCat.id}
          className="absolute inset-x-0 bottom-0 z-0 flex w-full flex-col overflow-y-auto overflow-x-hidden bg-white will-change-transform"
          style={{ top: contentTopPx }}
          initial={{ y: gridPullFrom }}
          animate={{ y: closingCategory ? gridPullFrom : 0 }}
          transition={{ duration: SLIDE_DURATION, ease: EASE_SMOOTH }}
          aria-hidden={Boolean(closingCategory)}
        >
          <div
            className="grid w-full grid-cols-1 gap-2 p-2 md:grid-cols-3 sm:gap-3 sm:p-3"
            style={{
              gridAutoRows: "minmax(280px, 42vh)",
              gridAutoFlow: "dense",
            }}
          >
            {(() => {
              // orientationTick keeps spans in sync after probes resolve.
              void orientationTick;
              const orientations = gridCat.images.map((item) => {
                const preview = galleryPreviewSrc(item);
                if (preview) return orientationCache.get(preview) ?? "square";
                return isGalleryVideo(item) ? "portrait" : "square";
              });
              const colSpans = planColSpans(orientations, gridColumns);
              return gridCat.images.map((item, i) => {
              const preview = galleryPreviewSrc(item);
              const itemKey = galleryItemKey(item);
              const isVideo = isGalleryVideo(item);
              const orientation = orientations[i];
              const [rowSpan] = spanForOrientation(orientation);
              const colSpan = colSpans[i] ?? 1;
              const prioritize = i < 6;
              return (
                <div
                  key={`${gridCat.id}-${itemKey}-${i}`}
                  data-gallery-thumb={itemKey}
                  role="button"
                  tabIndex={closingCategory ? -1 : 0}
                  aria-label={isVideo ? "Play video" : undefined}
                  className="relative min-h-[280px] cursor-pointer overflow-hidden rounded-[0.25in] bg-neutral-100"
                  style={{
                    gridRow: `span ${rowSpan}`,
                    gridColumn: `span ${colSpan}`,
                  }}
                  onClick={(e) => {
                    if (closingCategory) return;
                    openLightbox(item, e.currentTarget as HTMLElement, gridCat.images);
                  }}
                  onKeyDown={(e) => {
                    if (closingCategory) return;
                    if (e.key === "Enter") openLightbox(item, e.currentTarget as HTMLElement, gridCat.images);
                  }}
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt={galleryCredit(item) ?? ""}
                      fill
                      className="object-cover"
                      // Match display width: 2-col panes need ~66vw or Next serves an undersized (blurry) src.
                      sizes={
                        colSpan >= 2
                          ? "(max-width: 767px) 100vw, 66vw"
                          : "(max-width: 767px) 100vw, 33vw"
                      }
                      quality={90}
                      unoptimized={imageNeedsUnoptimized(preview)}
                      priority={prioritize}
                      loading={prioritize ? "eager" : "lazy"}
                    />
                  ) : (
                    <span className="absolute inset-0 bg-neutral-800" aria-hidden />
                  )}
                  {isVideo && (
                    <span
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25"
                      aria-hidden
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md sm:h-16 sm:w-16">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  )}
                </div>
              );
              });
            })()}
          </div>
        </motion.div>
      )}

      {/* Category strips — selected title slides into the header slot; others part away. */}
      {categories.map((cat, index) => {
        const stripImage =
          cat.stripImage ??
          (cat.images[0] ? galleryPreviewSrc(cat.images[0]) ?? undefined : undefined);
        const isOpenStrip = openId === cat.id;
        const isClosingStrip = closingCategory?.cat.id === cat.id;
        /** Selected chrome only while open — on close, grow back into a full strip. */
        const selectedOpen = isOpenStrip && stripsParted;
        const stripPx = measured ? slidePx.oneStrip : undefined;

        /*
          Curtain split:
          - strips above selected → fully off the top
          - selected → translates to the top; its button shrinks into the header bar
          - strips below → fully off the bottom
          On close, stripsParted is false so all slideY return to 0.
        */
        let slideY = 0;
        if (stripsParted && partingIndex >= 0 && measured) {
          if (index < partingIndex) {
            slideY = -(partingIndex + 1) * slidePx.oneStrip;
          } else if (index === partingIndex) {
            slideY = -partingIndex * slidePx.oneStrip;
          } else {
            slideY = slidePx.content;
          }
        }

        return (
          <motion.div
            key={cat.id}
            layout={false}
            initial={false}
            animate={{ y: slideY }}
            transition={{
              y: { duration: SLIDE_DURATION, ease: EASE_SMOOTH },
            }}
            className="relative z-20 min-h-0 w-full shrink-0 overflow-hidden bg-transparent will-change-transform"
            style={{
              height: stripPx ?? stripHeightCss(categoryCount),
              flex: "0 0 auto",
            }}
          >
            <motion.button
              type="button"
              layout={false}
              initial={false}
              onClick={() => handleStripClick(cat, isOpenStrip)}
              className="relative flex w-full cursor-pointer items-center justify-center bg-cover bg-center bg-no-repeat text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900/30"
              style={{
                backgroundImage: selectedOpen ? undefined : stripImage ? cssBackgroundUrl(stripImage) : undefined,
              }}
              animate={{
                height: measured
                  ? selectedOpen
                    ? chromeHeight
                    : slidePx.oneStrip
                  : stripHeightCss(categoryCount),
              }}
              transition={{
                height: { duration: SLIDE_DURATION, ease: EASE_SMOOTH },
              }}
              onAnimationComplete={() => {
                // Height always changes on close (chrome → full strip), including index 0
                // where translate Y does not move.
                if (closingCategory && isClosingStrip) {
                  setClosingCategory(null);
                }
              }}
              aria-expanded={isOpenStrip}
              aria-controls={isOpenStrip ? `drawer-${cat.id}` : undefined}
            >
              <motion.span
                className="absolute inset-0 bg-white"
                aria-hidden
                initial={false}
                animate={{ opacity: selectedOpen ? 1 : 0.8 }}
                transition={{ duration: SLIDE_DURATION, ease: EASE_SMOOTH }}
              />
              <h2 className="relative z-10 font-sans text-3xl font-medium tracking-wide text-neutral-900 sm:text-4xl [text-shadow:0_1px_0_rgba(255,255,255,0.95),0_0_18px_rgba(255,255,255,0.85)]">
                {cat.title}
              </h2>
            </motion.button>
          </motion.div>
        );
      })}

      {/* Lightbox: morph from cropped tile → full uncropped frame (and reverse on close).
          Backdrop fades on its own; the photo never changes opacity so it stays full color. */}
      {lightbox && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: lightboxClosing ? 0 : 1 }}
            transition={{ duration: LIGHTBOX_DURATION, ease: LIGHTBOX_EASE }}
            onClick={closeLightbox}
            aria-hidden
          />

          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: lightboxClosing ? 0 : 1 }}
            transition={{ duration: LIGHTBOX_DURATION, ease: LIGHTBOX_EASE }}
          >
            <button
              type="button"
              className="pointer-events-auto absolute left-4 top-4 z-[102] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {lightbox.items.length > 1 && (
              <button
                type="button"
                className="pointer-events-auto absolute left-4 top-1/2 z-[102] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={() => goToAdjacentImage(-1)}
                aria-label="Previous"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {lightbox.items.length > 1 && (
              <button
                type="button"
                className="pointer-events-auto absolute right-4 top-1/2 z-[102] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={() => goToAdjacentImage(1)}
                aria-label="Next"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </motion.div>

          <motion.div
            className="overflow-hidden bg-black"
            initial={{
              left: lightbox.origin.left,
              top: lightbox.origin.top,
              width: lightbox.origin.width,
              height: lightbox.origin.height,
              borderRadius: LIGHTBOX_RADIUS_TILE_PX,
            }}
            animate={
              lightboxClosing
                ? {
                    left: lightbox.origin.left,
                    top: lightbox.origin.top,
                    width: lightbox.origin.width,
                    height: lightbox.origin.height,
                    borderRadius: LIGHTBOX_RADIUS_TILE_PX,
                  }
                : {
                    left: lightbox.target.left,
                    top: lightbox.target.top,
                    width: lightbox.target.width,
                    height: lightbox.target.height,
                    borderRadius: LIGHTBOX_RADIUS_OPEN_PX,
                  }
            }
            transition={
              lightboxInstant
                ? { duration: 0 }
                : { duration: LIGHTBOX_DURATION, ease: LIGHTBOX_EASE }
            }
            onAnimationComplete={handleLightboxAnimationComplete}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "fixed", zIndex: 101 }}
          >
            {/*
              object-cover throughout: at the tile size it matches the preview crop;
              at the target size (image aspect) the full photo is visible — crop eases open as the frame grows.
              File/YouTube/Instagram players mount only once selected; grid tiles use a poster + play affordance.
            */}
            {isGalleryFileVideo(lightbox.item) && !lightboxClosing ? (
              <video
                key={lightbox.item.src}
                src={lightbox.item.src}
                poster={lightbox.item.poster || undefined}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                autoPlay
                playsInline
                preload="auto"
              />
            ) : isGalleryYoutube(lightbox.item) && !lightboxClosing ? (
              <iframe
                key={lightbox.item.videoId}
                src={`https://www.youtube.com/embed/${lightbox.item.videoId}?autoplay=1`}
                title={lightbox.item.title ?? galleryCredit(lightbox.item) ?? "Gallery video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : isGalleryInstagram(lightbox.item) && !lightboxClosing ? (
              <iframe
                key={lightbox.item.shortcode}
                src={`https://www.instagram.com/${lightbox.item.embedPath}/${lightbox.item.shortcode}/embed`}
                title={lightbox.item.title ?? galleryCredit(lightbox.item) ?? "Instagram video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 bg-black"
              />
            ) : galleryPreviewSrc(lightbox.item) ? (
              <Image
                key={galleryItemKey(lightbox.item)}
                src={galleryPreviewSrc(lightbox.item)!}
                alt={galleryCredit(lightbox.item) ?? ""}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
                priority
              />
            ) : (
              <span className="absolute inset-0 bg-neutral-900" aria-hidden />
            )}
          </motion.div>

          {(() => {
            const credit = galleryCredit(lightbox.item);
            const creditUrl = galleryCreditUrl(lightbox.item);
            if (!credit || lightboxClosing) return null;
            // Overlay on the bottom of the photo frame (not the viewport).
            const style = {
              position: "fixed" as const,
              left: lightbox.target.left + lightbox.target.width / 2,
              top: lightbox.target.top + lightbox.target.height - 12,
              transform: "translate(-50%, -100%)",
              zIndex: 104,
              maxWidth: Math.min(lightbox.target.width - 24, window.innerWidth - 32),
            };
            const className =
              "rounded-md bg-black/70 px-3 py-1.5 text-center text-sm text-white/95";
            if (creditUrl) {
              return (
                <a
                  href={creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={style}
                  className={`${className} pointer-events-auto cursor-pointer underline underline-offset-2 transition hover:bg-black/85`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {credit}
                </a>
              );
            }
            return (
              <p style={style} className={`${className} pointer-events-none`}>
                {credit}
              </p>
            );
          })()}
        </div>
      )}
    </div>
  );
}
