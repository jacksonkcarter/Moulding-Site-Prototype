import Image from "next/image";
import type { Metadata } from "next";
import { DownloadInstallationGuidePdfButton } from "@/components/DownloadInstallationGuidePdfButton";
import { InstallationVideo } from "@/components/InstallationVideo";
import { ContactPhoneLink } from "@/components/ContactPhoneLink";
import {
  ADDITIONAL_STAINING_TIPS,
  FINISHING_STEPS,
  INSTALLATION_GUIDE_TITLE,
  INSTALLING_STEPS,
  MACHINING_STEPS,
  PREPARING_STEPS,
} from "@/data/installation-guide";

export const metadata: Metadata = {
  title: INSTALLATION_GUIDE_TITLE,
};

export default function InstallationGuidePage() {
  return (
    <main className="min-h-screen print:min-h-0">
      <div id="overview" className="mx-auto max-w-[calc(72rem+192px)] scroll-mt-24 px-4 pt-5 pb-12 sm:px-6 print:max-w-none print:px-0 print:pt-0 print:pb-0">
        <div className="mb-4 hidden items-center justify-center gap-3 print:mb-8 print:flex">
          <Image
            src="/logos/flex-trim.svg"
            alt="Flex Trim™"
            width={120}
            height={40}
            className="h-9 w-auto print:h-7"
          />
          <span className="text-neutral-300" aria-hidden>
            |
          </span>
          <Image
            src="/logos/carter-millwork.svg"
            alt="Carter Millwork"
            width={160}
            height={40}
            className="h-9 w-auto print:h-7"
          />
        </div>
        <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 text-center">
          {INSTALLATION_GUIDE_TITLE}
        </h1>
        <p className="mt-3 hidden text-left text-neutral-600 leading-relaxed print:block">
          For further assistance, please call a product specialist at{" "}
          <ContactPhoneLink className="font-medium text-primary" />.
        </p>
        <p className="mt-4 text-left text-neutral-600 leading-relaxed print:hidden">
          Before installing, please review the quick-reference installation guide below. For more
          helpful tips, watch some real-world{" "}
          <a href="#videos" className="font-medium text-primary hover:underline">
            installation videos
          </a>
          .
        </p>

        <div className="mt-6 grid grid-cols-1 items-center gap-3 print:hidden sm:grid-cols-[1fr_auto_1fr]">
          <div className="hidden sm:block" aria-hidden />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-neutral-600">Jump to</span>
            {[
              { label: "Preparing", href: "#preparing" },
              { label: "Machining", href: "#machining" },
              { label: "Installing", href: "#installing" },
              { label: "Finishing", href: "#finishing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <DownloadInstallationGuidePdfButton />
          </div>
        </div>

        {/* Preparing — image left */}
        <section id="preparing" className="scroll-mt-24 pt-14 print:pt-6 print:text-left">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block border-b-2 border-primary pb-2 font-sans text-3xl font-semibold tracking-tight text-primary text-center sm:text-4xl print:!mb-1 print:!border-b print:!border-primary print:!pb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                Preparing
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Preparing.png"
                  alt="Preparing flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {PREPARING_STEPS.map((step, i) => (
                <li key={i} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Machining — image right */}
        <section id="machining" className="scroll-mt-24 pt-14 print:pt-6 print:text-left">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block border-b-2 border-primary pb-2 font-sans text-3xl font-semibold tracking-tight text-primary text-center sm:text-4xl print:!mb-1 print:!border-b print:!border-primary print:!pb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                Machining
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Machining.png"
                  alt="Machining flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {MACHINING_STEPS.map((step, i) => (
                <li key={i} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Installing — image left */}
        <section
          id="installing"
          className="scroll-mt-24 pt-14 print:break-before-page print:pt-[0.75in] print:text-left"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block border-b-2 border-primary pb-2 font-sans text-3xl font-semibold tracking-tight text-primary text-center sm:text-4xl print:!mb-1 print:!border-b print:!border-primary print:!pb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                Installing
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Installing.png"
                  alt="Installing flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {INSTALLING_STEPS.map((step, i) => (
                <li key={i} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Finishing — image right */}
        <section id="finishing" className="scroll-mt-24 pt-14 print:pt-6 print:text-left">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block border-b-2 border-primary pb-2 font-sans text-3xl font-semibold tracking-tight text-primary text-center sm:text-4xl print:!mb-1 print:!border-b print:!border-primary print:!pb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                Finishing
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Finishing.png"
                  alt="Finishing flexible moulding"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {FINISHING_STEPS.map((step, i) => (
                <li key={i} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-neutral-600 leading-relaxed">{step.body}</p>
                </li>
              ))}
              <li className="print:break-inside-avoid">
                <h3 className="text-lg font-medium text-neutral-900">
                  {FINISHING_STEPS.length + 1}. {ADDITIONAL_STAINING_TIPS.title}
                </h3>
                <p className="mt-1 text-neutral-600 leading-relaxed">{ADDITIONAL_STAINING_TIPS.body}</p>
              </li>
            </ul>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3 py-10 print:hidden">
          <DownloadInstallationGuidePdfButton />
        </div>
        <section id="videos" className="scroll-mt-24 border-t border-neutral-200 pt-14 pb-12 print:hidden">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-6">
            <InstallationVideo
              videoId="qXPqlM4JAN8"
              title="Flex Trim™ crown installation"
            />
            <InstallationVideo
              videoId="-coqTfwHlJU"
              title="Flex Trim™ oval casing installation"
              startSeconds={9 * 60 + 41}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-base text-neutral-600 sm:text-lg">
            <p>
              Videos by <span className="font-medium text-neutral-900">Finish Carpentry TV</span>
            </p>
            <div className="flex items-center gap-3.5">
              <a
                href="https://finishcarpentry.tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 transition-colors hover:text-primary"
                aria-label="Finish Carpentry TV website"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" strokeLinecap="round" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@FinishCarpentryTV"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 transition-colors hover:text-primary"
                aria-label="Finish Carpentry TV on YouTube"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.75 15.5v-7l6.2 3.5-6.2 3.5z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/finishcarpentrytv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 transition-colors hover:text-primary"
                aria-label="Finish Carpentry TV on Instagram"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
