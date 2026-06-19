import { HttpError } from "../middleware/errorHandler";

/** Trims a value to a string; returns "" for null/undefined. */
export function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value);
}

/** Ensures a phone number contains at least 9 digits. */
export function assertValidPhone(phone: string): void {
  const digits = phone.replace(/\D/g, "").length;
  if (!phone || digits < 9) {
    throw new HttpError(400, "Telefon raqamni to'liq kiriting (kamida 9 ta raqam).");
  }
}

/** Ensures a non-empty student name. */
export function assertStudentName(name: string): void {
  if (!name || name === "Noma'lum o'quvchi") {
    throw new HttpError(400, "Ism va familiyani kiritish majburiy.");
  }
}

/** Caps a free-text caption to `max` characters (default 150). */
export function clampText(value: unknown, max = 150): string {
  return str(value).slice(0, max);
}
