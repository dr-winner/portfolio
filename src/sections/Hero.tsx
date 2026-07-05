"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Shield, Sparkles } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { TypedLines } from "@/components/TypedLines";
import { StatusBadge } from "@/components/StatusBadge";
import { profile } from "@/content/profile";
import {
  GSAP_EASE,
  DUR,
  STAGGER,
  ST,
  HERO_READY_EVENT,
  prefersReducedMotion,
} from "@/config/motion.config";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

/**
 * Replaces an element's text with overflow-hidden outer spans containing
 * individually animatable inner spans — one per word.
 * Returns the array of inner spans so GSAP can target them directly.
 */
function splitToWordSpans(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.innerHTML = "";
  return text.split(" ").map((word, i, arr) => {
    const outer = document.createElement("span");
    outer.style.cssText =
      "display:inline-block;overflow:hidden;vertical-align:bottom";
    const inner = document.createElement("span");
    inner.style.cssText = "display:inline-block;will-change:transform";
    inner.textContent = word + (i < arr.length - 1 ? "\u00A0" : "");
    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function Hero() {
  /* Refs — section root */
  const heroRef = useRef<HTMLElement>(null);

  /* Refs — H1 lines */
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  /* Refs — left-column staggered blocks */
  const badgeRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);

  /* Refs — right column */
  const glowRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger on the client only
    gsap.registerPlugin(ScrollTrigger);

    // Respect prefers-reduced-motion — skip all animations, just fire ready event
    if (prefersReducedMotion()) {
      window.dispatchEvent(new Event(HERO_READY_EVENT));
      return;
    }

    const ctx = gsap.context(() => {
      /* 1 ─── StatusBadge: slides down from above ─────────────────────────── */
      if (badgeRef.current) {
        gsap.from(badgeRef.current, {
          opacity: 0,
          y: -8,
          duration: DUR.fast,
          ease: GSAP_EASE.expoOut,
          delay: 0.05,
        });
      }

      /* 2 ─── H1 Line 1: word-by-word reveal from clip ────────────────────── */
      if (line1Ref.current) {
        const innerSpans = splitToWordSpans(line1Ref.current);
        gsap.from(innerSpans, {
          y: "110%",
          opacity: 0,
          duration: DUR.hero,
          ease: GSAP_EASE.expoOut,
          stagger: STAGGER.word,
        });
      }

      /* 3 ─── H1 Line 2: whole line slides up ─────────────────────────────── */
      if (line2Ref.current) {
        gsap.from(line2Ref.current, {
          y: 28,
          opacity: 0,
          duration: DUR.hero,
          ease: GSAP_EASE.expoOut,
          delay: 0.22,
          onComplete() {
            // Signal downstream components (e.g. TypedLines) that hero is ready
            window.dispatchEvent(new Event(HERO_READY_EVENT));
          },
        });
      }

      /* 4 ─── Tagline ──────────────────────────────────────────────────────── */
      if (taglineRef.current) {
        gsap.from(taglineRef.current, {
          opacity: 0,
          y: 16,
          duration: DUR.base,
          ease: GSAP_EASE.snappy,
          delay: 0.5,
        });
      }

      /* 5 ─── CTA buttons ──────────────────────────────────────────────────── */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 16,
          duration: DUR.base,
          ease: GSAP_EASE.snappy,
          delay: 0.65,
        });
      }

      /* 6 ─── Metrics row ─────────────────────────────────────────────────── */
      if (metricsRef.current) {
        gsap.from(metricsRef.current, {
          opacity: 0,
          y: 16,
          duration: DUR.base,
          ease: GSAP_EASE.snappy,
          delay: 0.8,
        });
      }

      /* 7 ─── Stats dl ─────────────────────────────────────────────────────── */
      if (statsRef.current) {
        gsap.from(statsRef.current, {
          opacity: 0,
          y: 16,
          duration: DUR.base,
          ease: GSAP_EASE.snappy,
          delay: 0.95,
        });
      }

      /* 8 ─── Terminal window ─────────────────────────────────────────────── */
      if (terminalRef.current) {
        gsap.from(terminalRef.current, {
          opacity: 0,
          y: 32,
          scale: 0.97,
          duration: 0.7,
          ease: GSAP_EASE.expoOut,
          delay: 0.3,
        });
      }

      /* 9 ─── Glow orb parallax (ScrollTrigger) ───────────────────────────── */
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: "-80px",
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: ST.parallaxScrub,
          },
        });
      }
    }, heroRef); // scope all tweens to heroRef

    return () => ctx.revert();
  }, []);

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative overflow-x-clip pt-[calc(7rem+env(safe-area-inset-top,0px))] pb-12 md:pb-20 md:pt-40"
    >
      <div className="container">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* ── Left: identity ──────────────────────────────────────────────── */}
          <div className="flex min-w-0 flex-col items-start gap-7 text-left">
            {/* Availability badge */}
            <div ref={badgeRef}>
              <StatusBadge
                className="max-w-full sm:max-w-lg"
                label={profile.availability.label}
              />
            </div>

            {/* H1 — two lines animated independently */}
            <h1 className="max-w-full font-display text-display-xl tracking-tight">
              <Balancer>
                {/* Line 1: word-split by GSAP in useEffect */}
                <span ref={line1Ref} className="block text-display-etched">
                  SOC Analyst
                </span>
                {/* Line 2: whole-line from-below */}
                <span ref={line2Ref} className="block">
                  <span className="text-gradient-cyber">&amp; AI Engineer</span>
                </span>
              </Balancer>
            </h1>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="min-w-0 w-full max-w-xl text-lg text-slate-600 dark:text-white/70"
            >
              <Balancer>
                I build and defend intelligent systems — from detection
                engineering in the SOC to agentic AI that reasons, retrieves,
                and acts.
              </Balancer>
            </p>

            {/* CTA buttons */}
            <div
              ref={ctaRef}
              className="flex w-full max-w-md flex-col gap-3 font-sans sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center"
            >
              <button
                onClick={() => go("projects")}
                className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-300 to-signal-300 px-5 py-3.5 text-sm font-semibold text-ink shadow-glow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 sm:min-h-0 sm:w-auto sm:py-3"
              >
                Explore my work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </button>
              <button
                onClick={() => go("contact")}
                className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300/90 bg-white/90 px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:border-cyber-400/45 hover:bg-white dark:border-white/15 dark:bg-white/[0.03] dark:text-white/90 dark:shadow-none dark:hover:border-cyber-300/40 dark:hover:bg-white/[0.05] dark:hover:text-white sm:min-h-0 sm:w-auto sm:py-3"
              >
                Let&apos;s talk
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Quick metrics row */}
            <div
              ref={metricsRef}
              className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-white/40"
            >
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ok-400 shadow-glow-sm" />
                3+ yrs experience
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyber-300 shadow-glow-sm" />
                5+ projects shipped
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-signal-300 shadow-glow-sm" />
                aws · azure · gcp
              </span>
            </div>

            {/* Stats grid */}
            <dl
              ref={statsRef}
              className="mt-2 grid w-full max-w-md grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-200 pt-6 text-left font-sans min-[380px]:grid-cols-2 sm:max-w-lg sm:gap-x-8 dark:border-white/10"
            >
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
                  Focus
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white/90">
                  SOC &amp; agentic AI
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
                  Clouds
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white/90">
                  AWS · Azure · GCP
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Right: terminal ──────────────────────────────────────────────── */}
          <div className="relative min-w-0 overflow-x-clip">
            {/* Glow orb — driven by ScrollTrigger parallax */}
            <div
              ref={glowRef}
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-cyber-300/[0.04] blur-2xl dark:bg-cyber-300/[0.06]"
              aria-hidden
            />

            {/* Terminal card */}
            <div
              ref={terminalRef}
              className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/[0.92] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-ink-100/80 dark:shadow-none"
              aria-label="Terminal-style preview"
            >
              {/* Window chrome */}
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border-b border-slate-200/85 bg-slate-100/90 px-3 py-2 dark:border-white/10 dark:bg-ink-100/60 sm:px-4">
                <div className="flex shrink-0 items-center gap-2">
                  <span className="size-2.5 rounded-full bg-threat-500/80" />
                  <span className="size-2.5 rounded-full bg-signal-300/80" />
                  <span className="size-2.5 rounded-full bg-ok-400/80" />
                </div>
                <span className="min-w-0 truncate text-center font-mono text-[10px] tracking-tight text-slate-600 sm:text-[11px] dark:text-white/50">
                  ~/soc/agents — zsh
                </span>
                <div className="flex shrink-0 items-center justify-end gap-1 text-[10px] text-slate-600 sm:text-[11px] dark:text-white/50">
                  <Shield className="size-3 shrink-0 text-cyber-500 dark:text-cyber-300" />
                  <span>secure</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="space-y-1.5 overflow-x-auto bg-slate-50/80 p-4 font-mono text-[13px] leading-relaxed text-slate-800 sm:p-5 [overflow-wrap:anywhere] dark:bg-transparent dark:text-white/85">
                <TypedLines
                  lines={[
                    {
                      text: "$ whoami",
                      className: "text-slate-500 dark:text-white/60",
                    },
                    {
                      text: profile.name.toLowerCase().replace(/ /g, "_"),
                      className: "text-slate-950 dark:text-white",
                    },
                    {
                      text: "$ cat ~/role.txt",
                      className: "text-slate-500 dark:text-white/60",
                    },
                    {
                      text: profile.role,
                      className: "text-cyber-700 dark:text-cyber-200",
                    },
                    {
                      text: "$ ls ~/focus --depth=1",
                      className: "text-slate-500 dark:text-white/60",
                    },
                    {
                      text: "soc/ threat-hunting/ detection-engineering/",
                      className: "text-emerald-600 dark:text-ok-400",
                    },
                    {
                      text: "ai-agents/ rag/ llm-security/",
                      className: "text-emerald-600 dark:text-ok-400",
                    },
                    {
                      text: "cloud/ aws/ azure/ gcp/ hardening/",
                      className: "text-emerald-600 dark:text-ok-400",
                    },
                    {
                      text: "$ status --now",
                      className: "text-slate-500 dark:text-white/60",
                    },
                    {
                      text: "◆ available — shipping + defending",
                      className: "text-amber-600 dark:text-signal-300",
                    },
                  ]}
                />
              </div>

              {/* Terminal footer */}
              <div className="flex items-center justify-between border-t border-slate-200/85 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-ink-100/60">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/50">
                  <Sparkles className="size-3 text-cyber-500 dark:text-cyber-300" />
                  <span>
                    agent runtime:{" "}
                    <span className="text-slate-800 dark:text-white/80">
                      online
                    </span>
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 dark:text-white/40">
                  enc: TLS 1.3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
