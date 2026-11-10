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
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuLabel, setMenuLabel] = useState("Menu");
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0.002, Math.min(1, window.scrollY / max)) : 0;
      const bar = progressRef.current;
      if (bar) bar.style.transform = `scaleX(${p})`;
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
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    setMenuLabel(touch ? "MENU" : mac ? "⌘K" : "CTRL·K");
    return () => {
      window.removeEventListener("scroll", throttled);
      window.removeEventListener("resize", throttled);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Sliding active indicator: one underline element whose position and
     width animate to the measured active link (the hand-rolled equivalent
     of a layoutId indicator, no animation dependency). */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let active: HTMLElement | null = null;
    active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) {
      setIndicator(null);
      return;
    }
    const update = () => {
      const navBox = nav.getBoundingClientRect();
      const box = active?.getBoundingClientRect();
      if (box) setIndicator({ left: box.left - navBox.left, width: box.width });
    };
    update();
    const timer = window.setTimeout(update, 80);
    document.fonts?.ready.then(update).catch(() => {});
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-transparent transition-colors duration-[var(--dur-2)]">
      <div
        aria-hidden
        className={`absolute inset-0 transition-[background-color,backdrop-filter] duration-[var(--dur-2)] ${
          scrolled
            ? "bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-[12px] backdrop-saturate-[140%]"
            : "bg-transparent"
        }`}
      />
      {/* Read progress hairline — driven by rAF-throttled scroll updates */}
      <span
        ref={progressRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--signal)] to-transparent opacity-60"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-center gap-3 px-[clamp(24px,4vw,40px)]">
        <Link href="/" aria-label="drWinner, home" className="group mr-auto flex items-baseline gap-2.5 no-underline">
          <span className="relative text-[17px] font-medium tracking-[-0.02em] text-[var(--fg)]">
            dr<span className="text-[var(--fg-muted)]">Winner</span>
            <span
              aria-hidden
              className="absolute -left-3 top-1/2 h-3 w-px -translate-y-1/2 bg-[var(--line-strong)] transition-colors duration-[var(--dur-1)] group-hover:bg-[var(--signal)]"
            />
          </span>
        </Link>
        <nav aria-label="Primary" className="relative hidden items-center gap-7 md:flex" ref={navRef}>
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`link-sweep text-[length:var(--step-0)] no-underline transition-colors ${
                  active ? "is-active text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {indicator ? (
            <span
              aria-hidden
              className="pointer-events-none absolute h-[2px] bg-[var(--signal)] transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: indicator.left, width: indicator.width, bottom: -12 }}
            />
          ) : null}
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="menu-trigger-btn inline-flex h-10 items-center rounded-[6px] border border-[var(--line)] px-3 font-mono text-[12px] tracking-[0.14em] text-[var(--fg-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
        >
          {menuLabel === "⌘K" || menuLabel === "CTRL·K" ? "MENU" : "Menu"}
        </button>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("palette:toggle"))}
          className="menu-trigger-fine h-10 items-center rounded-[6px] border border-[var(--line)] px-3 font-mono text-[12px] tracking-[0.14em] text-[var(--fg-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
        >
          ⌘K
        </button>
        <ThemeToggle />
        <a
          href={cvHref}
          download={cvDownloadName}
          className="hidden h-10 items-center rounded-[8px] border border-[var(--line-strong)] bg-[var(--surface)] px-4 font-mono text-[12px] font-medium tracking-[0.06em] text-[var(--fg)] no-underline transition-colors duration-[var(--dur-1)] hover:border-[var(--signal)] hover:text-[var(--signal)] lg:inline-flex"
        >
          CV
        </a>
      </div>
      {open ? <SiteMenu onClose={() => setOpen(false)} /> : null}
    </header>
  );
}
