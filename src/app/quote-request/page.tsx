import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

export default function QuoteRequestPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-center text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl">
          Quote request
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-neutral-700 md:text-base">
          Tell us about your project and we&apos;ll help with pricing and lead times. Looking to match an existing
          profile? Learn about our{" "}
          <Link href="/products/made-to-match" className="font-medium text-primary hover:underline">
            Made-to-Match process
          </Link>
          .
        </p>

        <div className="mt-10 not-prose">
          <QuoteRequestForm />
        </div>
      </div>
    </PageContent>
  );
}
