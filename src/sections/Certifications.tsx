"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, BadgeCheck, GraduationCap, Loader2 } from "lucide-react";
import { certifications as seedCerts, type Cert } from "@/content/certifications";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

const statusMeta: Record<Cert["status"], { label: string; icon: typeof BadgeCheck; className: string; bar: string }> = {
  earned: {
    label: "Earned",
    icon: BadgeCheck,
    className: "text-emerald-700 dark:text-ok-400",
    bar: "from-emerald-500 to-cyan-500 dark:from-ok-400 dark:to-cyber-400",
  },
  pursuing: {
    label: "Pursuing",
    icon: GraduationCap,
    className: "text-amber-700 dark:text-signal-300",
    bar: "from-amber-500 to-cyan-500 dark:from-signal-300 dark:to-cyber-300",
  },
  "in-progress": {
    label: "In progress",
    icon: Loader2,
    className: "text-cyan-700 dark:text-cyber-300",
    bar: "from-cyan-600 to-cyan-700 dark:from-cyber-300 dark:to-cyber-500",
  },
};

export function Certifications({ items }: { items?: Cert[] } = {}) {
  const list = items?.length ? items : seedCerts;

  return (
    <section id="certifications" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Credentials"
            title="What I'm earning, and what I'm sharpening."
            description="A live look at the certifications I'm pursuing — with the modules, exam codes, and where I'm at."
          />
        </ScrollReveal>

        <div className="mt-16 md:mt-24 grid gap-8 md:gap-10 lg:grid-cols-2">
          {list.map((cert, i) => {
            const S = statusMeta[cert.status];
            const Icon = S.icon;
            const progress = typeof cert.progress === "number" ? cert.progress : null;
            return (
              <ScrollReveal key={cert.name} from={i % 2 === 0 ? "left" : "right"} amount={36}>
                <motion.div
                  className="h-full"
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 380, damping: 26 } }}
                >
                <Card className="h-full p-8 md:p-10 flex flex-col transition-shadow duration-300 hover:shadow-glow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl tracking-tight text-slate-900 md:text-2xl dark:text-white">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-white/50">{cert.issuer}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {cert.examCode && (
                          <span className="inline-flex rounded-md border border-slate-200/90 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
                            Exam: {cert.examCode}
                          </span>
                        )}
                        {cert.targetDate && (
                          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
                            Target: {cert.targetDate}
                          </span>
                        )}
                        {cert.year && !cert.targetDate && (
                          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
                            Earned: {cert.year}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={clsx(
                        "inline-flex shrink-0 self-start items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] dark:border-white/10 dark:bg-white/[0.03]",
                        S.className
                      )}
                    >
                      <Icon className="size-3" />
                      {S.label}
                    </span>
                  </div>

                  <p className="mt-6 text-[15px] leading-[1.65] text-slate-700 dark:text-white/70">
                    {cert.description}
                  </p>

                  {progress !== null && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-white/45">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/90 dark:bg-white/[0.06]">
                        <div
                          className={clsx(
                            "h-full rounded-full bg-gradient-to-r shadow-glow-sm",
                            S.bar
                          )}
                          style={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {(cert.modules?.length || cert.skills?.length) && (
                    <div className="my-7 divider-hair" />
                  )}

                  {cert.modules && cert.modules.length > 0 && (
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">
                        Domains on the syllabi
                      </span>
                      <ol className="mt-4 list-inside list-decimal space-y-2.5 text-[14px] text-slate-700 marker:text-cyber-600/70 dark:text-white/75 dark:marker:text-cyber-300/60">
                        {cert.modules.map((m) => (
                          <li key={m} className="pl-1">
                            {m}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="mt-8">
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">
                        Skills & domains
                      </span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cert.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 py-1.5 text-[12px] text-slate-700 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cert.link && (
                    <div className="mt-auto border-t border-slate-200/90 pt-8 text-xs text-slate-600 dark:border-white/10 dark:text-white/50">
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-slate-700 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
                      >
                        Official syllabus
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  )}
                </Card>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
