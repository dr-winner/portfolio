"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@prisma/client";
import { Field, Input, Select, SubmitButton, Textarea } from "../_components/Form";

export function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => Promise<void> | void;
}) {
  const parsedTags = parseArr(project?.tags);
  const parsedResults = parseArr(project?.results);
  const parsedStack = parseArr(project?.techStack);
  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.imagePath ?? null);

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Slug">
          <Input name="slug" defaultValue={project?.slug} required />
        </Field>
        <Field label="Title">
          <Input name="title" defaultValue={project?.title} required />
        </Field>
        <Field label="Company / subject">
          <Input name="company" defaultValue={project?.company} />
        </Field>
        <Field label="Year">
          <Input name="year" defaultValue={project?.year} placeholder="2026" />
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={project?.status ?? "live"}>
            <option value="live">Live</option>
            <option value="in-progress">In progress</option>
            <option value="upcoming">Upcoming</option>
          </Select>
        </Field>
        <Field label="Order" hint="Lower numbers appear first">
          <Input type="number" name="order" defaultValue={project?.order ?? 0} />
        </Field>
      </div>

      <Field label="Summary">
        <Textarea name="summary" defaultValue={project?.summary} rows={3} />
      </Field>

      <Field label="Tags" hint="Comma-separated. Valid: Security, AI, Full-Stack, Web3">
        <Input name="tags" defaultValue={parsedTags.join(", ")} placeholder="AI, Security" />
      </Field>

      <Field label="Results / highlights" hint="One per line or comma-separated">
        <Textarea name="results" defaultValue={parsedResults.join("\n")} rows={4} />
      </Field>

      <Field label="Tech stack" hint="Comma-separated">
        <Input name="techStack" defaultValue={parsedStack.join(", ")} />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Live link">
          <Input name="link" type="url" defaultValue={project?.link ?? ""} />
        </Field>
        <Field label="Repo">
          <Input name="repo" type="url" defaultValue={project?.repo ?? ""} />
        </Field>
      </div>

      <Field
        label="Screenshot"
        hint="PNG/JPG/WebP, up to 5MB. Stored under /public/uploads."
      >
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);
          }}
          className="mt-2 block w-full rounded-lg border border-white/10 bg-ink-100 px-3 py-2 text-sm text-white/80 file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink"
        />
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-4 max-h-56 rounded-lg border border-white/10 object-cover"
          />
        )}
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
        <Link
          href="/admin/projects"
          className="text-sm text-white/60 hover:text-white"
        >
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
