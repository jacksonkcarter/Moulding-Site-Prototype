"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Hold on hero images before the panel appears */
const IMAGES_ONLY = 0.5;
const FADE = 1.7;
const LINE_GAP = 0.36;
/** Pause after the headline before Shop / Browse / Replicate */
const AFTER_HEADLINE = 0.25;
/** Pause after the three lines before the buttons */
const AFTER_LINES = 0.25;

const headlineDelay = IMAGES_ONLY;
const linesDelay = headlineDelay + FADE + AFTER_HEADLINE;
const buttonsDelay = linesDelay + FADE + 2 * LINE_GAP + AFTER_LINES;

function fadeUp(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: FADE, delay, ease },
    },
  };
}

export function HeroCtaPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, delay: IMAGES_ONLY, ease }}
      className="absolute inset-x-0 bottom-0 z-10 ml-auto w-full max-w-4xl rounded-tl-[0.5in] bg-white/[0.91] px-6 pt-4 pb-8 shadow-sm sm:inset-x-auto sm:right-0 sm:px-8 sm:pt-5 sm:pb-10"
    >
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp(headlineDelay)}
        className="font-sans text-4xl leading-[1.08] tracking-tight text-neutral-900 md:text-6xl lg:text-7xl"
      >
        Curved trim made easy
      </motion.h1>
      <ul className="mt-8 list-none space-y-4 pl-0 text-base leading-relaxed text-neutral-600 md:text-lg">
        <motion.li
          initial="hidden"
          animate="visible"
          variants={fadeUp(linesDelay)}
          className="flex items-center gap-3"
        >
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
        </motion.li>
        <motion.li
          initial="hidden"
          animate="visible"
          variants={fadeUp(linesDelay + LINE_GAP)}
          className="flex items-center gap-3"
        >
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
        </motion.li>
        <motion.li
          initial="hidden"
          animate="visible"
          variants={fadeUp(linesDelay + 2 * LINE_GAP)}
          className="flex items-center gap-3"
        >
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
        </motion.li>
      </ul>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp(buttonsDelay)}
        className="mt-12 flex flex-wrap items-center gap-4"
      >
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
      </motion.div>
    </motion.div>
  );
}
