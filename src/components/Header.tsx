"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { STOCK_ITEM_SECTIONS } from "@/data/stock-items";
import { PROFILE_MOULDING_TYPES } from "@/data/profile-moulding-types";
import { navItems } from "@/lib/nav";
import { ContactLink } from "@/components/ContactLink";

const PROFILE_NAV_MOULDING_OPTIONS = [...PROFILE_MOULDING_TYPES];

const ORDERING_PRODUCT_PROFILE_LINKS = [
  { label: "Browse stock items", href: "/product-info/browse-stock-items" },
  { label: "Browse select profiles", href: "/product-info/browse-select-profiles" },
  { label: "Replicate custom profiles", href: "/product-info/replicate-custom-profiles" },
  { label: "Accessories", href: "/product-info/accessories" },
  { label: "Tight radii & bullnose corners", href: "/product-info/tight-radii-bullnose-corners" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [stockItemsSubmenuOpen, setStockItemsSubmenuOpen] = useState(false);
  const stockItemsSubmenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profilesSubmenuOpen, setProfilesSubmenuOpen] = useState(false);
  const profilesSubmenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [productsAndProfilesOpen, setProductsAndProfilesOpen] = useState(false);
  const productsAndProfilesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileNestedExpanded, setMobileNestedExpanded] = useState<string | null>(null);
  const [mobileDeepExpanded, setMobileDeepExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  function submitSiteSearch() {
    const q = searchQuery.trim();
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm print:hidden">
      {/* Top ribbon: order status */}
      <div className="w-full border-b border-neutral-200 bg-neutral-100">
        <div className="flex h-10 w-full items-center justify-end gap-6 px-4 sm:px-6">
          <Link href="/order-status" className="text-sm text-neutral-600 hover:text-primary">
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
        <div className="absolute inset-x-0 top-0 z-10 flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="mt-[3px] flex min-w-0 items-center gap-2 md:gap-3">
          <Image
            src="/logos/flex-trim.svg"
            alt="Flex Trim™"
            width={120}
            height={40}
            className="h-6 w-auto md:h-9"
          />
          <span className="text-neutral-300">|</span>
          <Image
            src="/logos/carter-millwork.svg"
            alt="Carter Millwork"
            width={160}
            height={40}
            className="h-6 w-auto md:h-9"
          />
        </Link>
        <nav className="hidden flex-1 items-center justify-evenly md:flex">
          <Link
            href="/"
            className={`rounded-full px-3 py-2 text-base ${
              pathname === "/"
                ? "text-[#9f1b20]"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-[#9f1b20]"
            }`}
          >
            Home
          </Link>
          {navItems.map((item) =>
            "href" in item ? (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-base ${
                  pathname === item.href
                    ? "text-[#9f1b20]"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-[#9f1b20]"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={"landingHref" in item ? item.landingHref : "#"}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-base ${
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
                  <div className={`absolute left-0 top-full z-[100] pt-1 ${item.label === "Installation" ? "w-[240px]" : "w-[220px]"}`}>
                    <div className="rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
                      {item.label === "Installation" ? (
                        <>
                          {(() => {
                            const overview = item.children.find((c) => c.label === "Overview");
                            const rest = item.children.filter((c) => c.label !== "Overview");
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
                                    onClick={() => setOpenDropdown(null)}
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
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            );
                          })()}
                        </>
                      ) : (
                      item.children.map((child) =>
                        child.label === "Products and profiles" ? (
                          <div
                            key={`${item.label}-${child.label}`}
                            className="relative"
                            onMouseEnter={() => {
                              if (productsAndProfilesCloseTimer.current) {
                                clearTimeout(productsAndProfilesCloseTimer.current);
                                productsAndProfilesCloseTimer.current = null;
                              }
                              setStockItemsSubmenuOpen(false);
                              setProfilesSubmenuOpen(false);
                              setProductsAndProfilesOpen(true);
                            }}
                            onMouseLeave={() => {
                              productsAndProfilesCloseTimer.current = setTimeout(() => {
                                setProductsAndProfilesOpen(false);
                                setStockItemsSubmenuOpen(false);
                                setProfilesSubmenuOpen(false);
                              }, 150);
                            }}
                          >
                            <Link
                              href={child.href}
                              className={`flex items-center justify-between px-4 py-2 text-sm ${
                                ORDERING_PRODUCT_PROFILE_LINKS.some((l) => pathname === l.href)
                                  ? "bg-red-50 font-medium text-[#9f1b20]"
                                  : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                              <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                            {productsAndProfilesOpen && (
                              <div
                                className="absolute left-full -top-2 z-[101] min-w-[220px] -ml-px pt-1"
                                onMouseEnter={() => {
                                  if (productsAndProfilesCloseTimer.current) {
                                    clearTimeout(productsAndProfilesCloseTimer.current);
                                    productsAndProfilesCloseTimer.current = null;
                                  }
                                  setProductsAndProfilesOpen(true);
                                }}
                                onMouseLeave={() => {
                                  productsAndProfilesCloseTimer.current = setTimeout(() => {
                                    setProductsAndProfilesOpen(false);
                                    setStockItemsSubmenuOpen(false);
                                    setProfilesSubmenuOpen(false);
                                  }, 150);
                                }}
                              >
                                <div className="rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white py-1 shadow-lg">
                                  {ORDERING_PRODUCT_PROFILE_LINKS.map((link) =>
                                    link.label === "Browse stock items" ? (
                                      <div
                                        key={link.label}
                                        className="relative"
                                        onMouseEnter={() => {
                                          if (stockItemsSubmenuCloseTimer.current) {
                                            clearTimeout(stockItemsSubmenuCloseTimer.current);
                                            stockItemsSubmenuCloseTimer.current = null;
                                          }
                                          setProfilesSubmenuOpen(false);
                                          setStockItemsSubmenuOpen(true);
                                        }}
                                        onMouseLeave={() => {
                                          stockItemsSubmenuCloseTimer.current = setTimeout(
                                            () => setStockItemsSubmenuOpen(false),
                                            150
                                          );
                                        }}
                                      >
                                        <Link
                                          href={link.href}
                                          className={`flex items-center justify-between px-4 py-2 text-sm ${
                                            pathname === link.href
                                              ? "bg-red-50 font-medium text-[#9f1b20]"
                                              : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                          }`}
                                          onClick={() => setOpenDropdown(null)}
                                        >
                                          {link.label}
                                          <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </Link>
                                        {stockItemsSubmenuOpen && (
                                          <div
                                            className="absolute left-full -top-2 z-[102] min-w-[200px] -ml-px pt-1"
                                            onMouseEnter={() => {
                                              if (stockItemsSubmenuCloseTimer.current) {
                                                clearTimeout(stockItemsSubmenuCloseTimer.current);
                                                stockItemsSubmenuCloseTimer.current = null;
                                              }
                                              setStockItemsSubmenuOpen(true);
                                            }}
                                            onMouseLeave={() => {
                                              stockItemsSubmenuCloseTimer.current = setTimeout(
                                                () => setStockItemsSubmenuOpen(false),
                                                150
                                              );
                                            }}
                                          >
                                            <div className="rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white py-1 shadow-lg">
                                              <Link
                                                href="/product-info/browse-stock-items"
                                                className="mx-2 mt-1 mb-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                                                onClick={() => {
                                                  setOpenDropdown(null);
                                                  setStockItemsSubmenuOpen(false);
                                                  setProductsAndProfilesOpen(false);
                                                }}
                                              >
                                                See all categories
                                              </Link>
                                              <div className="border-t border-neutral-100 pt-1">
                                                {STOCK_ITEM_SECTIONS.map((section) => (
                                                  <Link
                                                    key={section.id}
                                                    href={`/product-info/stock-items#${section.id}`}
                                                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                                    onClick={() => {
                                                      setOpenDropdown(null);
                                                      setStockItemsSubmenuOpen(false);
                                                      setProductsAndProfilesOpen(false);
                                                    }}
                                                  >
                                                    {section.label}
                                                  </Link>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : link.label === "Browse select profiles" ? (
                                      <div
                                        key={link.label}
                                        className="relative"
                                        onMouseEnter={() => {
                                          if (profilesSubmenuCloseTimer.current) {
                                            clearTimeout(profilesSubmenuCloseTimer.current);
                                            profilesSubmenuCloseTimer.current = null;
                                          }
                                          setStockItemsSubmenuOpen(false);
                                          setProfilesSubmenuOpen(true);
                                        }}
                                        onMouseLeave={() => {
                                          profilesSubmenuCloseTimer.current = setTimeout(
                                            () => setProfilesSubmenuOpen(false),
                                            150
                                          );
                                        }}
                                      >
                                        <Link
                                          href={link.href}
                                          className={`flex items-center justify-between px-4 py-2 text-sm ${
                                            pathname === link.href
                                              ? "bg-red-50 font-medium text-[#9f1b20]"
                                              : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                          }`}
                                          onClick={() => setOpenDropdown(null)}
                                        >
                                          {link.label}
                                          <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </Link>
                                        {profilesSubmenuOpen && (
                                          <div
                                            className="absolute left-full -top-2 z-[102] w-max max-w-[calc(100vw-3rem)] -ml-px pt-1"
                                            onMouseEnter={() => {
                                              if (profilesSubmenuCloseTimer.current) {
                                                clearTimeout(profilesSubmenuCloseTimer.current);
                                                profilesSubmenuCloseTimer.current = null;
                                              }
                                              setProfilesSubmenuOpen(true);
                                            }}
                                            onMouseLeave={() => {
                                              profilesSubmenuCloseTimer.current = setTimeout(
                                                () => setProfilesSubmenuOpen(false),
                                                150
                                              );
                                            }}
                                          >
                                            <div className="overflow-hidden rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white shadow-lg">
                                              <Link
                                                href="/product-info/browse-select-profiles"
                                                className="mx-2 mt-1 mb-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                                                onClick={() => {
                                                  setOpenDropdown(null);
                                                  setProfilesSubmenuOpen(false);
                                                  setProductsAndProfilesOpen(false);
                                                }}
                                              >
                                                See all categories
                                              </Link>
                                              <div className="grid grid-cols-3 gap-x-1 gap-y-0 border-t border-neutral-100 px-2 py-1.5">
                                                {PROFILE_NAV_MOULDING_OPTIONS.map((type) => (
                                                  <Link
                                                    key={type}
                                                    href={`/product-info/profile-search?types=${encodeURIComponent(type)}`}
                                                    className="block whitespace-nowrap rounded px-1.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                                    onClick={() => {
                                                      setOpenDropdown(null);
                                                      setProfilesSubmenuOpen(false);
                                                      setProductsAndProfilesOpen(false);
                                                    }}
                                                  >
                                                    {type}
                                                  </Link>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`block px-4 py-2 text-sm ${
                                          pathname === link.href
                                            ? "bg-red-50 font-medium text-[#9f1b20]"
                                            : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                        }`}
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        {link.label}
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : child.label === "Browse stock items" ? (
                          <div
                            key={`${item.label}-${child.label}`}
                            className="relative"
                            onMouseEnter={() => {
                              if (stockItemsSubmenuCloseTimer.current) {
                                clearTimeout(stockItemsSubmenuCloseTimer.current);
                                stockItemsSubmenuCloseTimer.current = null;
                              }
                              setProfilesSubmenuOpen(false);
                              setProductsAndProfilesOpen(false);
                              setStockItemsSubmenuOpen(true);
                            }}
                            onMouseLeave={() => {
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
                              onClick={() => setOpenDropdown(null)}
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
                                  stockItemsSubmenuCloseTimer.current = setTimeout(() => setStockItemsSubmenuOpen(false), 150);
                                }}
                              >
                                <div className="rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white py-1 shadow-lg">
                                  <Link
                                    href="/product-info/browse-stock-items"
                                    className="mx-2 mt-1 mb-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setStockItemsSubmenuOpen(false);
                                    }}
                                  >
                                    See all categories
                                  </Link>
                                  <div className="border-t border-neutral-100 pt-1">
                                    {STOCK_ITEM_SECTIONS.map((section) => (
                                    <Link
                                      key={section.id}
                                      href={`/product-info/stock-items#${section.id}`}
                                      className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                      onClick={() => {
                                        setOpenDropdown(null);
                                        setStockItemsSubmenuOpen(false);
                                      }}
                                    >
                                      {section.label}
                                    </Link>
                                  ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : child.label === "Browse select profiles" ? (
                          <div
                            key={`${item.label}-${child.label}`}
                            className="relative"
                            onMouseEnter={() => {
                              if (profilesSubmenuCloseTimer.current) {
                                clearTimeout(profilesSubmenuCloseTimer.current);
                                profilesSubmenuCloseTimer.current = null;
                              }
                              setStockItemsSubmenuOpen(false);
                              setProductsAndProfilesOpen(false);
                              setProfilesSubmenuOpen(true);
                            }}
                            onMouseLeave={() => {
                              profilesSubmenuCloseTimer.current = setTimeout(() => setProfilesSubmenuOpen(false), 150);
                            }}
                          >
                            <Link
                              href={child.href}
                              className={`flex items-center justify-between px-4 py-2 text-sm ${
                                pathname === child.href
                                  ? "bg-red-50 font-medium text-[#9f1b20]"
                                  : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                              }`}
                              onClick={() => setOpenDropdown(null)}
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
                                  profilesSubmenuCloseTimer.current = setTimeout(() => setProfilesSubmenuOpen(false), 150);
                                }}
                              >
                                <div className="overflow-hidden rounded-r-md rounded-bl-md border border-neutral-200 border-l-0 bg-white shadow-lg">
                                  <Link
                                    href="/product-info/browse-select-profiles"
                                    className="mx-2 mt-1 mb-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#8a171b]"
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setProfilesSubmenuOpen(false);
                                    }}
                                  >
                                    See all categories
                                  </Link>
                                  <div className="grid grid-cols-3 gap-x-1 gap-y-0 border-t border-neutral-100 px-2 py-1.5">
                                    {PROFILE_NAV_MOULDING_OPTIONS.map((type) => (
                                      <Link
                                        key={type}
                                        href={`/product-info/profile-search?types=${encodeURIComponent(type)}`}
                                        className="block whitespace-nowrap rounded px-1.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                                        onClick={() => {
                                          setOpenDropdown(null);
                                          setProfilesSubmenuOpen(false);
                                        }}
                                      >
                                        {type}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                            <Link
                              key={`${item.label}-${child.label}`}
                              href={child.href}
                              className={`block px-4 py-2 text-sm ${
                                pathname === child.href
                                  ? "bg-red-50 font-medium text-[#9f1b20]"
                                  : "text-neutral-600 hover:bg-neutral-50 hover:text-[#9f1b20]"
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          )
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ContactLink className="mt-[12px] hidden items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover md:inline-flex">
            Contact us
          </ContactLink>
          <form
            className="relative mt-[12px] hidden items-center md:flex"
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
              className="w-48 rounded-full border border-neutral-300 bg-white py-[7.5px] pl-3 pr-9 text-sm outline-none focus:border-primary sm:w-56"
              aria-label="Search the site"
            />
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
          </form>
          <button
            type="button"
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
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
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <form
              className="mb-3"
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
                className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </form>
            <ContactLink
              className="mb-2 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              onClick={() => setMobileOpen(false)}
            >
              Contact us
            </ContactLink>
            <Link
              href="/"
              className={`block rounded-full px-4 py-2 text-base ${
                pathname === "/" ? "text-[#9f1b20]" : "text-neutral-600"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            {navItems.map((item) =>
              "href" in item ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-full px-4 py-2 text-base ${
                    pathname === item.href ? "text-[#9f1b20]" : "text-neutral-600"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-base text-neutral-600"
                    onClick={() => {
                      setMobileExpanded((c) => (c === item.label ? null : item.label));
                      setMobileNestedExpanded(null);
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
                    <div className="pl-4">
                      {item.children.map((child) =>
                        child.label === "Products and profiles" ? (
                          <div key={`${item.label}-${child.label}`}>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
                              onClick={() =>
                                setMobileNestedExpanded((c) => {
                                  const next = c === "Products and profiles" ? null : "Products and profiles";
                                  if (next !== "Products and profiles") setMobileDeepExpanded(null);
                                  return next;
                                })
                              }
                            >
                              {child.label}
                              <svg
                                className={`h-4 w-4 transition-transform ${
                                  mobileNestedExpanded === "Products and profiles" ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {mobileNestedExpanded === "Products and profiles" && (
                              <div className="pl-4">
                                {ORDERING_PRODUCT_PROFILE_LINKS.map((link) =>
                                  link.label === "Browse stock items" ? (
                                    <div key={link.label}>
                                      <button
                                        type="button"
                                        className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
                                        onClick={() =>
                                          setMobileDeepExpanded((c) =>
                                            c === "Browse stock items" ? null : "Browse stock items"
                                          )
                                        }
                                      >
                                        {link.label}
                                        <svg
                                          className={`h-4 w-4 transition-transform ${
                                            mobileDeepExpanded === "Browse stock items" ? "rotate-180" : ""
                                          }`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>
                                      {mobileDeepExpanded === "Browse stock items" && (
                                        <div className="pl-4">
                                          <Link
                                            href="/product-info/browse-stock-items"
                                            className="block rounded-full px-4 py-2 text-sm font-medium text-[#9f1b20]"
                                            onClick={() => setMobileOpen(false)}
                                          >
                                            See all categories
                                          </Link>
                                          {STOCK_ITEM_SECTIONS.map((section) => (
                                            <Link
                                              key={section.id}
                                              href={`/product-info/stock-items#${section.id}`}
                                              className="block rounded-full px-4 py-2 text-sm text-neutral-600"
                                              onClick={() => setMobileOpen(false)}
                                            >
                                              {section.label}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : link.label === "Browse select profiles" ? (
                                    <div key={link.label}>
                                      <button
                                        type="button"
                                        className="flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm text-neutral-600"
                                        onClick={() =>
                                          setMobileDeepExpanded((c) =>
                                            c === "Browse select profiles" ? null : "Browse select profiles"
                                          )
                                        }
                                      >
                                        {link.label}
                                        <svg
                                          className={`h-4 w-4 transition-transform ${
                                            mobileDeepExpanded === "Browse select profiles" ? "rotate-180" : ""
                                          }`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>
                                      {mobileDeepExpanded === "Browse select profiles" && (
                                        <div className="pl-4">
                                          <Link
                                            href="/product-info/browse-select-profiles"
                                            className="block rounded-full px-4 py-2 text-sm font-medium text-[#9f1b20]"
                                            onClick={() => setMobileOpen(false)}
                                          >
                                            See all categories
                                          </Link>
                                          {PROFILE_NAV_MOULDING_OPTIONS.map((type) => (
                                            <Link
                                              key={type}
                                              href={`/product-info/profile-search?types=${encodeURIComponent(type)}`}
                                              className="block rounded-full px-4 py-2 text-sm text-neutral-600"
                                              onClick={() => setMobileOpen(false)}
                                            >
                                              {type}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <Link
                                      key={link.label}
                                      href={link.href}
                                      className={`block rounded-full px-4 py-2 text-sm ${
                                        pathname === link.href ? "font-medium text-[#9f1b20]" : "text-neutral-600"
                                      }`}
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      {link.label}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            key={`${item.label}-${child.label}`}
                            href={child.href}
                            className={`block rounded-full px-4 py-2 text-sm ${
                              pathname === child.href ? "font-medium text-[#9f1b20]" : "text-neutral-600"
                            }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
