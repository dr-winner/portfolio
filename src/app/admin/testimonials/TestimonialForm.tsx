import Link from "next/link";
import type { Testimonial } from "@prisma/client";
import { Field, Input, Select, SubmitButton, Textarea } from "../_components/Form";

export function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: Testimonial;
  action: (formData: FormData) => Promise<void> | void;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={testimonial?.name} required />
        </Field>
        <Field label="Position / title">
          <Input name="position" defaultValue={testimonial?.position} />
        </Field>
        <Field label="Initials" hint="1–3 characters for the avatar">
          <Input name="initials" defaultValue={testimonial?.initials} maxLength={3} />
        </Field>
        <Field label="Accent color">
          <Select name="accent" defaultValue={testimonial?.accent ?? "cyber"}>
            <option value="cyber">Cyber (blue)</option>
            <option value="signal">Signal (amber)</option>
            <option value="ok">Ok (green)</option>
          </Select>
        </Field>
        <Field label="Order">
          <Input type="number" name="order" defaultValue={testimonial?.order ?? 0} />
        </Field>
        <label className="mt-6 flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            name="hidden"
            defaultChecked={testimonial?.hidden}
            className="accent-cyber-300"
          />
          Hide from the public site
        </label>
      </div>

      <Field label="Testimonial">
        <Textarea name="text" rows={4} defaultValue={testimonial?.text} />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{testimonial ? "Save changes" : "Add testimonial"}</SubmitButton>
        <Link href="/admin/testimonials" className="text-sm text-white/60 hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
