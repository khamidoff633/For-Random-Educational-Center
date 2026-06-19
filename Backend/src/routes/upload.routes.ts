import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { saveDataUrl } from "../services/uploadService";

const router = Router();

// Protected: only an admin can upload media (logos, hero video, certificates).
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { base64, filename } = req.body ?? {};
    const url = await saveDataUrl(base64, filename);
    res.json({ url });
  })
);

export default router;
