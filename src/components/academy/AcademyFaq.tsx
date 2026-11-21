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
            className={`rounded-xl border-2 transition-all ${
              isOpen
                ? "border-[#26201b] bg-[#ffffff] shadow-[2px_2px_0px_#26201b]"
                : "border-[#26201b]/20 bg-[#ffffff]/60 hover:border-[#26201b]/40 hover:bg-[#ffffff]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left"
            >
              <span className="text-[14.5px] font-mono font-bold leading-snug text-[#26201b]">
                {faq.q}
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-[#26201b] font-mono text-[13px] font-black text-[#26201b] transition-transform duration-200 ${
                  isOpen ? "rotate-45 bg-[#c5e8b7] text-[#1b4332]" : "bg-[#f5efe6]"
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-[#26201b]/10 px-4 sm:px-5 pb-5 pt-3">
                <p className="text-[13.5px] leading-relaxed text-[#26201b]/80">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
