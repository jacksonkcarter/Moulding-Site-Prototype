"use client";

import { useState } from "react";
import { downloadInstallationGuidePdf } from "@/components/InstallationGuidePdf";

type DownloadInstallationGuidePdfButtonProps = {
  className?: string;
};

export function DownloadInstallationGuidePdfButton({
  className = "",
}: DownloadInstallationGuidePdfButtonProps) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      await downloadInstallationGuidePdf();
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
    >
      {busy ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
