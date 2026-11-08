"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cvHref, mailto, site } from "@/content/site";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: cvHref, label: "Download CV", download: true },
  { href: mailto, label: "Email me" },
  { href: site.links.github, label: "GitHub" },
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.x, label: "X" },
];

export function SiteMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg)] md:bg-[color-mix(in_srgb,var(--bg)_72%,transparent)]" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col px-[clamp(20px,5vw,64px)] py-8 md:justify-center">
        <button type="button" className="mb-8 self-end font-mono text-[12px] uppercase tracking-[0.12em]" onClick={onClose}>
          Close
        </button>
        <ul className="flex flex-col gap-4">
          {links.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("http") || link.href.startsWith("mailto:") ? (
                <a href={link.href} className="text-[length:var(--step-4)] text-[var(--fg)] no-underline" onClick={onClose}>
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-[length:var(--step-4)] text-[var(--fg)] no-underline"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
