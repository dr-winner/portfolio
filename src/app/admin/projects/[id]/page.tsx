import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../../_components/Form";
import { ProjectForm } from "../ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateProject(id, formData);
  }

  return (
    <div>
      <AdminPageHeader subtitle="Projects" title={`Edit: ${project.title}`} />
      <ProjectForm project={project} action={action} />
    </div>
  );
}
