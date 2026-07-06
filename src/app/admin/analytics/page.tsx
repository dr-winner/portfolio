import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let rows: Awaited<ReturnType<typeof prisma.analyticsEvent.findMany>> = [];
  let byName: { name: string; _count: { name: number } }[] = [];
  let total = 0;

  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    total = await prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } });
    rows = await prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    const grouped = await prisma.analyticsEvent.groupBy({
      by: ["name"],
      where: { createdAt: { gte: since } },
      _count: { name: true },
    });
    byName = grouped.sort((a, b) => b._count.name - a._count.name);
  } catch {
    /* db offline */
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">Insights</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-white">First-party usage</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/60">
        Events from the last 7 days (in-browser session id, coarse device, country from edge when
        available, daily visitor bucket — no raw IPs stored). Vercel Web Analytics in the project
        layout adds aggregate traffic in the Vercel dashboard.
      </p>
      <Link
        href="/admin"
        className="mt-4 inline-flex items-center gap-1 text-sm text-ocean-300 hover:text-ocean-200"
      >
        <ArrowLeft className="size-3.5" /> Admin overview
      </Link>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs text-white/45">Events (7d)</p>
          <p className="mt-1 font-mono text-2xl text-white">{total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:col-span-2">
          <p className="mb-2 flex items-center gap-2 text-xs text-white/45">
            <BarChart3 className="size-3.5" /> By name
          </p>
          <ul className="space-y-1.5 text-sm text-white/80">
            {byName.length === 0 ? (
              <li className="text-white/45">No rows yet. Browse the public site, then refresh.</li>
            ) : (
              byName.map((b) => (
                <li key={b.name} className="flex justify-between font-mono">
                  <span>{b.name}</span>
                  <span className="text-ocean-300">{b._count.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-white/45">
              <th className="p-3 font-mono">time (UTC)</th>
              <th className="p-3">name</th>
              <th className="p-3">path</th>
              <th className="p-3">device</th>
              <th className="p-3">browser</th>
              <th className="p-3">cc</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/[0.06] text-white/80">
                <td className="p-2.5 font-mono text-xs text-white/50">
                  {r.createdAt.toISOString().replace("T", " ").slice(0, 19)}
                </td>
                <td className="p-2.5 font-mono text-ocean-200/90">{r.name}</td>
                <td className="p-2.5 text-xs">{r.path}</td>
                <td className="p-2.5">{r.device}</td>
                <td className="p-2.5 text-xs">{r.browser}</td>
                <td className="p-2.5 font-mono text-xs">{r.country || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-white/45">No events in range.</p>
        ) : null}
      </div>
    </div>
  );
}
