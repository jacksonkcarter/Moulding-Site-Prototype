"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function FooterSwitch() {
  const pathname = usePathname();
  const isGallery = pathname?.startsWith("/gallery") ?? false;
  const isProfileChecker = pathname?.startsWith("/product-info/profile-checker") ?? false;
  if (isProfileChecker) return null;
  return <Footer compact={isGallery} />;
}
