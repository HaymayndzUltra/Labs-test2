# F5 — Data/ML (Optional)

## Goal
Establish canonical schemas, data contracts, pipelines, and (if applicable) initial model baselines.

## Inputs
- Data sources, privacy constraints, schema drafts, DQ SLAs
- `dev-workflow/0-master-planner-output.md`

## Outputs
- `docs/data/schemas/*.yaml`
- `docs/data/contracts/*.md`
- `data/pipelines/*`
- `docs/ml/*` (if applicable)

## Tasks
1. Canonical schemas and data contracts
2. ETL/ELT pipeline specs and reproducible jobs
3. Feature store or dataset definitions
4. If ML: baseline model, evaluation, and drift monitoring plan

## Quality Gates
- Data quality thresholds met; privacy checks; reproducibility verified