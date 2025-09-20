Title: Add governance router, policy DSL, waiver flow, snapshots, CI checks, and docs

Summary:

- Adds a Dev-Workflow Router stub that evaluates policy DSL and emits explainable routing logs.
- Introduces a Policy DSL schema and linter, with a default policy.
- Adds governance precedence rule (`9-governance-precedence.mdc`).
- Implements F8 waiver template and CI waiver checker, plus a sample approved waiver for CI tests.
- Adds context snapshot generator and snapshot checks for multi-agent runs.
- Adds CI gate entries and scripts: policy_dsl_lint, routing_log_check, f8_waiver_check, context_snapshot_check.
- Adds simulation test and docs: onboarding and retention/security guidance.

Testing:

- Ran `rule_hygiene.py` (280 files, 0 errors).
- Executed policy linter and routing log checks (with fallback checks when jsonschema unavailable).
- Generated a snapshot and created a routing log sample.

Notes:

- The router is a stub; production routing logic should extend `router.py` to parse conditions and integrate with CI runtime.
- The policy DSL schema is stored under `_schema/` to avoid being linted as a policy.

