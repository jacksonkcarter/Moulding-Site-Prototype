"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { GlbViewer } from "@/components/GlbViewer";
import {
  getStockItemByModel,
  STOCK_ITEM_IMAGES,
  STOCK_ITEM_CONFIG_ASSETS,
} from "@/data/stock-items";

const STRAIGHT_CONFIGS = ["12 FT", "10 FT", "8 FT"];
const HALF_ROUND_CONFIGS = ["6/0", "5/0", "4/0", "3/0", "2/6", "2/0"];
const ARC_CONFIGS = ["12 FT x 48 IN R", "8 FT x 48 IN R", "7 FT x 84 IN", "7 FT x 48 IN", "4.5 FT x 30 IN R"];

function configToFolder(name: string): string {
  return name.replace(/\//g, "");
}

function groupConfigs(configs: string[]) {
  const straight = configs.filter((c) => STRAIGHT_CONFIGS.includes(c));
  const halfRound = configs.filter((c) => HALF_ROUND_CONFIGS.includes(c));
  const arc = configs.filter((c) => ARC_CONFIGS.includes(c));
  return { straight, halfRound, arc };
}

export default function StockItemModelPage() {
  const params = useParams();
  const categorySlug = typeof params.category === "string" ? params.category : "";
  const modelParam = typeof params.model === "string" ? decodeURIComponent(params.model) : "";
  const item = getStockItemByModel(modelParam);

  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  if (!item) notFound();

  const hasMultipleConfigs = item.configs.length > 1;
  const { straight, halfRound, arc } = groupConfigs(item.configs);
  const singleConfigLabel = item.configs.length === 1 ? item.configs[0] : null;

  const mainImage = STOCK_ITEM_IMAGES[item.item] ?? `/stock-items/${item.item}.png`;
  const configFolder = selectedConfig ? configToFolder(selectedConfig) : null;
  const configAssets = configFolder && STOCK_ITEM_CONFIG_ASSETS[item.item]?.[configFolder];
  const configImages = configAssets?.images ?? [];
  const configGlb = configAssets?.glb ?? null;
  const hasConfigMedia = configImages.length > 0 || configGlb;
  const totalViews = configGlb ? configImages.length + 1 : configImages.length;
  const show3D = selectedConfig && configGlb && totalViews > 0 && imageIndex === configImages.length;
  const displayImageUrl =
    selectedConfig && hasConfigMedia
      ? show3D
        ? null
        : configImages[imageIndex]
          ? `/stock-items/${item.item}/${configFolder}/${configImages[imageIndex]}`
          : mainImage
      : mainImage;

  const canCycleImages = hasMultipleConfigs && selectedConfig && totalViews > 1;

  useEffect(() => {
    if (selectedConfig) setImageIndex(0);
  }, [selectedConfig]);

  const goPrev = () => {
    if (!canCycleImages) return;
    setImageIndex((i) => (i - 1 + totalViews) % totalViews);
  };
  const goNext = () => {
    if (!canCycleImages) return;
    setImageIndex((i) => (i + 1) % totalViews);
  };

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

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-5 pb-12 sm:px-6">
        <Link
          href={`/product-info/stock-items#${categorySlug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back to Browse Stock Items
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
                  url={`/stock-items/${item.item}/${configFolder}/${configGlb}`}
                  className="h-full w-full"
                  {...(item.item === "CM180" && selectedConfig === "2/0"
                    ? { targetOffset: [0, 0.06, 0] }
                    : {})}
                />
              ) : displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt={item.item}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 448px"
                  priority
                  unoptimized
                />
              ) : null}
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
              <h1 className="text-3xl font-medium uppercase tracking-[0.15em] text-neutral-900">
                {item.item}
              </h1>
              <p className="mt-1 text-neutral-600">{item.dimensions}</p>
              {item.miscellaneousLabel && (
                <p className="mt-0.5 text-neutral-600">{item.miscellaneousLabel}</p>
              )}
            </div>

            {hasMultipleConfigs ? (
              <>
                {straight.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                      Straight
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {straight.map((opt) => (
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
                )}
                {halfRound.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                      Half Rounds
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {halfRound.map((opt) => (
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
                )}
                {arc.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                      Arc
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {arc.map((opt) => (
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
                )}
              </>
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
