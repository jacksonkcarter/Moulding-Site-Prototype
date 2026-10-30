import { HeroImageCycler } from "@/components/HeroImageCycler";
import { HeroCtaPanel } from "@/components/HeroCtaPanel";
import { HomeScrollSections } from "@/components/HomeScrollSections";
import { HomeBenefitTiles } from "@/components/HomeBenefitTiles";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen">
      {/*
        Hero fills the first viewport minus header and a reserved band so
        "Why choose Flex Trim™?" stays visible without scrolling (short laptops).
      */}
      <section
        className="relative min-h-[20rem] overflow-hidden"
        style={{
          height:
            "calc(100dvh - var(--header-offset) - var(--home-benefits-title-peek))",
        }}
      >
        <HeroImageCycler />
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="flex justify-end">
            <div className="w-fit max-w-full">
              <HeroCtaPanel />
            </div>
          </div>
        </div>
      </section>

      <HomeBenefitTiles />
      <HomeScrollSections />
    </main>
  );
}
