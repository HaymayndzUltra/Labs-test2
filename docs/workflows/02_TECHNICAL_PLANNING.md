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