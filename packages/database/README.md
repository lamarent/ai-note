# @ai-brainstorm/database

Database package for AI Note application using Prisma with Cloudflare D1.

## Setup

This package provides a Prisma client setup for Cloudflare D1 database using the driver adapter.

## Usage

```typescript
import { getPrismaClient } from "@ai-brainstorm/database";

// In a Cloudflare Worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const prisma = await getPrismaClient(env.DB);

    // Use prisma client
    const users = await prisma.user.findMany();

    return new Response(JSON.stringify(users));
  },
};
```

## Available Scripts

- `npm run dev`: Generate Prisma client
- `npm run build`: Generate Prisma client
- `npm run migrate:create`: Create a new D1 migration
- `npm run migrate:apply:local`: Apply migrations to local D1 database
- `npm run migrate:apply:remote`: Apply migrations to remote D1 database
- `npm run generate:types`: Generate Cloudflare Worker types

## Models

The database schema includes the following models:

- `User`: Application users
- `Session`: Brainstorming sessions
- `Idea`: Individual ideas within a session
- `Category`: Grouping categories for ideas

## D1 Database Migrations

This package includes scripts for managing D1 database migrations using Prisma and Wrangler CLI, following the approach described in the [Prisma documentation](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#using-the-wrangler-cli).

### Setting up new migrations

1. Create a new migration:

```bash
pnpm migrate:create my_migration_name
```

This will create a new migration file in the `migrations` directory and automatically generate the SQL based on the differences between your local D1 database and your Prisma schema.

2. Review the generated SQL in the migration file.

3. Apply the migration to your local D1 instance:

```bash
pnpm migrate:apply:local
```

4. After testing, apply to the remote D1 instance:

```bash
pnpm migrate:apply:remote
```

### Seeding the Database

The project includes a seed script to populate the database with initial data:

1. To seed the local database:

   ```bash
   pnpm seed:local
   ```

2. To seed the remote database:
   ```bash
   pnpm seed:remote
   ```

**Note:** The seed script will clear all existing data in the database before applying the seed data. This ensures a clean slate for development and testing.

The seed data is defined in `prisma/seed.sql`. You can modify this file to customize the initial data for your development environment.

### Reset and Seed (Development)

For a complete database reset and seed in one command (useful for development):

1. Reset and seed the local database:

   ```bash
   pnpm db:reset:local
   ```

2. Reset and seed the remote database:
   ```bash
   pnpm db:reset:remote
   ```

This will apply all migrations and then seed the database with the data from `prisma/seed.sql`.

### Using the database in your application

In your Cloudflare Worker code, you can use the D1 adapter to connect Prisma to your D1 database:

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

### Limitations

- D1 doesn't support transactions, so Prisma's transaction operations will be run as individual queries
- The migration workflow requires manual intervention to create and apply migrations
