#!/usr/bin/env node

/**
 * This script helps set up a Cloudflare D1 database for your project.
 * Run this script to create and initialize your D1 database.
 *
 * It always reads/updates wrangler.toml from the backend package.
 * Optionally, set BACKEND_WRANGLER_TOML env variable to override the path.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

console.log(`${colors.blue}=== Cloudflare D1 Setup Tool ===${colors.reset}\n`);

// Always use backend's wrangler.toml, or allow override
const wranglerPath = process.env.BACKEND_WRANGLER_TOML
  ? path.resolve(process.env.BACKEND_WRANGLER_TOML)
  : path.resolve(__dirname, "..", "backend", "wrangler.toml");

try {
  // Step 1: Create D1 database
  console.log(`${colors.yellow}Step 1: Creating D1 database...${colors.reset}`);
  console.log('Creating a new D1 database named "ai_brainstorm"...');

  try {
    const createOutput = execSync(
      "npx wrangler d1 create ai_brainstorm"
    ).toString();
    console.log(createOutput);

    // Extract the database_id from the output
    const dbIdMatch = createOutput.match(/database_id = "([^"]+)"/);

    if (dbIdMatch && dbIdMatch[1]) {
      const databaseId = dbIdMatch[1];
      console.log(
        `${colors.green}Database created with ID: ${databaseId}${colors.reset}`
      );

      // Update wrangler.toml with the actual database_id
      let wranglerContent = fs.readFileSync(wranglerPath, "utf8");

      // Replace the placeholder database_id
      wranglerContent = wranglerContent.replace(
        /database_id = "(ai_brainstorm_db|[^"]*)"/,
        `database_id = "${databaseId}"`
      );

      fs.writeFileSync(wranglerPath, wranglerContent);
      console.log(
        `${colors.green}Updated wrangler.toml at ${wranglerPath} with the correct database_id${colors.reset}`
      );
    } else {
      console.log(
        `${colors.yellow}Could not extract database ID from output. You'll need to manually update wrangler.toml${colors.reset}`
      );
    }
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log(
        `${colors.yellow}Database "ai_brainstorm" already exists. Skipping creation.${colors.reset}`
      );
    } else {
      throw error;
    }
  }

  // Step 2: Generate Prisma client
  console.log(
    `\n${colors.yellow}Step 2: Generating Prisma client...${colors.reset}`
  );
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log(
    `${colors.green}Prisma client generated successfully!${colors.reset}`
  );

  // Step 3: Generate SQLite migration
  console.log(
    `\n${colors.yellow}Step 3: Generating SQLite migration...${colors.reset}`
  );
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
  console.log(`${colors.green}Migration created successfully!${colors.reset}`);

  // Step 4: Push schema to D1
  console.log(
    `\n${colors.yellow}Step 4: Pushing schema to D1...${colors.reset}`
  );

  // Find the migration SQL file
  const migrationDir = path.resolve(__dirname, "prisma", "migrations");
  const latestMigrationDir = fs
    .readdirSync(migrationDir)
    .filter((dir) => dir.includes("_init"))
    .sort()
    .pop();

  if (!latestMigrationDir) {
    throw new Error("Could not find migration file");
  }

  const sqlFilePath = path.resolve(
    migrationDir,
    latestMigrationDir,
    "migration.sql"
  );

  console.log(`Using migration file: ${sqlFilePath}`);
  execSync(`npx wrangler d1 execute ai_brainstorm --file=${sqlFilePath}`, {
    stdio: "inherit",
    cwd: path.dirname(wranglerPath), // run from backend dir for config context
  });

  console.log(
    `\n${colors.green}🎉 D1 database setup completed successfully!${colors.reset}`
  );
  console.log(
    `${colors.blue}You can now run your backend with: ${colors.reset}cd ../backend && npx wrangler dev`
  );
} catch (error) {
  console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}
