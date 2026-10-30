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
      <footer
        className="shrink-0 border-t border-neutral-200 bg-neutral-50 print:hidden"
        style={{ minHeight: "var(--gallery-footer-offset)" }}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6"
          style={{ minHeight: "var(--gallery-footer-offset)" }}
        >
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} Flex Trim™</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex shrink-0 items-center justify-center gap-3 sm:justify-start">
            <Image
              src="/logos/flex-trim.jpg"
              alt="Flex Trim™"
              width={852}
              height={181}
              unoptimized
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
          <div className="flex items-center justify-center gap-[17px] sm:justify-end sm:gap-[21px]">
            <Image
              src="/logos/awi.png"
              alt="Architectural Woodwork Institute"
              width={415}
              height={150}
              unoptimized
              className="h-10 w-auto shrink-0"
            />
            <p className="max-w-[32rem] text-left text-sm text-neutral-600">
              Flex Trim™ / Carter Millwork Inc. is a proud AWI Supplier Member since
              2012 providing curved moulding solutions to architectural woodworkers
              nationwide.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4 text-sm text-neutral-600 sm:flex-row sm:gap-6">
          <div className="flex flex-col gap-2">
            <Link href="/products/browse-stock-items" className="hover:text-[#9f1b20]">
              Quick-ship stock items
            </Link>
            <Link href="/products/browse-select-profiles" className="hover:text-[#9f1b20]">
              Production-ready profiles
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/ordering/length-and-radius-calculator" className="hover:text-[#9f1b20]">
              Length and radius calculator
            </Link>
            <Link href="/ordering/how-to-measure" className="hover:text-[#9f1b20]">
              How to measure
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/ordering/dealer-search" className="hover:text-[#9f1b20]">
              Find a dealer
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
