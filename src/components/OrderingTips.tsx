import Image from "next/image";
import type { ReactNode } from "react";

function TipFigure({
  src,
  alt,
  caption,
  placeholder,
}: {
  src?: string;
  alt: string;
  caption?: string;
  placeholder?: string;
}) {
  return (
    <figure className="min-w-0">
      {src ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <Image src={src} alt={alt} fill className="object-contain p-2" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ) : (
        <div
          className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 text-center text-xs leading-relaxed text-neutral-500"
          role="img"
          aria-label={alt}
        >
          {placeholder ?? "Diagram placeholder"}
        </div>
      )}
      {caption ? <figcaption className="mt-1.5 text-xs text-neutral-500">{caption}</figcaption> : null}
    </figure>
  );
}

function TipSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <h3 id={`${id}-heading`} className="text-base font-semibold tracking-tight text-neutral-900 md:text-lg">
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">{children}</div>
    </section>
  );
}

/**
 * Text + figures grid.
 * 1 image  → text 2/3, image 1/3
 * 2 images → text 1/3, images 2/3
 * 0 images → text full width
 */
function TextWithFigures({
  children,
  figures,
}: {
  children: ReactNode;
  figures: ReactNode[];
}) {
  const count = figures.length;

  if (count === 0) {
    return <div className="space-y-2">{children}</div>;
  }

  if (count === 1) {
    return (
      <div className="grid items-start gap-5 md:grid-cols-3 md:gap-6">
        <div className="min-w-0 space-y-2 md:col-span-2">{children}</div>
        <div className="min-w-0">{figures[0]}</div>
      </div>
    );
  }

  // 2+ images: text 1/3, figures 2/3
  return (
    <div className="grid items-start gap-5 md:grid-cols-3 md:gap-6">
      <div className="min-w-0 space-y-2">{children}</div>
      <div className="grid min-w-0 grid-cols-2 gap-3 md:col-span-2 md:gap-4">{figures}</div>
    </div>
  );
}

/** Shared ordering tips used on audience Ordering pages. */
export function OrderingTips() {
  return (
    <section
      id="ordering-tips"
      aria-labelledby="ordering-tips-heading"
      className="scroll-mt-24 border-t border-neutral-200 pt-10"
    >
      <h2
        id="ordering-tips-heading"
        className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
      >
        Ordering tips
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
        Use these guidelines when specifying Flex Trim™ so we can match your profile and bend correctly the first
        time.
      </p>

      <div className="mt-10 space-y-10">
        <TipSection id="moulding-profile" title="Moulding profile">
          <p>
            Many moulding profiles look very similar, but small differences matter. To ensure an exact match, please
            provide the moulding manufacturer&apos;s name, the profile name or number, and the wood species (for
            example MDF, finger-joint pine, or oak). This is especially important for seamless mitering between wood
            and flexible moulding.
          </p>
        </TipSection>

        <TipSection id="straight-vs-prebent" title="Straight pieces vs. pre-bent pieces">
          <div className="space-y-8">
            <TextWithFigures
              figures={[
                <TipFigure
                  key="bending-1"
                  src="/ordering-tips/bending-style-1-v2.png"
                  alt="Style 1 bending orientation — view one"
                />,
                <TipFigure
                  key="bending-1a"
                  src="/ordering-tips/bending-style-1a-v2.png"
                  alt="Style 1 bending orientation — view two"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Style #1 — Straight pieces</p>
              <p>
                Used when moulding is bent &ldquo;long-ways&rdquo; against the thin dimension (like a belt). A
                straight piece works for this application. Common examples: base shoe, base, base cap, and chair rail.
              </p>
            </TextWithFigures>

            <TextWithFigures
              figures={[
                <TipFigure
                  key="bending-2"
                  src="/ordering-tips/bending-style-2-v2.png"
                  alt="Style 2 bending orientation — view one"
                />,
                <TipFigure
                  key="bending-2a"
                  src="/ordering-tips/bending-style-2a-v2.png"
                  alt="Style 2 bending orientation — view two"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Style #2 — Pre-bent pieces</p>
              <p>
                Used when moulding is bent &ldquo;sideways&rdquo; against the wide dimension (like a rainbow). These
                pieces must be pre-bent during manufacturing. Common examples: casing, crown, and crown ceiling
                backer.
              </p>
            </TextWithFigures>
          </div>
        </TipSection>

        <TipSection id="casing-radius" title="Casing — regular vs. irregular radius (pre-bent in manufacturing)">
          <div className="space-y-8">
            <TextWithFigures
              figures={[
                <TipFigure
                  key="half-round"
                  src="/order-form-images/Arch Style Half Round.png"
                  alt="Half-round arch with radius and diameter measurements"
                  caption="Half-round — radius / diameter"
                />,
                <TipFigure
                  key="eyebrow"
                  src="/order-form-images/Arc Style Eyebrow.png"
                  alt="Eyebrow arch with width and rise measurements"
                  caption="Eyebrow — width and rise"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Regular radius</p>
              <p>
                A true radius stays consistent, like a section of a circle—for example a half-round or eyebrow arch.
                Only a few measurements are usually required.
              </p>
            </TextWithFigures>

            <TextWithFigures
              figures={[
                <TipFigure
                  key="elliptical"
                  src="/order-form-images/Arch Style Elliptical.png"
                  alt="Elliptical arch with width and rise"
                  caption="Elliptical — width and rise; template required"
                />,
                <TipFigure
                  key="oval"
                  alt="Oval arch diagram"
                  placeholder="Oval arch diagram — width, rise, and template"
                  caption="Oval — template required"
                />,
              ]}
            >
              <p className="font-medium text-neutral-900">Irregular radius</p>
              <p>
                The radius changes along the curve—for example oval or elliptical arches. A physical template is
                required so manufacturing can follow the exact shape.
              </p>
            </TextWithFigures>
          </div>
        </TipSection>

        <TipSection id="bending-limitations" title="Bending limitations">
          <p>
            As a general rule, flexible moulding cannot be pre-bent smaller than three times the width of the
            profile. If your radius is tighter than that, contact us before ordering so we can confirm what is
            possible.
          </p>
        </TipSection>

        <TipSection id="radius-crown" title="Radius crown">
          <TextWithFigures
            figures={[
              <TipFigure
                key="isr"
                src="/order-form-images/ISR.png"
                alt="ISR concave crown moulding"
                caption="ISR — concave (curves inward)"
              />,
              <TipFigure
                key="osr"
                src="/order-form-images/OSR.png"
                alt="OSR convex crown moulding"
                caption="OSR — convex (curves outward)"
              />,
            ]}
          >
            <p>
              Crown moulding in radius applications should rarely be ordered as straight pieces. Specify whether you
              need <strong className="font-semibold text-neutral-900">ISR</strong> (inside / concave radius) or{" "}
              <strong className="font-semibold text-neutral-900">OSR</strong> (outside / convex radius). ISR requires
              the bottom of the crown to be longer than the top; OSR requires the top to be longer than the bottom. If
              straight pieces are used instead, they can buckle and turn wavy during installation.
            </p>
          </TextWithFigures>
        </TipSection>

        <TipSection id="special-crown" title="Special radius crown applications">
          <p>
            Unique or custom crown fits need more information and detail when you order. Applications that often need
            special attention include multi-piece assemblies, radius corners with straight runs, dormer or barrel
            conditions, Tudor / “ski slope” roofs, and barrel ceilings.
          </p>
        </TipSection>

        <TipSection id="crown-assembly" title="Radius crown assembly">
          <TextWithFigures
            figures={[
              <TipFigure
                key="assembly"
                alt="Radius crown assembly cross-section"
                placeholder="Assembly diagram — ceiling, curved wall, radius members, straight cradle / panel cap"
              />,
            ]}
          >
            <p>
              Different components in an assembly can have different radius measurements. Some parts must be pre-bent;
              others can ship as straight pieces. Tell us which members are radius, whether each is concave or convex,
              and include cradle or flat-stock notes when they apply.
            </p>
          </TextWithFigures>
        </TipSection>

        <TipSection id="radius-corner" title="Radius corner: straight – radius – straight">
          <TextWithFigures
            figures={[
              <TipFigure
                key="corner"
                src="/order-form-images/Arch Style Radius Corners.png"
                alt="Radius corner arch style"
                caption="Radius corner application"
              />,
              <TipFigure
                key="str-rad-str"
                src="/order-form-images/Half Round Str-Rad-Str OSR.png"
                alt="Straight-radius-straight OSR example"
                caption="Straight – radius – straight example"
              />,
            ]}
          >
            <p>
              A corner finished as a radius with straight components on each side needs clear bend information so we
              manufacture the curved segment correctly.
            </p>
          </TextWithFigures>
        </TipSection>

        <TipSection id="barrel-dormer" title="Barrel / crown above a radius window or dormer">
          <TextWithFigures
            figures={[
              <TipFigure
                key="dormer"
                src="/order-form-images/Quarter Round Str-Rad-Str OSR.png"
                alt="Crown above radius window or dormer"
                caption="Specify OSR orientation for dormer / barrel-over-opening conditions"
              />,
            ]}
          >
            <p>
              Often used with casing applications. It can look like ISR but is technically OSR—specify this condition
              when ordering so orientation and bend are correct.
            </p>
          </TextWithFigures>
        </TipSection>

        <TipSection id="tudor-roof" title="Tudor-style (“ski slope”) roof">
          <TextWithFigures
            figures={[
              <TipFigure
                key="tudor"
                alt="Tudor ski-slope roof example"
                placeholder="Photo placeholder — Tudor / ski-slope roof with curved trim"
              />,
            ]}
          >
            <p>
              This application can look like OSR but is technically ISR. A template may be required for an accurate
              fit.
            </p>
          </TextWithFigures>
        </TipSection>

        <TipSection id="barrel-ceiling" title="Barrel ceiling">
          <TextWithFigures
            figures={[
              <TipFigure
                key="barrel"
                alt="Barrel ceiling example"
                placeholder="Photo placeholder — barrel / vaulted ceiling with radius crown"
              />,
            ]}
          >
            <p>
              Also called a horizontal radius. From the floor looking up, the application is typically OSR. Provide
              radius (or width and rise) and confirm orientation when you order.
            </p>
          </TextWithFigures>
        </TipSection>
      </div>
    </section>
  );
}
