#!/usr/bin/env bash
set -euo pipefail

ROOT=".cursor/rules"
missing=0
if [[ ! -d "$ROOT" ]]; then
  echo "No rules directory found at $ROOT" >&2
  exit 1
fi

echo "Checking rule files under $ROOT"
while IFS= read -r -d '' f; do
  head=$(sed -n '1,40p' "$f" || true)
  if ! echo "$head" | grep -q "^---" || ! echo "$head" | grep -q "description:" || ! echo "$head" | grep -q "alwaysApply:"; then
    echo "[RULE-ERROR] $f: missing required YAML frontmatter keys (description, alwaysApply)"
    missing=1
  fi
done < <(find "$ROOT" -type f -name "*.mdc" -print0)

if [[ "$missing" -ne 0 ]]; then
  echo "Rule validation failed"
  exit 2
fi

echo "Rule validation passed"
exit 0

