---
title: "Phase 02: Technical Planning"
phase: 2
triggers: ["phase-02","plan","architecture","api","db","ux"]
scope: "project-rules"
inputs: ["Approved requirements summary from Phase 1"]
outputs: ["PRD.md","ARCHITECTURE.md","DB outline","API list","UI map","Security plan","Estimates"]
artifacts: ["docs/PRD.md","docs/ARCHITECTURE.md"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Tech Lead"
---

# Technical Planning Workflow

## Overview
Transform approved requirements into a PRD, architecture overview, DB schema outline, API spec, UI plan, and security/compliance plan with estimates.

## Prerequisites
- Approved requirements summary from Phase 1

## Steps

### Step 1: Draft PRD
Action: Use `.cursor/dev-workflow/1-create-prd.md` as guidance
Acceptance:
- [ ] PRD.md drafted with scope, constraints, success criteria

### Step 2: Architecture & Data
Action: Create architecture overview and DB schema outline (ERD-level)
Acceptance:
- [ ] Architecture notes committed
- [ ] DB entities/relationships listed

### Step 3: API & UI Plans
Action: Define endpoints and data flows; draft UI components/pages map
Acceptance:
- [ ] API routes/spec documented
- [ ] UI map/wireframes linked or attached

### Step 4: Security & Compliance Plan
Action: Document access control, audit logging, encryption, and compliance mappings
Acceptance:
- [ ] Security/compliance plan reviewed

Controls to cover (HIPAA/industry):
- Encryption at rest (e.g., AES-256) and in transit (TLS)
- RBAC (minimum necessary access)
- Audit logging for PHI access/changes
- Session timeout ≥ 15 minutes

### Step 5: Estimates & Milestones
Action: Provide timeline and resource estimates
Acceptance:
- [ ] Estimates approved

## Evidence
- PRD.md, ARCHITECTURE.md (or section), DB outline, API list, UI map, Security plan, Estimates

## Overall Acceptance
- [ ] PRD + Architecture approved by client/tech lead

## Failure Modes & Troubleshooting
- Missing stakeholder approval → schedule review and sign-off
- Architecture ambiguity → add ADRs and update diagrams

---

Variables
- PROJ=<project-key>

Run Commands
```
# Generate Phase 02 artifacts
python3 scripts/scaffold_phase_artifacts.py --project $PROJ --phase 2

# Validate docs and HIPAA mentions (pre-gate)
python3 scripts/validate_workflows.py --all
python3 scripts/check_compliance_docs.py
```

Generated/Updated Files
- docs/briefs/$PROJ/PRD.md
- docs/briefs/$PROJ/ARCHITECTURE.md
- docs/briefs/$PROJ/API_PLAN.md
- docs/briefs/$PROJ/UI_MAP.md
- docs/briefs/$PROJ/SECURITY_COMPLIANCE_PLAN.md
- docs/briefs/$PROJ/ESTIMATES.md

Gate to Phase 03
- [ ] PRD + Architecture approved by tech lead/client
- [ ] API/UI plans documented
- [ ] Security/compliance plan reviewed
- [ ] Estimates approved
- [ ] Validators pass