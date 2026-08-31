"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ContactLink } from "@/components/ContactLink";

type ProfileMatchPromptProps = {
  /** Link into the Made-to-Match profile checker for this profile. */
  checkerHref: string;
  /** Body copy shown in the modal (e.g. matching wood profiles note). */
  matchingWoodProfiles: string;
  className?: string;
};

export function ProfileMatchPrompt({
  checkerHref,
  matchingWoodProfiles,
  className = "",
}: ProfileMatchPromptProps) {
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
        className={`inline-flex items-center rounded-full border-2 border-primary bg-white px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white ${className}`}
      >
        Does this match my profile?
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-xl rounded-xl border border-neutral-200 bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-900">
                Does this match my profile?
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-neutral-600">{matchingWoodProfiles}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Link
                href={checkerHref}
                onClick={() => setOpen(false)}
                className="inline-flex flex-[1.4] items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Made-to-Match profile checker
              </Link>
              <ContactLink
                action="popover"
                onClick={() => setOpen(false)}
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-primary bg-white px-6 py-2.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:px-8"
              >
                Contact us
              </ContactLink>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
