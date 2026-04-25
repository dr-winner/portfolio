"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronUp, Mail, Terminal } from "lucide-react";
import { profile } from "@/content/profile";
import { signalWords } from "@/content/keywords";
import { track } from "@/lib/telemetry.client";

const GH = profile.socials.github;
const MAIL_SUBJECT = encodeURIComponent("Hello");
const MAIL_BODY = encodeURIComponent("Hi Richard,\n\n");
const mailtoHref = `mailto:${profile.email}?subject=${MAIL_SUBJECT}&body=${MAIL_BODY}`;

const STORAGE_KEY = "portfolio-tty";
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_STORED_LINES = 350;
const MAX_STORED_H_MSGS = 24;
const PERSIST_VERSION = 1 as const;

type Line = { kind: "in" | "out"; text: string };
type TMsg = { role: "user" | "assistant"; content: string };

const WELCOME: Line = {
  kind: "out",
  text: "You can write in plain English — or type `help` for commands. Same look as a terminal; it’s just a chat to this site. `links` lists URLs; Email (top) opens your mail app.",
};

function loadSession(): { lines: Line[]; history: TMsg[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as {
      v: number;
      savedAt: number;
      lines: Line[];
      history: TMsg[];
    };
    if (
      o.v !== PERSIST_VERSION ||
      typeof o.savedAt !== "number" ||
      Date.now() - o.savedAt > DAY_MS
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (!Array.isArray(o.lines) || o.lines.length < 1) return null;
    return {
      lines: o.lines.slice(-MAX_STORED_LINES),
      history: (Array.isArray(o.history) ? o.history : []).slice(-MAX_STORED_H_MSGS),
    };
  } catch {
    return null;
  }
}

function saveSession(lines: Line[], history: TMsg[]) {
  try {
    const payload = JSON.stringify({
      v: PERSIST_VERSION,
      savedAt: Date.now(),
      lines: lines.slice(-MAX_STORED_LINES),
      history: history.slice(-MAX_STORED_H_MSGS),
    });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    /* quota / private mode */
  }
}

function splitOut(text: string): string[] {
  return text.split("\n");
}

function buildStatusLines(): string[] {
  return [
    `${profile.handle}@portfolio  ·  ${profile.role}`,
    profile.tagline,
    `availability: ${profile.availability.label}  ·  ${GH.replace("https://", "")}`,
  ];
}

function helpLines(): string[] {
  return [
    "in english: just ask; we answer from the same public info as the rest of the site",
    "local cmds: whoami  id  date  hostinfo  links  env  cat profile  tags  go <section>  help",
    "open:  github  tiktok  |  go contact  (scrolls the page)  |  other lines: remote log reply",
  ];
}

function runLocal(t: string): string[] | null {
  const lower = t.toLowerCase().trim();
  const [cmd, ...a] = lower.split(/\s+/);

  if (cmd === "help" || t === "?") return helpLines();
  if (cmd === "clear") return ["__CLEAR__"];
  if (cmd === "date")
    return [new Date().toString(), "epoch_ms=" + String(Date.now())];

  if (cmd === "whoami" || cmd === "id")
    return [
      "uid=1000(" + profile.name.toLowerCase().replace(/\s+/g, "_") + ")",
      "groups=10(wheel) 21(dev)  27(sudo)",
      "gecos: " + profile.role,
    ];

  if (cmd === "hostinfo" || cmd === "uname" || lower === "uname -a") {
    return [
      "hostname : " + (typeof window !== "undefined" ? window.location.hostname : "—"),
      "ua       : " + (typeof navigator !== "undefined" ? navigator.userAgent : "—"),
      "session  : portfolio-tty-1.0",
    ];
  }

  if (cmd === "links") {
    return [
      "GITHUB   " + profile.socials.github,
      "LINKEDIN " + profile.socials.linkedin,
      "X        " + profile.socials.x,
      "MEDIUM   " + profile.socials.medium,
      "IG       " + profile.socials.instagram,
      "DISCORD  " + profile.socials.discord,
      "TIKTOK   " + profile.socials.tiktok,
      "EMAIL    use `Email` in title bar (opens your mail app)",
    ];
  }

  if (cmd === "cat" && a[0] === "profile") {
    return ["--- " + profile.name + " ---", ...profile.bio, "", "tagline: " + profile.tagline];
  }

  if (cmd === "tags" || lower === "stack" || lower === "keywords") {
    return [
      "keywords (from site data):",
      "  " + signalWords.join("  ·  "),
    ];
  }

  if (lower.startsWith("go ")) {
    return ["__GO__" + t.slice(3).trim().replace(/^#/, "")];
  }

  if (lower === "github") {
    return ["__OPEN_GH__"];
  }
  if (lower === "tiktok") {
    return ["__OPEN_TT__"];
  }

  if (cmd === "env") {
    return [
      "SITE=portfolio",
      "USER=" + profile.handle,
      "CONTACT=Email button in title bar  ·  #contact on page",
      "ORIGIN=" + (typeof window !== "undefined" ? window.location.origin : ""),
    ];
  }

  return null;
}

export function TerminalDock({
  expanded,
  onExpandedChange,
}: {
  expanded: boolean;
  onExpandedChange: (v: boolean) => void;
}) {
  const [lines, setLines] = useState<Line[]>([WELCOME]);
  const [history, setHistory] = useState<TMsg[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [rot, setRot] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const statusLines = useMemo(() => buildStatusLines(), []);
  const stripLine = statusLines[rot % statusLines.length];

  useLayoutEffect(() => {
    const s = loadSession();
    if (s) {
      setLines(s.lines);
      setHistory(s.history);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveDebounce.current) clearTimeout(saveDebounce.current);
    saveDebounce.current = setTimeout(() => {
      saveSession(lines, history);
    }, 300);
    return () => {
      if (saveDebounce.current) clearTimeout(saveDebounce.current);
    };
  }, [lines, history, hydrated]);

  useEffect(() => {
    if (expanded) return;
    const id = setInterval(() => setRot((n) => (n + 1) % statusLines.length), 10000);
    return () => clearInterval(id);
  }, [expanded, statusLines.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, busy, expanded]);

  useEffect(() => {
    if (expanded) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onExpandedChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, onExpandedChange]);

  const refocusInput = useCallback(() => {
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    });
  }, []);

  const execute = useCallback(
    async (raw: string) => {
      const t0 = raw.trim();
      if (!t0 || busy) return;

      let restoreFocus = true;

      try {
        setLines((prev) => [...prev, { kind: "in", text: t0 }]);

        const local = runLocal(t0);
        if (local) {
          if (local[0] === "__CLEAR__") {
            setLines([WELCOME]);
            setHistory([]);
            return;
          }
          if (local[0]?.startsWith("__GO__")) {
            const id = local[0].replace("__GO__", "");
            const el = document.getElementById(id);
            if (el) {
              setLines((p) => [...p, { kind: "out", text: "[ok] #scroll → #" + id }]);
              setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 0);
            } else {
              setLines((p) => [...p, { kind: "out", text: "[err] no id #" + id }]);
            }
            return;
          }
          if (local[0] === "__OPEN_GH__") {
            window.open(GH, "_blank", "noopener,noreferrer");
            setLines((p) => [...p, { kind: "out", text: "[ok] github opened" }]);
            return;
          }
          if (local[0] === "__OPEN_TT__") {
            window.open(profile.socials.tiktok, "_blank", "noopener,noreferrer");
            setLines((p) => [...p, { kind: "out", text: "[ok] tiktok opened" }]);
            return;
          }
          setLines((prev) => [...prev, ...local.map((x) => ({ kind: "out" as const, text: x }))]);
          return;
        }

        if (t0.toLowerCase() === "exit" || t0.toLowerCase() === "quit") {
          restoreFocus = false;
          onExpandedChange(false);
          return;
        }

        setBusy(true);
        try {
          const r = await fetch("/api/terminal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: t0, history }),
          });
          const text = await r.text();
          let j: { reply?: string; error?: string };
          try {
            j = JSON.parse(text) as { reply?: string; error?: string };
          } catch {
            setLines((p) => [...p, { kind: "out", text: "[err] assistant unavailable" }]);
            return;
          }
          if (!r.ok) {
            setLines((p) => [
              ...p,
              { kind: "out", text: j.error ? String(j.error) : "[err] assistant unavailable" },
            ]);
            return;
          }
          if (j.error) {
            setLines((p) => [...p, { kind: "out", text: String(j.error) }]);
          } else if (j.reply) {
            setHistory((h) =>
              [
                ...h,
                { role: "user" as const, content: t0 },
                { role: "assistant" as const, content: j.reply! },
              ].slice(-8)
            );
            for (const line of splitOut(j.reply)) {
              if (line.length) setLines((p) => [...p, { kind: "out" as const, text: line }]);
            }
          } else {
            setLines((p) => [...p, { kind: "out", text: "[err] empty" }]);
          }
        } catch {
          setLines((p) => [...p, { kind: "out", text: "[err] assistant unavailable" }]);
        } finally {
          setBusy(false);
        }
      } finally {
        if (restoreFocus) refocusInput();
      }
    },
    [busy, history, onExpandedChange, refocusInput]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const v = input;
    setInput("");
    void execute(v);
  };

  const shellCol = "text-[#00ff66]";
  const shellPrompt = `${profile.handle}@portfolio:~$ `;

  return (
    <>
      {expanded ? (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px]"
          aria-hidden
          onClick={() => onExpandedChange(false)}
        />
      ) : null}

      <div
        className={clsx(
          "pointer-events-auto fixed z-[101] pb-[env(safe-area-inset-bottom,0px)]",
          expanded
            ? "left-1/2 w-[min(calc(100vw-1.5rem),26rem)] max-w-full -translate-x-1/2 sm:w-3/5 sm:max-w-2xl"
            : "left-4 right-4 w-auto sm:left-1/2 sm:right-auto sm:w-3/5 sm:max-w-none sm:-translate-x-1/2"
        )}
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "var(--font-mono), ui-monospace, Consolas, monospace" }}
      >
        {!expanded ? (
          <div className="flex min-h-12 items-stretch gap-2 rounded-t border border-b-0 border-[#0d3d0d] bg-[#030805]/98 px-2.5 py-1.5 text-[11px] text-[#4ade80]/90 shadow-[0_-4px_32px_rgba(0,255,100,0.08)] sm:h-9 sm:min-h-0 sm:items-center sm:px-2 sm:py-0 sm:text-[10px] md:text-[11px]">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Terminal className="size-3.5 shrink-0 text-[#22c55e]/60" aria-hidden />
              <span className="hidden shrink-0 text-[#166534] sm:inline">#</span>
              <span className="hidden shrink-0 font-sans text-[9px] font-medium text-white/40 md:inline">
                Site console
              </span>
              <p
                className="min-w-0 flex-1 [overflow-wrap:anywhere] text-[10px] leading-snug sm:line-clamp-1 sm:text-inherit"
                key={stripLine}
              >
                {stripLine}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                track("shell_open");
                onExpandedChange(true);
              }}
              className="inline-flex min-h-10 min-w-[4.5rem] shrink-0 items-center justify-center gap-0.5 rounded border border-[#14532d] bg-[#0a1f10] px-2 text-xs font-medium text-[#4ade80] sm:min-h-0 sm:min-w-0 sm:px-1.5 sm:py-0.5 sm:text-[10px] active:bg-[#14532d]/50"
              title="Open the site console (type a question, or “help” for commands)"
              aria-label="Open site console"
            >
              open
              <ChevronUp className="size-3.5 opacity-80 sm:size-3" />
            </button>
          </div>
        ) : (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site console"
            className={clsx(
              "flex min-h-0 flex-col overflow-hidden rounded-t-2xl border border-[#1a3d1a] border-b-0 bg-[#1a1a1a] shadow-[0_-12px_48px_rgba(0,255,80,0.06),inset_0_1px_0_rgba(0,40,0,0.4)]",
              zoomed ? "h-[min(78vh,880px)]" : "h-[min(50dvh,400px)] sm:h-[min(44vh,440px)]"
            )}
          >
            {/* Title bar — dark chrome */}
            <div className="relative flex min-h-11 shrink-0 items-center justify-between gap-1 border-b border-[#0d280d] bg-gradient-to-b from-[#1f1f1f] to-[#121212] px-2.5 sm:min-h-8">
              <div
                className="flex items-center gap-2 pl-0.5"
                onClick={(e) => e.stopPropagation()}
                role="presentation"
              >
                <button
                  type="button"
                  className="h-3.5 w-3.5 shrink-0 rounded-full bg-[#ff5f57] transition hover:brightness-110 sm:h-3 sm:w-3"
                  title="Close"
                  aria-label="Close"
                  onClick={() => onExpandedChange(false)}
                />
                <button
                  type="button"
                  className="h-3.5 w-3.5 shrink-0 rounded-full bg-[#febc2e] transition hover:brightness-110 sm:h-3 sm:w-3"
                  title="Minimize"
                  aria-label="Minimize"
                  onClick={() => onExpandedChange(false)}
                />
                <button
                  type="button"
                  className="h-3.5 w-3.5 shrink-0 rounded-full bg-[#28c840] transition hover:brightness-110 sm:h-3 sm:w-3"
                  title="Zoom"
                  aria-label="Zoom"
                  onClick={() => setZoomed((z) => !z)}
                />
              </div>
              <span className="pointer-events-none max-w-[45%] truncate text-center text-[9px] text-[#6ee7a8]/50 sm:max-w-none sm:text-[10px]">
                {profile.handle}@portfolio — tty
              </span>
              <div className="ml-auto flex min-w-0 items-center justify-end gap-1 sm:gap-1.5 sm:pl-6">
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-[#2a5c2a] bg-[#0f1f12] px-2.5 text-[10px] font-medium text-[#86efac] transition hover:border-[#3d7a3d] hover:bg-[#0f2812] sm:min-h-0 sm:min-w-0 sm:rounded sm:px-2"
                  onClick={(e) => {
                    track("shell_email");
                    e.stopPropagation();
                  }}
                >
                  <Mail className="size-3.5 sm:size-3" />
                  <span className="hidden sm:inline">Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => onExpandedChange(false)}
                  className="inline-flex min-h-9 min-w-9 items-center justify-center gap-0.5 rounded-lg px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white sm:min-h-0 sm:min-w-0 sm:rounded sm:px-1.5 sm:text-[10px]"
                  aria-label="Close console"
                >
                  <span className="hidden sm:inline">close</span>
                  <ChevronDown className="size-4 sm:size-3" />
                </button>
              </div>
            </div>

            {/* Phosphor-style scrollback */}
            <div
              className="min-h-0 flex-1 overflow-y-auto border-x border-[#0d280d] bg-[#050a06] px-3 py-3 text-[12px] leading-relaxed [text-shadow:0_0_6px_rgba(0,255,80,0.12)]"
              role="log"
            >
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={clsx(
                    lineRowClass(lines, i, line),
                    clsTextLine(line.kind, line.text)
                  )}
                >
                  {line.kind === "in" ? (
                    <span>
                      <span className={shellCol}>{shellPrompt}</span>
                      <span className="text-[#dcfce7]">{line.text}</span>
                    </span>
                  ) : (
                    <span className="text-inherit">{line.text}</span>
                  )}
                </p>
              ))}
              {busy ? (
                <p
                  className={clsx(
                    "mt-0.5 pl-2.5 border-l-2 border-[#1a5c2a]/50 bg-[#060a07]/50 py-0.5",
                    "text-[#a3e635]"
                  )}
                >
                  <span className={shellCol}>… </span>working
                </p>
              ) : null}
              <div ref={endRef} className="h-px" />
            </div>

            <p id="tty-hint" className="sr-only">
              You can type a normal question, or the word help for command ideas. Press Enter to
              send.
            </p>
            {/* Input line */}
            <form
              onSubmit={onSubmit}
              className="shrink-0 border border-t-0 border-[#14532d] bg-[#080c09] px-2 py-1.5"
            >
              <p className="mb-1 font-sans text-[9px] leading-tight text-[#4ade80]/50 md:text-[10px]">
                Plain English is fine — or try{" "}
                <span className="font-mono text-[#86efac]/80">help</span> ·{" "}
                <span className="text-white/35">Enter sends</span>
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`shrink-0 font-medium ${shellCol}`}>{shellPrompt}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#ecfccb] outline-none placeholder:text-[#14532d] caret-[#4ade80]"
                  placeholder="Ask a question, or: help  |  go contact  |  date"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Message"
                  aria-describedby="tty-hint"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

/** Layout / separation between you (in) and replies (out). */
function lineRowClass(lines: Line[], i: number, line: Line): string {
  const prev = i > 0 ? lines[i - 1] : undefined;
  if (line.kind === "in") {
    if (i === 0) return "whitespace-pre-wrap break-words mb-2.5";
    return "whitespace-pre-wrap break-words mb-1.5 mt-4 border-t border-[#0f2215] pt-4";
  }
  if (line.kind === "out" && prev?.kind === "in") {
    return "whitespace-pre-wrap break-words mt-0.5 mb-0.5 pl-2.5 border-l-2 border-[#166534] bg-[#060a07]/80 py-1.5 rounded-r-sm";
  }
  if (line.kind === "out" && prev?.kind === "out") {
    return "whitespace-pre-wrap break-words mb-0.5 pl-2.5 ml-px border-l-2 border-[#0a1f0c] bg-[#060a07]/50 py-0.5";
  }
  return "whitespace-pre-wrap break-words mb-1.5";
}

function clsTextLine(kind: "in" | "out", text: string): string {
  if (kind === "out" && (text.startsWith("[err]") || text.toLowerCase().includes("error]"))) {
    return "text-[#f87171]";
  }
  if (kind === "out") {
    return "text-[#86efac]/90";
  }
  return "";
}
