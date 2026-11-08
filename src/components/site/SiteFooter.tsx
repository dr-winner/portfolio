import Link from "next/link";
import { cvHref, mailto, site } from "@/content/site";

const links = [
  { href: mailto, label: "Email" },
  { href: site.links.github, label: "GitHub" },
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.x, label: "X" },
  { href: "/security", label: "Security" },
  { href: cvHref, label: "CV", download: true },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-[clamp(20px,5vw,64px)] py-10">
        <p className="text-[length:var(--step-0)] text-[var(--fg)]">
          {site.name} · {site.headline} · {site.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/") ? (
                <Link href={link.href} className="text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className="text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]" {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="text-[length:var(--step--1)] text-[var(--fg-subtle)]">
          © {new Date().getFullYear()} {site.name}. Built and secured by me.
        </p>
      </div>
    </footer>
  );
}
