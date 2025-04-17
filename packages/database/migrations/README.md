# D1 Database Migrations

This directory contains SQL migrations for the Cloudflare D1 database.

## Migration Workflow

### For Initial Setup

1. Create a migration file:
   ```bash
   pnpm migrate:create initial_schema
   ```
2. Generate SQL statements from Prisma schema:
   ```bash
   pnpm migrate:diff:initial --output migrations/0001_initial_schema.sql
   ```
3. Apply the migration to local D1 instance:
   ```bash
   pnpm migrate:apply:local
   ```
4. Apply the migration to remote D1 instance:
   ```bash
   pnpm migrate:apply:remote
   ```

### For Schema Changes

1. Update your Prisma schema in `prisma/schema.prisma`

2. Create a new migration file:

   ```bash
   pnpm migrate:create your_migration_name
   ```

3. Generate the SQL for the migration (differential):

   ```bash
   pnpm migrate:diff --output migrations/XXXX_your_migration_name.sql
   ```

   (where XXXX is the prefix number generated in step 2)

4. Apply the migration to local D1 instance:

   ```bash
   pnpm migrate:apply:local
   ```

5. After testing, apply to production:
   ```bash
   pnpm migrate:apply:remote
   ```

## Notes

- The `--from-local-d1` option tells Prisma to use your local D1 database state as the baseline
- The `--to-schema-datamodel ./prisma/schema.prisma` option tells Prisma to use your current schema as the target
- `--script` outputs the result as SQL instead of plain English
