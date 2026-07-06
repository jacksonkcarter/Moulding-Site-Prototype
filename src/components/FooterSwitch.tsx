"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function FooterSwitch() {
  const pathname = usePathname();
  const isGallery = pathname?.startsWith("/gallery") ?? false;
  return <Footer compact={isGallery} />;
}
