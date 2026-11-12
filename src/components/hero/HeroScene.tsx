"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Scenario = {
  id: string;
  label: string;
  short: string;
  endpoint: string;
  payload: string;
  block: number;
  note: string;
};

/* Rows read top to bottom. A request travels bottom to top, so the row that
   blocks it sits above every layer it already passed. */
const rows = [
  { n: "04", name: "Model guardrail", detail: "Limits what the model can ask a tool to do." },
  { n: "03", name: "Policy gate", detail: "Re-checks tenant, role and schema on the server." },
  { n: "02", name: "Session", detail: "Ties the request to the signed-in tenant." },
  { n: "01", name: "Edge", detail: "Shapes and rate-limits the request first." },
];

const scenarios: Scenario[] = [
  {
    id: "sqli",
    label: "SQL injection",
    short: "SQLi",
    endpoint: "POST /api/v1/login",
    payload: "admin' OR 1=1 --",
    block: 1,
    note: "The login query is rejected before it runs.",
  },
  {
    id: "idor",
    label: "Broken object access",
    short: "IDOR",
    endpoint: "GET /api/v1/invoices/4821",
    payload: "tenant: globex",
    block: 2,
    note: "The invoice scope is tied to the session, not the URL.",
  },
  {
    id: "prompt",
    label: "Prompt injection",
    short: "Prompt",
    endpoint: "POST /api/v1/assistant",
    payload: "ignore previous instructions",
    block: 0,
    note: "The tool call is denied at the model boundary.",
  },
];

const stops = ["20%", "44%", "68%", "89%"];

export function HeroScene() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);

  const scenario = scenarios[active];

  /* The command palette can fire a preset at the hero. Keep the same scene
     as the one a visitor reaches by clicking the scenario buttons. */
  useEffect(() => {
    function onRun(event: Event) {
      const id = (event as CustomEvent<string>).detail;
      const index = scenarios.findIndex((item) => item.id === id);
      if (index < 0) return;
      setActive(index);
      setCycle((value) => value + 1);
    }
    window.addEventListener("trace:run", onRun as EventListener);
    return () => window.removeEventListener("trace:run", onRun as EventListener);
  }, []);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const root = rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    root.style.setProperty("--mx", `${event.clientX - box.left}px`);
    root.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  function replay() {
    setCycle((value) => value + 1);
  }

  return (
    <figure
      ref={rootRef}
      onPointerMove={onPointerMove}
      className="scene m-0"
      style={
        {
          "--mx": "70%",
          "--my": "10%",
          "--scene-stop": stops[scenario.block],
        } as CSSProperties
      }
      aria-labelledby="hero-scene-caption"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{ background: "radial-gradient(280px circle at var(--mx) var(--my), var(--spot), transparent 70%)" }}
      />
      <span aria-hidden className="scene-scan" />

      <div className="scene-body">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-5">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
            <span aria-hidden className="fx-pulse inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)] text-[var(--signal)]" />
            Request path
          </span>
          <span className="min-w-0 truncate font-mono text-[11px] text-[var(--fg-subtle)]">{scenario.endpoint}</span>
        </div>

        <div className="scene-lane">
          <span aria-hidden className="scene-rail" />

          {rows.map((row, index) => {
            const state = index < scenario.block ? "not-reached" : index === scenario.block ? "blocked" : "passed";
            return (
              <div key={row.n} className="scene-row" data-role={state}>
                <span className="scene-node" aria-hidden>
                  {row.n}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium leading-tight text-[var(--fg)] sm:text-[13.5px]">
                    {row.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[var(--fg-subtle)] sm:text-[11.5px]">
                    {row.detail}
                  </span>
                </span>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                    state === "blocked"
                      ? "border-[var(--signal)] text-[var(--signal)]"
                      : state === "passed"
                        ? "border-[var(--line-strong)] text-[var(--fg-muted)]"
                        : "border-[var(--line)] text-[var(--fg-subtle)]"
                  }`}
                >
                  {state === "blocked" ? "blocked" : state === "passed" ? "pass" : "not reached"}
                </span>
              </div>
            );
          })}

          <span
            key={`packet-${cycle}-${scenario.id}`}
            aria-hidden
            className="scene-packet max-w-[72%] truncate"
          >
            <span className="text-[var(--danger)]">ATTACK</span>
            <span className="truncate">{scenario.payload}</span>
          </span>
          <span key={`burst-${cycle}-${scenario.id}`} aria-hidden className="scene-burst" />
        </div>

        <div className="relative z-10 border-t border-[var(--line)] px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Attack scenario">
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={active === index}
                onClick={() => {
                  setActive(index);
                  setCycle((value) => value + 1);
                }}
                className={`inline-flex h-8 items-center rounded-full border px-3 font-mono text-[11px] tracking-[0.04em] transition-colors duration-[var(--dur-1)] ${
                  active === index
                    ? "border-[var(--signal)] bg-[var(--signal-soft)] text-[var(--signal)]"
                    : "border-[var(--line)] text-[var(--fg-muted)] hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={replay}
              aria-label="Replay this attack"
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[var(--fg-muted)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
                <path d="M13.5 2.5V5H11" />
              </svg>
            </button>
          </div>
          <p id="hero-scene-caption" className="mt-2.5 text-[11.5px] leading-snug text-[var(--fg-subtle)]">
            <span className="text-[var(--signal)]">Blocked.</span> {scenario.note}
          </p>
        </div>
      </div>
    </figure>
  );
}
