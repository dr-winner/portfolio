import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../_components/Form";
import { deleteProject } from "./actions";

export default async function ProjectsAdminPage() {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <AdminPageHeader
        subtitle="Content"
        title="Projects"
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:bg-white/90"
          >
            <Plus className="size-4" /> New project
          </Link>
        }
      />

      {rows.length === 0 && (
        <p className="text-white/60">No projects yet. Click &ldquo;New project&rdquo; to add one.</p>
      )}

      <ul className="flex flex-col divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-white/[0.02]">
        {rows.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white truncate">{p.title}</p>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {p.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/50">
                {p.company} · {p.year} · /{p.slug}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/projects/${p.id}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:border-cyber-300/40"
              >
                <Pencil className="size-3.5" /> Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteProject(p.id);
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md border border-threat-400/30 bg-threat-400/[0.05] px-2.5 py-1.5 text-xs text-threat-400 hover:bg-threat-400/[0.12]"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
