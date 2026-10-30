import type { Metadata } from "next";
import { Suspense } from "react";
import { InstallationGuideView } from "@/components/InstallationGuideView";
import { INSTALLATION_GUIDE_TITLE } from "@/data/installation-guide";

export const metadata: Metadata = {
  title: INSTALLATION_GUIDE_TITLE,
};

export default function InstallationGuidePage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <InstallationGuideView />
    </Suspense>
  );
}
