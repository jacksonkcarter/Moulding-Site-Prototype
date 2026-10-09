"use client";

import { useState } from "react";
import { BusyLabel } from "@/components/LoadingSpinner";
import { downloadInstallationGuidePdf } from "@/components/InstallationGuidePdf";
import {
  getInstallationGuideCopy,
  type InstallationLocale,
} from "@/data/installation-guide";

type DownloadInstallationGuidePdfButtonProps = {
  className?: string;
  locale?: InstallationLocale;
};

export function DownloadInstallationGuidePdfButton({
  className = "",
  locale = "en",
}: DownloadInstallationGuidePdfButtonProps) {
  const [busy, setBusy] = useState(false);
  const copy = getInstallationGuideCopy(locale);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      await downloadInstallationGuidePdf(locale);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70 ${className}`}
      data-busy-managed
    >
      <BusyLabel busy={busy} idle={copy.downloadPdf} busyText={copy.preparingPdf} />
    </button>
  );
}
