import { notFound } from "next/navigation";
import { StockItemDetailView } from "@/components/StockItemDetailView";
import { getStockItemByModel } from "@/data/stock-items";
import {
  getOutlinePdfLookupId,
  isNewDrawingFromIds,
} from "@/lib/profiles";

type StockItemModelPageProps = {
  params: Promise<{ category: string; model: string }>;
  searchParams: Promise<{ config?: string }>;
};

export default async function StockItemModelPage({
  params,
  searchParams,
}: StockItemModelPageProps) {
  const { category: categorySlug, model: modelParam } = await params;
  const { config: configFromUrl } = await searchParams;
  const model = decodeURIComponent(modelParam);
  const item = getStockItemByModel(model);
  if (!item) notFound();

  const initialConfig =
    configFromUrl && item.configs.includes(configFromUrl) ? configFromUrl : null;
  const lookupIds = [item.item, item.alternateName];
  const isNewDrawing = isNewDrawingFromIds(lookupIds);
  const outlineId = getOutlinePdfLookupId(lookupIds);

  return (
    <StockItemDetailView
      item={item}
      categorySlug={categorySlug}
      initialConfig={initialConfig}
      isNewDrawing={isNewDrawing}
      outlineId={outlineId}
    />
  );
}
