# Workflow Optimization System

This repository now ships with a production-ready workflow optimization engine that automates the
11-goal governance pipeline defined in the "Workflow Analysis and Enhancement Report".

## Key Components

- **Automation Engine** – Implemented in `src/workflow_optimization`. The engine loads project
  metadata, executes each quality gate, records evidence, and emits machine-readable manifests that
  can be consumed by AI agents or CI/CD runners.
- **Universal Templates** – Located in `templates/universal`. These markdown and JSON assets provide
  standardized intake forms, risk assessments, design reviews, testing matrices, and deployment
  narratives that are populated during the run.
- **Evidence Collection** – The `EvidenceManager` copies artifacts and structured data into an
  immutable evidence directory while maintaining a signed manifest for auditing.
- **Deployment Automation** – The engine produces `deployment_plan.json` and
  `deployment_plan.md`, which can be handed to the deployment script at `scripts/run_workflow_optimization.py`.

## Running the Workflow

```bash
make workflow-optimize WORKFLOW_CONFIG=workflow/workflow_config.json
```

This command executes all 11 gates. On success the run directory contains:

- `run_manifest.json` – AI consumable summary of gate outcomes.
- `evidence/evidence_manifest.json` – Inventory of cryptographically hashed evidence files.
- `deployment_plan.json` – Structured deployment instructions for downstream automation.
- `submission_pack.md` – Client-facing delivery pack.

## Configuration Structure

Configurations live in JSON and mirror the gate lifecycle:

- `project`, `governance`, `planning`, `design`, `environment`, `dry_run`, `generation`,
  `testing`, `synchronization`, `metrics`, `compliance`, `delivery`, and `automation` sections must
  be present.
- `paths` defines the output locations for run directories, evidence storage, and template lookup.
- `automation` contains shell command arrays for `checks`, `tests`, and `scans`. Commands execute
  with strong error handling and halt the workflow if any non-zero status is observed.

See `workflow/workflow_config.json` for a complete example.

## Evidence Handling

Each gate writes data to the evidence directory using deterministic filenames. Every artifact is
hashed (SHA-256) and tracked in `evidence_manifest.json`. The manifest is suitable for compliance
reporting and can be ingested by third-party governance tools.

## Deployment Pipeline

Deployment assets are generated automatically after the gates succeed. The plan combines environment
metadata from the configuration, gate summaries, and rollback procedures. The textual narrative is
rendered from `templates/universal/deployment_plan.md`, ensuring consistent executive hand-offs.

## Extensibility

- Add new gates by extending `WorkflowEngine._build_gates`.
- Integrate additional scanners by appending command definitions to the `automation` section.
- Override default directories via the `WORKFLOW_CONFIG` variable or CLI arguments to
  `scripts/run_workflow_optimization.py`.

Automated tests in `tests/test_workflow_engine.py` verify configuration loading, gate execution, and
manifest generation to maintain confidence in future enhancements.
