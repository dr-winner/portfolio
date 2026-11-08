import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
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
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">About</p>
      <h1 className="mt-3 text-[length:var(--step-5)] leading-[var(--leading-tight)]">About</h1>
      <div className="mt-8 flex max-w-[68ch] flex-col gap-5 text-[length:var(--step-0)] leading-[var(--leading-body)]">
        {profile.bio.map((paragraph) => (
          <p key={paragraph} className="text-pretty">{paragraph}</p>
        ))}
      </div>

      <section id="experience" className="mt-16 max-w-[68ch]">
        <h2 className="text-[length:var(--step-3)]">Experience</h2>
        <ol className="mt-6 border-l border-[var(--line)]">
          {experience.map((item) => (
            <li key={`${item.org}-${item.title}`} className="relative pb-8 pl-6">
              <span aria-hidden className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[var(--signal)]" />
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)] tabular-nums">{item.period}</p>
              <h3 className="mt-1 text-[length:var(--step-1)]">{item.title}</h3>
              <p className="text-[var(--fg-muted)]">{item.org}</p>
              <p className="mt-2 leading-[var(--leading-body)]">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 max-w-[68ch]">
        <h2 className="text-[length:var(--step-3)]">Education</h2>
        <p className="mt-3">
          {profile.education.degree}, {profile.education.school}, {profile.education.period}
        </p>
      </section>

      <section id="certifications" className="mt-12 max-w-[68ch]">
        <h2 className="text-[length:var(--step-3)]">Certifications and training</h2>
        <h3 className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Earned</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {earned.map((item) => (
            <li key={item.name}>
              {item.link ? <a href={item.link} className="text-[var(--signal)]">{item.name}</a> : item.name}
              <span className="block text-[var(--fg-muted)]">{item.issuer}. {item.description}</span>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">In progress</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {progress.map((item) => (
            <li key={item.name}>
              {item.link ? <a href={item.link} className="text-[var(--signal)]">{item.name}</a> : item.name}
              <span className="block text-[var(--fg-muted)]">{item.issuer}. {item.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" className="mt-12 max-w-[68ch]">
        <h2 className="text-[length:var(--step-3)]">Skills</h2>
        <ul className="mt-6 flex flex-col gap-4">
          {skills.map((group) => (
            <li key={group.title}>
              <h3 className="text-[length:var(--step-1)]">{group.title}</h3>
              <p className="mt-1 text-[var(--fg-muted)]">{group.items}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href={cvHref} download>Download CV</Button>
        <Button href={mailto} variant="secondary">Email me</Button>
      </div>
    </div>
  );
}
