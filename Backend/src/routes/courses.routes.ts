import { Router } from "express";
import { getRepository } from "../db";
import { requireAuth } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { createId } from "../utils/id";
import { str } from "../utils/validation";
import type { Course } from "../models/types";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getRepository().listCourses());
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    const course: Course = {
      id: createId("c"),
      name: str(b.name) || "Yangi kurs",
      category: str(b.category) || "General",
      description: str(b.description),
      duration: str(b.duration) || "3 oy",
      price: str(b.price) || "Kelishilgan",
      teacherId: str(b.teacherId),
      days: str(b.days) || "Dush - Chor - Jum",
      time: str(b.time) || "14:00 - 16:00",
      image: str(b.image),
      capacity: Number(b.capacity) || 12,
    };
    res.status(201).json(await getRepository().createCourse(course));
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const updated = await getRepository().updateCourse(req.params.id, req.body ?? {});
    if (!updated) throw new HttpError(404, "Kurs topilmadi.");
    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const ok = await getRepository().deleteCourse(req.params.id);
    if (!ok) throw new HttpError(404, "Kurs topilmadi.");
    res.json({ success: true });
  })
);

export default router;
