import Image from "next/image";
import Link from "next/link";
import { MaterialComparisonTable } from "@/components/MaterialComparisonTable";
import { MaterialUpgradeCards } from "@/components/MaterialUpgradeCards";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";

export default function MaterialDetailsPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl not-prose">
        <div className="relative text-sm leading-relaxed text-neutral-700 md:text-base">
          <h1 className="mb-4 w-full text-3xl font-sans tracking-tight text-neutral-900 sm:mb-5 sm:mr-8 sm:w-[36%] sm:float-left md:text-4xl lg:text-5xl lg:leading-[1.1]">
            The look of custom wood at a fraction of the cost
          </h1>
          <figure className="mb-4 w-[69%] max-w-md float-right ml-3 sm:absolute sm:right-0 sm:top-1/2 sm:mb-0 sm:ml-0 sm:w-[35%] sm:max-w-none sm:-translate-y-1/2">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/product-info/ec1.jpg"
                alt="Flex Trim™ flexible moulding profile sample"
                fill
                className="object-contain object-right"
                sizes="(max-width: 640px) 69vw, 28vw"
                priority
              />
            </div>
          </figure>
          <div className="sm:pr-[36%]">
            <p>
              Curved walls, arched windows, and winding staircases create stunning spaces, but executing them in
              traditional curved wood is notoriously difficult and costly. Polyurethane molding delivers the exact same
              architectural finish in a fraction of the time and with significant cost savings. It perfectly replicates
              the profile, grain, and overall feel of real wood, bending beautifully to your design while offering
              superior durability against the elements.
            </p>
            <p className="mt-6">
              <strong className="font-semibold text-neutral-900">Flex Trim™</strong> is our original polymer resin
              blend and is the ideal choice for most applications. It&apos;s durable, consistent, and cost-effective.
              However, we know that some blueprints push the boundaries. For those unique challenges, we offer:
            </p>
          </div>
        </div>

        <h2
          id="specialized-material-upgrades"
          className="mt-10 clear-both scroll-mt-24 text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
        >
          Specialized material upgrades
        </h2>

        <MaterialUpgradeCards />

        <div className="-mt-8 grid items-center gap-6 sm:grid-cols-[11.5rem_1fr] sm:gap-8 lg:grid-cols-[13.8rem_1fr] lg:gap-10">
          <div className="relative mx-auto aspect-square w-[10.35rem] sm:mx-0 sm:w-full">
            <Image
              src="/product-info/coils/EC127-COIL.jpg"
              alt="EC127 coil of flexible moulding"
              fill
              className="object-contain"
              sizes="185px"
            />
          </div>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Our product specialists can select the material that&apos;s best suited for your project.{" "}
            <ContactLink action="popover" className="font-medium text-primary hover:underline">
              Talk to an expert
            </ContactLink>
            ,{" "}
            <Link href="/quote-request" className="font-medium text-primary hover:underline">
              get pricing
            </Link>
            , or learn more about our materials below.
          </p>
        </div>

        <MaterialComparisonTable />
      </div>
    </PageContent>
  );
}
