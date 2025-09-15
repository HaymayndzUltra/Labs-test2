---
title: "Phase 10 — Monitoring & Observability"
phase: 10
gates:
  - monitoring-config-present
  - logs-structured
  - traces-propagated
  - incident-runbook-present
---

Objectives:
- Metrics: request rate, error rate, latency (p50/p95/p99), resource usage.
- Logs: JSON structured with correlation (session_id, trace_id), redactions.
- Traces: Distributed tracing via OpenTelemetry; context propagation.
- Incident response: on-call, runbook, SLIs/SLOs, alert routing.

Steps:
1) Instrument services with OpenTelemetry SDK and exporters.
2) Ensure log correlation fields: session_id, timestamp, decision, rules_considered, winning_rule, trace_id.
3) Configure scrapers/collectors (Prometheus, OTEL Collector), dashboards (Grafana), and alerts.
4) Verify redaction patterns (password|secret|key|token|credential) in logs.
