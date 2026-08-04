"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  contactUsHref,
  contactsForAssignment,
  FACILITY_CONTACTS,
  type FacilityContact,
} from "@/data/facility-contacts";
import { useGeoRegion } from "@/hooks/useGeoRegion";

type ContactLinkBase = {
  children: ReactNode;
  className?: string;
};

type ContactPageLinkProps = ContactLinkBase &
  Omit<ComponentProps<typeof Link>, "href" | "children" | "className"> & {
    /** Navigate to the full Contact us page (shows all locations). */
    action?: "page";
  };

type ContactPopoverLinkProps = ContactLinkBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "type"> & {
    /** Open a compact popup with the local facility only. */
    action: "popover";
  };

export type ContactLinkProps = ContactPageLinkProps | ContactPopoverLinkProps;

function FacilityPopupCard({ contact }: { contact: FacilityContact }) {
  return (
    <div className="space-y-1 text-left text-sm text-neutral-600">
      <p className="font-semibold text-neutral-900">{contact.label}</p>
      {contact.addressLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p>
        Phone:{" "}
        <a href={`tel:${contact.phoneTel}`} className="font-medium text-primary hover:underline">
          {contact.phoneDisplay}
        </a>
      </p>
      <p>
        Email:{" "}
        <a href={`mailto:${contact.email}`} className="font-medium text-primary hover:underline">
          {contact.email}
        </a>
      </p>
    </div>
  );
}

function ContactPopover({
  children,
  className,
  ...buttonProps
}: ContactLinkBase & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "type">) {
  const { region, ready } = useGeoRegion();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const contacts = contactsForAssignment(region);
  const otherContact =
    region === "east" ? FACILITY_CONTACTS.west : region === "west" ? FACILITY_CONTACTS.east : null;
  const isChromeButton = /\binline-flex\b|\bborder-2\b/.test(className ?? "");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={[
          "cursor-pointer",
          isChromeButton
            ? null
            : "border-0 bg-transparent p-0 font-[inherit] text-inherit",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        {...buttonProps}
      >
        {children}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close contact details"
            onClick={() => setOpen(false)}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative z-10 w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-5 shadow-xl outline-none"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-900">
                Talk with a specialist
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-1 text-sm text-neutral-500">
              {!ready
                ? "Finding the best team for you…"
                : contacts.length > 1
                  ? "You can reach either of these teams:"
                  : "Reach your local Flex Trim™ team:"}
            </p>

            <div className="mt-4 space-y-4">
              {contacts.map((contact) => (
                <FacilityPopupCard key={contact.region} contact={contact} />
              ))}
            </div>

            <p className="mt-5 border-t border-neutral-100 pt-4 text-sm text-neutral-500">
              {otherContact ? (
                <>
                  Prefer {otherContact.label}?{" "}
                  <Link
                    href="/contact-us"
                    className="font-medium text-primary hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    View contact info
                  </Link>
                </>
              ) : (
                <Link
                  href="/contact-us"
                  className="font-medium text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View full contact details
                </Link>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Contact CTA: full Contact us page by default, or a local-facility popover when action="popover". */
export function ContactLink(props: ContactLinkProps) {
  if (props.action === "popover") {
    const { action: _action, ...rest } = props;
    return <ContactPopover {...rest} />;
  }

  const { action: _action, children, className, ...linkProps } = props;
  const { region } = useGeoRegion();
  return (
    <Link href={contactUsHref(region)} className={className} {...linkProps}>
      {children}
    </Link>
  );
}
