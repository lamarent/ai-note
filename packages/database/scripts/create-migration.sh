#!/bin/bash

# Script to create and generate D1 migrations without interactive prompts

set -e

# Check if a migration name was provided
if [ -z "$1" ]; then
  echo "Error: Migration name is required"
  echo "Usage: ./create-migration.sh <migration_name>"
  exit 1
fi

MIGRATION_NAME=$1

echo "Creating migration: $MIGRATION_NAME"

# Create migration file
npx wrangler --config ../backend/wrangler.toml d1 migrations create ai_brainstorm $MIGRATION_NAME

# Get the filename of the newly created migration
MIGRATION_FILE=$(ls -t migrations | grep -m 1 "$MIGRATION_NAME")

if [ -z "$MIGRATION_FILE" ]; then
  echo "Error: Failed to find the created migration file"
  exit 1
fi

echo "Generating SQL statements for migration: $MIGRATION_FILE"

# Generate SQL statements using prisma migrate diff
npx prisma migrate diff \
  --from-local-d1 \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output "migrations/$MIGRATION_FILE"

echo "✅ Migration created and SQL generated successfully in migrations/$MIGRATION_FILE"
echo "Review the SQL and then apply the migration with ./apply-migrations.sh [local|remote]"
