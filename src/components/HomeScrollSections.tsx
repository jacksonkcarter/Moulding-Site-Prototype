"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ELEVATE_SECTION } from "@/data/home-sections";

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
        <div className="mx-auto flex min-h-[min(72vh,760px)] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.15fr)_auto] lg:gap-12 xl:gap-14">
            <Reveal delay={0.08} className="order-2 justify-self-center lg:order-1 lg:justify-self-stretch">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:max-w-none lg:min-h-[28rem]">
                <Image
                  src="/home/gothic.jpg"
                  alt="Gothic arched windows with flexible moulding in a finished interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 24rem, 28vw"
                  priority
                />
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <p className="text-primary text-sm font-medium tracking-wide">
                {ELEVATE_SECTION.eyebrow}
              </p>
              <h2
                id="elevate-heading"
                className="mt-4 text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]"
              >
                {ELEVATE_SECTION.title}
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-600 md:text-lg">
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

            <div className="order-3 grid w-full max-w-xs gap-4 justify-self-center sm:max-w-none sm:grid-cols-3 sm:justify-self-stretch lg:w-56 lg:max-w-none lg:grid-cols-1 lg:justify-self-end lg:gap-5">
              {ELEVATE_SECTION.highlights.map((item, index) => (
                <Reveal key={item.label} delay={0.12 + index * 0.08}>
                  <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
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
    </>
  );
}
