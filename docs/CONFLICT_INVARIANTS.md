## Conflict-Scan Invariants (Exact categories and mitigations)

### From .cursor/rules/project-rules/execution-plan-orchestrator.mdc
```
## [STRICT] Conflict Detection and Guardrails
- DB: migrations vs seed/tests → enforce sequence; recommend “migration lock”.
- Ownership: same file/route/module → branch, feature flag, or mock endpoints.
- Ports: 3000/8000 conflicts → suggest alternate ports; document mapping.
- Secrets/env: NEVER plaintext; env-injection only; BLOCK if .env enters VCS.
- Heavy installs/builds: ONLY in generated or temp dirs; NEVER inside template-packs.
```

### From .cursor/rules/project-rules/enterprise-next-nest-plan.mdc (Conflict checks)
```
- Migrations vs seed/tests (sequence + migration lock).
- Same file/route ownership (branch/feature-flag/mock).
- Port 3000/8000 clashes (assign alt).
- Secrets/env (no plaintext; env-injection).
- No installs/writes inside template-packs/*.
```

