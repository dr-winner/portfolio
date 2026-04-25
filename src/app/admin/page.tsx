import Link from "next/link";
import { ArrowRight, Briefcase, FolderGit2, MessageSquareQuote, ShieldCheck, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function counts() {
  try {
    const [projects, stackCategories, stackItems, experience, certifications, testimonials] =
      await Promise.all([
        prisma.project.count(),
        prisma.stackCategory.count(),
        prisma.stackItem.count(),
        prisma.experience.count(),
        prisma.certification.count(),
        prisma.testimonial.count(),
      ]);
    return { projects, stackCategories, stackItems, experience, certifications, testimonials };
  } catch {
    return null;
  }
}

const TILES = [
  { href: "/admin/projects", label: "Projects", icon: FolderGit2, key: "projects" },
  { href: "/admin/stack", label: "Stack items", icon: Wrench, key: "stackItems" },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, key: "experience" },
  { href: "/admin/certifications", label: "Certifications", icon: ShieldCheck, key: "certifications" },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, key: "testimonials" },
] as const;

export default async function AdminHomePage() {
  const data = await counts();

  return (
    <div>
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-white">
          What do you want to update today?
        </h1>
        <p className="mt-2 text-white/60 max-w-xl">
          Everything you edit here is reflected on the public site on the next request. The
          database is SQLite by default — if it&apos;s ever empty or unavailable, the site
          gracefully falls back to the seed files in <code className="font-mono text-white/80">src/content/*</code>.
        </p>
      </header>

      {!data && (
        <div className="mt-6 rounded-xl border border-signal-300/30 bg-signal-300/[0.05] p-4 text-sm text-signal-300">
          Database not reachable. Run <code className="font-mono">npm run db:push</code> then
          <code className="font-mono ml-1">npm run db:seed</code> to initialize it.
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => {
          const Icon = t.icon;
          const value = data ? (data as Record<string, number>)[t.key] ?? 0 : "—";
          return (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-cyber-300/40 hover:bg-white/[0.035]"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-cyber-300">
                  <Icon className="size-5" />
                </div>
                <ArrowRight className="size-4 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
              <p className="mt-6 font-display text-3xl tracking-tight text-white">{value}</p>
              <p className="mt-1 text-sm text-white/60">{t.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
