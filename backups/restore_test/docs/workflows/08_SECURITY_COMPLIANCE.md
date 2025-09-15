---
title: "Phase 08: Security & Compliance"
phase: 8
triggers: ["phase-08","compliance","security","audit","gates"]
scope: "project-rules"
inputs: ["Generated project context","Rules/validation tools available"]
outputs: ["Compliance checklist","Gates config snapshot"]
artifacts: [".cursor/tools/check_compliance.py","gates_config.yaml"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Security Lead"
---

## Prerequisites
- Generated project context available
- Validation tools present (.cursor/tools/*)

# Security & Compliance Workflow

## Overview
Validate compliance rules presence, enforce security controls, and ensure CI gates are configured per industry.

## Steps

### Step 1: Rules Presence
Execute:
- `python .cursor/tools/check_compliance.py` (in generated project)
Acceptance:
- [ ] Required compliance rules present

### Step 2: Controls Validation
Action: Confirm encryption at rest/in transit, RBAC, audit logging, session timeout
Acceptance:
- [ ] Controls documented and mapped

### Step 3: CI Gates
Action: Review `gates_config.yaml` and security scans
Acceptance:
- [ ] Gates enabled and thresholds set

## Evidence
- Compliance checklist; gates config snapshot

## Failure Modes & Troubleshooting
- Missing controls → add/verify encryption, RBAC, audit logging, session timeout
- CI gates not enforced → ensure jobs read gates_config.yaml and fail on breach

## Overall Acceptance
- [ ] Required rules present and validated
- [ ] Controls documented and mapped
- [ ] CI gates enabled with thresholds set
- [ ] Related Phases: 02 (planning), 05 (gates), 06 (pre-deploy)