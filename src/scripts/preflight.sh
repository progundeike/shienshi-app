set -euo pipefail

echo "== Backend checks =="
composer ci:local

echo "== Frontend checks =="
npm ci
npm run build

echo "preflight passed"