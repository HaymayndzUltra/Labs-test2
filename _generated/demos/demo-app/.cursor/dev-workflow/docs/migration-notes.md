# AI Governor Migration Notes

## Scope
Guidance for policy authors and integrators following recent governance updates.

## Key Changes
- Actions vocabulary: `actions` is now an array of strings (controlled verbs), e.g., `require:tokens_v1`, `require:interaction_specs`, `require:openapi_v1`.
- Precedence-aware policies: Optional `precedence_tag` guides tie-breaks aligned with `master-rules/9-governance-precedence.mdc`.
- Context tokens: Standardized tokens normalized to lower-case: `framework:<name>`, `contracts-first`, `risk:<low|med|high>`, `stage:<plan|impl|qa|release>`.
- Routing logs: Validator enforces non-empty strings for `decision` and `winning_rule`, and array of non-empty strings for `rules_considered`.

## Authoring Policies
- Schema: `/.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- Minimum fields: `name`, `scope`, `priority`, `actions[]`
- Optional fields: `conditions[]`, `waiver_allowed`, `precedence_tag`
- Example:
```json
{
  "name": "fw-react-plan-first",
  "scope": "framework:react",
  "priority": 80,
  "conditions": ["framework:react", "contracts-first"],
  "actions": ["require:tokens_v1", "require:interaction_specs"],
  "precedence_tag": "router"
}
```

## Advisory Mode (Rollout)
- During burn-in, set env `GOVERNOR_ADVISORY_MODE=true` to emit warnings without failing CI.
- After 1–2 cycles, unset the flag to enforce blocking.

## Checklist for Repos
- [ ] Align policy files to new actions array form
- [ ] Add `precedence_tag` where tie-break clarity is needed
- [ ] Ensure context tokens used in `conditions[]` follow the standard vocabulary
- [ ] Verify routing logs pass validator
- [ ] Confirm `run_all_gates.py` passes locally

## Support
Open issues or PRs with examples of policies needing migration assistance.