import { AdminPageHeader } from "../../_components/Form";
import { TestimonialForm } from "../TestimonialForm";
import { createTestimonial } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminPageHeader subtitle="Testimonials" title="New testimonial" />
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
