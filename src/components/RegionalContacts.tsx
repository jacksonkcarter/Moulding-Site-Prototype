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
}: {
  contact: FacilityContact;
  emphasized: boolean;
}) {
  return (
    <section
      id={`facility-${contact.region}`}
      className={
        emphasized
          ? "scroll-mt-28 rounded-xl border-2 border-primary bg-red-50/40 px-5 py-5"
          : "scroll-mt-28 rounded-xl border border-neutral-200 bg-neutral-50/60 px-5 py-5 opacity-90"
      }
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={`font-medium text-neutral-900 ${emphasized ? "text-xl" : "text-lg"}`}>
          {contact.label}
        </h2>
        {emphasized ? (
          <span className="text-xs font-semibold tracking-wide text-primary uppercase">
            Serving your area
          </span>
        ) : (
          <span className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            Other location
          </span>
        )}
      </div>
      {contact.addressLines.map((line) => (
        <p key={line} className="mt-2 text-neutral-600">
          {line}
        </p>
      ))}
      <p className="mt-1 text-neutral-600">
        Phone:{" "}
        <a href={`tel:${contact.phoneTel}`} className="text-primary hover:underline">
          {contact.phoneDisplay}
        </a>
      </p>
      <p className="text-neutral-600">
        Email:{" "}
        <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
          {contact.email}
        </a>
      </p>
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
  return (
    <p className={emphasized ? "text-neutral-600" : "text-neutral-400"}>
      <span className={emphasized ? "font-medium text-neutral-700" : "font-medium text-neutral-500"}>
        {contact.label}
      </span>
      <span className="mx-1.5 text-neutral-300">·</span>
      <span>{contact.addressLines[0]}</span>
      <span className="mx-1.5 text-neutral-300">·</span>
      <a
        href={`tel:${contact.phoneTel}`}
        className={emphasized ? "text-primary hover:underline" : "hover:text-neutral-600 hover:underline"}
      >
        {contact.phoneDisplay}
      </a>
      <span className="mx-1.5 text-neutral-300">·</span>
      <a
        href={`mailto:${contact.email}`}
        className={emphasized ? "text-primary hover:underline" : "hover:text-neutral-600 hover:underline"}
      >
        {contact.email}
      </a>
    </p>
  );
}

type RegionalContactsProps = {
  /** Optional override from ?region= (contact page). */
  preferredRegion?: string | null;
  className?: string;
  /** Compact footer-style layout. */
  compact?: boolean;
};

export function RegionalContacts({
  preferredRegion = null,
  className = "",
  compact = false,
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

  // Shared: both first (east then west). Single region: local first, then the other.
  const ordered: FacilityContact[] =
    activeAssignment === "shared"
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
      <div className="space-y-4">
        {ordered.map((contact) => (
          <FacilityContactBlock
            key={contact.region}
            contact={contact}
            emphasized={emphasizedRegions.has(contact.region)}
          />
        ))}
      </div>
    </div>
  );
}
