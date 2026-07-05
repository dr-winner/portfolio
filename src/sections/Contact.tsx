"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import { Card } from "@/components/Card";
import { track } from "@/lib/telemetry.client";
import {
  EASE,
  DUR,
  STAGGER,
  varWordReveal,
  varStagger,
} from "@/config/motion.config";

/* ── Word-split helper ─────────────────────────────────────────────────────── */
function WordStagger({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={className}
            style={{ display: "inline-block" }}
            variants={varWordReveal(reduced ?? false)}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* ── Ripple hook ───────────────────────────────────────────────────────────── */
function useRipple() {
  return function addRipple(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const span = document.createElement("span");
    span.className = "ripple-wave";
    span.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
    `;
    el.appendChild(span);
    span.addEventListener("animationend", () => span.remove(), { once: true });
  };
}

/* ── Grain SVG noise URI ───────────────────────────────────────────────────── */
const GRAIN_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

/* ── Component ─────────────────────────────────────────────────────────────── */
export function Contact() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const ripple = useRipple();

  function mailto(e: React.MouseEvent<HTMLButtonElement>) {
    ripple(e);
    track("contact_button", { path: "/#contact" });
    window.location.href = `mailto:${profile.email}?subject=Let%27s%20build%20something&body=Hi%20Richard%2C%20`;
  }

  const wordContainerVariants = varStagger(STAGGER.word, reduced ?? false);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative py-20 md:py-28 lg:py-32"
    >
      <div className="container">
        <Card className="relative overflow-hidden p-6 sm:p-8 md:p-12">
          {/* ── Grain texture background ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 animate-grain opacity-[0.04]"
            style={{
              backgroundImage: GRAIN_URI,
              backgroundRepeat: "repeat",
              backgroundSize: "256px",
            }}
          />

          {/* ── Grid overlay ── */}
          <div
            className="absolute inset-0 z-0 bg-grid-soft opacity-25"
            aria-hidden
          />

          {/* ── Glow orbs ── */}
          <div
            className="absolute -top-24 -right-20 z-0 size-[380px] rounded-full bg-cyber-300/[0.14] blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-24 -left-20 z-0 size-[340px] rounded-full bg-signal-300/[0.12] blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            {/* ── Left column ── */}
            <div>
              {/* Availability ping + chip */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="chip-cyber font-mono text-[10px] uppercase tracking-[0.2em]">
                  /contact
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ok-500 dark:text-ok-400">
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok-400 opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-ok-400" />
                  </span>
                  open to work
                </span>
              </div>

              {/* Heading — word stagger on scroll enter */}
              <motion.h2
                className="mt-5 font-display text-3xl leading-[1.08] tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem] dark:text-white"
                variants={wordContainerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <WordStagger text="Have a system that needs building —" />{" "}
                <span className="text-gradient-cyber inline-block">
                  <WordStagger text="or defending?" />
                </span>
              </motion.h2>

              <motion.p
                className="mt-4 max-w-xl text-slate-600 md:text-lg dark:text-white/70"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{
                  duration: DUR.base,
                  ease: EASE.expoOut,
                  delay: 0.5,
                }}
              >
                I&apos;m open to SOC, detection-engineering, and AI-agent roles,
                and to select contract work. The fastest way in is email.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{
                  duration: DUR.base,
                  ease: EASE.expoOut,
                  delay: 0.65,
                }}
              >
                {/* Email button — ripple on click */}
                <button
                  type="button"
                  onClick={mailto}
                  className="group relative inline-flex min-w-0 w-full max-w-full items-center justify-start gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyber-400 via-cyber-300 to-signal-300 px-4 py-3 text-left text-sm font-semibold text-ink shadow-glow-sm ring-1 ring-cyber-300/20 transition-all duration-300 hover:-translate-y-0.5 hover:ring-cyber-300/40 hover:shadow-glow sm:w-auto sm:max-w-none sm:px-5"
                  aria-label={`Send email to ${profile.name}`}
                >
                  <Mail className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 break-words sm:break-normal">
                    {profile.emailObfuscated}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                {/* LinkedIn button — ripple on click */}
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    ripple(e as unknown as React.MouseEvent<HTMLElement>)
                  }
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-300/90 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-cyber-400/40 hover:text-slate-950 sm:w-auto sm:justify-start dark:border-white/15 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-cyber-300/40 dark:hover:text-white"
                >
                  LinkedIn
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            </div>

            {/* ── Right column — terminal prompt card ── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{
                duration: DUR.base,
                ease: EASE.expoOut,
                delay: 0.4,
              }}
              className="overflow-hidden rounded-xl border border-slate-200/90 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-ink/60"
            >
              {/* Accent bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-cyber-400/60 via-cyber-300/90 to-cyber-400/30" />

              <div className="p-5 font-mono text-[13px] text-slate-800 dark:text-[#e6ecf7]">
                <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                  <Sparkles className="size-3.5 text-cyber-300" />
                  <span>what to include</span>
                </div>
                <ul className="mt-3 space-y-2 text-slate-700 dark:text-white/75">
                  <li>
                    ▸{" "}
                    <span className="text-cyber-600 dark:text-cyber-300">
                      role
                    </span>{" "}
                    or brief
                  </li>
                  <li>
                    ▸{" "}
                    <span className="text-cyber-600 dark:text-cyber-300">
                      timeline
                    </span>{" "}
                    and urgency
                  </li>
                  <li>
                    ▸{" "}
                    <span className="text-cyber-600 dark:text-cyber-300">
                      stack
                    </span>{" "}
                    / environment
                  </li>
                  <li>
                    ▸{" "}
                    <span className="text-cyber-600 dark:text-cyber-300">
                      risk model
                    </span>{" "}
                    (if any)
                  </li>
                </ul>
                <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-[11px] text-slate-500 dark:border-white/10 dark:text-white/50">
                  <ShieldCheck className="size-3.5 text-ok-400" />
                  <span>I respond within 24 h — PGP on request.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </div>
    </section>
  );
}
