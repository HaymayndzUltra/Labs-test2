# Local Development Workflow

This guide walks through the non-interactive lifecycle that turns a client brief into a production-ready scaffold. Every step is executed inside an isolated project directory so factory assets remain untouched.

## Prerequisites

- Python 3.11+, Node.js 18+ (if the selected stack includes a frontend), Docker (for containerized checks), and Git installed locally.
- Approved brief stored at `docs/briefs/<NAME>/brief.md`.
- `workflow.config.json` populated with baseline defaults for `industry`, `project_type`, `frontend`, `backend`, and `database`. The helper scripts now layer metadata discovered in the brief (YAML frontmatter or `metadata.json`) on top of these defaults, so new projects that reuse the standard stack only need `--name`.
- Optional overrides: `AUTH`, `DEPLOY`, `COMPLIANCE`, and `NESTJS_ORM` depending on the client requirements.

> ℹ️ Use the [`Makefile`](../Makefile) `lifecycle` target for a single entrypoint once the environment variables are in place. The steps below describe what the script executes under the hood.

## Quick Bootstrap

Invoke the helper to scaffold the brief, sync `workflow.config.json`, and run the full `e2e_from_brief.sh` pipeline in one command:

```bash
# From the factory repo
NAME=portfolio-dashboard make bootstrap
# or
python3 scripts/bootstrap_project.py --name portfolio-dashboard --update-config
```

The bootstrapper reads overrides from CLI flags, environment variables, or `workflow.config.json`, ensures the brief folder exists via `scaffold_briefs.py`, then delegates to the lifecycle script. Continue with the detailed steps below when you need fine-grained control or to rerun individual stages.

## Brief Metadata

Populate `docs/briefs/<NAME>/brief.md` with YAML frontmatter (or an adjacent `metadata.json`) to describe the stack. When the metadata matches the defaults in `workflow.config.json`, supplying `--name` is sufficient because `pre_lifecycle_plan.py` and related helpers read the brief metadata automatically.

```yaml
---
name: portfolio-dashboard
industry: saas
project_type: fullstack
frontend: nextjs
backend: fastapi
database: postgres
auth: auth0
deploy: vercel
---
```

Additional keys (e.g., `compliance`, `features`, or `separate_repos`) are also merged into the runtime configuration when provided.

## Step-by-Step Lifecycle

### 0. Provision an isolated project directory

All generator outputs live outside the factory repo. The `scripts/e2e_from_brief.sh` wrapper provisions a project root before any artifacts are produced.

```bash
export NAME=acme
export INDUSTRY=enterprise
export PROJECT_TYPE=fullstack
export FE=nextjs
export BE=fastapi
export DB=postgres
export OUTPUT_ROOT="${OUTPUT_ROOT:-../_generated}"

mkdir -p "${OUTPUT_ROOT}"
PROJECT_DIR="${OUTPUT_ROOT}/${NAME}"
rm -rf "${PROJECT_DIR}" # optional; required when FORCE_OUTPUT=1
mkdir -p "${PROJECT_DIR}/evidence"
```

Set `FORCE_OUTPUT=1` (or `E2E_FORCE_OUTPUT=1`) to wipe a prior run. `scripts/e2e_from_brief.sh` performs the same provisioning automatically.

### 1. Bootstrap tooling

```bash
python scripts/doctor.py --strict || true
./scripts/generate_client_project.py --list-templates \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" | cat
```

Purpose: verify required CLIs exist and confirm template availability.

### 2. Plan from the brief

```bash
python scripts/plan_from_brief.py \
  --brief "docs/briefs/${NAME}/brief.md" \
  --out "${PROJECT_DIR}/PLAN.md"
```

Outputs `PLAN.md` and `PLAN.tasks.json` in the project directory.

### 3. Validate the task graph

```bash
python scripts/validate_tasks.py --input "${PROJECT_DIR}/PLAN.tasks.json"
```

Ensures unique IDs, valid dependency edges, and enum integrity before generation.

### 4. Preflight stack selection

```bash
python scripts/select_stacks.py \
  --industry "$INDUSTRY" \
  --project-type "$PROJECT_TYPE" \
  --frontend "$FE" \
  --backend "$BE" \
  --database "$DB" \
  --output "${PROJECT_DIR}/selection.json" \
  --summary "${PROJECT_DIR}/evidence/stack-selection.md"
```

Add `--compliance "$COMPLIANCE"` or `--nestjs-orm "$NESTJS_ORM"` when required. Exit code `3` indicates unmet engine version requirements.

### 5. Dry-run generation (no writes)

```bash
./scripts/generate_client_project.py \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" \
  --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --workers 8 --output-dir "$OUTPUT_ROOT" --yes --dry-run
```

Review the printed tree to confirm the scaffold layout.

### 6. Generate the project

```bash
./scripts/generate_client_project.py \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" \
  --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --workers 8 --output-dir "$OUTPUT_ROOT" --yes ${FORCE_OUTPUT:+--force}
```

All files are written beneath `${OUTPUT_ROOT}/${NAME}`.

### 7. Install dependencies & run tests

```bash
PROJECT_ROOT="$PROJECT_DIR" ./scripts/install_and_test.sh
```

The helper script detects which stacks were generated and executes language-appropriate installs and tests, writing logs and artifacts inside `${PROJECT_ROOT}`.

### 8. Sync tasks and revalidate

```bash
python scripts/sync_from_scaffold.py --input "${PROJECT_DIR}/PLAN.tasks.json" --root "$PROJECT_DIR"
python scripts/sync_from_scaffold.py --input "${PROJECT_DIR}/PLAN.tasks.json" --root "$PROJECT_DIR" --output "${PROJECT_DIR}/tasks.json" --apply
python scripts/validate_tasks.py --input "${PROJECT_DIR}/tasks.json"
```

Keeps the tasks DAG aligned with generated assets.

### 9. Collect metrics and enforce gates

```bash
PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_coverage.py || true
PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_perf.py || true
PROJECT_ROOT="$PROJECT_DIR" python scripts/scan_deps.py || true
PROJECT_ROOT="$PROJECT_DIR" python scripts/enforce_gates.py
```

Gate thresholds are defined in [`gates_config.yaml`](../gates_config.yaml).

### 10. Build the submission pack

```bash
PROJECT_ROOT="$PROJECT_DIR" NAME="$NAME" ./scripts/build_submission_pack.sh
```

Bundles evidence, metrics, and manifests under `${PROJECT_ROOT}/dist/` for hand-off.

### 11. Validate compliance assets

```bash
python scripts/validate_compliance_assets.py | tee "${PROJECT_DIR}/evidence/validate_compliance_assets.log"
python scripts/check_compliance_docs.py || true
```

Ensures compliance controls match generated code and documentation. See the [Compliance & Evidence Guide](COMPLIANCE_EVIDENCE.md) for expectations and remediation tips.

## Convenience Wrapper

To run the entire sequence non-interactively:

```bash
NAME=$NAME INDUSTRY=$INDUSTRY PROJECT_TYPE=$PROJECT_TYPE \
FE=$FE BE=$BE DB=$DB OUTPUT_ROOT=$OUTPUT_ROOT \
make lifecycle
```

The Make target invokes `scripts/e2e_from_brief.sh`, which performs every step listed above and prints the location of the generated project on completion.

## Next Steps

- Follow the [Deployment Guide](DEPLOYMENT.md) to promote builds through staging and production.
- Monitor pipelines using the [CI/CD Overview](CI_CD_OVERVIEW.md).
- Maintain audit artifacts as described in the [Compliance & Evidence Guide](COMPLIANCE_EVIDENCE.md).
