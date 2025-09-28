# Workflow Automation Integration Plan

## 1. System Understanding
- **Purpose.** The automation framework coordinates a series of quality and compliance gates, captures evidence with SHA-256 checksums, and halts on the first failure so the pipeline cannot progress without remediation.【F:workflow_automation/orchestrator.py†L29-L82】【F:workflow_automation/evidence.py†L35-L91】
- **Difference from the existing lifecycle.** The current Step 10 manually runs individual scripts for coverage, performance, dependency scanning, and gate enforcement, relying on `gates_config.yaml` thresholds without unified evidence capture.【F:docs/LOCAL_DEV_WORKFLOW.md†L183-L199】 The automation system centralizes those checks, adds earlier-phase validations (intake through generation), and emits a normalized manifest for audits.
- **Gate coverage.** The default controller defines twelve gates spanning intake metadata, environment readiness, planning artifacts, task graph integrity, PRD/architecture, stack selection, dry-run verification, generation manifest, automated tests, aggregated metrics, compliance attestations, and submission readiness.【F:workflow/gate_controller.yaml†L8-L102】 Each implementation enforces domain-specific rules and records evidence; for example, the Planning gate ensures tagged coverage for compliance, testing, deployment, and architecture topics, while the Metrics gate enforces ≥80 % coverage, ≤400 ms P95 latency, and zero critical vulnerabilities.【F:workflow_automation/gates/implementations.py†L144-L185】【F:workflow_automation/gates/implementations.py†L376-L410】

## 2. Integration Points in the 12-Step Lifecycle
- **Primary insertion point.** Replace the "Collect metrics and enforce gates" activity in Step 10 with workflow automation orchestration. Steps 1–9 already produce the artifacts the gates inspect (metadata, plan/tasks, PRD/architecture, stack report, dry-run snapshot, manifest, tests).【F:docs/LOCAL_DEV_WORKFLOW.md†L141-L181】
- **Preparation tasks.** Step 10 should still run the existing metric collection scripts (coverage, performance, dependency scan) to populate the JSON inputs consumed by the Testing and Metrics gates before invoking the orchestrator.【F:docs/LOCAL_DEV_WORKFLOW.md†L185-L199】【F:workflow_automation/gates/implementations.py†L350-L410】
- **Downstream steps.** Run the packaging script from current Step 11 before executing the Submission gate so that `dist/` exists. Compliance asset validation from Step 12 should produce or update `compliance_report.json` prior to the Compliance gate, allowing the orchestrator to confirm SOC2, accessibility, and security attestations.【F:workflow/gate_controller.yaml†L90-L97】【F:workflow_automation/gates/implementations.py†L413-L442】

## 3. Configuration Strategy
- **Controller file.** `workflow/gate_controller.yaml` declares the enabled gates, artifacts they read, and thresholds. Customize gate settings per project (e.g., add GDPR to the compliance requirements or adjust latency limits) by editing this file or layering stack-specific templates such as `workflow/templates/workflow_fullstack.yaml` and `workflow/templates/workflow_backend.yaml`.【F:workflow/gate_controller.yaml†L8-L102】【F:workflow/templates/workflow_fullstack.yaml†L1-L27】【F:workflow/templates/workflow_backend.yaml†L1-L29】
- **Evidence layout.** The orchestrator writes evidence under `<project_root>/evidence`, records checksums, and emits an `index.json` manifest compatible with the provided JSON schema for downstream validation or reporting.【F:workflow_automation/orchestrator.py†L32-L76】【F:workflow_automation/evidence.py†L35-L91】【F:workflow/templates/evidence_schema.json†L1-L23】
- **Project metadata.** Ensure briefs and metadata files reside at the paths defined in the controller (`docs/metadata.json`, `docs/brief.md`). Intake gates will fail if required fields (project name, industry, project type, owners, compliance array) are missing.【F:workflow/gate_controller.yaml†L4-L19】【F:workflow_automation/gates/implementations.py†L28-L69】

## 4. Execution Flow & Error Handling
- **CLI entry point.** Use `python scripts/run_workflow.py --project-root "$PROJECT_DIR"` (optionally overriding `--config`) to execute the configured gates with fail-fast semantics and informative exit codes (2 for gate failures, 3 for configuration issues).【F:scripts/run_workflow.py†L1-L68】
- **Gate outcomes.** Successful or failed runs append structured results to the shared context and persist a consolidated `gates_report.json`; evidence is finalized even when a gate fails, ensuring partial audits remain available.【F:workflow_automation/context.py†L14-L56】【F:workflow_automation/orchestrator.py†L57-L82】
- **Failure handling.** The orchestrator raises `GateFailedError` on the first failing gate, halting the pipeline. Tests confirm that evidence manifests still exist after failures, so CI should treat a non-zero exit as blocking while surfacing the evidence folder for debugging.【F:workflow_automation/orchestrator.py†L57-L82】【F:tests/test_workflow_orchestrator.py†L187-L209】

## 5. Integration Plan by Lifecycle Step
| Lifecycle Step | Automation Impact | Required Artifacts | Notes |
| --- | --- | --- | --- |
| 0–1 | No change | Metadata scaffolded alongside evidence directory | Continue provisioning `PROJECT_DIR/evidence` so orchestrator writes into the pre-created folder hierarchy.【F:docs/LOCAL_DEV_WORKFLOW.md†L41-L63】【F:workflow_automation/evidence.py†L35-L91】 |
| 2–4 | Enable Intake, Planning, PRD gates | `docs/metadata.json`, `docs/brief.md`, `PLAN.md`, `PLAN.tasks.json`, `PRD.md`, `ARCHITECTURE.md` | Ensure planning scripts emit required tags so Planning gate can confirm compliance/testing/deployment/architecture coverage.【F:workflow_automation/gates/implementations.py†L28-L263】 |
| 5 | Stack Gate | `stack_report.json` | Update stack selection tooling to persist JSON in project root (already listed outputs in Step 5).【F:docs/LOCAL_DEV_WORKFLOW.md†L121-L140】【F:workflow_automation/gates/implementations.py†L266-L291】 |
| 6 | DryRun Gate | `dryrun_snapshot.json` | Extend dry-run command to emit module lists/status JSON consumed by the gate.【F:workflow_automation/gates/implementations.py†L293-L316】 |
| 7 | Generation Gate | `file_manifest.json` | Ensure generation scripts summarize outputs into manifest JSON (unique paths enforced).【F:workflow_automation/gates/implementations.py†L318-L348】 |
| 8 | Testing Gate | `test_results.json` with status & coverage | Augment `install_and_test.sh` to export consolidated JSON for orchestrator (≥80 % coverage).【F:workflow_automation/gates/implementations.py†L350-L374】 |
| 9 | Task Graph Gate re-run | `PLAN.tasks.json` or synced `tasks.json` | After syncing, regenerate the JSON referenced by the controller so gates validate final DAG state.【F:workflow_automation/gates/implementations.py†L188-L229】 |
| 10 | Metrics Gate | `metrics_report.json` aggregated from coverage/perf/deps | After running existing collectors, combine their outputs into `metrics_report.json` to satisfy coverage, latency, and vulnerability thresholds.【F:docs/LOCAL_DEV_WORKFLOW.md†L185-L199】【F:workflow_automation/gates/implementations.py†L376-L410】 |
| 11 | Submission Gate | `dist/`, `submission_index.md` | Build submission pack before running orchestration so packaging evidence is available.【F:docs/LOCAL_DEV_WORKFLOW.md†L200-L206】【F:workflow_automation/gates/implementations.py†L444-L479】 |
| 12 | Compliance Gate | `compliance_report.json` capturing SOC2/accessibility/security decisions | Extend compliance validation scripts to emit/refresh this JSON before invoking the orchestrator.【F:docs/LOCAL_DEV_WORKFLOW.md†L208-L215】【F:workflow/gate_controller.yaml†L90-L97】【F:workflow_automation/gates/implementations.py†L413-L442】 |

## 6. Pipeline Invocation & Makefile Updates
- **Make target usage.** The repository already exposes `make workflow-automation`, which executes `scripts/run_workflow.py` with optional overrides. Invoke this target at the end of Step 12 (or within the lifecycle wrapper) after prerequisite artifacts are generated.【F:Makefile†L90-L91】
- **Lifecycle wrapper.** Update `scripts/e2e_from_brief.sh` (and Step 10 documentation) to call `make workflow-automation PROJECT_ROOT="$PROJECT_DIR" CONFIG=workflow/gate_controller.yaml` once metrics, submission pack, and compliance reports are ready. This consolidates gate enforcement into a single reproducible command.
- **Environment variables.** Ensure `PROJECT_ROOT` is set before invoking the target; optionally pass `CONFIG` for alternative controller files (e.g., backend-only or fullstack templates).【F:scripts/run_workflow.py†L45-L64】

## 7. Evidence & Reporting
- **Evidence directory alignment.** The orchestrator stores artifacts beneath `<PROJECT_DIR>/evidence`—the same location created during Step 0—so existing evidence archiving flows remain intact.【F:docs/LOCAL_DEV_WORKFLOW.md†L41-L63】【F:workflow_automation/orchestrator.py†L32-L76】
- **Manifest validation.** Use `scripts/evidence_report.py` or JSON schema validation to transform `evidence/index.json` into reviewer-friendly summaries; the tool iterates manifest entries and emits Markdown reports for sharing.【F:scripts/evidence_report.py†L8-L33】【F:workflow/templates/evidence_schema.json†L1-L23】

## 8. Dependencies & Tooling Considerations
- **Python dependencies.** Confirm PyYAML remains available because configuration loading requires it; the package is already declared in `requirements.txt`.【F:workflow_automation/config.py†L10-L91】【F:requirements.txt†L23-L32】
- **Testing coverage.** Reuse the existing pytest suite to guard orchestrator behaviour; it verifies both success paths and failure evidence persistence, which should continue to run in CI after integration.【F:tests/test_workflow_orchestrator.py†L187-L209】
- **Extensibility.** Additional gates can be enabled/disabled by editing the controller file; for multi-phase validation (e.g., pre- vs post-packaging), duplicate the config with subsets of gates and invoke the CLI at the appropriate lifecycle checkpoints.

## 9. Summary of Actions
1. Update Step 10 documentation and scripts to run existing metric collectors, then execute `make workflow-automation PROJECT_ROOT="$PROJECT_DIR"` so all gates run together.
2. Modify Steps 6–12 tooling to emit the JSON artifacts expected by each gate (dry-run snapshot, manifest, test results, metrics report, compliance report, submission checklist).
3. Integrate the orchestrator call into `scripts/e2e_from_brief.sh` so `make lifecycle` includes automation without additional commands.
4. Provide remediation guidance pointing to the evidence manifest whenever a gate fails, leveraging the checksum-backed records for audits.
