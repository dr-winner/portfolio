import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CertificationCard } from "@/components/site/CertificationCard";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { cvHref, mailto } from "@/content/site";
import { skills } from "@/content/skills";

export const metadata: Metadata = {
  title: "About",
  description: "Richard Winner Duvor works on application security in Accra, Ghana. Experience, certifications and skills.",
  alternates: { canonical: "/about" },
};

/* Focus areas are grouped from the existing skills data so no new claims
   are invented; the card stays factual and small. */
const focus = skills.slice(0, 2);

export default function AboutPage() {
  const [bioOne, bioTwo] = profile.bio;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-[var(--space-2xl)]">
      {/* ── Split hero: story left, quiet focus card right ──────────────── */}
      <div className="grid gap-12 min-[1100px]:grid-cols-[minmax(0,1fr)_330px] min-[1100px]:gap-16">
        <header className="min-w-0">
          <Reveal y={10}>
            <p className="font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">About</p>
          </Reveal>
          <Reveal delay={80} y={20}>
            <h1 className="mt-6 max-w-[16ch] text-balance text-[length:var(--step-4)] font-medium leading-[var(--leading-tight)] tracking-[-0.02em]">
              {profile.name}
            </h1>
            <p className="mt-4 text-[length:var(--step-1)] text-[var(--fg-muted)]">{profile.headline}</p>
          </Reveal>
          <Reveal delay={160} y={16}>
            <div className="mt-10 flex max-w-[62ch] flex-col gap-5 text-[length:var(--step-0)] leading-[var(--leading-body)]">
              <p className="text-pretty">{bioOne}</p>
              <p className="text-pretty text-[var(--fg-muted)]">{bioTwo}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={cvHref}>Download CV</Button>
              <Button href={mailto} variant="secondary">Email me</Button>
            </div>
          </Reveal>
        </header>
        <Reveal delay={220} y={14} className="min-w-0">
          <aside className="self-start rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-6 min-[1100px]:sticky min-[1100px]:top-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Focus</p>
            <ul className="mt-4 flex flex-col gap-3">
              {focus.map((group) => (
                <li key={group.title}>
                  <p className="text-[13.5px] font-medium text-[var(--fg)]">{group.title}</p>
                  <p className="mt-0.5 text-[12.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{group.items}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Location</p>
              <p className="mt-1 text-[13.5px] text-[var(--fg-muted)]">
                {profile.location}, GMT
              </p>
            </div>
          </aside>
        </Reveal>
      </div>

      {/* ── Experience: hairline vertical timeline (dates exactly as data) ── */}
      <section id="experience" className="mt-24">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Experience</p>
        </Reveal>
        <ol className="relative mt-8 max-w-[62ch] border-l border-[var(--line)] pl-6">
          {experience.map((item, i) => (
            <Reveal key={`${item.org}-${item.title}`} as="li" delay={i * 60} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[27px] top-[7px] h-2 w-2 rounded-full border border-[var(--line-strong)] bg-[var(--bg)] transition-colors duration-[var(--dur-2)]"
              />
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] tabular-nums">
                {item.period}
              </p>
              <h3 className="mt-1.5 text-[length:var(--step-1)] leading-[var(--leading-snug)]">{item.title}</h3>
              <p className="mt-0.5 text-[var(--fg-muted)]">{item.org}</p>
              <p className="mt-2 leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.description}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Education card ───────────────────────────────────────────────── */}
      <section className="mt-4 max-w-[62ch]">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Education</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] tabular-nums">
              {profile.education.period}
            </p>
            <h3 className="mt-2 text-[length:var(--step-1)]">{profile.education.degree}</h3>
            <p className="mt-1 text-[var(--fg-muted)]">{profile.education.school}</p>
          </div>
        </Reveal>
      </section>

      {/* ── Certifications: the same component as the home page ─────────── */}
      <section id="certifications" className="mt-24">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Certifications</p>
        </Reveal>
        <Reveal delay={80} y={14}>
          <CertificationCard />
        </Reveal>
      </section>

      <Reveal delay={60} y={12}>
        <nav aria-label="More" className="mt-16 grid gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
          <Link
            href="/work"
            className="group rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Next</span>
            <span className="mt-2 block text-[13.5px] font-medium text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)] sm:text-right">
              Case studies
            </span>
          </Link>
          <Link
            href="/contact"
            className="group rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline sm:text-right"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Then</span>
            <span className="mt-2 block text-[13.5px] font-medium text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
              Contact
            </span>
          </Link>
        </nav>
      </Reveal>
    </div>
  );
}
