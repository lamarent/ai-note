#!/bin/bash
set -e

# This script handles database setup and migrations for production deployment

echo "Starting database deployment process..."

# Create the D1 database if it doesn't exist
if ! wrangler d1 list | grep -q "ai_brainstorm"; then
  echo "Creating D1 database 'ai_brainstorm'..."
  wrangler d1 create ai_brainstorm
  echo "Database created successfully!"
else
  echo "D1 database 'ai_brainstorm' already exists."
fi

# Get the actual database ID from the local config
DB_ID=$(wrangler d1 list --json | jq -r '.[] | select(.name=="ai_brainstorm") | .uuid')
echo "Using database ID: $DB_ID"

# Update the wrangler.toml file with the correct database ID if needed
if grep -q "ai_brainstorm_db" ./packages/backend/wrangler.toml; then
  echo "Updating wrangler.toml with correct database ID..."
  sed -i.bak "s/ai_brainstorm_db/$DB_ID/g" ./packages/backend/wrangler.toml
  rm ./packages/backend/wrangler.toml.bak
fi

# Apply migrations
echo "Applying database migrations..."
wrangler d1 migrations apply ai_brainstorm --local

echo "Database deployment completed successfully!"
