import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Saves an uploaded image and returns its public URL.
 *
 * Production (Vercel): stored in Vercel Blob — the local filesystem there is
 * ephemeral/read-only, so writes to public/ would be lost or fail.
 * Local dev without a BLOB_READ_WRITE_TOKEN: falls back to public/uploads.
 */
export async function saveUpload(file: File): Promise<string | null> {
  if (!file || !file.size) return null;
  if (file.size > MAX_BYTES) {
    throw new Error(`File too large (max ${MAX_BYTES / 1024 / 1024}MB).`);
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`Unsupported file type. Allowed: ${[...ALLOWED_EXT].join(", ")}`);
  }

  const id = crypto.randomBytes(8).toString("hex");
  const safeBase = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .slice(0, 32);
  const filename = `${Date.now()}-${id}-${safeBase}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);
  return `/uploads/${filename}`;
}
