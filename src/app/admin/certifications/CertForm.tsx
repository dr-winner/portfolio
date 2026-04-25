import Link from "next/link";
import type { Certification } from "@prisma/client";
import { Field, Input, Select, SubmitButton, Textarea } from "../_components/Form";

export function CertForm({
  cert,
  action,
}: {
  cert?: Certification;
  action: (formData: FormData) => Promise<void> | void;
}) {
  const skills = parseArr(cert?.skills);
  const modules = parseArr(cert?.modules);

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={cert?.name} required />
        </Field>
        <Field label="Issuer">
          <Input name="issuer" defaultValue={cert?.issuer} />
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={cert?.status ?? "pursuing"}>
            <option value="earned">Earned</option>
            <option value="pursuing">Pursuing</option>
            <option value="in-progress">In progress</option>
          </Select>
        </Field>
        <Field label="Exam code">
          <Input name="examCode" defaultValue={cert?.examCode ?? ""} placeholder="SY0-701" />
        </Field>
        <Field label="Target date">
          <Input name="targetDate" defaultValue={cert?.targetDate ?? ""} placeholder="Q3 2026" />
        </Field>
        <Field label="Year earned">
          <Input name="year" defaultValue={cert?.year ?? ""} />
        </Field>
        <Field label="Progress (%)" hint="Optional — 0 to 100">
          <Input
            type="number"
            min={0}
            max={100}
            name="progress"
            defaultValue={cert?.progress ?? ""}
          />
        </Field>
        <Field label="Order">
          <Input type="number" name="order" defaultValue={cert?.order ?? 0} />
        </Field>
      </div>

      <Field label="Description">
        <Textarea name="description" rows={3} defaultValue={cert?.description} />
      </Field>

      <Field label="Skills" hint="Comma-separated">
        <Input name="skills" defaultValue={skills.join(", ")} />
      </Field>

      <Field label="Modules" hint="One per line or comma-separated">
        <Textarea name="modules" rows={3} defaultValue={modules.join("\n")} />
      </Field>

      <Field label="Reference link">
        <Input name="link" type="url" defaultValue={cert?.link ?? ""} />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{cert ? "Save changes" : "Add certification"}</SubmitButton>
        <Link href="/admin/certifications" className="text-sm text-white/60 hover:text-white">
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
