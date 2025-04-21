#!/bin/bash

# Script to create and generate D1 migrations for local development

set -e

# Ensure migration name is provided
if [ -z "$1" ]; then
  echo "Error: Migration name is required"
  echo "Usage: $0 <migration_name>"
  exit 1
fi
MIGRATION_NAME="$1"

# Resolve directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# packages/database/scripts -> packages/database
DB_PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"
# packages/backend
BACKEND_DIR="$(cd "$DB_PACKAGE_DIR/../backend" && pwd)"
# migrations directory in database package
MIGRATIONS_DIR="$DB_PACKAGE_DIR/migrations"

echo "Creating migration: $MIGRATION_NAME"

# Navigate to backend to run Wrangler commands
pushd "$BACKEND_DIR" >/dev/null
echo "Ensuring local D1 database exists..."
npx wrangler d1 create ai_brainstorm || true
echo "Creating migration via Wrangler in backend..."
npx wrangler --config "wrangler.toml" d1 migrations create ai_brainstorm "$MIGRATION_NAME"
popd >/dev/null

# Find generated migration filename in database package
echo "Locating migration file in $MIGRATIONS_DIR..."
MIGRATION_FILE=$(ls -t "$MIGRATIONS_DIR" | grep -m 1 "$MIGRATION_NAME")
if [ -z "$MIGRATION_FILE" ]; then
  echo "Error: Migration file not found in $MIGRATIONS_DIR"
  exit 1
fi

echo "Generating SQL statements for migration: $MIGRATION_FILE"
# Locate local D1 sqlite database file
D1_DB_FILE=$(find "$BACKEND_DIR/.wrangler/state/v3/d1/miniflare-D1DatabaseObject" -type f -name "*.sqlite" | head -n 1)
if [ -z "$D1_DB_FILE" ]; then
  echo "Error: Local D1 sqlite file not found under $BACKEND_DIR/.wrangler"
  exit 1
fi
FROM_URL="file:$D1_DB_FILE"
# Generate SQL diff
pushd "$DB_PACKAGE_DIR" >/dev/null
npx prisma migrate diff \
  --from-url "$FROM_URL" \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output "$MIGRATIONS_DIR/$MIGRATION_FILE"
popd >/dev/null

echo "✅ Migration created and SQL generated in $MIGRATIONS_DIR/$MIGRATION_FILE"
echo "Review the SQL and apply with ./apply-migrations.sh [local|remote]"
