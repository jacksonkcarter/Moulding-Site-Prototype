import Image from "next/image";
import { BendingStylesLink } from "@/components/BendingStylesCard";
import { PageContent } from "@/components/PageContent";
import { ProductKeyBenefits } from "@/components/ProductKeyBenefits";
import { ContactLink } from "@/components/ContactLink";

const KEY_BENEFITS = [
  {
    title: "Seamless workflow",
    description:
      "Ideal for custom short runs, allowing you to transition immediately after a standard wood moulding run.",
  },
  {
    title: "Cost-effective",
    description:
      "Offers savings by eliminating the need for custom tooling on orders with low linear footage.",
  },
  {
    title: "Specialty uses",
    description: (
      <>
        Recommended for radius arch extension jamb material, curved baseboard, and chair rail bending{" "}
        <BendingStylesLink>style 1</BendingStylesLink> only.
      </>
    ),
  },
];

const SPECIFICATIONS = [
  { label: "Thickness", value: '1/2" to 2"' },
  { label: "Width", value: '1-3/4" to 16"' },
  { label: "Length", value: "8' to 12'" },
] as const;

const LIMITATIONS = [
  {
    title: "Finish",
    description: "Paint grade material only.",
  },
  {
    title: "Application",
    description: (
      <>
        Cannot be used for radius casing, crown, or bending{" "}
        <BendingStylesLink>style 2</BendingStylesLink> in general.
      </>
    ),
  },
  {
    title: "Origin",
    description: "Proudly manufactured in our UT facility.",
  },
];

const MILLING_TIP_CATEGORIES = [
  {
    title: "Tooling and machine setup",
    tips: [
      {
        text: "Machinable S4S machines similarly to MDF. Carbide knives work best.",
        children: [
          "High-speed steel will work, but does not stay sharp as long as carbide.",
          "This material is intended for short runs and can dull knives faster than wood.",
        ],
      },
      { text: "Run at slow feed speeds (15–30 fpm)." },
      { text: "Use good dust collection." },
    ],
  },
  {
    title: "Preparation",
    tips: [
      {
        text: "Lay out the material and let it relax until it lays flat. Warm outdoor sun can help speed the process.",
      },
      {
        text: "Order extra material for a test run to confirm suitability for your equipment and application.",
      },
    ],
  },
  {
    title: "Material setup and workholding",
    tips: [
      { text: "A substrate can be glued to Machinable Ultra Flex for added support." },
      {
        text: "Use hold-downs, featherboards, guides, and jigs to keep the material stable.",
      },
      {
        text: "To reduce snipe at the lead end, add a sacrificial board at the start of the run with a 45° bevel that mates to a matching 45° cut on the flex, holding the material down through the cut.",
      },
    ],
  },
  {
    title: "Cutting technique and precautions",
    tips: [
      {
        text: 'Large pieces with a lot of material being “hogged out” may require multiple passes.',
      },
      { text: "Milling small pieces may not be suitable for some equipment." },
    ],
  },
] as const;

export default function MachinableS4SPage() {
  return (
    <PageContent title="Machinable S4S" fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
          <h2 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Mill your own flexible profiles using your existing knives
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Engineered for ultimate versatility, this machinable flexible moulding stock shares the premium
            performance of our Ultra-Flex formulation, but is specifically designed to be milled using your
            conventional woodworking equipment. Treat it just like real wood. Run it through moulders, shapers, and
            routers using the traditional woodworking practices that you know best.
          </p>
        </div>

        <ProductKeyBenefits benefits={KEY_BENEFITS} limitations={LIMITATIONS} />

        <section className="mt-14" aria-labelledby="specifications-heading">
          <h2
            id="specifications-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Standard specifications
          </h2>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-8 lg:gap-10">
            <div className="relative mx-auto aspect-[1201/300] w-full max-w-lg shrink-0 md:mx-0 md:max-w-none md:w-[70%] lg:w-[76%]">
              <Image
                src="/product-info/machinable-s4s.jpg"
                alt="Machinable S4S flexible moulding stock"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 512px, 800px"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {SPECIFICATIONS.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-neutral-500">{spec.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="milling-tips-heading">
          <h2
            id="milling-tips-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Tips and techniques for milling
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {MILLING_TIP_CATEGORIES.map((category) => (
              <div
                key={category.title}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-primary">{category.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600">
                  {category.tips.map((tip) => (
                    <li key={tip.text}>
                      {tip.text}
                      {"children" in tip && tip.children ? (
                        <ul className="mt-2 list-disc space-y-2 pl-5">
                          {tip.children.map((child) => (
                            <li key={child}>{child}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Need dimensions outside our standard range?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            We are here to help you find the right fit for your build. Contact our team to explore custom sizing
            alternatives for your specific architectural needs.
          </p>
          <ContactLink action="popover" className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto">
            Contact our team
          </ContactLink>
        </section>
      </div>
    </PageContent>
  );
}
