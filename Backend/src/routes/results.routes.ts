import { Router } from "express";
import { getRepository } from "../db";
import { requireAuth } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { createId } from "../utils/id";
import { clampText, str } from "../utils/validation";
import type { ExamType, StudentResultItem } from "../models/types";

const router = Router();

const EXAM_TYPES: ExamType[] = ["IELTS", "CEFR", "SAT", "Dasturlash"];
function normalizeExam(value: unknown): ExamType {
  const v = str(value) as ExamType;
  return EXAM_TYPES.includes(v) ? v : "IELTS";
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getRepository().listResults());
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    const result: StudentResultItem = {
      id: createId("sr"),
      studentName: str(b.studentName) || "O'quvchi",
      score: str(b.score),
      examType: normalizeExam(b.examType),
      image: str(b.image),
      certificateImage: str(b.certificateImage),
      // Optional caption, capped at 150 characters.
      description: clampText(b.description, 150),
      courseName: str(b.courseName),
      achievementDate: str(b.achievementDate) || new Date().toISOString().slice(0, 10),
    };
    res.status(201).json(await getRepository().createResult(result));
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const patch = { ...(req.body ?? {}) };
    if (patch.description !== undefined) patch.description = clampText(patch.description, 150);
    if (patch.examType !== undefined) patch.examType = normalizeExam(patch.examType);
    const updated = await getRepository().updateResult(req.params.id, patch);
    if (!updated) throw new HttpError(404, "Natija topilmadi.");
    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const ok = await getRepository().deleteResult(req.params.id);
    if (!ok) throw new HttpError(404, "Natija topilmadi.");
    res.json({ success: true });
  })
);

export default router;
