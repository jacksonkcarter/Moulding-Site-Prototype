"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const BUSY_CLASS = "is-action-loading";
const CURSOR_CLASS = "nav-cursor-loading";

type BusyMode = "inplace" | "cursor";

let activeEl: HTMLElement | null = null;
let activeMode: BusyMode | null = null;

function markInPlace(el: HTMLElement) {
  if (el.hasAttribute("data-busy-managed")) return;
  clearBusy();

  activeEl = el;
  activeMode = "inplace";
  document.documentElement.classList.add("nav-inplace-busy");
  el.setAttribute("aria-busy", "true");
  if (!el.getAttribute("aria-label") && !el.textContent?.trim()) {
    el.setAttribute("aria-label", "Loading");
  }
  el.classList.add(BUSY_CLASS);
}

function markCursor() {
  clearBusy();
  activeMode = "cursor";
  document.documentElement.classList.add(CURSOR_CLASS);
}

function clearBusy() {
  document.documentElement.classList.remove(CURSOR_CLASS);
  document.documentElement.classList.remove("nav-inplace-busy");

  if (activeEl) {
    if (activeMode === "inplace") {
      activeEl.classList.remove(BUSY_CLASS);
      activeEl.removeAttribute("aria-busy");
    }
    activeEl = null;
  }
  activeMode = null;
}

/** Buttons and button-styled controls: spinner replaces label/icon. */
function isButtonLike(el: HTMLElement): boolean {
  if (el instanceof HTMLButtonElement) return true;
  if (el instanceof HTMLInputElement) {
    return el.type === "submit" || el.type === "button" || el.type === "image";
  }
  if (el.getAttribute("role") === "button") return true;
  // Primary CTA / pill links that act as buttons
  if (el instanceof HTMLAnchorElement) {
    const cls = el.className;
    if (/\bbg-primary\b/.test(cls)) return true;
    if (/\bborder-primary\b/.test(cls) && /\bfont-semibold\b/.test(cls)) return true;
  }
  return false;
}

/** Header / mobile nav menu items. */
function isMenuItem(el: HTMLElement): boolean {
  if (!(el instanceof HTMLAnchorElement)) return false;
  if (el.closest("[data-nav-menu]")) return true;
  if (el.closest("[data-mobile-nav]")) return true;
  return false;
}

function ElementNavigationSpinnerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    clearBusy();
  }, [pathname, searchParams]);

  useEffect(() => {
    function isModifiedClick(event: MouseEvent) {
      return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    }

    function onClick(event: MouseEvent) {
      if (isModifiedClick(event)) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (anchor instanceof HTMLAnchorElement) {
        if (anchor.target && anchor.target !== "_self") return;
        if (anchor.hasAttribute("download")) return;
        if (anchor.hasAttribute("data-busy-managed")) return;

        let url: URL;
        try {
          url = new URL(anchor.href, window.location.href);
        } catch {
          return;
        }
        if (url.origin !== window.location.origin) return;
        // Same path+query: no navigation pending (hash-only or no-op).
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }

        if (isButtonLike(anchor) || isMenuItem(anchor)) {
          markInPlace(anchor);
        } else {
          markCursor();
        }
        return;
      }

      const button = target.closest("button, [role='button']");
      if (button instanceof HTMLElement) {
        if (button.hasAttribute("data-busy-managed")) return;
        // Don't spin on disclosure toggles (menus, accordions) unless they submit a form.
        if (button.getAttribute("type") === "button" && !button.closest("form")) return;
      }
    }

    function onSubmit(event: Event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.target && form.target !== "_self") return;
      if (form.hasAttribute("data-busy-managed")) return;

      const submitEvent = event as SubmitEvent;
      const submitter =
        submitEvent.submitter instanceof HTMLElement
          ? submitEvent.submitter
          : form.querySelector("button[type='submit'], button:not([type]), input[type='submit']");

      if (submitter instanceof HTMLElement && !submitter.hasAttribute("data-busy-managed")) {
        markInPlace(submitter);
      }
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      clearBusy();
    };
  }, []);

  return null;
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ElementNavigationSpinnerInner />
    </Suspense>
  );
}
