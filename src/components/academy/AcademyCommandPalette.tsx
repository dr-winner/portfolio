"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { academyChapters } from "@/content/academy-lessons";
import { DtsIcon, DtsFolder } from "./AcademyIcons";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allItems = useMemo(() => {
    const items: {
      lessonId: string;
      title: string;
      chapter: string;
      duration: string;
      difficulty: string;
      stepIdx: number;
      kind: "lesson" | "step";
      subtitle?: string;
      folderColor: "sand" | "green" | "violet";
    }[] = [];

    academyChapters.forEach((ch) => {
      const color: "sand" | "green" | "violet" =
        ch.number === "01" ? "sand" : ch.number === "02" ? "green" : "violet";

      ch.lessons.forEach((l) => {
        items.push({
          lessonId: l.id,
          title: l.title,
          chapter: `${ch.number}. ${ch.title.split("&")[0].trim()}`,
          duration: l.duration,
          difficulty: l.difficulty,
          stepIdx: 0,
          kind: "lesson",
          subtitle: l.subhead,
          folderColor: color,
        });

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
            folderColor: color,
          });
        });
      });
    });

    return items;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.chapter.toLowerCase().includes(q) ||
          (it.subtitle && it.subtitle.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [allItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      const item = filtered[selectedIndex];
      onSelectLesson(item.lessonId, item.stepIdx);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sx is-open" role="dialog" aria-modal="true" aria-label="Search the course">
      <div className="sx__backdrop" onClick={onClose} />
      <div className="sx__dialog" onKeyDown={handleKeyDownInList}>
        <div className="sx__bar">
          <DtsIcon name="search" size={19} stroke={2.2} className="sx__glass" />
          <input
            ref={inputRef}
            className="sx__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="sx-list"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, concepts, attacks…"
            spellCheck={false}
            autoComplete="off"
          />
          {query && (
            <button
              className="sx__clear"
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              Clear
            </button>
          )}
          <button className="sx__esc" type="button" aria-label="Close search" onClick={onClose}>
            esc
          </button>
        </div>

        <div className="sx__list" id="sx-list" role="listbox" aria-label="Results">
          {filtered.length === 0 ? (
            <div className="sx__empty">
              <div className="sx__empty-title">No matching lessons found</div>
              <p>Try searching for BOLA, SQL injection, SSRF, prompt injection, or JWT</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSel = idx === selectedIndex;
              return (
                <div
                  key={`${item.lessonId}-${item.stepIdx}-${idx}`}
                  className={`sx__item ${isSel ? "is-sel" : ""}`}
                  role="option"
                  aria-selected={isSel}
                  onClick={() => {
                    onSelectLesson(item.lessonId, item.stepIdx);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className={`sx__icon ${item.kind === "step" ? "sx__icon--step" : "sx__icon--lesson"}`}>
                    {item.kind === "step" ? (
                      item.stepIdx + 1
                    ) : (
                      <DtsFolder color={item.folderColor} />
                    )}
                  </span>
                  <span className="sx__main">
                    <span className="sx__title">
                      {item.title}
                      <span className="sx__meta">{item.chapter}</span>
                    </span>
                    {item.subtitle && <span className="sx__text">{item.subtitle}</span>}
                  </span>
                  <span className="sx__side">
                    <span className="sx__chip">{item.difficulty}</span>
                    <kbd className="sx__enter">↵</kbd>
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="sx__foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
          <span className="sx__count">{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
