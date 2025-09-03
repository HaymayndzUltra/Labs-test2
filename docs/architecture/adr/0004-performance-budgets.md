# ADR 0004: Performance Budgets and Baseline Load Tests

## Status
Proposed

## Context
NFRs require documented performance targets and a repeatable baseline load test.

## Decision
- Frontend: LCP ≤ 2.5s, INP < 200ms; enforce via Lighthouse CI
- Backend: p95 latency < 300ms for key endpoints under baseline RPS
- Establish k6 (or similar) load test with scenario and thresholds

## Consequences
- Quantifiable performance goals; regression detection
- Requires CI integration for continuous measurement