"use client";

import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { Brain, Coffee, Mountain, Music, Terminal } from "lucide-react";
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
          title="A quick read on who I am"
          description="Short on fluff, long on why I do the work."
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
                <span className="chip-cyber font-mono text-[10px] uppercase tracking-[0.2em]">
                  bio.md
                </span>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-slate-700 md:text-[15px] dark:text-white/75">
                {profile.bio.map((p, i) => (
                  <p key={i}>
                    <Balancer>{p}</Balancer>
                  </p>
                ))}
                <p className="text-slate-600 dark:text-white/60">
                  If you&apos;re building something ambitious that needs to be fast, well-instrumented,
                  and hard to compromise — we should talk.
                </p>
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
              <span className="chip-cyber font-mono text-[10px] uppercase tracking-[0.2em]">
                signals.txt
              </span>
              <h3 className="mt-5 font-display text-xl tracking-tight text-slate-900 dark:text-white">
                Small things about how I work
              </h3>
              <ul className="mt-5 space-y-3">
                {signals.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-start gap-3 text-sm text-slate-700 dark:text-white/75">
                    <Icon className="mt-0.5 size-4 flex-shrink-0 text-cyber-600 dark:text-cyber-300" />
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
