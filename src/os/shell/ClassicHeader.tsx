/* Classic view header, brief 7.1: a plain document header with real links,
   rendered as static HTML and functional without JavaScript. */

import Link from "next/link";
import { cvHref, cvDownloadName } from "@/content/site";
import { classicHref } from "../href";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function ClassicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-[clamp(24px,4vw,40px)]">
        <Link href="/" aria-label="drWinner, home" className="mr-auto flex items-baseline gap-2.5 no-underline">
          <span className="text-[17px] font-medium tracking-[-0.02em] text-[var(--fg)]">
            dr<span className="text-[var(--fg-muted)]">Winner</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 md:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={classicHref(link.href)}
              className="text-[length:var(--step-0)] text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={cvHref}
            download={cvDownloadName}
            className="hidden h-10 items-center rounded-[8px] border border-[var(--line-strong)] bg-[var(--surface)] px-4 font-mono text-[12px] font-medium tracking-[0.06em] text-[var(--fg)] no-underline hover:border-[var(--signal)] hover:text-[var(--signal)] sm:inline-flex"
          >
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
