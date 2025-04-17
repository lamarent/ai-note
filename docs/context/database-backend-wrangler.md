# Shared Wrangler Configuration for Backend & Database

## Context

To ensure a single source of truth for D1 database configuration and migrations, the monorepo uses a single `wrangler.toml` file.

## Location

- The canonical `wrangler.toml` is located at: `packages/backend/wrangler.toml`

## Usage

- **Backend development:** All `wrangler` commands (e.g., `wrangler dev`, `wrangler d1 migrations`) should be run from the `packages/backend` directory.
- **Database migrations:** The `migrations_dir` in `wrangler.toml` points to `../database/prisma/migrations`, so all migrations are managed in the database package, but the config is in the backend package.

## Why

- This avoids duplication and ensures both backend and database use the same D1 binding, database name, and migration directory.

## Example

```sh
cd packages/backend
wrangler d1 migrations apply DB
wrangler dev
```

## Note

If you need to run D1 commands from the database package, use:

```sh
wrangler --config ../backend/wrangler.toml d1 migrations apply DB
```

Or create a symlink if you prefer:

```sh
ln -s ../backend/wrangler.toml packages/database/wrangler.toml
```

---

General rule applied: context tracking, documentation, and minimal, clear setup.
