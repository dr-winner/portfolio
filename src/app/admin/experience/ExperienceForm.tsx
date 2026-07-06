import Link from "next/link";
import type { Experience } from "@prisma/client";
import { Field, Input, SubmitButton, Textarea } from "../_components/Form";

export function ExperienceForm({
  entry,
  action,
}: {
  entry?: Experience;
  action: (formData: FormData) => Promise<void> | void;
}) {
  const tags = parseArr(entry?.tags);
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Period">
          <Input name="period" defaultValue={entry?.period} placeholder="2026 → Now" required />
        </Field>
        <Field label="Order">
          <Input type="number" name="order" defaultValue={entry?.order ?? 0} />
        </Field>
        <Field label="Title">
          <Input name="title" defaultValue={entry?.title} required />
        </Field>
        <Field label="Organization">
          <Input name="org" defaultValue={entry?.org} />
        </Field>
      </div>
      <Field label="Description">
        <Textarea name="description" rows={4} defaultValue={entry?.description} />
      </Field>
      <Field label="Tags" hint="Comma-separated">
        <Input name="tags" defaultValue={tags.join(", ")} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          name="current"
          defaultChecked={entry?.current}
          className="accent-ocean-300"
        />
        This is my current role
      </label>
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{entry ? "Save changes" : "Add entry"}</SubmitButton>
        <Link href="/admin/experience" className="text-sm text-white/60 hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
