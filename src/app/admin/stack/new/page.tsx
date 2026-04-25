import { AdminPageHeader } from "../../_components/Form";
import { CategoryForm } from "../CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <AdminPageHeader subtitle="Stack" title="New category" />
      <CategoryForm action={createCategory} />
    </div>
  );
}
