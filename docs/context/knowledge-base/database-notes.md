# Database & Migration Notes

This file contains notes and context related to database setup, migrations, seeding, and integration with the backend.

## Shared Wrangler Configuration for Backend & Database

### Context

To ensure a single source of truth for D1 database configuration and migrations, the monorepo uses a single `wrangler.toml` file.

### Location

- The canonical `wrangler.toml` is located at: `packages/backend/wrangler.toml`

### Usage

- **Backend development:** All `wrangler` commands (e.g., `wrangler dev`, `wrangler d1 migrations`) should be run from the `packages/backend` directory.
- **Database migrations:** The `migrations_dir` in `wrangler.toml` points to `../database/prisma/migrations`, so all migrations are managed in the database package, but the config is in the backend package.

### Why

- This avoids duplication and ensures both backend and database use the same D1 binding, database name, and migration directory.

### Example Usage

```sh
# Run commands from packages/backend
cd packages/backend
wrangler d1 migrations apply DB
wrangler dev
```

### Running D1 Commands from Database Package

If you need to run D1 commands from the database package, use:

```sh
wrangler --config ../backend/wrangler.toml d1 migrations apply DB
```

Or create a symlink:

```sh
# From project root
ln -s ../backend/wrangler.toml packages/database/wrangler.toml
```

---

## Database Migrations and Seeding

### Context

This section outlines the approach for managing database schema changes and seeding data in our Cloudflare D1 database using Prisma ORM.

### Implementation

The implementation follows the Wrangler CLI approach documented in the [Prisma documentation](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#using-the-wrangler-cli), with additional custom scripts for improved developer experience.

### Key Components

1. **Migration Files:** SQL migrations stored in `packages/database/migrations/`
2. **Seed Data:** Sample data defined in `packages/database/prisma/seed.sql`
3. **Shell Scripts:** Located in `packages/database/scripts/` for creating/applying migrations, seeding, and resetting.
4. **Package Scripts:** `pnpm` scripts defined in `package.json` for easy access (e.g., `pnpm db:migrate:create <name>`, `pnpm db:migrate:apply:local`, `pnpm db:seed:local`, `pnpm db:reset:local`).

### Workflow Summary

- **Creating Migrations:** Update `schema.prisma`, run `pnpm db:migrate:create <name>`, review SQL, apply locally (`pnpm db:migrate:apply:local`).
- **Seeding Data:** Update `seed.sql`, run `pnpm db:seed:local` or `pnpm db:seed:remote`.
- **Database Reset (Dev):** Run `pnpm db:reset:local` or `pnpm db:reset:remote`.

### Underlying Technical Implementation

- Migrations use `prisma migrate diff` to generate SQL, applied via `wrangler d1 execute`.
- Seeding clears data and applies `seed.sql` via `wrangler d1 execute`.

### Related Documentation

- Comprehensive guide: `docs/guides/database.md`
- Cloudflare D1 specifics: `docs/guides/cloudflare-d1-migration.md`

### Notes

- Cloudflare D1 doesn't support transactions fully.
- Local and remote D1 databases are managed separately.

---

_Last updated: Based on merged files from 2025-04-17_
