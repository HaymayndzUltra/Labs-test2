#!/usr/bin/env bash
set -euo pipefail

echo "Smoke: verifying expected files exist and paths are stable"
paths=(
  "/workspace/shared/templates/pic-skeleton.md"
  "/workspace/shared/templates/handoff-message.md"
  "/workspace/.cursor/rules/security-compliance-overlay.mdc"
  "/workspace/.cursor/rules/project-rules/discovery/pic.mdc"
  "/workspace/.cursor/rules/project-rules/planning/pic.mdc"
  "/workspace/.cursor/rules/project-rules/ux-ui/pic.mdc"
  "/workspace/.cursor/rules/project-rules/architecture/pic.mdc"
  "/workspace/.cursor/rules/project-rules/data-ml/pic.mdc"
  "/workspace/.cursor/rules/project-rules/implementation-fe/pic.mdc"
  "/workspace/.cursor/rules/project-rules/implementation-be/pic.mdc"
  "/workspace/.cursor/rules/project-rules/qa/pic.mdc"
  "/workspace/.cursor/rules/project-rules/release/pic.mdc"
  "/workspace/.cursor/rules/project-rules/observability/pic.mdc"
)

for p in "${paths[@]}"; do
  if [ ! -f "$p" ]; then
    echo "Missing: $p" >&2
    exit 1
  fi
done

echo "OK: all required files present"

