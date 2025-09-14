# Testing & QA Workflow

## Overview
Run lint/tests/coverage, security scans, and performance checks; prepare for UAT.

## Prerequisites
- Feature implementation complete; scaffold builds

## Steps

### Step 1: Lint & Unit/Integration Tests
Execute:
- `make lint` (stack-aware)
- `make test`
Acceptance:
- [ ] Lint clean; tests green; coverage ≥ gate

### Step 2: Security Scans
Action: Run CI security workflow or local equivalent (Trivy/dependency-check)
Acceptance:
- [ ] No critical vulns

### Step 3: Performance Checks
Action: Execute agreed perf tests; record p95 thresholds
Acceptance:
- [ ] Perf targets met

### Step 4: UAT Prep
Action: Stage build; provide test instructions/data
Acceptance:
- [ ] UAT sign-off captured

## Evidence
- CI run links; coverage badge; security and perf reports