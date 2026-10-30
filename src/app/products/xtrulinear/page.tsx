import Image from "next/image";
import { BendingStylesLink } from "@/components/BendingStylesCard";
import { PageContent } from "@/components/PageContent";
import { ProductKeyBenefits } from "@/components/ProductKeyBenefits";
import { ContactLink } from "@/components/ContactLink";
import Link from "next/link";

const KEY_BENEFITS = [
  {
    title: "Continuous lengths up to 500'",
    description:
      "Go beyond the typical 12' limit. Xtrulinear® delivers Flex Trim™ or Zzz Flex quality in one continuous piece from 12' all the way to 500'.",
  },
  {
    title: "Spooled for cut-to-length dispensing",
    description:
      "Material ships wound on a spool, ideal for retail, warehouse, or jobsite use. Cut only what you need and keep waste near zero.",
  },
  {
    title: "Fewer joints on long runs",
    description:
      "Long, uninterrupted lengths reduce splices and special-order hassle, so you spend less time measuring and piecing trim together.",
  },
] as const;

const LIMITATIONS = [
  { feetPerSpool: "500'", profileSize: '3/4" × 3/4"' },
  { feetPerSpool: "250'", profileSize: '1/2" × 2"' },
  { feetPerSpool: "100'", profileSize: '3/4" × 2-1/4"' },
  { feetPerSpool: "75'", profileSize: '3/4" × 3-1/2"' },
] as const;

const LIMITATIONS_NOTES = [
  {
    title: "Straight pieces only",
    description: (
      <>
        Moulding bent <BendingStylesLink>style 2</BendingStylesLink>, like most casing applications,
        cannot be properly spooled and is not available for Xtrulinear®.
      </>
    ),
  },
  {
    title: "Extra production",
    description:
      "The Xtrulinear® manufacturing process requires more steps during manufacturing. For this reason, pricing is typically 30% higher than standard length pieces. Talk to a sales specialist to see if it's right for you.",
  },
  {
    title: "Pallet shipping only",
    description: "Due to its size and weight, Xtrulinear® items are only shipped LTL.",
  },
];

export default function XtrulinearPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:gap-14">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary md:text-base">
              Xtrulinear®
            </p>
            <h1 className="mt-1 text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
              Extended-length flexible moulding on a spool
            </h1>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
              With Xtrulinear®, order Flex Trim™ or Zzz Flex in continuous lengths from 12' up to 500' in a single
              piece, ready to dispense at retail, in the warehouse, or on the jobsite. Available from our North Carolina
              and Utah plants.
            </p>
            <div className="mt-5 mx-auto grid w-3/4 grid-cols-2 gap-8 sm:gap-10">
              <Image
                src="/product-info/xtrulinear.png"
                alt="Xtrulinear® flexible moulding on a spool"
                width={480}
                height={360}
                className="h-auto w-full object-contain"
              />
              <Image
                src="/product-info/xtrulinear2.png"
                alt="Xtrulinear® spooled moulding product"
                width={480}
                height={360}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>

        <ProductKeyBenefits benefits={KEY_BENEFITS} limitations={LIMITATIONS_NOTES} />

        <section className="mt-14" aria-labelledby="spool-limits-heading">
          <div className="mx-auto max-w-xl overflow-hidden rounded-lg shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th
                    id="spool-limits-heading"
                    colSpan={2}
                    scope="colgroup"
                    className="bg-primary px-4 py-3 text-base font-bold text-white md:text-lg"
                  >
                    Spool length vs profile size
                  </th>
                </tr>
                <tr className="bg-neutral-200">
                  <th scope="col" className="px-4 py-2.5 text-sm font-bold text-neutral-800">
                    Ft/Spool
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-sm font-bold text-neutral-800">
                    Profile Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {LIMITATIONS.map((row, index) => (
                  <tr
                    key={row.feetPerSpool}
                    className={index % 2 === 0 ? "bg-white" : "bg-neutral-100"}
                  >
                    <td className="px-4 py-2.5 text-sm font-bold text-primary">{row.feetPerSpool}</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-primary">{row.profileSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-600">
            Profiles or lengths that exceed spool capacity can be coiled in a box instead.
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Planning a long continuous run?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Our team can help you confirm profile availability, spool options, and the right Xtrulinear® length for your
            project.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ContactLink
              action="popover"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
            >
              Contact our team
            </ContactLink>
            <Link
              href="/quote-request"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover sm:w-auto"
            >
              Request a quote
            </Link>
          </div>
        </section>
      </div>
    </PageContent>
  );
}
