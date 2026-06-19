import { Router } from "express";
import { getRepository } from "../db";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// Public: the site needs settings to render.
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getRepository().getSettings());
  })
);

// Protected: only an authenticated admin can change settings.
router.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await getRepository().updateSettings(req.body ?? {}));
  })
);

export default router;
