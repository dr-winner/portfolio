import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/site/CopyEmail";
import { cvHref, mailto, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open to application security and product security roles in Ghana, across Africa and with remote teams.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Contact</p>
      <h1 className="mt-3 text-[length:var(--step-5)] leading-[var(--leading-tight)]">Get in touch</h1>
      <p className="mt-6 max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
        I&apos;m open to application security and product security roles in Ghana, across Africa and with remote teams. Email is the best way to reach me.
      </p>
      <p className="mt-4 max-w-[68ch] text-[var(--fg-muted)]">
        Please include the role, where the team is based, whether it&apos;s remote, and what the work involves.
      </p>
      <div className="mt-8">
        <Button href={mailto}>Email me</Button>
      </div>
      <p className="mt-4">
        <a href={mailto} className="text-[var(--signal)]">{site.email}</a>
      </p>
      <CopyEmail />
      <ul className="mt-8 flex flex-wrap gap-5">
        <li><a href={site.links.linkedin}>LinkedIn</a></li>
        <li><a href={site.links.github}>GitHub</a></li>
        <li><a href={site.links.x}>X</a></li>
        <li><Link href={cvHref} download="Richard-Winner-Duvor-AppSec-CV.pdf">Download CV</Link></li>
      </ul>
      <p className="mt-10 text-[var(--fg-muted)]">
        Found a security issue on this site? <Link href="/security#report">Here&apos;s how to report it.</Link>
      </p>
    </div>
  );
}
