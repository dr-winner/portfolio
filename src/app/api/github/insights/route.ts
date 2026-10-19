import { NextResponse } from "next/server";
import { profile } from "@/content/profile";
import { currentStreakUtc, longestStreakInRange } from "@/lib/github/insights-helpers";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

export const revalidate = 3600;

function loginFromProfile(): string {
  const u = profile.socials.github.replace(/\/$/, "");
  return u.split("/").filter(Boolean).pop() || "dr-winner";
}

const GRAPHQL = "https://api.github.com/graphql";

type GQLContrib = {
  data?: {
    user: null | {
      login: string;
      contributionsCollection: {
        totalCommitContributions: number;
        totalPullRequestContributions: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: { date: string; contributionCount: number }[];
          }[];
        };
      };
    };
  };
  errors?: { message: string }[];
};

type ContributionDay = { date: string; count: number };

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match?.[1] ?? null;
}

function publicDaysFromHtml(html: string): ContributionDay[] {
  const dateById = new Map<string, string>();
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const tag = match[0];
    const id = attribute(tag, "id");
    const date = attribute(tag, "data-date");
    if (id?.startsWith("contribution-day-component-") && date) {
      dateById.set(id, date);
    }
  }

  const days = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b[^>]*>[\s\S]*?<\/tool-tip>/g)) {
    const tag = match[0];
    const id = attribute(tag.slice(0, tag.indexOf(">") + 1), "for");
    const date = id ? dateById.get(id) : undefined;
    if (!date) continue;

    const text = tag.slice(tag.indexOf(">") + 1).replace(/<[^>]+>/g, "").trim();
    const count = text.match(/([\d,]+) contributions?/i);
    days.set(date, count ? Number(count[1].replaceAll(",", "")) : 0);
  }

  return Array.from(days, ([date, count]) => ({ date, count })).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

async function publicContributionResponse(login: string, from: Date, to: Date) {
  const firstWeek = new Date(from);
  firstWeek.setUTCDate(firstWeek.getUTCDate() - firstWeek.getUTCDay());
  const lastWeek = new Date(to);
  lastWeek.setUTCDate(lastWeek.getUTCDate() + (6 - lastWeek.getUTCDay()));

  const years = Array.from(
    new Set([firstWeek.getUTCFullYear(), lastWeek.getUTCFullYear()])
  );
  const results = await Promise.all(
    years.map(async (year) => {
      const url = `https://github.com/users/${encodeURIComponent(login)}/contributions?to=${year}-12-31`;
      const response = await fetch(url, {
        headers: { Accept: "text/html", "User-Agent": "portfolio-github-insights" },
        next: { revalidate: 3600 },
      });
      if (!response.ok) throw new Error(`GitHub profile returned ${response.status}`);
      return publicDaysFromHtml(await response.text());
    })
  );

  const countByDate = new Map<string, number>();
  for (const days of results) {
    for (const day of days) countByDate.set(day.date, day.count);
  }

  const fromDay = from.toISOString().slice(0, 10);
  const toDay = to.toISOString().slice(0, 10);
  const weeks: { days: ContributionDay[] }[] = [];
  const byDate = new Map<string, number>();
  const cursor = new Date(firstWeek);
  while (cursor <= lastWeek) {
    const week: ContributionDay[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = cursor.toISOString().slice(0, 10);
      const count = countByDate.get(date) ?? 0;
      week.push({ date, count });
      byDate.set(date, count);
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push({ days: week });
  }

  const totalContributions = weeks
    .flatMap((week) => week.days)
    .filter((day) => day.date >= fromDay && day.date <= toDay)
    .reduce((sum, day) => sum + day.count, 0);

  return NextResponse.json({
    login,
    error: null as string | null,
    source: "public" as const,
    range: { from: from.toISOString(), to: to.toISOString() },
    stats: {
      totalCommitContributions: null,
      totalPullRequestContributions: null,
      totalContributions,
    },
    streak: {
      current: currentStreakUtc(byDate, to),
      longest: longestStreakInRange(byDate, from, to),
    },
    weeks,
  });
}

async function unavailableResponse(login: string, from: Date, to: Date) {
  try {
    return await publicContributionResponse(login, from, to);
  } catch (error) {
    console.error(
      `[github/insights] public graph unavailable: ${error instanceof Error ? error.message : "unknown error"}`
    );
    return NextResponse.json(
      { error: "unavailable", message: "Could not load public contribution data.", login },
      { status: 200 }
    );
  }
}

export async function GET(req: Request) {
  const ip = clientIpFromHeaders(req.headers);
  const rl = checkRateLimit(`gql:${ip}`, 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate", message: "Try again soon." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const login = loginFromProfile();
  const token = process.env.GITHUB_TOKEN;
  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);

  if (!token) return unavailableResponse(login, from, to);

  const q = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
            color
          }
        }
      }
    }
  }
}`;

  try {
    const gRes = await fetch(GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": `portfolio-graphql-${login}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: q,
        variables: {
          login,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    });

    // Detect REST-style auth failure (Bad credentials / rate limit) — these
    // come back as { message: "...", documentation_url: "..." } with no
    // GraphQL `data` envelope, so the user-null check would otherwise
    // mis-classify them as "not_found".
    if (gRes.status === 401 || gRes.status === 403) {
      const tokenScopes = gRes.headers.get("x-oauth-scopes") ?? "(none)";
      const acceptedScopes = gRes.headers.get("x-accepted-oauth-scopes") ?? "(unknown)";
      console.error(
        `[github/insights] auth failure status=${gRes.status} scopes=${tokenScopes} accepted=${acceptedScopes}; using public profile graph`
      );
      return unavailableResponse(login, from, to);
    }

    const gJson = (await gRes.json()) as GQLContrib;
    if (gJson.errors?.length) {
      console.error(
        `[github/insights] graphql errors: ${gJson.errors.map((e) => e.message).join("; ")}`
      );
      return unavailableResponse(login, from, to);
    }
    const user = gJson.data?.user;
    if (!user) {
      console.error(
        `[github/insights] unexpected null user (status=${gRes.status}); using public profile graph`
      );
      return unavailableResponse(login, from, to);
    }
    const c = user.contributionsCollection;
    const cal = c.contributionCalendar;
    const flatDays: { date: string; count: number }[] = [];
    for (const w of cal.weeks) {
      for (const d of w.contributionDays) {
        flatDays.push({ date: d.date, count: d.contributionCount });
      }
    }
    const byDate = new Map<string, number>();
    for (const d of flatDays) byDate.set(d.date, d.count);

    const current = currentStreakUtc(byDate, to);
    const longest = longestStreakInRange(byDate, from, to);

    return NextResponse.json({
      login: user.login,
      error: null as string | null,
      range: { from: from.toISOString(), to: to.toISOString() },
      stats: {
        totalCommitContributions: c.totalCommitContributions,
        totalPullRequestContributions: c.totalPullRequestContributions,
        totalContributions: cal.totalContributions,
      },
      streak: {
        current,
        longest,
      },
      weeks: cal.weeks.map((w) => ({
        days: w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
        })),
      })),
    });
  } catch (error) {
    console.error(
      `[github/insights] GraphQL request failed: ${error instanceof Error ? error.message : "unknown error"}; using public profile graph`
    );
    return unavailableResponse(login, from, to);
  }
}
