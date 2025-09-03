# Background Agent Prompt: F5 — Data/ML (Optional)

## Goal
Establish canonical schemas, data contracts, pipelines, and (if applicable) initial model baselines.

## Context Package
- Data sources, privacy constraints, schema drafts, DQ SLAs
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Canonical schemas and data contracts
2. ETL/ELT pipeline specs and reproducible jobs
3. Feature store or dataset definitions
4. If ML: baseline model, evaluation, and drift monitoring plan

## Success Criteria
- Validated schemas; pipelines reproducible; lineage documented

## Integration Requirements
- Provide data contracts to Architecture/Implementation; coordinate with Security on PII

## Quality Gates
- Data quality thresholds met; privacy checks; reproducibility verified

## Output Instructions
- PR to `integration`: `docs/data/schemas/*.yaml`, `docs/data/contracts/*.md`, `data/pipelines/*`, `docs/ml/*` (if applicable)
