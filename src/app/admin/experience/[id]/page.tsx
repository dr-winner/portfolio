import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../../_components/Form";
import { ExperienceForm } from "../ExperienceForm";
import { updateExperience } from "../actions";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.experience.findUnique({ where: { id } });
  if (!entry) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateExperience(id, formData);
  }

  return (
    <div>
      <AdminPageHeader subtitle="Experience" title={`Edit: ${entry.title}`} />
      <ExperienceForm entry={entry} action={action} />
    </div>
  );
}
