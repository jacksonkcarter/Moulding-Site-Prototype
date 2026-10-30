"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";

function TipFigure({
  src,
  alt,
  caption,
  placeholder,
  imageClassName = "",
}: {
  src?: string;
  alt: string;
  caption?: string;
  placeholder?: string;
  /** Optional sizing override for the image (row height exceptions, etc.). */
  imageClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <figure className="flex h-full min-w-0 flex-col">
        {src ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-0 flex-1 cursor-pointer items-center justify-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={caption ? `View larger: ${caption}` : `View larger: ${alt}`}
          >
            <Image
              src={src}
              alt={alt}
              width={800}
              height={600}
              className={`h-auto object-contain ${imageClassName || "w-full"}`}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </button>
        ) : (
          <div
            className="flex min-h-32 flex-1 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 text-center text-xs leading-relaxed text-neutral-500"
            role="img"
            aria-label={alt}
          >
            {placeholder ?? "Diagram placeholder"}
          </div>
        )}
        {caption ? (
          <figcaption className="pt-1.5 text-center text-xs text-neutral-500">{caption}</figcaption>
        ) : null}
      </figure>

      {open && src ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[90vh] w-auto max-w-[min(72rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg bg-white p-4 pt-12 shadow-lg sm:p-6 sm:pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded object-contain"
              sizes="90vw"
            />
            <p
              id={titleId}
              className="mt-4 text-center text-sm font-medium text-neutral-800 sm:text-base"
            >
              {caption ?? alt}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

const TIP_SECTIONS = [
  { id: "moulding-profile", title: "Moulding profile", tabLabel: "Moulding profile" },
  { id: "bending-overview", title: "Bending overview", tabLabel: "Bending overview" },
  {
    id: "casing-radius",
    title: "Casing & pre-bent pieces",
    tabLabel: "Casing & pre-bent",
  },
  { id: "radius-crown", title: "Radius crown", tabLabel: "Radius crown" },
] as const;

type TipSectionId = (typeof TIP_SECTIONS)[number]["id"];

const HASH_SECTION_PARENT: Record<string, TipSectionId> = {
  "bending-limitations": "bending-overview",
  "irregular-radius": "casing-radius",
  "standard-orientation": "casing-radius",
  "standard-bending": "casing-radius",
  "crown-assembly": "radius-crown",
  "radius-corner": "radius-crown",
  "barrel-dormer": "radius-crown",
};

function TipSection({
  id,
  title,
  open,
  onToggle,
  hidden,
  children,
}: {
  id: TipSectionId;
  title: string;
  open: boolean;
  onToggle: () => void;
  hidden?: boolean;
  children?: ReactNode;
}) {
  const panelId = `${id}-panel`;
  const buttonId = `${id}-heading`;

  if (hidden) return null;

  return (
    <section
      id={id}
      aria-labelledby={buttonId}
      className="scroll-mt-[var(--header-offset)] border-b border-neutral-300"
    >
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="relative flex w-full items-center justify-center py-3 text-center transition-colors hover:text-primary"
        >
          <span className="px-8 text-base font-semibold tracking-tight text-neutral-900 md:text-lg">
            {title}
          </span>
          <svg
            className={`absolute right-0 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ${
              open ? "rotate-180 text-primary" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className={
          open
            ? "space-y-3 border-t border-neutral-300 pb-5 pt-4 text-sm leading-relaxed text-neutral-700 md:text-base"
            : undefined
        }
      >
        {children}
      </div>
    </section>
  );
}

/**
 * Text + figures grid.
 * 1 image  → text 2/3, image 1/3 (or 50/50 when equalSplit)
 * 2 images → text 1/3, images 2/3 (or text full width + figures below when figuresBelow)
 * 0 images → text full width
 */
function TextWithFigures({
  children,
  figures,
  equalSplit = false,
  figuresBelow = false,
}: {
  children: ReactNode;
  figures: ReactNode[];
  /** For a single figure, use equal text/image columns instead of 2/3–1/3. */
  equalSplit?: boolean;
  /** Place figures under the text instead of beside it. */
  figuresBelow?: boolean;
}) {
  const count = figures.length;

  if (count === 0) {
    return <div className="space-y-2">{children}</div>;
  }

  const figuresGridClass =
    count >= 3 ? "grid-cols-1 sm:grid-cols-3" : count === 1 ? "grid-cols-1" : "grid-cols-2";

  if (figuresBelow) {
    return (
      <div className="space-y-5">
        <div className="min-w-0 space-y-2">{children}</div>
        {/* Cap width at 2/3 so paired images stay the same size as the side-by-side layout. */}
        <div
          className={`mx-auto grid w-full max-w-[66.666%] items-stretch gap-3 md:gap-4 ${figuresGridClass}`}
        >
          {figures}
        </div>
      </div>
    );
  }

  if (count === 1) {
    if (equalSplit) {
      return (
        <div className="grid items-start gap-5 md:grid-cols-2 md:gap-6">
          <div className="min-w-0 space-y-2">{children}</div>
          <div className="min-w-0 self-start">{figures[0]}</div>
        </div>
      );
    }
    return (
      <div className="grid items-start gap-5 md:grid-cols-3 md:gap-6">
        <div className="min-w-0 space-y-2 md:col-span-2">{children}</div>
        <div className="min-w-0 self-start">{figures[0]}</div>
      </div>
    );
  }

  // 2+ images: text 1/3, figures 2/3 - figures stretch so captions align within this row only
  return (
    <div className="grid items-start gap-5 md:grid-cols-3 md:gap-6">
      <div className="min-w-0 space-y-2">{children}</div>
      <div className={`grid min-w-0 items-stretch gap-3 md:col-span-2 md:gap-4 ${figuresGridClass}`}>
        {figures}
      </div>
    </div>
  );
}

/** Shared ordering tips used on audience Ordering pages. */
export function OrderingTips({
  showTopBorder = true,
  hideHeading = false,
}: {
  showTopBorder?: boolean;
  /** When the page already provides an h1 title. */
  hideHeading?: boolean;
} = {}) {
  const [activeTab, setActiveTab] = useState<TipSectionId | null>(null);
  const [openIds, setOpenIds] = useState<Set<TipSectionId>>(
    () => new Set(TIP_SECTIONS.map((section) => section.id)),
  );

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const parent = HASH_SECTION_PARENT[hash];
      if (parent) {
        setActiveTab(null);
        setOpenIds((prev) => new Set(prev).add(parent));
      }
      // Wait for section expand + layout before scrolling so we land under the arched header.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const toggleSection = (id: TipSectionId) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectTab = (id: TipSectionId) => {
    if (activeTab === id) {
      setActiveTab(null);
      return;
    }
    setActiveTab(id);
    setOpenIds((prev) => new Set(prev).add(id));
  };

  const sectionProps = (id: TipSectionId, title: string) => ({
    id,
    title,
    open: openIds.has(id),
    onToggle: () => toggleSection(id),
    hidden: activeTab !== null && activeTab !== id,
  });

  return (
    <section
      id="ordering-tips"
      aria-labelledby={hideHeading ? undefined : "ordering-tips-heading"}
      className={`scroll-mt-[var(--header-offset)] ${hideHeading ? "" : "pt-10"} ${showTopBorder ? "border-t border-neutral-200" : ""}`}
    >
      {hideHeading ? null : (
        <h2
          id="ordering-tips-heading"
          className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
        >
          What you need to know to order
        </h2>
      )}
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
        Use these guidelines when specifying Flex Trim™ so we can match your profile and bend correctly the first time.
        Be sure to check out our{" "}
        <Link href="/ordering/how-to-measure" className="font-medium text-primary underline-offset-2 hover:underline">
          How to measure
        </Link>{" "}
        page for help determining the measurements we need.
      </p>

      <div className="mt-6 flex justify-center">
        <div
          role="tablist"
          aria-label="Ordering tip sections"
          className="inline-grid max-w-full overflow-hidden rounded-md border-2 border-primary divide-x-2 divide-primary"
          style={{ gridTemplateColumns: `repeat(${TIP_SECTIONS.length}, minmax(0, 1fr))` }}
        >
          {TIP_SECTIONS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(tab.id)}
                className={`min-w-0 px-1.5 py-1.5 text-center text-xs font-medium transition-colors sm:px-2.5 sm:text-sm ${
                  selected
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-primary/5"
                }`}
              >
                {tab.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-300">
        <TipSection {...sectionProps("moulding-profile", "Moulding profile")}>
          <div className="space-y-4">
            <p>
              Our catalog and the profiles on our website represent only a tiny fraction of the 50,000+ profiles that we
              have available as we add countless new profiles every single day. If you cannot find the profile you are
              trying to match, please provide the following information and we can confirm whether we have an existing
              match or not:
            </p>
            <ol className="list-decimal space-y-2 pl-10">
              <li>A to-scale drawing or tracing of the profile</li>
              <li>The thickness and width of the profile</li>
              <li>The moulding supplier and their profile name</li>
              <li>The moulding wood species or material</li>
            </ol>
            <p>
              If we don&apos;t have the profile/style you need in our existing inventory, we can recreate it through our
              Made-to-Match process.{" "}
              <Link
                href="/products/made-to-match"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Learn more here
              </Link>
              .
            </p>
          </div>
        </TipSection>

        <TipSection {...sectionProps("bending-overview", "Bending overview")}>
          <div className="space-y-8">
            <TextWithFigures
              figures={[
                <TipFigure
                  key="bending-1"
                  src="/ordering-tips/bending-style-1-v2.png"
                  alt="Style 1 bending orientation, view one"
                />,
                <TipFigure
                  key="bending-1a"
                  src="/ordering-tips/bending-style-1a-v2.png"
                  alt="Style 1 bending orientation, view two"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Style #1: Straight pieces</p>
              <p>
                Used when moulding is bent &ldquo;long-ways&rdquo; against the thin dimension (like a belt). A
                straight piece works for this application. Common examples: base, base cap, base shoe, chair rail, and
                jamb.
              </p>
            </TextWithFigures>

            <TextWithFigures
              figures={[
                <TipFigure
                  key="bending-2"
                  src="/ordering-tips/bending-style-2-v2.png"
                  alt="Style 2 bending orientation, view one"
                />,
                <TipFigure
                  key="bending-2a"
                  src="/ordering-tips/bending-style-2a-v2.png"
                  alt="Style 2 bending orientation, view two"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Style #2: Pre-bent pieces</p>
              <p>
                Used when moulding is bent &ldquo;sideways&rdquo; against the wide dimension (like a rainbow). These
                pieces must be pre-bent during manufacturing. Common examples: casing, crown, and crown ceiling
                backer.
              </p>
            </TextWithFigures>

            <div id="bending-limitations" className="scroll-mt-[var(--header-offset)] space-y-2">
              <p className="font-medium text-neutral-900">Bending limitations</p>
              <p>
                As a general rule, the minimum radius for pre-bending flexible moulding (using our typical
                processes/tooling) is equal to three times the width of the profile. However, this is only the case for
                profiles up to about 3.5&quot; wide. If your profile is wider or your radius is tighter, contact us
                before ordering so we can discuss our more specialized processes.
              </p>
              <p>
                Style 1 bending limitations depend on the thickness and width of the profile. A 1/4&quot; x 1&quot;
                piece of flat stock is flexible enough to wrap around your wrist, while a 2&quot; x 6&quot; piece of
                flat stock can barely curl onto a pallet. Regardless, straight pieces should never be used for
                bullnose corners, but we can produce bullnose corners with special tooling. Contact us to learn more.
              </p>
            </div>
          </div>
        </TipSection>

        <TipSection {...sectionProps("casing-radius", "Casing & pre-bent pieces")}>
          <div className="space-y-8">
            <TextWithFigures
              figures={[
                <TipFigure
                  key="half-round"
                  src="/ordering-tips/Half Round.png"
                  alt="Half-round arch with radius and diameter measurements"
                  caption="Half-round (diameter required)"
                />,
                <TipFigure
                  key="eyebrow"
                  src="/ordering-tips/Eyebrow.png"
                  alt="Eyebrow arch with width and rise measurements"
                  caption="Eyebrow (width and rise required)"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Regular radius</p>
              <p>
                When the radius stays consistent, like a section of a circle such as a half-round or eyebrow arc, the
                part does not require a template. We can produce it using either width &amp; rise or length &amp;
                radius.
              </p>
            </TextWithFigures>

            <div id="irregular-radius" className="scroll-mt-[var(--header-offset)] space-y-5">
              <TextWithFigures
                figures={[
                  <TipFigure
                    key="elliptical"
                    src="/ordering-tips/Elliptical.png"
                    alt="Elliptical arch with width and rise"
                    caption="Elliptical (template required)"
                  />,
                  <TipFigure
                    key="oval"
                    src="/ordering-tips/Oval.png"
                    alt="Oval arch diagram"
                    caption="Oval (template required)"
                    // Scale so rendered height matches Half-round at the same column width.
                    imageClassName="mx-auto w-[36.8%]"
                  />,
                ]}
              >
                <p className="font-medium text-neutral-900">Irregular radius</p>
                <p>
                  When the radius changes along the curve, like on ovals or elliptical arches, a physical template is
                  required so manufacturing can follow the exact shape. The template can either be:
                </p>
              </TextWithFigures>
              <div className="grid items-stretch gap-3 text-sm leading-relaxed text-neutral-700 sm:grid-cols-[1fr_auto_1fr] sm:gap-0 md:text-base">
                <p>
                  Traced around your window or doorway on-site (on construction paper, plastic sheet, etc.) and mailed
                  to us
                </p>
                <div className="flex items-center justify-center gap-4 py-1 sm:gap-4 sm:px-6 sm:py-0">
                  <span className="hidden w-px self-stretch bg-neutral-300 sm:block" aria-hidden />
                  <span className="font-semibold tracking-wide text-neutral-900">OR</span>
                  <span className="hidden w-px self-stretch bg-neutral-300 sm:block" aria-hidden />
                </div>
                <p>
                  Cut at our facility using your blueprint, schematic, or PDF/CAD drawing for an additional charge
                </p>
              </div>
              <p className="w-full text-sm leading-relaxed text-neutral-700 md:text-base">
                We also keep a variety of templates on hand for common windows. If you know the window manufacturer
                where the Flex Trim™ will be installed, be sure to let us know along with the overall width and height
                so that we can check our template inventory.
              </p>
            </div>

            <div id="standard-orientation" className="scroll-mt-[var(--header-offset)]">
              <TextWithFigures
                figuresBelow
                figures={[
                  <TipFigure
                    key="thick-edge-out"
                    src="/ordering-tips/Thick Edge Out.png"
                    alt="Pre-bent moulding with thick edge to the outside of the radius"
                    caption="Thick edge out (default)"
                  />,
                  <TipFigure
                    key="thick-edge-in"
                    src="/ordering-tips/Thick Edge In.png"
                    alt="Pre-bent moulding with thick edge to the inside of the radius"
                    caption="Thick edge in"
                  />,
                ]}
              >
                <p className="font-medium text-neutral-900">Standard orientation</p>
                <p>
                  When a piece is ordered as pre-bent, the default orientation (unless otherwise specified) is with the
                  thick edge to the outside of the radius. Pay attention to how your piece will be installed, and be sure
                  to let us know if it should be thick edge in. Note that on radius panel box corners, the orientation
                  should typically be switched to thick edge in, where the thick edge is on the inside of the radius, but
                  the outside of the panel box.
                </p>
                <p>
                  Our crown profiles are bent with the default orientation matching the image in the original moulding
                  manufacturer&apos;s catalog.
                </p>
                <p>Notched and beaded profiles have a default orientation of notch in and bead in.</p>
              </TextWithFigures>
            </div>

            <div id="standard-bending" className="scroll-mt-[var(--header-offset)]">
              <TextWithFigures
                figuresBelow
                figures={[
                  <TipFigure
                    key="standard-half-round"
                    src="/ordering-tips/Standard half-round.png"
                    alt="Half-round Flex Trim bent entirely to the specified radius"
                    caption="Standard half-round"
                  />,
                  <TipFigure
                    key="half-round-straight-legs"
                    src="/ordering-tips/Half-round with straight legs.png"
                    alt="Half-round Flex Trim with straight legs"
                    caption="Half-round with straight legs"
                  />,
                ]}
              >
                <p className="font-medium text-neutral-900">Standard bending</p>
                <p>
                  By default, we bend the entire Flex Trim™ piece to the specified radius. This allows for easier
                  adjustments on site when you need to flex a piece in or out. When installing, the part should be mitered
                  where the straight trim begins and ends. Curved lengths should never be forced into a straight position.
                </p>
                <p>
                  Straight legs can be added to almost any item, but it must be communicated when ordering. Note that all
                  of our quick-ship stock half-rounds are configured without straight legs for the widest range of
                  installation radii.
                </p>
              </TextWithFigures>
            </div>
          </div>
        </TipSection>

        <TipSection {...sectionProps("radius-crown", "Radius crown")}>
          <div className="space-y-8">
            <TextWithFigures
              figuresBelow
              figures={[
                <TipFigure
                  key="isr"
                  src="/ordering-tips/ISR.png"
                  alt="ISR concave crown moulding"
                  caption="ISR, concave (curves inward)"
                />,
                <TipFigure
                  key="osr"
                  src="/ordering-tips/OSR.png"
                  alt="OSR convex crown moulding"
                  caption="OSR, convex (curves outward)"
                />,
              ]}
            >
              <p>
                Crown moulding in radius applications should rarely be ordered as straight pieces. Specify whether you
                need <strong className="font-semibold text-neutral-900">ISR</strong> (inside/concave radius) or{" "}
                <strong className="font-semibold text-neutral-900">OSR</strong> (outside/convex radius). ISR requires
                the bottom of the crown to be longer than the top. OSR requires the top to be longer than the bottom. If
                straight pieces are used instead, they can buckle and turn wavy during installation. If ordering straight
                crown from our quick-ship items, check the bending limitations at the bottom of the item&apos;s page.
              </p>
            </TextWithFigures>

            <div id="crown-assembly" className="scroll-mt-[var(--header-offset)]">
              <TextWithFigures
                equalSplit
                figures={[
                  <TipFigure
                    key="assembly"
                    src="/ordering-tips/Radius Crown Assembly.png"
                    alt="Radius crown assembly cross-section"
                    imageClassName="mx-auto w-[70%]"
                  />,
                ]}
              >
                <p className="font-medium text-neutral-900">Radius crown assembly</p>
                <p>
                  Different components in an assembly can have different radius measurements. Some parts must be
                  pre-bent, while others can ship as straight pieces. When ordering, a sketch is extremely helpful for us to
                  verify the information. Additionally, please let us know:
                </p>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>The wall radius</li>
                  <li>ISR or OSR</li>
                  <li>The ceiling crown backer offset distance from the wall</li>
                  <li>The installation location for each profile (ceiling or wall)</li>
                </ol>
              </TextWithFigures>
            </div>

            <div id="radius-corner" className="scroll-mt-[var(--header-offset)]">
              <TextWithFigures
                figuresBelow
                figures={[
                  <TipFigure
                    key="str-rad-str-isr"
                    src="/ordering-tips/Straight-Radius-Straight ISR.png"
                    alt="Straight-radius-straight ISR example"
                    caption="Straight-radius-straight (ISR)"
                  />,
                  <TipFigure
                    key="str-rad-str-osr"
                    src="/ordering-tips/Straight-Radius-Straight OSR.png"
                    alt="Straight-radius-straight OSR example"
                    caption="Straight-radius-straight (OSR)"
                  />,
                ]}
              >
                <p className="font-medium text-neutral-900">
                  Radius corner: straight-radius-straight
                </p>
                <p>
                  A corner finished as a radius with straight components on each side is much easier to install if we
                  bend it as a quarter circle with straight legs. If this shape is not disclosed on the front end, the
                  crown will be bent as a continuous curve that must be trimmed at the start of the straight wall. That
                  curve cannot be flexed outwards into straight legs.
                </p>
              </TextWithFigures>
            </div>

            <div id="barrel-dormer" className="scroll-mt-[var(--header-offset)]">
              <TextWithFigures
                figuresBelow
                figures={[
                  <TipFigure
                    key="tudor"
                    src="/ordering-tips/Tudor Ski Slope Roof.png"
                    alt="Tudor ski-slope roof with curved trim"
                    caption="Tudor ski-slope roof (ISR)"
                  />,
                  <TipFigure
                    key="dormer"
                    src="/ordering-tips/Dormer Window.png"
                    alt="Dormer window with radius crown"
                    caption="Dormer window (OSR)"
                  />,
                  <TipFigure
                    key="barrel"
                    src="/ordering-tips/Barrel Vaulted Ceiling.png"
                    alt="Barrel vaulted ceiling with radius crown"
                    caption="Barrel vaulted ceiling (OSR)"
                  />,
                ]}
              >
                <p className="font-medium text-neutral-900">
                  Curved ceilings: tudor ski-slope roof, dormer windows, and barrel vaulted ceilings
                </p>
                <p>
                  When the ceiling or top surface is curved instead of the wall, the bending orientation is opposite of
                  how it appears. For example, a tudor ski-slope roof looks like OSR, but is actually ISR. Dormer
                  windows and barrel vaulted ceilings look like ISR, but are actually OSR. In general, these
                  applications need to be specified when ordering.
                </p>
              </TextWithFigures>
            </div>
          </div>
        </TipSection>
      </div>
    </section>
  );
}
