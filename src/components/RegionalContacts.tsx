"use client";

import { useEffect } from "react";
import {
  FACILITY_CONTACT_ORDER,
  FACILITY_CONTACTS,
  getFacilityContact,
  type FacilityContact,
  parseFacilityAssignment,
} from "@/data/facility-contacts";
import type { FacilityAssignment } from "@/data/state-facility-map";
import { facilityRegionsForAssignment } from "@/lib/state-facility";
import { useGeoRegion } from "@/hooks/useGeoRegion";

function FacilityContactBlock({
  contact,
  emphasized,
  dense = false,
  sideBySide = false,
}: {
  contact: FacilityContact;
  emphasized: boolean;
  dense?: boolean;
  sideBySide?: boolean;
}) {
  const compactType = dense || sideBySide;
  return (
    <section
      id={`facility-${contact.region}`}
      className={
        sideBySide
          ? emphasized
            ? "scroll-mt-28 w-full rounded-lg border-2 border-primary bg-red-50/40 px-4 py-3"
            : "scroll-mt-28 w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-4 py-3 opacity-90"
          : dense
            ? emphasized
              ? "w-fit max-w-full scroll-mt-28 rounded-lg border-2 border-primary bg-red-50/40 px-3 py-2.5"
              : "w-fit max-w-full scroll-mt-28 rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2.5 opacity-90"
            : emphasized
              ? "scroll-mt-28 rounded-xl border-2 border-primary bg-red-50/40 px-5 py-5"
              : "scroll-mt-28 rounded-xl border border-neutral-200 bg-neutral-50/60 px-5 py-5 opacity-90"
      }
    >
      <div className="space-y-0.5">
        <h2
          className={`font-medium text-neutral-900 ${
            compactType ? "text-base" : emphasized ? "text-xl" : "text-lg"
          }`}
        >
          {contact.label}
        </h2>
        {emphasized ? (
          <span
            className={`block font-semibold tracking-wide text-primary uppercase ${
              compactType ? "text-[10px]" : "text-xs"
            }`}
          >
            Serving your area
          </span>
        ) : (
          <span
            className={`block font-medium tracking-wide text-neutral-500 uppercase ${
              compactType ? "text-[10px]" : "text-xs"
            }`}
          >
            Other location
          </span>
        )}
      </div>
      {sideBySide ? (
        <p className={`text-neutral-600 ${compactType ? "mt-1 text-sm leading-snug" : "mt-2"}`}>
          {contact.addressLines.join(", ")}
        </p>
      ) : (
        contact.addressLines.map((line) => (
          <p key={line} className={`text-neutral-600 ${dense ? "mt-0.5 text-sm leading-snug" : "mt-2"}`}>
            {line}
          </p>
        ))
      )}
      <p className={`text-neutral-600 ${compactType ? "mt-1 text-sm leading-snug" : "mt-1"}`}>
        <a href={`tel:${contact.phoneTel}`} className="text-primary hover:underline">
          {contact.phoneDisplay}
        </a>
      </p>
      {contact.emails.map((email) => (
        <p key={email} className={`text-neutral-600 ${compactType ? "text-sm leading-snug" : ""}`}>
          <a href={`mailto:${email}`} className="text-primary hover:underline">
            {email}
          </a>
        </p>
      ))}
    </section>
  );
}

function FooterFacilityLine({
  contact,
  emphasized,
}: {
  contact: FacilityContact;
  emphasized: boolean;
}) {
  const labelClass = emphasized ? "font-medium text-neutral-700" : "font-medium text-neutral-500";
  const bodyClass = emphasized ? "text-neutral-600" : "text-neutral-400";
  const linkClass = emphasized
    ? "text-primary hover:underline"
    : "hover:text-neutral-600 hover:underline";

  return (
    <div className={bodyClass}>
      {/* Mobile: label, address, phone, and emails each on their own line */}
      <div className="flex flex-col gap-0.5 sm:hidden">
        <p className={labelClass}>{contact.label}</p>
        <p>{contact.addressLines.join(", ")}</p>
        <p>
          <a href={`tel:${contact.phoneTel}`} className={linkClass}>
            {contact.phoneDisplay}
          </a>
        </p>
        <p>
          {contact.emails.map((email, index) => (
            <span key={email}>
              {index > 0 ? <span className="mx-1.5 text-neutral-300">·</span> : null}
              <a href={`mailto:${email}`} className={linkClass}>
                {email}
              </a>
            </span>
          ))}
        </p>
      </div>

      {/* Desktop: single compact line */}
      <p className="hidden sm:block">
        <span className={labelClass}>{contact.label}</span>
        <span className="mx-1.5 text-neutral-300">·</span>
        <span>{contact.addressLines.join(", ")}</span>
        <span className="mx-1.5 text-neutral-300">·</span>
        <a href={`tel:${contact.phoneTel}`} className={linkClass}>
          {contact.phoneDisplay}
        </a>
        {contact.emails.map((email) => (
          <span key={email}>
            <span className="mx-1.5 text-neutral-300">·</span>
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

type RegionalContactsProps = {
  /** Optional override from ?region= (contact page). */
  preferredRegion?: string | null;
  className?: string;
  /** Compact footer-style layout. */
  compact?: boolean;
  /** Place East and West side by side (contact page top). */
  sideBySide?: boolean;
  /** Smaller padding and type for sidebar use. */
  dense?: boolean;
};

export function RegionalContacts({
  preferredRegion = null,
  className = "",
  compact = false,
  sideBySide = false,
  dense = false,
}: RegionalContactsProps) {
  const { region: geoRegion } = useGeoRegion();
  const override = parseFacilityAssignment(preferredRegion);
  const activeAssignment: FacilityAssignment = override ?? geoRegion;
  const emphasizedRegions = new Set(facilityRegionsForAssignment(activeAssignment));

  useEffect(() => {
    if (!override) return;
    const first = facilityRegionsForAssignment(override)[0];
    if (!first) return;
    const el = document.getElementById(`facility-${first}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [override]);

  // Side-by-side: fixed East | West. Otherwise local first when geo is single-region.
  const ordered: FacilityContact[] = sideBySide
    ? FACILITY_CONTACT_ORDER.map((r) => FACILITY_CONTACTS[r])
    : activeAssignment === "shared"
      ? FACILITY_CONTACT_ORDER.map((r) => FACILITY_CONTACTS[r])
      : [
          getFacilityContact(activeAssignment),
          ...FACILITY_CONTACT_ORDER.filter((r) => r !== activeAssignment).map(
            (r) => FACILITY_CONTACTS[r]
          ),
        ];

  if (compact) {
    return (
      <div className={`space-y-1 text-[11px] leading-relaxed sm:text-xs ${className}`}>
        {ordered.map((contact) => (
          <FooterFacilityLine
            key={contact.region}
            contact={contact}
            emphasized={emphasizedRegions.has(contact.region)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activeAssignment === "shared" ? (
        <p className="text-sm text-neutral-600">
          Your area is served by both Flex Trim East and Flex Trim West.
        </p>
      ) : null}
      <div
        className={
          sideBySide
            ? "grid gap-4 sm:grid-cols-2"
            : dense
              ? "flex flex-col items-start gap-2.5"
              : "space-y-3"
        }
      >
        {ordered.map((contact) => (
          <FacilityContactBlock
            key={contact.region}
            contact={contact}
            emphasized={emphasizedRegions.has(contact.region)}
            dense={dense}
            sideBySide={sideBySide}
          />
        ))}
      </div>
    </div>
  );
}
