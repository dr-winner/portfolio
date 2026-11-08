"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cvHref, site } from "@/content/site";
import { Magnetic } from "@/components/site/Magnetic";
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
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [bar, setBar] = useState({ left: 0, width: 0 });

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

  useEffect(() => {
    const nav = navRef.current;
    const active = links.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));
    const el = active ? linkRefs.current[active.href] : null;
    if (!nav || !el) {
      setBar({ left: 0, width: 0 });
      return;
    }
    const navBox = nav.getBoundingClientRect();
    const linkBox = el.getBoundingClientRect();
    setBar({ left: linkBox.left - navBox.left, width: linkBox.width });
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 h-14 border-b border-transparent md:h-16 ${
        scrolled ? "border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-[12px] backdrop-saturate-[140%]" : ""
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center gap-2 px-[clamp(20px,5vw,64px)] md:gap-4">
        <Link href="/" aria-label={`${site.name}, home`} className="mr-auto flex min-w-0 items-baseline gap-3 no-underline">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--signal)]">RWD</span>
          <span className="hidden whitespace-nowrap text-[length:var(--step-0)] text-[var(--fg)] md:inline">{site.name}</span>
        </Link>
        <nav ref={navRef} aria-label="Primary" className="relative hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(node) => {
                  linkRefs.current[link.href] = node;
                }}
                aria-current={active ? "page" : undefined}
                className={`relative text-[length:var(--step-0)] no-underline ${active ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <span
            aria-hidden
            className="nav-indicator"
            style={{ width: bar.width, transform: `translateX(${bar.left}px)`, opacity: bar.width ? 1 : 0 }}
          />
        </nav>
        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-[6px] border border-[var(--line)] px-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg)]"
          onClick={() => {
            if (menuLabel === "Menu") setOpen(true);
            else window.dispatchEvent(new Event("open-command"));
          }}
        >
          {menuLabel}
        </button>
        <ThemeToggle />
        <Magnetic className="hidden md:inline-flex">
          <Link
            href={cvHref}
            className="inline-flex h-11 items-center rounded-[6px] bg-[var(--signal)] px-5 text-[length:var(--step-0)] font-medium text-[var(--on-signal)] no-underline"
          >
            Download CV
          </Link>
        </Magnetic>
      </div>
      {open ? <SiteMenu onClose={() => setOpen(false)} /> : null}
    </header>
  );
}
