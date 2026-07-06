import Link from "next/link";
import { HeroImageCycler } from "@/components/HeroImageCycler";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen">

      {/* Hero */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden">
        <HeroImageCycler />
        {/* Overlay: (1) even haze so image isn’t too strong; (2) gradient stronger at BOTTOM so text has a clear fade, lighter at TOP so image shows. to-t = from=bottom, to=top. */}
        <div className="absolute inset-0 z-[2] bg-white/40" aria-hidden />
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-white/95 via-white/70 to-white/15" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 pb-24 pt-32 sm:px-6">
          <p className="text-primary text-sm uppercase tracking-[0.35em] mb-4 font-medium">
            Custom Flexible Moulding
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans tracking-tight text-neutral-900 max-w-4xl leading-[1.08]">
            Curved trim made easy
          </h1>
          <ul className="mt-8 max-w-4xl list-none space-y-3 pl-0 text-base text-neutral-600 leading-relaxed md:text-lg">
            <li className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>Shop over 250 stock items ready for immediate shipping</span>
            </li>
            <li className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>Explore 40,000 (and growing) profiles already tooled for custom applications</span>
            </li>
            <li className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>Replicate any unique profile with precision for a seamless, simple installation</span>
            </li>
          </ul>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/quote-request"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/product-info/profile-search"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Browse All Profiles
            </Link>
            <Link
              href="/ordering-installation/dealer-search"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Find a Dealer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
