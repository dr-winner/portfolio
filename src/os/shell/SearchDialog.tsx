"use client";

/* Search, brief 3.8 and fix 2 of the phase 1 review: a lean, accessible
   command dialog with no dependencies. The full command palette (history,
   fuzzy scoring, recents) is Phase 2 work and is documented as such in
   the phase report. Groups: Suggested, Apps, Projects and System. The
   input is a labelled combobox whose popup is a listbox of options, so
   screen readers announce the result count through aria-activedescendant.
   Everything it runs is a real window open or a real link. */

import { useEffect, useMemo, useRef, useState } from "react";
import { dispatchWm } from "../wm/store";
import { publishedWork } from "@/content/work";

type SearchItem = {
  id: string;
  group: "Suggested" | "Apps" | "Projects" | "System";
  label: string;
  keywords: string;
  run(): void;
};

const GROUP_ORDER: SearchItem["group"][] = ["Suggested", "Apps", "Projects", "System"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose(): void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const all = useMemo<SearchItem[]>(() => {
    const app = (label: string, keywords: string, payload: { app: import("../types").AppId; id?: string; title?: string; props?: Record<string, string> }): SearchItem => ({
      id: `app:${payload.id ?? payload.app}`,
      group: "Apps",
      label,
      keywords,
      run: () => dispatchWm({ type: "open", payload }),
    });
    const items: SearchItem[] = [
      {
        id: "sug:projects",
        group: "Suggested",
        label: "Open Projects",
        keywords: "files work case studies labs index",
        run: () => dispatchWm({ type: "open", payload: { app: "files" } }),
      },
      {
        id: "sug:mail",
        group: "Suggested",
        label: "Hire me",
        keywords: "mail contact email availability",
        run: () => dispatchWm({ type: "open", payload: { app: "mail" } }),
      },
      {
        id: "sug:security",
        group: "Suggested",
        label: "How this site is secured",
        keywords: "security headers csp hsts report",
        run: () => dispatchWm({ type: "open", payload: { app: "security" } }),
      },
      {
        id: "sug:cv",
        group: "Suggested",
        label: "Download CV",
        keywords: "cv resume preview pdf",
        run: () => window.location.assign("/cv.pdf"),
      },
      app("Files", "projects index", { app: "files" }),
      app("Terminal", "commands shell", { app: "terminal" }),
      app("Proxy", "inspecting proxy traffic", { app: "proxy" }),
      app("Agent Lab", "llm attack scenarios", { app: "agent-lab" }),
      app("Findings", "cvss vulnerabilities", { app: "findings" }),
      app("Detections", "aws mitre att ck", { app: "detections" }),
      app("Welcome", "start here", { app: "welcome" }),
      app("Hello", "proof window manager temporary", { app: "hello" }),
      app("About", "bio experience certifications", { app: "about" }),
      app("Mail", "contact email", { app: "mail" }),
      app("Preview, the CV", "cv resume", { app: "preview" }),
      app("Settings", "preferences motion reduce", { app: "settings" }),
      app("Security", "headers report", { app: "security" }),
    ];
    for (const item of publishedWork) {
      items.push({
        id: `doc:${item.slug}`,
        group: "Projects",
        label: item.title,
        keywords: `${item.description} ${item.tags.join(" ")} ${item.badges.join(" ")}`,
        run: () => dispatchWm({ type: "open", payload: { app: "doc", id: `doc:${item.slug}`, title: item.title, props: { slug: item.slug } } }),
      });
    }
    items.push(
      {
        id: "sys:classic",
        group: "System",
        label: "Open the classic view",
        keywords: "document page home",
        run: () => window.location.assign("/?view=classic"),
      },
      {
        id: "sys:shortcuts",
        group: "System",
        label: "Keyboard shortcuts",
        keywords: "keys alt f6 help",
        run: () => dispatchWm({ type: "open", payload: { app: "settings", id: "settings:shortcuts", title: "Keyboard shortcuts", props: { slug: "shortcuts" } } }),
      },
    );
    return items;
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return all;
    return all.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(q));
  }, [all, q]);

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({ group, items: results.filter((item) => item.group === group) })).filter(
        (entry) => entry.items.length,
      ),
    [results],
  );

  /* The flat filtered list mirrors the rendered order for arrow keys. */
  const flat = useMemo(() => groups.flatMap((entry) => entry.items), [groups]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  if (!open) return null;

  const current = flat[Math.min(index, flat.length - 1)];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!flat.length) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setIndex((prev) => (Math.max(0, Math.min(flat.length - 1, prev)) + delta + flat.length) % flat.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (current) {
        onClose();
        current.run();
      }
    }
  };

  const choose = (item: SearchItem) => {
    onClose();
    item.run();
  };

  let flatPos = -1;

  return (
    <div className="wos-search-backdrop" onClick={onClose} role="presentation">
      <div
        className="wos-search"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="wos-search-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="wos-search-list"
          aria-activedescendant={current ? `wos-search-opt-${current.id}` : undefined}
          aria-label="Search apps, projects and system actions"
          placeholder="Search apps, projects and actions"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="wos-search-list" id="wos-search-list" role="listbox" aria-label="Search results" ref={listRef}>
          {groups.map((entry) => (
            <div key={entry.group} className="wos-search-group">
              <p className="wos-search-groupname">{entry.group}</p>
              {entry.items.map((item) => {
                flatPos += 1;
                const pos = flatPos;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`wos-search-opt-${item.id}`}
                    role="option"
                    aria-selected={pos === index ? "true" : "false"}
                    data-selected={pos === index ? "true" : "false"}
                    className="wos-search-item"
                    tabIndex={-1}
                    onMouseEnter={() => setIndex(pos)}
                    onClick={() => choose(item)}
                  >
                    <span className="wos-search-itemlabel">{item.label}</span>
                    <span className="wos-search-itemgroup">{item.group}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {!flat.length ? <p className="wos-search-empty">Nothing matches. Try an app name or a project title.</p> : null}
        </div>
      </div>
    </div>
  );
}
