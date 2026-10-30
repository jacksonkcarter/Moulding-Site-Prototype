"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const BENEFITS = [
  {
    id: "trusted-expertise",
    title: "Decades of trusted expertise",
    description:
      "Going back to 1963, we have consolidated the knowledge of six different companies into a single, trusted brand built on decades of experience.",
  },
  {
    id: "value-engineered",
    title: "Value-engineered with a lifetime warranty",
    description:
      "Compared to traditional radiused wood millwork, flexible moulding generally is faster to produce, costs up to 70% less, and allows for quick on-site adjustments.",
  },
  {
    id: "interior-exterior",
    title: "Interior & exterior compatible",
    description:
      "Our flexible trim adapts seamlessly to any environment, whether elevating your indoor spaces or braving the elements outside with an exterior finish coating.",
  },
  {
    id: "impact-resistant",
    title: "Impact-resistant & chip-proof",
    description:
      "Built to maintain its perfect profile for years to come, this hard polyurethane material resists dents and is entirely chip-proof.",
  },
  {
    id: "moisture-rot-proof",
    title: "Moisture & rot proof",
    description:
      "Ideal for high-moisture environments like bathrooms, kitchens, and exterior trims, our material completely resists water absorption and will never warp or decay.",
  },
  {
    id: "insect-proof",
    title: "Insect proof",
    description:
      "Protect your investment with a resin-based material that naturally repels insects and prevents the decay commonly seen in old wood.",
  },
  {
    id: "easy-to-install",
    title: "Easy to install",
    description:
      "Forget specialized equipment: our flexible moulding cuts, nails, and glues using the same tools and techniques you use for traditional wood millwork.",
  },
  {
    id: "stainable-paintable",
    title: "Stainable & paintable",
    description:
      "While all of our product is paintable, our stain-grade flexible trim perfectly reproduces the unique grain pattern of any chosen wood species.",
  },
  {
    id: "pfas-voc-free",
    title: "PFAS & VOC free",
    description:
      'Breathe easy knowing our moulding is manufactured without "forever chemicals" or volatile organic compounds, ensuring safe air quality for your home.',
  },
] as const;

type BenefitId = (typeof BENEFITS)[number]["id"];

const BENEFIT_LIST_TITLE_LINES: Record<BenefitId, readonly [string, string]> = {
  "trusted-expertise": ["Decades of", "trusted expertise"],
  "value-engineered": ["Value-engineered with a", "lifetime warranty"],
  "interior-exterior": ["Interior & exterior", "compatible"],
  "impact-resistant": ["Impact-resistant &", "chip-proof"],
  "moisture-rot-proof": ["Moisture & rot", "proof"],
  "insect-proof": ["Insect", "proof"],
  "easy-to-install": ["Easy to", "install"],
  "stainable-paintable": ["Stainable &", "paintable"],
  "pfas-voc-free": ["PFAS &", "VOC free"],
};

function BenefitEmblem({ id }: { id: BenefitId }) {
  const common = "h-6 w-6";
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      {id === "value-engineered" ? (
        <span className="text-xl font-semibold leading-none">$</span>
      ) : id === "stainable-paintable" ? (
        <span
          className={common}
          aria-hidden
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: "url('/emblems/paint-mask-cropped.png')",
            maskImage: "url('/emblems/paint-mask-cropped.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : id === "insect-proof" ? (
        <span
          className={common}
          aria-hidden
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: "url('/emblems/insect-mask-cropped-v2.png')",
            maskImage: "url('/emblems/insect-mask-cropped-v2.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : id === "moisture-rot-proof" ? (
        <span
          className={common}
          aria-hidden
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: "url('/emblems/moisture-mask-cropped-v2.png')",
            maskImage: "url('/emblems/moisture-mask-cropped-v2.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : id === "interior-exterior" ? (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93l1.41 1.41" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.66 17.66l1.41 1.41" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12h2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 19.07l1.41-1.41" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.66 6.34l1.41-1.41" />
        </svg>
      ) : id === "pfas-voc-free" ? (
        <span
          className={common}
          aria-hidden
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: "url('/emblems/health-shield-mask-cropped.png')",
            maskImage: "url('/emblems/health-shield-mask-cropped.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : id === "easy-to-install" ? (
        <span
          className={common}
          aria-hidden
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: "url('/emblems/hammer-mask-cropped.png')",
            maskImage: "url('/emblems/hammer-mask-cropped.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : id === "impact-resistant" ? (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l7 3v6c0 4.5-3.1 8.7-7 9.8C8.1 20.7 5 16.5 5 12V6l7-3z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      ) : (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 21V9l7-4 7 4v12" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13h.01" />
        </svg>
      )}
    </div>
  );
}

type FlexTrimBenefitTilesProps = {
  title: string;
  headingId?: string;
  layout?: "grid" | "list";
};

export function FlexTrimBenefitTiles({
  title,
  headingId,
  layout = "grid",
}: FlexTrimBenefitTilesProps) {
  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id={headingId}
          className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl"
        >
          {title}
        </h2>
      </div>

      <div
        className={`mt-8 grid ${
          layout === "grid" ? "gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 gap-5"
        }`}
      >
        {BENEFITS.map((benefit, index) => (
          <motion.article
            key={benefit.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            className={
              layout === "list"
                ? "grid items-center gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,17rem)_2.5rem_minmax(0,1fr)] sm:gap-x-6"
                : "h-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            }
          >
            {layout === "list" ? (
              <>
                <h3 className="text-right text-base font-semibold leading-snug text-neutral-900">
                  <span className="block">{BENEFIT_LIST_TITLE_LINES[benefit.id][0]}</span>
                  <span className="block">
                    {benefit.id === "value-engineered" ? (
                      <Link
                        href="/resources/warranty"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {BENEFIT_LIST_TITLE_LINES[benefit.id][1]}
                      </Link>
                    ) : (
                      BENEFIT_LIST_TITLE_LINES[benefit.id][1]
                    )}
                  </span>
                </h3>
                <div className="justify-self-center">
                  <BenefitEmblem id={benefit.id} />
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">{benefit.description}</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <BenefitEmblem id={benefit.id} />
                  <h3 className="text-base font-semibold leading-snug text-neutral-900">
                    {benefit.id === "value-engineered" ? (
                      <>
                        <span className="block">Value-engineered with a</span>
                        <span className="block">
                          <Link
                            href="/resources/warranty"
                            className="text-primary underline-offset-2 hover:underline"
                          >
                            lifetime warranty
                          </Link>
                        </span>
                      </>
                    ) : (
                      benefit.title
                    )}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{benefit.description}</p>
              </>
            )}
          </motion.article>
        ))}
      </div>
    </>
  );
}

export function HomeBenefitTiles() {
  return (
    <section id="benefits-tiles" className="scroll-mt-24 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-12 sm:pt-6 lg:pb-14 lg:pt-8">
        <FlexTrimBenefitTiles title="Why choose Flex Trim™?" />
      </div>
    </section>
  );
}
