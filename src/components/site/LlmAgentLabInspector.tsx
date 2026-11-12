"use client";

import { useState } from "react";
import { CopyButton } from "@/components/site/CopyButton";
import {
  ATTACK_SCENARIOS,
  runScenario,
  type SecurityMode,
  type TraceStep,
} from "@/lab/llm-agent-security/engine";

const STAGE_LABELS: Record<TraceStep["stage"], string> = {
  retrieval: "RAG retriever",
  prompt_assembly: "Prompt assembly",
  tool_policy: "Tool policy gate",
  output_handling: "Output sanitizer",
};

const STAGE_NUMBERS: Record<TraceStep["stage"], string> = {
  retrieval: "01",
  prompt_assembly: "02",
  tool_policy: "03",
  output_handling: "04",
};

function shortTitle(title: string) {
  return title.split("→")[0].trim();
}

export function LlmAgentLabInspector({
  highlighted = {},
}: {
  highlighted?: Record<string, string>;
}) {
  const [scenarioId, setScenarioId] = useState<string>(ATTACK_SCENARIOS[0].id);
  const [mode, setMode] = useState<SecurityMode>("hardened");

  const scenario =
    ATTACK_SCENARIOS.find((item) => item.id === scenarioId) ?? ATTACK_SCENARIOS[0];
  const result = runScenario(scenario, mode);
  const scenarioCode = highlighted[scenario.id];
  const blocked = result.outcome === "BLOCKED";

  return (
    <section
      aria-labelledby="lab-inspector-heading"
      className="panel edge-glow relative mt-12 overflow-hidden"
    >
      {/* Product chrome: identity, live state, mode switch. */}
      <div className="flex flex-col gap-4 border-b border-[var(--line)] px-[clamp(18px,3vw,28px)] py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-[9px] border border-[var(--line-strong)] bg-[var(--surface-2)]">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="var(--signal)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1.8 13.4 4v3.8c0 3-2.2 5.2-5.4 6.4-3.2-1.2-5.4-3.4-5.4-6.4V4L8 1.8Z" />
              <path d="m5.9 8 1.5 1.6 3-3.2" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              Lab verifier
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-[12.5px] text-[var(--fg-muted)]">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
              Deterministic engine, no live model call
            </p>
          </div>
        </div>

        <div
          role="group"
          aria-label="Pipeline security mode"
          className="inline-flex w-fit rounded-full border border-[var(--line-strong)] bg-[var(--bg)] p-1"
        >
          <button
            type="button"
            aria-pressed={mode === "vulnerable"}
            onClick={() => setMode("vulnerable")}
            className={`inline-flex h-11 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-[var(--dur-1)] ${
              mode === "vulnerable"
                ? "bg-[var(--danger)] font-semibold text-[#1c0505]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            Vulnerable
          </button>
          <button
            type="button"
            aria-pressed={mode === "hardened"}
            onClick={() => setMode("hardened")}
            className={`inline-flex h-11 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-[var(--dur-1)] ${
              mode === "hardened"
                ? "bg-[var(--signal)] font-semibold text-[var(--on-signal)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            Hardened
          </button>
        </div>
      </div>

      <div className="px-[clamp(18px,3vw,28px)] pb-[clamp(20px,3vw,32px)] pt-6">
        <h2 id="lab-inspector-heading" className="max-w-[24ch] text-[length:var(--step-3)] font-medium leading-[var(--leading-heading)] tracking-[-0.025em]">
          Five attack paths, one gate at a time.
        </h2>
        <p className="mt-3 max-w-[62ch] text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
          Pick a scenario and switch between the vulnerable baseline and the hardened pipeline. Every result below is
          produced by the same TypeScript engine used in the test suite.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Attack scenarios">
          {ATTACK_SCENARIOS.map((item) => {
            const active = item.id === scenario.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setScenarioId(item.id)}
                className={`group flex min-h-[58px] flex-col justify-center gap-1 rounded-[12px] border px-3.5 py-2.5 text-left transition-colors duration-[var(--dur-1)] ${
                  active
                    ? "border-[var(--signal)]/60 bg-[var(--signal-soft)]"
                    : "border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_46%,transparent)] hover:border-[var(--line-strong)]"
                }`}
              >
                <span className={`font-mono text-[10px] tracking-[0.14em] ${active ? "text-[var(--signal)]" : "text-[var(--fg-subtle)]"}`}>
                  {item.index}
                </span>
                <span className={`text-[12.5px] font-medium leading-snug ${active ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                  {shortTitle(item.title)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result banner: the first thing a reader should understand. */}
        <div
          className={`mt-6 flex flex-col gap-3 rounded-[14px] border p-4 sm:flex-row sm:items-center sm:justify-between ${
            blocked
              ? "border-[var(--signal)]/45 bg-[var(--signal-soft)]"
              : "border-[var(--danger)]/45 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                blocked ? "border-[var(--signal)]/60 text-[var(--signal)]" : "border-[var(--danger)]/60 text-[var(--danger)]"
              }`}
            >
              {blocked ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.2 8.4 3.2 3.2 6.4-6.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              )}
            </span>
            <div className="min-w-0">
              <p className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${blocked ? "text-[var(--signal)]" : "text-[var(--danger)]"}`}>
                {blocked ? "Attack blocked" : "Attack succeeded in vulnerable mode"}
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--fg)]">
                {blocked
                  ? "The boundary held and the unauthorized action never executed."
                  : "The baseline trusted the model, so the action reached the data layer."}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] ${
              blocked
                ? "border-[var(--signal)]/50 text-[var(--signal)]"
                : "border-[var(--danger)]/50 text-[var(--danger)]"
            }`}
          >
            {result.outcome}
          </span>
        </div>

        <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          {/* Scenario sheet. */}
          <div className="min-w-0 rounded-[14px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_62%,transparent)] p-4 sm:p-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
              {scenario.owaspRef}
            </p>
            <h3 className="mt-2 text-[length:var(--step-1)] font-medium leading-[var(--leading-snug)] tracking-[-0.015em] text-[var(--fg)]">
              {scenario.index}. {scenario.title}
            </h3>
            <p className="mt-3 text-pretty text-[13px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              {scenario.summary}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[var(--line)] pt-4">
              <div className="min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Trust boundary</dt>
                <dd className="mt-1 break-words text-[12.5px] text-[var(--fg)]">{scenario.boundary}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Lab CVSS v3.1</dt>
                <dd className="mt-1 font-mono text-[12.5px] text-[var(--amber)]">{scenario.cvssScore}</dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Request as sent</dt>
                <dd className="mt-1 overflow-wrap-anywhere rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[11px] leading-relaxed text-[var(--fg-muted)]">
                  {scenario.userPrompt}
                </dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Caller session</dt>
                <dd className="mt-1 break-words font-mono text-[11px] text-[var(--fg)]">
                  {scenario.session.userId} / {scenario.session.tenantId} / role={scenario.session.role}
                </dd>
              </div>
            </dl>
          </div>

          {/* Trace: four stages, top to bottom. */}
          <div className="min-w-0 rounded-[14px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_62%,transparent)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
                Execution trace
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">{mode}</span>
            </div>

            <ol className="relative mt-4 flex flex-col gap-3">
              {result.trace.map((step) => {
                const tone =
                  step.status === "violated"
                    ? { border: "border-[var(--danger)]/45", text: "text-[var(--danger)]", dot: "bg-[var(--danger)]" }
                    : step.status === "blocked"
                      ? { border: "border-[var(--signal)]/45", text: "text-[var(--signal)]", dot: "bg-[var(--signal)]" }
                      : { border: "border-[var(--line)]", text: "text-[var(--fg-subtle)]", dot: "bg-[var(--line-strong)]" };
                return (
                  <li key={step.stage} className="relative flex gap-3">
                    <span className="flex w-6 shrink-0 flex-col items-center pt-1">
                      <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                      <span aria-hidden className="mt-1 w-px flex-1 bg-[var(--line)]" />
                    </span>
                    <div className={`min-w-0 flex-1 rounded-[10px] border bg-[var(--surface)] px-3 py-2.5 ${tone.border}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] tracking-[0.08em] text-[var(--fg)]">
                          {STAGE_NUMBERS[step.stage]} {STAGE_LABELS[step.stage]}
                        </span>
                        <span className={`font-mono text-[9.5px] uppercase tracking-[0.1em] ${tone.text}`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="mt-1 break-words text-[11.5px] leading-relaxed text-[var(--fg-muted)]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--line)] pt-3">
              {[
                { label: "Chunks", value: result.retrievedChunkIds.length },
                { label: "Tools run", value: result.executedTools.length },
                { label: "Tools blocked", value: result.blockedTools.length },
              ].map((metric) => (
                <div key={metric.label} className="min-w-0 text-center">
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">{metric.label}</dt>
                  <dd className="mt-0.5 font-mono text-[15px] text-[var(--fg)]">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Explanation and the enforced control. */}
        <div className="mt-5 grid min-w-0 gap-5 border-t border-[var(--line)] pt-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
              {mode === "vulnerable" ? "Why the baseline fails" : "How the control stops it"}
            </p>
            <p className="mt-2 break-words text-pretty text-[13px] leading-[var(--leading-body)] text-[var(--fg)]">
              {mode === "vulnerable" ? scenario.vulnerableExplanation : scenario.hardenedControl}
            </p>
            <p className="mt-3 overflow-wrap-anywhere font-mono text-[10.5px] leading-relaxed text-[var(--fg-subtle)]">
              Vector: {scenario.cvssVector}
            </p>

            {result.blockedTools.length > 0 ? (
              <div className="mt-4 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">Policy reasons</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {result.blockedTools.map((item) => (
                    <li key={item.tool} className="break-words text-[11.5px] leading-relaxed text-[var(--fg-muted)]">
                      <span className="font-mono text-[10.5px] text-[var(--danger)]">{item.tool}</span> {item.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
                Enforced control
              </p>
              <span className="font-mono text-[10px] text-[var(--fg-subtle)]">engine.ts</span>
            </div>
            {scenarioCode ? (
              <div className="shiki-host mt-2">
                <div className="absolute right-2.5 top-2.5 z-10">
                  <CopyButton value={scenario.controlSnippet} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: scenarioCode }} />
              </div>
            ) : (
              <pre className="mt-2 max-w-full overflow-x-auto rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-3 font-mono text-[11.5px] leading-relaxed text-[var(--fg)]">
                <code className="overflow-wrap-anywhere">{scenario.controlSnippet}</code>
              </pre>
            )}
          </div>
        </div>

        <p className="mt-6 border-t border-[var(--line)] pt-4 text-[11px] leading-relaxed text-[var(--fg-subtle)]">
          Synthetic tenants, invoices and tickets only. The hardened column never prints a retrieved secret and never
          reports a refund as processed.
        </p>
      </div>
    </section>
  );
}
