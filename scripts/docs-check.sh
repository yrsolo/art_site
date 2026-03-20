#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

test -f README.md
test -f docs/README.md
test -f apps/web/package.json
test -f work/now/current-task.md
echo "docs-check: basic repository docs are present"
