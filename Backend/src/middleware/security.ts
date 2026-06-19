import type { NextFunction, Request, Response } from "express";

/**
 * Sets a baseline of security headers (a minimal, dependency-free subset of
 * what helmet provides). The Content-Security-Policy is intentionally omitted
 * here because the Vite dev server and inline styles need a tailored policy;
 * configure CSP at your reverse proxy (nginx) for production.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
}
