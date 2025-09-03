# Background Agent Prompt: F4 — Architecture & API

## Goal
Define system boundaries, ADRs, and versioned API contracts with mocks.

## Context Package
- PRD, UX specs, NFRs (perf, availability, security)
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Architecture diagram and ADRs
2. API contracts (OpenAPI v1 preferred) and mocks/stubs
3. Data model and migration plan; baseline performance budgets

## Success Criteria
- Approved ADRs; OpenAPI v1 frozen; mocks available; perf budgets documented

## Integration Requirements
- Provide stubs/mocks to Implementation; align with Data/ML schemas

## Quality Gates
- G2: Contract Freeze — OpenAPI v1 + mocks policy approved
- ADR review sign-off; baseline load test plan defined

## Output Instructions
- PR: `docs/architecture/adr/*.md`, `docs/architecture/diagrams/*`, `contracts/api/*`, `contracts/mocks/*`
- Daily status summary (date, artifacts, risks, next)
