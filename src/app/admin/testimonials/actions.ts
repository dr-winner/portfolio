"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

function extract(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    position: String(formData.get("position") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    initials: String(formData.get("initials") ?? "").trim().toUpperCase().slice(0, 3),
    accent: String(formData.get("accent") ?? "cyber").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    hidden: formData.get("hidden") === "on" || formData.get("hidden") === "true",
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonial(formData: FormData) {
  await requireSession();
  await prisma.testimonial.create({ data: extract(formData) });
  revalidate();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireSession();
  await prisma.testimonial.update({ where: { id }, data: extract(formData) });
  revalidate();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireSession();
  await prisma.testimonial.delete({ where: { id } });
  revalidate();
}
