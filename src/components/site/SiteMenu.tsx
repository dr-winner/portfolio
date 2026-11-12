"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cvDownloadName, site } from "@/content/site";
import { work } from "@/content/work";

const pages = [
  { href: "/", label: "Home", note: "Start here" },
  { href: "/work", label: "Work", note: "Case studies and labs" },
  { href: "/about", label: "About", note: "Background and method" },
  { href: "/security", label: "Security", note: "How this site is built" },
  { href: "/contact", label: "Contact", note: "Email and links" },
] as const;

const social = [
  { href: site.links.github, label: "GitHub", handle: "@dr-winner" },
  { href: site.links.linkedin, label: "LinkedIn", handle: "in/richard-winner-duvor" },
  { href: site.links.x, label: "X", handle: "@dr_winner6" },
] as const;

/**
 * One dialog serves the desktop command palette and the mobile menu. The
 * mobile layout is a full-screen sheet with a labelled Close button and
 * thumb-sized rows. Focus is trapped, Esc closes and body scroll locks.
 */
export function SiteMenu({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);

  const caseStudies = useMemo(
    () =>
      work
        .filter((item) => item.kind === "case-study")
        .map((item) => ({ href: `/work/${item.slug}`, label: item.title, note: item.badges[1] ?? "Case study" })),
    [],
  );

  const q = query.trim().toLowerCase();
  const match = (label: string) => !q || label.toLowerCase().includes(q);
  const shownPages = pages.filter((item) => match(item.label) || match(item.note));
  const shownCases = caseStudies.filter((item) => match(item.label) || match(item.note));
  const shownSocial = social.filter((item) => match(item.label) || match(item.handle));
  const empty = shownPages.length + shownCases.length + shownSocial.length === 0;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab" && shellRef.current) {
        const focusable = Array.from(
          shellRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input"),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && (document.activeElement === first || document.activeElement === shellRef.current)) {
          event.preventDefault();
          last.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => shellRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.clearTimeout(focusTimer);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, [onClose]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const delay = (index: number): CSSProperties => ({ ["--menu-delay" as string]: `${90 + index * 38}ms` });

  return (
    <div
      ref={shellRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="menu-shell fixed inset-0 z-50 overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_93%,transparent)] backdrop-blur-[20px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="fx-gridline absolute inset-0 opacity-40" />
        <div
          className="absolute -right-[10%] -top-[20%] h-[52vh] w-[52vw] rounded-full"
          style={{ background: "radial-gradient(closest-side, var(--glow-signal), transparent 72%)", filter: "blur(40px)" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1080px] flex-col px-[clamp(20px,5vw,52px)] pb-[max(28px,env(safe-area-inset-bottom))] pt-4">
        <div className="flex h-14 items-center justify-between">
          <span className="inline-flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M12 2.6 20 5.9v5.7c0 4.6-3.2 7.8-8 9.8-4.8-2-8-5.2-8-9.8V5.9L12 2.6Z" stroke="var(--signal)" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="m8.6 11.9 2.3 2.4 4.6-4.9" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[15px] font-medium tracking-[-0.02em] text-[var(--fg)]">
              dr<span className="text-[var(--fg-muted)]">Winner</span>
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 min-w-11 items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)] transition-colors hover:border-[var(--signal)] hover:text-[var(--fg)]"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
            Close
          </button>
        </div>

        <div className="mt-6">
          <label htmlFor="menu-filter" className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {copied ? "Email copied" : "Jump to"}
          </label>
          <div className="relative mt-2">
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <circle cx="8.5" cy="8.5" r="5" />
              <path d="m12.4 12.4 4 4" strokeLinecap="round" />
            </svg>
            <input
              id="menu-filter"
              type="text"
              placeholder="Search pages, case studies, links"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-xl border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] pl-11 pr-4 font-mono text-[13px] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg-subtle)] focus:border-[var(--signal)]"
            />
            <span aria-hidden className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--line)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)] sm:block">
              ESC
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <nav aria-label="Pages" className="min-w-0">
            <ul className="border-t border-[var(--line)]">
              {shownPages.map((page, index) => (
                <li key={page.href} className="menu-item" style={delay(index)}>
                  <Link
                    href={page.href}
                    onClick={onClose}
                    className="group flex min-h-[62px] items-center gap-4 border-b border-[var(--line)] py-3 no-underline"
                  >
                    <span className="w-6 shrink-0 font-mono text-[11px] text-[var(--fg-subtle)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[clamp(22px,3.4vw,32px)] font-medium leading-tight tracking-[-0.02em] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                        {page.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-subtle)]">{page.note}</span>
                    </span>
                    <span aria-hidden className="arrow-shift ml-auto shrink-0 font-mono text-[13px] text-[var(--fg-subtle)] transition-colors group-hover:text-[var(--signal)]">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            {shownCases.length > 0 ? (
              <div className="menu-item" style={delay(shownPages.length + 1)}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">Case studies</p>
                <ul className="mt-3 flex flex-col">
                  {shownCases.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group flex min-h-[44px] items-center gap-3 border-b border-[var(--line)] py-2.5 no-underline"
                      >
                        <span className="min-w-0 truncate text-[13.5px] text-[var(--fg-muted)] transition-colors group-hover:text-[var(--fg)]">
                          {item.label}
                        </span>
                        <span aria-hidden className="ml-auto text-[var(--fg-subtle)] transition-colors group-hover:text-[var(--signal)]">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {shownSocial.length > 0 ? (
              <div className="menu-item mt-8" style={delay(shownPages.length + 2)}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">Elsewhere</p>
                <ul className="mt-3 flex flex-col">
                  {shownSocial.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-h-[44px] items-center justify-between gap-4 border-b border-[var(--line)] py-2.5 no-underline"
                      >
                        <span className="text-[13.5px] text-[var(--fg-muted)] transition-colors group-hover:text-[var(--fg)]">{item.label}</span>
                        <span className="font-mono text-[11px] text-[var(--fg-subtle)]">{item.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="menu-item mt-8 flex flex-wrap gap-2.5" style={delay(shownPages.length + 3)}>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fg-muted)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
              >
                <span aria-hidden className={copied ? "text-[var(--signal)]" : ""}>{copied ? "✓" : "⧉"}</span>
                <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
              </button>
              <a
                href="/cv.pdf"
                download={cvDownloadName}
                onClick={onClose}
                className="inline-flex h-11 items-center rounded-full border border-[var(--line-strong)] px-4 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fg)] no-underline transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
              >
                Download CV
              </a>
            </div>

            {empty ? <p className="mt-8 text-[var(--fg-subtle)]">No matches. Try a shorter word.</p> : null}
          </div>
        </div>

        <p className="mt-auto pt-10 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
          {site.location} <span aria-hidden>·</span> GMT
        </p>
      </div>
    </div>
  );
}
