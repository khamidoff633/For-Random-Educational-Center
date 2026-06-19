import crypto from "crypto";

/**
 * Generates a short, collision-resistant identifier with a readable prefix,
 * e.g. createId("c") -> "c_lr8x2k_9f3a".
 */
export function createId(prefix: string): string {
  const time = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString("hex");
  return `${prefix}_${time}_${random}`;
}
