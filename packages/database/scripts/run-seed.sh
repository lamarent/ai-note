#!/bin/bash

# Script to apply seed data to D1 database

set -e

# Parse arguments
TARGET=${1:-"local"} # Default to local if not specified

# Check if target is valid
if [[ "$TARGET" != "local" && "$TARGET" != "remote" ]]; then
  echo "Error: Target must be either 'local' or 'remote'"
  echo "Usage: ./run-seed.sh [local|remote]"
  exit 1
fi

SEED_FILE="./prisma/seed.sql"

# Check if seed file exists
if [ ! -f "$SEED_FILE" ]; then
  echo "Error: Seed file not found at $SEED_FILE"
  exit 1
fi

echo "Clearing existing data in $TARGET D1 database..."

# Clear existing data (generate a clean slate)
CLEAR_SQL=$(
  cat <<EOF
DELETE FROM "Idea";
DELETE FROM "Category";
DELETE FROM "Session";
DELETE FROM "User";
EOF
)

# Execute the clear SQL
echo "$CLEAR_SQL" | npx wrangler --config ../backend/wrangler.toml d1 execute ai_brainstorm --$TARGET --command="$CLEAR_SQL"

echo "Applying seed data to $TARGET D1 database..."

# Execute the seed SQL file
npx wrangler --config ../backend/wrangler.toml d1 execute ai_brainstorm --$TARGET --file=$SEED_FILE

echo "✅ Seed data applied successfully to $TARGET environment"
