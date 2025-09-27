# Pipeline Evaluation and Execution Notes

## AI Report Version Review
- **Version 1** mirrors the documented lifecycle but flags missing PRD automation, absent architecture artifacts, weak gate thresholds, and placeholder performance checks, each accompanied by remediation tasks.【F:AGENTS.md†L1-L6】
- **Version 2** emphasizes that the automation skips the mandated PRD gate, swallows install/test failures, and diverges from compliance expectations, undermining governance assurances.【F:AGENTS.md†L9-L14】
- **Version 3** restates end-to-end coverage yet highlights absent PRD enforcement, relaxed quality thresholds, missing performance budgets, and the lack of a change-control feedback loop.【F:AGENTS.md†L16-L21】
- **Version 4** confirms the scripted sequence but reiterates the unenforced PRD/architecture checkpoint, ignored test failures, weak gate thresholds, and disabled performance enforcement.【F:AGENTS.md†L24-L27】

## Workflow Walkthrough
The published workflow requires requirements sign-off followed by a PRD and architecture approval before scaffolding, with later gates covering QA, UAT, and deployment.【F:docs/WORKFLOW_OVERVIEW.md†L1-L44】 The automation implements planning from the brief, stack selection, scaffold generation, install/test, metrics collection, and compliance validation, but it jumps directly from planning outputs to stack selection and generation without a PRD step.【F:scripts/e2e_from_brief.sh†L133-L200】

## Detected Issues and Inconsistencies
1. **PRD gate missing in automation** – The workflow mandates a PRD/architecture sign-off, yet the script never creates or validates a PRD before proceeding, contradicting the documented gate.【F:docs/WORKFLOW_OVERVIEW.md†L1-L12】【F:scripts/e2e_from_brief.sh†L133-L200】
2. **Tests allowed to fail silently** – The install/test helper wraps build and test commands with `|| true`, so scaffolds advance even when builds or tests fail, weakening the QA gate.【F:scripts/install_and_test.sh†L20-L92】
3. **Quality thresholds misaligned** – Documentation calls for >80 % coverage and zero critical vulnerabilities, but `gates_config.yaml` enforces only 70 % coverage and permits five high-severity issues.【F:docs/SLO_TARGETS.md†L93-L105】【F:gates_config.yaml†L1-L16】
4. **Performance validation stubbed out** – The performance collector always emits a default 9999 ms P95 when no input is provided, while documentation promises configurable iterations, formats, and real runs.【F:scripts/collect_perf.py†L1-L39】【F:docs/UTILITY_SCRIPTS.md†L311-L342】
5. **Stack selection lacks architecture outputs** – The selector validates template availability and engine versions but never emits the architecture artifacts promised in workflow materials, leaving downstream teams without those specifications.【F:scripts/select_stacks.py†L200-L280】

## Recommendations
- Insert a PRD creation and validation stage after planning, persisting `PRD.md` and failing if sign-off metadata is missing before stack selection starts.【F:scripts/e2e_from_brief.sh†L133-L200】
- Propagate install/test failures by removing `|| true` wrappers and ensuring `e2e_from_brief.sh` halts when any stage fails, preserving QA gate integrity.【F:scripts/e2e_from_brief.sh†L180-L200】【F:scripts/install_and_test.sh†L20-L92】
- Align gate thresholds with documented SLOs by raising coverage to 80 % and disallowing high-severity vulnerabilities, then update enforcement and documentation accordingly.【F:gates_config.yaml†L1-L16】【F:docs/SLO_TARGETS.md†L93-L105】
- Replace the performance placeholder with a runner that fails without measured data and integrates with actual load-test tooling, matching the documented interface.【F:scripts/collect_perf.py†L1-L39】【F:docs/UTILITY_SCRIPTS.md†L311-L342】
- Extend stack selection to emit architecture summaries (API schema, DB design, UI outline) so later phases receive the promised artifacts.【F:scripts/select_stacks.py†L200-L280】

## Pipeline Execution Attempt
Running the end-to-end script with the `acme-telehealth` brief progressed through planning and validation but halted during stack selection because Docker is absent, demonstrating that engine requirements are enforced before scaffold generation.【7472d0†L1-L3】【1a4d67†L1-L18】【088e66†L1-L9】 This confirms the pipeline wiring while highlighting the environment prerequisite.
