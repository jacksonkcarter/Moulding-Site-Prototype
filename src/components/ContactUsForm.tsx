"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]";
const inputErrorClass =
  "w-full rounded border border-primary px-3 py-2 text-neutral-900 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]";
const labelClass = "block text-sm font-medium text-neutral-700";
const errorClass = "mt-1 text-xs font-medium text-primary";
const btnPrimary =
  "rounded-full bg-[#9f1b20] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#8a171b] disabled:cursor-not-allowed disabled:opacity-60";

const REQUIRED_MSG = "This field is required.";

const COUNTRY_CODES = [
  { id: "US", dial: "+1", label: "United States (+1)" },
  { id: "CA", dial: "+1", label: "Canada (+1)" },
  { id: "MX", dial: "+52", label: "Mexico (+52)" },
  { id: "GB", dial: "+44", label: "United Kingdom (+44)" },
  { id: "AU", dial: "+61", label: "Australia (+61)" },
  { id: "DE", dial: "+49", label: "Germany (+49)" },
  { id: "FR", dial: "+33", label: "France (+33)" },
  { id: "IN", dial: "+91", label: "India (+91)" },
  { id: "CN", dial: "+86", label: "China (+86)" },
  { id: "JP", dial: "+81", label: "Japan (+81)" },
  { id: "BR", dial: "+55", label: "Brazil (+55)" },
  { id: "CR", dial: "+506", label: "Costa Rica (+506)" },
] as const;

type CountryCodeId = (typeof COUNTRY_CODES)[number]["id"];
type PreferredMethod = "email" | "phone";

type ContactUsFormState = {
  business: string;
  location: string;
  inquiry: string;
  yourName: string;
  position: string;
  email: string;
  phone: string;
  countryCode: CountryCodeId;
  preferredMethod: PreferredMethod;
};

type FieldKey =
  | "business"
  | "location"
  | "inquiry"
  | "yourName"
  | "position"
  | "email"
  | "phone"
  | "contact";
type FieldErrors = Partial<Record<FieldKey, string>>;

const INITIAL: ContactUsFormState = {
  business: "",
  location: "",
  inquiry: "",
  yourName: "",
  position: "",
  email: "",
  phone: "",
  countryCode: "US",
  preferredMethod: "email",
};

function usesNanpFormat(countryCode: CountryCodeId) {
  return countryCode === "US" || countryCode === "CA";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Formats as (XXX) XXX-XXXX while typing (US/CA). */
function formatUsPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatIntlPhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 15);
}

function formatPhoneForCountry(value: string, countryCode: CountryCodeId) {
  return usesNanpFormat(countryCode) ? formatUsPhone(value) : formatIntlPhone(value);
}

function validate(form: ContactUsFormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.business.trim()) errors.business = REQUIRED_MSG;
  if (!form.location.trim()) errors.location = REQUIRED_MSG;
  if (!form.inquiry.trim()) errors.inquiry = REQUIRED_MSG;
  if (!form.yourName.trim()) errors.yourName = REQUIRED_MSG;
  if (!form.position.trim()) errors.position = REQUIRED_MSG;

  const email = form.email.trim();
  const phone = form.phone.trim();
  if (!email && !phone) {
    errors.contact = "Enter an email or phone number.";
  } else if (email && !isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={errorClass} role="alert">
      {message}
    </p>
  );
}

function CountryCodeSelect({
  value,
  onChange,
  hasError,
}: {
  value: CountryCodeId;
  onChange: (next: CountryCodeId) => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find((c) => c.id === value) ?? COUNTRY_CODES[0];

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        id="contact-country-code"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code ${selected.dial}`}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex h-full min-w-[3.25rem] items-center justify-center gap-0.5 rounded-l border px-1.5 py-2 text-sm text-neutral-900 focus:z-10 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20] ${
          hasError ? "border-primary" : "border-neutral-300"
        }`}
      >
        <span>{selected.dial}</span>
        <svg className="h-3 w-3 text-neutral-500" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Country codes"
          className="absolute left-0 z-20 mt-1 max-h-56 w-max min-w-[12rem] overflow-auto rounded border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {COUNTRY_CODES.map((country) => {
            const isSelected = country.id === value;
            return (
              <li key={country.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(country.id);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-sm ${
                    isSelected
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-neutral-800 hover:bg-neutral-50"
                  }`}
                >
                  {country.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function ContactUsForm() {
  const [form, setForm] = useState<ContactUsFormState>(INITIAL);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof ContactUsFormState>(key: K, value: ContactUsFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      if (key in next) delete next[key as FieldKey];
      if (key === "email" || key === "phone") {
        delete next.contact;
        delete next.email;
      }
      return next;
    });
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // Prototype: no backend yet - mirror quote request behavior.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-8 text-center">
        <p className="text-lg font-medium text-neutral-900">Thanks. We received your message.</p>
        <p className="mt-2 text-sm text-neutral-600">
          Someone from the facility that serves your area will follow up shortly.
        </p>
        <button
          type="button"
          className={`${btnPrimary} mt-6`}
          onClick={() => {
            setForm(INITIAL);
            clearFile();
            setErrors({});
            setSubmitted(false);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 not-prose">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-business" className={labelClass}>
            Company Name
          </label>
          <input
            id="contact-business"
            type="text"
            value={form.business}
            onChange={(e) => update("business", e.target.value)}
            className={`mt-1 ${errors.business ? inputErrorClass : inputClass}`}
            autoComplete="organization"
            aria-invalid={errors.business ? true : undefined}
            aria-describedby={errors.business ? "contact-business-error" : undefined}
          />
          <FieldError id="contact-business-error" message={errors.business} />
        </div>
        <div>
          <label htmlFor="contact-location" className={labelClass}>
            Location
          </label>
          <input
            id="contact-location"
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className={`mt-1 ${errors.location ? inputErrorClass : inputClass}`}
            autoComplete="address-level2"
            placeholder="City, state"
            aria-invalid={errors.location ? true : undefined}
            aria-describedby={errors.location ? "contact-location-error" : undefined}
          />
          <FieldError id="contact-location-error" message={errors.location} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-inquiry" className={labelClass}>
          Project details or inquiry
        </label>
        <p className="mt-0.5 text-xs text-neutral-500">
          Tell us about your profiles, application, quantities, and timeline. You can also fill out and
          attach our order form.
        </p>
        <textarea
          id="contact-inquiry"
          value={form.inquiry}
          onChange={(e) => update("inquiry", e.target.value)}
          className={`mt-1 min-h-[8rem] resize-y ${errors.inquiry ? inputErrorClass : inputClass}`}
          aria-invalid={errors.inquiry ? true : undefined}
          aria-describedby={errors.inquiry ? "contact-inquiry-error" : undefined}
        />
        <FieldError id="contact-inquiry-error" message={errors.inquiry} />
      </div>

      <div>
        <span className={labelClass}>File upload</span>
        <p className="mt-0.5 text-xs text-neutral-500">
          Optional. Include drawings, photos, or specs that help us understand your request.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            id="contact-file"
            type="file"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <label
            htmlFor="contact-file"
            className="cursor-pointer rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-[#9f1b20] hover:text-[#9f1b20]"
          >
            Choose file
          </label>
          {file ? (
            <div className="flex min-w-0 items-center gap-2 text-sm text-neutral-700">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="shrink-0 text-neutral-500 hover:text-primary hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <span className="text-sm text-neutral-500">No file selected</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name
            </label>
            <input
              id="contact-name"
              type="text"
              value={form.yourName}
              onChange={(e) => update("yourName", e.target.value)}
              className={`mt-1 ${errors.yourName ? inputErrorClass : inputClass}`}
              autoComplete="name"
              aria-invalid={errors.yourName ? true : undefined}
              aria-describedby={errors.yourName ? "contact-name-error" : undefined}
            />
            <FieldError id="contact-name-error" message={errors.yourName} />
          </div>
          <div>
            <label htmlFor="contact-position" className={labelClass}>
              Position
            </label>
            <input
              id="contact-position"
              type="text"
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
              className={`mt-1 ${errors.position ? inputErrorClass : inputClass}`}
              autoComplete="organization-title"
              placeholder="i.e., architect, builder, buyer, homeowner"
              aria-invalid={errors.position ? true : undefined}
              aria-describedby={errors.position ? "contact-position-error" : undefined}
            />
            <FieldError id="contact-position-error" message={errors.position} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-start">
          <div className="min-w-0">
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={`mt-1 ${errors.email || errors.contact ? inputErrorClass : inputClass}`}
              autoComplete="email"
              aria-invalid={errors.email || errors.contact ? true : undefined}
              aria-describedby={
                errors.email || errors.contact ? "contact-email-error" : undefined
              }
            />
            <FieldError id="contact-email-error" message={errors.email || errors.contact} />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone number
            </label>
            <div className="mt-1 flex w-fit">
              <CountryCodeSelect
                value={form.countryCode}
                hasError={Boolean(errors.contact)}
                onChange={(nextCode) => {
                  setForm((prev) => ({
                    ...prev,
                    countryCode: nextCode,
                    phone: formatPhoneForCountry(prev.phone, nextCode),
                  }));
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.contact;
                    return next;
                  });
                }}
              />
              <input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) =>
                  update("phone", formatPhoneForCountry(e.target.value, form.countryCode))
                }
                className={`w-[9.5rem] rounded-r border border-l-0 px-2.5 py-2 text-neutral-900 focus:z-10 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20] ${
                  errors.contact ? "border-primary" : "border-neutral-300"
                }`}
                autoComplete="tel-national"
                maxLength={usesNanpFormat(form.countryCode) ? 14 : 15}
                size={14}
                aria-invalid={errors.contact ? true : undefined}
                aria-describedby={errors.contact ? "contact-phone-error" : undefined}
              />
            </div>
            <FieldError
              id="contact-phone-error"
              message={errors.contact && !errors.email ? errors.contact : undefined}
            />
          </div>
          <div>
            <span className={labelClass}>Preferred contact method</span>
            <div className="mt-2 flex flex-row gap-5 sm:mt-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                <input
                  type="radio"
                  name="contact-pref"
                  checked={form.preferredMethod === "email"}
                  onChange={() => update("preferredMethod", "email")}
                  className="h-4 w-4 text-[#9f1b20] focus:ring-[#9f1b20]"
                />
                Email
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                <input
                  type="radio"
                  name="contact-pref"
                  checked={form.preferredMethod === "phone"}
                  onChange={() => update("preferredMethod", "phone")}
                  className="h-4 w-4 text-[#9f1b20] focus:ring-[#9f1b20]"
                />
                Phone
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <button type="submit" className={btnPrimary} disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
