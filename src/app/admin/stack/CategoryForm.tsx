import Link from "next/link";
import type { StackCategory } from "@prisma/client";
import { ICON_KEYS } from "@/lib/icons";
import { Field, Input, Select, SubmitButton, Textarea } from "../_components/Form";

export function CategoryForm({
  category,
  action,
}: {
  category?: StackCategory;
  action: (formData: FormData) => Promise<void> | void;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Key" hint="Slug-like unique id">
          <Input name="key" defaultValue={category?.key} required />
        </Field>
        <Field label="Label">
          <Input name="label" defaultValue={category?.label} required />
        </Field>
        <Field label="Accent">
          <Select name="accent" defaultValue={category?.accent ?? "cyber"}>
            <option value="cyber">Cyber</option>
            <option value="signal">Signal</option>
            <option value="ok">Ok</option>
            <option value="threat">Threat</option>
          </Select>
        </Field>
        <Field label="Icon">
          <Select name="iconKey" defaultValue={category?.iconKey ?? "Sparkles"}>
            {ICON_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Order">
          <Input type="number" name="order" defaultValue={category?.order ?? 0} />
        </Field>
      </div>
      <Field label="Description">
        <Textarea name="description" rows={2} defaultValue={category?.description} />
      </Field>
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{category ? "Save changes" : "Create category"}</SubmitButton>
        <Link href="/admin/stack" className="text-sm text-white/60 hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
