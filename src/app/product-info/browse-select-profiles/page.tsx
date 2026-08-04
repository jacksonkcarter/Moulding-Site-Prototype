import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { TileImage } from "@/components/TileImage";
import { MOULDING_TYPE_THUMBNAILS } from "@/data/moulding-type-thumbnails";
import { PROFILE_MOULDING_TYPES } from "@/data/profile-moulding-types";

export default function BrowseSelectProfilesPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
              Browse by category
            </h1>
            <p className="mt-2 max-w-2xl text-base text-neutral-600">
              Choose a moulding type to browse tooled select profiles, or view the full library.
            </p>
          </div>
          <Link
            href="/product-info/profile-search"
            className="inline-flex shrink-0 items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Browse all
          </Link>
        </div>

        <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 lg:gap-4">
          {PROFILE_MOULDING_TYPES.map((type) => {
            const thumb = MOULDING_TYPE_THUMBNAILS[type];
            return (
              <li key={type}>
                <Link
                  href={`/product-info/profile-search?types=${encodeURIComponent(type)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-primary/40 hover:shadow-sm"
                >
                  <TileImage
                    src={thumb}
                    alt=""
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 10vw"
                  />
                  <span className="border-t border-neutral-100 px-2 py-2 text-center text-xs font-medium text-neutral-800 group-hover:text-primary sm:text-sm">
                    {type}
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
