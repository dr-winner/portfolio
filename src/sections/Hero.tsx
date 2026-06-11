"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Shield, Sparkles } from "lucide-react";
import { TypedLines } from "@/components/TypedLines";
import { HeroAnimation, CharSplit } from "@/components/HeroAnimation";
import { MagneticButton } from "@/components/MagneticButton";
import { profile } from "@/content/profile";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Orb parallax: y 0 → -80 over the full hero scroll
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-x-clip pt-[calc(7rem+env(safe-area-inset-top,0px))] pb-12 md:pb-20 md:pt-40"
    >
      {/* Parallax orbs */}
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-ocean-300/5 blur-3xl" />
        <div className="absolute top-20 -right-40 size-[440px] rounded-full bg-signal-300/4 blur-3xl" />
      </motion.div>

      <div className="container relative">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Left: identity */}
          <div className="flex min-w-0 flex-col items-start gap-7 text-left">
            <HeroAnimation>
              <h1 className="max-w-full font-display text-display-xl tracking-tight">
                <CharSplit text="Cyber & Cloud" className="block whitespace-nowrap font-bold text-display-etched" />
                <span className="block">
                  <CharSplit text="Security" className="whitespace-nowrap" charClassName="text-gradient-ocean" />
                </span>
              </h1>
            </HeroAnimation>

            <p className="min-w-0 w-full max-w-lg text-lg text-slate-600 dark:text-white/85">
              Threat detection in the SOC. Cloud hardening on AWS, Azure, GCP.
              Pentesting, forensics, compliance.
            </p>

            <div className="flex w-full max-w-md flex-col gap-3 font-sans sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={() => go("projects")}
                className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ocean-300 to-signal-300 px-5 py-3.5 text-sm font-semibold text-ink shadow-glow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 sm:min-h-0 sm:w-auto sm:py-3"
              >
                Explore my work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </button>
              <MagneticButton strength={0.4} className="w-full sm:w-auto">
                <button
                  onClick={() => go("contact")}
                  className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300/90 bg-white/90 px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:border-ocean-400/45 hover:bg-white dark:border-white/15 dark:bg-white/[0.03] dark:text-white/90 dark:shadow-none dark:hover:border-ocean-300/40 dark:hover:bg-white/[0.05] dark:hover:text-white sm:min-h-0 sm:w-auto sm:py-3"
                >
                  Let&apos;s talk
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </MagneticButton>
            </div>

            {/* Specialty chips */}
            <div className="mt-1 flex w-full flex-wrap gap-2 border-t border-slate-200/80 pt-6 dark:border-white/10">
              {[
                { label: "Cloud Security",      accent: "cyber"   },
                { label: "SOC Analyst",          accent: "signal"  },
                { label: "Penetration Testing",  accent: "threat"  },
                { label: "Ethical Hacking",      accent: "threat"  },
                { label: "DFIR",                 accent: "ok"      },
                { label: "GRC",                  accent: "cyber"   },
              ].map(({ label, accent }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
                    accent === "cyber"
                      ? "border-ocean-400/30 bg-ocean-400/8 text-ocean-600 dark:border-ocean-300/20 dark:bg-ocean-300/[0.06] dark:text-ocean-300"
                      : accent === "signal"
                      ? "border-amber-400/30 bg-amber-400/8 text-amber-700 dark:border-signal-300/20 dark:bg-signal-300/[0.06] dark:text-signal-300"
                      : accent === "threat"
                      ? "border-rose-400/30 bg-rose-400/8 text-rose-700 dark:border-threat-400/20 dark:bg-threat-400/[0.06] dark:text-threat-400"
                      : "border-emerald-400/30 bg-emerald-400/8 text-emerald-700 dark:border-ok-400/20 dark:bg-ok-400/[0.06] dark:text-ok-400"
                  }`}
                >
                  <span className="size-1 rounded-full bg-current" />
                  {label}
                </span>
              ))}
            </div>

            {/* Keep clouds stat for quick scan */}
            <dl className="hidden">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/55">
                  Clouds
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white/90">
                  AWS · Azure · GCP
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: terminal */}
          <div className="relative min-w-0 overflow-x-clip">
            <p className="mb-3 max-w-full font-sans text-sm leading-relaxed text-slate-600 md:max-w-md dark:text-white/75">
              <span className="font-medium text-slate-800 dark:text-white/75">
                This window
              </span>{" "}
              is a{" "}
              <em className="not-italic text-ocean-600 dark:text-ocean-200/90">
                decorative
              </em>{" "}
              terminal. The{" "}
              <strong className="text-ocean-700 dark:text-ocean-200/90">
                real, typeable
              </strong>{" "}
              one is the{" "}
              <strong className="text-slate-900 dark:text-white/80">
                bar at the bottom
              </strong>{" "}
              of the page.
            </p>
            <div
              data-hero-terminal
              className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/[0.92] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-ink-100/80 dark:shadow-none"
              aria-label="Decorative terminal-style preview, not an input"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border-b border-slate-200/85 bg-slate-100/90 px-3 py-2 dark:border-white/10 dark:bg-ink-100/60 sm:px-4">
                <div className="flex shrink-0 items-center gap-2">
                  <span className="size-2.5 rounded-full bg-threat-500/80" />
                  <span className="size-2.5 rounded-full bg-signal-300/80" />
                  <span className="size-2.5 rounded-full bg-ok-400/80" />
                </div>
                <span className="min-w-0 truncate text-center font-mono text-[10px] tracking-tight text-slate-600 sm:text-[11px] dark:text-white/65">
                  ~ /soc/agents — zsh
                </span>
                <div className="flex shrink-0 items-center justify-end gap-1 text-[10px] text-slate-600 sm:text-[11px] dark:text-white/65">
                  <Shield className="size-3 shrink-0 text-ocean-500 dark:text-ocean-300" />
                  <span>secure</span>
                </div>
              </div>

              <div className="space-y-1.5 overflow-x-auto bg-slate-50/80 p-4 font-mono text-[13px] leading-relaxed text-slate-800 sm:p-5 [overflow-wrap:anywhere] dark:bg-transparent dark:text-white/85">
                <TypedLines
                  lines={[
                    {
                      text: "$ whoami",
                      className: "text-slate-500 dark:text-white/75",
                    },
                    {
                      text: profile.name.toLowerCase().replace(/ /g, "_"),
                      className: "text-slate-950 dark:text-white",
                    },
                    {
                      text: "$ cat ~/role.txt",
                      className: "text-slate-500 dark:text-white/75",
                    },
                    {
                      text: profile.role,
                      className: "text-ocean-700 dark:text-ocean-200",
                    },
                    {
                      text: "$ ls ~/specializations/",
                      className: "text-slate-500 dark:text-white/75",
                    },
                    {
                      text: "cloud-security/  soc-analyst/  pentest/",
                      className: "text-emerald-600 dark:text-ok-400",
                    },
                    {
                      text: "ethical-hacking/  dfir/  grc/",
                      className: "text-emerald-600 dark:text-ok-400",
                    },
                    {
                      text: "$ status --now",
                      className: "text-slate-500 dark:text-white/75",
                    },
                    {
                      text: "◆ available — open to new roles",
                      className: "text-amber-600 dark:text-signal-300",
                    },
                  ]}
                />
              </div>

              <div className="border-t border-slate-200/85 bg-white/95 dark:border-white/10 dark:bg-ink-100/60">
                <p className="px-4 pt-2 font-sans text-[11px] leading-snug text-slate-500 dark:text-white/60">
                  <span className="text-ocean-600 dark:text-ocean-200/80">→</span>{" "}
                  To actually type, use the console at the bottom of the screen.
                </p>
                <div className="flex flex-col gap-1.5 px-4 py-2 text-[11px] text-slate-500 dark:text-white/65 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3 text-ocean-500 dark:text-ocean-300" />
                    <span>
                      agent runtime:{" "}
                      <span className="text-slate-800 dark:text-white/80">
                        online
                      </span>
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 sm:ml-auto dark:text-white/55">
                    enc: TLS 1.3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
