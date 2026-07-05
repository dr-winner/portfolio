import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../_components/Form";
import { deleteTestimonial } from "./actions";

export default async function TestimonialsAdminPage() {
  const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <AdminPageHeader
        subtitle="Trust"
        title="Testimonials"
        action={
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:bg-white/90"
          >
            <Plus className="size-4" /> New testimonial
          </Link>
        }
      />

      <ul className="flex flex-col divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-white/[0.02]">
        {rows.map((t) => (
          <li key={t.id} className="flex flex-wrap items-start justify-between gap-3 p-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white truncate">{t.name}</p>
                {t.hidden ? (
                  <EyeOff className="size-3.5 text-white/40" />
                ) : (
                  <Eye className="size-3.5 text-white/40" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-white/50">{t.position}</p>
              <p className="mt-2 max-w-3xl text-sm text-white/60 line-clamp-2">“{t.text}”</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/testimonials/${t.id}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:border-cyber-300/40"
              >
                <Pencil className="size-3.5" /> Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteTestimonial(t.id);
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
