import Link from "next/link";
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../_components/Form";
import { deleteCategory } from "./actions";

export default async function StackAdminPage() {
  const rows = await prisma.stackCategory.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        subtitle="Stack"
        title="Stack categories"
        action={
          <Link
            href="/admin/stack/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:bg-white/90"
          >
            <Plus className="size-4" /> New category
          </Link>
        }
      />

      <ul className="flex flex-col divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-white/[0.02]">
        {rows.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <Link href={`/admin/stack/${c.id}`} className="group min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white truncate group-hover:text-ocean-300">
                  {c.label}
                </p>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {c._count.items} items
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/50 font-mono">
                /{c.key} · accent: {c.accent} · icon: {c.iconKey}
              </p>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/stack/${c.id}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:border-ocean-300/40"
              >
                <Pencil className="size-3.5" /> Manage
                <ArrowRight className="size-3.5" />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteCategory(c.id);
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
