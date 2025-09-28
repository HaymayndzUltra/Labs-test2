#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${1:-}" ]]; then
  echo "Usage: $0 <workflow-config> [output-report]" >&2
  exit 1
fi

CONFIG_PATH="$(realpath "$1")"
OUTPUT_PATH="${2:-}" 

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

if [[ -n "$OUTPUT_PATH" ]]; then
  python3 -m workflow_optimizer.cli run --config "$CONFIG_PATH" --output "$OUTPUT_PATH"
else
  python3 -m workflow_optimizer.cli run --config "$CONFIG_PATH"
fi
