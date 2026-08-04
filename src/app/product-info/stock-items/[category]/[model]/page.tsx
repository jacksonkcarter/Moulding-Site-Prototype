"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { GlbViewer } from "@/components/GlbViewer";
import {
  getStockItemByModel,
  getStockItemDisplayName,
  getStockItemPhotoFolder,
  STOCK_ITEM_IMAGES,
  STOCK_ITEM_CONFIG_ASSETS,
} from "@/data/stock-items";
import {
  configToFolder,
  getStockConfigGroups,
} from "@/lib/stock-item-configs";

export default function StockItemModelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = typeof params.category === "string" ? params.category : "";
  const modelParam = typeof params.model === "string" ? decodeURIComponent(params.model) : "";
  const item = getStockItemByModel(modelParam);

  const configFromUrl = searchParams.get("config");
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const hasMultipleConfigs = (item?.configs.length ?? 0) > 1;
  const configFolder = selectedConfig ? configToFolder(selectedConfig) : null;
  const configAssets =
    item && configFolder ? STOCK_ITEM_CONFIG_ASSETS[item.item]?.[configFolder] : undefined;
  const configImages = configAssets?.images ?? [];
  const configGlb = configAssets?.glb ?? null;
  const totalViews = configGlb ? configImages.length + 1 : configImages.length;
  const canCycleImages = Boolean(hasMultipleConfigs && selectedConfig && totalViews > 1);

  useEffect(() => {
    if (configFromUrl && item?.configs.includes(configFromUrl)) {
      setSelectedConfig(configFromUrl);
    }
  }, [configFromUrl, item]);

  useEffect(() => {
    if (selectedConfig) setImageIndex(0);
  }, [selectedConfig]);

  useEffect(() => {
    if (!canCycleImages) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setImageIndex((i) => (i - 1 + totalViews) % totalViews);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setImageIndex((i) => (i + 1) % totalViews);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canCycleImages, totalViews]);

  if (!item) notFound();

  const sizeGroups = getStockConfigGroups(item.configs);
  const singleConfigLabel = item.configs.length === 1 ? item.configs[0] : null;

  const mainImage = STOCK_ITEM_IMAGES[item.item] ?? null;
  const photoFolder = getStockItemPhotoFolder(item.item);
  const hasConfigMedia = configImages.length > 0 || configGlb;
  const show3D = selectedConfig && configGlb && totalViews > 0 && imageIndex === configImages.length;
  const displayImageUrl =
    selectedConfig && hasConfigMedia
      ? show3D
        ? null
        : configImages[imageIndex]
          ? `/stock-items/${photoFolder}/${configFolder}/${configImages[imageIndex]}`
          : mainImage
      : mainImage;

  const goPrev = () => {
    if (!canCycleImages) return;
    setImageIndex((i) => (i - 1 + totalViews) % totalViews);
  };
  const goNext = () => {
    if (!canCycleImages) return;
    setImageIndex((i) => (i + 1) % totalViews);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-5 pb-12 sm:px-6">
        <Link
          href={`/product-info/stock-items#${categorySlug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back to browse stock items
        </Link>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex w-full items-center gap-2 lg:max-w-md">
            {canCycleImages && (
              <button
                type="button"
                onClick={goPrev}
                className="shrink-0 rounded-full border border-neutral-200 bg-white p-2 shadow-sm transition hover:border-primary hover:bg-red-50/50 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Previous image"
              >
                <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="relative aspect-square min-h-0 min-w-0 flex-1 overflow-hidden">
              {show3D && configGlb ? (
                <GlbViewer
                  url={`/stock-items/${photoFolder}/${configFolder}/${configGlb}`}
                  className="h-full w-full"
                  {...(item.item === "CM180" && selectedConfig === "2/0"
                    ? { targetOffset: [0, 0.06, 0] }
                    : {})}
                />
              ) : displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt={getStockItemDisplayName(item)}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 448px"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-50">
                  <p className="text-sm font-medium text-neutral-400">Image coming soon</p>
                </div>
              )}
            </div>
            {canCycleImages && (
              <button
                type="button"
                onClick={goNext}
                className="shrink-0 rounded-full border border-neutral-200 bg-white p-2 shadow-sm transition hover:border-primary hover:bg-red-50/50 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Next image"
              >
                <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
                {getStockItemDisplayName(item)}
              </h1>
              <p className="mt-1 text-neutral-600">{item.dimensions}</p>
              {item.miscellaneousLabel && (
                <p className="mt-0.5 text-neutral-600">{item.miscellaneousLabel}</p>
              )}
            </div>

            {hasMultipleConfigs ? (
              <div className="space-y-4">
                {sizeGroups.map(({ label, options }) => (
                  <div key={label}>
                    <h3 className="text-sm font-semibold tracking-wide text-neutral-500">
                      {label}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedConfig(opt)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            selectedConfig === opt
                              ? "border-primary bg-red-50 text-primary"
                              : "border-neutral-300 bg-white text-neutral-700 hover:border-primary hover:bg-red-50/50 hover:text-primary"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : singleConfigLabel ? (
              <p className="text-neutral-600">
                Available in {singleConfigLabel}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
