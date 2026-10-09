import Link from "next/link";
import { PageContent } from "@/components/PageContent";

const CUSTOMER_LINKS = [
  {
    title: "Quote request",
    body: "Tell us about your next project for pricing and lead times.",
    href: "/quote-request",
    cta: "Start a quote request",
  },
  {
    title: "Check order status",
    body: "Look up the status of an existing sales order or purchase order.",
    href: "/order-status",
    cta: "Check order status",
  },
] as const;

export default function ExistingCustomersPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl not-prose">
        <header className="space-y-6">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Existing customers
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-neutral-700 md:text-base">
            Already working with Flex Trim™? Request a quote for your next order or check the status of an order in
            progress.
          </p>
        </header>

        <ul className="mt-12 grid list-none gap-6 p-0 sm:grid-cols-2">
          {CUSTOMER_LINKS.map((item) => (
            <li key={item.href} className="flex min-w-0 flex-col border-t border-neutral-200 pt-5">
              <p className="font-medium text-neutral-900">{item.title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{item.body}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex w-fit items-center justify-center rounded-full border-2 border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {item.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContent>
  );
}
