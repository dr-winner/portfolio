import type { Metadata } from "next";
import { headers } from "next/headers";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/site/SectionLabel";
import { WorkIndex } from "@/components/site/WorkIndex";
import { WindowShell } from "@/os/shell/WindowShell";
import { FilesWindowContent } from "@/os/apps/files/FilesWindowContent";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Application security case studies, labs and builds by Richard Winner Duvor. Training labs are labelled as training labs.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const view = (await headers()).get("x-view");

  /* Fix 1 of the phase 1 review: in the OS frame the work index lives in a
     Files window, never as a full page behind the dock. The classic frame
     keeps the document index. */
  if (view !== "classic") {
    return (
      <WindowShell id="files" app="files" title="Files">
        <FilesWindowContent />
      </WindowShell>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-[var(--space-2xl)]">
      <Reveal y={10}>
        <SectionLabel title="Work index" />
      </Reveal>
      <Reveal delay={80} y={20}>
        <h1 className="mt-6 text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">Case studies, labs and builds</h1>
      </Reveal>
      <Reveal delay={160} y={16}>
        <p className="mt-5 max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
          Each case study says where the work happened and what I was allowed to test. Training labs are marked as training labs.
        </p>
      </Reveal>
      <Reveal delay={240} y={16}>
        <div className="fx-rule mt-8 h-px w-full bg-[var(--line)]" />
        <div className="mt-10">
          <WorkIndex />
        </div>
      </Reveal>
    </div>
  );
}
