#!/bin/bash

# Script to reset the database by applying all migrations and then seeding

set -e

# Parse arguments
TARGET=${1:-"local"} # Default to local if not specified

# Check if target is valid
if [[ "$TARGET" != "local" && "$TARGET" != "remote" ]]; then
  echo "Error: Target must be either 'local' or 'remote'"
  echo "Usage: ./reset-and-seed.sh [local|remote]"
  exit 1
fi

echo "🔄 Resetting and seeding $TARGET database..."

# Apply migrations
echo "⏳ Applying migrations..."
cd "$(dirname "$0")/.." && npx wrangler --config ../backend/wrangler.toml d1 migrations apply ai_brainstorm --$TARGET

# Apply seed data
echo "🌱 Applying seed data..."
cd "$(dirname "$0")/.." && npm run seed:$TARGET

echo "✅ Database reset and seed completed successfully!"
echo "🚀 Your $TARGET database is ready for development."
