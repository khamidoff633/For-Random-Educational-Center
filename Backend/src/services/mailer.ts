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
    // For STARTTLS ports (e.g. 587) require an encrypted upgrade.
    requireTLS: !env.mail.secure,
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

/** Builds the branded, premium 2FA email (warm light theme, icon-based). */
export function buildOtpEmail(to: string, code: string, schoolName: string): MailMessage {
  const minutes = Math.floor(env.auth.otpTtlSeconds / 60);
  const monogram = (schoolName.trim()[0] || "A").toUpperCase();
  const subject = `${schoolName} — kirish kodi`;

  // Short, clear plain-text version (fallback for non-HTML clients).
  const text = `Kirish kodingiz: ${code}\nKod ${minutes} daqiqa amal qiladi.`;

  // Premium HTML: cream background, caramel accent, charcoal text, monogram
  // badge (no emoji). Inline styles for broad email-client compatibility.
  const html = `
  <div style="margin:0;background:#faf8f5;padding:32px 16px;font-family:'Inter',Arial,Helvetica,sans-serif;">
    <div style="max-width:440px;margin:0 auto;background:#ffffff;border:1px solid rgba(26,26,26,0.08);border-radius:18px;overflow:hidden;box-shadow:0 14px 44px rgba(26,26,26,0.10);">
      <div style="padding:30px 28px 8px;text-align:center;">
        <div style="display:inline-block;width:52px;height:52px;line-height:52px;border-radius:14px;background:#c8761a;color:#ffffff;font-size:22px;font-weight:800;font-family:'Sora',Arial,sans-serif;">${monogram}</div>
        <div style="margin-top:14px;font-size:18px;font-weight:800;color:#1a1a1a;">${schoolName}</div>
        <div style="margin-top:4px;font-size:13px;color:#8a857d;">Admin panelga kirish kodi</div>
      </div>
      <div style="padding:22px 28px 28px;text-align:center;">
        <div style="display:inline-block;background:#faf6ef;border:1px solid #ead9c2;border-radius:14px;padding:16px 26px;font-size:34px;font-weight:800;letter-spacing:10px;color:#a85d12;">${code}</div>
        <div style="margin-top:18px;font-size:12px;line-height:1.6;color:#8a857d;">
          Kod ${minutes} daqiqa amal qiladi.<br/>Agar bu siz bo'lmasangiz, e'tibor bermang.
        </div>
      </div>
    </div>
  </div>`;

  return { to, subject, text, html };
}
