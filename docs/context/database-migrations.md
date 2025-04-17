# Database Migrations and Seeding

## Context

This document outlines the approach for managing database schema changes and seeding data in our Cloudflare D1 database using Prisma ORM.

## Implementation

The implementation follows the Wrangler CLI approach documented in the [Prisma documentation](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#using-the-wrangler-cli), with additional custom scripts for improved developer experience.

### Key Components

1. **Migration Files:** SQL migrations stored in `packages/database/migrations/`
2. **Seed Data:** Sample data defined in `packages/database/prisma/seed.sql`
3. **Shell Scripts:**
   - `packages/database/scripts/create-migration.sh` - Creates new migrations
   - `packages/database/scripts/apply-migrations.sh` - Applies migrations
   - `packages/database/scripts/run-seed.sh` - Seeds the database
   - `packages/database/scripts/reset-and-seed.sh` - Resets and seeds the database

### Workflow

#### Creating Migrations

1. Update the Prisma schema in `packages/database/prisma/schema.prisma`
2. Create a migration using:
   ```bash
   pnpm db:migrate:create <migration_name>
   ```
3. Review the generated SQL in the migration file
4. Apply the migration locally using:
   ```bash
   pnpm db:migrate:apply:local
   ```

#### Seeding Data

1. Update seed data in `packages/database/prisma/seed.sql`
2. Apply the seed data using:
   ```bash
   pnpm db:seed:local
   ```
   or
   ```bash
   pnpm db:seed:remote
   ```

#### Database Reset (Development)

To reset the database to a clean state:

```bash
pnpm db:reset:local
```

or

```bash
pnpm db:reset:remote
```

## Underlying Technical Implementation

The migration approach uses Prisma's `prisma migrate diff` command to:

1. Compare the current database schema with the Prisma schema
2. Generate SQL statements to evolve the database
3. Apply these SQL statements using Wrangler's D1 CLI

The seed script:

1. Clears existing data from the database
2. Applies seed SQL statements from `seed.sql`

## Documentation

Comprehensive documentation is available in `docs/database.md`, which includes:

- Detailed setup instructions
- Example usage of all commands
- Explanation of the migration workflow
- Notes on limitations and best practices

## Notes

- Cloudflare D1 doesn't support transactions, so Prisma's transaction operations run as individual queries
- The local and remote D1 databases are managed separately
- All commands have been added to package.json for easy access from both the database package and the project root

## Next Steps

1. Implement automated testing for database operations
2. Create a database backup and restore solution
3. Implement a staging environment deployment workflow
4. Add monitoring and logging for database operations
