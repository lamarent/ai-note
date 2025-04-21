#!/bin/bash

# Script to apply D1 migrations without interactive prompts

set -e

# Resolve directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$(cd "$DB_PACKAGE_DIR/../backend" && pwd)"
MIGRATIONS_DIR="$DB_PACKAGE_DIR/migrations"

# Ensure migrations directory exists
mkdir -p "$MIGRATIONS_DIR"

# Parse arguments
TARGET=$1
if [ -z "$TARGET" ]; then
  echo "Usage: ./apply-migrations.sh [local|remote]"
  exit 1
fi

# Check if target is valid
if [[ "$TARGET" != "local" && "$TARGET" != "remote" ]]; then
  echo "Error: Target must be either 'local' or 'remote'"
  echo "Usage: ./apply-migrations.sh [local|remote]"
  exit 1
fi

echo "Applying migrations to $TARGET environment..."

WRANGLER_CONFIG="$BACKEND_DIR/wrangler.toml"

if [ "$TARGET" == "local" ]; then
  echo "Applying migrations locally..."
  npx wrangler --config $WRANGLER_CONFIG d1 migrations apply ai_brainstorm --local
elif [ "$TARGET" == "remote" ]; then
  echo "Applying migrations to remote..."
  npx wrangler --config $WRANGLER_CONFIG d1 migrations apply ai_brainstorm --remote
else
  echo "Unknown target: $TARGET"
  exit 1
fi

echo "✅ Migrations applied successfully to $TARGET environment"
