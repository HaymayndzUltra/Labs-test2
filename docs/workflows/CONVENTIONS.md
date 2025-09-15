---
title: "Workflow Conventions"
phase: 0
triggers: ["conventions","schema","docs"]
scope: "project-rules"
inputs: ["Governance requirements"]
outputs: ["Frontmatter schema","Section template"]
artifacts: ["docs/workflows/CONVENTIONS.md"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Docs Lead"
---

# Workflow Conventions

## YAML Frontmatter (required on all workflow docs)
```
---
# Human-readable title
title: "Phase 05: Testing & QA"
# Numeric phase index (1..10)
phase: 5
# Keywords used by triggers/rules
triggers: ["phase-05","test","qa","coverage","security","performance"]
# Scope marker
scope: "project-rules"
# Prerequisite artifacts/inputs from prior phases
inputs: ["Built app from Phase 04"]
# Primary outputs produced by this phase
outputs: ["CI run link","coverage report","security/perf reports","UAT package"]
# Files or artifact paths expected to exist post-phase
artifacts: ["reports/coverage.xml","reports/security.json","reports/perf.json"]
# Gates validated in this phase
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
# Upstream dependencies by phase index
depends_on: [4]
# Accountable role/person
owner: "QA Lead"
---
```

## Required Sections (per workflow doc)
- Overview
- Prerequisites
- (Optional) Paths & Artifacts
- Steps (each step includes Action/Execute and measurable Acceptance)
- Evidence (artifact list, links, or logs)
- Failure Modes & Troubleshooting
- Overall Acceptance

## Acceptance Thresholds (defaults)
- Test Coverage ≥ 80%
- Performance p95 latency ≤ 500ms
- Security: 0 critical vulnerabilities
- Session timeout ≥ 15 minutes (HIPAA)
- No PHI in logs

## Cross-Phase Linking
- Add "Related Phases" at bottom of each doc
- Reference inputs from prior phase and outputs to next phase

## Overview
This document defines required frontmatter and section structure for all workflows.

## Prerequisites
- None

## Steps
- Apply the schema to all workflow docs
- Validate with scripts/validate_workflows.py

## Evidence
- Validator output showing zero missing fields/sections

## Failure Modes & Troubleshooting
- Schema drift → update this file and re-run validation

## Overall Acceptance
- [ ] All workflow docs pass validator checks