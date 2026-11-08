"use client";

import { Button } from "@/components/ui/Button";
import { DecryptTitle } from "@/components/site/DecryptTitle";
import { GridField } from "@/components/site/GridField";
import { Magnetic } from "@/components/site/Magnetic";
import { RequestTrace } from "@/components/site/RequestTrace";
import { cvHref, site } from "@/content/site";

export function HeroStage() {
  return (
    <section className="hero-stage relative flex flex-col justify-end overflow-hidden px-[clamp(20px,5vw,64px)] pb-16 md:min-h-[100svh] md:justify-center md:pb-20">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
      <GridField />
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-16">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            {site.name} · {site.location}
          </p>
          <DecryptTitle
            text={site.headline}
            className="mt-4 max-w-[12ch] text-balance text-[length:var(--step-6)] font-medium leading-[var(--leading-tight)] tracking-[-0.035em]"
          />
          <p className="mt-3 text-[length:var(--step-3)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">{site.headlineSub}</p>
          <p className="mt-6 max-w-[60ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
            I test web applications and APIs for security flaws and write CVSS-scored findings that engineering teams can act on. I build frontends for a living, so I read an app from the{" "}
            <span className="underline decoration-[var(--signal)] decoration-2 underline-offset-[5px]">inside</span>{" "}
            before I test it from the outside.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button href="/work">View my work</Button>
            </Magnetic>
            <Magnetic>
              <Button href={cvHref} variant="secondary" download>
                Download CV
              </Button>
            </Magnetic>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[length:var(--step--1)] text-[var(--fg-subtle)]">
            <span aria-hidden className="pulse-dot inline-block h-2 w-2 rounded-full bg-[var(--signal)]" />
            {site.availabilityShort}
          </p>
        </div>
        <RequestTrace />
      </div>
    </section>
  );
}
