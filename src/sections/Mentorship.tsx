"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Cloud, Shield, Terminal, Zap } from "lucide-react";

const highlights = [
  { icon: Terminal, text: "Hands-on labs: SIEM, EDR, cloud logging, detection engineering" },
  { icon: Shield,   text: "Real-world threat hunts and incident response walkthroughs" },
  { icon: Cloud,    text: "AWS / Azure / GCP hardening from identity to control plane" },
  { icon: Zap,      text: "Weekly check-ins + a public portfolio of labs you can show hiring managers" },
];

export function Mentorship() {
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount]     = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? null))
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setCount((c) => (c ?? 0) + 1);
      }
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="mentorship" className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-cyber-400/[0.06] blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 size-[500px] rounded-full bg-signal-300/[0.05] blur-3xl" />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyber-400/30 bg-cyber-400/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-cyber-600 dark:border-cyber-300/25 dark:bg-cyber-300/[0.08] dark:text-cyber-300">
            <span className="size-1.5 rounded-full bg-cyber-400 dark:bg-cyber-300 animate-pulse-soft" />
            Launching soon · Join the waitlist
          </span>

          <h2 className="mt-6 font-display text-4xl tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.5rem]">
            <span className="text-gradient-cyber">Break Into Cloud Security</span>
            <span className="block">— a hands-on study cohort</span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-white/75">
            Learn cloud security the way it actually sticks: build real cloud environments,
            break them, defend them, and turn every lab into portfolio proof. I&apos;m walking
            the same road — SOC floor to cloud security — and sharing everything that works.
          </p>
        </div>

        {/* Highlights grid */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
          {highlights.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/60 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-ink-100/40"
            >
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-cyber-400/30 bg-cyber-400/10 text-cyber-600 dark:border-cyber-300/20 dark:bg-cyber-300/[0.08] dark:text-cyber-300">
                <Icon className="size-4" />
              </div>
              <p className="text-[15px] leading-snug text-slate-700 dark:text-white/80">{text}</p>
            </div>
          ))}
        </div>

        {/* Waitlist form */}
        <div className="mx-auto mt-14 max-w-xl">
          <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-ink-100/60 sm:p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-6 text-center"
                >
                  <CheckCircle2 className="size-10 text-ok-400" />
                  <div>
                    <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                      You&apos;re on the list.
                    </p>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-white/60">
                      I&apos;ll reach out with launch details and early-access info.
                    </p>
                  </div>
                  {count !== null && (
                    <p className="font-mono text-[13px] text-cyber-600 dark:text-cyber-300">
                      {count} {count === 1 ? "person" : "people"} ahead of the launch.
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                      Reserve your spot
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
                      First cohort is limited. Be the first to know when doors open.
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyber-400/60 focus:ring-2 focus:ring-cyber-400/20 dark:border-white/10 dark:bg-ink-200/60 dark:text-white dark:placeholder:text-white/35 dark:focus:border-cyber-300/40"
                  />

                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyber-400/60 focus:ring-2 focus:ring-cyber-400/20 dark:border-white/10 dark:bg-ink-200/60 dark:text-white dark:placeholder:text-white/35 dark:focus:border-cyber-300/40"
                  />

                  {status === "error" && (
                    <p className="text-[13px] text-rose-600 dark:text-threat-400">{message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-300 to-signal-300 px-5 py-3.5 text-sm font-semibold text-ink shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
                  >
                    {status === "loading" ? "Joining…" : "Join the waitlist"}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <div className="flex items-center justify-between text-[12px] text-slate-400 dark:text-white/40">
                    <span>No spam. Unsubscribe anytime.</span>
                    {count !== null && count > 0 && (
                      <span className="font-mono text-cyber-600 dark:text-cyber-300">
                        {count} already joined
                      </span>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
