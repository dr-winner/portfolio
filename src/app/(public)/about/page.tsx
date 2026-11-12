import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { CertificationCard } from "@/components/site/CertificationCard";
import { SectionLabel } from "@/components/site/SectionLabel";
import { StatusDot } from "@/components/site/StatusDot";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { cvHref, mailto } from "@/content/site";
import { skills } from "@/content/skills";

export const metadata: Metadata = {
  title: "About",
  description: "Richard Winner Duvor works on application security in Accra, Ghana. Experience, certifications and skills.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const focus = skills.slice(0, 2);

  return (
    <div className="shell pb-[clamp(72px,9vw,128px)] pt-[clamp(40px,7vh,76px)]">
      {/* ── Split hero: story left, quiet focus card right ──────────────── */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
        <header className="min-w-0">
          <Reveal y={8}>
            <SectionLabel title="About" />
          </Reveal>
          <SplitHeadline
            as="h1"
            lines={["Richard Winner", "Duvor."]}
            delay={60}
            className="mt-7 text-[clamp(40px,7vw,78px)] font-medium leading-[0.96] tracking-[-0.045em]"
          />
          <Reveal delay={200} y={10}>
            <p className="mt-5 text-[length:var(--step-1)] leading-[var(--leading-snug)] text-[var(--fg)]">
              {profile.headline} and penetration testing in {profile.location}.
            </p>
          </Reveal>
          <Reveal delay={260} y={12}>
            <div className="mt-9 flex max-w-[64ch] flex-col gap-5 border-t border-[var(--line)] pt-7 text-[length:var(--step-0)] leading-[var(--leading-body)]">
              {profile.bio.map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? "text-pretty text-[var(--fg)]" : "text-pretty text-[var(--fg-muted)]"}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={cvHref}>Download CV</Button>
              <Button href={mailto} variant="secondary">Email me</Button>
            </div>
          </Reveal>
        </header>

        <Reveal delay={220} y={14} className="min-w-0">
          <aside className="panel p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Focus</p>
              <StatusDot label="Available" />
            </div>
            <ul className="mt-5 flex flex-col">
              {focus.map((group) => (
                <li key={group.title} className="border-t border-[var(--line)] py-4 first:border-t-0 first:pt-0">
                  <p className="text-[13.5px] font-medium text-[var(--fg)]">{group.title}</p>
                  <p className="mt-1 text-[12.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{group.items}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-[var(--line)] pt-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Location</p>
              <p className="mt-1.5 text-[13.5px] text-[var(--fg-muted)]">{profile.location}, GMT</p>
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Working style</p>
              <p className="mt-1.5 text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                Scope first, evidence second, a fix the team can ship.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>

      {/* ── Experience: two hairline timelines, security first, then
          engineering, each entry worded as public/cv.pdf ─────────────────── */}
      {(
        [
          { group: "security", heading: "Security experience", id: "experience", className: "mt-24" },
          { group: "engineering", heading: "Engineering experience", id: "engineering-experience", className: "mt-16" },
        ] as const
      ).map((block) => (
        <section key={block.group} id={block.id} className={block.className}>
          <Reveal>
            <SectionLabel title={block.heading} />
          </Reveal>
          <ol className="mt-8 flex flex-col">
            {experience
              .filter((item) => item.group === block.group)
              .map((item, i) => (
                <Reveal key={`${item.org}-${item.title}`} as="li" delay={i * 60} className="relative">
                  <div className="group grid gap-2 border-b border-[var(--line)] py-6 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8">
                    <div className="flex items-center gap-2 sm:items-start">
                      <span
                        aria-hidden
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          item.current ? "bg-[var(--signal)]" : "border border-[var(--line-strong)] bg-transparent"
                        }`}
                      />
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] tabular-nums">
                        {item.period}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[length:var(--step-1)] font-medium leading-[var(--leading-snug)] tracking-[-0.01em]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-[var(--signal)]">{item.org}</p>
                      <p className="mt-2 max-w-[64ch] text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                        {item.description}
                      </p>
                      {item.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex h-6 items-center rounded-full border border-[var(--line)] px-2.5 font-mono text-[10px] text-[var(--fg-subtle)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
          </ol>
        </section>
      ))}

      <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        {/* ── Education card ───────────────────────────────────────────────── */}
        <section>
          <Reveal>
            <SectionLabel title="Education" />
          </Reveal>
          <Reveal delay={80}>
            <div className="panel mt-6 p-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] tabular-nums">
                {profile.education.period}
              </p>
              <h2 className="mt-2 text-[length:var(--step-1)] font-medium leading-[var(--leading-snug)]">
                {profile.education.degree}
              </h2>
              <p className="mt-1 text-[13px] text-[var(--fg-muted)]">{profile.education.school}</p>
            </div>
          </Reveal>
        </section>

        {/* ── Certifications: the same component as the home page ─────────── */}
        <section id="certifications">
          <Reveal>
            <SectionLabel title="Certifications" />
          </Reveal>
          <Reveal delay={80} y={14}>
            <div className="mt-6">
              <CertificationCard />
            </div>
          </Reveal>
        </section>
      </div>

      <Reveal delay={60} y={12}>
        <div className="panel mt-20 flex flex-col gap-6 p-[clamp(24px,4vw,44px)] sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Next</p>
            <p className="mt-3 max-w-[24ch] text-[length:var(--step-3)] font-medium leading-[var(--leading-heading)] tracking-[-0.03em]">
              See the evidence behind the method.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/work">Read the work</Button>
            <Link
              href="/contact"
              className="link-sweep inline-flex h-12 items-center font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)] no-underline hover:text-[var(--signal)]"
            >
              Contact →
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
