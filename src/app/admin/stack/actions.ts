"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

function extractCategory(formData: FormData) {
  return {
    key: String(formData.get("key") ?? "").trim(),
    label: String(formData.get("label") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    accent: String(formData.get("accent") ?? "cyber").trim(),
    iconKey: String(formData.get("iconKey") ?? "Sparkles").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/stack");
}

export async function createCategory(formData: FormData) {
  await requireSession();
  const f = extractCategory(formData);
  if (!f.key || !f.label) throw new Error("Key and label are required.");
  await prisma.stackCategory.create({ data: f });
  revalidate();
  redirect("/admin/stack");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireSession();
  const f = extractCategory(formData);
  await prisma.stackCategory.update({ where: { id }, data: f });
  revalidate();
  redirect(`/admin/stack/${id}`);
}

export async function deleteCategory(id: string) {
  await requireSession();
  await prisma.stackCategory.delete({ where: { id } });
  revalidate();
}

function extractItem(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    iconKey: String(formData.get("iconKey") ?? "Sparkles").trim(),
    level: String(formData.get("level") ?? "working").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

export async function createItem(categoryId: string, formData: FormData) {
  await requireSession();
  const f = extractItem(formData);
  if (!f.name) throw new Error("Item name required.");
  await prisma.stackItem.create({ data: { ...f, categoryId } });
  revalidate();
  redirect(`/admin/stack/${categoryId}`);
}

export async function updateItem(itemId: string, categoryId: string, formData: FormData) {
  await requireSession();
  const f = extractItem(formData);
  await prisma.stackItem.update({ where: { id: itemId }, data: f });
  revalidate();
  redirect(`/admin/stack/${categoryId}`);
}

export async function deleteItem(itemId: string, categoryId: string) {
  await requireSession();
  await prisma.stackItem.delete({ where: { id: itemId } });
  revalidatePath("/");
  revalidatePath(`/admin/stack/${categoryId}`);
}
