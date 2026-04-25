import { AdminPageHeader } from "../../_components/Form";
import { CertForm } from "../CertForm";
import { createCertification } from "../actions";

export default function NewCertPage() {
  return (
    <div>
      <AdminPageHeader subtitle="Certifications" title="New certification" />
      <CertForm action={createCertification} />
    </div>
  );
}
