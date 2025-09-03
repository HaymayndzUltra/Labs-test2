# Background Agent Prompt: F4 — Architecture & API

## Goal
Define system boundaries, ADRs, and versioned API contracts with mocks.

## Context Package
- PRD, UX specs, NFRs (perf, availability, security)
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Architecture diagram and ADRs
2. API contracts (OpenAPI/GraphQL/gRPC) and mocks/stubs
3. Data model and migration plan
4. Performance budgets and baseline load tests

## Success Criteria
- Approved ADRs; versioned API contracts; baseline performance recorded

## Integration Requirements
- Provide stubs/mocks to Implementation; align with Data/ML schemas

## Quality Gates
- ADR review; contract tests green; load test baseline captured

## Output Instructions
- PR to `integration`: `docs/architecture/adr/*.md`, `docs/architecture/diagrams/*`, `contracts/api/*`, `contracts/mocks/*`
