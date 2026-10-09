import Link from "next/link";
import { PageContent } from "@/components/PageContent";

const AUDIENCES = [
  {
    title: "Architect or designer",
    body: "Specify curves, match profiles, and keep projects on schedule with drawings-ready flexible moulding.",
    href: "/ordering-installation/architects-designers",
    cta: "Continue as an architect or designer",
  },
  {
    title: "Contractor or builder",
    body: "Install flexible trim like wood on the jobsite, with stock options when you need speed and custom when you need an exact match.",
    href: "/ordering-installation/contractors-builders",
    cta: "Continue as a contractor or builder",
  },
  {
    title: "Dealer or distributor",
    body: "Support your customers with Flex Trim™ inventory, fast lead times, and two-coast supply from Carter Millwork.",
    href: "/ordering-installation/dealers-distributors",
    cta: "Continue as a dealer or distributor",
  },
  {
    title: "Homeowner or end user",
    body: "Elevate your home or business with curved trim for arched doors, round windows, and radius walls.",
    href: "/ordering-installation/homeowners",
    cta: "Continue as a homeowner or end user",
  },
  {
    title: "Existing customer",
    body: "Request a quote for your next order or check the status of an order already in progress.",
    href: "/ordering-installation/existing-customers",
    cta: "Continue as an existing customer",
  },
] as const;

export default function HowToOrderPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl not-prose">
        <header className="space-y-6">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Get started
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-neutral-700 md:text-base">
            Flex Trim™ is the easy curved trim solution for projects big or small, commercial or residential, indoor or
            outdoor. To get started, what&apos;s your role on the project?
          </p>
        </header>

        <ul className="mt-12 grid list-none gap-6 p-0 sm:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <li key={audience.href} className="flex min-w-0 flex-col border-t border-neutral-200 pt-5">
              <p className="font-medium text-neutral-900">{audience.title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{audience.body}</p>
              <Link
                href={audience.href}
                className="mt-5 inline-flex w-fit items-center justify-center rounded-full border-2 border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {audience.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContent>
  );
}
