"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MATERIAL_UPGRADES,
  type MaterialUpgradeEmblem,
} from "@/data/material-upgrades";

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

function EmblemIcon({
  emblem,
  className,
}: {
  emblem: MaterialUpgradeEmblem;
  className?: string;
}) {
  switch (emblem) {
    case "flexibility":
      // Sideways S-curve
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path
            d="M3.5 7C7.5 7 7.5 17 12 17C16.5 17 16.5 7 20.5 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "feather":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- static emblem asset
        <img
          src="/emblems/feather.png?v=3"
          alt=""
          aria-hidden
          className={`object-contain ${className ?? ""}`}
        />
      );
    case "fire":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- static emblem asset
        <img
          src="/emblems/fire.png?v=1"
          alt=""
          aria-hidden
          className={`object-contain ${className ?? ""}`}
        />
      );
    case "tooling":
      // 4-blade insert cutterhead (circular body + four knife inserts)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <g fill="currentColor" fillRule="evenodd">
            <path d="M12 2.15A9.85 9.85 0 1 0 21.85 12 9.85 9.85 0 0 0 12 2.15Zm0 5.95a3.9 3.9 0 1 0 3.9 3.9A3.9 3.9 0 0 0 12 8.1Z" />
          </g>
          {[0, 90, 180, 270].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg} 12 12)`}
              fill="currentColor"
              d="M6.55 1.9h8.95l.4 2.95H9.55L6.55 3.4Z"
            />
          ))}
        </svg>
      );
    case "spiral":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- static emblem asset
        <img
          src="/emblems/spiral.png?v=1"
          alt=""
          aria-hidden
          className={`object-contain ${className ?? ""}`}
        />
      );
  }
}

export function MaterialUpgradeCards() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ul
      className="mt-5 grid list-none items-start gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
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
                className="group relative flex w-full flex-col p-5 text-left"
              >
                <span className="absolute top-5 right-5">
                  <ChevronIcon open={isOpen} />
                </span>
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-primary/15 text-primary"
                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                    }`}
                  >
                    <EmblemIcon emblem={item.emblem} className="h-9 w-9" />
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold leading-tight text-neutral-900 sm:text-[15px]">
                    {item.title}
                  </p>
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
                      {item.products?.length ? (
                        item.learnMoreHref ? (
                          <Link
                            href={item.learnMoreHref}
                            className="block space-y-0.5 text-sm font-semibold text-primary hover:underline md:text-base"
                          >
                            {item.products.map((name, index) => {
                              const total = item.products!.length;
                              const label =
                                total > 1 && index < total - 1 ? `${name},` : name;
                              return (
                                <span key={name} className="block">
                                  {label}
                                </span>
                              );
                            })}
                          </Link>
                        ) : (
                          <div className="space-y-0.5 text-sm font-semibold text-primary md:text-base">
                            {item.products.map((name, index) => {
                              const total = item.products!.length;
                              const label =
                                total > 1 && index < total - 1 ? `${name},` : name;
                              return (
                                <p key={name}>{label}</p>
                              );
                            })}
                          </div>
                        )
                      ) : null}
                      <p
                        className={`text-sm leading-relaxed text-neutral-600 ${
                          item.products?.length ? "mt-2" : ""
                        }`}
                      >
                        {item.description}
                      </p>
                      {item.footnotes?.length ? (
                        <div className="mt-3 space-y-2">
                          {item.footnotes.map((note) => (
                            <p key={note} className="text-xs leading-relaxed text-neutral-500">
                              {note}
                            </p>
                          ))}
                        </div>
                      ) : item.footnote ? (
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
