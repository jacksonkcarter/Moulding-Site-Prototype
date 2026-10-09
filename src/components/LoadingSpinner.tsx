type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
} as const;

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <svg
      className={`animate-spin ${SIZE_CLASS[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V1C5.373 1 1 5.373 1 12h3zm2 5.291A7.962 7.962 0 014 12H1c0 3.042 1.135 5.824 3 7.938l2-1.647z"
      />
    </svg>
  );
}

type LoadingStateProps = {
  /** Optional status text. Prefer spinner-only for page navigations. */
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function LoadingState({
  label,
  className = "",
  size = "lg",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-neutral-500 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
    >
      <LoadingSpinner size={size} className="text-primary" />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  );
}

type BusyLabelProps = {
  busy: boolean;
  idle: React.ReactNode;
  /** When busy, only the spinner is shown (near the click). */
  busyText?: string;
};

/** Spinner in place of button label while an async action runs. */
export function BusyLabel({ busy, idle, busyText }: BusyLabelProps) {
  if (!busy) return <>{idle}</>;
  return (
    <>
      <LoadingSpinner size="sm" className="text-current" />
      {busyText ? <span className="sr-only">{busyText}</span> : null}
    </>
  );
}

/** Centered page/route spinner - no labels, no competing chrome. */
export function PageSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex min-h-[50vh] items-center justify-center px-4 py-16 ${className}`}>
      <LoadingState size="lg" />
    </div>
  );
}
