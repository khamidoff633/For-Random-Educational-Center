/**
 * Builds the Express application: security headers, body parsing, static
 * uploads, and the `/api` router. Frontend serving (Vite in dev, static in
 * prod) and the final error handler are wired up in server.ts so this module
 * stays focused on the API surface.
 */
import express, { type Express } from "express";
import { env } from "./config/env";
import { createApiRouter } from "./routes";
import { securityHeaders } from "./middleware/security";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", true);

  app.use(securityHeaders);

  const bodyLimit = `${Math.ceil(env.upload.maxBytes / (1024 * 1024))}mb`;
  app.use(express.json({ limit: bodyLimit }));
  app.use(express.urlencoded({ limit: bodyLimit, extended: true }));

  // Serve uploaded media (immutable, long-cache friendly).
  app.use("/uploads", express.static(env.uploadsDir, { maxAge: "7d" }));

  app.use("/api", createApiRouter());

  return app;
}
