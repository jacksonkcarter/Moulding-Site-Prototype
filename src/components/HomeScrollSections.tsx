"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ELEVATE_SECTION } from "@/data/home-sections";
const casinoImage = "/gallery/curved-walls/FlexTrim-ec07d2.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={fadeUp}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HomeScrollSections() {
  return (
    <>
      <section
        id="elevate"
        className="scroll-mt-24 border-t border-neutral-200 bg-white"
        aria-labelledby="elevate-heading"
      >
        <div className="mx-auto flex min-h-[min(60vh,640px)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-14">
            <Reveal delay={0.08} className="order-2 justify-self-center lg:order-1 lg:justify-self-stretch">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:max-w-none">
                <Image
                  src={casinoImage}
                  alt="Casino interior featuring curved walls, columns, and flexible moulding"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 36rem, 38vw"
                  priority
                />
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <h2
                id="elevate-heading"
                className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]"
              >
                {ELEVATE_SECTION.title}
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-600 md:text-lg">
                {ELEVATE_SECTION.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/products/product-overview"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Explore applications
                </Link>
                <Link
                  href="/products/material-details"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Learn about our materials
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  See it installed
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
