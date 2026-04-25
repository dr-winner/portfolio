import { AdminPageHeader } from "../../_components/Form";
import { ProjectForm } from "../ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <AdminPageHeader subtitle="Projects" title="New project" />
      <ProjectForm action={createProject} />
    </div>
  );
}
