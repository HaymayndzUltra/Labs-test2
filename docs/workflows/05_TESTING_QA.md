---
title: "Phase 05: Testing & QA"
phase: 5
triggers: ["phase-05","test","qa","coverage","security","performance"]
scope: "project-rules"
inputs: ["Implemented features from Phase 04"]
outputs: ["Test results","Coverage report","Security & perf reports","UAT package"]
artifacts: ["reports/coverage.xml","reports/security.json","reports/perf.json"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "QA Lead"
---

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

## Failure Modes & Troubleshooting
- Flaky tests → rerun with seeds; stabilize timing; isolate network
- Coverage shortfall → add missing unit tests; focus on critical paths

## Overall Acceptance
- [ ] Coverage ≥ 80%
- [ ] 0 critical vulnerabilities
- [ ] Perf p95 ≤ 500ms
- [ ] UAT sign-off by Product/QA
- [ ] Related Phases: 04 (inputs), 06 (deployment gate)