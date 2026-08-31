import { HeroImageCycler } from "@/components/HeroImageCycler";
import { HeroCtaPanel } from "@/components/HeroCtaPanel";
import { HomeScrollSections } from "@/components/HomeScrollSections";
import { HomeBenefitTiles } from "@/components/HomeBenefitTiles";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen">

      {/* Hero */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <HeroImageCycler />
        <HeroCtaPanel />
      </section>

      <HomeBenefitTiles />
      <HomeScrollSections />
    </main>
  );
}
