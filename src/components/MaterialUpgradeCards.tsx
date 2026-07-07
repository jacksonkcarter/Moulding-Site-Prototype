"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MATERIAL_UPGRADES } from "@/data/material-upgrades";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function MaterialUpgradeCards() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ul
      className="mt-5 grid list-none items-start gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Specialized material upgrade benefits"
    >
      {MATERIAL_UPGRADES.map((item) => {
        const isOpen = expanded === item.title;

        return (
          <li key={item.title} className="min-w-0">
            <div
              className={`rounded-2xl border shadow-sm transition-all duration-300 ${
                isOpen
                  ? "border-primary/40 bg-white shadow-md ring-1 ring-primary/10"
                  : "border-neutral-200 bg-gradient-to-br from-white via-white to-neutral-50 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.title)}
                aria-expanded={isOpen}
                className="group flex w-full flex-col p-5 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? "bg-primary/15" : "bg-primary/10 group-hover:bg-primary/15"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    </div>
                    <p className="min-w-0 text-sm font-semibold leading-snug text-neutral-900 md:text-base">
                      {item.title}
                    </p>
                  </div>
                  <ChevronIcon open={isOpen} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-neutral-200 px-5 pb-5 pt-4">
                      {item.product ? (
                        <p className="text-sm font-semibold text-primary md:text-base">{item.product}</p>
                      ) : null}
                      <p className={`text-sm leading-relaxed text-neutral-600 ${item.product ? "mt-2" : ""}`}>
                        {item.description}
                      </p>
                      {item.footnote ? (
                        <p className="mt-3 text-xs leading-relaxed text-neutral-500">{item.footnote}</p>
                      ) : null}
                      {item.learnMoreHref ? (
                        <Link
                          href={item.learnMoreHref}
                          className="mt-4 flex w-full items-center justify-center rounded-full border-2 border-primary px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          Learn more
                        </Link>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
