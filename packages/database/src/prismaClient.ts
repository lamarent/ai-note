import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

/**
 * Creates a Prisma client instance using the D1 adapter for Cloudflare Workers
 * @param db D1Database instance from the Cloudflare Worker environment
 * @returns PrismaClient instance connected to the D1 database
 */
export const getPrismaClient = async (db: D1Database) => {
  const adapter = new PrismaD1(db);
  const prisma = new PrismaClient({ adapter });
  return prisma;
};

export type PrismaClientType = Awaited<ReturnType<typeof getPrismaClient>>;
