import { PageContent } from "@/components/PageContent";

const TIMELINE = [
  { date: "February 1995", text: "Carter Millwork is founded in Lexington, NC, by Ned and Sally Carter." },
  { date: "January 2007", text: "Second-generation owners Alan and Greg Carter purchase the family business." },
  { date: "November 2008", text: "Acquired Flex Trim (est. 1985), a pioneer in flexible moulding technology, moving all production to our North Carolina facility." },
  { date: "January 2009", text: 'Acquired Flexible Moulding International in Provo, Utah, establishing "Flex Trim West" to seamlessly serve the Western United States.' },
  { date: "April 2012", text: "Acquired Ultra-Flex Moulding (est. 1960s), the original inventor of flexible moulding, consolidating its production into our Provo facility." },
  { date: "January 2021", text: "Greg Carter assumes sole ownership of Carter Millwork, continuing the family legacy and our commitment to industry-leading quality." },
  { date: "January 2025", text: "Third-generation Jackson Carter joins the business, bringing an engineering background to modernize our manufacturing processes and digital workflows." },
];

export default function AboutUsPage() {
  return (
    <PageContent title="About us" fullWidth>
      <div className="space-y-10 text-neutral-600">
        <section className="mx-[1in]">
          <h2 className="font-sans text-2xl font-medium tracking-tight text-neutral-900">
            The industry leaders in flexible moulding
          </h2>
          <p className="mt-4 leading-relaxed">
            Carter Millwork, Inc. is the proud parent company uniting three of the oldest, largest, and most respected names in the industry: Flex Trim, Carter Millwork, and Ultra-Flex Moulding.
          </p>
          <p className="mt-4 leading-relaxed">
            As a second-generation, family-owned business based in Lexington, North Carolina, we believe in hands-on management and sustainable growth. Our philosophy is simple: we never make a promise to a customer that we cannot keep. While we are proud to be the largest flexible moulding supplier in the world, our primary goal is always to be the best.
          </p>
        </section>

        <section className="mx-[calc(1rem+2.5in)] sm:mx-[calc(2rem+2.5in)] md:mx-[calc(3rem+2.5in)] py-8 sm:py-10">
          <h2 className="text-xl font-medium text-neutral-900">Our legacy of innovation</h2>
          <div className="relative mt-8">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-neutral-200" aria-hidden />
            <ul className="relative list-none space-y-0 pl-0">
              {TIMELINE.map((item, i) => (
                <li key={i} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* Node */}
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white ring-4 ring-white">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                  </div>
                  {/* Content card */}
                  <div className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 sm:px-5 sm:py-4">
                    <p className="text-xs font-semibold tracking-wide text-primary sm:text-sm">
                      {item.date}
                    </p>
                    <p className="mt-1.5 leading-relaxed text-neutral-600">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-[1in]">
          <h2 className="text-xl font-medium text-neutral-900">From simple trims to historic restorations</h2>
          <p className="mt-4 leading-relaxed">
            Our products are trusted by builders and architects in everything from multi-million dollar estates to historic church restorations. Whether you need a single piece of flexible shoe molding or hundreds of feet of complex radius crown, we have the inventory and expertise to make it happen.
          </p>
        </section>
      </div>
    </PageContent>
  );
}
