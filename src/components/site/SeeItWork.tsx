"use client";

import { useState } from "react";
import { AgentLabDemo } from "@/components/site/AgentLabDemo";
import { DetectionsStream } from "@/components/site/DetectionsStream";

export function SeeItWork() {
  const [panel, setPanel] = useState<"agent" | "detections">("agent");

  return (
    <section id="see-it-work" className="see-section mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)]">
      <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">See it work</p>
      <h2 className="heading-reveal mt-4 max-w-[16ch] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--fg-strong)] [font-size:var(--h2-size)]">
        Two of my labs, running in your browser.
      </h2>
      <div className="see-switch mt-6" role="tablist" aria-label="Lab panels">
        <span aria-hidden className="see-thumb" data-side={panel} />
        <button type="button" role="tab" aria-selected={panel === "agent"} onClick={() => setPanel("agent")}>
          Agent lab
        </button>
        <button type="button" role="tab" aria-selected={panel === "detections"} onClick={() => setPanel("detections")}>
          Detections
        </button>
      </div>
      <div className="see-grid mt-4" data-panel={panel}>
        <AgentLabDemo />
        <DetectionsStream />
      </div>
    </section>
  );
}
