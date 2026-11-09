import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/site/CopyEmail";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/site/SectionLabel";
import { StatusDot } from "@/components/site/StatusDot";
import { cvHref, mailto, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open to application security and product security roles in Ghana, across Africa and with remote teams.",
  alternates: { canonical: "/contact" },
};

const socials = [
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.github, label: "GitHub" },
  { href: site.links.x, label: "X" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <Reveal y={10}>
        <SectionLabel title="Contact" tone="ai" />
      </Reveal>
      <Reveal delay={80} y={20}>
        <h1 className="mt-6 max-w-[14ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">Get in touch</h1>
      </Reveal>
      <Reveal delay={160} y={16}>
        <p className="mt-6 max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
          I&apos;m open to application security and product security roles in Ghana, across Africa and with remote teams. Email is the best way to reach me.
        </p>
        <p className="mt-4 max-w-[68ch] text-[var(--fg-muted)]">
          Please include the role, where the team&apos;s based, whether it&apos;s remote, and what the work involves.
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="fx-corner console-card relative mt-12 overflow-hidden rounded-[20px] border border-[var(--line-strong)] bg-[var(--surface)]">
          <div aria-hidden className="absolute inset-0 fx-dots opacity-40" />
          <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-90" style={{ background: "radial-gradient(closest-side, var(--glow-ai), transparent 75%)" }} />
          <div className="relative flex flex-col gap-8 p-[clamp(28px,5vw,56px)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <StatusDot label={site.availabilityShort} />
              <p className="font-mono text-[12px] tracking-[0.16em] text-[var(--fg-subtle)]">[ ACCRA · GHANA · GMT ]</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={mailto}>Email me</Button>
              <CopyEmail />
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                    {link.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <Link href={cvHref} download="Richard-Winner-Duvor-AppSec-CV.pdf" className="link-sweep text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
                  CV ↓
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal delay={320} y={12}>
        <p className="mt-10 flex flex-wrap items-baseline gap-2 font-mono text-[13px] text-[var(--fg-muted)]">
          <span className="text-[var(--amber)]">[ REPORT ]</span>
          Found a security issue on this site?
          <Link href="/security#report" className="link-sweep is-active text-[var(--fg)] no-underline">
            Here&apos;s how to report it →
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
