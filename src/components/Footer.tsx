import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  /** When true, render a half-inch-tall strip (e.g. on gallery pages). */
  compact?: boolean;
};

export function Footer({ compact }: FooterProps) {
  if (compact) {
    return (
      <footer className="border-t border-neutral-200 bg-neutral-50" style={{ minHeight: "0.5in" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6" style={{ minHeight: "0.5in" }}>
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} Flex Trim</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/flex-trim.svg"
              alt="Flex Trim"
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
            <Link href="/product-info/profile-search" className="hover:text-[#9f1b20]">Browse All Profiles</Link>
            <Link href="/ordering-installation/radius-calculator" className="hover:text-[#9f1b20]">Radius Calculator</Link>
            <Link href="/ordering-installation/dealer-search" className="hover:text-[#9f1b20]">Dealer Search</Link>
            <Link href="/contact-us" className="hover:text-[#9f1b20]">Contact Us</Link>
          </div>
        </div>
        <div className="mt-8 grid gap-8 border-t border-neutral-200 pt-8 text-sm text-neutral-600 md:grid-cols-2">
          <div>
            <p className="font-medium text-neutral-800">Flex Trim East</p>
            <p>117 Cedar Lane Drive, Lexington, NC 27292</p>
            <p>Phone: <a href="tel:8008610734" className="text-[#9f1b20] hover:underline">(800) 861-0734</a> · Fax: (800) 861-0737</p>
            <p>Email: <a href="mailto:sales@flextrim.com" className="text-[#9f1b20] hover:underline">sales@flextrim.com</a></p>
          </div>
          <div>
            <p className="font-medium text-neutral-800">Flex Trim West</p>
            <p>533 South 500 West, Provo, UT 84601</p>
            <p>Phone: <a href="tel:8778774595" className="text-[#9f1b20] hover:underline">(877) 877-4595</a> · Fax: (877) 865-1660</p>
            <p>Email: <a href="mailto:orders@flextrim.com" className="text-[#9f1b20] hover:underline">orders@flextrim.com</a></p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Flex Trim. All rights reserved.</p>
      </div>
    </footer>
  );
}
