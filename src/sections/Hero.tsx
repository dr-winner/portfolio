"use client";

import { ArrowDown, ArrowUpRight, Shield, Sparkles } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { TypedLines } from "@/components/TypedLines";
import { StatusBadge } from "@/components/StatusBadge";
import { profile } from "@/content/profile";

export function Hero() {
  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="top" className="relative pt-[calc(7rem+env(safe-area-inset-top,0px))] pb-12 md:pb-20 md:pt-40">
      <div className="container">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: identity */}
          <div className="flex flex-col items-start gap-7 text-left">
            <StatusBadge className="max-w-full sm:max-w-lg" label={profile.availability.label} />

            <h1 className="font-display text-display-xl tracking-tight">
              <Balancer>
                <span className="block text-display-etched">SOC Analyst</span>
                <span className="block">
                  <span className="text-gradient-cyber">&amp; AI Engineer</span>
                </span>
              </Balancer>
            </h1>

            <p className="max-w-xl text-lg text-white/70">
              <Balancer>
                I build and defend intelligent systems — from detection engineering in the SOC
                to agentic AI that reasons, retrieves, and acts.
              </Balancer>
            </p>

            <div className="flex w-full max-w-md flex-col gap-3 font-sans sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={() => go("projects")}
                className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-300 to-signal-300 px-5 py-3.5 text-sm font-semibold text-ink shadow-glow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 sm:min-h-0 sm:w-auto sm:py-3"
              >
                Explore my work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </button>
              <button
                onClick={() => go("contact")}
                className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white/90 transition-all duration-300 hover:border-cyber-300/40 hover:bg-white/[0.05] hover:text-white sm:min-h-0 sm:w-auto sm:py-3"
              >
                Let&apos;s talk
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <dl className="mt-2 grid w-full max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 text-left font-sans sm:max-w-lg sm:gap-x-8">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-white/40">Focus</dt>
                <dd className="mt-1 text-sm font-medium text-white/90">SOC &amp; agentic AI</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-white/40">Clouds</dt>
                <dd className="mt-1 text-sm font-medium text-white/90">AWS · Azure · GCP</dd>
              </div>
            </dl>
          </div>

          {/* Right: terminal whoami (decorative) + hint for real console */}
          <div className="relative">
            <p className="mb-3 max-w-md font-sans text-sm leading-relaxed text-white/60">
              <span className="font-medium text-white/75">This window</span> is a{" "}
              <em className="not-italic text-cyber-200/90">decorative</em> terminal — it sets the
              security vibe and auto-typed lines. The{" "}
              <strong className="text-cyber-200/90">real, typeable</strong> one is the{" "}
              <strong className="text-white/80">bar at the bottom</strong> of the page, or open{" "}
              <strong>Console</strong> in the header. You can use normal sentences; no command-line
              experience needed.
            </p>
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-cyber-300/10 via-transparent to-signal-300/10 blur-2xl" aria-hidden />
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-100/80 backdrop-blur-sm shadow-glow-sm"
              aria-label="Decorative terminal-style preview, not an input"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border-b border-white/10 bg-ink-100/60 px-3 py-2 sm:px-4">
                <div className="flex shrink-0 items-center gap-2">
                  <span className="size-2.5 rounded-full bg-threat-500/80" />
                  <span className="size-2.5 rounded-full bg-signal-300/80" />
                  <span className="size-2.5 rounded-full bg-ok-400/80" />
                </div>
                <span className="min-w-0 truncate text-center font-mono text-[10px] tracking-tight text-white/50 sm:text-[11px]">
                  ~ /soc/agents — zsh
                </span>
                <div className="flex shrink-0 items-center justify-end gap-1 text-[10px] text-white/50 sm:text-[11px]">
                  <Shield className="size-3 shrink-0 text-cyber-300" />
                  <span>secure</span>
                </div>
              </div>

              <div className="space-y-1.5 p-5 font-mono text-[13px] leading-relaxed text-white/85">
                <TypedLines
                  lines={[
                    { text: "$ whoami", className: "text-white/60" },
                    { text: profile.name.toLowerCase().replace(/ /g, "_"), className: "text-white" },
                    { text: "$ cat ~/role.txt", className: "text-white/60" },
                    { text: profile.role, className: "text-cyber-200" },
                    { text: "$ ls ~/focus --depth=1", className: "text-white/60" },
                    { text: "soc/ threat-hunting/ detection-engineering/", className: "text-ok-400" },
                    { text: "ai-agents/ rag/ llm-security/", className: "text-ok-400" },
                    { text: "cloud/ aws/ azure/ gcp/ hardening/", className: "text-ok-400" },
                    { text: "$ status --now", className: "text-white/60" },
                    { text: "◆ available — shipping + defending", className: "text-signal-300" },
                  ]}
                />
              </div>

              <div className="border-t border-white/10 bg-ink-100/60">
                <p className="px-4 pt-2 font-sans text-[11px] leading-snug text-white/45">
                  <span className="text-cyber-200/80">→</span> To actually type, use the console at
                  the bottom of the screen.
                </p>
                <div className="flex flex-col gap-1.5 px-4 py-2 text-[11px] text-white/50 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3 text-cyber-300" />
                    <span>
                      agent runtime: <span className="text-white/80">online</span>
                    </span>
                  </div>
                  <span className="font-mono text-white/40 sm:ml-auto">enc: TLS 1.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
