# Design Tokens — Versioning & Freeze Policy

## Purpose
Provide a stable, versioned source of truth for core and semantic design tokens consumed by frontend and documentation tooling.

## Artifacts
- Core tokens: `design/tokens/core.json`
- Semantic tokens: `design/tokens/semantic.json`
- Schema (canonical): `docs/data/schemas/tokens-schema.yaml`
- Data contract: `docs/data/contracts/design-tokens-contract.md`
- Pipeline: `data/pipelines/tokens_sync.py` → `data/pipelines/out/tokens.json`

## Versioning
- Semantic Versioning (`MAJOR.MINOR.PATCH`)
  - MAJOR: Breaking changes to token names/structure or removals
  - MINOR: Additive, non-breaking tokens or new roles
  - PATCH: Corrections that do not alter meaning (spelling, comments)
- API alignment: Breaking token changes require a corresponding API major version if surfaced by endpoints (see `contracts/api/openapi.yaml`).

## Freeze Policy
- A “freeze” pins the token set for downstream consumers (Storybook/theme builder, API mocks, docs).
- During a freeze window, only bug fixes (PATCH) are allowed; MINOR/MAJOR changes are deferred.
- Freeze is recorded by commit SHA(s) of `core.json` and `semantic.json` and date/time in `docs/dev-workflow/master-readiness-report.md`.

## Change Request Process
1) Open a PR modifying `design/tokens/*.json` following the schema in `docs/data/schemas/tokens-schema.yaml`.
2) Update any affected specs/docs (e.g., `design/specs/*.md`) and mocks if payloads change.
3) Run the pipeline locally if applicable (`data/pipelines/tokens_sync.py`) and ensure CI passes.
4) Approvals required: UX Lead + Engineering Lead.
5) If breaking, propose version bump plan and communicate to consumers.

## CI & Quality Gates
- OpenAPI is validated/linted in CI; Lighthouse CI enforces accessibility/performance for staging.
- Data contract and schema define expected structure and data quality thresholds.
- Policy-as-code (OPA/Conftest) enforces minimum governance checks across configs.

## Ownership
- UX Lead: Token semantics and roles
- Engineering Lead: Integration quality and contract alignment
- QA: Coverage across critical states and accessibility