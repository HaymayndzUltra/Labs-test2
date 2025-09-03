# Background Agent Prompt: F6 — Implementation (FE)

## Goal
Implement FE components/pages wired to tokens and API contracts with accessibility and performance budgets.

## Context Package
- Tokens v1, component specs
- OpenAPI v1 + mocks; ADRs; PRD acceptance criteria

## Tasks & Deliverables
1. Components/pages and integration logic
2. A11y (WCAG 2.2 AA) and perf checks
3. Unit/integration tests; feature flags where needed

## Success Criteria
- Meets acceptance criteria; a11y/perf smoke green; tests ≥ 80% coverage

## Integration Requirements
- Align with QA test plans; respect contract/mocks from F4

## Quality Gates
- Contract tests green against OpenAPI v1
- A11y/perf smoke pass; coverage ≥ 80%; static analysis clean

## Output Instructions
- PR to `integration` with FE changes and test results
- Daily status summary (date, artifacts, risks, next)
