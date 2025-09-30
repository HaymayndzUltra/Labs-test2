# Phase 3 · Foundations & Quality Rails Guide

## Purpose & Role
Build the guardrails that make execution predictable. Serve as the **AI Quality Systems Architect** establishing security, performance, accessibility, analytics, testing, and CI/CD enforcement before feature development proceeds.

## Required Inputs
- Phase 2 artefacts (architecture folder, backlog, contracts, CI skeleton).
- Approved quality targets and non-functional requirements from the PRD.
- Access to CI configuration and metrics pipelines.

## Expected Outputs
- `security/Security_Checklist.md` with ASVS mapping and threat model draft.
- Performance budgets stored in `metrics/perf/budgets.json` and documented Lighthouse targets.
- `a11y/A11y_Test_Plan.md` describing WCAG 2.2 AA coverage.
- `analytics/Analytics_Spec.xlsx` (or `.md`) detailing events, schemas, and retention.
- `feature-flags/Feature_Flags.md` outlining flag lifecycle, naming, and kill-switch rules.
- `quality/Test_Plan.md` with pyramid strategy and coverage thresholds.
- `docs/Code_Review_Checklist.md` plus branch protection policy.
- Updated CI workflows enforcing lint, type, unit, accessibility, security, and performance gates.

## Automation Hooks
1. Execute lifecycle quality scripts:
   ```bash
   PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_coverage.py || true
   PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_perf.py
   PROJECT_ROOT="$PROJECT_DIR" python scripts/scan_deps.py || true
   PROJECT_ROOT="$PROJECT_DIR" python scripts/enforce_gates.py
   ```
2. Generate baseline Lighthouse budgets:
   ```bash
   PROJECT_ROOT="$PROJECT_DIR" python scripts/generate_lighthouse_budget.py --out "${PROJECT_DIR}/metrics/perf/budgets.json"
   ```
3. Seed analytics and feature flag templates:
   ```bash
   python scripts/bootstrap_feature_flags.py --out "${PROJECT_DIR}/feature-flags/Feature_Flags.md"
   python scripts/bootstrap_analytics.py --out "${PROJECT_DIR}/analytics/Analytics_Spec.md"
   ```
4. Configure CI protections:
   ```bash
   python scripts/configure_branch_protection.py --repo "$REPO" --min-approvals 2 --require-status-checks
   ```
   > When automation cannot reach the VCS API, export a manual checklist and request a human maintainer to apply the settings.

## Step-by-Step Checklist
1. **Security by Design**
   - Map PRD requirements to ASVS controls and record in `Security_Checklist.md`.
   - Draft a context-specific threat model referencing architecture diagrams.
   - Define secrets management process; flag manual vault updates in the risk register.
2. **Performance & Accessibility Targets**
   - Establish budgets for key pages/components and capture baseline metrics.
   - Create `a11y/A11y_Test_Plan.md` with tooling (axe, pa11y) and manual checkpoints.
3. **Analytics & Feature Flags**
   - Document event taxonomy, payload schemas, privacy tags, and retention.
   - Define default, rollout, and kill criteria for every flag plus observability hooks.
4. **Testing Strategy**
   - Populate `quality/Test_Plan.md` with pyramid coverage, target frameworks, and required fixtures.
   - Set coverage thresholds (≥80% lines) and integrate with CI via `gates_config.yaml`.
5. **CI/CD Gates & Code Review**
   - Update CI workflows to run lint, type-check, unit tests, dependency scans, Lighthouse budgets, and accessibility smoke.
   - Publish `docs/Code_Review_Checklist.md` and branch protection summary.
6. **Validation Run**
   - Execute `make workflow-automation CONFIG=workflow/gate_controller.yaml` to ensure all gates pass with evidence stored under `${PROJECT_DIR}/evidence`.

## Quality Gates
- ✅ CI pipeline fails on lint, type, or test regressions.
- ✅ Coverage meets or exceeds target or documented risk acceptance.
- ✅ Security, performance, and accessibility scans embedded in CI with evidence.
- ✅ Feature flag framework deployed and verified with a sample flag.
- ✅ Analytics schema approved by product/data stakeholders.

## Handoff to Phase 4
Share the security checklist, budgets, test plan, and CI configuration summary. Confirm that feature teams acknowledge the guardrails and know how to request exceptions.
