import Link from "next/link";
import { OrderingTips } from "@/components/OrderingTips";
import { PageContent } from "@/components/PageContent";
import { ONLINE_DEALERS } from "@/data/online-dealers";

export default function HomeownersPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl not-prose">
        <header className="grid items-start gap-6 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-12">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Flexible trim for the curves in your home
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Flex Trim™ is flexible moulding for arched doorways, round windows, curved walls, and other places
            straight wood won&apos;t bend. Here&apos;s how to order it.
          </p>
        </header>

        <div className="mt-12">
          <OrderingTips />
        </div>

        <div className="mt-12 grid gap-10 border-t border-neutral-200 pt-10 md:grid-cols-2 md:gap-12">
          <section aria-labelledby="buy-online-heading">
            <h2
              id="buy-online-heading"
              className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
            >
              Buy online
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              Flex Trim™ products are available through several online retailers. Choose the option that works best
              for you:
            </p>
            <ul className="mt-5 space-y-4 text-sm md:text-base">
              {ONLINE_DEALERS.map((retailer) => (
                <li key={retailer.href}>
                  <a
                    href={retailer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {retailer.label}
                  </a>
                  <p className="mt-0.5 text-sm text-neutral-600">{retailer.details}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-neutral-700 md:text-base">
              Flexible Millwork also assists with custom applications when a stock profile isn&apos;t the right fit.
            </p>
          </section>

          <section aria-labelledby="local-dealers-heading">
            <h2
              id="local-dealers-heading"
              className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
            >
              Find a dealer nearby
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              Use our{" "}
              <Link
                href="/ordering-installation/dealer-search"
                className="font-medium text-primary hover:underline"
              >
                dealer search
              </Link>{" "}
              to locate Flex Trim™ dealers by zip code and driving radius.
            </p>
          </section>
        </div>
      </div>
    </PageContent>
  );
}
