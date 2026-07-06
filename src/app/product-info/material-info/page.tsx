import { PageContent } from "@/components/PageContent";

interface MaterialItem {
  name: string;
  description: string;
}

const MATERIALS_NC_AND_UT: MaterialItem[] = [
  {
    name: "Flex Trim®",
    description:
      "Our original polymer resin blend. Ideal for most standard applications, it delivers everyday reliability that exceeds our competitors' \"premium\" products at a competitive price.",
  },
  {
    name: "Zzz Flex®",
    description:
      "Our state-of-the-art premium elastomer composite. Unmatched in strength, durability, and stainability, it is highly pliable—making it the ultimate choice for small, intricate patterns, tight radiuses, and cold-weather climates.",
  },
];

const MATERIALS_UT: MaterialItem[] = [
  {
    name: "Ultra-Flex",
    description:
      "A syntactic polyurethane with a wood-like cellular structure. It is 40-50% lighter than standard flexible moulding, making it perfect for massive profiles. It comes pre-primed for flawless finishing, back-sanded for maximum glue adhesion, and performs beautifully indoors or out.",
  },
  {
    name: "Machinable S4S",
    description:
      "Engineered from our Ultra-Flex compound, this material can be milled with conventional woodworking machinery (shapers, routers, and molders) without dulling expensive carbide knives. It is the perfect cost-saving solution when you only need a small amount of straight, custom-tooled footage.",
  },
];

function MaterialCard({ name, description }: MaterialItem) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h4 className="font-medium text-primary">{name}</h4>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  );
}

export default function MaterialInfoPage() {
  return (
    <PageContent title="Product Details" fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
          Elevate Your Space with Flex Trim®
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">
          Whether your project demands a unique custom style or flawless consistency, flexible polyurethane
          moulding is the perfect solution. It effortlessly overcomes complex architectural challenges,
          transforming any ordinary room into a memorable, elegant space.
        </p>

        <section className="mt-8" aria-labelledby="why-choose-heading">
          <h2
            id="why-choose-heading"
            className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl"
          >
            Why Choose Carter Millwork Flexible Moulding?
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-base font-semibold text-primary">Unmatched Performance</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                In many architectural applications, flexible moulding is a superior alternative to traditional wood.
                It delivers the authentic grain and natural beauty of real wood, but it will never rot, swell, or
                deteriorate over time. Highly durable, it is an ideal solution for both indoor and outdoor use.
              </p>
            </article>
            <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-base font-semibold text-primary">Maximum Cost-Effectiveness</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Keep your project on time and under budget. Flexible moulding is significantly faster and more
                affordable to produce than comparable radius wood moulding. In fact, it generally costs 70% less than
                traditional machined wood millwork.
              </p>
            </article>
            <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-base font-semibold text-primary">Exceptional Versatility</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Designed to adapt to your specific vision, all Carter Millwork products are paint-grade, and many offer
                stainable finishes. Our advanced molding process captures the exact grain of the original wood, ensuring
                our product seamlessly matches your existing samples.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-10" aria-labelledby="material-formulations-heading">
          <h2
            id="material-formulations-heading"
            className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl"
          >
            Material Formulations
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="border-b border-neutral-200 pb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Available from NC and UT
              </h3>
              <ul className="mt-4 space-y-4">
                {MATERIALS_NC_AND_UT.map((m) => (
                  <li key={m.name}>
                    <MaterialCard name={m.name} description={m.description} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="border-b border-neutral-200 pb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Available from UT
              </h3>
              <ul className="mt-4 space-y-4">
                {MATERIALS_UT.map((m) => (
                  <li key={m.name}>
                    <MaterialCard name={m.name} description={m.description} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageContent>
  );
}
