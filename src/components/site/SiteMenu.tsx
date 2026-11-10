"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cvDownloadName, site } from "@/content/site";
import { work } from "@/content/work";

const pages = [
  { href: "/", label: "Home", tone: "internal" },
  { href: "/work", label: "Work", tone: "internal" },
  { href: "/about", label: "About", tone: "internal" },
  { href: "/contact", label: "Contact", tone: "internal" },
  { href: "/security", label: "Security", tone: "internal" },
] as const;

const social = [
  { href: site.links.github, label: "GitHub", tone: "external" },
  { href: site.links.linkedin, label: "LinkedIn", tone: "external" },
  { href: site.links.x, label: "X", tone: "external" },
] as const;

/**
 * Full-height mobile sheet and desktop command palette in one (section 5.8).
 * A query input filters pages and case studies; the email copy and CV open
 * as actions. Focus is trapped in the dialog, Esc or Cmd K closes, and body
 * scroll locks while it is open.
 */
export function SiteMenu({ onClose }: { onClose: () => void }) {
  const [entered, setEntered] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);

  const caseStudies = useMemo(
    () =>
      work
        .filter((item) => item.kind === "case-study")
        .map((item) => ({ href: `/work/${item.slug}`, label: item.title, tone: "internal" as const })),
    [],
  );

  const everything = useMemo(() => [...pages, ...caseStudies, ...social], [caseStudies]) as Array<{ href: string; label: string; tone: "internal" | "external" }>;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return everything;
    return everything.filter((item) => item.label.toLowerCase().includes(q));
  }, [everything, query]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
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
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      const input = document.getElementById("menu-filter");
      if (input instanceof HTMLElement) input.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, [onClose]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const enter = (delay: number): { style: CSSProperties; className: string } => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`,
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-[16px]"
      role="dialog"
      aria-modal="true"
      aria-label="Menu and quick actions"
      ref={shellRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative mx-auto flex min-h-full w-full max-w-[720px] flex-col px-[clamp(20px,5vw,64px)] py-8 md:justify-center">
        <div {...enter(0)} className="flex items-center justify-between">
          <label htmlFor="menu-filter" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
            {copied ? "Email copied" : "Jump to"}
          </label>
          <button
            type="button"
            className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            onClick={onClose}
          >
            Esc to close
          </button>
        </div>
        <div {...enter(60)}>
          <input
            id="menu-filter"
            type="text"
            placeholder="filter pages, case studies, links"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-4 h-11 w-full rounded-[var(--radius-control)] border border-[var(--line-strong)] bg-[var(--surface)] px-4 font-mono text-[13px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-subtle)] focus:border-[var(--signal)]"
          />
        </div>
        <nav aria-label="Menu" className="mt-6">
          <ul className="flex flex-col">
            {filtered.map((link, i) => (
              <li key={link.href} {...enter(120 + i * 45)}>
                <Link
                  href={link.href}
                  className="group flex items-baseline gap-4 border-b border-[var(--line)] py-4 no-underline"
                  {...(link.tone === "external"
                    ? { target: "_blank", rel: "noreferrer", onClick: undefined }
                    : { onClick: onClose })}
                >
                  <span className="min-w-0 truncate text-[length:var(--step-3)] font-medium leading-[var(--leading-snug)] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                    {link.label}
                  </span>
                  <span
                    aria-hidden
                    className="arrow-shift ml-auto shrink-0 font-mono text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]"
                  >
                    {link.tone === "external" ? "↗" : "→"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {filtered.length === 0 ? (
            <p className="border-b border-[var(--line)] py-4 text-[var(--fg-subtle)]">No matches.</p>
          ) : null}
        </nav>
        <div {...enter(320)}>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <button
              type="button"
              onClick={copyEmail}
              className="link-sweep font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              {copied ? "Email copied" : "Copy email"}
            </button>
          </li>
          <li>
            <a
              href="/cv.pdf"
              download={cvDownloadName}
              className="link-sweep font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)] no-underline"
              onClick={onClose}
            >
              Open CV
            </a>
          </li>
        </ul>
        </div>
      </div>
    </div>
  );
}
