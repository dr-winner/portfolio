"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cvHref, site } from "@/content/site";
import { work } from "@/content/work";
import { paletteFindings, sqliFinding } from "@/lib/palette-data";
import { classify, type PresetId } from "@/lib/trace";
import { announce } from "@/lib/motion";

type RowKind = "page" | "work" | "security" | "action" | "finding" | "detection";

type Row = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  severity?: string;
  cvss?: string;
  kind?: RowKind;
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
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
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
      announce("Email address copied to clipboard.");
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
    announce(`Switched to ${next} theme.`);
  }

  function jumpToSection(sectionId: string, fallbackPath: string) {
    onClose();
    if (window.location.pathname === "/") {
      const el = document.getElementById(sectionId) ?? document.querySelector(`[data-scene="${sectionId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(fallbackPath);
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
          kind: "action",
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
          kind: "action",
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
          kind: "action",
          run: () => {
            window.dispatchEvent(new CustomEvent("site-toast", { detail: "Permission granted." }));
            onClose();
            window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Application security role")}`;
          },
        },
      ];
    }

    // Security Domains Group
    const securityDomains: Row[] = [
      {
        id: "sec-owasp-llm",
        group: "Security Domains",
        label: "OWASP LLM Top 10 (2025)",
        hint: "AI/LLM Agent Lab",
        keywords: "owasp llm top 10 ai prompt injection rag cross tenant ssrf bola agent security",
        kind: "security",
        run: () => go("/work/llm-agent-security-lab"),
      },
      {
        id: "sec-mitre-attack",
        group: "Security Domains",
        label: "MITRE ATT&CK Cloud Detections",
        hint: "AWS Threat Detection",
        keywords: "mitre attack tactics cloud aws detection cloudtrail guardduty eventbridge",
        kind: "security",
        run: () => go("/work/aws-threat-detection-as-code"),
      },
      {
        id: "sec-idor",
        group: "Security Domains",
        label: "IDOR & Multi-Tenant Authorization",
        hint: "Run Interactive Trace",
        keywords: "idor bola broken object access tenant isolation auth customer scope",
        kind: "security",
        run: () => runTrace("idor"),
      },
      {
        id: "sec-sqli",
        group: "Security Domains",
        label: "SQL Injection & Parameterized Remediation",
        hint: "Run Interactive Trace",
        keywords: "sqli sql injection prepared statements auth bypass database cwe-89",
        kind: "security",
        run: () => runTrace("sqli"),
      },
    ];

    // Quick Actions Group
    const actions: Row[] = [
      {
        id: "act-academy",
        group: "Quick Actions",
        label: "Explore AppSec & AI Academy",
        hint: "Curriculum & Waitlist",
        keywords: "academy mentorship course training cohort syllabus appsec ai llm learning",
        kind: "action",
        run: () => go("/academy"),
      },
      {
        id: "act-cv",
        group: "Quick Actions",
        label: "Download CV",
        hint: "PDF",
        keywords: "cv resume pdf download curriculum vitae",
        kind: "action",
        run: () => go(cvHref),
      },
      {
        id: "act-mail",
        group: "Quick Actions",
        label: copied ? "Email Copied!" : "Copy Email",
        hint: site.email,
        keywords: "email copy address mail",
        kind: "action",
        run: () => void copyEmail(),
      },
      {
        id: "act-jump-work",
        group: "Quick Actions",
        label: "Jump to Work",
        hint: "Selected Work Section",
        keywords: "jump work projects case studies labs portfolio",
        kind: "action",
        run: () => jumpToSection("work", "/work"),
      },
      {
        id: "act-jump-about",
        group: "Quick Actions",
        label: "Jump to About",
        hint: "Background & Bio",
        keywords: "jump about bio profile background experience",
        kind: "action",
        run: () => go("/about"),
      },
      {
        id: "act-jump-contact",
        group: "Quick Actions",
        label: "Jump to Contact",
        hint: "Get in touch",
        keywords: "jump contact message email hire get in touch",
        kind: "action",
        run: () => jumpToSection("quiet", "/contact"),
      },
      {
        id: "act-theme",
        group: "Quick Actions",
        label: "Toggle Theme",
        hint: "Dark / Light Mode",
        keywords: "switch theme toggle dark light mode appearance color scheme",
        kind: "action",
        run: () => toggleTheme(),
      },
      {
        id: "act-trace-sqli",
        group: "Quick Actions",
        label: "Run SQL Injection Simulator",
        hint: "Hero Trace",
        keywords: "sqli sql injection simulator test trace",
        kind: "action",
        run: () => runTrace("sqli"),
      },
      {
        id: "act-trace-idor",
        group: "Quick Actions",
        label: "Run IDOR Access Simulator",
        hint: "Hero Trace",
        keywords: "idor broken object access simulator trace",
        kind: "action",
        run: () => runTrace("idor"),
      },
      {
        id: "act-trace-prompt",
        group: "Quick Actions",
        label: "Run Prompt Injection Simulator",
        hint: "Hero Trace",
        keywords: "prompt injection override llm simulator trace",
        kind: "action",
        run: () => runTrace("prompt"),
      },
    ];

    // Case Studies Group
    const studies: Row[] = work
      .filter((item) => item.kind !== "archive" || item.link)
      .filter((item) => item.slug !== "proof9")
      .map((item) => ({
        id: `work-${item.slug}`,
        group: "Case Studies",
        label: item.title,
        hint: item.year,
        keywords: `${item.tags.join(" ")} ${item.card}`,
        kind: "work",
        run: () => (item.kind === "archive" && item.link ? go(item.link) : go(`/work/${item.slug}`)),
      }));

    // Findings Group
    const findings: Row[] = [
      ...paletteFindings.map((item) => ({
        id: `find-${item.index}`,
        group: "Vulnerability Findings",
        label: `${item.index} ${item.title}`,
        keywords: "cvss finding vulnerability report",
        severity: item.severity,
        cvss: item.cvss,
        kind: "finding" as RowKind,
        run: () => go(item.href),
      })),
      {
        id: "find-sqli",
        group: "Vulnerability Findings",
        label: sqliFinding.title,
        keywords: "sqli sql injection cvss finding vulnerability report",
        severity: sqliFinding.severity,
        cvss: sqliFinding.cvss,
        kind: "finding" as RowKind,
        run: () => go(sqliFinding.href),
      },
    ];

    // Detections Group
    const rules: Row[] = detections.map((item) => ({
      id: `det-${item.name}`,
      group: "Cloud Detections",
      label: item.attack ? `${item.name}, ${item.attack}` : item.name,
      keywords: "cloud detection aws terraform mitre",
      kind: "detection" as RowKind,
      run: () => go(item.href),
    }));

    // Pages Group
    const pages: Row[] = [
      ["/", "Home", "Main landing & simulator"],
      ["/work", "Work", "All case studies and labs"],
      ["/academy", "Academy", "Application Security & AI/LLM Cohort"],
      ["/about", "About", "Background, skills & toolkit"],
      ["/contact", "Contact", "Availability & communication channels"],
      ["/security", "Security", "Security posture & disclosure policy"],
    ].map(([href, label, hint]) => ({
      id: `page-${href}`,
      group: "Navigation Pages",
      label,
      hint,
      kind: "page" as RowKind,
      run: () => go(href),
    }));

    const all: Row[] = [...securityDomains, ...actions, ...studies, ...findings, ...rules, ...pages];
    if (!q) return all;

    return all.filter((row) =>
      `${row.label} ${row.hint ?? ""} ${row.cvss ?? ""} ${row.keywords ?? ""}`
        .toLowerCase()
        .includes(q),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, copied, detections]);

  useEffect(() => {
    setActive(0);
    if (query.trim()) {
      announce(`${rows.length} ${rows.length === 1 ? "result" : "results"} found.`);
    }
  }, [query, rows.length]);

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
        setActive((value) => {
          const next = rows.length === 0 ? 0 : (value + 1) % rows.length;
          const rowEl = listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`);
          rowEl?.scrollIntoView({ block: "nearest" });
          return next;
        });
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => {
          const next = rows.length === 0 ? 0 : (value - 1 + rows.length) % rows.length;
          const rowEl = listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`);
          rowEl?.scrollIntoView({ block: "nearest" });
          return next;
        });
      }
      if (event.key === "Enter") {
        event.preventDefault();
        rows[active]?.run();
      }
      if (event.key === "Tab" && shellRef.current) {
        const focusable = Array.from(
          shellRef.current.querySelectorAll<HTMLElement>("button, input, a"),
        ).filter((el) => !el.hasAttribute("disabled"));
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

  const groups = rows.reduce<string[]>(
    (list, row) => (list.includes(row.group) ? list : [...list, row.group]),
    [],
  );
  const current = rows[active];

  return (
    <div
      className={`palette-root ${entered ? "is-in" : ""}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={shellRef}
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight Command Palette"
      >
        {/* Search Input Bar with Icon */}
        <div className="relative flex items-center border-b border-[var(--line)] px-4">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-[var(--signal)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 4.5 4.5" />
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={current ? `palette-opt-${current.id}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(event) => setQuery(event.target.value.slice(0, 200))}
            placeholder="Type a command or search domains (e.g. IDOR, SQLi, OWASP)..."
            className="palette-input w-full bg-transparent pl-3 text-[15px] outline-none text-[var(--fg)] placeholder:text-[var(--fg-subtle)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[11px] font-mono text-[var(--fg-subtle)] hover:text-[var(--fg)] px-1.5 py-0.5 rounded border border-[var(--line)]"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-[var(--line-strong)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div id="palette-list" ref={listRef} role="listbox" className="palette-list">
          <span aria-hidden data-highlight className="palette-highlight" />
          {groups.map((group) => (
            <div key={group} className="mb-2">
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
                    className={`palette-row group flex items-center justify-between transition-colors ${
                      index === active ? "is-active text-[var(--fg-strong)]" : ""
                    }`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => row.run()}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {/* Kind Indicator Icon */}
                      {row.kind === "security" ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--signal-soft)] text-[var(--signal)]">
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 1.5 13.5 3.8v4c0 3.2-2.2 5.5-5.5 6.9-3.3-1.4-5.5-3.7-5.5-6.9v-4L8 1.5Z" />
                          </svg>
                        </span>
                      ) : row.kind === "action" ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--fg-subtle)] font-mono text-[10px]">
                          ⌘
                        </span>
                      ) : row.kind === "work" ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] text-[var(--signal)]">
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="12" height="10" rx="2" />
                            <path d="M5 3V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                          </svg>
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--fg-subtle)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
                        </span>
                      )}

                      <span className="truncate font-medium text-[13.5px]">{row.label}</span>
                      {row.hint ? (
                        <span className="hidden sm:inline truncate font-mono text-[11px] text-[var(--fg-subtle)]">
                          {row.hint}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {row.severity ? (
                        <span
                          className={`sev ${
                            row.severity === "BLOCKED"
                              ? "sev-signal badge-pop"
                              : "sev-high"
                          }`}
                        >
                          {row.severity}
                        </span>
                      ) : null}
                      {row.cvss ? (
                        <span className="font-mono text-[11.5px] text-[var(--fg-subtle)]">
                          {row.cvss}
                        </span>
                      ) : null}
                      <span className="arrow-shift text-[var(--fg-subtle)] group-hover:text-[var(--signal)]">
                        →
                      </span>
                    </div>
                  </button>
                ) : null,
              )}
            </div>
          ))}
          {rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13.5px] text-[var(--fg-subtle)]">
              No matching commands or findings.
            </p>
          ) : null}
        </div>

        {/* Footer with Keyboard Hints */}
        <div className="palette-foot flex items-center justify-between border-t border-[var(--line)] px-4 py-2.5">
          <div className="flex items-center gap-3 text-[11px] text-[var(--fg-subtle)]">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-[var(--line-strong)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-muted)]">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-[var(--line-strong)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-muted)]">
                ↵
              </kbd>
              <span>Select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-[var(--line-strong)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-muted)]">
                esc
              </kbd>
              <span>Close</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-[var(--fg-subtle)]">
            {rows.length} {rows.length === 1 ? "match" : "matches"}
          </span>
        </div>
      </div>
    </div>
  );
}
