"use client";

import { useEffect, useState, useMemo } from "react";
import { academyChapters } from "@/content/academy-lessons";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string, stepIdx?: number) => void;
}

export function AcademyCommandPalette({
  isOpen,
  onClose,
  onSelectLesson,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent("open-command-palette"));
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const allItems = useMemo(() => {
    const items: {
      lessonId: string;
      title: string;
      chapter: string;
      duration: string;
      difficulty: string;
      stepIdx: number;
      kind: "lesson" | "step" | "concept";
      subtitle?: string;
    }[] = [];

    academyChapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        // Main lesson item
        items.push({
          lessonId: l.id,
          title: l.title,
          chapter: `${ch.number}. ${ch.title.split("&")[0].trim()}`,
          duration: l.duration,
          difficulty: l.difficulty,
          stepIdx: 0,
          kind: "lesson",
          subtitle: l.subhead,
        });

        // Individual steps
        l.steps.forEach((st, idx) => {
          items.push({
            lessonId: l.id,
            title: st.title,
            chapter: `${l.title.split("&")[0].trim()} · Step ${st.stepNumber}`,
            duration: l.duration,
            difficulty: l.difficulty,
            stepIdx: idx,
            kind: "step",
            subtitle: st.subtitle,
          });
        });
      });
    });

    return items;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.chapter.toLowerCase().includes(q) ||
          (it.subtitle && it.subtitle.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [allItems, query]);

  if (!isOpen) return null;

  return (
    <div
      className="scale-command-backdrop"
      onClick={onClose}
    >
      <div
        className="scale-command-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="scale-command-searchbar">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#26201b]/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, attacks, or security concepts..."
            className="flex-1 bg-transparent font-mono text-[13.5px] text-[#26201b] placeholder-[#26201b]/40 outline-none"
          />
          <kbd className="rounded border border-[#26201b]/30 bg-[#ede5d8] px-1.5 py-0.5 font-mono text-[10px] text-[#26201b]/70 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="scale-command-results space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center font-mono text-[12px] text-[#26201b]/50">
              No matching lessons or concepts found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={`${item.lessonId}-${item.stepIdx}-${idx}`}
                type="button"
                onClick={() => {
                  onSelectLesson(item.lessonId, item.stepIdx);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-[#c5e8b7]/40 hover:border-[#26201b] border border-transparent group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 font-mono text-[10.5px] text-[#26201b]/60">
                    <span className="font-bold text-[#10b981] uppercase">
                      {item.kind === "step" ? "STEP" : "LESSON"}
                    </span>
                    <span>•</span>
                    <span className="truncate">{item.chapter}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-[13px] font-bold text-[#26201b] truncate group-hover:text-[#1b4332]">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="text-[11px] text-[#26201b]/70 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                  <span className="rounded bg-[#ede5d8] px-1.5 py-0.5 text-[#26201b]/70">
                    {item.difficulty}
                  </span>
                  <span className="text-[#26201b]/40">→</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="scale-command-footer">
          <span>Navigate lessons & concepts</span>
          <span>Press [Esc] to exit</span>
        </div>
      </div>
    </div>
  );
}
