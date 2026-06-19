import { Router } from "express";
import { getRepository } from "../db";
import { requireAuth } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { createId } from "../utils/id";
import { str } from "../utils/validation";
import type { Teacher } from "../models/types";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getRepository().listTeachers());
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    const teacher: Teacher = {
      id: createId("t"),
      name: str(b.name) || "Yangi o'qituvchi",
      specialty: str(b.specialty) || "O'qituvchi",
      slogan: str(b.slogan),
      bio: str(b.bio),
      image: str(b.image),
      experience: str(b.experience) || "Yangi",
      phone: str(b.phone),
      gender: b.gender === "ayol" ? "ayol" : "erkak",
    };
    res.status(201).json(await getRepository().createTeacher(teacher));
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const updated = await getRepository().updateTeacher(req.params.id, req.body ?? {});
    if (!updated) throw new HttpError(404, "O'qituvchi topilmadi.");
    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const ok = await getRepository().deleteTeacher(req.params.id);
    if (!ok) throw new HttpError(404, "O'qituvchi topilmadi.");
    res.json({ success: true });
  })
);

export default router;
