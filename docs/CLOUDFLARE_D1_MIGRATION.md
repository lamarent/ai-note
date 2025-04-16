# Cloudflare D1 Migration

This document outlines the migration from PostgreSQL to Cloudflare D1 SQLite for the AI Brainstorm application.

## Overview of Changes

1. **Prisma Schema**: Updated to use SQLite provider with driver adapters
2. **Database Package**:
   - Replaced PostgreSQL dependencies with SQLite and D1 adapter
   - Created setup script for D1 initialization
   - Updated client creation to work with D1
3. **Backend Package**:
   - Updated wrangler.toml to use D1 binding
   - Modified the backend code to use D1 instead of DATABASE_URL
   - Added local development configuration

## Migration Details

### Prisma Schema Changes

- Changed provider from `postgresql` to `sqlite`
- Added `previewFeatures = ["driverAdapters"]` to enable D1 support

### Database Package Changes

- Removed `pg` and `@prisma/adapter-pg` dependencies
- Added `@prisma/adapter-d1` and `better-sqlite3` dependencies
- Created a `setup-d1.js` script to initialize D1 database
- Modified `index.ts` to accept a D1 database instance instead of a connection string

### Backend Package Changes

- Updated wrangler.toml to define D1 database binding
- Modified the backend code to use `c.env.DB` instead of `c.env.DATABASE_URL`
- Added `--local --persist` to the dev script to use local D1

## Setup Instructions

1. Update dependencies:

   ```bash
   cd packages/database
   pnpm install
   ```

2. Run the D1 setup script:

   ```bash
   pnpm setup
   ```

3. Start the backend:
   ```bash
   cd ../backend
   pnpm dev
   ```

## Deployment

To deploy the backend to Cloudflare Workers:

```bash
cd packages/backend
pnpm deploy
```

## Local Development

For local development, the setup creates a local SQLite database that mimics the behavior of D1. You can use Prisma Studio to inspect and modify the local database:

```bash
cd packages/database
pnpm studio
```

## Notes

- SQLite/D1 has some limitations compared to PostgreSQL, but it works well for this application
- For more complex queries or functionality, you may need to adjust your code to work with SQLite's syntax
- The local development environment uses a local SQLite database, which is a good approximation of D1 but may have some differences
