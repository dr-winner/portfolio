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
  if (!token) {
    return NextResponse.json(
      {
        error: "missing_token",
        message: "Contribution data is not configured for this deployment.",
        login,
      },
      { status: 200 }
    );
  }

  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);

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
    const gJson = (await gRes.json()) as GQLContrib;
    if (gJson.errors?.length) {
      return NextResponse.json(
        { error: "graphql", message: "Could not load contribution data.", login },
        { status: 200 }
      );
    }
    const user = gJson.data?.user;
    if (!user) {
      return NextResponse.json(
        { error: "not_found", message: "Could not load contribution data.", login },
        { status: 200 }
      );
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
  } catch {
    return NextResponse.json(
      { error: "exception", message: "Could not load contribution data." },
      { status: 500 }
    );
  }
}
