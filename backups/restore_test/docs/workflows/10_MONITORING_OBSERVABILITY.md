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

## Failure Modes & Troubleshooting
- Alert fatigue → refine thresholds and deduplication
- Missing traces → enable instrumentation on critical paths

## Overall Acceptance
- [ ] Logs structured; sensitive data absent
- [ ] SLIs tracked; traces visible
- [ ] Alerts actionable; dashboards shared
- [ ] Related Phases: 07 (ops), 06 (post-deploy validation)