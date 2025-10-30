#!/usr/bin/env bash
set -euo pipefail

echo "entrypoint-prod: running migrations (if DATABASE_URL set) and starting app"

if [[ -n "${DATABASE_URL:-}" && ${DATABASE_URL} == postgresql:* ]]; then
  echo "Detected Postgres DATABASE_URL — running 'npx prisma migrate deploy'"
  # run migrate deploy (non-interactive) — failures should stop the container
  npx prisma migrate deploy
else
  echo "No Postgres DATABASE_URL detected or using SQLite — skipping migrate deploy"
fi

exec "$@"
