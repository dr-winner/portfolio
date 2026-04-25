import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../../_components/Form";
import { TestimonialForm } from "../TestimonialForm";
import { updateTestimonial } from "../actions";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateTestimonial(id, formData);
  }

  return (
    <div>
      <AdminPageHeader subtitle="Testimonials" title={`Edit: ${t.name}`} />
      <TestimonialForm testimonial={t} action={action} />
    </div>
  );
}
