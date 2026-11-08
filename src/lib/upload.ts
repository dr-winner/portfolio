import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024;

function sniff(bytes: Buffer): "png" | "jpeg" | "webp" | null {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

/**
 * Saves an uploaded image and returns its public URL.
 *
 * Production (Vercel): stored in Vercel Blob: the local filesystem there is
 * ephemeral/read-only, so writes to public/ would be lost or fail.
 * Local dev without a BLOB_READ_WRITE_TOKEN: falls back to public/uploads.
 */
export async function saveUpload(file: File): Promise<string | null> {
  if (!file || !file.size) return null;
  if (file.size > MAX_BYTES) {
    throw new Error(`File too large (max ${MAX_BYTES / 1024 / 1024}MB).`);
  }
  const original = Buffer.from(await file.arrayBuffer());
  if (!sniff(original)) {
    throw new Error("Upload must be a PNG, JPEG, or WebP image.");
  }
  const encoded = await sharp(original)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const id = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${id}.webp`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, encoded, {
      access: "public",
      contentType: "image/webp",
    });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), encoded);
  return `/uploads/${filename}`;
}
