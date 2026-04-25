import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../../_components/Form";
import { CategoryForm } from "../CategoryForm";
import { ItemForm } from "../ItemForm";
import { createItem, deleteItem, updateCategory, updateItem } from "../actions";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.stackCategory.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!category) notFound();

  async function catAction(formData: FormData) {
    "use server";
    await updateCategory(id, formData);
  }

  async function newItemAction(formData: FormData) {
    "use server";
    await createItem(id, formData);
  }

  return (
    <div>
      <AdminPageHeader
        subtitle="Stack"
        title={`Edit: ${category.label}`}
        action={
          <Link href="/admin/stack" className="text-sm text-white/60 hover:text-white">
            ← All categories
          </Link>
        }
      />

      <section>
        <h2 className="text-sm font-mono uppercase tracking-[0.22em] text-white/45 mb-4">
          Category
        </h2>
        <CategoryForm category={category} action={catAction} />
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.22em] text-white/45">
            Items ({category.items.length})
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mb-4">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-white/45 mb-3">
            Add new
          </p>
          <ItemForm action={newItemAction} />
        </div>

        <ul className="flex flex-col divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-white/[0.02]">
          {category.items.map((item) => {
            async function editAction(formData: FormData) {
              "use server";
              await updateItem(item.id, id, formData);
            }
            async function removeAction() {
              "use server";
              await deleteItem(item.id, id);
            }
            return (
              <li key={item.id} className="p-5 flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[300px]">
                  <ItemForm item={item} action={editAction} />
                </div>
                <form action={removeAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-md border border-threat-400/30 bg-threat-400/[0.05] px-2.5 py-1.5 text-xs text-threat-400 hover:bg-threat-400/[0.12]"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
