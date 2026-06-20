/**
 * Centralised, validated access to environment configuration.
 *
 * Every value has a sane default so the project boots out-of-the-box in
 * development. Secrets (JWT, SMTP, database, Gemini) are read from the
 * environment and never hard-coded.
 */
import "dotenv/config";
import crypto from "crypto";
import path from "path";

function readString(key: string, fallback = ""): string {
  const value = process.env[key];
  return value !== undefined && value.trim() !== "" ? value.trim() : fallback;
}

function readNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBool(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

const isProduction = readString("NODE_ENV") === "production";

/**
 * JWT secret. In production a strong secret MUST be provided via JWT_SECRET.
 * In development we fall back to a random per-boot secret (sessions reset on
 * restart, which is acceptable locally).
 */
function resolveJwtSecret(): string {
  const provided = readString("JWT_SECRET");
  if (provided) return provided;
  if (isProduction) {
    // eslint-disable-next-line no-console
    console.warn(
      "[config] JWT_SECRET is not set. Using an ephemeral secret. " +
        "Set JWT_SECRET in production so sessions survive restarts."
    );
  }
  return crypto.randomBytes(48).toString("hex");
}

export const env = {
  isProduction,
  port: readNumber("PORT", 3000),
  host: readString("HOST", "0.0.0.0"),

  rootDir: process.cwd(),
  uploadsDir: path.join(process.cwd(), "uploads"),
  dataDir: path.join(process.cwd(), "data"),
  dbFile: path.join(process.cwd(), "data", "db.json"),

  /** When set, the PostgreSQL repository is used instead of the file store. */
  databaseUrl: readString("DATABASE_URL"),

  gemini: {
    apiKey: readString("GEMINI_API_KEY"),
    model: readString("GEMINI_MODEL", "gemini-2.5-flash"),
  },

  auth: {
    jwtSecret: resolveJwtSecret(),
    jwtTtlSeconds: readNumber("JWT_TTL_SECONDS", 60 * 60 * 8), // 8 hours
    otpTtlSeconds: readNumber("OTP_TTL_SECONDS", 5 * 60), // 5 minutes
    otpMaxAttempts: readNumber("OTP_MAX_ATTEMPTS", 5),
    /**
     * Bootstrap admin credentials. On first boot, if no admin exists, an admin
     * account is created from these values. The default password should be
     * changed immediately in production.
     */
    adminEmail: readString("ADMIN_EMAIL", "bahriddinhamidov057@gmail.com"),
    adminPassword: readString("ADMIN_PASSWORD", "Apex@2026"),
  },

  mail: {
    /** "smtp" sends real email; "console" logs the code to the server log. */
    transport: readString("MAIL_TRANSPORT", isProduction ? "smtp" : "console"),
    host: readString("SMTP_HOST"),
    port: readNumber("SMTP_PORT", 587),
    secure: readBool("SMTP_SECURE", false),
    user: readString("SMTP_USER"),
    // Gmail shows app passwords with spaces (e.g. "abcd efgh ijkl mnop");
    // strip them so a pasted-with-spaces value still authenticates.
    pass: readString("SMTP_PASS").replace(/\s+/g, ""),
    from: readString("MAIL_FROM", "Apex Academy <no-reply@apexacademy.uz>"),
  },

  upload: {
    /** Max upload size in bytes (default 150 MB to allow short hero videos). */
    maxBytes: readNumber("UPLOAD_MAX_BYTES", 150 * 1024 * 1024),
  },
} as const;

export type AppEnv = typeof env;
