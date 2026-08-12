import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import sharp, { type Sharp } from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const ALLOWED_FORMATS = new Set(["png", "jpeg", "webp", "avif"]);
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_INPUT_PIXELS = 25_000_000;

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

  const input = Buffer.from(await file.arrayBuffer());
  let image: Sharp;
  try {
    image = sharp(input, {
      failOn: "warning",
      limitInputPixels: MAX_INPUT_PIXELS,
      animated: false,
    });
    const metadata = await image.metadata();
    if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
      throw new Error("Unsupported image encoding.");
    }
  } catch {
    throw new Error("The uploaded file is not a valid supported image.");
  }

  // Decode and re-encode instead of publishing user-controlled bytes. This
  // strips metadata and embedded payloads while normalizing every upload.
  const sanitized = await image
    .rotate()
    .webp({ quality: 84, effort: 4 })
    .toBuffer();

  const id = crypto.randomBytes(8).toString("hex");
  const safeBase = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .slice(0, 32) || "project";
  const filename = `${Date.now()}-${id}-${safeBase}.webp`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, sanitized, {
      access: "public",
      contentType: "image/webp",
    });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), sanitized);
  return `/uploads/${filename}`;
}
