"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cvDownloadName, cvHref, site } from "@/content/site";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    setMenuLabel(touch ? "Menu" : mac ? "⌘K" : "Ctrl K");
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 h-14 border-b border-transparent md:h-16 ${
        scrolled ? "border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-[12px] backdrop-saturate-[140%]" : ""
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center gap-4 px-[clamp(20px,5vw,64px)]">
        <Link href="/" aria-label={`${site.name}, home`} className="mr-auto flex items-baseline gap-3 no-underline">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--signal)]">RWD</span>
          <span className="hidden text-[length:var(--step-0)] text-[var(--fg)] sm:inline">{site.name}</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-[length:var(--step-0)] no-underline ${
                  active ? "text-[var(--fg)] underline decoration-[var(--signal)] decoration-2 underline-offset-8" : "text-[var(--fg-muted)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-[6px] border border-[var(--line)] px-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg)]"
          onClick={() => setOpen(true)}
        >
          {menuLabel}
        </button>
        <ThemeToggle />
        <Link
          href={cvHref}
          download={cvDownloadName}
          className="hidden h-11 items-center rounded-[6px] bg-[var(--signal)] px-5 text-[length:var(--step-0)] font-medium text-[var(--on-signal)] no-underline md:inline-flex"
        >
          Download CV
        </Link>
      </div>
      {open ? <SiteMenu onClose={() => setOpen(false)} /> : null}
    </header>
  );
}
