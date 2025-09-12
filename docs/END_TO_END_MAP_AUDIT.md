| Stage | Trigger | Rule Source | Exists? | Acceptance Matches? | Notes |
|---|---|---|---|---|---|
| BR | BR | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | yes | Acceptance block matches exactly the rule's [STRICT] Acceptance. |
| AP | AP | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | Acceptance defined at orchestrator-level, not per-stage. |
| LA | LA | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | Acceptance defined at orchestrator-level. |
| LB | LB | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | Acceptance defined at orchestrator-level. |
| LC | LC | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | Acceptance defined at orchestrator-level. |
| CS | CS | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | Acceptance defined at orchestrator-level. |
| QA | QA | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | QA outputs defined; thresholds come from gates configs. |
| PR | PR | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | PR evidence text present; no per-stage acceptance section. |
| HP | HP | .cursor/rules/project-rules/execution-plan-orchestrator.mdc | yes | N/A | Help/Status fields defined. |
| PLAN | PLAN | .cursor/rules/project-rules/fe-be-plan.mdc | yes | yes | Acceptance (PLAN) block matches exactly. |
| RUN_BE | RUN_BE | .cursor/rules/project-rules/fe-be-plan.mdc | yes | N/A | No explicit acceptance for this stage. |
| RUN_FE | RUN_FE | .cursor/rules/project-rules/fe-be-plan.mdc | yes | N/A | No explicit acceptance for this stage. |
| CSAN | CSAN | .cursor/rules/project-rules/fe-be-plan.mdc | yes | N/A | No explicit acceptance for this stage. |
| QA | QA | .cursor/rules/project-rules/fe-be-plan.mdc | yes | N/A | No explicit acceptance in this rule. |
| PR | PR | .cursor/rules/project-rules/fe-be-plan.mdc | yes | N/A | No explicit acceptance in this rule. |
| STATUS | STATUS | .cursor/rules/project-rules/fe-be-plan.mdc | yes | N/A | No explicit acceptance in this rule. |
| (variant) BR..HP | BR,AP,LA,LB,LC,CS,QA,PR,HP | .cursor/rules/project-rules/enterprise-next-nest-plan.mdc | yes | N/A | Variant confirms same trigger set; acceptance per-lane guidelines present. |
| - | - | .cursor/dev-workflow/docs/router_contract.md | yes | N/A | Referenced for router contract in map. |
| - | - | .cursor/rules/master-rules/9-governance.mdc | yes | N/A | Referenced precedence. |
| - | - | sample/MR/F8-security-and-compliance-overlay.mdc | yes | N/A | Referenced overlay sample. |
| (QA-config) | - | .cursor/dev-workflow/ci/gates_config.yaml | yes | N/A | Referenced by QA stage. |
| (QA-config) | - | ci/gates.yml | yes | N/A | Referenced by QA stage. |
| (QA-config) | - | template-packs/cicd/gates_config.yaml | yes | N/A | Referenced by QA stage. |

