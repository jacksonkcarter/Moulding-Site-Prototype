import Link from "next/link";
import { HeroImageCycler } from "@/components/HeroImageCycler";
import { HeroCtaPanel } from "@/components/HeroCtaPanel";
import { HomeScrollSections } from "@/components/HomeScrollSections";
import { HomeBenefitTiles } from "@/components/HomeBenefitTiles";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <HeroImageCycler />
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="flex justify-end">
            <div className="w-full max-w-4xl">
              <HeroCtaPanel />
            </div>
          </div>
          <aside
            aria-label="Get started with flexible moulding"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 bg-primary px-4 py-3 sm:px-6 sm:py-3.5"
          >
            <p className="text-base font-medium text-white md:text-lg">
              New to flexible moulding?
            </p>
            <Link
              href="/ordering-installation/how-to-order"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-transparent hover:text-white"
            >
              Start here
            </Link>
          </aside>
        </div>
      </section>

      <HomeBenefitTiles />
      <HomeScrollSections />
    </main>
  );
}
