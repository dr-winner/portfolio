"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cvHref, mailto, site } from "@/content/site";
import { work } from "@/content/work";
import { paletteFindings, sqliFinding } from "@/lib/palette-data";
import { classify, type PresetId } from "@/lib/trace";

type Row = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  severity?: string;
  cvss?: string;
  run: () => void;
};

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [copied, setCopied] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  function go(href: string) {
    onClose();
    if (href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf")) {
      window.location.href = href;
      return;
    }
    router.push(href);
  }

  function runTrace(id: PresetId) {
    onClose();
    const fire = () => {
      window.dispatchEvent(new CustomEvent("trace:run", { detail: id }));
      document.getElementById("hero")?.scrollIntoView();
    };
    if (window.location.pathname !== "/") {
      router.push("/");
      window.setTimeout(fire, 500);
    } else {
      fire();
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function toggleTheme() {
    const next = document.documentElement.classList.contains("light") ? "dark" : "light";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event("theme:changed"));
  }

  const detections = useMemo(() => {
    const section = work.find((item) => item.slug === "aws-threat-detection-as-code")?.sections.find((item) => item.id === "detections");
    return (section?.paragraphs ?? []).map((paragraph) => {
      const head = paragraph.split(". ")[0] ?? paragraph;
      const [name, ...rest] = head.split(", ");
      return { name, attack: rest.join(", "), href: "/work/aws-threat-detection-as-code" };
    });
  }, []);

  const rows = useMemo<Row[]>(() => {
    const q = query.trim().toLowerCase();
    if (classify("sqli", query) === "block" && q.length > 2) {
      return [
        {
          id: "egg-sqli",
          group: "Blocked",
          label: "Nice try. Blocked by rule auth.sqli.",
          severity: "BLOCKED",
          run: () => undefined,
        },
      ];
    }
    if (q === "whoami") {
      return [
        {
          id: "egg-who",
          group: "Result",
          label: "drWinner. Application Security. Accra, Ghana.",
          run: () => undefined,
        },
      ];
    }
    if (q === "sudo hire drwinner") {
      return [
        {
          id: "egg-sudo",
          group: "Actions",
          label: "sudo hire drwinner",
          run: () => {
            window.dispatchEvent(new CustomEvent("site-toast", { detail: "Permission granted." }));
            onClose();
            window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Application security role")}`;
          },
        },
      ];
    }

    const pages = [
      ["/", "Home"],
      ["/work", "Work"],
      ["/about", "About"],
      ["/contact", "Contact"],
      ["/security", "Security"],
    ].map(([href, label]) => ({
      id: `page-${href}`,
      group: "Pages",
      label,
      run: () => go(href),
    }));

    const studies = work
      .filter((item) => item.kind !== "archive" || item.link)
      .filter((item) => item.slug !== "proof9")
      .map((item) => ({
        id: `work-${item.slug}`,
        group: "Work",
        label: item.title,
        run: () => (item.kind === "archive" && item.link ? go(item.link) : go(`/work/${item.slug}`)),
      }));

    const findings: Row[] = [
      ...paletteFindings.map((item) => ({
        id: `find-${item.index}`,
        group: "Findings",
        label: `${item.index} ${item.title}`,
        keywords: "cvss",
        severity: item.severity,
        cvss: item.cvss,
        run: () => go(item.href),
      })),
      {
        id: "find-sqli",
        group: "Findings",
        label: sqliFinding.title,
        keywords: "sqli sql injection cvss",
        severity: sqliFinding.severity,
        cvss: sqliFinding.cvss,
        run: () => go(sqliFinding.href),
      },
    ];

    const rules: Row[] = detections.map((item) => ({
      id: `det-${item.name}`,
      group: "Detections",
      label: item.attack ? `${item.name}, ${item.attack}` : item.name,
      run: () => go(item.href),
    }));

    const actions: Row[] = [
      { id: "act-cv", group: "Actions", label: "Download CV", run: () => go(cvHref) },
      { id: "act-mail", group: "Actions", label: copied ? "Copied" : "Copy email", run: () => void copyEmail() },
      { id: "act-email", group: "Actions", label: "Email me", run: () => go(mailto) },
      { id: "act-sqli", group: "Actions", label: "Run the SQL injection trace", keywords: "sqli sql", run: () => runTrace("sqli") },
      { id: "act-idor", group: "Actions", label: "Run the IDOR trace", keywords: "idor", run: () => runTrace("idor") },
      { id: "act-prompt", group: "Actions", label: "Run the prompt injection trace", keywords: "prompt", run: () => runTrace("prompt") },
      { id: "act-theme", group: "Actions", label: "Switch theme", run: () => toggleTheme() },
    ];

    const suggested: Row[] = [
      { id: "sug-work", group: "Suggested", label: "View my work", run: () => go("/work") },
      { id: "sug-sqli", group: "Suggested", label: "Run the SQL injection trace", keywords: "sqli sql", run: () => runTrace("sqli") },
      { id: "sug-lab", group: "Suggested", label: "Open the agent lab", keywords: "agent lab", run: () => go("/#see-it-work") },
      { id: "sug-cv", group: "Suggested", label: "Download CV", run: () => go(cvHref) },
      { id: "sug-mail", group: "Suggested", label: "Email me", run: () => go(mailto) },
    ];

    const all: Row[] = [...suggested, ...pages, ...studies, ...findings, ...rules, ...actions];
    if (!q) return all;
    return all.filter((row) => `${row.label} ${row.cvss ?? ""} ${row.keywords ?? ""}`.toLowerCase().includes(q));
    // go and runTrace close over router. Recomputed when the query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, copied, detections]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    returnFocus.current =
      previous && previous !== document.body && previous !== document.documentElement
        ? previous
        : document.querySelector<HTMLElement>("[data-search-trigger]");
    const frame = requestAnimationFrame(() => setEntered(true));
    inputRef.current?.focus();
    const html = document.documentElement;
    const previousHtml = html.style.overflow;
    const previousBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      html.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
      returnFocus.current?.focus();
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => (rows.length === 0 ? 0 : (value + 1) % rows.length));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => (rows.length === 0 ? 0 : (value - 1 + rows.length) % rows.length));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        rows[active]?.run();
      }
      if (event.key === "Tab" && shellRef.current) {
        const focusable = Array.from(shellRef.current.querySelectorAll<HTMLElement>("button, input, a")).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose, rows]);

  useEffect(() => {
    const row = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    const mark = listRef.current?.querySelector<HTMLElement>("[data-highlight]");
    if (!row || !mark || !listRef.current) return;
    const list = listRef.current.getBoundingClientRect();
    const box = row.getBoundingClientRect();
    mark.style.transform = `translateY(${box.top - list.top + listRef.current.scrollTop}px)`;
    mark.style.height = `${box.height}px`;
  }, [active, rows]);

  const groups = rows.reduce<string[]>((list, row) => (list.includes(row.group) ? list : [...list, row.group]), []);
  const current = rows[active];

  return (
    <div className={`palette-root ${entered ? "is-in" : ""}`} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div
        ref={shellRef}
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={current ? `palette-opt-${current.id}` : undefined}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value.slice(0, 200))}
          placeholder="Search pages, work, findings"
          className="palette-input"
        />
        <div id="palette-list" ref={listRef} role="listbox" className="palette-list">
          <span aria-hidden data-highlight className="palette-highlight" />
          {groups.map((group) => (
            <div key={group}>
              <p className="palette-group">{group}</p>
              {rows.map((row, index) =>
                row.group === group ? (
                  <button
                    key={row.id}
                    id={`palette-opt-${row.id}`}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    data-index={index}
                    className="palette-row"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => row.run()}
                  >
                    <span>{row.label}</span>
                    {row.severity ? <span className={`sev ${row.severity === "BLOCKED" ? "sev-signal badge-pop" : "sev-high"}`}>{row.severity}</span> : null}
                    {row.cvss ? <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{row.cvss}</span> : null}
                  </button>
                ) : null,
              )}
            </div>
          ))}
          {rows.length === 0 ? <p className="px-4 py-6 text-[14px] text-[var(--fg-subtle)]">No matches.</p> : null}
        </div>
        <div className="palette-foot">
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
