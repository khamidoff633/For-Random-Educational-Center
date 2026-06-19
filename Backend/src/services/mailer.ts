/**
 * Pluggable email delivery.
 *
 *  - "console" transport (default in development): logs the message to the
 *    server console. Lets you test the full 2FA flow without an SMTP server.
 *  - "smtp" transport (production): sends real email via `nodemailer`, which
 *    is imported dynamically so the project builds without it installed.
 *
 * To enable real email on your server:
 *   1. npm install nodemailer
 *   2. set MAIL_TRANSPORT=smtp and the SMTP_* / MAIL_FROM variables.
 *      For Gmail, create an "App Password" and use it as SMTP_PASS.
 */
import { env } from "../config/env";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let cachedTransport: any = null;

async function getSmtpTransport(): Promise<any> {
  if (cachedTransport) return cachedTransport;
  const moduleName = "nodemailer";
  const nodemailer: any = await import(moduleName);
  cachedTransport = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
  });
  return cachedTransport;
}

export async function sendMail(message: MailMessage): Promise<void> {
  if (env.mail.transport === "smtp" && env.mail.host) {
    const transport = await getSmtpTransport();
    await transport.sendMail({ from: env.mail.from, ...message });
    return;
  }

  // Console transport — visible in server logs for local testing.
  // eslint-disable-next-line no-console
  console.log(
    [
      "",
      "──────────────── EMAIL (console transport) ────────────────",
      `To:      ${message.to}`,
      `Subject: ${message.subject}`,
      "",
      message.text,
      "────────────────────────────────────────────────────────────",
      "",
    ].join("\n")
  );
}

/** Builds the branded 2FA email for an admin login. */
export function buildOtpEmail(to: string, code: string, schoolName: string): MailMessage {
  const subject = `${schoolName} — admin panelga kirish kodi`;
  const text = `Kirish tasdiqlash kodingiz: ${code}\n\nKod ${Math.floor(
    env.auth.otpTtlSeconds / 60
  )} daqiqa amal qiladi. Agar bu siz bo'lmasangiz, parolingizni o'zgartiring.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:16px">
      <h2 style="margin:0 0 8px;color:#22d3ee">${schoolName}</h2>
      <p style="margin:0 0 16px;color:#94a3b8">Admin panelga kirish uchun tasdiqlash kodi:</p>
      <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#fff;background:#1e293b;padding:16px;border-radius:12px;text-align:center">${code}</div>
      <p style="margin:16px 0 0;color:#64748b;font-size:13px">Kod ${Math.floor(
        env.auth.otpTtlSeconds / 60
      )} daqiqa amal qiladi. Agar bu siz bo'lmasangiz, ushbu xabarni e'tiborsiz qoldiring va parolingizni o'zgartiring.</p>
    </div>`;
  return { to, subject, text, html };
}
