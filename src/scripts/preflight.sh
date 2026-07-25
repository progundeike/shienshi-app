set -euo pipefail

echo "== Backend checks =="
composer ci:local
composer audit --no-interaction

echo "== Frontend checks =="
npm ci
npm run build
npm run audit

echo "preflight passed"