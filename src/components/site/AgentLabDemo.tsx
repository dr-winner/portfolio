"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { announce, prefersReducedMotion } from "@/lib/motion";
import {
  ATTACK_SCENARIOS,
  KNOWLEDGE_CHUNKS,
  runScenario,
  type SecurityMode,
} from "@/lab/llm-agent-security/engine";

const STAGE_LABELS = {
  retrieval: "RAG Retriever",
  prompt_assembly: "Prompt Context Assembly",
  tool_policy: "Tool Policy Gate",
  output_handling: "Output Sanitizer",
} as const;

function shortTitle(title: string) {
  return title.split("→")[0]?.trim() || title;
}

export function AgentLabDemo() {
  const [mode, setMode] = useState<SecurityMode>("vulnerable");
  const [scenarioId, setScenarioId] = useState(ATTACK_SCENARIOS[0].id);
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const scenario = ATTACK_SCENARIOS.find((item) => item.id === scenarioId) ?? ATTACK_SCENARIOS[0];
  const result = runScenario(scenario, mode);
  const chunks = KNOWLEDGE_CHUNKS.filter((chunk) => result.retrievedChunkIds.includes(chunk.id));
  const reply = result.sanitizedOutput || scenario.simulatedRawModelOutput;
  const stream = mode === "vulnerable";

  useEffect(() => {
    const current = ATTACK_SCENARIOS.find((item) => item.id === scenarioId) ?? ATTACK_SCENARIOS[0];
    const evaluation = runScenario(current, mode);
    const text = evaluation.sanitizedOutput || current.simulatedRawModelOutput;
    const streaming = mode === "vulnerable";
    const reduced = prefersReducedMotion();
    if (reduced) {
      setStep(8);
      setChars(text.length);
      return undefined;
    }
    setStep(0);
    setChars(0);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), 160));
    timers.push(window.setTimeout(() => setStep(2), 480));
    timers.push(window.setTimeout(() => setStep(3), 780));
    const streamMs = streaming ? Math.min(text.length, 280) * 18 : 0;
    timers.push(window.setTimeout(() => setStep(4), 860 + streamMs));
    evaluation.trace.forEach((_, index) => {
      timers.push(window.setTimeout(() => setStep(5 + index), 980 + streamMs + index * 300));
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [mode, scenarioId, runKey]);

  useEffect(() => {
    if (step < 3 || prefersReducedMotion()) return undefined;
    if (!stream) {
      setChars(reply.length);
      return undefined;
    }
    if (step !== 3) return undefined;
    let count = 0;
    const limit = Math.min(reply.length, 280);
    const timer = window.setInterval(() => {
      count += 1;
      setChars(count >= limit ? reply.length : count);
      if (count >= limit) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [step, stream, reply]);

  useEffect(() => {
    if (step < 8) return;
    const gate = result.trace.find((item) => item.stage === "tool_policy");
    if (result.outcome === "BLOCKED") {
      announce(`Request blocked at Tool Policy Gate. ${gate?.detail ?? ""}`);
    } else {
      announce(`Vulnerable run finished. Outcome exploited. ${scenario.index}.`);
    }
    // Announce once when the staged run completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, runKey]);

  function replay(nextMode: SecurityMode, nextId: string) {
    setMode(nextMode);
    setScenarioId(nextId);
    setRunKey((value) => value + 1);
  }

  const ids = scenario.owaspRef.match(/LLM\d+|API\d+/g) ?? [];
  const shownReply = stream && step >= 3 ? reply.slice(0, chars) : step >= 4 || !stream ? reply : "";

  return (
    <div className="lab-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-[36ch] font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
          Runs the lab code from this repository. No model is called.
        </p>
        <div className="mode-toggle" data-mode={mode} role="group" aria-label="Pipeline mode">
          <span aria-hidden className="mode-thumb" />
          <button type="button" aria-pressed={mode === "vulnerable"} onClick={() => replay("vulnerable", scenario.id)}>
            Vulnerable
          </button>
          <button type="button" aria-pressed={mode === "hardened"} onClick={() => replay("hardened", scenario.id)}>
            Hardened
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto" role="tablist" aria-label="Lab scenarios">
        {ATTACK_SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === scenario.id}
            onClick={() => replay(mode, item.id)}
            className={`h-11 shrink-0 rounded-[8px] border px-3 font-mono text-[12px] ${
              item.id === scenario.id
                ? "border-[var(--signal)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--fg-muted)]"
            }`}
          >
            {item.index} {shortTitle(item.title)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 min-[1024px]:grid-cols-[minmax(0,1fr)_210px]">
        <div className="min-w-0 rounded-[12px] border border-[var(--line)] bg-[var(--bg-deep)] p-4">
          <p className={`font-mono text-[13px] leading-[1.55] text-[var(--fg)] ${step >= 1 ? "result-in" : "opacity-0"}`}>
            {scenario.userPrompt}
          </p>
          <div className={`mt-3 space-y-2 ${step >= 2 ? "result-in" : "opacity-0"}`}>
            {chunks.map((chunk) => (
              <p key={chunk.id} className="font-mono text-[13px] leading-[1.55] text-[var(--fg-muted)]">
                {highlightOverride(chunk.content)}
              </p>
            ))}
          </div>
          <p className="mt-3 min-h-[3.2em] font-mono text-[13px] leading-[1.55] text-[var(--fg)]">{shownReply}</p>
          {step >= 4 && result.executedTools.length > 0 ? (
            <p className="mt-3 rounded-[8px] border border-[color-mix(in_srgb,var(--danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] px-3 py-2 font-mono text-[13px] text-[var(--danger)]">
              {result.executedTools[0]} ran
            </p>
          ) : null}
          {step >= 4 && result.blockedTools.length > 0 ? (
            <p className="mt-3 font-mono text-[13px] leading-[1.5] text-[var(--fg-muted)]">{result.blockedTools.map((item) => item.reason).join(" ")}</p>
          ) : null}
        </div>
        <ol className={`lab-rail ${mode === "vulnerable" ? "is-open" : ""}`}>
          {result.trace.map((item, index) => {
            const visible = step >= 5 + index;
            const blocked = item.status === "blocked";
            return (
              <li key={item.stage} className={visible ? `is-${item.status}` : "is-wait"}>
                <span>{STAGE_LABELS[item.stage]}</span>
                {visible ? (
                  blocked ? (
                    <strong className="blocked-badge badge-pop">BLOCKED</strong>
                  ) : (
                    <em>{item.status}</em>
                  )
                ) : (
                  <em>waiting</em>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className={`mt-4 min-h-[52px] ${step >= 8 ? "result-in" : "opacity-0"}`}>
        <p className="flex flex-wrap items-center gap-2 font-mono text-[13px] text-[var(--fg)]">
          <span>{ids.join(" / ")}</span>
          <span className="sev sev-high">{scenario.cvssScore.includes("High") ? "High" : scenario.cvssScore}</span>
          <span className="text-[20px]">{scenario.cvssScore.split(" ")[0]}</span>
        </p>
        {result.trace.find((item) => item.status === "blocked") ? (
          <p className="mt-1 font-mono text-[12px] leading-[1.45] text-[var(--fg-muted)]">
            {result.trace.find((item) => item.status === "blocked")?.detail}
          </p>
        ) : null}
      </div>
      <Link href="/work/llm-agent-security-lab" className="mt-2 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-[var(--signal)] no-underline">
        Open the full lab
        <span aria-hidden className="arrow-shift">
          →
        </span>
      </Link>
    </div>
  );
}

function highlightOverride(text: string) {
  const at = text.toLowerCase().indexOf("[system override");
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent text-[var(--amber)]">{text.slice(at)}</mark>
    </>
  );
}
