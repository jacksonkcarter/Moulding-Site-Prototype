"use client";

import { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ApplicationCategory } from "@/data/gallery-applications";

/** Uses site-wide viewable area from globals.css: --header-offset, --content-top-buffer. */
const STRIP_HEIGHT =
  "calc((100vh - var(--header-offset) - var(--content-top-buffer)) / 5)";
const SLIDE_DURATION = 2;
const EASE_SMOOTH = [0.25, 0.1, 0.25, 1];
const LIGHTBOX_DURATION = 2;
const LIGHTBOX_EASE = [0.25, 0.1, 0.25, 1];

type LightboxState = {
  src: string;
  imageIndex: number;
  images: string[];
  rect: { left: number; top: number; width: number; height: number };
  viewport: { w: number; h: number };
};

type ApplicationsDrawerProps = {
  categories: ApplicationCategory[];
};

export function ApplicationsDrawer({ categories }: ApplicationsDrawerProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [slidePx, setSlidePx] = useState<{
    oneStrip: number;
    content: number;
    paddingTop: number;
  }>({ oneStrip: 0, content: 0, paddingTop: 0 });
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  /** When user closes the drawer by clicking the header, we keep showing the grid and fade it out. */
  const [closingCategory, setClosingCategory] = useState<{
    cat: ApplicationCategory;
    openIndex: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openLightbox = useCallback((src: string, el: HTMLElement, images: string[]) => {
    const rect = el.getBoundingClientRect();
    const imageIndex = images.indexOf(src);
    setLightbox({
      src,
      imageIndex: imageIndex >= 0 ? imageIndex : 0,
      images,
      rect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
      viewport: { w: window.innerWidth, h: window.innerHeight },
    });
    setLightboxClosing(false);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxClosing(true);
  }, []);

  const handleLightboxAnimationComplete = useCallback(() => {
    if (lightboxClosing) {
      setLightbox(null);
      setLightboxClosing(false);
    }
  }, [lightboxClosing]);

  const goToPrevImage = useCallback(() => {
    setLightbox((prev) => {
      if (!prev || prev.images.length <= 1) return prev;
      const nextIndex = prev.imageIndex <= 0 ? prev.images.length - 1 : prev.imageIndex - 1;
      return { ...prev, src: prev.images[nextIndex], imageIndex: nextIndex };
    });
  }, []);

  const goToNextImage = useCallback(() => {
    setLightbox((prev) => {
      if (!prev || prev.images.length <= 1) return prev;
      const nextIndex = (prev.imageIndex + 1) % prev.images.length;
      return { ...prev, src: prev.images[nextIndex], imageIndex: nextIndex };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevImage();
      if (e.key === "ArrowRight") goToNextImage();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, closeLightbox, goToPrevImage, goToNextImage]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const content = el.clientHeight - paddingTop;
      setSlidePx({ oneStrip: content / 5, content, paddingTop });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const openIndex = openId != null ? categories.findIndex((c) => c.id === openId) : -1;
  const isAnyOpen = openId != null;

  const openCat = openId != null ? categories.find((c) => c.id === openId) : null;
  const contentTopPx = slidePx.paddingTop + slidePx.oneStrip / 2;

  /** Grid starts with its top at the strip's bottom (full height), ends at contentTopPx (compressed). */
  const gridInitialY =
    openIndex >= 0 && slidePx.oneStrip > 0
      ? (openIndex + 1) * slidePx.oneStrip - contentTopPx
      : 0;

  /** When closing, we keep the grid visible and use this index for layout. */
  const gridCat = openCat ?? closingCategory?.cat ?? null;
  const gridOpenIndex = openCat ? openIndex : closingCategory?.openIndex ?? -1;
  const closingGridInitialY =
    gridOpenIndex >= 0 && slidePx.oneStrip > 0
      ? (gridOpenIndex + 1) * slidePx.oneStrip - contentTopPx
      : 0;

  const handleStripClick = useCallback(
    (cat: ApplicationCategory, isOpen: boolean) => {
      if (isOpen) {
        setClosingCategory({ cat, openIndex });
        setOpenId(null);
      } else {
        setOpenId(cat.id);
      }
    },
    [openIndex]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col overflow-hidden bg-neutral-900"
      style={{
        height: "calc(100vh - var(--header-offset))",
        paddingTop: "var(--content-top-buffer)",
      }}
    >
      {categories.map((cat, index) => {
        const isOpen = openId === cat.id;
        const stripImage = cat.stripImage ?? cat.images[0];
        const stripHeight = STRIP_HEIGHT;

        /* Selected + above: move up by openIndex strip heights (px so Framer can interpolate). Below: move down by full content height. */
        const slideY =
          !isAnyOpen || openIndex < 0 || slidePx.oneStrip <= 0
            ? 0
            : index <= openIndex
              ? -openIndex * slidePx.oneStrip
              : slidePx.content;

        return (
          <motion.div
            key={cat.id}
            layout={false}
            initial={false}
            animate={{
              y: isAnyOpen ? slideY : 0,
              height: stripHeight,
            }}
            transition={{
              y: { duration: SLIDE_DURATION, ease: EASE_SMOOTH },
              height: { duration: SLIDE_DURATION, ease: EASE_SMOOTH },
            }}
            className="relative min-h-0 w-full shrink-0 overflow-hidden bg-neutral-900"
            style={{
              minHeight: isOpen ? undefined : undefined,
              flex: "0 0 auto",
            }}
          >
            <motion.button
              type="button"
              layout={false}
              onClick={() => handleStripClick(cat, isOpen)}
              className="relative flex w-full shrink-0 cursor-pointer items-center justify-center bg-cover bg-center bg-no-repeat text-center transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50"
              style={{
                minHeight: slidePx.oneStrip > 0 ? undefined : STRIP_HEIGHT,
                backgroundImage: stripImage ? `url(${stripImage})` : undefined,
              }}
              animate={{
                height:
                  slidePx.oneStrip > 0
                    ? isOpen
                      ? slidePx.oneStrip / 2
                      : slidePx.oneStrip
                    : STRIP_HEIGHT,
              }}
              transition={{
                height: {
                  duration: SLIDE_DURATION,
                  ease: EASE_SMOOTH,
                },
              }}
              aria-expanded={isOpen}
              aria-controls={isOpen ? `drawer-${cat.id}` : undefined}
            >
              <motion.span
                className="absolute inset-0 bg-neutral-900"
                aria-hidden
                animate={{ opacity: isOpen ? 1 : 0.55 }}
                transition={{ duration: SLIDE_DURATION, ease: EASE_SMOOTH }}
              />
              <h2 className="relative z-10 font-sans font-medium tracking-wide text-white text-3xl sm:text-4xl">
                {cat.title}
              </h2>
            </motion.button>
          </motion.div>
        );
      })}

      {/* Bento grid overlay when a strip is open (or fading out after close); scrollable area below slot header */}
      {gridCat && contentTopPx > 0 && gridOpenIndex >= 0 && (
        <motion.div
          key={gridCat.id}
          className="absolute left-0 right-0 bottom-0 z-10 flex w-full flex-col overflow-y-auto overflow-x-hidden bg-neutral-900"
          style={{ top: contentTopPx }}
          initial={{ opacity: 0, y: gridInitialY }}
          animate={{ opacity: closingCategory ? 0 : 1, y: 0 }}
          transition={{ duration: SLIDE_DURATION, ease: EASE_SMOOTH }}
          onAnimationComplete={() => {
            if (closingCategory) setClosingCategory(null);
          }}
        >
          <div
            className="grid w-full gap-2 p-2 sm:gap-3 sm:p-3"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
              gridAutoRows: "minmax(280px, 42vh)",
              gridAutoFlow: "dense",
            }}
          >
            {gridCat.images.map((src, i) => {
              const bento: [number, number][] = [
                [2, 1],
                [1, 2],
                [1, 1],
                [1, 1],
                [2, 1],
                [1, 1],
                [1, 2],
                [1, 1],
                [1, 1],
                [1, 1],
              ];
              const [rowSpan, colSpan] = bento[i % bento.length] ?? [1, 1];
              return (
                <div
                  key={`${gridCat.id}-${src}-${i}`}
                  role="button"
                  tabIndex={0}
                  className="relative min-h-[280px] cursor-pointer overflow-hidden rounded-[0.25in] bg-neutral-800"
                  style={{
                    gridRow: `span ${rowSpan}`,
                    gridColumn: `span ${colSpan}`,
                  }}
                  onClick={(e) => openLightbox(src, e.currentTarget as HTMLElement, gridCat.images)}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(src, e.currentTarget as HTMLElement, gridCat.images)}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Lightbox: click image to enlarge from position to full window, object-contain */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: LIGHTBOX_DURATION, ease: LIGHTBOX_EASE }}
            onClick={closeLightbox}
          >
            {/* Back button - top left */}
            <button
              type="button"
              className="absolute left-4 top-4 z-[102] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Left arrow */}
            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="absolute left-4 top-1/2 z-[102] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                aria-label="Previous image"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Right arrow */}
            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="absolute right-4 top-1/2 z-[102] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                aria-label="Next image"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            <motion.div
              className="relative shrink-0 overflow-hidden rounded-[0.25in] bg-neutral-900"
              initial={{
                left: lightbox.rect.left,
                top: lightbox.rect.top,
                width: lightbox.rect.width,
                height: lightbox.rect.height,
              }}
              animate={
                lightboxClosing
                  ? {
                      left: lightbox.rect.left,
                      top: lightbox.rect.top,
                      width: lightbox.rect.width,
                      height: lightbox.rect.height,
                    }
                  : {
                      left: 0,
                      top: 0,
                      width: lightbox.viewport.w,
                      height: lightbox.viewport.h,
                    }
              }
              exit={{
                left: lightbox.rect.left,
                top: lightbox.rect.top,
                width: lightbox.rect.width,
                height: lightbox.rect.height,
              }}
              transition={{ duration: LIGHTBOX_DURATION, ease: LIGHTBOX_EASE }}
              onAnimationComplete={handleLightboxAnimationComplete}
              onClick={(e) => e.stopPropagation()}
              style={{ position: "fixed" }}
            >
              <Image
                key={lightbox.src}
                src={lightbox.src}
                alt=""
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
