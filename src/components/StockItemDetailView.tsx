"use client";

import Link from "next/link";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { BendingStylesCard } from "@/components/BendingStylesCard";
import { ContactLink } from "@/components/ContactLink";
import { DownloadProfilePdfButton } from "@/components/DownloadProfilePdfButton";
import { GlbViewer } from "@/components/GlbViewer";
import type { StockItem } from "@/data/stock-items";
import {
  getStockItemDisplayName,
  getStockItemPhotoFolder,
  STOCK_ITEM_CONFIG_ASSETS,
  STOCK_ITEM_IMAGES,
} from "@/data/stock-items";
import { ProfileMatchPrompt } from "@/components/ProfileMatchPrompt";
import { StockConfigStyleInfoIcon } from "@/components/StockConfigStyleInfoIcon";
import { getStockBendingLimitationContent } from "@/lib/stock-item-bending";
import {
  configToFolder,
  getStockConfigGroups,
  STOCK_CONFIG_STYLE_INFO,
} from "@/lib/stock-item-configs";
import type { ProfileRow } from "@/lib/profiles";

/** Same max as select-profile detail — never upscale past this. */
const MAX_IMAGE_PX = 400;

/** Underline "radius", "radii", and "diameter" in bending-limitation copy. */
function underlineRadiusDiameter(text: string): ReactNode {
  const parts = text.split(/(\b(?:radii|radius|diameter)\b)/gi);
  return parts.map((part, i) =>
    /^(?:radii|radius|diameter)$/i.test(part) ? (
      <span key={i} className="underline">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

type StockItemDetailViewProps = {
  item: StockItem;
  categorySlug: string;
  initialConfig: string | null;
  isNewDrawing: boolean;
  outlineId: string | null;
};

export function StockItemDetailView({
  item,
  categorySlug,
  initialConfig,
  isNewDrawing,
  outlineId,
}: StockItemDetailViewProps) {
  const [selectedConfig, setSelectedConfig] = useState<string | null>(initialConfig);
  const [imageIndex, setImageIndex] = useState(0);

  const hasMultipleConfigs = item.configs.length > 1;
  const configFolder = selectedConfig ? configToFolder(selectedConfig) : null;
  const configAssets = configFolder
    ? STOCK_ITEM_CONFIG_ASSETS[item.item]?.[configFolder]
    : undefined;
  const configImages = configAssets?.images ?? [];
  const configGlb = configAssets?.glb ?? null;
  const totalViews = configGlb ? configImages.length + 1 : configImages.length;
  const canCycleImages = Boolean(hasMultipleConfigs && selectedConfig && totalViews > 1);

  useEffect(() => {
    setSelectedConfig(initialConfig);
  }, [initialConfig]);

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

  const sizeGroups = getStockConfigGroups(item.configs);
  const singleConfigLabel = item.configs.length === 1 ? item.configs[0] : null;
  const bendingContent = getStockBendingLimitationContent(item, selectedConfig);
  const mainImage = STOCK_ITEM_IMAGES[item.item] ?? null;
  const photoFolder = getStockItemPhotoFolder(item.item);
  const hasConfigMedia = configImages.length > 0 || configGlb;
  const show3D = Boolean(
    selectedConfig && configGlb && totalViews > 0 && imageIndex === configImages.length
  );
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

  const pdfProfile: ProfileRow = {
    profileId: item.item,
    description: item.dimensions,
    mouldingType: item.category,
    width: item.width ?? 0,
    thickness: item.thickness ?? 0,
    region: "east",
    searchTerms: [],
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

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="flex items-center justify-center gap-2 lg:justify-end">
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

            {show3D && configGlb ? (
              <div className="h-[400px] w-[400px] max-w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <GlbViewer
                  url={`/stock-items/${photoFolder}/${configFolder}/${configGlb}`}
                  className="h-full w-full"
                  {...(item.item === "CM180" && selectedConfig === "2/0"
                    ? { targetOffset: [0, 0.06, 0] as [number, number, number] }
                    : {})}
                />
              </div>
            ) : displayImageUrl ? (
              <div className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element -- native size, no upscale */}
                <img
                  src={displayImageUrl}
                  alt={`${getStockItemDisplayName(item)} flexible moulding`}
                  className="h-auto w-auto object-contain"
                  style={{ maxWidth: MAX_IMAGE_PX, maxHeight: MAX_IMAGE_PX }}
                />
              </div>
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
                <p className="text-sm font-medium text-neutral-400">Image coming soon</p>
              </div>
            )}

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

          <div className="min-w-0 space-y-6 text-center lg:text-left">
            <div>
              <p className="text-sm font-medium tracking-wide text-primary">{item.category}</p>
              <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900">
                {getStockItemDisplayName(item)}
              </h1>
              <p className="mt-2 text-neutral-600">{item.dimensions}</p>
              {item.miscellaneousLabel ? (
                <p className="mt-0.5 text-neutral-600">{item.miscellaneousLabel}</p>
              ) : null}
            </div>

            {hasMultipleConfigs ? (
              <div className="space-y-2">
                {sizeGroups.map(({ label, options }) => {
                  const styleInfo = STOCK_CONFIG_STYLE_INFO[label];
                  return (
                  <div key={label}>
                    <div className="flex items-center justify-center gap-1.5 lg:justify-start">
                      <h3 className="text-sm font-semibold tracking-wide text-neutral-500">
                        {label}
                      </h3>
                      {styleInfo ? (
                        <StockConfigStyleInfoIcon label={label} {...styleInfo} />
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap justify-center gap-2 lg:justify-start">
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
                  );
                })}
              </div>
            ) : singleConfigLabel ? (
              <p className="text-neutral-600">Available in {singleConfigLabel}</p>
            ) : null}

            <div className="flex flex-col items-center gap-2 lg:items-start">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                {mainImage ? (
                  <DownloadProfilePdfButton
                    profile={pdfProfile}
                    mode="generated"
                    label="Download PDF"
                    variant="primary"
                    isNewDrawing={isNewDrawing}
                    imageUrl={mainImage}
                  />
                ) : null}
                {outlineId ? (
                  <DownloadProfilePdfButton
                    profile={pdfProfile}
                    mode="outline"
                    label="Download PDF (outline only)"
                    variant="primary"
                    outlineId={outlineId}
                  />
                ) : null}
              </div>
              {item.matchingWoodProfiles ? (
                <ProfileMatchPrompt
                  checkerHref={`/product-info/profile-checker?item=${encodeURIComponent(item.item)}&category=${encodeURIComponent(categorySlug)}`}
                  matchingWoodProfiles={item.matchingWoodProfiles}
                  className="mx-auto lg:mx-0"
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-8 text-center lg:col-span-2 lg:text-left">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Overview</h2>
              <div className="mt-2 space-y-2 text-sm text-neutral-600">
                {item.categoryDescription || item.itemNote ? (
                  <p>
                    {item.categoryDescription}
                    {item.categoryDescription && item.itemNote ? " " : ""}
                    {item.itemNote}
                  </p>
                ) : null}
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {item.finishGrade ? (
                      <tr className="align-top">
                        <th
                          scope="row"
                          className="w-[1%] whitespace-nowrap py-1 pr-4 font-medium text-neutral-800"
                        >
                          Finish grade
                        </th>
                        <td className="py-1 text-neutral-600">{item.finishGrade}</td>
                      </tr>
                    ) : null}
                    {item.matchingWoodProfiles ? (
                      <tr className="align-top">
                        <th
                          scope="row"
                          className="w-[1%] whitespace-nowrap py-1 pr-4 font-medium text-neutral-800"
                        >
                          Matching wood profiles
                        </th>
                        <td className="py-1 text-neutral-600">{item.matchingWoodProfiles}</td>
                      </tr>
                    ) : null}
                    <tr className="align-top">
                      <th
                        scope="row"
                        className="w-[1%] whitespace-nowrap py-1 pr-4 font-medium text-neutral-800"
                      >
                        Production facility
                      </th>
                      <td className="py-1 text-neutral-600">North Carolina</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                  Bending limitations & allowable installation range
                </h2>
                <div className="space-y-4 text-sm text-neutral-600">
                  {bendingContent?.kind === "select" ? (
                    <p>Select a size configuration to see bending limits.</p>
                  ) : bendingContent?.kind === "lines" ? (
                    <div className="space-y-1">
                      <p>{underlineRadiusDiameter(bendingContent.intro)}</p>
                      <ul className="list-none space-y-0.5">
                        {bendingContent.lines.map((line) => (
                          <li key={line}>{underlineRadiusDiameter(line)}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <p>
                    Don&apos;t see a stock item that will work?{" "}
                    <ContactLink action="popover" className="font-medium text-primary hover:underline">
                      Contact us
                    </ContactLink>{" "}
                    with your project details for custom options including ellipticals, ovals,
                    bullnose corners, and any shape/size that falls outside the stock item
                    limitations.
                  </p>
                </div>
              </div>
              <BendingStylesCard className="w-full max-w-sm lg:max-w-none lg:justify-self-end" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
