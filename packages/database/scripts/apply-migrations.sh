#!/bin/bash

# Script to apply D1 migrations without interactive prompts

set -e

# Ensure necessary directories exist
mkdir -p migrations

# Parse arguments
TARGET=${1:-"local"} # Default to local if not specified

# Check if target is valid
if [[ "$TARGET" != "local" && "$TARGET" != "remote" ]]; then
  echo "Error: Target must be either 'local' or 'remote'"
  echo "Usage: ./apply-migrations.sh [local|remote]"
  exit 1
fi

echo "Applying migrations to $TARGET environment..."

# Apply migrations (note: may still require interactive confirmation)
npx wrangler --config ../backend/wrangler.toml d1 migrations apply ai_brainstorm --$TARGET

echo "✅ Migrations applied successfully to $TARGET environment"
