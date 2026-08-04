"use client";

import Link from "next/link";
import { useState } from "react";
import { ContactLink } from "@/components/ContactLink";

export default function CheckOrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const order = orderNumber.trim();
    const zip = billingZip.trim();

    if (!order) {
      setError("Enter your order number.");
      setSubmitted(false);
      return;
    }
    if (!zip) {
      setError("Enter the billing zip code.");
      setSubmitted(false);
      return;
    }
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      setError("Enter a valid 5-digit billing zip code.");
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm -mt-[100px]">
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-neutral-900">
          Check order status
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-600">
          Enter your order number and billing zip code to view status.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          noValidate
        >
          <div>
            <label htmlFor="order-number" className="mb-1 block text-sm font-medium text-neutral-700">
              Order number <span className="text-primary">*</span>
            </label>
            <input
              id="order-number"
              type="text"
              required
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                setSubmitted(false);
                setError(null);
              }}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter order number"
              autoComplete="off"
            />
          </div>
          <div>
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
                setSubmitted(false);
                setError(null);
              }}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter billing zip code"
              autoComplete="postal-code"
            />
          </div>

          {error ? <p className="text-sm text-primary">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Check status
          </button>
        </form>

        {submitted ? (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm leading-relaxed text-neutral-600">
            <p className="font-medium text-neutral-900">No matching order found</p>
            <p className="mt-2">
              We couldn&apos;t find an order with that number and billing zip. Double-check your details, or{" "}
              <ContactLink action="popover" className="font-medium text-primary hover:underline">
                contact us
              </ContactLink>{" "}
              for help.
            </p>
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/" className="text-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
