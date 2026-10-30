import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { TileImage } from "@/components/TileImage";
import { ACCESSORY_PRODUCTS } from "@/data/accessories";

export default function AllAccessoriesPage() {
  const products = ACCESSORY_PRODUCTS;

  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm text-neutral-500">
          <Link href="/products/accessories" className="hover:text-primary">
            Decorative architectural accessories
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-700">All accessories</span>
        </p>
        <div className="relative mt-2 sm:pr-40">
          <h1 className="text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
            All accessories
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            {products.length === 0
              ? "Accessories will appear here as they are added."
              : `${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>
          <Link
            href="/products/accessories"
            className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
          >
            Browse by category
          </Link>
        </div>

        {products.length > 0 ? (
          <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
            {products.map((product) => (
              <li key={product.id}>
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  <TileImage
                    src={product.imageSrc}
                    alt={product.name}
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />
                  <div className="border-t border-neutral-100 px-2 py-2 text-center">
                    <span className="block text-sm font-medium text-neutral-800 sm:text-base">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">{product.categoryLabel}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </PageContent>
  );
}
