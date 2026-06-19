/**
 * Admin authentication with email-based two-factor (2FA).
 *
 * Flow:
 *   1. login(email, password)  -> verifies credentials, emails a 6-digit code.
 *   2. verifyOtp(email, code)  -> validates the code, returns a session JWT.
 *
 * Codes are stored only as SHA-256 hashes with an expiry and attempt counter,
 * and verified in constant time. Generic error messages avoid leaking whether
 * an email exists.
 */
import { env } from "../config/env";
import { getRepository } from "../db";
import {
  generateOtp,
  hashPassword,
  safeEqual,
  sha256,
  signJwt,
  verifyJwt,
  verifyPassword,
} from "../utils/crypto";
import { buildOtpEmail, sendMail } from "./mailer";

const GENERIC_INVALID = "Email yoki parol noto'g'ri.";

export interface LoginResult {
  ok: boolean;
  /** Masked destination shown to the user, e.g. "bah***@gmail.com". */
  maskedEmail?: string;
  error?: string;
}

export interface VerifyResult {
  ok: boolean;
  token?: string;
  error?: string;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, Math.min(3, name.length));
  return `${visible}${"*".repeat(Math.max(1, name.length - visible.length))}@${domain}`;
}

/** Step 1 — verify credentials and dispatch a one-time code by email. */
export async function login(email: string, password: string): Promise<LoginResult> {
  const repo = getRepository();
  const admin = await repo.getAdmin();

  const emailMatches = safeEqual(email.trim().toLowerCase(), admin.email.trim().toLowerCase());
  const passwordMatches = verifyPassword(password, admin.passwordHash);
  if (!emailMatches || !passwordMatches) {
    return { ok: false, error: GENERIC_INVALID };
  }

  const code = generateOtp(6);
  await repo.updateAdmin({
    otpHash: sha256(code),
    otpExpiresAt: Date.now() + env.auth.otpTtlSeconds * 1000,
    otpAttempts: 0,
  });

  const settings = await repo.getSettings();
  await sendMail(buildOtpEmail(admin.email, code, settings.name || "Apex Academy"));

  return { ok: true, maskedEmail: maskEmail(admin.email) };
}

/** Step 2 — validate the one-time code and issue a session token. */
export async function verifyOtp(email: string, code: string): Promise<VerifyResult> {
  const repo = getRepository();
  const admin = await repo.getAdmin();

  if (!admin.otpHash || !admin.otpExpiresAt) {
    return { ok: false, error: "Avval email va parolingizni kiriting." };
  }
  if (Date.now() > admin.otpExpiresAt) {
    await repo.updateAdmin({ otpHash: null, otpExpiresAt: null, otpAttempts: 0 });
    return { ok: false, error: "Kod muddati tugadi. Iltimos, qaytadan kiring." };
  }
  if (admin.otpAttempts >= env.auth.otpMaxAttempts) {
    await repo.updateAdmin({ otpHash: null, otpExpiresAt: null, otpAttempts: 0 });
    return { ok: false, error: "Juda ko'p urinish. Iltimos, qaytadan kiring." };
  }

  const emailMatches = safeEqual(email.trim().toLowerCase(), admin.email.trim().toLowerCase());
  const codeMatches = safeEqual(sha256(code.trim()), admin.otpHash);
  if (!emailMatches || !codeMatches) {
    await repo.updateAdmin({ otpAttempts: admin.otpAttempts + 1 });
    return { ok: false, error: "Kod noto'g'ri." };
  }

  // Success — clear the code and issue a JWT.
  await repo.updateAdmin({ otpHash: null, otpExpiresAt: null, otpAttempts: 0 });
  const token = signJwt({ sub: admin.id, email: admin.email }, env.auth.jwtSecret, env.auth.jwtTtlSeconds);
  return { ok: true, token };
}

/** Returns the admin payload for a valid bearer token, or null. */
export function authenticate(token: string | undefined): { sub: string; email: string } | null {
  if (!token) return null;
  const payload = verifyJwt(token, env.auth.jwtSecret);
  return payload ? { sub: payload.sub, email: payload.email } : null;
}

/** Changes the admin password after verifying the current one. */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const repo = getRepository();
  const admin = await repo.getAdmin();
  if (!verifyPassword(currentPassword, admin.passwordHash)) {
    return { ok: false, error: "Joriy parol noto'g'ri." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak." };
  }
  await repo.updateAdmin({ passwordHash: hashPassword(newPassword) });
  return { ok: true };
}
