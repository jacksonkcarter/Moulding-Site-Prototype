import { Suspense } from "react";
import { StockItemsView } from "@/components/StockItemsView";
import {
  STOCK_ITEM_SECTIONS,
  STOCK_ITEMS,
  STOCK_ITEM_IMAGES,
} from "@/data/stock-items";

export default function StockItemsPage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-neutral-500">
            Loading stock items…
          </div>
        }
      >
        <StockItemsView
          sections={STOCK_ITEM_SECTIONS}
          items={STOCK_ITEMS}
          images={STOCK_ITEM_IMAGES}
        />
      </Suspense>
    </main>
  );
}
