import type { Metadata } from "next";
import Link from "next/link";
import { CopyEmail } from "@/components/site/CopyEmail";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { LinkCard } from "@/components/site/LinkCard";
import { SectionLabel } from "@/components/site/SectionLabel";
import { StatusDot } from "@/components/site/StatusDot";
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

const prompts = [
  "The role and the team it sits in.",
  "Where the team is based, and whether the work is remote.",
  "What the application surface looks like: web, API, AI features or all three.",
];

export default function ContactPage() {
  return (
    <div className="shell pb-[clamp(72px,9vw,128px)] pt-[clamp(40px,7vh,76px)]">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
        {/* ── Left: heading, short line, email once, in large type ───────── */}
        <div className="min-w-0">
          <Reveal y={8}>
            <SectionLabel title="Contact" />
          </Reveal>
          <SplitHeadline
            as="h1"
            lines={["Let us talk about", "the work."]}
            delay={60}
            className="mt-7 text-[clamp(40px,7.4vw,82px)] font-medium leading-[0.96] tracking-[-0.045em]"
          />
          <Reveal delay={220} y={10}>
            <p className="mt-6 max-w-[54ch] text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              I&apos;m open to application security and product security roles in Ghana, across Africa and with remote
              teams. Email is the best way to reach me.
            </p>
          </Reveal>

          <Reveal delay={280} y={12}>
            <div className="mt-9 rounded-[var(--radius-panel)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_68%,transparent)] p-[clamp(20px,3.4vw,34px)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Direct</p>
              <a
                href={mailto}
                className="mt-3 block break-words text-[clamp(20px,3.4vw,34px)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em] text-[var(--fg)] underline decoration-[var(--line-strong)] decoration-1 underline-offset-[6px] transition-colors duration-[var(--dur-1)] hover:text-[var(--signal)] hover:decoration-[var(--signal)]"
              >
                {site.email}
              </a>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--line)] pt-4">
                <CopyEmail variant="icon" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
                  Accra, Ghana · GMT
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={340} y={10}>
            <div className="mt-8">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                Helpful in a first email
              </p>
              <ol className="mt-3 flex max-w-[60ch] flex-col border-t border-[var(--line)]">
                {prompts.map((prompt, index) => (
                  <li key={prompt} className="flex gap-3 border-b border-[var(--line)] py-3 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                    <span aria-hidden className="shrink-0 font-mono text-[10.5px] text-[var(--signal)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {prompt}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={380} y={10}>
            <Link
              href="/security#report"
              className="group panel mt-8 flex items-center justify-between gap-4 px-5 py-4 no-underline"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--amber)]">
                  Security report
                </span>
                <span className="mt-1 block text-[13.5px] text-[var(--fg-muted)]">
                  Found an issue on this site? Here is how to report it.
                </span>
              </span>
              <span aria-hidden className="arrow-shift shrink-0 text-[var(--fg-subtle)]">→</span>
            </Link>
          </Reveal>
        </div>

        {/* ── Right: quiet link cards with icon, label, handle ────────────── */}
        <Reveal delay={200} y={14} className="min-w-0">
          <aside className="flex flex-col gap-4 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-3 rounded-full border border-[var(--line)] px-4 py-3">
              <StatusDot label={site.availabilityShort} />
            </div>
            <div className="flex flex-col gap-2.5">
              {links.map((link) => (
                <LinkCard key={link.label} href={link.href} label={link.label} handle={link.handle} />
              ))}
            </div>
            <div className="panel-quiet p-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Based in</p>
              <p className="mt-1.5 text-[13.5px] text-[var(--fg)]">Accra, Ghana</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                GMT, working with teams across Africa and remote.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
