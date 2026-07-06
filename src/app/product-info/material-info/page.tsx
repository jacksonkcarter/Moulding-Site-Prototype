import Link from "next/link";
import { MaterialComparisonTable } from "@/components/MaterialComparisonTable";
import { MaterialUpgradeCards } from "@/components/MaterialUpgradeCards";
import { PageContent } from "@/components/PageContent";

export default function MaterialInfoPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            The look of custom wood at a fraction of the cost
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            Curved walls, arched windows, and winding staircases create stunning spaces, but executing them in
            traditional curved wood is notoriously difficult and costly. Polyurethane molding delivers the exact same
            architectural finish in a fraction of the time and with significant cost savings. It perfectly replicates
            the profile, grain, and overall feel of real wood, bending beautifully to your design while offering
            superior durability against the elements.
          </p>
        </div>

        <div className="mt-8 text-sm leading-relaxed text-neutral-700 md:text-base">
          <p>
            <strong className="font-semibold text-neutral-900">Flex Trim®</strong> is our original polymer resin
            blend and is the ideal choice for most applications. It&apos;s durable, consistent, and cost-effective.
            However, we know that some blueprints push the boundaries. For those unique challenges, we offer:
          </p>
        </div>

        <h2
          id="specialized-material-upgrades"
          className="mt-8 scroll-mt-24 text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
        >
          Specialized material upgrades
        </h2>

        <MaterialUpgradeCards />

        <p className="mt-8 text-sm leading-relaxed text-neutral-700 md:text-base">
          Our product specialists can select the material that&apos;s best suited for your project.{" "}
          <Link href="/contact-us" className="font-medium text-primary hover:underline">
            Talk to an expert
          </Link>
          ,{" "}
          <Link href="/quote-request" className="font-medium text-primary hover:underline">
            get pricing
          </Link>
          , or learn more about our materials below.
        </p>

        <MaterialComparisonTable />
      </div>
    </PageContent>
  );
}
