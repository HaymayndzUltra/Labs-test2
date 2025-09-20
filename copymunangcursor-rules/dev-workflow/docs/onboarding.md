# Onboarding: Dev-Workflow Governance Router

Purpose:

- Provide a short, actionable guide for engineers and approvers on how the Dev-Workflow Router works and how to interact with governance artifacts.

Key components recap:

- `Context Discovery` (BIOS Boot): automatic inventory of `master-rules/`, `common-rules/`, `project-rules/`, READMEs and key configs.
- `Dev-Workflow Router`: evaluates policies and precedence to choose an action; writes routing logs to `/.cursor/dev-workflow/routing_logs/`.
- `Policy DSL`: JSON policies in `/.cursor/dev-workflow/policy-dsl/` validated by `_schema/schema.json`.
- `Governance Precedence`: canonical ordering in `/.cursor/rules/master-rules/9-governance-precedence.mdc`.
- `F8 Waiver`: waive blocking security checks with an approved waiver in `/.cursor/dev-workflow/waivers/`.
- `Context Snapshot`: reproducible snapshot under `/.cursor/dev-workflow/snapshots/` used for multi-agent runs.

How to author a policy:

1. Create a JSON file in `/.cursor/dev-workflow/policy-dsl/` (not in `_schema/`).
2. Required fields: `name`, `scope`, `priority`, `actions`.
3. Optional: `conditions` (array of strings), `waiver_allowed` (boolean).
4. Run `python3 .cursor/dev-workflow/policy-dsl/lint_policy.py` or let CI lint on PR.

Waiver workflow (summary):

1. If an `F8` block is hit, open a waiver file using `waiver_template.md` and place it in `/.cursor/dev-workflow/waivers/`.
2. An approver adds an approval entry (`Decision: approved`) and CI will allow the gate to pass.

Snapshot & multi-agent runs:

- Generate a snapshot: `python3 .cursor/dev-workflow/snapshots/generate_snapshot.py`.
- The generated `snap-*.json` is required for background/parallel agent runs and should be included in the job environment.

