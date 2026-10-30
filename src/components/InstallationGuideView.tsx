"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DownloadInstallationGuidePdfButton } from "@/components/DownloadInstallationGuidePdfButton";
import { InstallationVideo } from "@/components/InstallationVideo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ContactPhoneLink } from "@/components/ContactPhoneLink";
import {
  getInstallationGuideCopy,
  type InstallationLocale,
} from "@/data/installation-guide";

function parseLocale(value: string | null): InstallationLocale {
  return value === "es" ? "es" : "en";
}

const SECTION_IDS = ["preparing", "machining", "installing", "finishing"] as const;
type GuideTab = "full" | (typeof SECTION_IDS)[number];

function parseSectionTab(value: string | null | undefined): GuideTab {
  if (value && (SECTION_IDS as readonly string[]).includes(value)) {
    return value as GuideTab;
  }
  return "full";
}

export function InstallationGuideView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<InstallationLocale>(() => parseLocale(searchParams.get("lang")));
  const activeTab = parseSectionTab(searchParams.get("section"));
  const prevTabRef = useRef<GuideTab>(activeTab);

  useEffect(() => {
    setLocale(parseLocale(searchParams.get("lang")));
  }, [searchParams]);

  // Legacy #preparing links (FAQ, etc.) → ?section= tab filter
  useLayoutEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || hash === "videos" || hash === "overview") return;
      if (!(SECTION_IDS as readonly string[]).includes(hash)) return;
      if (searchParams.get("section") === hash) {
        window.history.replaceState(
          null,
          "",
          `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
        );
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", hash);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [pathname, router, searchParams]);

  // Full guide inserts sections above the fold; without a reset, mobile scroll
  // anchoring (and same-path nav from ?section=) leaves the page mid-content.
  useLayoutEffect(() => {
    const prev = prevTabRef.current;
    prevTabRef.current = activeTab;
    if (activeTab !== "full" || prev === "full") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && hash !== "overview") return;
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Mobile menu can leave a leftover window scroll (iOS scrolls under overflow:hidden).
  // Re-assert top after mount / menu unlock so Full guide doesn't open mid-Preparing.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === "videos") return;
    const reset = () => window.scrollTo(0, 0);
    reset();
    const raf = requestAnimationFrame(reset);
    const t0 = window.setTimeout(reset, 0);
    const t1 = window.setTimeout(reset, 50);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, [pathname]);

  const replaceQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setLanguage = useCallback(
    (next: InstallationLocale) => {
      setLocale(next);
      replaceQuery((params) => {
        if (next === "en") params.delete("lang");
        else params.set("lang", next);
      });
    },
    [replaceQuery],
  );

  const setTab = useCallback(
    (tab: GuideTab) => {
      replaceQuery((params) => {
        if (tab === "full") params.delete("section");
        else params.set("section", tab);
      });
    },
    [replaceQuery],
  );

  const copy = getInstallationGuideCopy(locale);
  const tabs: { id: GuideTab; label: string }[] = [
    { id: "full", label: copy.fullGuide },
    ...SECTION_IDS.map((id) => ({ id, label: copy.sections[id].title })),
  ];
  const showSection = (id: (typeof SECTION_IDS)[number]) =>
    activeTab === "full" || activeTab === id;

  return (
    <main className="min-h-screen print:min-h-0" lang={locale}>
      <div
        id="overview"
        className="mx-auto max-w-[84rem] px-4 pt-5 pb-12 sm:px-6 print:max-w-none print:px-0 print:pt-0 print:pb-0"
      >
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
        <h1 className="text-center font-sans text-3xl font-medium tracking-tight text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-3 hidden text-left leading-relaxed text-neutral-600 print:block">
          {copy.printIntroBefore}{" "}
          <ContactPhoneLink className="font-medium text-primary" />.
        </p>
        <p className="mt-4 text-left leading-relaxed text-neutral-600 print:hidden">
          {copy.webIntroBefore}
          <a href="#videos" className="font-medium text-primary hover:underline">
            {copy.webIntroLink}
          </a>
          {copy.webIntroAfter}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 print:hidden lg:flex-row lg:justify-between">
          <div className="flex w-full items-center justify-between gap-2 lg:contents">
            <LanguageSwitch value={locale} onChange={setLanguage} />
            <div className="lg:order-3">
              <DownloadInstallationGuidePdfButton locale={locale} />
            </div>
          </div>
          <div
            role="tablist"
            aria-label={copy.title}
            className="inline-grid grid-cols-5 overflow-hidden rounded-md border-2 border-primary divide-x-2 divide-primary lg:order-2"
          >
            {tabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onMouseDown={(event) => {
                    // Keep the page from scrolling the focused tab into view on mobile.
                    if (event.button === 0) event.preventDefault();
                  }}
                  onClick={() => setTab(tab.id)}
                  className={`whitespace-nowrap px-2 py-1.5 text-center text-xs font-medium transition-colors sm:px-2.5 ${
                    selected
                      ? "bg-primary text-white"
                      : "bg-white text-primary hover:bg-primary/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <section
          id="preparing"
          className={`scroll-mt-24 pt-14 print:block print:pt-6 print:text-left ${
            showSection("preparing") ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block text-center font-sans text-3xl font-semibold tracking-tight text-primary sm:text-4xl print:!mb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                {copy.sections.preparing.title}
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Preparing.png"
                  alt={copy.imageAlts.preparing}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {copy.sections.preparing.steps.map((step, i) => (
                <li key={step.title} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-neutral-600">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="machining"
          className={`scroll-mt-24 pt-14 print:block print:pt-6 print:text-left ${
            showSection("machining") ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block text-center font-sans text-3xl font-semibold tracking-tight text-primary sm:text-4xl print:!mb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                {copy.sections.machining.title}
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Machining.png"
                  alt={copy.imageAlts.machining}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {copy.sections.machining.steps.map((step, i) => (
                <li key={step.title} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-neutral-600">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="installing"
          className={`scroll-mt-24 pt-14 print:block print:break-before-page print:pt-[0.75in] print:text-left ${
            showSection("installing") ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block text-center font-sans text-3xl font-semibold tracking-tight text-primary sm:text-4xl print:!mb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                {copy.sections.installing.title}
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Installing.png"
                  alt={copy.imageAlts.installing}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {copy.sections.installing.steps.map((step, i) => (
                <li key={step.title} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-neutral-600">{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="finishing"
          className={`scroll-mt-24 pt-14 print:block print:pt-6 print:text-left ${
            showSection("finishing") ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-10 print:!flex-col print:!items-stretch print:!gap-2">
            <div className="flex shrink-0 flex-col items-center lg:w-72 print:!w-full print:!items-start">
              <h2 className="inline-block text-center font-sans text-3xl font-semibold tracking-tight text-primary sm:text-4xl print:!mb-1 print:!text-left print:!text-[12pt] print:!font-bold">
                {copy.sections.finishing.title}
              </h2>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-xl sm:w-56 lg:w-72 print:hidden">
                <Image
                  src="/installation/Finishing.png"
                  alt={copy.imageAlts.finishing}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-4 print:space-y-2 print:text-left">
              {copy.sections.finishing.steps.map((step, i) => (
                <li key={step.title} className="print:break-inside-avoid">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-neutral-600">{step.body}</p>
                </li>
              ))}
              <li className="print:break-inside-avoid">
                <h3 className="text-lg font-medium text-neutral-900">
                  {copy.sections.finishing.steps.length + 1}.{" "}
                  {copy.sections.finishing.additionalStainingTips.title}
                </h3>
                <p className="mt-1 leading-relaxed text-neutral-600">
                  {copy.sections.finishing.additionalStainingTips.body}
                </p>
              </li>
            </ul>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3 py-10 print:hidden">
          <DownloadInstallationGuidePdfButton locale={locale} />
        </div>
        <section id="videos" className="scroll-mt-24 border-t border-neutral-200 pt-14 pb-12 print:hidden">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-6">
            <InstallationVideo videoId="qXPqlM4JAN8" title={copy.videoTitles.crown} />
            <InstallationVideo
              videoId="-coqTfwHlJU"
              title={copy.videoTitles.ovalCasing}
              startSeconds={9 * 60 + 41}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-base text-neutral-600 sm:text-lg">
            <p>
              {copy.videosBy}{" "}
              <span className="font-medium text-neutral-900">Finish Carpentry TV</span>
            </p>
            <div className="flex items-center gap-3.5">
              <a
                href="https://finishcarpentry.tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 transition-colors hover:text-primary"
                aria-label="Finish Carpentry TV website"
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
                    strokeLinecap="round"
                  />
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
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden
                >
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
