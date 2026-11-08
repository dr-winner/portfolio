import { z } from "zod";

const httpsUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Links must use https.");

export const projectSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug.").min(3).max(80),
  company: z.string().trim().max(120),
  year: z.string().trim().max(20),
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(400),
  tags: z.array(z.string().trim().max(40)).max(20),
  results: z.array(z.string().trim().max(240)).max(20),
  techStack: z.array(z.string().trim().max(40)).max(20),
  link: z.union([httpsUrl, z.literal("")]).nullable(),
  repo: z.union([httpsUrl, z.literal("")]).nullable(),
  status: z.enum(["live", "in-progress", "upcoming"]),
  order: z.number().int().min(0).max(999),
});

export function parseProject(input: unknown) {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "That project could not be saved.");
  }
  return {
    ...parsed.data,
    link: parsed.data.link || null,
    repo: parsed.data.repo || null,
  };
}
