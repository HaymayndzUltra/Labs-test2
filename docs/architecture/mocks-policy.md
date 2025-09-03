# Mocks Policy

## Purpose
Establish a consistent, safe, and versioned approach for HTTP response mocks used during architecture and implementation phases.

## Scope
- Applies to API mocks stored under `contracts/mocks/*`.
- Mocks must reflect the canonical contract defined in `contracts/api/openapi.yaml`.
- Intended for local development, contract testing, Storybook/demo, and CI smoke checks.

## Sources of Truth
- Primary: `contracts/api/openapi.yaml` (OpenAPI v1+)
- Secondary: Data contracts under `docs/data/contracts/*` and schemas under `docs/data/schemas/*` (when mocks represent data payloads)

## Update Policy & Cadence
- Create/update mocks in the same PR that changes the corresponding OpenAPI path/schema.
- On any contract change, update the relevant mock(s) and ensure they remain valid against the updated schema.
- Keep at least one happy-path mock per endpoint/major variant; add error-path mocks for critical flows.

## Naming & Location
- Path: `contracts/mocks/`
- File naming: `<resource>[-variant].json` (e.g., `health.json`, `tokens.json`, `tokens-403.json`)
- Content: Minimal representative payload matching schema, no secrets/PII.

## Validation
- CI validates OpenAPI (swagger-cli) and lints it (Redocly).
- Mocks must be syntactically valid JSON; where applicable, validated via contract/e2e tests.

## Versioning & Freeze
- When declaring a contract freeze (e.g., for a release), include mock set completeness as part of the freeze checklist.
- Breaking changes require updating mocks and bumping API version as per ADR/policy.

## Ownership & Review
- Owners: Architecture (definition), QA (coverage), Eng Lead (approval).
- Reviews ensure alignment with the latest contract and critical user flows.

## CI & Local Usage
- CI may serve or reference mocks for smoke tests and documentation previews.
- Local dev may use mocks to simulate downstream services until implementations are ready.