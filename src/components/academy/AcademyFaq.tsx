"use client";

import { useState } from "react";
import { academyCohort } from "@/content/academy";

export function AcademyFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  function toggle(idx: number) {
    setOpenIdx((current) => (current === idx ? null : idx));
  }

  return (
    <div className="grid gap-3">
      {academyCohort.faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={faq.q}
            className={`rounded-xl border transition-colors ${
              isOpen
                ? "border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]"
                : "border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_40%,transparent)] hover:border-[var(--line-strong)]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="text-[14.5px] font-medium leading-snug text-[var(--fg)]">
                {faq.q}
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] font-mono text-[12px] text-[var(--fg-subtle)] transition-transform duration-200 ${
                  isOpen ? "rotate-45 text-[var(--signal)] border-[var(--signal)]" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-[var(--line)] px-5 pb-5 pt-3">
                <p className="text-[13.5px] leading-relaxed text-[var(--fg-muted)]">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
