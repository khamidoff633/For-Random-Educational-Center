/**
 * Stores uploaded media and returns a URL the frontend can render.
 *
 * IMAGES are returned inline as a (validated) data-URL so they live INSIDE the
 * database alongside the rest of the content. This is deliberate: many hosts
 * (Render, Fly, most PaaS free tiers) use an EPHEMERAL filesystem that is wiped
 * on every restart/redeploy — files written to disk would silently disappear.
 * Keeping images in the DB makes them survive as long as the database does.
 *
 * VIDEOS are far too large to embed in the database, so they are written to
 * `uploads/` on disk and served statically. On an ephemeral host a disk video
 * will not persist across redeploys — for production use an external video URL
 * (the media field accepts a direct link) or object storage.
 */
import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";
import { createId } from "../utils/id";
import { HttpError } from "../middleware/errorHandler";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

/** Max decoded size for an inline (DB-stored) image. Keeps rows reasonable. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function saveDataUrl(dataUrl: string, originalName?: string): Promise<string> {
  if (typeof dataUrl !== "string") {
    throw new HttpError(400, "Fayl ma'lumoti yetishmayapti.");
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) {
    throw new HttpError(400, "Fayl formati noto'g'ri (base64 data-URL kutilgan edi).");
  }

  const mime = match[1];
  const base64 = match[2];
  const ext = MIME_EXTENSIONS[mime] ?? path.extname(originalName || "") ?? "";
  if (!ext) {
    throw new HttpError(400, "Bu fayl turi qo'llab-quvvatlanmaydi.");
  }

  const buffer = Buffer.from(base64, "base64");
  if (buffer.length === 0) {
    throw new HttpError(400, "Fayl bo'sh.");
  }

  const isImage = mime.startsWith("image/");

  // Images: keep inline (data-URL) so they persist with the database, even on
  // hosts with an ephemeral filesystem.
  if (isImage) {
    if (buffer.length > MAX_IMAGE_BYTES) {
      const mb = Math.round(MAX_IMAGE_BYTES / (1024 * 1024));
      throw new HttpError(413, `Rasm hajmi juda katta. Maksimal: ${mb} MB.`);
    }
    // Return a normalized, validated data-URL (stored directly in the DB).
    return `data:${mime};base64,${base64}`;
  }

  // Videos (and other large media): write to disk and serve statically.
  if (buffer.length > env.upload.maxBytes) {
    const mb = Math.round(env.upload.maxBytes / (1024 * 1024));
    throw new HttpError(413, `Fayl hajmi juda katta. Maksimal: ${mb} MB.`);
  }

  await fs.mkdir(env.uploadsDir, { recursive: true });
  const fileName = `${createId("file")}${ext}`;
  await fs.writeFile(path.join(env.uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}
