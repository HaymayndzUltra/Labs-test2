# Workflow Overview (Client ↔ Developer ↔ Automation)

Client                          Developer / AI                             Artifacts / Gates
---------------------------------------------------------------------------------------------
Brief → Understanding           Parse brief (plan_from_brief)              PLAN.md, tasks.json (optional)
                                Map stack & compliance (brief_parser)      Requirements summary
                                                                            Sign-off: Requirements OK

Understanding → Planning        Draft PRD & architecture (dev-workflow)    PRD.md, Arch notes
                                Define DB/API/UI, estimates                Wireframes/mockups
                                                                            Sign-off: PRD + Architecture OK

Planning → Generation           Dry-run scaffold                           Structure preview
                                Generate repo(s)                           Generated project(s)
                                CI/CD, docs, rules emitted                 Sign-off: Scaffold OK

Generation → Customization      Implement features per tasks               Code + tests + logs
                                Add validation, security, observability    Coverage reports
                                                                            Code review + QA pass

Customization → Deploy          Full test suite, security & perf gates     CI green; perf OK; UAT
                                Prepare deploy, prod config                Deploy scripts
                                                                            Sign-off: UAT OK

Deploy → Maintenance            Execute deploy                             Go-live report
                                Post-deploy verification                   Runbook / rollback
                                                                            Sign-off: Go-live

Maintenance                     Monitor, patch, backups, audits            SLA metrics, audit logs
                                Plan enhancements                          Backup verification
                                                                            Maintenance schedule

Key automations
- Brief parsing / stack selection: `project_generator.core.brief_parser`
- Project generation: `scripts/generate_client_project.py` and `project_generator/core/generator.py`
- Dev workflow guidance: `.cursor/dev-workflow/0–5`
- CI/CD gates: generated GitHub Actions and `gates_config.yaml`
- Compliance checks: `.cursor/tools/validate_rules.py`, `check_compliance.py`

Paths
- Docs: `/workspace/docs`
- Rules: `/workspace/.cursor/rules/project-rules`
- Dev workflow: `/workspace/.cursor/dev-workflow`

```mermaid
flowchart LR
  A[Client Brief] --> B[Brief Parsing / PLAN]
  B --> C[PRD & Architecture]
  C --> D[Dry-Run Scaffold]
  D --> E[Generate Project(s)]
  E --> F[CI/CD + Docs + Rules]
  F --> G[Feature Implementation]
  G --> H[Testing / Security / Perf]
  H --> I[UAT]
  I --> J[Deploy]
  J --> K[Post-Deploy Verification]
  K --> L[Maintenance: Monitor/Patch/Backups/Audits]

  subgraph Gates
    S1[Requirements Sign-off]
    S2[PRD + Architecture Sign-off]
    S3[Scaffold OK]
    S4[UAT Sign-off]
    S5[Go-live]
  end

  B --> S1
  C --> S2
  F --> S3
  I --> S4
  J --> S5
```
