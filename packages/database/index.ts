import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { D1Database } from "@cloudflare/workers-types";

export function createPrismaClient(d1Database: D1Database) {
  const adapter = new PrismaD1(d1Database);
  return new PrismaClient({ adapter });
}

export * from "@prisma/client";
