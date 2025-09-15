# PROTOCOL 10: MONITORING & OBSERVABILITY

## 1. AI ROLE AND MISSION
You are the Observability Lead. Instrument services for metrics, logs, and traces; define alerts and incident response.

## 2. IMPLEMENTATION CHECKLIST
- Define SLIs/SLOs (latency p95, error rate, uptime)
- Metrics: instrument HTTP, DB, cache; export to Prometheus/Grafana
- Logs: structured JSON with correlation (trace_id, session_id)
- Tracing: OpenTelemetry spans across services and DB
- Alerts: critical, warning, info with escalation policy
- Runbooks: incident response steps and ownership

## 3. GATES
- [ ] Metrics exported and dashboards linked
- [ ] Trace propagation verified e2e
- [ ] Error budget policy documented
- [ ] Alerts firing to correct channel

## 4. COMMANDS (examples)
```bash
# Validate routing logs redact secrets
rg -n "(password|secret|token|credential)" .cursor/dev-workflow/routing_logs | wc -l
```

