# Background Agent Prompt: F6 — Implementation (BE)

## Goal
Implement BE endpoints/handlers and integrate with data/services per OpenAPI v1.

## Context Package
- OpenAPI v1 + mocks; ADRs; PRD acceptance
- Data schemas (if applicable)

## Tasks & Deliverables
1. Handlers/services; validation; error handling
2. Unit/integration tests; contract tests
3. Observability hooks; feature flags

## Success Criteria
- Contract tests green; p95 latency budget respected (baseline)

## Integration Requirements
- Coordinate with QA for contract suites; Security for SBOM/secrets

## Quality Gates
- Contract tests pass; coverage ≥ 80%; static analysis; security checks

## Output Instructions
- PR to `integration` with BE changes and test results
- Daily status summary (date, artifacts, risks, next)
