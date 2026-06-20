/**
 * Admin authentication with authenticator-app two-factor (TOTP).
 *
 * Flow:
 *   1. login(email, password)
 *        -> verifies credentials, returns a short-lived 2FA "ticket".
 *        -> on first ever login, also returns the otpauth URI + secret so the
 *           admin can add the account to Google Authenticator (QR / manual key).
 *   2. verifyTotpLogin(ticket, code)
 *        -> validates the ticket + the 6-digit code from the app,
 *           returns a session JWT.
 *
 * No email or SMTP is involved — codes are generated on the admin's device.
 */
import { env } from "../config/env";
import { getRepository } from "../db";
import { hashPassword, safeEqual, signJwt, verifyJwt, verifyPassword } from "../utils/crypto";
import { buildOtpAuthUri, generateTotpSecret, verifyTotp } from "../utils/totp";

const GENERIC_INVALID = "Email yoki parol noto'g'ri.";
const TICKET_TTL_SECONDS = 300; // 5 minutes to complete the 2FA step

export interface LoginResult {
  ok: boolean;
  /** Short-lived token proving the password step passed. */
  ticket?: string;
  /** True when the authenticator app is not yet configured. */
  needsSetup?: boolean;
  /** Setup data (only present when needsSetup is true). */
  otpauthUri?: string;
  secret?: string;
  error?: string;
}

export interface VerifyResult {
  ok: boolean;
  token?: string;
  error?: string;
}

/** Step 1 — verify credentials and start the 2FA step. */
export async function login(email: string, password: string): Promise<LoginResult> {
  const repo = getRepository();
  const admin = await repo.getAdmin();

  const emailMatches = safeEqual(email.trim().toLowerCase(), admin.email.trim().toLowerCase());
  const passwordMatches = verifyPassword(password, admin.passwordHash);
  if (!emailMatches || !passwordMatches) {
    return { ok: false, error: GENERIC_INVALID };
  }

  // Ensure a TOTP secret exists (created on first login, before confirmation).
  let secret = admin.totpSecret;
  if (!secret) {
    secret = generateTotpSecret();
    await repo.updateAdmin({ totpSecret: secret });
  }

  const ticket = signJwt({ sub: admin.id, email: admin.email, purpose: "2fa" }, env.auth.jwtSecret, TICKET_TTL_SECONDS);

  if (!admin.totpEnabled) {
    const settings = await repo.getSettings();
    const issuer = settings.name || "Apex Academy";
    return {
      ok: true,
      ticket,
      needsSetup: true,
      secret,
      otpauthUri: buildOtpAuthUri(secret, admin.email, issuer),
    };
  }

  return { ok: true, ticket, needsSetup: false };
}

/** Step 2 — validate the ticket + authenticator code, issue a session token. */
export async function verifyTotpLogin(ticket: string, code: string): Promise<VerifyResult> {
  const payload = verifyJwt(ticket, env.auth.jwtSecret);
  if (!payload || payload.purpose !== "2fa") {
    return { ok: false, error: "Sessiya muddati tugadi. Qaytadan kiring." };
  }

  const repo = getRepository();
  const admin = await repo.getAdmin();
  if (!admin.totpSecret) {
    return { ok: false, error: "Avval email va parolingizni kiriting." };
  }

  if (!verifyTotp(admin.totpSecret, code)) {
    return { ok: false, error: "Kod noto'g'ri. Ilovadagi joriy kodni kiriting." };
  }

  // First successful verification confirms the authenticator setup.
  if (!admin.totpEnabled) {
    await repo.updateAdmin({ totpEnabled: true });
  }

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
