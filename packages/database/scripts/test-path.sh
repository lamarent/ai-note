#!/bin/bash

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Current working directory: $(pwd)"
echo "Script directory: $SCRIPT_DIR"
echo "Parent directory: $PARENT_DIR"

echo "Contents of scripts directory:"
ls -la "$SCRIPT_DIR"

# Test directory change
cd "$PARENT_DIR"
echo "Changed directory to: $(pwd)"

# Test running another script
echo "Running seed script from package.json:"
npm run seed:local -- --help 2>&1 || echo "Failed to run seed:local script"
