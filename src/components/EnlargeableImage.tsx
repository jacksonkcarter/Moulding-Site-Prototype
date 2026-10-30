"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

type EnlargeableImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

export function EnlargeableImage({ src, alt, sizes, priority }: EnlargeableImageProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[90vh] w-auto max-w-[min(72rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg bg-white p-4 pt-12 shadow-lg sm:p-6 sm:pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded object-contain"
              sizes="90vw"
            />
            <p id={titleId} className="mt-4 text-center text-sm font-medium text-neutral-800 sm:text-base">
              {alt}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
