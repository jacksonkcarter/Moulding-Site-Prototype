import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { TileImage } from "@/components/TileImage";
import { MOULDING_TYPE_THUMBNAILS } from "@/data/moulding-type-thumbnails";
import {
  STOCK_ITEM_IMAGES,
  STOCK_ITEM_SECTIONS,
  STOCK_ITEMS,
} from "@/data/stock-items";
import { getStockMouldingFilterOptions } from "@/lib/stock-moulding-filter-options";

function thumbnailForStockCategory(label: string): string | undefined {
  const keys = Object.keys(MOULDING_TYPE_THUMBNAILS);
  const exact = keys.find((k) => k.toLowerCase() === label.toLowerCase());
  if (exact) return MOULDING_TYPE_THUMBNAILS[exact];

  for (const part of label.split(/\s+&\s+/).map((p) => p.trim()).filter(Boolean)) {
    const match = keys.find((k) => k.toLowerCase() === part.toLowerCase());
    if (match) return MOULDING_TYPE_THUMBNAILS[match];
  }

  const sample = STOCK_ITEMS.find(
    (item) =>
      item.miscellaneousLabel?.toLowerCase() === label.toLowerCase() ||
      item.category.split(/\s+&\s+/).some((p) => p.trim().toLowerCase() === label.toLowerCase()) ||
      item.category.toLowerCase() === label.toLowerCase(),
  );
  return sample ? STOCK_ITEM_IMAGES[sample.item] : undefined;
}

export default function BrowseStockItemsPage() {
  const categories = getStockMouldingFilterOptions(STOCK_ITEM_SECTIONS, STOCK_ITEMS);

  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative sm:pr-40">
          <h1 className="text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
            Browse by category
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            We keep over 250 different part configurations on the shelf ready for immediate shipping. Choose a moulding type to browse stock items.
          </p>
          <Link
            href="/product-info/stock-items"
            className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
          >
            Browse all
          </Link>
        </div>

        <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 lg:gap-4">
          {categories.map((category) => {
            const thumb = thumbnailForStockCategory(category);
            return (
              <li key={category}>
                <Link
                  href={`/product-info/stock-items?types=${encodeURIComponent(category)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-primary/40 hover:shadow-sm"
                >
                  <TileImage
                    src={thumb}
                    alt={`${category} flexible moulding`}
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 10vw"
                  />
                  <span className="border-t border-neutral-100 px-2 py-2 text-center text-sm font-medium text-neutral-800 group-hover:text-primary sm:text-base">
                    {category}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PageContent>
  );
}
