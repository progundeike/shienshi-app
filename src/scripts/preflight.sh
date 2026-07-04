set -euo pipefail

echo "== Backend checks =="
composer ci:local
composer audit --no-interaction

echo "== Frontend checks =="
npm ci
npm run build
npm audit --audit-level=high

echo "preflight passed"