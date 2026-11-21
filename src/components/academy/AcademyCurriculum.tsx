"use client";

import { useState } from "react";
import Link from "next/link";
import { academyCohort, type AcademyModule } from "@/content/academy";

export function AcademyCurriculum() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeModule: AcademyModule = academyCohort.modules[activeIdx] ?? academyCohort.modules[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start text-[#26201b]">
      {/* Module Selector Navigation */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#26201b]/60 mb-2">
          Syllabus Architecture (8 Weeks)
        </p>

        {academyCohort.modules.map((mod, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`group relative flex items-start gap-3.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                isSelected
                  ? "border-[#26201b] bg-[#c5e8b7]/30 shadow-[2px_2px_0px_#26201b]"
                  : "border-[#26201b]/20 bg-[#ffffff] hover:border-[#26201b]/50"
              }`}
            >
              {/* Active indicator bar */}
              <span
                className={`absolute inset-y-2 left-0 w-1.5 rounded-r-full bg-[#10b981] transition-opacity duration-200 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}
              />

              <span
                className={`font-mono text-[13px] font-bold tracking-wider pl-1 ${
                  isSelected ? "text-[#1b4332]" : "text-[#26201b]/60 group-hover:text-[#26201b]"
                }`}
              >
                {mod.n}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[13.5px] font-bold leading-snug ${
                      isSelected ? "text-[#1b4332]" : "text-[#26201b]/80 group-hover:text-[#26201b]"
                    }`}
                  >
                    {mod.title}
                  </span>
                  <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#26201b]/50">
                    {mod.domain}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-[12px] text-[#26201b]/70">{mod.summary}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Module Deep-Dive Inspector */}
      <div className="rounded-2xl border-2 border-[#26201b] bg-[#ffffff] p-6 sm:p-7 shadow-[2px_2px_0px_#26201b] min-h-[420px]">
        <div key={activeModule.id} className="flex flex-col animate-[fadeIn_0.2s_ease-out]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#26201b]/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#10b981]">
                Module {activeModule.n}
              </span>
              <span className="text-[#26201b]/30">/</span>
              <span className="font-mono text-[11.5px] font-bold text-[#26201b]/70">{activeModule.domain}</span>
            </div>
            <span className="rounded-full border border-[#26201b]/30 bg-[#f5efe6] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#26201b]/80">
              2 Weeks
            </span>
          </div>

          {/* Title & Summary */}
          <h3 className="mt-4 text-[20px] sm:text-[22px] font-mono font-bold leading-snug tracking-tight text-[#26201b]">
            {activeModule.title}
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#26201b]/80">{activeModule.summary}</p>

          {/* Core Syllabus Topics */}
          <div className="mt-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#26201b]/60">
              Core Engineering Topics
            </p>
            <ul className="mt-3 grid gap-2">
              {activeModule.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[#26201b]/80">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#10b981]" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hands-On Lab Project */}
          <div className="mt-6 rounded-xl border-2 border-[#26201b]/20 bg-[#f5efe6] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#1b4332]">
                Hands-on Engineering Teardown
              </span>
              <span className="font-mono text-[10.5px] text-[#26201b]/50">Graded Lab</span>
            </div>
            <p className="mt-1.5 font-mono text-[13.5px] font-bold text-[#26201b]">
              {activeModule.labProject.title}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#26201b]/70">
              {activeModule.labProject.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md border border-[#26201b]/20 bg-[#ffffff] px-2 py-0.5 font-mono text-[10.5px] text-[#26201b]/80">
                Deliverable: {activeModule.labProject.deliverable}
              </span>
              <span className="rounded-md border border-[#26201b]/20 bg-[#c5e8b7] px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#1b4332]">
                Standard: {activeModule.labProject.standard}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex items-center justify-between border-t border-[#26201b]/10 pt-4">
            <span className="font-mono text-[11.5px] text-[#26201b]/60">
              Prerequisites: Web HTTP, Basic JS/Python/Go
            </span>
            <Link
              href="#apply"
              className="scale-btn-next !py-1.5 !px-3.5 !text-[12px] no-underline"
            >
              <span>Apply for Cohort</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
