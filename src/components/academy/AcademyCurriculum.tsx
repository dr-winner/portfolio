"use client";

import { useState } from "react";
import Link from "next/link";
import { academyCohort, type AcademyModule } from "@/content/academy";

export function AcademyCurriculum() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeModule: AcademyModule = academyCohort.modules[activeIdx] ?? academyCohort.modules[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      {/* Module Selector Navigation */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)] mb-2">
          Syllabus Architecture (8 Weeks)
        </p>

        {academyCohort.modules.map((mod, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`group relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[var(--signal)] bg-[var(--signal-soft)] shadow-sm"
                  : "border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {/* Active indicator bar */}
              <span
                className={`absolute inset-y-2 left-0 w-1 rounded-r-full bg-[var(--signal)] transition-opacity duration-200 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}
              />

              <span
                className={`font-mono text-[12px] font-semibold tracking-wider transition-colors duration-150 ${
                  isSelected ? "text-[var(--signal)]" : "text-[var(--fg-subtle)] group-hover:text-[var(--fg)]"
                }`}
              >
                {mod.n}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[14px] font-medium leading-snug transition-colors duration-150 ${
                      isSelected ? "text-[var(--fg)]" : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]"
                    }`}
                  >
                    {mod.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-subtle)]">
                    {mod.domain}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-[12px] text-[var(--fg-subtle)]">{mod.summary}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Module Deep-Dive Inspector */}
      <div className="panel relative overflow-hidden p-6 sm:p-8 border border-[var(--line-strong)] min-h-[420px]">
        <div key={activeModule.id} className="flex flex-col animate-[fadeIn_0.2s_ease-out]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--signal)]">
                Module {activeModule.n}
              </span>
              <span className="text-[var(--line-strong)]">/</span>
              <span className="font-mono text-[11.5px] text-[var(--fg-muted)]">{activeModule.domain}</span>
            </div>
            <span className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--fg-subtle)]">
              2 Weeks
            </span>
          </div>

          {/* Title & Summary */}
          <h3 className="mt-4 text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-tight text-[var(--fg)]">
            {activeModule.title}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">{activeModule.summary}</p>

          {/* Core Syllabus Topics */}
          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
              Core Engineering Topics
            </p>
            <ul className="mt-3 grid gap-2">
              {activeModule.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal)]" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hands-On Lab Project Box */}
          <div className="mt-7 rounded-xl border border-[var(--line)] bg-[var(--bg-deep)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--signal)]">
                Hands-On Capstone Project
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--fg-subtle)]">
                {activeModule.labProject.standard}
              </span>
            </div>
            <p className="mt-2 font-mono text-[14px] font-medium text-[var(--fg)]">
              {activeModule.labProject.title}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
              {activeModule.labProject.description}
            </p>
            <div className="mt-3 flex items-baseline gap-2 border-t border-[var(--line)] pt-3 text-[12px]">
              <span className="font-mono text-[11px] text-[var(--fg-subtle)] uppercase">Proof:</span>
              <span className="font-mono text-[12px] text-[var(--signal)]">
                {activeModule.labProject.deliverable}
              </span>
            </div>
          </div>

          {/* Skills Tag Cloud */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {activeModule.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[10.5px] text-[var(--fg-subtle)]"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Associated live case study deep-link */}
          {activeModule.id === "module-1" && (
            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <Link
                href="/work/healthcare-portal-pentest-lab"
                className="link-sweep inline-flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--signal)] no-underline"
              >
                Inspect existing lab finding report (Healthcare SQLi & Auth Bypass) →
              </Link>
            </div>
          )}
          {activeModule.id === "module-2" && (
            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <Link
                href="/work/llm-agent-security-lab"
                className="link-sweep inline-flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--signal)] no-underline"
              >
                Try the live LLM & Agent Security interactive lab →
              </Link>
            </div>
          )}
          {activeModule.id === "module-3" && (
            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <Link
                href="/work/aws-threat-detection-as-code"
                className="link-sweep inline-flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--signal)] no-underline"
              >
                Inspect 6 AWS detections written in Terraform & mapped to MITRE ATT&CK →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
