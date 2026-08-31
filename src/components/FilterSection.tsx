"use client";

import type { ReactNode } from "react";

type FilterSectionProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  onReset?: () => void;
  /** Set to -1 to skip Reset / expand controls in keyboard tab order. */
  headerTabIndex?: number;
  children: ReactNode;
};

export function FilterResetAllButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-[#9f1b20] hover:text-[#9f1b20] ${className}`}
    >
      Reset all
    </button>
  );
}

export function FilterSection({
  title,
  open,
  onToggle,
  onReset,
  headerTabIndex,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <div className="flex items-center gap-2 py-2">
        <button
          type="button"
          onClick={onToggle}
          tabIndex={headerTabIndex}
          className="min-w-0 flex-1 text-left text-sm font-medium text-neutral-700 hover:text-[#9f1b20]"
        >
          {title}
        </button>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            tabIndex={headerTabIndex}
            className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-[#9f1b20]"
          >
            Reset
          </button>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          tabIndex={headerTabIndex}
          className="shrink-0 rounded p-0.5 text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-[#9f1b20]"
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        >
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {open ? <div className="pb-3">{children}</div> : null}
    </div>
  );
}
