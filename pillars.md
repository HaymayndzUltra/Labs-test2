| Path | Reason | Anchors |
|---|---|---|
| project_generator/core/generator.py | Orchestrates generation flow and emits gates/workflows/docs | project_generator/core/generator.py:955-1000; project_generator/core/generator.py:1836-1887 |
| project_generator/core/validator.py | Central validation incl. system deps (Docker) | project_generator/core/validator.py:199-231 |
| scripts/generate_client_project.py | CLI entrypoint and args incl. --skip-system-checks | scripts/generate_client_project.py:354-498 |
| scripts/enforce_gates.py | Numeric gates (coverage/perf/vulns) | scripts/enforce_gates.py:1-80 |
| .cursor/dev-workflow/ci/run_gates.py | Policy/manifests gates runner | .cursor/dev-workflow/ci/run_gates.py:72-116 |
| .cursor/dev-workflow/ci/gates_config.yaml | Policy gates config (manifests/checks) | N/A |
| .github/workflows/ci.yml | CI orchestration incl. gates_enforcer job | N/A |
| template-packs/ | Source templates for stacks | N/A |
| scripts/scaffold_briefs.py | Scaffolds compliance briefs (RBAC/Audit/Encryption/Retention) | scripts/scaffold_briefs.py:1-40 |
| docs/ | Briefs and operational docs | N/A |
| project_generator/templates/registry.py | Template discovery/manifest loading | project_generator/templates/registry.py:12-58 |
| project_generator/templates/template_engine.py | Template renderers for stacks | project_generator/templates/template_engine.py:8-26 |
