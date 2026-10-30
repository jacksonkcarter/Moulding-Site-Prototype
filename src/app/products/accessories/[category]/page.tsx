import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContent } from "@/components/PageContent";
import { TileImage } from "@/components/TileImage";
import {
  ACCESSORY_CATEGORIES,
  getAccessoryCategory,
  getAccessoryProductsByCategory,
} from "@/data/accessories";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return ACCESSORY_CATEGORIES.map((category) => ({ category: category.slug }));
}

export default async function AccessoryCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = getAccessoryCategory(categorySlug);
  if (!category) notFound();

  const products = getAccessoryProductsByCategory(categorySlug);

  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm text-neutral-500">
          <Link href="/products/accessories" className="hover:text-primary">
            Decorative architectural accessories
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-700">{category.label}</span>
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
          {category.label}
        </h1>
        <p className="mt-2 text-base text-neutral-600">
          {products.length === 0
            ? "Products for this category will appear here."
            : `${products.length} product${products.length === 1 ? "" : "s"}`}
        </p>

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
                  <span className="border-t border-neutral-100 px-2 py-2 text-center text-sm font-medium text-neutral-800 sm:text-base">
                    {product.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </PageContent>
  );
}
