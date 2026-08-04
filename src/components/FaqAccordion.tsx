"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { FaqCategory, FaqItem } from "@/data/faq";

type FaqAccordionProps = {
  categories: FaqCategory[];
  footer?: ReactNode;
};

function itemMatchesQuery(item: FaqItem, query: string): boolean {
  const haystack = [
    item.question,
    ...item.answer,
    item.stepsHeading ?? "",
    ...(item.steps?.flatMap((step) => [step.title, step.body]) ?? []),
    ...(item.links?.map((link) => link.label) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function FaqItemRow({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const panelId = `${item.id}-panel`;
  const buttonId = `${item.id}-button`;

  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 py-4 text-left text-base font-medium text-neutral-900 transition-colors hover:text-primary sm:text-[1.05rem]"
        >
          <span>{item.question}</span>
          <svg
            className={`mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className={open ? "pb-5" : undefined}
      >
        <div className="space-y-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
          {item.answer.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {item.steps && item.steps.length > 0 ? (
            <div>
              {item.stepsHeading ? (
                <p className="font-medium text-neutral-900">{item.stepsHeading}</p>
              ) : null}
              <ol className="mt-2 list-decimal space-y-2 pl-5">
                {item.steps.map((step) => (
                  <li key={step.title}>
                    <span className="font-medium text-neutral-900">{step.title}:</span> {step.body}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {item.links && item.links.length > 0 ? (
            <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {item.links.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="font-medium text-primary hover:underline">
                  {link.label}
                </Link>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ categories, footer }: FaqAccordionProps) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(categories[0]?.items[0]?.id ?? null);

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const visibleCategories = !isSearching
    ? categories
    : categories
        .filter((category) => !category.excludeFromSearch)
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => itemMatchesQuery(item, normalizedQuery)),
        }))
        .filter((category) => category.items.length > 0);

  const navCategories = isSearching
    ? visibleCategories.filter((category) => category.showInNav !== false)
    : categories.filter((category) => category.showInNav !== false);

  return (
    <div className="space-y-10 not-prose">
      <div className="mx-auto w-full max-w-xl">
        <label htmlFor="faq-search" className="sr-only">
          Search FAQ
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);

              const trimmed = nextQuery.trim().toLowerCase();
              if (!trimmed) {
                setOpenId(categories[0]?.items[0]?.id ?? null);
                return;
              }

              const firstMatch = categories
                .filter((category) => !category.excludeFromSearch)
                .flatMap((category) => category.items)
                .find((item) => itemMatchesQuery(item, trimmed));
              setOpenId(firstMatch?.id ?? null);
            }}
            placeholder="Search questions…"
            className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pr-3 pl-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoComplete="off"
          />
        </div>
      </div>

      {navCategories.length > 0 ? (
        <nav aria-label="FAQ categories" className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {navCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-primary hover:text-primary"
            >
              {category.title}
            </a>
          ))}
        </nav>
      ) : null}

      {isSearching && visibleCategories.length === 0 ? (
        <p className="text-center text-sm text-neutral-500 md:text-base">No matching questions.</p>
      ) : (
        visibleCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-heading`}
            className="scroll-mt-24"
          >
            <h2
              id={`${category.id}-heading`}
              className="border-b border-neutral-200 pb-3 text-xl font-semibold tracking-tight text-neutral-900"
            >
              {category.title}
            </h2>
            <div className="mt-1">
              {category.items.map((item) => (
                <FaqItemRow
                  key={item.id}
                  item={item}
                  open={openId === item.id}
                  onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {footer}
    </div>
  );
}
