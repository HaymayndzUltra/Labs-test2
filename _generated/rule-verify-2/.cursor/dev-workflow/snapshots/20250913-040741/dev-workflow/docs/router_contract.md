# Dev Workflow Router Contract

Key points:

- `9-governance-precedence.mdc` is the canonical precedence file; the router MUST load and apply it before decision logic.
- Policies live in `/.cursor/dev-workflow/policy-dsl/*.json` and are validated against `_schema/schema.json`.
- Router must emit routing logs to `/.cursor/dev-workflow/routing_logs/*.json` following `schemas/routing_log.json`.
- Critical `F8` blocks require a waiver under `/.cursor/dev-workflow/waivers/` with approval recorded.
- Multi-agent runs MUST start from a generated snapshot in `/.cursor/dev-workflow/snapshots/`.

