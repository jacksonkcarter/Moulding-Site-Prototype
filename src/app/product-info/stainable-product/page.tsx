import Image from "next/image";
import Link from "next/link";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";

const FINISHING_STEPS = [
  {
    title: "Use a gel stain",
    description:
      "Apply a heavy-bodied gel stain according to the manufacturer’s specifications for the best color depth and grain definition.",
  },
  {
    title: "Do not sand",
    description:
      "The wood grain is on the surface only. Sanding stain-grade material will permanently remove the replicated grain pattern.",
  },
  {
    title: "Seal the finish",
    description:
      "Apply a clear coat after staining to protect the finish and lock in the look of real wood.",
  },
  {
    title: "Additional staining tips",
    description:
      "To achieve a darker color, apply the stain generously and work the pigment down into the recesses of the embossed grain. Wipe the excess stain with a soft cloth. Use a dry, soft brush to feather or remove any cloth marks for a blemish free finish, then let it cure completely. Gel stain on resin takes longer to dry than on wood and it must be completely dry to the touch, without any tackiness, before you move on. If the first coat isn't dark enough, apply a second, very thin coat of gel stain using the same process as the first coat. Because the first coat sealed the surface, this second layer will glide over the top, deepening the color without disturbing the layer underneath. Repeat if needed. You can also play with 2 different pigments: darker then lighter vs lighter then darker.",
  },
] as const;

const STAIN_SAMPLES = [
  {
    title: "Knotty Alder Grain with Cherry Stain",
    grainLine: "Knotty Alder Grain with",
    stainLine: "Cherry Stain",
    src: "/product-info/stain-samples/Knotty Alder Grain with Cherry Stain.png",
  },
  {
    title: "Knotty Alder Grain with Oak Stain",
    grainLine: "Knotty Alder Grain with",
    stainLine: "Oak Stain",
    src: "/product-info/stain-samples/Knotty Alder Grain with Oak Stain.png",
  },
  {
    title: "Knotty Alder Grain with Rosewood Stain",
    grainLine: "Knotty Alder Grain with",
    stainLine: "Rosewood Stain",
    src: "/product-info/stain-samples/Knotty Alder Grain with Rosewood Stain.png",
  },
  {
    title: "Mahogany Grain with Mahogany Stain",
    grainLine: "Mahogany Grain with",
    stainLine: "Mahogany Stain",
    src: "/product-info/stain-samples/Mahogany Grain with Mahogany Stain.png",
  },
  {
    title: "Mahogany Grain with Rosewood Stain",
    grainLine: "Mahogany Grain with",
    stainLine: "Rosewood Stain",
    src: "/product-info/stain-samples/Mahogany Grain with Rosewood Stain.png",
  },
  {
    title: "Maple Grain with Cherry Stain",
    grainLine: "Maple Grain with",
    stainLine: "Cherry Stain",
    src: "/product-info/stain-samples/Maple Grain with Cherry Stain.png",
  },
  {
    title: "Maple Grain with Oak Stain",
    grainLine: "Maple Grain with",
    stainLine: "Oak Stain",
    src: "/product-info/stain-samples/Maple Grain with Oak Stain.png",
  },
] as const;

export default function StainableProductPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl not-prose">
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Stainable curved trim that matches real wood grain
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Carter Millwork stain-grade flexible moulding, corbels, and appliques are built to replicate the look of
            real wood—not just the profile, but the grain. Our mold technology captures species-specific characteristics
            so your finished trim reads like wood on the wall.
          </p>
        </div>

        <div className="mt-10 text-sm leading-relaxed text-neutral-700 md:text-base">
          <figure className="mb-4 w-full sm:float-right sm:mb-4 sm:ml-8 sm:w-[30%]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/product-info/stain-samples/arch-casing-foyer-paint-and-stain.jpg"
                alt="Arch Casing Foyer Paint and Stain"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 30vw"
                priority
              />
            </div>
          </figure>

          <p>
            Our mold manufacturing process lets us reproduce stain-grade wood mouldings with remarkable accuracy,
            regardless of wood species. Every grain pattern and species detail from your sample becomes part of the
            mold—and that detail carries through to the flexible finished product.
          </p>
          <p className="mt-6">
            When a heavy-bodied gel stain is applied according to the manufacturer&apos;s specifications, the results
            are striking: rich color, visible grain, and a finish that blends with existing woodwork. Stainable trim is
            ideal when paint-grade moulding is not enough and you need flexible profiles that still look like wood.
          </p>
          <p className="mt-6">
            Please note: we cannot create or change the grain from a provided sample or within one of our existing
            molds. Stain-grade profiles are limited, so{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              reach out to us
            </ContactLink>{" "}
            if you are looking for something specific.
          </p>
        </div>

        <section className="mt-14 clear-both" aria-labelledby="stain-samples-heading">
          <h2
            id="stain-samples-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Grain and stain examples
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
            Below are a few examples of stained Flex Trim™ demonstrating the wide variety of looks that can be achieved
            with our product. We&apos;ll provide the raw unstained flex material so that you can select whatever stain
            color is correct for your application.
          </p>
          <ul className="mt-8 grid list-none grid-cols-7 gap-3 p-0">
            {STAIN_SAMPLES.map((sample) => (
              <li key={sample.src} className="min-w-0">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={sample.src}
                    alt={sample.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1152px) 14vw, 160px"
                  />
                </div>
                <h3 className="mt-2 text-center text-[11px] font-semibold leading-snug text-neutral-900 sm:text-xs">
                  <span className="block">{sample.grainLine}</span>
                  <span className="block">{sample.stainLine}</span>
                </h3>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="finishing-heading">
          <h2
            id="finishing-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            Finishing stain-grade flexible moulding
          </h2>

          <div className="mt-8 text-sm leading-relaxed text-neutral-700 md:text-base">
            <figure className="mb-4 w-1/2 float-left mr-4 sm:mb-4 sm:mr-8 sm:w-[19%]">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/product-info/stain-samples/corbel-stained.jpg"
                  alt="Corbel Stained"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 19vw"
                />
              </div>
            </figure>

            <p>
              Stain-grade Flex Trim™ is finished much like wood, with a few important differences that protect the
              replicated grain. Follow these steps for the best results on mouldings, corbels, and appliques.
            </p>

            <div className="mt-6 space-y-5">
              {FINISHING_STEPS.map((step) => (
                <div key={step.title}>
                  <div className="mb-2 h-1 w-8 rounded-full bg-primary" />
                  <h3 className="text-sm font-semibold text-neutral-900 md:text-base">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 clear-both rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Need help choosing a stainable profile?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Our team can help you match an existing wood sample or recommend the right stain-grade option for your
            project. See our{" "}
            <Link href="/ordering-installation/installation-guide#finishing" className="font-medium text-primary hover:underline">
              installation guide
            </Link>{" "}
            for gel-stain tips, or{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              contact us
            </ContactLink>{" "}
            to talk with a specialist.
          </p>
        </section>
      </div>
    </PageContent>
  );
}
