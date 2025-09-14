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
- Commit/PR, test reports, screenshots/logs

## Overall Acceptance
- [ ] Code review approved; QA pass