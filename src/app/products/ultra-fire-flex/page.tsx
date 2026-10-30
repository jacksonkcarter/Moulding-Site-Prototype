import Image from "next/image";
import { PageContent } from "@/components/PageContent";
import { ContactLink } from "@/components/ContactLink";
import ultraFireFlexLogo from "../../../../Project_Info/Website-Logos/Ultra-Fire-Flex.png";

export default function UltraFireFlexPage() {
  return (
    <PageContent fullWidth>
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-center">
          <Image
            src={ultraFireFlexLogo}
            alt="Ultra-Fire Flex"
            width={560}
            height={160}
            className="h-auto w-[16rem] sm:w-[20rem] md:w-[24rem]"
            priority
          />
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
          <h1 className="text-3xl font-sans tracking-tight text-neutral-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            Fire-rated moulding for commercial specifications
          </h1>
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            When a project demands more than standard moulding, Ultra-Fire Flex delivers the architectural finish you
            expect with elevated fire performance for commercial builds. It is backed by ASTM E84 testing with
            documented Class B flame-spread performance, so you can match fire requirements to the profile and
            application you need. Our product specialists can help you confirm the right choice for your
            specification.
          </p>
        </div>

        <section className="mt-14" aria-labelledby="classifications-heading">
          <h2
            id="classifications-heading"
            className="text-center text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            ASTM E84 classification
          </h2>
          <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-lg shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-neutral-200">
                  <th scope="col" className="px-4 py-2.5 text-sm font-bold text-neutral-800">
                    Material
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-sm font-bold text-neutral-800">
                    Classification
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-sm font-bold text-neutral-800">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2.5 text-sm font-bold text-primary">Ultra-Fire Flex</td>
                  <td className="px-4 py-2.5 text-sm font-bold text-primary">Class B</td>
                  <td className="px-4 py-2.5 text-sm font-bold">
                    <a
                      href="/product-info/ultra-fire-flex-astm-e84.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      PDF
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="mx-auto mt-14 max-w-3xl text-sm leading-relaxed text-neutral-700 md:text-base">
          Ultra-Fire Flex is manufactured exclusively at our Utah plant.
        </p>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            Need help matching a fire-rated specification?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Our team can help you confirm Ultra-Fire Flex for your commercial application and project requirements.
          </p>
          <ContactLink
            action="popover"
            className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
          >
            Contact our team
          </ContactLink>
        </section>
      </div>
    </PageContent>
  );
}
