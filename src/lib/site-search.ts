import { SITE_SEARCH_INDEX, type SiteSearchCategory, type SiteSearchEntry } from "@/data/site-search";

export type SiteSearchResult = SiteSearchEntry & {
  score: number;
};

const CATEGORY_ORDER: SiteSearchCategory[] = [
  "Pages",
  "Products",
  "Stock items",
  "Profiles",
  "FAQ",
  "Gallery",
  "Resources",
];

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9+/®™.]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function scoreEntry(entry: SiteSearchEntry, tokens: string[]): number {
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const keywords = entry.keywords.join(" ").toLowerCase();
  const haystack = `${title} ${description} ${keywords}`;

  let score = 0;

  for (const token of tokens) {
    if (title === token) score += 100;
    else if (title.startsWith(token)) score += 60;
    else if (title.includes(token)) score += 40;
    else if (keywords.includes(token)) score += 25;
    else if (description.includes(token)) score += 15;
    else if (haystack.includes(token)) score += 8;
    else return 0;
  }

  // Prefer shorter, more exact titles when scores tie closely.
  score += Math.max(0, 12 - Math.min(title.length, 12));

  return score;
}

/** Search the site index. Returns ranked matches (empty for blank queries). */
export function searchSite(query: string, limit = 50): SiteSearchResult[] {
  const tokens = tokenize(query.trim());
  if (tokens.length === 0) return [];

  return SITE_SEARCH_INDEX.map((entry) => ({
    ...entry,
    score: scoreEntry(entry, tokens),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const categoryDiff = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
      if (categoryDiff !== 0) return categoryDiff;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}

export function groupSearchResults(results: SiteSearchResult[]): {
  category: SiteSearchCategory;
  items: SiteSearchResult[];
}[] {
  const groups = new Map<SiteSearchCategory, SiteSearchResult[]>();
  for (const result of results) {
    const list = groups.get(result.category) ?? [];
    list.push(result);
    groups.set(result.category, list);
  }

  return CATEGORY_ORDER.filter((category) => groups.has(category)).map((category) => ({
    category,
    items: groups.get(category)!,
  }));
}
