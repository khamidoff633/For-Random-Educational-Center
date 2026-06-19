/**
 * Stores uploaded media (images / short videos) as real files on disk under
 * `uploads/`, served statically. Files are never embedded in the database,
 * which keeps the data store small and fast even with video content.
 *
 * Accepts a data-URL (base64) payload from the client, validates the MIME type
 * and decoded size, then writes a randomly named file and returns its URL.
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
  if (buffer.length > env.upload.maxBytes) {
    const mb = Math.round(env.upload.maxBytes / (1024 * 1024));
    throw new HttpError(413, `Fayl hajmi juda katta. Maksimal: ${mb} MB.`);
  }

  await fs.mkdir(env.uploadsDir, { recursive: true });
  const fileName = `${createId("file")}${ext}`;
  await fs.writeFile(path.join(env.uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}
