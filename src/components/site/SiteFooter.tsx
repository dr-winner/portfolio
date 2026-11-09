import Link from "next/link";
import { cvDownloadName, cvHref, mailto, site } from "@/content/site";
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
  { href: mailto, label: site.email },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-[var(--space-3xl)] overflow-hidden border-t border-[var(--line)]">
      <div aria-hidden className="absolute inset-0 fx-dots opacity-30" />
      {/* Ghost monogram, half-cropped at the baseline of the page */}
      <div
        aria-hidden
        className="fx-ghost-index pointer-events-none absolute -bottom-[0.32em] left-1/2 -translate-x-1/2 select-none font-mono text-[clamp(120px,22vw,340px)] font-bold leading-none tracking-[-0.04em] opacity-[0.55]"
      >
        RWD
      </div>
      <div className="relative mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-[42ch]">
            <p className="font-mono text-[12px] tracking-[0.14em] text-[var(--signal)]">
              [ {site.location.toUpperCase()} ]
            </p>
            <p className="mt-3 text-[length:var(--step-1)] leading-[var(--leading-snug)]">
              {site.headline}
            </p>
            <div className="mt-4">
              <StatusDot label={site.availabilityShort} />
            </div>
          </div>
          <div className="flex gap-16">
            <nav aria-label="Footer">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Site</p>
              <ul className="mt-3 flex flex-col gap-2">
                {nav.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-sweep text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={cvHref} download={cvDownloadName} className="link-sweep text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                    CV
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Elsewhere</p>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="link-sweep text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-row items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
          <p className="font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">
            BUILT &amp; SECURED <span className="text-[var(--signal)]">·</span> ACCRA, GH
          </p>
        </div>
      </div>
    </footer>
  );
}
