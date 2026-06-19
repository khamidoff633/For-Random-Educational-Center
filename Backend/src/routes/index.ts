import { Router, type Request, type Response } from "express";
import settingsRoutes from "./settings.routes";
import coursesRoutes from "./courses.routes";
import teachersRoutes from "./teachers.routes";
import leadsRoutes from "./leads.routes";
import resultsRoutes from "./results.routes";
import statsRoutes from "./stats.routes";
import uploadRoutes from "./upload.routes";
import authRoutes from "./auth.routes";
import aiRoutes from "./ai.routes";
import placementRoutes from "./placement.routes";
import { notFound } from "../middleware/errorHandler";

/** Mounts every API resource under a single `/api` router. */
export function createApiRouter(): Router {
  const api = Router();

  api.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

  api.use("/settings", settingsRoutes);
  api.use("/courses", coursesRoutes);
  api.use("/teachers", teachersRoutes);
  api.use("/leads", leadsRoutes);
  api.use("/results", resultsRoutes);
  api.use("/stats", statsRoutes);
  api.use("/upload", uploadRoutes);
  api.use("/auth", authRoutes);
  api.use("/ai", aiRoutes);
  api.use("/placement-questions", placementRoutes);

  // Unknown /api/* paths return JSON 404 (not the SPA fallback).
  api.use(notFound);
  return api;
}
