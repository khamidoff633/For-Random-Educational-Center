/**
 * Optional new-lead notifications via the Telegram Bot API.
 *
 * Uses the built-in fetch (Node 18+) — no third-party dependency. Enabled only
 * when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are configured; otherwise it is
 * a no-op. Failures are swallowed so they never affect the lead submission.
 *
 * To enable:
 *   1. Create a bot via @BotFather and copy its token.
 *   2. Get your chat id (e.g. via @userinfobot) and set:
 *      TELEGRAM_BOT_TOKEN=...  TELEGRAM_CHAT_ID=...
 */
import { env } from "../config/env";
import type { Lead } from "../models/types";

export async function notifyNewLead(lead: Lead): Promise<void> {
  const { botToken, chatId } = env.telegram;
  if (!botToken || !chatId) return;

  const lines = [
    "Yangi ariza qabul qilindi",
    `Ism: ${lead.studentName}`,
    `Telefon: ${lead.phone}`,
    lead.notes ? `Izoh: ${lead.notes}` : "",
    `Sana: ${new Date(lead.createdAt).toLocaleString("uz")}`,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[notify] Telegram notification failed:", error instanceof Error ? error.message : error);
  }
}
