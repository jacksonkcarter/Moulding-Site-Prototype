"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useId, useState } from "react";
import bendingStylesTrimmed from "../../Project_Info/Miscellaneous-Images/Flex Trim Bending Styles Trimmed.png";

const BENDING_STYLES_ALT =
  "Flex Trim bending styles: Style 1 straight, Style 2 pre-bent, and Crown pre-bent";

function BendingStylesImage({ className = "" }: { className?: string }) {
  return (
    <Image
      src={bendingStylesTrimmed}
      alt={BENDING_STYLES_ALT}
      className={`h-auto w-full ${className}`}
    />
  );
}

function useBendingStylesModal(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);
}

function BendingStylesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  useBendingStylesModal(open, onClose);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[90vh] w-auto max-w-[min(72rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg bg-white p-4 shadow-lg sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0">
          <Image
            src={bendingStylesTrimmed}
            alt={BENDING_STYLES_ALT}
            className="mx-auto h-auto w-full max-h-[45vh] rounded object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm transition-colors hover:bg-white hover:text-neutral-900"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div
          id={titleId}
          className="mt-4 min-h-0 shrink space-y-3 text-xs leading-relaxed text-neutral-700 sm:text-sm"
        >
          <div className="grid grid-cols-[3fr_4fr] gap-2">
            <div>
              <p>
                Straight pieces of Flex Trim™ <span className="underline">are not</span> warrantied
                for:
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 font-bold leading-none text-red-600" aria-hidden>
                    ✕
                  </span>
                  <span>
                    Bullnose corners and tight radius applications bending{" "}
                    <strong>style 1</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 font-bold leading-none text-red-600" aria-hidden>
                    ✕
                  </span>
                  <span>
                    Bending <strong>style 2</strong> (without prior approval from a sales specialist)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0 font-bold leading-none text-red-600" aria-hidden>
                    ✕
                  </span>
                  <span>
                    Bending as <strong>crown</strong> (without prior approval from a sales
                    specialist)
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p>
                Straight pieces of Flex Trim™ <span className="underline">are</span> warrantied for:
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex gap-2">
                  <span
                    className="mt-0.5 shrink-0 font-bold leading-none text-green-600"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>
                    Bending <strong>style 1</strong> (excluding bullnose corners and tight radius
                    applications)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="mt-0.5 shrink-0 font-bold leading-none text-green-600"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>
                    Very gradual arcs bending <strong>style 2</strong> (with prior approval from a
                    sales specialist)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="mt-0.5 shrink-0 font-bold leading-none text-green-600"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>
                    Very gradual curves bending as <strong>crown</strong> (with prior approval from a
                    sales specialist)
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p>
            Note: there is no extra cost for us to pre-bend the piece. Pre-bending the piece allows
            for a simple and effortless installation. Click on a specific stock profile to view its
            specific &quot;straight&quot; bending limitations as <strong>style 1</strong> and{" "}
            <strong>style 2</strong>.
          </p>
          <p>
            We do have the ability to create bullnose and tight radius pieces using additional tooling
            methods.{" "}
            <Link
              href="/products/bullnose-corners-tight-radii"
              className="font-medium text-primary underline-offset-2 hover:underline"
              onClick={onClose}
            >
              Learn more here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

type BendingStylesCardProps = {
  className?: string;
  /** Drop outer border/radius when nested inside a bordered panel (e.g. filter sidebar). */
  flush?: boolean;
};

export function BendingStylesCard({ className = "", flush = false }: BendingStylesCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`${
          flush
            ? "overflow-hidden border-b border-neutral-200 bg-white"
            : "overflow-hidden rounded-lg border border-neutral-200 bg-white"
        } ${className}`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-pointer"
          aria-label="View Flex Trim bending styles"
        >
          <BendingStylesImage />
        </button>
        <div className={`border-t border-neutral-100 ${flush ? "px-4 py-3" : "p-2"}`}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Learn more
          </button>
        </div>
      </div>

      <BendingStylesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

type BendingStylesLinkProps = {
  children: ReactNode;
  className?: string;
};

/** Inline control that opens the bending styles image + warranty text dialog. */
export function BendingStylesLink({ children, className = "" }: BendingStylesLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`cursor-pointer font-medium text-primary underline-offset-2 hover:underline ${className}`}
      >
        {children}
      </button>
      <BendingStylesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
