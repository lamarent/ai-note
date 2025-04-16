# Database Package

This package provides Prisma integration with Cloudflare D1 SQLite for use with Cloudflare Workers.

## Features

- Prisma ORM configured for Cloudflare D1 SQLite
- Simple client factory for Worker environments
- Automatic migration setup for Cloudflare D1

## Setup

1. Make sure you have wrangler installed globally or use npx:

   ```bash
   npm install -g wrangler
   # or
   pnpm add -g wrangler
   ```

2. Login to Cloudflare (if not already logged in):

   ```bash
   wrangler login
   ```

3. Run the setup script to initialize D1:

   ```bash
   pnpm setup
   ```

   This will:

   - Create a D1 database in your Cloudflare account
   - Generate the Prisma client
   - Create the initial migration
   - Push the schema to D1
   - Update wrangler.toml with the correct database ID

## Usage in Cloudflare Workers (Hono)

```typescript
import { Hono } from "hono";
import { createPrismaClient } from "@ai-brainstorm/database";

export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

// Helper to get Prisma client per request (Worker best practice)
function getPrisma(c) {
  return createPrismaClient(c.env.DB);
}

app.get("/api/users", async (c) => {
  const prisma = getPrisma(c);
  const users = await prisma.user.findMany();
  return c.json(users);
});

export default app;
```

## Local Development

For local development, Wrangler will create a local D1 SQLite database for testing.

```bash
# In the backend package
pnpm dev
```

This will start the Wrangler dev server with a local D1 instance.

## Migrations

When you need to update your schema:

1. Modify the schema.prisma file
2. Run migration:
   ```bash
   pnpm migrate:dev
   ```
3. Push the changes to D1:
   ```bash
   wrangler d1 execute ai_brainstorm --file=./prisma/migrations/[latest]/migration.sql
   ```

## Prisma Studio

You can use Prisma Studio to view and edit your local data:

```bash
pnpm studio
```

Note: This will connect to the local SQLite database, not your Cloudflare D1 instance.
