#!/bin/bash
set -euo pipefail

SEED_NAME="${1:-}"

if [ -z "$SEED_NAME" ]; then
  echo "Usage: $0 <seed-name>"
  exit 1
fi

DUMP_DIR="mobile/db/seed/dumps"
OUTPUT="$DUMP_DIR/$SEED_NAME.sql"

DB_PATHS=$(find ~/Library/Developer/CoreSimulator -name "liftcoach.db" 2>/dev/null || true)

if [ -z "$DB_PATHS" ]; then
  echo "Error: no liftcoach.db found in simulator directories"
  exit 1
fi

DB_PATH=$(echo "$DB_PATHS" | xargs ls -t 2>/dev/null | head -1)

echo "Using: $DB_PATH"

sqlite3 "$DB_PATH" .dump | grep '^INSERT' | grep -v '__drizzle' > "$OUTPUT"

echo "Wrote $OUTPUT ($(wc -l < "$OUTPUT" | tr -d ' ') INSERT statements)"
