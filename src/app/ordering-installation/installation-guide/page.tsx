import Image from "next/image";
import { InstallationVideo } from "@/components/InstallationVideo";

const PREPARING_STEPS = [
  {
    title: "Allow the material to relax",
    body: "Unroll the molding so it can return to its original shape. This is a great time to verify your profile and application.",
  },
  {
    title: "Optimize flexibility",
    body: "Warm the material to 80°F for maximum flexibility. To prevent damage, never use an open flame to heat the moulding.",
  },
  {
    title: "Clean the moulding",
    body: "Wipe down the material with mineral spirits or soap and water to remove any dust prior to installation.",
  },
  {
    title: "Prepare a smooth surface",
    body: "Ensure your mounting area is completely flat. Because the molding is flexible, it will mirror any underlying bumps or dips.",
  },
  {
    title: "Wait to apply finishes",
    body: "Always paint or stain after installation. Flexing the molding while installing will crack and fracture a pre-applied finish.",
  },
];

const MACHINING_STEPS = [
  {
    title: "Use standard woodworking tools",
    body: "Treat the flexible moulding just like wood. It can be easily cut, sanded, and shaped using your typical shop equipment.",
  },
  {
    title: "Secure the material",
    body: "Hold the moulding firmly against your table or fence when cutting to maintain control and ensure a clean, accurate line.",
  },
  {
    title: "Make shallow passes",
    body: "When shaping the profile, take several shallow passes rather than attempting one deep cut to achieve the smoothest result.",
  },
  {
    title: "Lower your blade speeds",
    body: "Operate saws and routers at slower blade speeds, best for cutting materials cleanly without excessive heat buildup.",
  },
  {
    title: "Protect stain-grade finishes",
    body: "Never sand or shape stain-grade moulding as this will permanently remove the surface-level wood grain pattern.",
  },
];

const INSTALLING_STEPS = [
  {
    title: "Plan your layout",
    body: "Pre-determine the exact material placement and layout before applying any adhesive or fasteners.",
  },
  {
    title: "Select the proper adhesive",
    body: "Use a heavy-duty construction adhesive, such as Liquid Nails or Loctite Power Grab. Never use standard wood glue, as it will not bond to the moulding's non-porous surface.",
  },
  {
    title: "Fasten the material",
    body: "Screws, framing nails, finish nails, brad nails, and pin nails are all acceptable fasteners depending on the moulding size. NEVER use staples as they will create linear dimples. To reduce the chance of dimpling, lower the pressure on mechanical nail guns, set nails by hand, and pre-countersink screw holes.",
  },
  {
    title: "Minimize nailing",
    body: "Position fasteners away from the edges to prevent the material from bumping or tearing, and let the adhesive do the work.",
  },
  {
    title: "Avoid excessive force",
    body: "Never stress the moulding into place. Material that is ordered to the correct specifications should install easily and naturally.",
  },
];

const FINISHING_STEPS = [
  {
    title: "Fill and caulk freely",
    body: "Use your preferred wood filler for nail holes and your favorite caulk for seams—standard products work perfectly with Flex Trim.",
  },
  {
    title: "Clean and install first",
    body: "Always install the moulding and thoroughly clean the surface before applying any paint or stain to ensure a flawless finish.",
  },
  {
    title: "Painting Flex Trim",
    body: "A primer coat is recommended, but not required. Any interior/exterior paint (other than pre-catalyzed epoxy) works great.",
  },
  {
    title: "Staining Flex Trim (gel only)",
    body: "Since the grain is only on the surface, our product requires a gel stain. Remember to never sand stain-grade material, as it will permanently remove the surface wood grain. Apply clearcoat after staining.",
  },
];

export default function InstallationGuidePage() {
  return (
    <main className="min-h-screen">
      <div id="overview" className="mx-auto max-w-[calc(72rem+192px)] scroll-mt-24 px-4 pt-5 pb-12 sm:px-6">
        <h1 className="font-sans text-3xl font-medium uppercase tracking-[0.15em] text-neutral-900 text-center">
          Installation Guide
        </h1>
        <p className="mt-4 text-neutral-600 leading-relaxed text-center">
          Watch our{" "}
          <a
            href="https://www.youtube.com/watch?v=qXPqlM4JAN8"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            full installation overview video
          </a>
          , or review the quick-reference summaries below.
        </p>

        {/* Preparing — image left */}
        <section id="preparing" className="scroll-mt-24 pt-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex shrink-0 flex-col items-center lg:w-72">
              <h2 className="font-sans text-3xl font-normal uppercase tracking-[0.12em] text-primary text-center sm:text-4xl">
                Preparing
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72">
                <Image
                  src="/installation/Preparing.png"
                  alt="Preparing flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4">
              {PREPARING_STEPS.map((step, i) => (
                <li key={i}>
                  <h3 className="text-lg font-medium text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Machining — image right */}
        <section id="machining" className="scroll-mt-24 pt-14">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-10">
            <div className="flex shrink-0 flex-col items-center lg:w-72">
              <h2 className="font-sans text-3xl font-normal uppercase tracking-[0.12em] text-primary text-center sm:text-4xl">
                Machining
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72">
                <Image
                  src="/installation/Machining.png"
                  alt="Machining flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4">
              {MACHINING_STEPS.map((step, i) => (
                <li key={i}>
                  <h3 className="text-lg font-medium text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Installing — image left */}
        <section id="installing" className="scroll-mt-24 pt-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex shrink-0 flex-col items-center lg:w-72">
              <h2 className="font-sans text-3xl font-normal uppercase tracking-[0.12em] text-primary text-center sm:text-4xl">
                Installing
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72">
                <Image
                  src="/installation/Installing.png"
                  alt="Installing flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4">
              {INSTALLING_STEPS.map((step, i) => (
                <li key={i}>
                  <h3 className="text-lg font-medium text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Finishing — image right */}
        <section id="finishing" className="scroll-mt-24 pt-14 pb-12">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-10">
            <div className="flex shrink-0 flex-col items-center lg:w-72">
              <h2 className="font-sans text-3xl font-normal uppercase tracking-[0.12em] text-primary text-center sm:text-4xl">
                Finishing
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72">
                <Image
                  src="/installation/Finishing.png"
                  alt="Finishing flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4">
              {FINISHING_STEPS.map((step, i) => (
                <li key={i}>
                  <h3 className="text-lg font-medium text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Video */}
        <section className="border-t border-neutral-200 pt-14 pb-12">
          <InstallationVideo />
        </section>
      </div>
    </main>
  );
}
