"use client";

import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { ArrowUpRight, Brain, Coffee, Mountain, Music, Terminal } from "lucide-react";
import { profile } from "@/content/profile";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";

const signals = [
  { icon: Terminal, label: "Run CLI over GUI whenever possible" },
  { icon: Brain, label: "Curious about how adversaries really think" },
  { icon: Mountain, label: "Long walks when a problem refuses to solve" },
  { icon: Music, label: "Deep-focus music while hunting logs" },
  { icon: Coffee, label: "Coffee-driven development, lightly caffeinated" },
];

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <SectionHeader
          eyebrow="About"
          title="Who I am"
          description="No fluff. Just what I do and why."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-3"
          >
            <Card className="h-full p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="chip-ocean font-mono text-[10px] uppercase tracking-[0.2em]">
                  bio.md
                </span>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-slate-700 md:text-[15px] dark:text-white/75">
                {profile.bio.map((p, i) => (
                  <p key={i}>
                    <Balancer>{p}</Balancer>
                  </p>
                ))}
                <p className="text-slate-600 dark:text-white/75">
                  If you&apos;re building something ambitious that needs to be fast, well-instrumented,
                  and hard to compromise — we should talk.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-white/10">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-ocean-600 transition-colors hover:text-ocean-700 dark:text-ocean-300 dark:hover:text-ocean-200"
                >
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  View full CV
                </a>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="md:col-span-2"
          >
            <Card className="h-full p-6 md:p-8">
              <span className="chip-ocean font-mono text-[10px] uppercase tracking-[0.2em]">
                signals.txt
              </span>
              <h3 className="mt-5 font-display text-xl tracking-tight text-slate-900 dark:text-white">
                How I work
              </h3>
              <ul className="mt-5 space-y-3">
                {signals.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-start gap-3 text-sm text-slate-700 dark:text-white/75">
                    <Icon className="mt-0.5 size-4 flex-shrink-0 text-ocean-600 dark:text-ocean-300" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
