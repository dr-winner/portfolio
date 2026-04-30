import React, { Fragment } from "react";
import { signalWords } from "@/content/keywords";

/**
 * Sits in the same horizontal band as the hero (container width).
 * Inner track is padded so the marquee does not “kiss” the rounded border;
 * soft horizontal mask for gentle fade.
 */
export function SignalStrip() {
  return (
    <section aria-label="Signal keywords" className="relative pb-8 md:pb-10">
      <div className="container">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200/90 bg-slate-50/90 py-0 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-ink-100/55 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="px-6 sm:px-8 md:px-10 py-5 md:py-6 overflow-hidden">
            <div className="mask-fade-x-soft">
              <div className="flex w-max animate-move-left gap-10 md:gap-14 pr-10 md:pr-14 [animation-duration:90s] hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, i) => (
                  <Fragment key={i}>
                    {signalWords.map((w) => (
                      <span
                        key={`${i}-${w}`}
                        className="inline-flex shrink-0 items-center gap-2.5 text-[12px] tracking-tight text-slate-500 md:text-[13px] dark:text-white/50"
                      >
                        <span className="size-1 rounded-full bg-cyber-500/60 shadow-glow-sm dark:bg-cyber-300/50" />
                        <span className="font-mono uppercase tracking-wider">{w}</span>
                      </span>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
