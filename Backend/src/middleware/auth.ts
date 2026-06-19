import type { NextFunction, Request, Response } from "express";
import { authenticate } from "../services/authService";

export interface AuthedRequest extends Request {
  admin?: { sub: string; email: string };
}

/** Extracts a bearer token from the Authorization header. */
function bearer(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header) return undefined;
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" ? token : undefined;
}

/** Rejects the request unless it carries a valid admin session token. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const admin = authenticate(bearer(req));
  if (!admin) {
    res.status(401).json({ error: "Avtorizatsiya talab qilinadi." });
    return;
  }
  req.admin = admin;
  next();
}
