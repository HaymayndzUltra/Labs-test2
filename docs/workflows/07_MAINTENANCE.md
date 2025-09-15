---
title: "Phase 07: Maintenance"
phase: 7
triggers: ["phase-07","maintain","patch","backup","audit","monitor"]
scope: "project-rules"
inputs: ["Production environment","Deployment runbook"]
outputs: ["Patched systems","Verified backups","Audit reports","Updated docs"]
artifacts: ["audits/security.md","backups/restore-proof.txt"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Ops Lead"
---

# Maintenance Workflow

## Prerequisites
- Access to monitoring and backup systems
- Current runbook and on-call rotation

## Overview
Operate, monitor, patch, back up, and audit the system; handle support and plan enhancements.

## Steps

### Step 1: Monitoring & Alerts
Action: Ensure dashboards and alerts configured
Acceptance:
- [ ] Alerts triggered on SLO breaches

### Step 2: Patching & Backups
Action: Apply patches; verify backups with restore test
Acceptance:
- [ ] Patches current; backups restorable

### Step 3: Audits & Documentation
Action: Conduct security audits; update docs
Acceptance:
- [ ] Audits passed; docs current

### Step 4: Support & Roadmap
Action: Track tickets; maintain enhancement plan
Acceptance:
- [ ] SLA met; roadmap updated

## Evidence
- Audit outputs and remediation logs
- Backup restore proof

## Maintenance Schedule & Ownership
- Schedule: Weekly backups; monthly audit reviews
- SLA: Critical fixes within 24h; high within 3 days
- Owner: Ops Lead (backup/restore), Security Lead (audits), Docs Lead (updates)

## Backup & Restore Test
- Backup: `make backup-workflows` → produces `backups/workflows_backup.tar.gz` and `backups/last_success.json`
- Restore Test: `make restore-test` → extracts to `backups/restore_test` and writes `backups/last_restore.json`
- Acceptance: Restore prints "Restore OK" and `last_restore.json` shows no missing files

## Failure Modes & Troubleshooting
- Alert noise → tune thresholds; deduplicate rules
- Backup restore failure → review retention and storage; test smaller scope

## Overall Acceptance
- [ ] Patches current; backups restorable; audits passed
- [ ] Docs and roadmap updated
- [ ] Related Phases: 06 (post-deploy), 10 (observability)

---

Variables
- PROJ=<project-key>

Run Commands
```
# Backup and restore test
make backup-workflows
make restore-test
```

Generated/Updated Files
- backups/workflows_backup.tar.gz
- backups/last_success.json
- backups/restore_test/**
- backups/last_restore.json

Gate to Phase 08
- [ ] Backups configured with proof; restore test passes
- [ ] Monitoring/alerts configured; audits scheduled