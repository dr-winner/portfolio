import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "../../_components/Form";
import { CertForm } from "../CertForm";
import { updateCertification } from "../actions";

export default async function EditCertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await prisma.certification.findUnique({ where: { id } });
  if (!cert) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateCertification(id, formData);
  }

  return (
    <div>
      <AdminPageHeader subtitle="Certifications" title={`Edit: ${cert.name}`} />
      <CertForm cert={cert} action={action} />
    </div>
  );
}
