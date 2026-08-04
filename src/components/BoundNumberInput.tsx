"use client";

import { useState } from "react";

type BoundNumberInputProps = {
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
  className?: string;
  id?: string;
  tabIndex?: number;
};

/** Text field that lets you type freely; clamps to min/max only on blur or Enter (no step snapping). */
export function BoundNumberInput({
  value,
  min,
  max,
  onCommit,
  className,
  id,
  tabIndex,
}: BoundNumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? String(value);

  const commit = (raw: string) => {
    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      onCommit(Math.min(Math.max(parsed, min), max));
    }
    setDraft(null);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      tabIndex={tabIndex}
      value={display}
      onFocus={() => setDraft(String(value))}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => commit(draft ?? String(value))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={className}
    />
  );
}
