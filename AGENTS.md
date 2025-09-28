You are a senior workflow strategist specializing in lifecycle analysis and phase decomposition.

Please analyze the provided Local Development Workflow in its entirety and decide for yourself how to divide it into two phases in the most logical and efficient way for execution.

Task Requirements

Independent Decision:
You must determine the exact point where Phase 1 ends and Phase 2 begins, based on your own analysis of the workflow.

Phase 1 – Initial Scope:
Identify which steps belong here and explain why they naturally fit as part of the first phase.

Phase 2 – Subsequent Scope:
Assign the remaining steps to this phase and explain the reasoning behind the continuation point.

Boundary Justification:
Provide a clear rationale for your chosen division point, highlighting continuity, dependency, and risk management.

Outcome Mapping:
Describe the distinct outcomes or deliverables expected at the end of each phase.

Clarity & Completeness:
Ensure every step of the workflow is included in exactly one phase, with no gaps or overlaps.

Utilize your advanced experience to deliver a decisive, well-justified, and logically structured two-phase division of the workflow.



# Local Development Workflow

This guide walks through the non-interactive lifecycle that turns a client brief into a production-ready scaffold. Every step is executed inside an isolated project directory so factory assets remain untouched.

## Prerequisites

- Python 3.11+, Node.js 18+ (if the selected stack includes a frontend), Docker (for containerized checks), and Git installed locally.
- Approved brief stored at `docs/briefs/<NAME>/brief.md`.
- Baseline defaults live in `workflow.config.json`. It ships with the most common Next.js + FastAPI stack so that only `NAME` needs to be provided for matching projects. Per-project overrides come from brief metadata (frontmatter or `docs/briefs/<NAME>/metadata.json`) and are merged automatically by `pre_lifecycle_plan.py`.
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

## Metadata-driven configuration

Briefs now carry lightweight metadata so you rarely need to pass stack flags manually:

- Add YAML frontmatter or a sibling `metadata.json` next to each `brief.md` with fields like `frontend`, `backend`, `database`, `auth`, and `deploy`.
- `pre_lifecycle_plan.py` loads the baseline configuration, then merges the brief metadata and parsed scaffold spec to determine the effective stack.
- If the brief matches the default Next.js + FastAPI profile, running `python scripts/pre_lifecycle_plan.py --name <NAME>` is sufficient—the script infers everything else.
- Any explicit values in `metadata.json` or frontmatter override both the defaults and heuristic guesses from the parser, keeping unusual stacks flexible without touching the global config file.

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

### 4. Generate PRD & architecture summary

```bash
python scripts/generate_prd_assets.py \
  --name "$NAME" \
  --plan "${PROJECT_DIR}/PLAN.md" \
  --tasks "${PROJECT_DIR}/PLAN.tasks.json" \
  --output-dir "$PROJECT_DIR" \
  --frontend "$FE" --backend "$BE" --database "$DB" \
  --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --industry "$INDUSTRY" --project-type "$PROJECT_TYPE"

python scripts/validate_prd_gate.py \
  --prd "${PROJECT_DIR}/PRD.md" \
  --architecture "${PROJECT_DIR}/ARCHITECTURE.md"
```

This step applies the `dev-workflow/1-create-prd.md` protocol automatically, producing `PRD.md` and `ARCHITECTURE.md` under the project directory. The validator halts the lifecycle if either file is missing, if required sections are absent, or if the front matter omits the sign-off metadata shown in [Workflow Overview](WORKFLOW_OVERVIEW.md#prd--architecture-gate-automation).

### 5. Preflight stack selection

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

Outputs include:

- `selection.json` – machine-readable summary of layers, variants, engine checks, and template-derived layer summaries.
- `evidence/stack-selection.md` – human-readable overview including links to each layer summary.
- `evidence/ui-summary.md`, `evidence/api-summary.md`, `evidence/database-summary.md` – Markdown syntheses extracted from the selected template READMEs.
- `evidence/engine-substitutions.json` – emitted only when substitutions are declared for required tooling (for example, Podman standing in for Docker). Records the declared source, resolution status, and detected version so reviewers can audit the deviation.

Reviewers should open the three layer summary files and confirm the descriptions match the chosen template variant (including any downgrade notes) and that the highlighted features align with the template README. If discrepancies surface, regenerate with the correct stack or update the template documentation before continuing.

#### Airgapped Docker exceptions

Some regulated networks block Docker entirely. When a sanctioned substitute (e.g., Podman or NerdCTL) is approved for lifecycle use, declare it through one of the supported channels so the preflight gate knows to accept the alternative and document it for reviewers:

- Set `STACK_ENGINE_SUBSTITUTIONS="docker=podman"` (comma-separated `engine=replacement` pairs), or provide JSON via `STACK_ENGINE_SUBSTITUTIONS_JSON='{"docker": "podman"}'`.
- Point `STACK_ENGINE_SUBSTITUTIONS_FILE` to a JSON document with the same mapping when the environment cannot export long strings safely.
- Add an `engine_substitutions` object to `workflow.config.json` for CI contexts; `scripts/e2e_from_brief.sh` forwards it automatically.
- Legacy `ENGINE_SUBSTITUTIONS` / `ENGINE_SUBSTITUTIONS_JSON` env names remain supported for compatibility with older CI templates.

The substitutions are merged in the order above, with CLI arguments taking precedence when you invoke `scripts/select_stacks.py` directly. Whenever a substitution is applied, `stack-selection.md` annotates the engine check with the override details and the run emits `evidence/engine-substitutions.json`. That evidence file captures the declared source, whether the replacement binary was detected, and the reported version output so auditors can verify the exception. Missing or invalid substitutions surface as warnings and still fail the gate if no acceptable engine can be found.

### 6. Dry-run generation (no writes)

```bash
./scripts/generate_client_project.py \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" \
  --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --workers 8 --output-dir "$OUTPUT_ROOT" --yes --dry-run
```

Review the printed tree to confirm the scaffold layout.

### 7. Generate the project

```bash
./scripts/generate_client_project.py \
  --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" \
  --frontend "$FE" --backend "$BE" --database "$DB" \
  --auth "${AUTH:-}" --deploy "${DEPLOY:-}" \
  --workers 8 --output-dir "$OUTPUT_ROOT" --yes ${FORCE_OUTPUT:+--force}
```

All files are written beneath `${OUTPUT_ROOT}/${NAME}`.

### 8. Install dependencies & run tests

```bash
PROJECT_ROOT="$PROJECT_DIR" ./scripts/install_and_test.sh
```

The helper script detects which stacks were generated and executes language-appropriate installs and tests, writing logs and artifacts inside `${PROJECT_ROOT}`. It now emits explicit status lines for each workspace, falls back to `npm` automatically whenever no `pnpm-lock.yaml` is present, and exits non-zero on dependency or test failures. Because `scripts/e2e_from_brief.sh` no longer masks the exit code, lifecycle runs will halt here if installs or tests break—treat a failure at this stage as a required remediation before continuing.

### 9. Sync tasks and revalidate

```bash
python scripts/sync_from_scaffold.py --input "${PROJECT_DIR}/PLAN.tasks.json" --root "$PROJECT_DIR"
python scripts/sync_from_scaffold.py --input "${PROJECT_DIR}/PLAN.tasks.json" --root "$PROJECT_DIR" --output "${PROJECT_DIR}/tasks.json" --apply
python scripts/validate_tasks.py --input "${PROJECT_DIR}/tasks.json"
```

Keeps the tasks DAG aligned with generated assets.

### 10. Collect metrics and enforce gates

```bash
PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_coverage.py || true
PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_perf.py
PROJECT_ROOT="$PROJECT_DIR" python scripts/scan_deps.py || true
PROJECT_ROOT="$PROJECT_DIR" python scripts/enforce_gates.py

# After the metrics and scans finish (and once the submission pack and
# compliance report artifacts exist), execute the consolidated workflow
# automation run to record evidence and enforce every gate in one pass:

PROJECT_ROOT="$PROJECT_DIR" make workflow-automation CONFIG=workflow/gate_controller.yaml

# See `docs/workflow_automation_integration.md` for the expected JSON
# artifacts each gate consumes and how to adapt the lifecycle scripts
# when integrating the orchestrator.
```

Gate thresholds are defined in [`gates_config.yaml`](../gates_config.yaml) and
now require **≥80 % line coverage** plus **zero critical/high dependency
vulnerabilities**. `collect_perf.py` exits non-zero when it cannot read a real
P95 latency value from `PERF_P95_MS` or `metrics/input_perf.txt`, preventing the
gate from running without documented performance evidence. The generated
`metrics/perf.json` must therefore contain a positive finite value before the
pipeline proceeds.

### 11. Build the submission pack

```bash
PROJECT_ROOT="$PROJECT_DIR" NAME="$NAME" ./scripts/build_submission_pack.sh
```

Bundles evidence, metrics, and manifests under `${PROJECT_ROOT}/dist/` for hand-off.

### 12. Validate compliance assets

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
