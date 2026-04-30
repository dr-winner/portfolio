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
        {/* Full container width (.container already matches rest of site; no inner max-width) */}
        <div className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/90 py-0 dark:border-white/12 dark:bg-ink-100/55">
          <div className="overflow-hidden px-5 py-5 sm:px-7 md:px-10 md:py-6">
            <div className="mask-fade-x-rail">
              <div className="flex w-max animate-move-left gap-10 md:gap-14 pr-10 md:pr-14 [animation-duration:90s] hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, i) => (
                  <Fragment key={i}>
                    {signalWords.map((w) => (
                      <span
                        key={`${i}-${w}`}
                        className="inline-flex shrink-0 items-center gap-2.5 text-[13px] font-medium tracking-tight text-slate-600 md:text-sm dark:text-slate-300"
                      >
                        <span className="size-1 shrink-0 rounded-full bg-cyber-500/70 dark:bg-cyber-300" />
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
