"use client";

import Image from "next/image";
import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { RegionalContacts } from "@/components/RegionalContacts";

type FooterProps = {
  /** When true, render a half-inch-tall strip (e.g. on gallery pages). */
  compact?: boolean;
};

export function Footer({ compact }: FooterProps) {
  if (compact) {
    return (
      <footer className="border-t border-neutral-200 bg-neutral-50 print:hidden" style={{ minHeight: "0.5in" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6" style={{ minHeight: "0.5in" }}>
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} Flex Trim™</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/flex-trim.svg"
              alt="Flex Trim™"
              width={100}
              height={36}
              className="h-7 w-auto"
            />
            <span className="text-neutral-300">|</span>
            <Image
              src="/logos/carter-millwork.svg"
              alt="Carter Millwork"
              width={140}
              height={36}
              className="h-7 w-auto"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-600">
            <Link href="/product-info/browse-select-profiles" className="hover:text-[#9f1b20]">
              Browse select profiles
            </Link>
            <Link href="/ordering-installation/flex-trim-toolbox" className="hover:text-[#9f1b20]">
              Flex Trim Toolbox
            </Link>
            <Link href="/ordering-installation/dealer-search" className="hover:text-[#9f1b20]">
              Dealer search
            </Link>
            <ContactLink className="hover:text-[#9f1b20]">Contact us</ContactLink>
          </div>
        </div>
        <div className="mt-5 border-t border-neutral-200 pt-4 text-neutral-500">
          <RegionalContacts compact />
        </div>
        <p className="mt-4 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Flex Trim™. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
