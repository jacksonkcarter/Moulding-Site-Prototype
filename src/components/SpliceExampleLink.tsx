"use client";

import Image from "next/image";
import { useEffect, useId, useState, type ReactNode } from "react";

const SPLICE_IMAGE = {
  src: "/product-info/stained-splice.jpg",
  alt: "Stained Flex Trim™ with center splice (poplar grain)",
  caption: "Stained Flex Trim™ with center splice (poplar grain)",
  width: 371,
  height: 280,
} as const;

type SpliceExampleLinkProps = {
  children: ReactNode;
  className?: string;
};

export function SpliceExampleLink({ children, className = "" }: SpliceExampleLinkProps) {
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
        className={`font-medium text-primary underline-offset-2 hover:underline ${className}`}
      >
        {children}
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
            className="relative w-auto max-w-[calc(100vw-2rem)] rounded-lg bg-white p-4 pt-12 shadow-lg sm:p-6 sm:pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <Image
              src={SPLICE_IMAGE.src}
              alt={SPLICE_IMAGE.alt}
              width={SPLICE_IMAGE.width}
              height={SPLICE_IMAGE.height}
              className="mx-auto h-auto w-auto max-w-full rounded"
              style={{ width: SPLICE_IMAGE.width * 0.75, height: "auto" }}
              unoptimized
            />
            <p id={titleId} className="mt-4 text-center text-sm font-medium text-neutral-800 sm:text-base">
              {SPLICE_IMAGE.caption}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
