import { AdminPageHeader } from "../../_components/Form";
import { ExperienceForm } from "../ExperienceForm";
import { createExperience } from "../actions";

export default function NewExperiencePage() {
  return (
    <div>
      <AdminPageHeader subtitle="Experience" title="New entry" />
      <ExperienceForm action={createExperience} />
    </div>
  );
}
