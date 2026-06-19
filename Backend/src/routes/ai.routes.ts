import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { rateLimit } from "../middleware/rateLimit";
import { generateStudyPlan, generateText, runCopilot } from "../services/aiService";
import { str } from "../utils/validation";

const router = Router();

// AI calls are relatively expensive — throttle them.
const aiLimiter = rateLimit({ windowMs: 60_000, max: 20 });

// Admin-only: generate a course description or teacher bio.
router.post(
  "/generate",
  requireAuth,
  aiLimiter,
  asyncHandler(async (req, res) => {
    const type = str(req.body?.type);
    if (type !== "course" && type !== "teacher") {
      throw new HttpError(400, "Yaroqsiz generatsiya turi.");
    }
    const text = await generateText(type, str(req.body?.name), str(req.body?.context));
    res.json({ text });
  })
);

// Admin-only: natural-language copilot that can answer and act.
router.post(
  "/copilot",
  requireAuth,
  aiLimiter,
  asyncHandler(async (req, res) => {
    const message = str(req.body?.message);
    if (!message) throw new HttpError(400, "Buyruq yoki savol matnini kiriting.");
    res.json(await runCopilot(message));
  })
);

// Public: AI-generated personalised study plan (also a lead magnet).
router.post(
  "/study-plan",
  aiLimiter,
  asyncHandler(async (req, res) => {
    const currentLevel = str(req.body?.currentLevel);
    const targetGoal = str(req.body?.targetGoal);
    if (!currentLevel || !targetGoal) {
      throw new HttpError(400, "Joriy daraja va maqsadni kiriting.");
    }
    const text = await generateStudyPlan(str(req.body?.name), currentLevel, targetGoal);
    res.json({ text });
  })
);

export default router;
