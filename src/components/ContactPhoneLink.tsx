"use client";

import { contactsForAssignment } from "@/data/facility-contacts";
import { useGeoRegion } from "@/hooks/useGeoRegion";

type ContactPhoneLinkProps = {
  className?: string;
};

/** Shows/dials the phone number(s) for the visitor's regional facility. */
export function ContactPhoneLink({ className }: ContactPhoneLinkProps) {
  const { region } = useGeoRegion();
  const contacts = contactsForAssignment(region);

  if (contacts.length === 1) {
    const contact = contacts[0];
    return (
      <a href={`tel:${contact.phoneTel}`} className={className}>
        {contact.phoneDisplay}
      </a>
    );
  }

  return (
    <span className={className}>
      {contacts.map((contact, index) => (
        <span key={contact.region}>
          {index > 0 ? " or " : null}
          <a href={`tel:${contact.phoneTel}`} className="hover:underline">
            {contact.phoneDisplay}
          </a>
          <span className="text-neutral-500"> ({contact.label.replace("Flex Trim ", "")})</span>
        </span>
      ))}
    </span>
  );
}
