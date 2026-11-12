import Link from "next/link";
import { cvHref, mailto, site } from "@/content/site";
import { StatusDot } from "@/components/site/StatusDot";

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
    <footer className="relative overflow-hidden border-t border-[var(--line)]">
      <div className="shell pb-8 pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_0.8fr_1fr]">
          <div className="min-w-0">
            <StatusDot label={site.availabilityShort} />
            <p className="mt-5 max-w-[30ch] text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em] text-[var(--fg)]">
              Application security, with the proof attached.
            </p>
            <a
              href={mailto}
              className="link-sweep mt-5 inline-block break-all font-mono text-[13px] text-[var(--fg-muted)] no-underline hover:text-[var(--signal)]"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Site</p>
            <ul className="mt-4 flex flex-col gap-1">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[36px] items-center text-[13.5px] text-[var(--fg-muted)] no-underline transition-colors hover:text-[var(--fg)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Elsewhere</p>
            <ul className="mt-4 flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-1.5 text-[13.5px] text-[var(--fg-muted)] no-underline transition-colors hover:text-[var(--fg)]"
                  >
                    {link.label}
                    <span aria-hidden className="text-[10px] text-[var(--fg-subtle)]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Take with you</p>
            <ul className="mt-4 flex flex-col gap-1">
              <li>
                <a
                  href={cvHref}
                  download
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-[13.5px] text-[var(--fg-muted)] no-underline transition-colors hover:text-[var(--signal)]"
                >
                  CV (PDF)
                  <span aria-hidden className="text-[10px]">↓</span>
                </a>
              </li>
              <li>
                <Link
                  href="/security"
                  className="inline-flex min-h-[36px] items-center text-[13.5px] text-[var(--fg-muted)] no-underline transition-colors hover:text-[var(--fg)]"
                >
                  Security notes
                </Link>
              </li>
              <li>
                <span className="inline-flex min-h-[36px] items-center font-mono text-[11px] text-[var(--fg-subtle)]">
                  {site.location} · GMT
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
            © {new Date().getFullYear()} drWinner
          </p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
            Built and secured <span className="text-[var(--signal)]">·</span> {site.location}
          </p>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none select-none px-[clamp(20px,4vw,44px)] text-[clamp(64px,16vw,220px)] font-medium leading-[0.72] tracking-[-0.07em] text-[var(--wordmark)]"
      >
        drWinner
      </p>
    </footer>
  );
}
