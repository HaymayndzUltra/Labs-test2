# 🚀 Workflow Quick Reference

## Phase Commands Overview

| Phase | Command | Purpose | Key Scripts |
|-------|---------|---------|-------------|
| **0** | `/0-bootstrap-project` | Project initialization | `generate_client_project.py` |
| **1** | `/1-create-prd` | Generate PRD & planning | `plan_from_brief.py` |
| **2** | `/2-generate-tasks` | Build task management | `enrich_tasks.py`, `validate_tasks.py` |
| **3** | `/sync-tasks` | Sync tasks with code | `sync_from_scaffold.py` |
| **4** | `/3-process-tasks` | Execute tasks | `update_task_state.py` |
| **5** | `/4-quality-control` | Quality assurance | `enforce_gates.py` |
| **6** | `/5-implementation-retrospective` | Review & improve | `write_context_report.py` |

## Quick Start Commands

### Bootstrap a New Project
```bash
python scripts/generate_client_project.py \
  --name my-project \
  --industry healthcare \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --compliance hipaa
```

### Generate Project Plan
```bash
python scripts/plan_from_brief.py \
  --brief docs/briefs/project1/brief.md \
  --out PLAN.md
```

### Sync Tasks with Code
```bash
python scripts/sync_from_scaffold.py \
  --scaffold-dir . \
  --tasks-file tasks.json \
  --preview
```

### Enforce Quality Gates
```bash
python scripts/enforce_gates.py --config gates_config.yaml
```

## Task States

- `pending` → `in_progress` → `completed`
- `in_progress` → `blocked` (if dependencies not met)
- `blocked` → `in_progress` (when dependencies resolved)
- Any state → `cancelled` (if no longer needed)

## Personas

- **system-integrator**: Integration, deployment, infrastructure
- **code-architect**: Technical design, architecture, code quality  
- **qa**: Testing, quality validation, compliance

## Quality Gates

- **Coverage**: Unit tests ≥80%, Integration ≥70%
- **Security**: 0 critical vulnerabilities, 0 secrets
- **Performance**: P95 ≤500ms, P99 ≤1000ms
- **Compliance**: Industry-specific requirements

## Rules Emission

- **Safe default**: `--no-cursor-assets` (no nested rules)
- **Minimal**: `--minimal-cursor --include-cursor-assets`
- **Full**: `--include-cursor-assets` (complete rules)

## Compliance Mapping

- **Healthcare** → HIPAA + GDPR
- **E-commerce** → PCI + GDPR + SOX
- **Finance** → SOX + PCI + GDPR
- **Default** → GDPR

## Context Report Generation

```bash
python scripts/write_context_report.py \
  --project-name "myapp" \
  --industry healthcare \
  --frontend nextjs --backend fastapi --database postgres \
  --auth auth0 --deploy aws \
  --compliance hipaa,gdpr \
  --output .cursor/ai-governor/project.json
```

## Key Points

- ✅ All phases are **non-deploy**
- ✅ **HALT checkpoints** ensure human confirmation
- ✅ Use `/sync-tasks` when code changes
- ✅ Quality gates are **enforced automatically**
- ✅ Rules live under `.cursor/rules/` in generated projects

## Troubleshooting

- **No evidence found**: Check directory and file existence
- **Conflicting evidence**: Review and resolve conflicts
- **Rule conflicts**: Check rule hierarchy and dependencies
- **Validation errors**: Use `--verbose` flag for detailed output

---

For detailed information, see [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)
