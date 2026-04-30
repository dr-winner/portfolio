"use client";

import { ArrowUpRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import { Card } from "@/components/Card";
import { track } from "@/lib/telemetry.client";

export function Contact() {
  function mailto() {
    track("contact_button", { path: "/#contact" });
    window.location.href = `mailto:${profile.email}?subject=Let%27s%20build%20something&body=Hi%20Richard%2C%20`;
  }

  return (
    <section id="contact" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <Card className="relative overflow-hidden p-6 sm:p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-soft opacity-30" aria-hidden />
          <div className="absolute -top-24 -right-20 size-[360px] rounded-full bg-cyber-300/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 -left-20 size-[340px] rounded-full bg-signal-300/10 blur-3xl" aria-hidden />

          <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="chip-cyber font-mono text-[10px] uppercase tracking-[0.2em]">
                /contact
              </span>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-slate-900 md:text-5xl dark:text-white">
                Have a system that needs building — <span className="text-gradient-cyber">or defending?</span>
              </h2>
              <p className="mt-4 max-w-xl text-slate-600 md:text-lg dark:text-white/70">
                I&apos;m open to SOC, detection-engineering, and AI-agent roles, and to select contract
                work. The fastest way in is email.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={mailto}
                  className="group inline-flex min-w-0 w-full max-w-full items-center justify-start gap-2 rounded-xl bg-gradient-to-r from-cyber-300 to-signal-300 px-4 py-3 text-left text-sm font-semibold text-ink shadow-glow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 sm:w-auto sm:max-w-none sm:px-5"
                  title={`Email ${profile.name}`}
                  aria-label="Send email (opens your mail app)"
                >
                  <Mail className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 break-words sm:break-normal">{profile.emailObfuscated}</span>
                  <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300/90 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-cyber-400/40 hover:text-slate-950 sm:w-auto sm:justify-start dark:border-white/15 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-cyber-300/40 dark:hover:text-white"
                >
                  LinkedIn
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white/90 p-5 font-mono text-[13px] text-slate-800 backdrop-blur dark:border-white/10 dark:bg-ink/60 dark:text-[#e6ecf7]">
              <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                <Sparkles className="size-3.5 text-cyber-300" />
                <span>what to include</span>
              </div>
              <ul className="mt-3 space-y-2 text-slate-700 dark:text-white/75">
                <li>
                  ▸ <span className="text-cyber-700 dark:text-cyber-300">role</span> or brief
                </li>
                <li>
                  ▸ <span className="text-cyber-700 dark:text-cyber-300">timeline</span> and urgency
                </li>
                <li>
                  ▸ <span className="text-cyber-700 dark:text-cyber-300">stack</span> / environment
                </li>
                <li>
                  ▸ <span className="text-cyber-700 dark:text-cyber-300">risk model</span> (if any)
                </li>
              </ul>
              <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-[11px] text-slate-500 dark:border-white/10 dark:text-white/50">
                <ShieldCheck className="size-3.5 text-ok-400" />
                <span>I respond within 24h — PGP on request.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
