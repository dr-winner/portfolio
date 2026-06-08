"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GitBranch, GitPullRequest, Zap } from "lucide-react";
import clsx from "clsx";
import { GithubIcon } from "@/components/BrandIcons";
import { profile } from "@/content/profile";
import { levelForCount } from "@/lib/github/insights-helpers";

const GH = {
  empty: "bg-[#ebedf0] dark:bg-[#161b22]",
  l1: "bg-[#9be9a8] dark:bg-[#0e4429]",
  l2: "bg-[#40c463] dark:bg-[#006d32]",
  l3: "bg-[#30a14e] dark:bg-[#26a641]",
  l4: "bg-[#216e39] dark:bg-[#39d353]",
} as const;

type Day = { date: string; count: number };
type Week = { days: Day[] };

export type GitHubInsights = {
  error: string | null;
  message?: string;
  login: string;
  range: { from: string; to: string };
  stats: {
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalContributions: number;
  };
  streak: { current: number; longest: number };
  weeks: Week[];
};

function fmtCompact(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  }
  return n.toLocaleString();
}

const statConfig = [
  { key: "totalCommitContributions" as const, label: "Commits", icon: GitBranch },
  { key: "totalPullRequestContributions" as const, label: "PRs", icon: GitPullRequest },
] as const;

function isInsightsReady(
  d: GitHubInsights | null
): d is GitHubInsights & { weeks: Week[]; stats: NonNullable<GitHubInsights["stats"]> } {
  if (d == null) return false;
  if (d.error) return false;
  return Array.isArray(d.weeks) && d.weeks.length > 0;
}

export function GitHubLivePanel() {
  const [data, setData] = useState<GitHubInsights | null>(null);
  const [err, setErr] = useState(false);

  const flatDays = useMemo(() => {
    if (!isInsightsReady(data)) return [] as Day[];
    const o: Day[] = [];
    for (const w of data.weeks) for (const d of w.days) o.push(d);
    return o;
  }, [data]);

  const maxC = useMemo(
    () => (flatDays.length < 1 ? 1 : Math.max(1, ...flatDays.map((d) => d.count))),
    [flatDays]
  );

  const nWeeks = isInsightsReady(data) ? data.weeks.length : 0;

  const monthLabelCells = useMemo(() => {
    if (!isInsightsReady(data)) return [] as (string | null)[];
    return data.weeks.map((w, i) => {
      const d0 = w.days[0].date;
      if (i === 0) {
        return new Date(d0 + "T12:00:00Z").toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
      }
      const prev = data.weeks[i - 1]!.days[0].date;
      if (d0.slice(0, 7) !== prev.slice(0, 7)) {
        return new Date(d0 + "T12:00:00Z").toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
      }
      return null;
    });
  }, [data]);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const r = await fetch("/api/github/insights", { cache: "no-store" });
        const j = (await r.json()) as GitHubInsights;
        if (!c) setData(j);
      } catch {
        if (!c) setErr(true);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  const gh = profile.socials.github;

  if (err || (data && data.error)) {
    return <GitHubFallback gh={gh} login={data?.login} />;
  }

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl border border-slate-200/90 bg-slate-100/80 md:col-span-2 lg:col-span-2 dark:border-white/10 dark:bg-white/[0.04]" />
        <div className="h-64 animate-pulse rounded-2xl border border-slate-200/90 bg-slate-100/80 lg:col-span-1 dark:border-white/10 dark:bg-white/[0.04]" />
      </div>
    );
  }

  const s = data.stats;

  return (
    <div className="w-full text-left">
      {/* Top summary — one horizontal band */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/90 pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">Last 12 months</p>
          <p className="mt-1 font-mono text-3xl font-semibold leading-none tracking-tight text-cyber-700 sm:text-4xl dark:text-cyber-200">
            {s.totalContributions.toLocaleString()}
            <span className="ml-2 font-sans text-base font-medium text-slate-500 dark:text-white/50">contributions</span>
          </p>
        </div>
        <a
          href={gh}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-4 py-2 text-sm text-slate-800 transition-all hover:border-cyber-500/35 hover:bg-slate-50 dark:border-white/12 dark:bg-white/[0.04] dark:text-white/85 dark:hover:border-cyber-300/35 dark:hover:bg-white/[0.06]"
        >
          <GithubIcon className="size-4 text-cyber-600/90 dark:text-cyber-200/80" />
          @{data.login}
          <ExternalLink className="size-3.5 text-slate-400 group-hover:text-slate-600 dark:text-white/35 dark:group-hover:text-white/55" />
        </a>
      </div>

      {/* Bento: graph + sidebar — items-start so the graph column doesn’t stretch to sidebar height */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* Primary: heatmap (fluid width, no horizontal scroll) */}
        {nWeeks > 0 && (
          <div className="order-1 min-w-0 self-start lg:col-span-7 xl:col-span-8">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 p-3 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)] [background-image:radial-gradient(120%_80%_at_10%_0%,rgba(60,207,255,0.1)_0%,transparent_50%)] dark:border-white/10 dark:bg-[#06080d] dark:shadow-none dark:[background-image:radial-gradient(120%_80%_at_10%_0%,rgba(60,207,255,0.06)_0%,transparent_50%)] sm:p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-white/50">
                  Contribution graph
                </h3>
                <p className="text-[10px] text-cyber-600/70 md:hidden dark:text-cyber-200/50">Swipe graph →</p>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-white/35">
                  <span>Less</span>
                  <span className="inline-flex gap-0.5">
                    <span className={clsx("h-2 w-2 rounded-sm", GH.empty)} />
                    <span className={clsx("h-2 w-2 rounded-sm", GH.l2)} />
                    <span className={clsx("h-2 w-2 rounded-sm", GH.l4)} />
                  </span>
                  <span>More</span>
                </div>
              </div>
              {/** On narrow screens the grid is hard to read — allow horizontal pan. Desktop stays fluid. */}
              <div className="overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:overflow-x-visible">
                <div className="min-w-[560px] md:w-full md:min-w-0">
                <div className="mb-1.5 flex w-full min-w-0 gap-1.5 sm:gap-2">
                  <div className="w-5 shrink-0 sm:w-6" aria-hidden />
                  <div
                    className="grid min-h-[12px] min-w-0 flex-1 gap-0.5 text-left text-[9px] text-slate-400 sm:text-[10px] dark:text-white/30"
                    style={{ gridTemplateColumns: `repeat(${nWeeks}, minmax(0, 1fr))` }}
                    aria-hidden
                  >
                    {monthLabelCells.map((lab, i) => (
                      <span key={`h-${i}`} className="truncate pl-0.5">
                        {lab ?? ""}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex w-full min-w-0 items-stretch gap-1.5 sm:gap-2">
                  <div
                    className="grid w-5 shrink-0 text-[8px] leading-none text-slate-400 sm:w-6 sm:text-[9px] dark:text-white/30"
                    style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
                    aria-hidden
                  >
                    {["", "M", "", "W", "", "F", ""].map((lab, i) => (
                      <div key={i} className="flex items-center justify-end">
                        {lab}
                      </div>
                    ))}
                  </div>
                  <div
                    className="min-w-0 flex-1"
                    style={{
                      aspectRatio: `${nWeeks} / 7`,
                      maxWidth: "100%",
                    }}
                  >
                    <div
                      className="grid h-full w-full gap-0.5"
                      style={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateColumns: `repeat(${nWeeks}, minmax(0, 1fr))`,
                        gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                      }}
                      role="img"
                      aria-label="Contribution calendar from GitHub"
                    >
                      {data.weeks.map((w) =>
                        w.days.map((d) => {
                          const c = d.count;
                          const level = levelForCount(c, maxC);
                          const cl =
                            c < 1
                              ? GH.empty
                              : level === 0
                                ? GH.empty
                                : level === 1
                                  ? GH.l1
                                  : level === 2
                                    ? GH.l2
                                    : level === 3
                                      ? GH.l3
                                      : GH.l4;
                          const label =
                            c === 0 ? `No contributions on ${d.date}` : `${c} on ${d.date}`;
                          return (
                            <div
                              key={d.date}
                              title={label}
                              className={clsx(
                                "min-h-0 min-w-0 rounded-[1px] outline outline-1 outline-slate-300/70 transition-[filter] hover:brightness-110 sm:rounded-[2px] dark:outline-black/30",
                                cl
                              )}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar: metrics + streaks */}
        <aside className="order-2 flex min-w-0 flex-col gap-4 self-start lg:col-span-5 xl:col-span-4">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
              Activity
            </p>
            <div className="grid grid-cols-2 gap-2">
              {statConfig.map(({ key, label, icon: Icon }) => {
                const v = s[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-slate-200/90 bg-white/90 px-2.5 py-2.5 transition-colors hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.02] dark:hover:border-white/12"
                  >
                    <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 dark:text-white/40">
                      <Icon className="size-3 shrink-0 text-cyber-600/70 dark:text-cyber-200/45" />
                      {label}
                    </div>
                    <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900 sm:text-xl dark:text-white">
                      {typeof v === "number" ? fmtCompact(v) : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200/90 bg-gradient-to-b from-cyber-500/[0.06] to-transparent p-3 dark:border-white/8 dark:from-cyber-300/[0.04]">
            <div className="text-center">
              <p className="text-[9px] text-slate-500 dark:text-white/40">Current streak</p>
              <p className="mt-1 flex items-center justify-center gap-1 font-mono text-xl font-semibold text-slate-900 dark:text-white">
                <Zap className="size-4 text-amber-600/90 dark:text-amber-300/80" />
                {data.streak.current}
                <span className="text-xs font-sans font-normal text-slate-500 dark:text-white/45">d</span>
              </p>
            </div>
            <div className="text-center sm:border-l sm:border-slate-200/90 sm:pl-2 dark:sm:border-white/10">
              <p className="text-[9px] text-slate-500 dark:text-white/40">Longest streak</p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900 dark:text-white/90">
                {data.streak.longest}
                <span className="ml-0.5 text-xs font-sans font-normal text-slate-500 dark:text-white/45">d</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function GitHubFallback({ gh, login }: { gh: string; login?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
          Open source
        </p>
        <p className="mt-2 max-w-xl text-base text-slate-700 dark:text-white/75">
          Live contribution data isn&apos;t available right now. The full history,
          pinned repos, and recent commits are on the GitHub profile.
        </p>
        <div className="mt-5">
          <a
            href={gh}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-cyber-500/35 bg-cyber-500/[0.08] px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-cyber-500/55 hover:bg-cyber-500/[0.12] dark:border-cyber-300/35 dark:bg-cyber-300/[0.05] dark:text-white dark:hover:border-cyber-300/55"
          >
            <GithubIcon className="size-4 text-cyber-600 dark:text-cyber-300" />
            View profile on GitHub{login ? ` (@${login})` : ""}
            <ExternalLink className="size-3.5 text-slate-400 group-hover:text-slate-600 dark:text-white/45 dark:group-hover:text-white/70" />
          </a>
        </div>
      </div>

      {/* Skeleton heatmap — gives the section visual presence even without data */}
      <div
        aria-hidden
        className="grid w-full max-w-[260px] gap-0.5 rounded-xl border border-slate-200/90 bg-slate-100/70 p-3 dark:border-white/10 dark:bg-[#06080d]"
        style={{ gridTemplateColumns: "repeat(13, 1fr)", gridAutoRows: "8px" }}
      >
        {Array.from({ length: 13 * 7 }).map((_, i) => {
          // Pseudo-random fill weight so it doesn't look mechanical
          const seed = (i * 7919) % 100;
          const tone =
            seed < 55
              ? GH.empty
              : seed < 75
                ? GH.l1
                : seed < 90
                  ? GH.l2
                  : seed < 97
                    ? GH.l3
                    : GH.l4;
          return <span key={i} className={clsx("rounded-[1px]", tone)} />;
        })}
      </div>
    </div>
  );
}
