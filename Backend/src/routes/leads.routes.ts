import { Router } from "express";
import { getRepository } from "../db";
import { requireAuth } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { rateLimit } from "../middleware/rateLimit";
import { createId } from "../utils/id";
import { assertStudentName, assertValidPhone, str } from "../utils/validation";
import type { Lead } from "../models/types";

const router = Router();

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
    };
    res.status(201).json(await getRepository().createLead(lead));
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    if (b.phone !== undefined) assertValidPhone(str(b.phone));
    const updated = await getRepository().updateLead(req.params.id, b);
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
