import Image from "next/image";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";

const BULLNOSE_IMAGES = [
  {
    src: "/product-info/bullnose/bullnose.png",
    alt: "Bullnose corner flexible moulding example",
    caption: "Bullnose corner",
  },
  {
    src: "/product-info/bullnose/isr-corner.png",
    alt: "ISR tight-radius corner flexible moulding example",
    caption: "Tight radius ISR corner",
  },
] as const;

export default function BullnoseCornersTightRadiiPage() {
  return (
    <PageContent title="Bullnose corners & tight radii">
      <div className="space-y-8 text-neutral-600 not-prose">
        <div className="space-y-4 text-sm leading-relaxed md:text-base">
          <p>
            Flex Trim™ is the only flexible moulding company with virtually no radius limitations. While our standard
            tooling process and products cover the vast majority of radius applications, our alternative tooling
            processes allow us to reach radii that were historically unachievable, even down to a &ldquo;zero&rdquo;
            radius miter cut.
          </p>
          <p>
            Note that our tight radius items are paint grade only and have the same finish as a primed poplar. Since
            they require special tooling and our typical &ldquo;off the shelf&rdquo; product will not work, these
            applications always need to be discussed with Flex Trim™ before quoting or ordering.{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              Contact us
            </ContactLink>{" "}
            to talk through your project.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {BULLNOSE_IMAGES.map((image) => (
            <figure key={image.src} className="min-w-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <figcaption className="mt-2 text-center text-sm font-medium text-neutral-700">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </PageContent>
  );
}
