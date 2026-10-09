"use client";

import { useState } from "react";
import { BusyLabel } from "@/components/LoadingSpinner";
import type { ProfileRow } from "@/lib/profiles";
import { downloadProfilePdf } from "@/components/ProfileDetailPdf";

type DownloadProfilePdfButtonProps = {
  profile: ProfileRow;
  /** Generated PDF with logos/info, or raw outline file from the PDFs folder. */
  mode: "generated" | "outline";
  label: string;
  className?: string;
  /** Outline style: filled primary vs outlined secondary. */
  variant?: "primary" | "secondary";
  /** Used for generated PDFs - old drawings get a less-than-1:1 scale notice. */
  isNewDrawing?: boolean;
  /** Override image URL for generated PDFs (e.g. stock-item public path). */
  imageUrl?: string;
  /** Override id used to fetch the outline PDF (e.g. stock alternate name). */
  outlineId?: string;
};

export function DownloadProfilePdfButton({
  profile,
  mode,
  label,
  className = "",
  variant = "primary",
  isNewDrawing = true,
  imageUrl,
  outlineId,
}: DownloadProfilePdfButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "generated") {
        await downloadProfilePdf(profile, isNewDrawing, imageUrl);
        return;
      }

      const id = outlineId ?? profile.profileId;
      const response = await fetch(`/api/profile-pdfs/${encodeURIComponent(id)}?download=1`);
      if (!response.ok) {
        setError("Outline PDF not available for this profile.");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const partNumber = id.replace(/[^\w.-]+/g, "_");
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      anchor.download = match?.[1] ?? `Flex Trim ${partNumber} Outline.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  const variantClass =
    variant === "secondary"
      ? "border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white"
      : "bg-primary text-white hover:bg-primary-hover";

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-70 ${variantClass} ${className}`}
        data-busy-managed
      >
        <BusyLabel busy={busy} idle={label} busyText="Preparing PDF…" />
      </button>
      {error ? <p className="text-xs text-primary">{error}</p> : null}
    </div>
  );
}
