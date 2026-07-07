"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ELEVATE_SECTION, WHY_CHOOSE_BENEFITS, WHY_CHOOSE_SECTION } from "@/data/home-sections";

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
        className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50"
        aria-labelledby="elevate-heading"
      >
        <div className="mx-auto flex min-h-[min(88vh,920px)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <p className="text-primary text-sm font-medium tracking-wide">
                {ELEVATE_SECTION.eyebrow}
              </p>
              <h2
                id="elevate-heading"
                className="mt-4 text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]"
              >
                {ELEVATE_SECTION.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
                {ELEVATE_SECTION.description}
              </p>
              <div className="mt-10">
                <Link
                  href="/product-info/material-details"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Explore material details
                </Link>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
              {ELEVATE_SECTION.highlights.map((item, index) => (
                <Reveal key={item.label} delay={0.08 + index * 0.1}>
                  <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-xs font-semibold tracking-wide text-neutral-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-3xl font-medium tracking-tight text-primary md:text-4xl">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.detail}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-choose"
        className="scroll-mt-24 border-t border-neutral-200 bg-white"
        aria-labelledby="why-choose-heading"
      >
        <div className="mx-auto min-h-[min(88vh,920px)] max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-primary text-sm font-medium tracking-wide">
              {WHY_CHOOSE_SECTION.eyebrow}
            </p>
            <h2
              id="why-choose-heading"
              className="mt-4 text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl"
            >
              {WHY_CHOOSE_SECTION.title}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
            {WHY_CHOOSE_BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.title} delay={0.1 + index * 0.1}>
                <article className="group h-full rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-md lg:p-8">
                  <div className="mb-5 h-1 w-10 rounded-full bg-primary transition-all duration-300 group-hover:w-14" />
                  <h3 className="text-lg font-semibold text-primary">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
                    {benefit.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
