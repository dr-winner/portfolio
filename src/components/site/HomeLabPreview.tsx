"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ATTACK_SCENARIOS,
  runScenario,
  type SecurityMode,
  type TraceStep,
} from "@/lab/llm-agent-security/engine";

const STAGE_LABEL: Record<TraceStep["stage"], string> = {
  retrieval: "Retrieval",
  prompt_assembly: "Prompt",
  tool_policy: "Tool gate",
  output_handling: "Output",
};

const STAGE_NUMBER: Record<TraceStep["stage"], string> = {
  retrieval: "01",
  prompt_assembly: "02",
  tool_policy: "03",
  output_handling: "04",
};

function shortTitle(title: string) {
  return title.split("→")[0].trim();
}

/**
 * A compact, real run of the LLM lab on the home page. It calls the same
 * deterministic engine as the full inspector, so the outcome is produced,
 * not written by hand. Only the trace is printed: never the retrieved text
 * and never a claim that a refund executed.
 */
export function HomeLabPreview() {
  const [scenarioId, setScenarioId] = useState(ATTACK_SCENARIOS[0].id);
  const [mode, setMode] = useState<SecurityMode>("hardened");
  const scenario = ATTACK_SCENARIOS.find((item) => item.id === scenarioId) ?? ATTACK_SCENARIOS[0];
  const result = runScenario(scenario, mode);
  const blocked = result.outcome === "BLOCKED";

  return (
    <div className="home-lab panel edge-glow">
      <div className="home-lab-head">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--signal)]">See it work</p>
          <h3 className="mt-2 max-w-[24ch] text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em]">
            One ticket, one gate at a time.
          </h3>
          <p className="mt-2 max-w-[54ch] text-[13px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
            This is the real lab engine, running here. Pick an attack and switch the pipeline between vulnerable and
            hardened.
          </p>
        </div>
        <Link href="/work/llm-agent-security-lab" className="home-lab-link">
          Open the full lab
          <span aria-hidden className="arrow-shift">→</span>
        </Link>
      </div>

      <div className="home-lab-controls">
        <div className="home-lab-scenarios" role="group" aria-label="Home lab attack scenarios">
          {ATTACK_SCENARIOS.map((item) => {
            const active = item.id === scenario.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setScenarioId(item.id)}
                className={`home-lab-chip${active ? " is-active" : ""}`}
              >
                <span className="home-lab-chip-num">{item.index}</span>
                <span className="home-lab-chip-label">{shortTitle(item.title)}</span>
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Home lab security mode"
          className="home-lab-modes"
        >
          <button
            type="button"
            aria-pressed={mode === "vulnerable"}
            onClick={() => setMode("vulnerable")}
            className={`home-lab-mode${mode === "vulnerable" ? " is-vulnerable" : ""}`}
          >
            Vulnerable
          </button>
          <button
            type="button"
            aria-pressed={mode === "hardened"}
            onClick={() => setMode("hardened")}
            className={`home-lab-mode${mode === "hardened" ? " is-hardened" : ""}`}
          >
            Hardened
          </button>
        </div>
      </div>

      <div className="home-lab-body">
        <div className={`home-lab-outcome${blocked ? " is-blocked" : " is-open"}`}>
          <span aria-hidden className="home-lab-outcome-mark">
            {blocked ? "✓" : "!"}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]">
              {blocked ? "Attack blocked" : "Attack succeeded in vulnerable mode"}
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-[var(--fg)]">
              {blocked
                ? "The boundary held and the unauthorized action never executed."
                : "The baseline trusted the model, so the action reached the data layer."}
            </p>
          </div>
          <span className="home-lab-outcome-tag">{result.outcome}</span>
        </div>

        <ol className="home-lab-trace" aria-label="Execution trace">
          {result.trace.map((step) => (
            <li key={step.stage} className="home-lab-step" data-status={step.status}>
              <span aria-hidden className="home-lab-step-dot" />
              <div className="min-w-0">
                <p className="home-lab-step-name">
                  {STAGE_NUMBER[step.stage]} {STAGE_LABEL[step.stage]}
                </p>
                <p className="home-lab-step-detail">{step.detail}</p>
              </div>
              <span className="home-lab-step-state">{step.status}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="home-lab-note">
        Synthetic tenants only. Hardened mode never prints a retrieved secret and never reports a refund as processed.
      </p>
    </div>
  );
}
