# Multi-Agent Orchestration and Handoffs

## Dependency Order
- F1 Discovery → F2 Planning → F3 UX
- F4 Architecture consumes F2+F3 → contracts/mocks
- F5 Data/ML optional; aligns with F4/F6
- F6 Implementation (FE/BE) consumes F3/F4 → code+tests
- F7 QA gates F4/F6 with contract/e2e
- F8 Security overlay across all
- F9 Release promotes builds with canary/rollback
- F10 Observability feeds metrics back to F2

## Run Protocol
1. F1 posts `docs/discovery/brief.md`, `docs/discovery/rad.md`
2. F2 posts `docs/planning/prd.md`, `docs/planning/roadmap.md`, `docs/planning/backlog.csv`
3. F3 posts `design/tokens/*.json`, `design/specs/*.md`, `design/flows/*.md`
4. F4 posts `contracts/api/*`, `contracts/mocks/*`, `docs/architecture/adr/*.md`
5. F6(FE/BE) posts `src/*` and tests under `tests/*`
6. F7 posts `docs/qa/strategy.md`, test suites `tests/**/*`, `ci/*`
7. F8 posts `security/threat-model/*.md`, `security/sbom/*`, `compliance/evidence/*`
8. F9 posts `.github/workflows/*`, `infra/*`, `docs/release/runbooks/*.md`
9. F10 posts `observability/dashboards/*`, `observability/alerts/*`, `docs/retro/*.md`

## Gates and Success Criteria (CI Enforced)
- Coverage ≥ 80%; flake < 2%; CI green on main/integration
- Security: zero critical vulns; SBOM published; policy-as-code pass
- Release: progressive delivery; rollback automation; DORA CFR < 15%
- UX: tokens versioned; contrast/keyboard verified
- Architecture: ADR review; contract tests green; baseline load test

## Handoff Payload
Use `/workspace/shared/templates/handoff-message.md` to generate deterministic handoffs.

