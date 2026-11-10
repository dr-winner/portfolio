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
  retrieval: "1. RAG Retriever",
  prompt_assembly: "2. Prompt Context Assembly",
  tool_policy: "3. Tool Policy Gate",
  output_handling: "4. Output Sanitizer",
};

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

  return (
    <section
      aria-labelledby="lab-inspector-heading"
      className="console-card relative mt-12 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
    >
      <div className="border-b border-[var(--line)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
            Interactive lab verifier
          </p>
          <div
            role="group"
            aria-label="Pipeline security mode"
            className="inline-flex rounded-[var(--radius-control)] border border-[var(--line-strong)] bg-[var(--bg)] p-1"
          >
            <button
              type="button"
              aria-pressed={mode === "vulnerable"}
              onClick={() => setMode("vulnerable")}
              className={`min-h-[36px] rounded-[8px] px-3.5 font-mono text-[12px] uppercase tracking-[0.06em] ${
                mode === "vulnerable"
                  ? "bg-[var(--danger)] font-semibold text-[color:var(--bg)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              Vulnerable
            </button>
            <button
              type="button"
              aria-pressed={mode === "hardened"}
              onClick={() => setMode("hardened")}
              className={`min-h-[36px] rounded-[8px] px-3.5 font-mono text-[12px] uppercase tracking-[0.06em] ${
                mode === "hardened"
                  ? "bg-[var(--signal)] font-semibold text-[var(--on-signal)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              Hardened
            </button>
          </div>
        </div>
        <h2 id="lab-inspector-heading" className="mt-2 text-[length:var(--step-2)]">
          Step through the 5 attack paths and controls
        </h2>
        <p className="mt-2 max-w-[64ch] text-[length:var(--step--1)] text-[var(--fg-muted)]">
          Select an attack scenario and toggle between the vulnerable baseline and
          the hardened pipeline to inspect how each trust boundary behaves.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Attack scenarios">
        {ATTACK_SCENARIOS.map((item) => {
          const active = item.id === scenario.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setScenarioId(item.id)}
              className={`min-h-[36px] whitespace-nowrap rounded-[8px] border px-3 py-2 text-left font-mono text-[12px] transition-colors ${
                active
                  ? "border-[var(--signal)] bg-[var(--surface-2)] text-[var(--fg)]"
                  : "border-[var(--line)] bg-[var(--bg)] text-[var(--fg-muted)] hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
              }`}
            >
              <span className="text-[var(--signal)]">{item.index}</span> ·{" "}
              {item.title.split("→")[0].trim()}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[10px] border border-[var(--line)] bg-[var(--bg)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              {scenario.owaspRef}
            </p>
            <h3 className="mt-1 text-[length:var(--step-1)] text-[var(--fg)]">
              {scenario.index}. {scenario.title}
            </h3>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[12px] uppercase tracking-[0.06em] ${
              result.outcome === "EXPLOITED"
                ? "border-[var(--danger)] text-[var(--danger)]"
                : "border-[var(--signal)] text-[var(--signal)]"
            }`}
          >
            {result.outcome === "EXPLOITED" ? "Outcome: Exploited" : "Outcome: Attack Blocked"}
          </span>
        </div>

        <p className="mt-3 text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
          {scenario.summary}
        </p>

        <dl className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 text-[length:var(--step--1)] sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              Trust boundary
            </dt>
            <dd className="mt-1 break-words text-[var(--fg)]">{scenario.boundary}</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              Lab CVSS v3.1
            </dt>
            <dd className="mt-1 font-mono text-[var(--amber)]">{scenario.cvssScore}</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              Caller session
            </dt>
            <dd className="mt-1 break-words font-mono text-[var(--fg)]">
              {scenario.session.tenantId} · role={scenario.session.role}
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
            Trust-boundary execution trace ({mode} mode)
          </p>
          <ol className="mt-3 grid gap-2.5">
            {result.trace.map((step) => {
              const badgeStyle =
                step.status === "violated"
                  ? "border-[var(--danger)] text-[var(--danger)]"
                  : step.status === "blocked"
                    ? "border-[var(--signal)] text-[var(--signal)]"
                    : "border-[var(--line-strong)] text-[var(--fg-muted)]";
              return (
                <li
                  key={step.stage}
                  className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[12px] text-[var(--fg)]">
                      {STAGE_LABELS[step.stage]}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] ${badgeStyle}`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-pretty text-[length:var(--step--1)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                    {step.detail}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-5 grid min-w-0 gap-4 border-t border-[var(--line)] pt-4">
          <div className="min-w-0">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              {mode === "vulnerable" ? "Why the vulnerable pipeline fails" : "How the hardened control stops it"}
            </p>
            <p className="mt-2 break-words text-pretty text-[length:var(--step--1)] leading-[var(--leading-body)] text-[var(--fg)]">
              {mode === "vulnerable" ? scenario.vulnerableExplanation : scenario.hardenedControl}
            </p>
            <p className="mt-3 overflow-wrap-anywhere font-mono text-[11px] text-[var(--fg-subtle)]">
              Vector: {scenario.cvssVector}
            </p>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
              Enforced control (src/lab/llm-agent-security/engine.ts)
            </p>
            {scenarioCode ? (
              <div className="shiki-host mt-2">
                <div className="absolute right-2.5 top-2.5 z-10">
                  <CopyButton value={scenario.controlSnippet} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: scenarioCode }} />
              </div>
            ) : (
              <pre className="mt-2 max-w-full overflow-x-auto rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-3 font-mono text-[12px] leading-relaxed text-[var(--fg)]">
                <code className="overflow-wrap-anywhere">{scenario.controlSnippet}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
