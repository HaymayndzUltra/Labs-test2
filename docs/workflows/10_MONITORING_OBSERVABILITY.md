---
title: "Phase 10: Monitoring & Observability"
phase: 10
triggers: ["phase-10","monitor","observe","logs","metrics","traces","alerts"]
scope: "project-rules"
inputs: ["Production environment with logging/metrics/tracing"]
outputs: ["Dashboards","Alerts","SLIs/SLOs"]
artifacts: ["dashboards/*.json","alerts/*.yaml"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Observability Lead"
---

## Prerequisites
- Production telemetry pipeline (logs/metrics/traces) accessible

# Monitoring & Observability Workflow

## Overview
Ensure logs, metrics, and traces are instrumented and monitored with actionable alerts.

## Steps

### Step 1: Logging
Action: Structured logs with correlation IDs; no PHI/PII leakage
Acceptance:
- [ ] Logs structured; sensitive data absent

No PHI in logs (explicit):
- Ensure log statements never include PHI/PII
- Add filters/scrubbers to logging pipeline

### Step 2: Metrics & Traces
Action: Define key SLIs/SLOs; enable tracing on critical paths
Acceptance:
- [ ] SLIs tracked; traces visible for key routes

### Step 3: Dashboards & Alerts
Action: Build dashboards; set alert thresholds
Acceptance:
- [ ] Alerts actionable; dashboards shared

## Evidence
- Dashboard exports (JSON) and alert definitions
- Links to monitoring systems

## Templates
- Grafana dashboard: `observability/grafana_dashboard.json`
- Alert rules (Prometheus-compatible): `observability/alerts.yaml`

## SLIs/SLOs
- SLIs:
  - Validation failures rate (per hour): `workflow_validation_failures_total`
  - CI pass rate: `ci_pipeline_pass_total / (ci_pipeline_pass_total + ci_pipeline_fail_total)`
  - Time-to-fix P95 (hours): `workflow_fix_time_bucket`
  - Perf p95 (ms): `workflow_perf_p95_ms`
- SLOs:
  - CI pass rate ≥ 0.9
  - Validation failures rate ≤ 0.05/h
  - Time-to-fix P95 ≤ 24h
  - Perf p95 ≤ 500ms

## Dashboard & Alerts Links
- Dashboard: `observability/grafana_dashboard.json`
- Alerts: `observability/alerts.yaml`

## Failure Modes & Troubleshooting
- Alert fatigue → refine thresholds and deduplication
- Missing traces → enable instrumentation on critical paths

## Overall Acceptance
- [ ] Logs structured; sensitive data absent
- [ ] SLIs tracked; traces visible
- [ ] Alerts actionable; dashboards shared
- [ ] Related Phases: 07 (ops), 06 (post-deploy validation)

---

Variables
- PROJ=<project-key>

Run Commands
```
# Import templates to your monitoring stack; record links in Evidence section
# (No local command changes required in repo)
```

Generated/Updated Files
- observability/grafana_dashboard.json (imported)
- observability/alerts.yaml (imported)

Gate (Completion)
- [ ] Templates available and documented
- [ ] SLIs/SLOs defined and tracked
- [ ] Dashboard/alert links recorded in Evidence