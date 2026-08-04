import Link from "next/link";
import { HeroImageCycler } from "@/components/HeroImageCycler";
import { HomeScrollSections } from "@/components/HomeScrollSections";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen">

      {/* Hero */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <HeroImageCycler />
        <div className="absolute inset-x-0 bottom-0 z-10 ml-auto w-full max-w-4xl rounded-tl-[0.75in] bg-white/[0.91] px-6 py-8 shadow-sm sm:inset-x-auto sm:right-0 sm:px-8 sm:py-10">
            <p className="mb-4 text-sm font-medium tracking-wide text-primary">
              Custom flexible moulding
            </p>
            <h1 className="font-sans text-4xl leading-[1.08] tracking-tight text-neutral-900 md:text-6xl lg:text-7xl">
              Curved trim made easy
            </h1>
            <ul className="mt-8 list-none space-y-4 pl-0 text-base leading-relaxed text-neutral-600 md:text-lg">
              <li className="flex items-center gap-3">
                <Link
                  href="/product-info/browse-stock-items"
                  aria-label="Shop stock items"
                  className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-white shadow-sm transition hover:bg-primary-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span>
                  <Link href="/product-info/browse-stock-items" className="font-medium text-primary underline-offset-2 hover:underline">
                    Shop
                  </Link>{" "}
                  over 250 stock items ready for immediate shipping
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Link
                  href="/product-info/browse-select-profiles"
                  aria-label="Browse select profiles"
                  className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-white shadow-sm transition hover:bg-primary-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span>
                  <Link href="/product-info/browse-select-profiles" className="font-medium text-primary underline-offset-2 hover:underline">
                    Browse
                  </Link>{" "}
                  a selection of our 40,000 (and growing) profiles already tooled for custom applications
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Link
                  href="/product-info/replicate-custom-profiles"
                  aria-label="Replicate custom profiles"
                  className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-white shadow-sm transition hover:bg-primary-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span>
                  <Link href="/product-info/replicate-custom-profiles" className="font-medium text-primary underline-offset-2 hover:underline">
                    Replicate
                  </Link>{" "}
                  any unique profile with precision for a seamless, simple installation
                </span>
              </li>
            </ul>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/product-info/product-overview"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Explore applications
              </Link>
              <Link
                href="/gallery/applications"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                See it installed
              </Link>
              <div className="flex flex-wrap items-center gap-4 sm:ml-auto">
                <p className="text-base font-medium text-neutral-800">New to flexible moulding?</p>
                <Link
                  href="/ordering-installation/how-to-order"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Start here
                </Link>
              </div>
            </div>
        </div>
      </section>

      <HomeScrollSections />
    </main>
  );
}
