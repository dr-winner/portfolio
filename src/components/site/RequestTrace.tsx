"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { announce, prefersReducedMotion } from "@/lib/motion";
import {
  PRESETS,
  STAGES,
  announcement,
  presetById,
  requestLines,
  resultFor,
  type PresetId,
  type TraceResult,
} from "@/lib/trace";

type StageState = "wait" | "scan" | "passed" | "blocked" | "skipped";

type Ui = {
  preset: PresetId;
  value: string;
  typed: number;
  dim: boolean;
  stages: StageState[];
  burst: boolean;
  flash: boolean;
  badge: boolean;
  resultOn: boolean;
  pillOn: boolean;
  cvss: number;
  showResult: boolean;
};

let autoplayRetired = false;

function finalUi(preset: PresetId, value: string): Ui {
  const result = resultFor(preset, value);
  const stages: StageState[] = ["wait", "wait", "wait"];
  if (result.outcome === "pass") {
    stages[0] = stages[1] = stages[2] = "passed";
  } else if (result.blockAt !== null) {
    for (let i = 0; i < result.blockAt; i += 1) stages[i] = "passed";
    stages[result.blockAt] = "blocked";
    for (let i = result.blockAt + 1; i < 3; i += 1) stages[i] = "skipped";
  }
  return {
    preset,
    value,
    typed: 999,
    dim: false,
    stages,
    burst: false,
    flash: false,
    badge: result.outcome === "block",
    resultOn: true,
    pillOn: result.severity !== null,
    cvss: result.cvss ?? 0,
    showResult: true,
  };
}

function startUi(preset: PresetId, value: string): Ui {
  return {
    preset,
    value,
    typed: 0,
    dim: false,
    stages: ["wait", "wait", "wait"],
    burst: false,
    flash: false,
    badge: false,
    resultOn: false,
    pillOn: false,
    cvss: 0,
    showResult: false,
  };
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function RequestTrace() {
  const [ui, setUi] = useState<Ui>(() => finalUi("sqli", presetById("sqli").value));
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const packetRef = useRef<HTMLSpanElement | null>(null);
  const runId = useRef(0);
  const paused = useRef(false);
  const inView = useRef(true);
  const uiRef = useRef(ui);
  uiRef.current = ui;

  function patch(partial: Partial<Ui>) {
    setUi((current) => ({ ...current, ...partial }));
  }

  function placePacket(progress: number) {
    const node = packetRef.current;
    if (!node) return;
    node.style.setProperty("--packet", String(progress));
    node.dataset.on = progress >= 0 ? "true" : "false";
  }

  function pulseHero() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    hero.removeAttribute("data-flash");
    // Restart the light reaction if a block lands again quickly.
    void (hero as HTMLElement).offsetWidth;
    hero.setAttribute("data-flash", "on");
    window.setTimeout(() => hero.removeAttribute("data-flash"), 1200);
  }

  function run(preset: PresetId, value: string) {
    const id = ++runId.current;
    const reduced = prefersReducedMotion();
    const result = resultFor(preset, value);
    if (reduced) {
      setUi(finalUi(preset, value));
      placePacket(-1);
      announce(announcement(result));
      return;
    }

    setUi(startUi(preset, value));
    placePacket(-1);
    const lines = requestLines(preset, value);
    const typedLine = lines.find((line) => line.typed);
    const typeDur = typedLine ? Math.min(420, typedLine.text.length * 12) : 0;
    let acc = 0;
    let last = performance.now();
    let raf = 0;
    let finished = false;
    let blocked = false;
    let resultStarted = false;
    let pillStarted = false;
    let cvssStarted = false;
    let lastKey = "";
    const blockAt = result.blockAt;
    const lastStage = blockAt === null ? 2 : blockAt;

    const arrive = (index: number) => 450 + 280 * (index + 1);
    const scanEnd = (index: number) => arrive(index) + 400;

    function tickCvss(target: number) {
      const started = performance.now();
      function frame(now: number) {
        if (runId.current !== id) return;
        const t = Math.min(1, (now - started) / 400);
        patch({ cvss: Math.round(target * easeOut(t) * 10) / 10 });
        if (t < 1) requestAnimationFrame(frame);
        else patch({ cvss: target });
      }
      requestAnimationFrame(frame);
    }

    function frame(now: number) {
      if (runId.current !== id || finished) return;
      const hidden = document.visibilityState !== "visible" || !inView.current;
      const dt = Math.min(40, now - last);
      last = now;
      if (!paused.current && !hidden) acc += dt;

      const typedNow =
        typeDur > 0
          ? Math.min(typedLine?.text.length ?? 0, Math.round((typedLine?.text.length ?? 0) * Math.min(1, acc / typeDur)))
          : 999;
      const dimNow = acc >= 450 && !(blockAt !== null && acc >= scanEnd(blockAt));

      const stages: StageState[] = ["wait", "wait", "wait"];
      let packet = -1;
      for (let index = 0; index <= lastStage; index += 1) {
        const start = arrive(index) - 280;
        const at = arrive(index);
        const done = scanEnd(index);
        if (acc >= start && acc < at) {
          const local = (acc - start) / 280;
          const eased = easeOut(Math.min(1, Math.max(0, local)));
          packet = index + eased;
          stages[index] = "wait";
        }
        if (acc >= at && acc < done) stages[index] = "scan";
        if (acc >= done) stages[index] = index === blockAt ? "blocked" : "passed";
      }
      if (blockAt !== null && acc >= scanEnd(blockAt)) {
        for (let index = blockAt + 1; index < 3; index += 1) stages[index] = "skipped";
      }
      placePacket(packet);
      const key = `${typedNow}|${dimNow ? 1 : 0}|${stages.join(".")}`;
      if (key !== lastKey) {
        lastKey = key;
        patch({ typed: typedNow, dim: dimNow, stages });
      }

      if (blockAt !== null && acc >= scanEnd(blockAt) && !blocked) {
        blocked = true;
        patch({ burst: true, flash: true, badge: true, dim: false });
        placePacket(blockAt + 1);
        pulseHero();
      }

      const after = blockAt === null ? scanEnd(2) : scanEnd(blockAt) + 180;
      if (acc >= after && !resultStarted) {
        resultStarted = true;
        patch({ showResult: true, resultOn: true });
      }
      if (acc >= after + 280 && !pillStarted) {
        pillStarted = true;
        patch({ pillOn: true });
      }
      if (acc >= after + 420 && !cvssStarted && result.cvss) {
        cvssStarted = true;
        tickCvss(result.cvss);
      }

      const endAt = after + (result.cvss ? 860 : 420);
      if (acc >= endAt) {
        finished = true;
        patch({ dim: false, typed: 999, cvss: result.cvss ?? 0 });
        announce(announcement(result));
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      if (runId.current === id) cancelAnimationFrame(raf);
    };
  }

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onExternal(event: Event) {
      const id = (event as CustomEvent<PresetId>).detail;
      if (!id) return;
      autoplayRetired = true;
      const preset = presetById(id);
      const index = PRESETS.findIndex((item) => item.id === id);
      setActive(index < 0 ? 0 : index);
      run(preset.id, preset.value);
      document.getElementById("hero")?.scrollIntoView();
    }
    window.addEventListener("trace:run", onExternal);
    return () => window.removeEventListener("trace:run", onExternal);
    // run closes over latest helpers. Rebinding per render is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoplayRetired || prefersReducedMotion()) return undefined;
    const node = rootRef.current;
    if (!node) return undefined;
    let dead = false;
    let started = false;
    let timer = 0;
    const cycles = window.matchMedia("(max-width: 767px)").matches ? 1 : 2;
    const order: PresetId[] = ["sqli", "idor", "prompt"];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const begin = performance.now();
        let held = 0;
        let last = begin;
        function step(now: number) {
          if (dead || autoplayRetired) {
            resolve();
            return;
          }
          const dt = Math.min(40, now - last);
          last = now;
          if (!paused.current && inView.current && document.visibilityState === "visible") held += dt;
          if (held >= ms) resolve();
          else requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });

    async function cycle() {
      for (let round = 0; round < cycles; round += 1) {
        for (const id of order) {
          if (dead || autoplayRetired) return;
          const preset = presetById(id);
          const index = PRESETS.findIndex((item) => item.id === id);
          setActive(index);
          run(preset.id, preset.value);
          await wait(3200);
          if (dead || autoplayRetired) return;
          await wait(2200);
        }
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !started) {
          started = true;
          timer = window.setTimeout(() => {
            if (!dead && !autoplayRetired) void cycle();
          }, 800);
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      dead = true;
      window.clearTimeout(timer);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retire() {
    autoplayRetired = true;
  }

  function select(index: number) {
    retire();
    const preset = PRESETS[index];
    setActive(index);
    run(preset.id, preset.value);
  }

  function onTabsKey(event: KeyboardEvent<HTMLDivElement>) {
    const last = PRESETS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      select(next);
      document.getElementById(`trace-tab-${next}`)?.focus();
    }
  }

  function send() {
    retire();
    run(uiRef.current.preset, uiRef.current.value);
  }

  const lines = requestLines(ui.preset, ui.value);
  const result: TraceResult = resultFor(ui.preset, ui.value);
  const shownLines = lines.map((line) => {
    if (!line.typed || ui.typed >= line.text.length) return line.text;
    return line.text.slice(0, ui.typed);
  });

  return (
    <figure
      ref={rootRef}
      className="trace-card relative m-0"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onFocusCapture={() => {
        paused.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) paused.current = false;
      }}
      onKeyDown={() => retire()}
      onPointerDown={() => retire()}
    >
      <span aria-hidden className="trace-shadow" />
      <span aria-hidden className="edge-light" />
      <span aria-hidden className={`trace-flash ${ui.flash ? "is-on" : ""}`} />
      <div className="flex items-center justify-between px-4 py-3">
        <figcaption className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Request trace</figcaption>
        <span className="rounded-full border border-[var(--line-strong)] px-2 py-0.5 font-mono text-[12px] text-[var(--fg-subtle)]">
          Simulation. Runs in your browser.
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Attack presets"
        onKeyDown={onTabsKey}
        className="relative mx-3 flex border-b border-[var(--line)]"
      >
        <span aria-hidden className="tab-thumb" style={{ transform: `translateX(${active * 100}%)` }} />
        {PRESETS.map((preset, index) => (
          <button
            key={preset.id}
            id={`trace-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={index === active}
            aria-controls="trace-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            className={`relative z-[1] h-11 whitespace-nowrap px-1 font-mono text-[12px] tracking-[0.01em] min-[700px]:text-[14px] ${
              index === 2 ? "flex-[1.45]" : "flex-1"
            } ${index === active ? "text-[var(--fg-strong)]" : "text-[var(--fg-subtle)]"}`}
          >
            <span className="max-[399px]:hidden">{preset.label}</span>
            <span className="hidden max-[399px]:inline">{preset.short}</span>
          </button>
        ))}
      </div>

      <div id="trace-panel" role="tabpanel" aria-labelledby={`trace-tab-${active}`} className={`px-4 py-3 ${ui.dim ? "opacity-70" : ""}`}>
        <div className="req-scroll">
          {lines.map((line, index) => (
            <div key={line.n} className="flex items-baseline gap-3 font-mono text-[13px] leading-[1.55] min-[700px]:text-[14px]">
              <span aria-hidden className="w-5 shrink-0 text-[var(--fg-subtle)]">
                {line.n}
              </span>
              <code className={`whitespace-pre ${line.tone === "muted" ? "text-[var(--fg-subtle)]" : line.tone === "signal" ? "text-[var(--signal)]" : "text-[var(--fg)]"}`}>
                {shownLines[index]}
              </code>
            </div>
          ))}
        </div>
      </div>

      <form
        className="flex flex-col gap-2 px-4 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <label className="min-w-0 flex-1">
          <span className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Try your own value</span>
          <input
            value={ui.value}
            maxLength={200}
            spellCheck={false}
            autoComplete="off"
            aria-label="Try your own value"
            onChange={(event) => {
              retire();
              patch({ value: event.target.value.slice(0, 200) });
            }}
            className="h-12 w-full rounded-[10px] border border-[var(--line-strong)] bg-[var(--bg-deep)] px-3 font-mono text-[16px] text-[var(--fg)] outline-none"
          />
        </label>
        <button
          type="submit"
          className="pressable mt-auto h-12 rounded-[10px] bg-[var(--signal)] px-5 font-mono text-[14px] font-medium text-[var(--on-signal)] sm:w-auto max-sm:w-full"
        >
          Send
        </button>
      </form>

      <div className="relative mx-4 mt-4">
        <div className="rail">
          <span ref={packetRef} aria-hidden data-on="false" className="packet" />
          {ui.burst ? (
            <span aria-hidden className="burst">
              {[-18, -8, 10, 18, -14, 14].map((x, index) => (
                <i key={x} style={{ ["--bx" as string]: `${x}px`, ["--by" as string]: `${index % 2 === 0 ? -16 : 14}px` }} />
              ))}
            </span>
          ) : null}
          {STAGES.map((label, index) => {
            const state = ui.stages[index];
            return (
              <div key={label} className={`stage stage-${state}`}>
                <span className="stage-name">{label}</span>
                <span className="stage-word">
                  {state === "passed" ? "passed" : state === "blocked" ? "blocked" : state === "skipped" ? "not reached" : state === "scan" ? "checking" : "waiting"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-4 mt-4 flex min-h-[72px] flex-wrap items-center gap-3" aria-hidden={!ui.showResult}>
        {ui.showResult ? (
          <>
            <p className={`font-mono text-[14px] ${result.outcome === "block" ? "text-[var(--danger)]" : "text-[var(--signal)]"} ${ui.resultOn ? "result-in" : "opacity-0"}`}>
              {result.status}
            </p>
            {result.severity && ui.pillOn ? <span className="sev sev-high badge-pop">{result.severity}</span> : null}
            {result.cvss !== null && ui.pillOn ? (
              <span className="font-mono text-[20px] font-medium text-[var(--fg-strong)]">{ui.cvss.toFixed(1)}</span>
            ) : null}
            {ui.badge ? (
              <span className="blocked-badge badge-pop">
                <span aria-hidden className="blocked-ring" />
                BLOCKED
              </span>
            ) : null}
            <p className="w-full font-mono text-[12px] leading-[1.45] text-[var(--fg-muted)]">
              {result.outcome === "block" ? (
                <>
                  Rule {result.rule}. {result.detail}
                </>
              ) : (
                result.detail
              )}
            </p>
          </>
        ) : null}
      </div>

      <div className="mt-2 border-t border-[var(--line)] px-4 py-3">
        <a href={result.href} className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-[var(--signal)] no-underline">
          See the case study
          <span aria-hidden className="arrow-shift">
            →
          </span>
        </a>
      </div>
    </figure>
  );
}
