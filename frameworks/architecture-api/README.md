# F4 — Architecture & API

## Goal
Define system boundaries, ADRs, and versioned API contracts with mocks.

## Inputs
- PRD, UX specs, NFRs (perf, availability, security)
- `dev-workflow/0-master-planner-output.md`

## Outputs
- `docs/architecture/adr/*.md`
- `docs/architecture/diagrams/*`
- `contracts/api/*`, `contracts/mocks/*`

## Tasks
1. Architecture diagram and ADRs
2. API contracts and mocks/stubs
3. Data model and migration plan
4. Performance budgets and baseline load tests

## Quality Gates
- ADR review; contract tests green; load test baseline captured