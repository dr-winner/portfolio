import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUpload(file: File): Promise<string | null> {
  if (!file || !file.size) return null;
  if (file.size > MAX_BYTES) {
    throw new Error(`File too large (max ${MAX_BYTES / 1024 / 1024}MB).`);
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`Unsupported file type. Allowed: ${[...ALLOWED_EXT].join(", ")}`);
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const id = crypto.randomBytes(8).toString("hex");
  const safeBase = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .slice(0, 32);
  const filename = `${Date.now()}-${id}-${safeBase}${ext}`;
  const target = path.join(UPLOAD_DIR, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(target, bytes);

  return `/uploads/${filename}`;
}
