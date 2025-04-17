import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";

/**
 * Applies Prisma migrations to a D1 database
 * This script is used for both local development and in the deployment pipeline
 */
export async function applyMigrations(d1Client: D1Database) {
  console.log("Applying migrations to D1 database...");

  try {
    // Get all migration directories in order
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFolders = fs
      .readdirSync(migrationsDir)
      .filter((folder) => !folder.startsWith(".")) // Skip hidden files/folders
      .sort((a, b) => a.localeCompare(b)); // Sort to ensure migrations run in order

    console.log(`Found ${migrationFolders.length} migrations to apply...`);

    // Apply each migration
    for (const migrationFolder of migrationFolders) {
      const migrationPath = path.join(
        migrationsDir,
        migrationFolder,
        "migration.sql"
      );

      // Check if migration file exists
      if (!fs.existsSync(migrationPath)) {
        console.warn(
          `Migration file not found for ${migrationFolder}, skipping...`
        );
        continue;
      }

      // Read migration SQL
      const sql = fs.readFileSync(migrationPath, "utf-8");

      // Skip empty migrations
      if (!sql.trim()) {
        console.log(`Migration ${migrationFolder} is empty, skipping...`);
        continue;
      }

      console.log(`Applying migration: ${migrationFolder}...`);

      // Execute the SQL on the D1 database
      try {
        // Split into separate statements if necessary (D1 can have issues with multiple statements)
        const statements = sql
          .split(";")
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        for (const statement of statements) {
          const result = await d1Client.prepare(statement + ";").run();
          console.log(
            `Statement executed successfully: ${statement.substring(0, 50)}...`
          );
        }

        console.log(`Migration ${migrationFolder} applied successfully.`);
      } catch (error) {
        console.error(`Error applying migration ${migrationFolder}:`, error);
        throw error; // Re-throw to stop the migration process
      }
    }

    console.log("All migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

/**
 * Script to run migrations directly from command line
 * This is used primarily for local development
 */
if (require.main === module) {
  // This code only runs when script is executed directly
  console.log("Running migrations CLI...");

  // For local development, use a direct Prisma connection
  // In production, this would be called with the D1 client
  const prisma = new PrismaClient();

  // Apply migrations using prisma.$executeRaw for local testing
  async function runLocalMigrations() {
    try {
      const migrationsDir = path.join(__dirname, "migrations");
      const migrationFolders = fs
        .readdirSync(migrationsDir)
        .filter((folder) => !folder.startsWith("."))
        .sort((a, b) => a.localeCompare(b));

      console.log(
        `Found ${migrationFolders.length} migrations to apply locally...`
      );

      for (const migrationFolder of migrationFolders) {
        const migrationPath = path.join(
          migrationsDir,
          migrationFolder,
          "migration.sql"
        );

        if (!fs.existsSync(migrationPath)) {
          console.warn(
            `Migration file not found for ${migrationFolder}, skipping...`
          );
          continue;
        }

        const sql = fs.readFileSync(migrationPath, "utf-8");

        if (!sql.trim()) {
          console.log(`Migration ${migrationFolder} is empty, skipping...`);
          continue;
        }

        console.log(`Applying migration: ${migrationFolder} locally...`);

        const statements = sql
          .split(";")
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        for (const statement of statements) {
          await prisma.$executeRawUnsafe(statement + ";");
          console.log(
            `Statement executed successfully: ${statement.substring(0, 50)}...`
          );
        }

        console.log(`Migration ${migrationFolder} applied successfully.`);
      }

      console.log("All migrations applied successfully to local database!");
    } catch (error) {
      console.error("Local migration failed:", error);
    } finally {
      await prisma.$disconnect();
    }
  }

  runLocalMigrations();
}
