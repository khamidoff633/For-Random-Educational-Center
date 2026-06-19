import type { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Lightweight in-memory rate limiter (no external dependency).
 *
 * Suitable for a single-instance deployment. For multi-instance setups,
 * place a shared limiter (e.g. nginx or a gateway) in front of the app.
 */
export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = "Juda ko'p so'rov. Birozdan so'ng urinib ko'ring." } = options;
  const buckets = new Map<string, Bucket>();

  // Periodically drop expired buckets so memory does not grow unbounded.
  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, windowMs);
  // Do not keep the Node process alive solely for the sweeper. The cast keeps
  // this safe whether the timer is typed as a browser number or NodeJS.Timeout.
  (sweeper as unknown as { unref?: () => void }).unref?.();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;
    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({ error: message });
      return;
    }
    next();
  };
}
