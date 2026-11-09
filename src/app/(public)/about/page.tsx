import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/site/SectionLabel";
import { certifications } from "@/content/certifications";
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
  const earned = certifications.filter((item) => item.status === "earned");
  const progress = certifications.filter((item) => item.status !== "earned");

  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <Reveal y={10}>
        <SectionLabel title="About" />
      </Reveal>
      <Reveal delay={80} y={20}>
        <h1 className="mt-6 max-w-[14ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">{profile.name}</h1>
        <p className="mt-4 text-[length:var(--step-2)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">{profile.headline}</p>
      </Reveal>
      <Reveal delay={160} y={16}>
        <div className="fx-rule mt-8 h-px w-full bg-[var(--line)]" />
        <div className="mt-10 flex max-w-[68ch] flex-col gap-5 text-[length:var(--step-0)] leading-[var(--leading-body)]">
          {profile.bio.map((paragraph, i) => (
            <p key={paragraph} className={i === 0 ? "text-[length:var(--step-1)] leading-[var(--leading-snug)] text-pretty" : "text-pretty"}>
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      <section id="experience" className="mt-20">
        <Reveal>
          <SectionLabel index="01" title="Experience" tone="muted" />
        </Reveal>
        <ol className="relative mt-8 max-w-[68ch] border-l border-[var(--line-strong)] pl-0">
          {experience.map((item, i) => (
            <Reveal key={`${item.org}-${item.title}`} as="li" delay={i * 80} className="relative pb-10 pl-6">
              <span
                aria-hidden
                className="fx-pulse absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-[var(--signal)] text-[var(--signal)] transition-transform duration-[var(--dur-2)]"
              />
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)] tabular-nums">[ {item.period} ]</p>
              <h3 className="mt-1.5 text-[length:var(--step-1)] leading-[var(--leading-snug)]">{item.title}</h3>
              <p className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--ai)]">{item.org}</p>
              <p className="mt-2 leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.description}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mt-4 max-w-[68ch]">
        <Reveal>
          <SectionLabel index="02" title="Education" tone="muted" />
        </Reveal>
        <Reveal delay={80}>
          <div className="console-card mt-8 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">[ {profile.education.period} ]</p>
            <h3 className="mt-2 text-[length:var(--step-1)]">{profile.education.degree}</h3>
            <p className="mt-1 text-[var(--fg-muted)]">{profile.education.school}</p>
          </div>
        </Reveal>
      </section>

      <section id="certifications" className="mt-20">
        <Reveal>
          <SectionLabel index="03" title="Certifications" />
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal delay={100} className="group">
            <div className="fx-corner console-card h-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)]">[ EARNED ]</p>
              <ul className="mt-4 flex flex-col gap-3">
                {earned.map((item) => (
                  <li key={item.name} className="border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg)] no-underline hover:text-[var(--signal)]">
                        {item.name}
                      </a>
                    ) : (
                      <span className="text-[var(--fg)]">{item.name}</span>
                    )}
                    <span className="mt-1 block text-[length:var(--step--1)] text-[var(--fg-muted)]">
                      {item.issuer}. {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={200} className="group">
            <div className="fx-corner console-card h-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--ai)]">[ IN PROGRESS ]</p>
              <ul className="mt-4 flex flex-col gap-3">
                {progress.map((item) => (
                  <li key={item.name} className="border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg)] no-underline hover:text-[var(--ai)]">
                        {item.name}
                      </a>
                    ) : (
                      <span className="text-[var(--fg)]">{item.name}</span>
                    )}
                    <span className="mt-1 block text-[length:var(--step--1)] text-[var(--fg-muted)]">
                      {item.issuer}. {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="skills" className="mt-20">
        <Reveal>
          <SectionLabel index="04" title="Skills" tone="muted" />
        </Reveal>
        <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.title} as="li" delay={80 + i * 60} className="group">
              <div className="console-card h-full rounded-[12px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)] p-5">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)]">{group.title}</p>
                <p className="mt-2.5 text-[length:var(--step--1)] leading-relaxed text-[var(--fg-muted)]">{group.items}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <Reveal delay={120} y={14}>
        <div className="mt-16 flex flex-wrap gap-3">
          <Button href={cvHref} download>Download CV</Button>
          <Button href={mailto} variant="secondary">Email me</Button>
        </div>
      </Reveal>
    </div>
  );
}
