import { Router } from "express";
import { getRepository } from "../db";
import { requireAuth } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { rateLimit } from "../middleware/rateLimit";
import { createId } from "../utils/id";
import { assertStudentName, assertValidPhone, str } from "../utils/validation";
import type { Lead, LeadStatus } from "../models/types";

const router = Router();

const STATUSES: LeadStatus[] = ["yangi", "boglanildi", "royxatga_otdi"];
function normalizeStatus(value: unknown): LeadStatus | undefined {
  const v = str(value) as LeadStatus;
  return STATUSES.includes(v) ? v : undefined;
}

// Throttle public submissions to deter spam/abuse.
const submitLimiter = rateLimit({ windowMs: 60_000, max: 10 });

// Protected: full lead list is internal CRM data.
router.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await getRepository().listLeads());
  })
);

// Public: prospective students submit enrolment requests.
router.post(
  "/",
  submitLimiter,
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    const studentName = str(b.studentName);
    const phone = str(b.phone);
    assertStudentName(studentName);
    assertValidPhone(phone);

    const lead: Lead = {
      id: createId("l"),
      studentName,
      phone,
      courseId: str(b.courseId),
      status: "yangi",
      notes: str(b.notes),
      createdAt: new Date().toISOString(),
      seen: false,
      verified: false,
      verifiedAt: null,
    };
    res.status(201).json(await getRepository().createLead(lead));
  })
);

// Protected: mark all leads as seen (clears the "new" badge).
router.post(
  "/mark-seen",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const repo = getRepository();
    const leads = await repo.listLeads();
    await Promise.all(
      leads.filter((l) => !l.seen).map((l) => repo.updateLead(l.id, { seen: true }))
    );
    res.json({ success: true });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    const patch: Partial<Lead> = {};

    if (b.phone !== undefined) {
      assertValidPhone(str(b.phone));
      patch.phone = str(b.phone);
    }
    if (b.studentName !== undefined) patch.studentName = str(b.studentName);
    if (b.courseId !== undefined) patch.courseId = str(b.courseId);
    if (b.notes !== undefined) patch.notes = str(b.notes);
    if (b.seen !== undefined) patch.seen = Boolean(b.seen);

    if (b.status !== undefined) {
      const status = normalizeStatus(b.status);
      if (!status) throw new HttpError(400, "Yaroqsiz status.");
      patch.status = status;
    }

    // Verifying ("Tekshirildi") stamps the time for the 7-day countdown;
    // un-verifying clears it.
    if (b.verified !== undefined) {
      patch.verified = Boolean(b.verified);
      patch.verifiedAt = b.verified ? new Date().toISOString() : null;
    }

    const updated = await getRepository().updateLead(req.params.id, patch);
    if (!updated) throw new HttpError(404, "Ariza topilmadi.");
    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const ok = await getRepository().deleteLead(req.params.id);
    if (!ok) throw new HttpError(404, "Ariza topilmadi.");
    res.json({ success: true });
  })
);

export default router;
