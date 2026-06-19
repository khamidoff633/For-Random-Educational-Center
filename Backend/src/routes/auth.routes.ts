import { Router, type Response } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { rateLimit } from "../middleware/rateLimit";
import { changePassword, login, verifyOtp } from "../services/authService";
import { str } from "../utils/validation";

const router = Router();

// Throttle auth attempts to slow brute-force/credential-stuffing.
const authLimiter = rateLimit({ windowMs: 60_000, max: 8, message: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." });

// Step 1: email + password -> emails a 2FA code.
router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const email = str(req.body?.email);
    const password = str(req.body?.password);
    if (!email || !password) throw new HttpError(400, "Email va parolni kiriting.");

    const result = await login(email, password);
    if (!result.ok) throw new HttpError(401, result.error ?? "Kirish rad etildi.");
    res.json({ ok: true, maskedEmail: result.maskedEmail });
  })
);

// Step 2: email + code -> session token.
router.post(
  "/verify",
  authLimiter,
  asyncHandler(async (req, res) => {
    const email = str(req.body?.email);
    const code = str(req.body?.code);
    if (!email || !code) throw new HttpError(400, "Email va kodni kiriting.");

    const result = await verifyOtp(email, code);
    if (!result.ok) throw new HttpError(401, result.error ?? "Tasdiqlash rad etildi.");
    res.json({ ok: true, token: result.token });
  })
);

// Returns the authenticated admin (used to restore a session on reload).
router.get(
  "/me",
  requireAuth,
  (req: AuthedRequest, res: Response) => {
    res.json({ admin: req.admin });
  }
);

// Change the admin password (requires a valid session + current password).
router.post(
  "/change-password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const current = str(req.body?.currentPassword);
    const next = str(req.body?.newPassword);
    const result = await changePassword(current, next);
    if (!result.ok) throw new HttpError(400, result.error ?? "Parolni o'zgartirib bo'lmadi.");
    res.json({ ok: true });
  })
);

export default router;
