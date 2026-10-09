"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { PRODUCT_APPLICATIONS } from "@/data/product-applications";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Page-load fade shared by the intro copy and application images. */
function IntroFade({
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-triggered reveal for application text only. */
function TextReveal({
  children,
  className = "",
  delay = 0,
  x = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ProductApplicationShowcase() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pt-5" aria-labelledby="product-overview-heading">
      <IntroFade>
        <h1
          id="product-overview-heading"
          className="text-center text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]"
        >
          Built for every curve in your design
        </h1>
        <p className="mt-6 text-left text-sm leading-relaxed text-neutral-700 md:text-base">
          Crafted from strong, long-lasting polyurethane, Carter Millwork flexible moulding adapts where rigid wood
          cannot. It outperforms traditional wood alternatives such as polyester, foam, rubber, and PVC across all curved
          applications. Our precise process perfectly replicates the most complex profiles, decorative architectural accessories,
          and wood grain patterns to achieve a flawless end-result.
        </p>
      </IntroFade>

      <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24 lg:space-y-28">
        {PRODUCT_APPLICATIONS.map((application, index) => {
          const imageFirst = index % 2 === 0;
          const textRevealX = imageFirst ? 40 : -40;

          return (
            <article
              key={application.id}
              className={`flex flex-col items-center gap-8 lg:gap-10 xl:gap-12 ${
                imageFirst ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <IntroFade delay={0.08 + index * 0.04} className="w-full lg:w-2/3 [overflow-anchor:none]">
                <div className="group relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200/80">
                  <div className="relative aspect-[2/1] w-full">
                    <Image
                      src={application.image}
                      alt={application.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority={index === 0}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </IntroFade>

              <TextReveal x={textRevealX} delay={0.12} className="w-full lg:w-1/3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
                    {application.title}
                  </h3>
                  <div className="mt-4 h-1 w-10 rounded-full bg-primary transition-all duration-500" />
                  <p className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                    {application.description}
                  </p>
                  <Link
                    href="/gallery/applications"
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
                  >
                    See more
                    <span
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </div>
              </TextReveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
