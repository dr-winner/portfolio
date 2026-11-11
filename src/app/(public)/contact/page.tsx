import type { Metadata } from "next";
import Link from "next/link";
import { CopyEmail } from "@/components/site/CopyEmail";
import { Reveal } from "@/components/motion/Reveal";
import { LinkCard } from "@/components/site/LinkCard";
import { cvHref, mailto, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open to application security and product security roles in Ghana, across Africa and with remote teams.",
  alternates: { canonical: "/contact" },
};

const links = [
  { href: site.links.linkedin, label: "LinkedIn", handle: site.links.linkedin.replace("https://www.linkedin.com/in/", "in/") },
  { href: site.links.github, label: "GitHub", handle: `@${site.handle}` },
  { href: site.links.x, label: "X", handle: `@dr_winner6` },
  { href: cvHref, label: "CV", handle: "cv.pdf" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-[var(--space-2xl)]">
      <div className="grid gap-12 min-[1100px]:grid-cols-[minmax(0,1fr)_330px] min-[1100px]:gap-16">
        {/* ── Left: heading, short line, email once, in large type ───────── */}
        <div className="min-w-0">
          <Reveal y={10}>
            <p className="font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">Contact</p>
          </Reveal>
          <Reveal delay={80} y={20}>
            <h1 className="mt-6 text-balance text-[length:var(--step-4)] font-medium leading-[var(--leading-tight)] tracking-[-0.02em]">
              Get in touch
            </h1>
          </Reveal>
          <Reveal delay={160} y={16}>
            <p className="mt-6 max-w-[60ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
              I&apos;m open to application security and product security roles in Ghana, across Africa and with remote teams. Email is the best way to reach me.
            </p>
            <p className="mt-4 max-w-[60ch] text-[var(--fg-muted)]">
              Please include the role, where the team&apos;s based, whether it&apos;s remote, and what the work involves.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={mailto}
                className="text-[length:var(--step-2)] leading-[var(--leading-snug)] text-[var(--fg)] underline decoration-[var(--signal)]/60 decoration-2 underline-offset-4 transition-colors duration-[var(--dur-1)] hover:text-[var(--signal)]"
              >
                {site.email}
              </a>
              <CopyEmail variant="icon" />
            </div>
            <Reveal delay={220} y={10}>
              <p className="mt-12 flex flex-wrap items-center gap-2 font-mono text-[12px] text-[var(--fg-muted)]">
                <span aria-hidden className="mr-1 text-[var(--amber)]">&gt;</span>
                Found a security issue on this site?
                <Link href="/security#report" className="link-sweep text-[var(--fg)] no-underline">
                  How to report it
                </Link>
              </p>
            </Reveal>
          </Reveal>
        </div>

        {/* ── Right: quiet link cards with icon, label, handle ────────────── */}
        <Reveal delay={200} y={14} className="min-w-0">
          <aside className="flex flex-col gap-4 self-start min-[1100px]:sticky min-[1100px]:top-28">
            {links.map((link, i) => (
              <Reveal key={link.label} delay={240 + i * 60} y={10}>
                <LinkCard href={link.href} label={link.label} handle={link.handle} />
              </Reveal>
            ))}
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              Accra, Ghana
            </p>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
