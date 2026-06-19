/**
 * Repository factory + singleton accessor.
 *
 * Selects PostgreSQL when DATABASE_URL is configured, otherwise falls back to
 * the zero-config JSON file store. Call `initRepository()` once at startup,
 * then use `getRepository()` everywhere else.
 */
import { env } from "../config/env";
import { FileRepository } from "./fileStore";
import type { Repository } from "./repository";

let instance: Repository | null = null;

export async function initRepository(): Promise<Repository> {
  if (instance) return instance;

  if (env.databaseUrl) {
    const { PostgresRepository } = await import("./postgres");
    instance = new PostgresRepository();
    // eslint-disable-next-line no-console
    console.log("[db] Using PostgreSQL repository");
  } else {
    instance = new FileRepository();
    // eslint-disable-next-line no-console
    console.log("[db] Using JSON file repository (data/db.json)");
  }

  await instance.init();
  return instance;
}

export function getRepository(): Repository {
  if (!instance) throw new Error("Repository accessed before initRepository()");
  return instance;
}

export type { Repository };
