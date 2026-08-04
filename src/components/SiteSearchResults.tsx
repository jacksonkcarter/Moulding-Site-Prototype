"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { groupSearchResults, searchSite } from "@/lib/site-search";

type SiteSearchResultsProps = {
  initialQuery: string;
};

export function SiteSearchResults({ initialQuery }: SiteSearchResultsProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => searchSite(query, 75), [query]);
  const groups = useMemo(() => groupSearchResults(results), [results]);

  return (
    <div className="space-y-8 not-prose">
      <form
        className="mx-auto flex w-full max-w-xl gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const next = query.trim();
          router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
        }}
      >
        <label htmlFor="site-search-q" className="sr-only">
          Search the site
        </label>
        <input
          id="site-search-q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, stock items, FAQ…"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8a171b]"
        >
          Search
        </button>
      </form>

      {!query.trim() ? (
        <p className="text-center text-sm text-neutral-500 md:text-base">
          Enter a term to search pages, products, stock items, profiles, and FAQ.
        </p>
      ) : results.length === 0 ? (
        <p className="text-center text-sm text-neutral-500 md:text-base">
          No results for &ldquo;{query.trim()}&rdquo;. Try a product name, profile type, or topic.
        </p>
      ) : (
        <div className="space-y-8">
          <p className="text-sm text-neutral-500">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query.trim()}&rdquo;
          </p>
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={`search-${group.category}`}>
              <h2
                id={`search-${group.category}`}
                className="border-b border-neutral-200 pb-2 text-lg font-semibold tracking-tight text-neutral-900"
              >
                {group.category}
              </h2>
              <ul className="mt-3 divide-y divide-neutral-100">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-2 py-3 transition-colors hover:bg-neutral-50"
                    >
                      <p className="font-medium text-neutral-900">{item.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">{item.description}</p>
                      <p className="mt-1 text-xs text-primary">{item.href}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
