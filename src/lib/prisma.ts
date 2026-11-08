import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Prisma's `schema` query param is not a Postgres parameter. The pg driver
 * would reject it, so it is removed and applied as search_path instead.
 * Tables stay in the existing `portfolio` schema via @@schema in the Prisma schema.
 * Neon’s pooler rejects search_path as a startup parameter, so it is not set here.
 */
function connectionString(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    url.searchParams.delete("schema");
    return url.toString();
  } catch {
    return raw.replace(/([?&])schema=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  }
}

export function createPrismaClient() {
  const pool = new Pool({
    connectionString: connectionString(),
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
