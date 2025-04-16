// We can't run this test directly because it requires a D1Database instance.
// This is for reference only for the repository patterns.

import {
  UserRepository,
  SessionRepository,
  IdeaRepository,
  CategoryRepository,
} from "./repositories";
import { PrismaClient } from "@prisma/client";

async function main() {
  // In a real Cloudflare Worker environment, we would use the D1 database adapter
  // For testing/documentation purposes only
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:./dev.db",
      },
    },
  });

  const userRepo = new UserRepository(prisma);
  const sessionRepo = new SessionRepository(prisma);
  const ideaRepo = new IdeaRepository(prisma);
  const categoryRepo = new CategoryRepository(prisma);

  // Example of how to use the repositories
  try {
    console.log("Users:");
    const users = await userRepo.findAll();
    console.log(users);

    console.log("\nSessions:");
    const sessions = await sessionRepo.findAll();
    console.log(sessions);

    console.log("\nCategories:");
    const categories = await categoryRepo.findAll();
    console.log(categories);

    console.log("\nIdeas:");
    const ideas = await ideaRepo.findAll();
    console.log(ideas);

    console.log("\nAll repositories working correctly!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// This file is for reference only and won't be run directly
// main();
