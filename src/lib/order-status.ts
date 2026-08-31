import orderStatusData from "@/data/order-status.json";

export type OrderLine = {
  orderNo: string;
  recordNo: string;
  part: string;
  description: string;
  qtyOrdered: number;
  qtyShipped: number;
  /** From QTY_COMPLETED in the order-status export. */
  qtyCompleted: number;
  /** Product line code: FC, FA, FS, NS, MF, MD, etc. */
  productLine: string;
  customerPo: string;
  dateOrder: string | null;
  dateDue: string | null;
  dateShipped: string | null;
  customerName: string;
  zip: string;
  trackingNo: string;
};

export type OrderStatusQuery = {
  zip: string;
  salesOrder?: string;
  purchaseOrder?: string;
};

export type OrderStatusResult = {
  customerName: string;
  salesOrderNo: string;
  purchaseOrderNo: string;
  orderDate: string | null;
  expectedShipDate: string | null;
  shippedDate: string | null;
  isShipped: boolean;
  /** True when any line is product line FS (stock). */
  hasStockItems: boolean;
  trackingNumbers: string[];
  lines: Array<{
    lineItem: string;
    part: string;
    configuration: string;
    qtyOrdered: string;
    qtyComplete: string;
  }>;
};

const ORDER_LINES = orderStatusData as OrderLine[];

export function normalizeZip(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.slice(0, 5).padStart(5, "0");
}

export function normalizeLookupValue(value: string): string {
  return value.replace(/\s+/g, "").trim().toUpperCase();
}

/** Sales orders are stored as 7 digits; pad a 6-digit entry with a leading zero. */
export function normalizeSalesOrder(value: string): string {
  const trimmed = value.trim();
  if (/^\d{6}$/.test(trimmed)) return `0${trimmed}`;
  return trimmed;
}

function valuesMatch(stored: string, query: string): boolean {
  const a = normalizeLookupValue(stored);
  const b = normalizeLookupValue(query);
  if (!a || !b) return false;
  return a === b || a.replace(/^0+/, "") === b.replace(/^0+/, "");
}

export function formatOrderDate(iso: string | null): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type ShipmentCarrier = "ups" | "fedex" | "misc";

/** Normalize tracking for carrier detection / URLs. */
export function normalizeTrackingNumber(value: string): string {
  return value.replace(/\s+/g, "").trim().toUpperCase();
}

/**
 * Detect carrier from tracking number format.
 * UPS: 1Z… · FedEx: common 12 / 15 / 20–22 digit formats · else misc (no track link).
 */
export function detectShipmentCarrier(trackingNo: string): ShipmentCarrier {
  const n = normalizeTrackingNumber(trackingNo);
  if (!n) return "misc";
  if (/^1Z[A-Z0-9]{16}$/i.test(n)) return "ups";
  if (/^\d{12}$/.test(n) || /^\d{15}$/.test(n) || /^\d{20}$/.test(n) || /^\d{22}$/.test(n)) {
    return "fedex";
  }
  return "misc";
}

/** Public track URL and label for UPS/FedEx; null for miscellaneous numbers. */
export function getTrackingLink(
  trackingNo: string,
): { url: string; label: string } | null {
  const n = normalizeTrackingNumber(trackingNo);
  if (!n) return null;
  const carrier = detectShipmentCarrier(n);
  if (carrier === "ups") {
    return {
      url: `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`,
      label: "Track on UPS.com",
    };
  }
  if (carrier === "fedex") {
    return {
      url: `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
      label: "Track on FedEx.com",
    };
  }
  return null;
}

/** @deprecated Prefer getTrackingLink */
export function getTrackingUrl(trackingNo: string): string | null {
  return getTrackingLink(trackingNo)?.url ?? null;
}

/** Display rules for QTY ORDERED by product line. */
export function formatQtyOrdered(productLine: string, qtyOrdered: number): string {
  if (productLine.toUpperCase() === "NS") return "";
  return String(qtyOrdered);
}

/**
 * Display rules for QTY COMPLETED by product line:
 * FC/FA → column value · FS → N/A - STOCK · NS → blank · MF/MD → N/A - TOOLING
 */
export function formatQtyCompleted(productLine: string, qtyCompleted: number): string {
  const pl = productLine.toUpperCase();
  if (pl === "NS") return "";
  if (pl === "FS") return "N/A - STOCK";
  if (pl === "MF" || pl === "MD") return "N/A - TOOLING";
  return String(qtyCompleted);
}

/**
 * Find order lines for billing zip + sales order # and/or purchase order #.
 * Groups results by sales order number.
 */
export function findOrders(query: OrderStatusQuery): OrderStatusResult[] {
  const zip = normalizeZip(query.zip);
  const salesOrder = normalizeSalesOrder(query.salesOrder ?? "");
  const purchaseOrder = query.purchaseOrder?.trim() ?? "";

  if (!zip || (!salesOrder && !purchaseOrder)) return [];

  const matches = ORDER_LINES.filter((line) => {
    if (line.zip !== zip) return false;
    const soOk = salesOrder ? valuesMatch(line.orderNo, salesOrder) : false;
    const poOk = purchaseOrder ? valuesMatch(line.customerPo, purchaseOrder) : false;
    if (salesOrder && purchaseOrder) return soOk && poOk;
    if (salesOrder) return soOk;
    return poOk;
  });

  if (matches.length === 0) return [];

  const byOrder = new Map<string, OrderLine[]>();
  for (const line of matches) {
    const key = line.orderNo || "(unknown)";
    const group = byOrder.get(key);
    if (group) group.push(line);
    else byOrder.set(key, [line]);
  }

  return [...byOrder.entries()].map(([, lines]) => {
    const sorted = [...lines].sort((a, b) => a.recordNo.localeCompare(b.recordNo, undefined, { numeric: true }));
    const first = sorted[0];
    // Spreadsheet uses "(Null)" for open orders; any real ship date means the order is complete
    const isShipped = sorted.some((line) => line.dateShipped != null);
    const shippedDates = sorted
      .map((line) => line.dateShipped)
      .filter((d): d is string => d != null);
    const shippedDate = shippedDates.length > 0 ? shippedDates.sort().at(-1)! : null;
    const trackingNumbers = [
      ...new Set(sorted.map((line) => line.trackingNo).filter(Boolean)),
    ];
    const hasStockItems = sorted.some((line) => line.productLine.toUpperCase() === "FS");

    return {
      customerName: first.customerName,
      salesOrderNo: first.orderNo,
      purchaseOrderNo: first.customerPo,
      orderDate: first.dateOrder,
      expectedShipDate: first.dateDue,
      shippedDate,
      isShipped,
      hasStockItems,
      trackingNumbers,
      lines: sorted.map((line) => ({
        lineItem: line.recordNo,
        part: line.part,
        configuration: line.description,
        qtyOrdered: formatQtyOrdered(line.productLine, line.qtyOrdered),
        qtyComplete: formatQtyCompleted(line.productLine, line.qtyCompleted),
      })),
    };
  });
}
