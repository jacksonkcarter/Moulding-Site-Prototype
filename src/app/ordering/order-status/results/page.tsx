import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { findOrders, formatOrderDate, getTrackingLink } from "@/lib/order-status";

type OrderStatusResultsPageProps = {
  searchParams: Promise<{ zip?: string; so?: string; po?: string }>;
};

export default async function OrderStatusResultsPage({ searchParams }: OrderStatusResultsPageProps) {
  const params = await searchParams;
  const zip = params.zip?.trim() ?? "";
  const salesOrder = params.so?.trim() ?? "";
  const purchaseOrder = params.po?.trim() ?? "";

  const missingLookup = !zip || (!salesOrder && !purchaseOrder);
  const orders = missingLookup
    ? []
    : findOrders({ zip, salesOrder: salesOrder || undefined, purchaseOrder: purchaseOrder || undefined });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-neutral-900">Order status</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {zip ? (
              <>
                Billing zip <span className="font-medium text-neutral-800">{zip}</span>
                {salesOrder ? (
                  <>
                    {" "}
                    · Sales order <span className="font-medium text-neutral-800">{salesOrder}</span>
                  </>
                ) : null}
                {purchaseOrder ? (
                  <>
                    {" "}
                    · PO <span className="font-medium text-neutral-800">{purchaseOrder}</span>
                  </>
                ) : null}
              </>
            ) : (
              "Enter lookup details to view an order."
            )}
          </p>
        </div>
        <Link href="/ordering/order-status" className="text-sm font-medium text-primary hover:underline">
          ← New search
        </Link>
      </div>

      {missingLookup ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-600">
          Billing zip and either a sales order number or purchase order number are required.{" "}
          <Link href="/ordering/order-status" className="font-medium text-primary hover:underline">
            Return to search
          </Link>
          .
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm leading-relaxed text-neutral-600">
          <p className="font-medium text-neutral-900">No matching order found</p>
          <p className="mt-2">
            We couldn&apos;t find an order with those details. Double-check your billing zip and order
            number, or{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              contact us
            </ContactLink>{" "}
            for help.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <section
              key={order.salesOrderNo}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
            >
              <header className="border-b border-neutral-200 bg-neutral-50 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Customer
                    </p>
                    <p className="mt-1 text-lg font-semibold text-neutral-900">{order.customerName}</p>
                  </div>
                  {order.isShipped ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Complete
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      In progress
                    </span>
                  )}
                </div>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Sales order #
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{order.salesOrderNo || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Purchase order #
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">
                      {order.purchaseOrderNo || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Order date
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">
                      {formatOrderDate(order.orderDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      {order.isShipped ? "Shipped date" : "Expected ship date"}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">
                      {formatOrderDate(order.isShipped ? order.shippedDate : order.expectedShipDate)}
                    </dd>
                  </div>
                </dl>

                {order.isShipped ? (
                  <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 sm:px-5 sm:py-4">
                    {order.trackingNumbers.length > 0 ? (
                      <ul className="space-y-3">
                        {order.trackingNumbers.map((tracking) => {
                          const track = getTrackingLink(tracking);
                          return (
                            <li
                              key={tracking}
                              className="flex flex-wrap items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
                                  Tracking number
                                </p>
                                <p className="mt-1 break-all font-mono text-sm font-medium text-emerald-950 sm:text-base">
                                  {tracking}
                                </p>
                              </div>
                              {track ? (
                                <a
                                  href={track.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex shrink-0 items-center justify-center self-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                                >
                                  {track.label}
                                </a>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <>
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
                          Tracking number
                        </p>
                        <p className="mt-1 text-sm font-medium text-emerald-950">Not available</p>
                      </>
                    )}
                  </div>
                ) : null}
              </header>

              <div className="overflow-x-auto">
                {order.hasStockItems ? (
                  <p className="border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-sm leading-relaxed text-neutral-600 sm:px-6">
                    Completed quantities aren&apos;t shown for stock lines; we ship when every stock item on the
                    order is available in inventory. If there are not enough available, we immediately put more into
                    production to ship as soon as possible.
                  </p>
                ) : null}
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 bg-white text-xs uppercase tracking-wide text-neutral-500">
                    <tr>
                      <th className="px-5 py-3 font-medium sm:px-6">Line item</th>
                      <th className="px-5 py-3 font-medium sm:px-6">Part #</th>
                      <th className="px-5 py-3 font-medium sm:px-6">Configuration</th>
                      <th className="px-5 py-3 font-medium sm:px-6 text-center">Qty ordered</th>
                      <th className="px-5 py-3 font-medium sm:px-6 text-center">Qty completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {order.lines.map((line) => (
                      <tr key={`${order.salesOrderNo}-${line.lineItem}-${line.part}`}>
                        <td className="whitespace-nowrap px-5 py-3 text-neutral-900 sm:px-6">
                          {line.lineItem}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-neutral-800 sm:px-6">
                          {line.part}
                        </td>
                        <td className="max-w-xs px-5 py-3 text-neutral-600 sm:px-6 sm:max-w-md">
                          {line.configuration}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-center text-neutral-800 sm:px-6">
                          {line.qtyOrdered}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-center text-neutral-800 sm:px-6">
                          {line.qtyComplete}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
