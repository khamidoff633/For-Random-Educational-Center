/**
 * Auto-cleanup for archived ("Tekshirilgan") leads.
 *
 * A lead marked as verified is kept for VERIFIED_TTL_DAYS (default 7) and then
 * permanently deleted from the database. This keeps the store small and
 * matches the admin UX (the countdown shown on each archived lead).
 */
import { getRepository } from "../db";

const DAY_MS = 24 * 60 * 60 * 1000;
export const VERIFIED_TTL_DAYS = 7;

/** Deletes verified leads whose retention window has elapsed. Returns count. */
export async function runVerifiedLeadCleanup(): Promise<number> {
  const repo = getRepository();
  const leads = await repo.listLeads();
  const now = Date.now();
  const expired = leads.filter((lead) => {
    if (!lead.verified || !lead.verifiedAt) return false;
    const age = now - new Date(lead.verifiedAt).getTime();
    return age >= VERIFIED_TTL_DAYS * DAY_MS;
  });

  for (const lead of expired) {
    await repo.deleteLead(lead.id);
  }
  if (expired.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`[cleanup] Removed ${expired.length} expired archived lead(s).`);
  }
  return expired.length;
}

/** Runs cleanup immediately, then every 6 hours. */
export function startCleanupScheduler(): void {
  void runVerifiedLeadCleanup().catch((err) =>
    // eslint-disable-next-line no-console
    console.error("[cleanup] initial run failed:", err)
  );

  const timer = setInterval(() => {
    void runVerifiedLeadCleanup().catch((err) =>
      // eslint-disable-next-line no-console
      console.error("[cleanup] scheduled run failed:", err)
    );
  }, 6 * 60 * 60 * 1000);

  // Don't keep the Node process alive solely for this timer.
  (timer as unknown as { unref?: () => void }).unref?.();
}
