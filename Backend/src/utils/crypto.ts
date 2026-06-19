/**
 * Security primitives built entirely on Node's native `crypto` module — no
 * third-party dependencies required.
 *
 *  - Passwords are hashed with scrypt and a per-password random salt.
 *  - Sessions use compact HMAC-SHA256 signed tokens (JWT-compatible HS256).
 *  - 2FA codes are random 6-digit numbers, stored only as SHA-256 hashes.
 *
 * All verification uses constant-time comparison to avoid timing attacks.
 */
import crypto from "crypto";

const SCRYPT_KEYLEN = 64;

/** Hashes a plaintext password as `scrypt$<saltHex>$<hashHex>`. */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/** Verifies a plaintext password against a stored scrypt hash. */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, saltHex, hashHex] = stored.split("$");
    if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = crypto.scryptSync(password, salt, expected.length);
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Generates a numeric one-time code, zero-padded to `digits` length. */
export function generateOtp(digits = 6): string {
  const max = 10 ** digits;
  const code = crypto.randomInt(0, max);
  return code.toString().padStart(digits, "0");
}

/** SHA-256 hash (hex) used for storing OTPs at rest. */
export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Constant-time comparison of two strings. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlJson(obj: unknown): string {
  return base64url(JSON.stringify(obj));
}

export interface JwtPayload {
  sub: string;
  email: string;
  [key: string]: unknown;
}

/** Signs an HS256 JWT valid for `ttlSeconds`. */
export function signJwt(payload: JwtPayload, secret: string, ttlSeconds: number): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttlSeconds };
  const head = base64urlJson(header);
  const data = base64urlJson(body);
  const signature = base64url(
    crypto.createHmac("sha256", secret).update(`${head}.${data}`).digest()
  );
  return `${head}.${data}.${signature}`;
}

/** Verifies an HS256 JWT and returns its payload, or null when invalid. */
export function verifyJwt(token: string, secret: string): (JwtPayload & { exp: number }) | null {
  try {
    const [head, data, signature] = token.split(".");
    if (!head || !data || !signature) return null;
    const expected = base64url(
      crypto.createHmac("sha256", secret).update(`${head}.${data}`).digest()
    );
    if (!safeEqual(signature, expected)) return null;
    const payload = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
