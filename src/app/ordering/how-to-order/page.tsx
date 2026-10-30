import Link from "next/link";
import { PageContent } from "@/components/PageContent";

const AUDIENCES = [
  {
    title: "Architect or designer",
    body: "Specify curves, match profiles, and keep projects on schedule with drawings-ready flexible moulding.",
    href: "/ordering/architects-designers",
  },
  {
    title: "Contractor or builder",
    body: "Install flexible trim like wood on the jobsite, with stock options when you need speed and custom when you need an exact match.",
    href: "/ordering/contractors-builders",
  },
  {
    title: "Dealer or distributor",
    body: "Support your customers with Flex Trim™ inventory, fast lead times, and two-coast supply from Carter Millwork.",
    href: "/ordering/dealers-distributors",
  },
  {
    title: "Homeowner or end user",
    body: "Elevate your home or business with curved trim for arched doors, round windows, and radius walls.",
    href: "/ordering/homeowners",
  },
  {
    title: "Existing customer",
    body: "Request a quote for your next order or check the status of an order already in progress.",
    href: "/ordering/existing-customers",
  },
] as const;

function AudienceArrow() {
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-white transition group-hover:bg-primary-hover"
      aria-hidden
    >
      <svg className="h-3 w-3 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  );
}

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
            <li
              key={audience.href}
              className={`flex min-w-0 flex-col border-t border-neutral-200 pt-5${
                audience.href === "/ordering/existing-customers" ? " sm:col-span-2" : ""
              }`}
            >
              <Link
                href={audience.href}
                className="group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span className="font-medium text-neutral-900 transition-colors group-hover:text-primary">
                  {audience.title}
                </span>
                <AudienceArrow />
              </Link>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{audience.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageContent>
  );
}
