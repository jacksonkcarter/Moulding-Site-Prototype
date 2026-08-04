import Image from "next/image";
import type { ReactNode } from "react";
import { PageContent } from "@/components/PageContent";

const TIMELINE: { date: string; text: ReactNode }[] = [
  {
    date: "1963",
    text: (
      <>
        <strong>Ultra-Flex Moulding</strong>, later to be acquired by Carter Millwork, is
        established by B.F. Adams Company as the original inventor of flexible moulding and headquartered in
        Escondido, CA.
      </>
    ),
  },
  {
    date: "1985",
    text: (
      <>
        <strong>Flex Trim™</strong>, later to be acquired by Carter Millwork, is founded by Allen
        Jones and headquartered in Rancho Cucamonga, CA, as well as Garner, NC.
      </>
    ),
  },
  {
    date: "1993",
    text: (
      <>
        <strong>Zago Flexible Mouldings</strong>, later to be acquired by Carter Millwork, is
        established in Newark, NJ.
      </>
    ),
  },
  {
    date: "February 1995",
    text: (
      <>
        <strong>Carter Millwork</strong> is founded in Linwood, NC, by Ned and Sally Carter.
      </>
    ),
  },
  {
    date: "July 1999",
    text: (
      <>
        <strong>Flexible Moulding International</strong>, later to be acquired by Carter Millwork,
        is founded by Theron Anderson and headquartered in Provo, UT.
      </>
    ),
  },
  {
    date: "January 2007",
    text: <>Second-generation owners Greg and Alan Carter purchase the family business, Carter Millwork.</>,
  },
  {
    date: "November 2008",
    text: (
      <>
        Carter Millwork acquires Flex Trim™, a pioneer in flexible moulding technology, moving all production to our
        North Carolina facility.
      </>
    ),
  },
  {
    date: "January 2009",
    text: (
      <>
        Carter Millwork acquires Flexible Moulding International, establishing{" "}
        <strong>Flex Trim West</strong> to serve the Western United States. Second Generation Matt and Kacey Anderson
        assume full operational leadership, and still run it today with exceptional skill and care.
      </>
    ),
  },
  {
    date: "April 2012",
    text: (
      <>
        Carter Millwork acquires Ultra-Flex Moulding, the original inventor of flexible moulding, consolidating its
        production into our Utah facility.
      </>
    ),
  },
  {
    date: "March 2014",
    text: (
      <>
        Carter Millwork acquires Flexgrain, the flexible moulding division of Woodgrain Distribution, consolidating its
        production into our North Carolina facility.
      </>
    ),
  },
  {
    date: "July 2014",
    text: (
      <>
        Carter Millwork acquires Zago Flexible Mouldings, consolidating its production into our North Carolina facility.
      </>
    ),
  },
  {
    date: "April 2017",
    text: (
      <>
        Carter Millwork relocates from Linwood, NC, just down the road to a larger facility in Lexington, NC, expanding
        capacity to smoothly support growing production demand.
      </>
    ),
  },
  {
    date: "January 2021",
    text: (
      <>
        Greg Carter assumes sole ownership of Carter Millwork, continuing the family legacy and our commitment to
        industry-leading quality.
      </>
    ),
  },
  {
    date: "January 2025",
    text: "Third-generation Jackson Carter joins the business, bringing an engineering background to modernize our manufacturing processes and digital workflows.",
  },
];

export default function AboutUsPage() {
  return (
    <PageContent title="Our company" fullWidth>
      <div className="mx-auto w-full max-w-6xl space-y-6 text-neutral-600 not-prose">
        <section>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="min-w-0 flex-1">
              <h2 className="font-sans text-2xl font-medium tracking-tight text-neutral-900">
                The industry leaders in flexible moulding
              </h2>
              <p className="mt-4 leading-relaxed">
                Carter Millwork, Inc. is the proud parent company uniting three of the oldest, largest, and most respected names in the industry: Flex Trim™, Carter Millwork, and Ultra-Flex Moulding.
              </p>
              <p className="mt-4 leading-relaxed">
                As a second-generation, family-owned business based in Lexington, North Carolina, we believe in hands-on management and sustainable growth. Our philosophy is simple: we never make a promise to a customer that we cannot keep. While we are proud to be the largest flexible moulding supplier in the world, our primary goal is always to be the best.
              </p>
            </div>
            <figure className="mx-auto w-56 shrink-0 sm:mx-0 sm:w-64 md:w-72">
              <div className="relative aspect-square w-full">
                <Image
                  src="/company-info/made-in-usa.jpg"
                  alt="Made in USA"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
                />
              </div>
            </figure>
          </div>
        </section>

        <section className="mx-[calc(0.5rem+0.5in)] sm:mx-[calc(1rem+0.75in)] md:mx-[calc(1.5rem+1in)] pt-2 pb-8 sm:pt-3 sm:pb-10">
          <h2 className="text-center text-xl font-medium text-neutral-900">Our legacy of innovation</h2>
          <div className="relative mt-10">
            <div
              className="absolute top-3 bottom-3 left-[calc(9rem+1rem+0.625rem-0.5px)] w-px bg-neutral-200 sm:left-[calc(10rem+1.25rem+0.75rem-0.5px)]"
              aria-hidden
            />
            <ul className="relative list-none space-y-0 pl-0">
              {TIMELINE.map((item, i) => (
                <li key={i} className="relative flex items-start gap-4 pb-8 last:pb-0 sm:gap-5">
                  <time className="mt-2.5 flex h-5 w-36 shrink-0 items-center justify-end text-right font-sans text-lg font-semibold leading-none tracking-tight text-primary sm:mt-3 sm:h-6 sm:w-40 sm:text-xl">
                    {item.date}
                  </time>
                  <div className="relative z-10 mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white ring-4 ring-white sm:mt-3 sm:h-6 sm:w-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary sm:h-2 sm:w-2" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 sm:px-5 sm:py-4">
                    <p className="leading-relaxed text-neutral-600">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium text-neutral-900">From simple trims to historic restorations</h2>
          <p className="mt-4 leading-relaxed">
            Our products are trusted by builders and architects in everything from multi-million dollar estates to historic church restorations. Whether you need a single piece of flexible shoe molding or hundreds of feet of complex radius crown, we have the inventory and expertise to make it happen.
          </p>
        </section>
      </div>
    </PageContent>
  );
}
