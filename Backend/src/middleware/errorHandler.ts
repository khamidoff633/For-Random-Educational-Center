import type { NextFunction, Request, Response } from "express";
import { AiNotConfiguredError } from "../services/aiService";

/** A typed error that carries an HTTP status code. */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

/** Wraps an async route handler so thrown errors reach the error middleware. */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

/** Final error handler — converts known errors to clean JSON responses. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AiNotConfiguredError) {
    res.status(503).json({ error: err.message });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  // eslint-disable-next-line no-console
  console.error("[error]", err);
  res.status(500).json({ error: "Serverda kutilmagan xatolik yuz berdi." });
}

/** 404 handler for unknown API routes. */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Manzil topilmadi." });
}
