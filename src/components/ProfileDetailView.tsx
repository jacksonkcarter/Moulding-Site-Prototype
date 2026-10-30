"use client";

import Link from "next/link";
import { BendingStylesCard } from "@/components/BendingStylesCard";
import { DownloadProfilePdfButton } from "@/components/DownloadProfilePdfButton";
import { ProfileMatchPrompt } from "@/components/ProfileMatchPrompt";
import type { ProfileRow } from "@/lib/profiles";

/** Previous frame was max-w-md (448px); image area inside p-6 ≈ 400px. */
const MAX_IMAGE_PX = 400;

const SELECT_PROFILE_MATCH_COPY =
  "Use our Made-to-Match profile checker to compare your rigid moulding against this Flex Trim™ profile. Prefer to talk it through? Contact us with your profile, thickness, width, and manufacturer and we'll help verify the match.";

type ProfileDetailViewProps = {
  profile: ProfileRow;
  imageSrc: string;
  isNewDrawing: boolean;
  hasOutlinePdf: boolean;
  backHref: string;
};

export function ProfileDetailView({
  profile,
  imageSrc,
  isNewDrawing,
  hasOutlinePdf,
  backHref,
}: ProfileDetailViewProps) {
  const checkerHref = `/products/profile-checker?profile=${encodeURIComponent(profile.profileId)}&return=${encodeURIComponent(backHref)}`;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-5 pb-12 sm:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back to browse select profiles
        </Link>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="flex justify-center lg:justify-end">
            <div className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              {/* Native size up to max; never upscale (avoids pixelation). */}
              {/* eslint-disable-next-line @next/next/no-img-element -- need intrinsic sizing without upscale */}
              <img
                src={imageSrc}
                alt={`${profile.profileId} flexible moulding`}
                className="h-auto w-auto object-contain"
                style={{ maxWidth: MAX_IMAGE_PX, maxHeight: MAX_IMAGE_PX }}
              />
            </div>
          </div>

          <div className="min-w-0 space-y-6 text-center lg:text-left">
            <div>
              <p className="text-sm font-medium tracking-wide text-primary">{profile.mouldingType}</p>
              <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900">
                {profile.profileId}
              </h1>
              {profile.description ? (
                <p className="mt-2 text-neutral-600">{profile.description}</p>
              ) : null}
              <p className="mt-3 text-sm text-neutral-600">
                <span className="font-medium text-neutral-800">Production facility:</span>{" "}
                {profile.region === "east" ? "North Carolina" : "Utah"}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 lg:items-start">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                <DownloadProfilePdfButton
                  profile={profile}
                  mode="generated"
                  label="Download PDF"
                  variant="primary"
                  isNewDrawing={isNewDrawing}
                />
                {hasOutlinePdf ? (
                  <DownloadProfilePdfButton
                    profile={profile}
                    mode="outline"
                    label="Download PDF (outline only)"
                    variant="primary"
                  />
                ) : null}
              </div>

              {hasOutlinePdf ? (
                <ProfileMatchPrompt
                  checkerHref={checkerHref}
                  matchingWoodProfiles={SELECT_PROFILE_MATCH_COPY}
                  className="mx-auto lg:mx-0"
                />
              ) : null}
            </div>
          </div>
        </div>

        <section className="mx-auto mt-12 max-w-[30rem]" aria-labelledby="bending-guidelines-heading">
          <h2
            id="bending-guidelines-heading"
            className="mb-4 text-center text-lg font-semibold tracking-tight text-neutral-900"
          >
            Please review our bending guidelines and limitations:
          </h2>
          <BendingStylesCard />
        </section>
      </div>
    </main>
  );
}
