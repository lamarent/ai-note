# Database Setup with Cloudflare D1

This project uses Cloudflare D1 as the database, which is Cloudflare's native serverless SQL database based on SQLite. This document explains how to set up, migrate, and seed the database.

## Overview

We use Prisma ORM with Cloudflare D1 using the Wrangler CLI approach as described in the [Prisma documentation](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#using-the-wrangler-cli).

Key components of our database setup:

- **Prisma Schema**: Defines the data model in `packages/database/prisma/schema.prisma`
- **Migrations**: SQL files in `packages/database/migrations/` created with Wrangler CLI
- **Seed Data**: Default data for development in `packages/database/prisma/seed.sql`

## Local Development Setup

For local development, follow these steps to set up the database:

1. **Reset and seed the database** (first-time setup or to reset to a clean state):

   ```bash
   pnpm db:reset:local
   ```

   This will apply all migrations and seed the database with sample data.

2. **Just apply migrations** (if you only need to update schema):

   ```bash
   pnpm db:migrate:apply:local
   ```

3. **Just seed data** (if you only need fresh data with existing schema):
   ```bash
   pnpm db:seed:local
   ```

## Creating and Applying Migrations

When you make changes to the Prisma schema, you need to create a new migration:

1. **Update the schema** in `packages/database/prisma/schema.prisma`

2. **Create a new migration**:

   ```bash
   pnpm db:migrate:create your_migration_name
   ```

   This creates a new SQL migration file and automatically generates the SQL based on the difference between your local D1 database and your Prisma schema.

3. **Review the generated SQL** in `packages/database/migrations/XXXX_your_migration_name.sql`

4. **Apply the migration locally**:

   ```bash
   pnpm db:migrate:apply:local
   ```

5. **Apply the migration to production** (after testing):
   ```bash
   pnpm db:migrate:apply:remote
   ```

## Working with Seed Data

The seed data is defined in `packages/database/prisma/seed.sql`. You can modify this file to customize the initial data.

- **Apply seed data to local database**:

  ```bash
  pnpm db:seed:local
  ```

- **Apply seed data to remote database**:
  ```bash
  pnpm db:seed:remote
  ```

**Note**: The seed script first clears all existing data before inserting the seed data to ensure a clean slate.

## Database Reset (for Development)

For a complete database reset (applying migrations and seeding):

- **Reset local database**:

  ```bash
  pnpm db:reset:local
  ```

- **Reset remote database**:
  ```bash
  pnpm db:reset:remote
  ```

## Database Schema

Our database schema includes the following models:

- **User**: Application users
- **Session**: Brainstorming sessions
- **Idea**: Individual ideas within a session
- **Category**: Grouping categories for ideas

## Limitations

- D1 doesn't support transactions. Prisma's transaction operations will be run as individual queries.
- The migration workflow requires manual intervention to create and apply migrations.

## Using the Database in Your Application

In your Cloudflare Worker code:

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export default {
  async fetch(request: Request, env: Env) {
    const prisma = new PrismaClient({
      adapter: new PrismaD1(env.DB),
    });

    // Use prisma client here...

    return new Response("Hello World");
  },
};
```
