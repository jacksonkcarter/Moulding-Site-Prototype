import { StockItemsView } from "@/components/StockItemsView";
import {
  STOCK_ITEM_SECTIONS,
  STOCK_ITEMS,
  STOCK_ITEM_IMAGES,
} from "@/data/stock-items";

export default function StockItemsPage() {
  return (
    <main className="min-h-screen">
      <StockItemsView
        sections={STOCK_ITEM_SECTIONS}
        items={STOCK_ITEMS}
        images={STOCK_ITEM_IMAGES}
      />
    </main>
  );
}
