"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cvDownloadName, cvHref, mailto, site } from "@/content/site";

const primary = [
  { href: "/work", label: "Work", index: "01" },
  { href: "/about", label: "About", index: "02" },
  { href: "/contact", label: "Contact", index: "03" },
];

const secondary = [
  { href: mailto, label: "Email me" },
  { href: site.links.github, label: "GitHub" },
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.x, label: "X" },
];

export function SiteMenu({ onClose }: { onClose: () => void }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const enter = (delay: number) => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`,
  });

  return (
    <div className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-[16px]" role="dialog" aria-modal="true" aria-label="Menu">
      {/* Grid backdrop */}
      <div aria-hidden className="absolute inset-0 fx-dots opacity-40" />
      <div className="relative mx-auto flex min-h-full w-full max-w-[720px] flex-col px-[clamp(20px,5vw,64px)] py-8 md:justify-center">
        <div {...enter(0)}>
          <button
            type="button"
            className="mb-10 self-end font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            onClick={onClose}
          >
            [ ESC ] CLOSE
          </button>
        </div>
        <nav aria-label="Menu">
          <ul className="flex flex-col">
            {primary.map((link, i) => (
              <li key={link.href} {...enter(80 + i * 70)}>
                <Link
                  href={link.href}
                  className="group flex items-baseline gap-4 border-b border-[var(--line)] py-4 no-underline"
                  onClick={onClose}
                >
                  <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{link.index}</span>
                  <span className="text-[length:var(--step-4)] font-medium leading-[var(--leading-tight)] text-[var(--fg)] transition-colors group-hover:text-[var(--signal)]">
                    {link.label}
                  </span>
                  <span aria-hidden className="arrow-shift ml-auto font-mono text-[var(--signal)]">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          {secondary.map((link, i) => (
            <li key={link.label} {...enter(300 + i * 50)}>
              <a
                href={link.href}
                className="link-sweep font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]"
                onClick={onClose}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li {...enter(460)}>
            <Link
              href={cvHref}
              download={cvDownloadName}
              className="link-sweep font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)] no-underline"
              onClick={onClose}
            >
              Download CV
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
