#!/bin/bash
set -euo pipefail

SEED_NAME="${1:-}"

if [ -z "$SEED_NAME" ]; then
  echo "Usage: $0 <seed-name>"
  exit 1
fi

DUMP_DIR="mobile/db/seed/dumps"
SEED_FILE="$DUMP_DIR/$SEED_NAME.sql"

if [ ! -f "$SEED_FILE" ]; then
  echo "Error: seed file not found: $SEED_FILE"
  echo "Available seeds:"
  ls "$DUMP_DIR"/*.sql 2>/dev/null | xargs -I{} basename {} .sql || echo "  (none)"
  exit 1
fi

DB_PATHS=$(find ~/Library/Developer/CoreSimulator -name "liftcoach.db" 2>/dev/null || true)

if [ -z "$DB_PATHS" ]; then
  echo "Error: no liftcoach.db found in simulator directories"
  exit 1
fi

DB_PATH=$(echo "$DB_PATHS" | xargs ls -t 2>/dev/null | head -1)

echo "Target DB: $DB_PATH"
echo "Seed: $SEED_FILE"

TABLES=$(sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '__drizzle%' AND name NOT LIKE 'sqlite_%';")

for TABLE in $TABLES; do
  sqlite3 "$DB_PATH" "DELETE FROM $TABLE;"
done

sqlite3 "$DB_PATH" < "$SEED_FILE"

echo "Loaded $(wc -l < "$SEED_FILE" | tr -d ' ') statements"
echo "Restart the app to pick up changes"
