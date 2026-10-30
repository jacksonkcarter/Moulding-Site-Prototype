import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { TileImage } from "@/components/TileImage";
import { ACCESSORY_CATEGORIES } from "@/data/accessories";

export default function AccessoriesPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
          Decorative architectural accessories
        </h1>
        <p className="mt-2 text-base text-neutral-600">
          Browse decorative architectural accessories by category.
        </p>

        <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {ACCESSORY_CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/products/accessories/${category.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-primary/40 hover:shadow-sm"
              >
                <TileImage
                  src={category.thumbnailSrc}
                  alt={category.label}
                  unoptimized
                  emptyLabel="Coming soon"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                <span className="border-t border-neutral-100 px-2 py-2 text-center text-sm font-medium text-neutral-800 group-hover:text-primary sm:text-base">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContent>
  );
}
