import Link from "next/link";
import { cvHref, mailto, site } from "@/content/site";
import { StatusDot } from "@/components/site/StatusDot";
import { SecurityReport } from "@/components/site/SecurityReport";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/security", label: "Security" },
];

const links = [
  { href: site.links.github, label: "GitHub" },
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.x, label: "X" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="min-w-0">
            <p className="text-[17px] font-medium tracking-[-0.02em] text-[var(--fg)]">
              dr<span className="text-[var(--fg-muted)]">Winner</span>
            </p>
            <p className="mt-3 max-w-[36ch] text-[length:var(--step--1)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
              {site.headline}. {site.location}.
            </p>
            <div className="mt-4">
              <StatusDot label={site.availabilityShort} />
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Site</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-sweep text-[length:var(--step--1)] text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Elsewhere</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-sweep text-[length:var(--step--1)] text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Reach</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li>
                <a href={mailto} className="link-sweep break-all text-[length:var(--step--1)] text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={cvHref} download className="link-sweep text-[length:var(--step--1)] text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                  CV (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center">
          <SecurityReport />
          <p className="font-mono text-[12px] text-[var(--fg-subtle)]">
            © {new Date().getFullYear()} drWinner
          </p>
          <p className="font-mono text-[12px] text-[var(--fg-subtle)]">
            BUILT &amp; SECURED <span className="text-[var(--signal)]">·</span> {site.location.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
