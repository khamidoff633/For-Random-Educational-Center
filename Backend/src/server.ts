/**
 * Application entry point.
 *
 *  - Initialises the repository (PostgreSQL or file store).
 *  - In development: attaches Vite as middleware for HMR + SPA serving.
 *  - In production: serves the pre-built `dist/` bundle with SPA fallback.
 *  - Installs the JSON error handler last so all routes funnel into it.
 */
import path from "path";
import express, { type Request, type Response } from "express";
import { env } from "./config/env";
import { createApp } from "./app";
import { initRepository } from "./db";
import { errorHandler } from "./middleware/errorHandler";

async function startServer(): Promise<void> {
  await initRepository();

  const app = createApp();

  if (!env.isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(env.rootDir, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(errorHandler);

  app.listen(env.port, env.host, () => {
    // eslint-disable-next-line no-console
    console.log(`Apex Academy server running at http://${env.host}:${env.port}`);
  });
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});
