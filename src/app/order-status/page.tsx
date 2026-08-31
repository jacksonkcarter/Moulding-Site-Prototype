"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Sales orders are stored as 7 digits; pad a 6-digit entry with a leading zero. */
function normalizeSalesOrder(value: string): string {
  const trimmed = value.trim();
  if (/^\d{6}$/.test(trimmed)) return `0${trimmed}`;
  return trimmed;
}

export default function CheckOrderStatusPage() {
  const router = useRouter();
  const [salesOrder, setSalesOrder] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const so = salesOrder.trim();
    const po = purchaseOrder.trim();
    const zip = billingZip.trim();

    if (!zip) {
      setError("Enter the billing zip code.");
      return;
    }
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      setError("Enter a valid 5-digit billing zip code.");
      return;
    }
    if (!so && !po) {
      setError("Enter a sales order number or purchase order number.");
      return;
    }

    const params = new URLSearchParams();
    params.set("zip", zip.slice(0, 5));
    if (so) params.set("so", normalizeSalesOrder(so));
    if (po) params.set("po", po);
    router.push(`/order-status/results?${params.toString()}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl -mt-[100px]">
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-neutral-900">
          Check order status
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-600">
          Billing zip code + sales order # <span className="text-neutral-400">or</span> purchase order #
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.2fr)] sm:items-stretch">
            <div className="flex flex-col justify-center">
              <label htmlFor="billing-zip" className="mb-1 block text-sm font-medium text-neutral-700">
                Billing zip code <span className="text-primary">*</span>
              </label>
              <input
                id="billing-zip"
                type="text"
                required
                inputMode="numeric"
                value={billingZip}
                onChange={(e) => {
                  setBillingZip(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Zip code"
                autoComplete="postal-code"
              />
            </div>

            <div
              className="hidden items-center justify-center text-sm font-medium text-neutral-400 sm:flex"
              aria-hidden
            >
              AND
            </div>

            <div>
              <div>
                <label htmlFor="sales-order" className="mb-1 block text-sm font-medium text-neutral-700">
                  Sales order #
                </label>
                <input
                  id="sales-order"
                  type="text"
                  value={salesOrder}
                  onChange={(e) => {
                    setSalesOrder(e.target.value);
                    setError(null);
                  }}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Sales order number"
                  autoComplete="off"
                />
              </div>

              <div className="relative my-3 text-center text-xs font-medium uppercase tracking-wide text-neutral-400">
                <span className="relative z-10 bg-white px-2">or</span>
                <span className="absolute inset-x-0 top-1/2 border-t border-neutral-200" aria-hidden />
              </div>

              <div>
                <label htmlFor="purchase-order" className="mb-1 block text-sm font-medium text-neutral-700">
                  Purchase order #
                </label>
                <input
                  id="purchase-order"
                  type="text"
                  value={purchaseOrder}
                  onChange={(e) => {
                    setPurchaseOrder(e.target.value);
                    setError(null);
                  }}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Purchase order number"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Check status
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/" className="text-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
