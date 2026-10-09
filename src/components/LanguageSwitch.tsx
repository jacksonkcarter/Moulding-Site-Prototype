"use client";

type LanguageSwitchProps = {
  value: "en" | "es";
  onChange: (locale: "en" | "es") => void;
  className?: string;
};

/** Compact EN ↔ ES switch for page-local language selection. */
export function LanguageSwitch({ value, onChange, className = "" }: LanguageSwitchProps) {
  const isEs = value === "es";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`text-sm font-semibold transition-colors ${
          !isEs ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
        }`}
        aria-pressed={!isEs}
      >
        English
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={isEs}
        aria-label={isEs ? "Cambiar a inglés" : "Switch to Spanish"}
        onClick={() => onChange(isEs ? "en" : "es")}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isEs ? "bg-primary" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
            isEs ? "translate-x-5" : "translate-x-0"
          }`}
          aria-hidden
        />
      </button>
      <button
        type="button"
        onClick={() => onChange("es")}
        className={`text-sm font-semibold transition-colors ${
          isEs ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
        }`}
        aria-pressed={isEs}
      >
        Español
      </button>
    </div>
  );
}
