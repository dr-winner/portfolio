"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cvDownloadName, cvHref } from "@/content/site";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { SiteMenu } from "@/components/site/SiteMenu";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
];

function ShieldMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 2.6 20 5.9v5.7c0 4.6-3.2 7.8-8 9.8-4.8-2-8-5.2-8-9.8V5.9L12 2.6Z"
        stroke="var(--signal)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m8.6 11.9 2.3 2.4 4.6-4.9" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      const bar = progressRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${p})`;
        bar.style.visibility = p > 0 ? "visible" : "hidden";
      }
    };
    onScroll();
    let raf = 0;
    const throttled = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        onScroll();
        raf = 0;
      });
    };
    window.addEventListener("scroll", throttled, { passive: true });
    window.addEventListener("resize", throttled);
    return () => {
      window.removeEventListener("scroll", throttled);
      window.removeEventListener("resize", throttled);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 h-[68px]">
      <div
        aria-hidden
        className={`absolute inset-0 border-b backdrop-blur-[14px] backdrop-saturate-[150%] transition-colors duration-[var(--dur-2)] ${
          scrolled
            ? "border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_76%,transparent)]"
            : "border-transparent bg-transparent"
        }`}
      />
      <span
        ref={progressRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--signal)] via-[var(--signal)] to-transparent opacity-70"
      />

      <div className="shell relative flex h-full items-center gap-3">
        <Link
          href="/"
          aria-label="drWinnerAppSec home"
          className="group -ml-1 inline-flex h-11 items-center gap-2.5 rounded-lg px-1 no-underline"
        >
          <ShieldMark />
          <span className="text-[16px] font-medium tracking-[-0.02em] text-[var(--fg)]">
            dr<span className="text-[var(--fg-muted)]">Winner</span>
          </span>
          <span aria-hidden className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-subtle)] sm:inline">
            appsec
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex h-11 items-center rounded-lg px-3 text-[13.5px] no-underline transition-colors duration-[var(--dur-1)] ${
                  active ? "text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {active ? (
                  <span aria-hidden className="absolute bottom-[9px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--signal)]" />
                ) : null}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("palette:open"))}
            className="menu-trigger-fine h-11 items-center gap-2 rounded-lg border border-[var(--line)] px-3 font-mono text-[11px] tracking-[0.12em] text-[var(--fg-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
            aria-label="Open command palette"
          >
            <span aria-hidden>⌘</span>K
          </button>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="menu-trigger-btn h-11 items-center gap-2 rounded-lg border border-[var(--line)] px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M2.5 5h11M2.5 11h11" />
            </svg>
            Menu
          </button>
          <ThemeToggle />
          <a
            href={cvHref}
            download={cvDownloadName}
            className="hidden h-11 items-center rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--fg)] no-underline transition-colors duration-[var(--dur-1)] hover:border-[var(--signal)] hover:text-[var(--signal)] lg:inline-flex"
          >
            CV
          </a>
        </div>
      </div>

      {open ? <SiteMenu onClose={() => setOpen(false)} /> : null}
    </header>
  );
}
