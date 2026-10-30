import Image from "next/image";
import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";
import { MoldLengthCalculator } from "@/components/MoldLengthCalculator";
import { SpliceExampleLink } from "@/components/SpliceExampleLink";

const LEAD_TIMES = [
  {
    label: "In stock",
    detail: "Usually ships within 24 hours of receiving your order",
  },
  {
    label: "Existing mold",
    detail: "Most custom orders ship within 2 weeks or less",
  },
  {
    label: "New mold",
    detail: "Most custom orders ship within 3 weeks or less",
  },
] as const;

const MADE_TO_MATCH_STEPS = [
  "Send us your rigid moulding in any material",
  "We'll create a custom mold with our precision tooling process",
  "Then we'll ship you the perfect match flexible moulding parts",
] as const;

export default function CopyYourUniqueProfilePage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
          Copy your unique profile in Flex Trim™
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-700 md:text-base">
          <p>
            Our catalog and the profiles on our website represent only a tiny fraction of the 50,000+ profiles that we
            have available as we add countless new profiles every single day. If you cannot find the
            profile you are trying to match, please provide the following information and we can confirm whether we
            have an existing match or not:
          </p>
          <ol className="list-decimal space-y-2 pl-10">
            <li>A to-scale drawing or tracing of the profile</li>
            <li>The thickness and width of the profile</li>
            <li>The moulding supplier and their profile name</li>
            <li>The moulding wood species or material</li>
          </ol>

          <p>
            If we don&apos;t have the profile/style you need in our existing inventory, we can recreate it through
            our Made-to-Match process:
          </p>

          <div className="mx-auto grid w-fit items-center gap-8 sm:grid-cols-[auto_auto] sm:gap-8">
            <div className="relative mx-auto aspect-[2472/1728] w-[12.5rem] shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:mx-0 sm:w-[13.75rem]">
              <Image
                src="/product-info/made-to-match.png"
                alt="Made-to-Match process showing a rigid model, flexible mold, and finished Flex Trim moulding"
                fill
                className="object-contain"
                sizes="13.75rem"
              />
            </div>
            <ol className="flex list-none flex-col p-0">
              {MADE_TO_MATCH_STEPS.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.25rem_1fr] gap-x-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold tracking-wide text-white"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    {index < MADE_TO_MATCH_STEPS.length - 1 ? (
                      <div
                        className="relative z-0 -mb-px mt-[2px] flex h-8 w-9 flex-col items-center pt-0.5"
                        aria-hidden
                      >
                        <svg
                          width="24"
                          height="32"
                          viewBox="0 0 24 32"
                          fill="none"
                          className="h-full w-6 text-neutral-900"
                          preserveAspectRatio="xMidYMax meet"
                        >
                          <path
                            d="M12 1v18"
                            stroke="currentColor"
                            strokeWidth="2.75"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.5 16L12 26L18.5 16"
                            stroke="currentColor"
                            strokeWidth="2.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                  <p className="pt-1.5 text-base font-medium leading-snug tracking-tight text-neutral-900 sm:text-lg">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-[1fr_minmax(12rem,18rem)] md:gap-8">
            <ul className="list-disc space-y-3 pl-10">
              <li>
                We are essentially in the copy business meaning we do not have a way to create a new profile using a
                drawing of the profile, unless it is something simple like flat stock.
              </li>
              <li>
                Unlike extruded moulding, all of our trim is cast from a mold. Our customers send us the actual wood (or
                PVC, plaster, etc.) models so we can make those molds. Our maximum part length is dictated by the length
                of the mold. The length of the mold is dictated by the length of the original models that we receive.
                Although a 12 ft mold is our standard, we can make shorter or longer molds with prior approval. Use the
                calculator below for the required sample length to send by flex finish grade.
              </li>
            </ul>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-lg bg-neutral-100 md:mx-0 md:max-w-none">
              <Image
                src="/product-info/Made To Match Installed.jpg"
                alt="Made-to-Match Flex Trim™ moulding installed in a finished interior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 24rem, 18rem"
              />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            <span className="font-medium text-neutral-900">Note:</span> UPS & FedEx charge oversized fees for packages
            longer than 8 ft. You may send us the profile in multiple pieces to keep shipment costs low, and we will
            join the pieces together when they arrive. For that reason, stained flex will have a{" "}
            <SpliceExampleLink>visible splice</SpliceExampleLink> if sent as two pieces. The splice is not visible when
            painted.
          </p>

          <MoldLengthCalculator />

          <ul className="list-disc space-y-3 pl-10">
            <li>
              Our negative cavity molds capture a reverse image of the original profile and will pick up every detail
              from the model, from simple profiles to highly intricate designs, even down to the actual wood grain.
            </li>
          </ul>

          <h2 className="pt-2 text-xl font-medium tracking-tight text-neutral-900 md:text-2xl">
            More than just linear moulding
          </h2>
          <p>
            We can also easily copy decorative architectural accessories like corbels, wood carvings, and more, no matter how detailed the original
            item is. That precision is why Flex Trim™ was chosen to replicate intricate 100+ year-old mouldings and
            accents for the Turkish Embassy in Washington, D.C. that were no longer available, as well as countless other
            restoration projects.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {LEAD_TIMES.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-neutral-700 md:text-base">
          Prefer to talk it through first?{" "}
          <ContactLink action="popover" className="font-medium text-primary hover:underline">
            Reach out to our team
          </ContactLink>
          , or{" "}
          <Link href="/quote-request" className="font-medium text-primary hover:underline">
            start a quote request
          </Link>
          .
        </p>
      </div>
    </PageContent>
  );
}
