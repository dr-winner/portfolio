import { Suspense } from "react";
import type { Metadata } from "next";
import { WorkIndex } from "@/components/site/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Application security case studies, labs and builds by Richard Winner Duvor. Training labs are labelled as training labs.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Work</p>
      <h1 className="mt-3 text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">Case studies, labs and builds</h1>
      <p className="mt-4 max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
        Each case study says where the work happened and what I was allowed to test. Training labs are marked as training labs.
      </p>
      <div className="mt-10">
        <Suspense>
          <WorkIndex />
        </Suspense>
      </div>
    </div>
  );
}
