import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/site/CopyEmail";
import { Magnetic } from "@/components/site/Magnetic";
import { cvHref, mailto, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open to application security and product security roles in Ghana, across Africa and with remote teams.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="band-close min-h-[calc(100svh-4rem)]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-end gap-6 px-[clamp(20px,5vw,64px)] py-[clamp(72px,12vh,140px)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--signal)]">Contact</p>
        <h1 className="max-w-[10ch] text-balance text-[length:var(--step-6)] leading-[var(--leading-tight)]">Get in touch</h1>
        <p className="max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
          I&apos;m open to application security and product security roles in Ghana, across Africa and with remote teams. Email is the best way to reach me.
        </p>
        <p className="max-w-[68ch] text-[length:var(--step-1)] text-[var(--fg-muted)]">
          Please include the role, where the team is based, whether it&apos;s remote, and what the work involves.
        </p>
        <div className="mt-2">
          <Magnetic>
            <Button href={mailto}>Email me</Button>
          </Magnetic>
        </div>
        <p>
          <a href={mailto} className="text-[length:var(--step-2)] text-[var(--signal)]">
            {site.email}
          </a>
        </p>
        <CopyEmail />
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[length:var(--step-1)]">
          <li>
            <a href={site.links.linkedin}>LinkedIn</a>
          </li>
          <li>
            <a href={site.links.github}>GitHub</a>
          </li>
          <li>
            <a href={site.links.x}>X</a>
          </li>
          <li>
            <Link href={cvHref}>Download CV</Link>
          </li>
        </ul>
        <p className="mt-8 max-w-[68ch] text-[var(--fg-muted)]">
          Found a security issue on this site? <Link href="/security#report">Here&apos;s how to report it.</Link>
        </p>
      </div>
    </section>
  );
}
