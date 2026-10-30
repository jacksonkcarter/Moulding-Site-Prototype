"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { STOCK_ITEM_SECTIONS } from "@/data/stock-items";
import { ACCESSORY_CATEGORIES } from "@/data/accessories";
import { PROFILE_MOULDING_TYPES } from "@/data/profile-moulding-types";
import { navItems, TOOLS_AND_INFORMATION_LINKS, type NavLink } from "@/lib/nav";
import { ContactLink } from "@/components/ContactLink";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const PROFILE_NAV_MOULDING_OPTIONS = [...PROFILE_MOULDING_TYPES];

type NavChild = { label: string; href: string };

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [stockItemsSubmenuOpen, setStockItemsSubmenuOpen] = useState(false);
  const stockItemsSubmenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profilesSubmenuOpen, setProfilesSubmenuOpen] = useState(false);
  const profilesSubmenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [accessoriesSubmenuOpen, setAccessoriesSubmenuOpen] = useState(false);
  const accessoriesSubmenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toolsSubmenuOpen, setToolsSubmenuOpen] = useState(false);
  const toolsSubmenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileDeepExpanded, setMobileDeepExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPending, setSearchPending] = useState(false);

  useEffect(() => {
    setSearchPending(false);
    setOpenDropdown(null);
    setStockItemsSubmenuOpen(false);
    setProfilesSubmenuOpen(false);
    setAccessoriesSubmenuOpen(false);
    setToolsSubmenuOpen(false);
    setMobileOpen(false);
    setMobileExpanded(null);
    setMobileDeepExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    // position:fixed locks iOS from scrolling the page under the menu; overflow
    // alone is not enough and the leftover offset carries into the next route.
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  function menusPinned() {
    return typeof document !== "undefined" && document.documentElement.classList.contains("nav-inplace-busy");
  }

  function submitSiteSearch() {
    const q = searchQuery.trim();
    setSearchPending(true);
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function closeDesktopDropdown() {
    if (menusPinned()) return;
    setOpenDropdown(null);
    setStockItemsSubmenuOpen(false);
    setProfilesSubmenuOpen(false);
    setAccessoriesSubmenuOpen(false);
    setToolsSubmenuOpen(false);
  }

  function renderDesktopNavChild(child: NavChild, keyPrefix: string) {
    if (child.label === "Tools and information") {
      const toolsActive = TOOLS_AND_INFORMATION_LINKS.some((link) => pathname === link.href);
      return (
        <div
          key={`${keyPrefix}-${child.label}`}
          className="relative"
          onMouseEnter={() => {
            if (toolsSubmenuCloseTimer.current) {
              clearTimeout(toolsSubmenuCloseTimer.current);
              toolsSubmenuCloseTimer.current = null;
            }
            setStockItemsSubmenuOpen(false);
            setProfilesSubmenuOpen(false);
            setAccessoriesSubmenuOpen(false);
            setToolsSubmenuOpen(true);
          }}
          onMouseLeave={() => {
            if (menusPinned()) return;
            toolsSubmenuCloseTimer.current = setTimeout(() => setToolsSubmenuOpen(false), 150);
          }}
        >
          <Link
            href={child.href}
            className={`flex items-center justify-between gap-3 whitespace-nowrap px-4 py-2 text-sm ${
              toolsActive
                ? "bg-red-50 font-medium text-[#9f1b20]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
            }`}
          >
            {child.label}
            <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {toolsSubmenuOpen && (
            <div
              className="absolute left-full -top-2 z-[101] min-w-[240px] -ml-px pt-1"
              onMouseEnter={() => {
                if (toolsSubmenuCloseTimer.current) {
                  clearTimeout(toolsSubmenuCloseTimer.current);
                  toolsSubmenuCloseTimer.current = null;
                }
                setToolsSubmenuOpen(true);
              }}
              onMouseLeave={() => {
                if (menusPinned()) return;
                toolsSubmenuCloseTimer.current = setTimeout(() => setToolsSubmenuOpen(false), 150);
              }}
            >
              <div
                data-nav-menu
                className="rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white py-1 shadow-lg"
              >
                {TOOLS_AND_INFORMATION_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block whitespace-nowrap px-4 py-2 text-sm ${
                      pathname === link.href
                        ? "bg-red-50 font-medium text-[#9f1b20]"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (child.label === "Quick-ship stock items") {
      return (
        <div
          key={`${keyPrefix}-${child.label}`}
          className="relative"
          onMouseEnter={() => {
            if (stockItemsSubmenuCloseTimer.current) {
              clearTimeout(stockItemsSubmenuCloseTimer.current);
              stockItemsSubmenuCloseTimer.current = null;
            }
            setProfilesSubmenuOpen(false);
            setAccessoriesSubmenuOpen(false);
            setToolsSubmenuOpen(false);
            setStockItemsSubmenuOpen(true);
          }}
          onMouseLeave={() => {
            if (menusPinned()) return;
            stockItemsSubmenuCloseTimer.current = setTimeout(() => setStockItemsSubmenuOpen(false), 150);
          }}
        >
          <Link
            href={child.href}
            className={`flex items-center justify-between px-4 py-2 text-sm ${
              pathname === child.href
                ? "bg-red-50 font-medium text-[#9f1b20]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
            }`}
          >
            {child.label}
            <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {stockItemsSubmenuOpen && (
            <div
              className="absolute left-full -top-2 z-[101] min-w-[200px] -ml-px pt-1"
              onMouseEnter={() => {
                if (stockItemsSubmenuCloseTimer.current) {
                  clearTimeout(stockItemsSubmenuCloseTimer.current);
                  stockItemsSubmenuCloseTimer.current = null;
                }
                setStockItemsSubmenuOpen(true);
              }}
              onMouseLeave={() => {
                if (menusPinned()) return;
                stockItemsSubmenuCloseTimer.current = setTimeout(() => setStockItemsSubmenuOpen(false), 150);
              }}
            >
              <div
                data-nav-menu
                className="rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white py-1 shadow-lg"
              >
                <Link
                  href="/products/browse-stock-items"
                  className="block px-4 py-2 text-sm font-medium text-[#9f1b20] hover:bg-neutral-50"
                >
                  Browse by category
                </Link>
                <div className="border-t border-neutral-100 pt-1">
                  {STOCK_ITEM_SECTIONS.map((section) => (
                    <Link
                      key={section.id}
                      href={`/products/stock-items#${section.id}`}
                      className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                    >
                      {section.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-neutral-100 px-2 py-1.5">
                  <Link
                    href="/products/stock-items"
                    className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                  >
                    View all profiles
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (child.label === "Production-ready profiles") {
      return (
        <div
          key={`${keyPrefix}-${child.label}`}
          className="relative"
          onMouseEnter={() => {
            if (profilesSubmenuCloseTimer.current) {
              clearTimeout(profilesSubmenuCloseTimer.current);
              profilesSubmenuCloseTimer.current = null;
            }
            setStockItemsSubmenuOpen(false);
            setAccessoriesSubmenuOpen(false);
            setToolsSubmenuOpen(false);
            setProfilesSubmenuOpen(true);
          }}
          onMouseLeave={() => {
            if (menusPinned()) return;
            profilesSubmenuCloseTimer.current = setTimeout(() => setProfilesSubmenuOpen(false), 150);
          }}
        >
          <Link
            href={child.href}
            className={`flex items-center justify-between gap-3 whitespace-nowrap px-4 py-2 text-sm ${
              pathname === child.href
                ? "bg-red-50 font-medium text-[#9f1b20]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
            }`}
          >
            {child.label}
            <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {profilesSubmenuOpen && (
            <div
              className="absolute left-full -top-2 z-[101] w-max max-w-[calc(100vw-3rem)] -ml-px pt-1"
              onMouseEnter={() => {
                if (profilesSubmenuCloseTimer.current) {
                  clearTimeout(profilesSubmenuCloseTimer.current);
                  profilesSubmenuCloseTimer.current = null;
                }
                setProfilesSubmenuOpen(true);
              }}
              onMouseLeave={() => {
                if (menusPinned()) return;
                profilesSubmenuCloseTimer.current = setTimeout(() => setProfilesSubmenuOpen(false), 150);
              }}
            >
              <div
                data-nav-menu
                className="overflow-hidden rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white shadow-lg"
              >
                <Link
                  href="/products/browse-select-profiles"
                  className="block px-4 py-2 text-sm font-medium text-[#9f1b20] hover:bg-neutral-50"
                >
                  Browse by category
                </Link>
                <div className="grid grid-cols-3 gap-x-1 gap-y-0 border-t border-neutral-100 px-2 py-1.5">
                  {PROFILE_NAV_MOULDING_OPTIONS.map((type) => (
                    <Link
                      key={type}
                      href={`/products/profile-search?types=${encodeURIComponent(type)}`}
                      className="block whitespace-nowrap rounded px-1.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-neutral-100 px-2 py-1.5">
                  <Link
                    href="/products/profile-search"
                    className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                  >
                    View all profiles
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (child.label === "Architectural accessories") {
      return (
        <div
          key={`${keyPrefix}-${child.label}`}
          className="relative"
          onMouseEnter={() => {
            if (accessoriesSubmenuCloseTimer.current) {
              clearTimeout(accessoriesSubmenuCloseTimer.current);
              accessoriesSubmenuCloseTimer.current = null;
            }
            setStockItemsSubmenuOpen(false);
            setProfilesSubmenuOpen(false);
            setToolsSubmenuOpen(false);
            setAccessoriesSubmenuOpen(true);
          }}
          onMouseLeave={() => {
            if (menusPinned()) return;
            accessoriesSubmenuCloseTimer.current = setTimeout(() => setAccessoriesSubmenuOpen(false), 150);
          }}
        >
          <Link
            href={child.href}
            className={`flex items-center justify-between px-4 py-2 text-sm ${
              pathname === child.href || pathname.startsWith(`${child.href}/`)
                ? "bg-red-50 font-medium text-[#9f1b20]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
            }`}
          >
            {child.label}
            <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {accessoriesSubmenuOpen && (
            <div
              className="absolute left-full -top-2 z-[101] min-w-[200px] -ml-px pt-1"
              onMouseEnter={() => {
                if (accessoriesSubmenuCloseTimer.current) {
                  clearTimeout(accessoriesSubmenuCloseTimer.current);
                  accessoriesSubmenuCloseTimer.current = null;
                }
                setAccessoriesSubmenuOpen(true);
              }}
              onMouseLeave={() => {
                if (menusPinned()) return;
                accessoriesSubmenuCloseTimer.current = setTimeout(() => setAccessoriesSubmenuOpen(false), 150);
              }}
            >
              <div
                data-nav-menu
                className="rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white py-1 shadow-lg"
              >
                <Link
                  href="/products/accessories"
                  className="block px-4 py-2 text-sm font-medium text-[#9f1b20] hover:bg-neutral-50"
                >
                  Browse by category
                </Link>
                <div className="border-t border-neutral-100 pt-1">
                  {ACCESSORY_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products/accessories/${category.slug}`}
                      className={`block px-4 py-2 text-sm ${
                        pathname === `/products/accessories/${category.slug}`
                          ? "bg-red-50 font-medium text-[#9f1b20]"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                      }`}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-neutral-100 px-2 py-1.5">
                  <Link
                    href="/products/accessories/all"
                    className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                  >
                    View all accessories
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={`${keyPrefix}-${child.label}`}
        href={child.href}
        className={`block whitespace-nowrap px-4 py-2 text-sm ${
          pathname === child.href
            ? "bg-red-50 font-medium text-[#9f1b20]"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
        }`}
      >
        {child.label}
      </Link>
    );
  }

  function mobileDeepKey(itemLabel: string, childLabel: string) {
    return `${itemLabel}::${childLabel}`;
  }

  function renderMobileNavChild(child: NavChild, itemLabel: string) {
    if (child.label === "Tools and information") {
      const deepKey = mobileDeepKey(itemLabel, child.label);
      return (
        <div key={`${itemLabel}-${child.label}`}>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
            onClick={() =>
              setMobileDeepExpanded((c) => (c === deepKey ? null : deepKey))
            }
          >
            {child.label}
            <svg
              className={`h-4 w-4 transition-transform ${mobileDeepExpanded === deepKey ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileDeepExpanded === deepKey && (
            <div className="pl-4" data-nav-menu>
              {TOOLS_AND_INFORMATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-full px-4 py-2 text-sm ${
                    pathname === link.href ? "font-medium text-[#9f1b20]" : "text-neutral-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (child.label === "Quick-ship stock items") {
      const deepKey = mobileDeepKey(itemLabel, child.label);
      return (
        <div key={`${itemLabel}-${child.label}`}>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
            onClick={() =>
              setMobileDeepExpanded((c) => (c === deepKey ? null : deepKey))
            }
          >
            {child.label}
            <svg
              className={`h-4 w-4 transition-transform ${mobileDeepExpanded === deepKey ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileDeepExpanded === deepKey && (
            <div className="pl-4" data-nav-menu>
              <Link
                href="/products/browse-stock-items"
                className="block rounded-full px-4 py-2 text-sm font-medium text-[#9f1b20]"
              >
                Browse by category
              </Link>
              {STOCK_ITEM_SECTIONS.map((section) => (
                <Link
                  key={section.id}
                  href={`/products/stock-items#${section.id}`}
                  className="block rounded-full px-4 py-2 text-sm text-neutral-600"
                >
                  {section.label}
                </Link>
              ))}
              <Link
                href="/products/stock-items"
                className="mx-4 my-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
              >
                View all profiles
              </Link>
            </div>
          )}
        </div>
      );
    }

    if (child.label === "Production-ready profiles") {
      const deepKey = mobileDeepKey(itemLabel, child.label);
      return (
        <div key={`${itemLabel}-${child.label}`}>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
            onClick={() =>
              setMobileDeepExpanded((c) => (c === deepKey ? null : deepKey))
            }
          >
            {child.label}
            <svg
              className={`h-4 w-4 transition-transform ${mobileDeepExpanded === deepKey ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileDeepExpanded === deepKey && (
            <div className="pl-4" data-nav-menu>
              <Link
                href="/products/browse-select-profiles"
                className="block rounded-full px-4 py-2 text-sm font-medium text-[#9f1b20]"
              >
                Browse by category
              </Link>
              {PROFILE_NAV_MOULDING_OPTIONS.map((type) => (
                <Link
                  key={type}
                  href={`/products/profile-search?types=${encodeURIComponent(type)}`}
                  className="block rounded-full px-4 py-2 text-sm text-neutral-600"
                >
                  {type}
                </Link>
              ))}
              <Link
                href="/products/profile-search"
                className="mx-4 my-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
              >
                View all profiles
              </Link>
            </div>
          )}
        </div>
      );
    }

    if (child.label === "Architectural accessories") {
      const deepKey = mobileDeepKey(itemLabel, child.label);
      return (
        <div key={`${itemLabel}-${child.label}`}>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
            onClick={() =>
              setMobileDeepExpanded((c) => (c === deepKey ? null : deepKey))
            }
          >
            {child.label}
            <svg
              className={`h-4 w-4 transition-transform ${mobileDeepExpanded === deepKey ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileDeepExpanded === deepKey && (
            <div className="pl-4" data-nav-menu>
              <Link
                href="/products/accessories"
                className="block rounded-full px-4 py-2 text-sm font-medium text-[#9f1b20]"
              >
                Browse by category
              </Link>
              {ACCESSORY_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products/accessories/${category.slug}`}
                  className="block rounded-full px-4 py-2 text-sm text-neutral-600"
                >
                  {category.label}
                </Link>
              ))}
              <Link
                href="/products/accessories/all"
                className="mx-4 my-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
              >
                View all accessories
              </Link>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={`${itemLabel}-${child.label}`}
        href={child.href}
        className={`block rounded-full px-4 py-2 text-sm ${
          pathname === child.href ? "font-medium text-[#9f1b20]" : "text-neutral-600"
        }`}
      >
        {child.label}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-white/95 backdrop-blur-sm print:hidden">
      {/* Top ribbon: order status */}
      <div className="w-full border-b border-neutral-200 bg-neutral-100">
        <div className="flex h-10 w-full items-center justify-end gap-6 px-4 sm:px-6">
          <Link href="/ordering/order-status" className="text-sm text-neutral-600 hover:text-primary">
            Check order status
          </Link>
        </div>
      </div>
      {/* Main nav ribbon - full width, arched bottom */}
      <div className="relative h-16 w-full overflow-visible">
        {/* Solid white bar */}
        <div className="absolute inset-0 z-0 bg-white" />
        {/* Arch cap: SVG strip with curved bottom and outline */}
        <svg
          className="absolute left-0 right-0 top-full z-0 block h-10 w-full"
          style={{ marginTop: -18 }}
          viewBox="0 -21 100 61"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M 0 40 L 0 -21 L 100 -21 L 100 40 Q 50 -21 0 40 Z"
            fill="#ffffff"
          />
          <path
            d="M 0 40 Q 50 -21 100 40"
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-x-0 top-0 z-10 flex h-16 w-full items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href="/" className="relative z-20 mt-[3px] flex shrink-0 items-center gap-1.5 md:gap-2">
          <Image
            src="/logos/flex-trim.jpg"
            alt="Flex Trim™"
            width={852}
            height={181}
            priority
            unoptimized
            className="h-6 w-auto shrink-0 object-contain md:h-8 xl:h-6 2xl:h-9"
          />
          <span className="shrink-0 text-neutral-300">|</span>
          <Image
            src="/logos/carter-millwork.svg"
            alt="Carter Millwork"
            width={160}
            height={40}
            className="h-6 w-auto shrink-0 object-contain md:h-8 xl:h-6 2xl:h-9"
          />
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-evenly xl:flex">
          <Link
            href="/"
            className={`shrink-0 rounded-full px-2 py-2 text-sm 2xl:px-3 2xl:text-base ${
              pathname === "/"
                ? "text-[#9f1b20]"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-[#9f1b20]"
            }`}
          >
            Home
          </Link>
          {navItems.map((item) =>
            "landingHref" in item ? (
              <div
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={closeDesktopDropdown}
              >
                <Link
                  href={item.landingHref}
                  className={`flex items-center gap-0.5 rounded-full px-2 py-2 text-sm 2xl:gap-1 2xl:px-3 2xl:text-base ${
                    openDropdown === item.label
                      ? "bg-neutral-100 text-[#9f1b20]"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-[#9f1b20]"
                  }`}
                >
                  {item.label}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {openDropdown === item.label && (
                  <div
                    className={`absolute left-0 top-full z-[100] pt-1 ${
                      "columns" in item
                        ? "min-w-[720px]"
                        : item.label === "Installation"
                          ? "w-[240px]"
                          : item.label === "Gallery"
                            ? "w-[280px]"
                            : "w-[220px]"
                    }`}
                  >
                    <div data-nav-menu className="rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
                      {"columns" in item ? (
                        <div className="grid grid-cols-3 gap-0 py-2">
                          {item.columns.map((column, colIndex) => (
                            <div
                              key={column.title}
                              className={`py-1 ${colIndex > 0 ? "border-l border-neutral-200" : ""}`}
                            >
                              {"href" in column && column.href ? (
                                <Link
                                  href={column.href}
                                  className={`block px-4 pb-1 pt-1 text-sm font-bold hover:text-[#9f1b20] ${
                                    pathname === column.href ? "text-[#9f1b20]" : "text-neutral-900"
                                  }`}
                                >
                                  {column.title}
                                </Link>
                              ) : (
                                <p className="px-4 pb-1 pt-1 text-sm font-bold text-neutral-900">{column.title}</p>
                              )}
                              {column.links.map((link) =>
                                renderDesktopNavChild(link, `${item.label}-${column.title}`)
                              )}
                            </div>
                          ))}
                        </div>
                      ) : item.label === "Installation" && "children" in item ? (
                        <>
                          {(() => {
                            const overview = item.children.find((c) => c.label === "Full guide");
                            const rest = item.children.filter((c) => c.label !== "Full guide");
                            return (
                              <>
                                {overview && (
                                  <Link
                                    href={overview.href}
                                    className={`block border-b border-neutral-100 px-4 py-2.5 text-sm font-semibold ${
                                      pathname === overview.href
                                        ? "bg-red-50 text-[#9f1b20]"
                                        : "bg-neutral-50 text-neutral-900 hover:bg-neutral-100 hover:text-[#9f1b20]"
                                    }`}
                                  >
                                    {overview.label}
                                  </Link>
                                )}
                                <div className="grid grid-cols-2 gap-0 pt-0.5">
                                  {rest.map((child) => (
                                    <Link
                                      key={`${item.label}-${child.label}`}
                                      href={child.href}
                                      className={`block px-4 py-2 text-sm ${
                                        pathname === child.href
                                          ? "bg-red-50 font-medium text-[#9f1b20]"
                                          : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                      }`}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            );
                          })()}
                        </>
                      ) : "children" in item ? (
                        item.children.map((child) => renderDesktopNavChild(child, item.label))
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              (() => {
                const link = item as NavLink;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`shrink-0 rounded-full px-2 py-2 text-sm 2xl:px-3 2xl:text-base ${
                      pathname === link.href
                        ? "text-[#9f1b20]"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-[#9f1b20]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })()
            )
          )}
        </nav>
        <div className="relative z-30 flex shrink-0 items-center gap-2">
          <ContactLink className="mt-[12px] hidden items-center rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover xl:inline-flex 2xl:px-4">
            Contact us
          </ContactLink>
          <form
            className="relative mt-[12px] hidden items-center xl:flex"
            data-busy-managed
            onSubmit={(event) => {
              event.preventDefault();
              submitSiteSearch();
            }}
          >
            <input
              type="search"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
              disabled={searchPending}
              className="w-36 rounded-full border border-neutral-300 bg-white py-[7.5px] pl-3 pr-9 text-sm outline-none focus:border-primary disabled:cursor-wait disabled:opacity-70 2xl:w-56"
              aria-label="Search the site"
            />
            {searchPending ? (
              <span className="absolute right-2 text-primary" aria-hidden>
                <LoadingSpinner size="sm" />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute right-2 text-neutral-500 hover:text-neutral-700 ${
                  searchQuery ? "" : "invisible"
                }`}
                aria-label="Clear search"
                tabIndex={searchQuery ? 0 : -1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
          <button
            type="button"
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 xl:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </div>
      {mobileOpen && (
        <div
          className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-y-contain border-t border-neutral-200 bg-white xl:hidden"
          data-mobile-nav
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 pt-6 pb-4">
            <form
              className="relative mb-3"
              data-busy-managed
              onSubmit={(event) => {
                event.preventDefault();
                submitSiteSearch();
              }}
            >
              <label htmlFor="mobile-site-search" className="sr-only">
                Search the site
              </label>
              <input
                id="mobile-site-search"
                type="search"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={searchPending}
                className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary disabled:cursor-wait disabled:opacity-70"
              />
              {searchPending ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" aria-hidden>
                  <LoadingSpinner size="sm" />
                </span>
              ) : null}
            </form>
            <ContactLink
              className="mb-2 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              onClick={() => {
                if (!menusPinned()) setMobileOpen(false);
              }}
            >
              Contact us
            </ContactLink>
            <Link
              href="/"
              className={`block rounded-full px-4 py-2 text-base ${
                pathname === "/" ? "text-[#9f1b20]" : "text-neutral-600"
              }`}
            >
              Home
            </Link>
            {navItems.map((item) =>
              "landingHref" in item ? (
                <div key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-base text-neutral-600"
                    onClick={() => {
                      setMobileExpanded((c) => (c === item.label ? null : item.label));
                      setMobileDeepExpanded(null);
                    }}
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="pl-4" data-nav-menu>
                      {"columns" in item
                        ? item.columns.map((column) => (
                            <div key={column.title} className="mb-1">
                              {"href" in column && column.href ? (
                                <Link
                                  href={column.href}
                                  className={`block px-4 py-2 text-sm font-bold hover:text-[#9f1b20] ${
                                    pathname === column.href ? "text-[#9f1b20]" : "text-neutral-900"
                                  }`}
                                >
                                  {column.title}
                                </Link>
                              ) : (
                                <p className="px-4 py-2 text-sm font-bold text-neutral-900">{column.title}</p>
                              )}
                              <div className="pl-4">
                                {column.links.map((link) => renderMobileNavChild(link, item.label))}
                              </div>
                            </div>
                          ))
                        : "children" in item
                          ? item.children.map((child) => renderMobileNavChild(child, item.label))
                          : null}
                    </div>
                  )}
                </div>
              ) : (
                (() => {
                  const link = item as NavLink;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-full px-4 py-2 text-base ${
                        pathname === link.href ? "text-[#9f1b20]" : "text-neutral-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })()
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
