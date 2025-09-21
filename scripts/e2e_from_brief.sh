#!/usr/bin/env bash
set -euo pipefail

# e2e_from_brief.sh
# Non-interactive, stop-the-line workflow from approved brief to delivery.
# Reads configuration from workflow.config.json in the repo root unless env overrides are provided.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

CONFIG_FILE="${CONFIG_FILE:-workflow.config.json}"

read_cfg() {
  local key="$1"
  python - "$key" <<'PY'
import json,sys
cfg_path=sys.argv[1]
key=sys.argv[2]
try:
  with open(cfg_path,'r',encoding='utf-8') as f:
    cfg=json.load(f)
  v=cfg
  for part in key.split('.'):
    v=v.get(part,{}) if isinstance(v,dict) else None
  if isinstance(v,dict):
    print(json.dumps(v))
  elif v is not None:
    print(v)
except FileNotFoundError:
  pass
PY
}

NAME="${NAME:-$(read_cfg "$CONFIG_FILE" name || true)}"
INDUSTRY="${INDUSTRY:-$(read_cfg "$CONFIG_FILE" industry || true)}"
PROJECT_TYPE="${PROJECT_TYPE:-$(read_cfg "$CONFIG_FILE" project_type || true)}"
FE="${FE:-${FRONTEND:-$(read_cfg "$CONFIG_FILE" frontend || true)}}"
BE="${BE:-${BACKEND:-$(read_cfg "$CONFIG_FILE" backend || true)}}"
DB="${DB:-${DATABASE:-$(read_cfg "$CONFIG_FILE" database || true)}}"
AUTH="${AUTH:-$(read_cfg "$CONFIG_FILE" auth || true)}"
DEPLOY="${DEPLOY:-$(read_cfg "$CONFIG_FILE" deploy || true)}"
COMPLIANCE="${COMPLIANCE:-$(read_cfg "$CONFIG_FILE" compliance || true)}"

required=(NAME INDUSTRY PROJECT_TYPE FE BE DB)
for var in "${required[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "[E2E] Missing required config: $var (set env or workflow.config.json)" >&2
    exit 1
  fi
done

echo "[E2E] Bootstrap"
python scripts/doctor.py || true
./scripts/generate_client_project.py --list-templates | cat

echo "[E2E] Plan from brief"
python scripts/plan_from_brief.py "docs/briefs/${NAME}/brief.md"

echo "[E2E] Validate tasks.json"
python scripts/validate_tasks.py tasks.json

echo "[E2E] Preflight selection gate"
python scripts/select_stacks.py \
  --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" \
  --compliance "${COMPLIANCE:-}" \
  --output selection.json --summary evidence/stack-selection.md

echo "[E2E] Generator dry-run"
./scripts/generate_client_project.py \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --workers 8 --dry-run --yes

echo "[E2E] Generate"
./scripts/generate_client_project.py \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --workers 8 --yes

echo "[E2E] Sync & validate"
python scripts/sync_from_scaffold.py --plan
python scripts/sync_from_scaffold.py --apply
python scripts/validate_tasks.py tasks.json

echo "[E2E] QC metrics & gates"
python scripts/collect_coverage.py || true
python scripts/collect_perf.py || true
python scripts/scan_deps.py || true
python scripts/enforce_gates.py

echo "[E2E] Compliance docs (optional)"
python scripts/check_compliance_docs.py || true

echo "[E2E] Done. See evidence/ and selection.json"

