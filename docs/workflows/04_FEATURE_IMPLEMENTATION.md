---
title: "Phase 04: Feature Implementation"
phase: 4
triggers: ["phase-04","implement","development","tasks"]
scope: "project-rules"
inputs: ["PRD","Architecture","Generated scaffold"]
outputs: ["Feature code","Validated integrations","Tests"]
artifacts: ["pull-requests/*","reports/tests/*.xml"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Feature Owner"
---

# Feature Implementation Workflow

## Overview
Implement prioritized features with validations, robust error handling, integrations, observability, and tests.

## Prerequisites
- Approved PRD/architecture; scaffold generated

## Steps

### Step 1: Task Selection
Action: Use `.cursor/dev-workflow/3-process-tasks.md`; select the next parent task
Acceptance:
- [ ] Selected task scope confirmed

### Step 2: Implement Feature
Action: Code changes per task; follow rules (rest-api/open-api/observability/performance)
Acceptance:
- [ ] Feature meets DOD; no lint errors

### Step 3: Validations & Errors
Action: Add input validation and robust error handling
Acceptance:
- [ ] Validation and error paths tested

### Step 4: Integrations
Action: Configure and test third-party services (if needed)
Acceptance:
- [ ] Integration endpoints/tests pass

### Step 5: Tests
Action: Unit + integration tests added
Acceptance:
- [ ] Coverage ≥ target

## Evidence
- Commit/PR links
- Test reports
- Screenshots/logs

## Failure Modes & Troubleshooting
- Lint/test failures → run make lint/test; fix violations
- Integration secrets missing → configure env and re-run

## Overall Acceptance
- [ ] Code review approved; QA pass
- [ ] Gates satisfied (coverage ≥ 80%, 0 critical vulns, p95 ≤ 500ms)
- [ ] Related Phases: 03 (inputs), 05 (validation)

---

Variables
- PROJ=<project-key>

Run Commands
```
# Lint + tests before PR
make lint || true
make test || true

# (Optional) scripts-only checks
python3 -m bandit -r scripts/ -f json | tee security/bandit.json || true
```

Generated/Updated Files
- pull-requests/* (PR with feature changes)
- reports/tests/* (coverage/test outputs if configured)
- security/bandit.json (optional)

Gate to Phase 05
- [ ] DOD met; no lint errors
- [ ] Validation and error paths tested
- [ ] Integrations pass tests
- [ ] Coverage meets target