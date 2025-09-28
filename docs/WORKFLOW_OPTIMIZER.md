# Workflow Optimization System

This repository now includes a production-ready workflow optimization system
that orchestrates 11 deterministic gates, captures evidence, and produces
machine-readable reports suitable for AI or human operators.

## Key Features

- **Gate Orchestration** – The `WorkflowOrchestrator` executes metadata,
  environment, planning, task graph, PRD, stack, dry run, generation, testing,
  metrics, and compliance gates with deterministic pass/fail outcomes.
- **Evidence Collection** – Every gate generates structured evidence that is
  saved under the configured evidence directory with an automatically
  maintained manifest (`evidence/index.json`) and consolidated gate summary
  (`evidence/gates_report.json`).
- **Automation Friendly** – The system exposes a CLI
  (`python -m workflow_optimizer.cli`) and a thin wrapper script
  (`scripts/run_workflow_optimizer.py`) that can be invoked by humans or AI
  agents. Outputs are emitted as JSON for straightforward downstream
  automation.
- **Universal Templates** – Run
  `python -m workflow_optimizer.cli init --output ./workflow-templates` to
  scaffold intake metadata, evidence schema, gate controller, and submission
  checklist templates.
- **Deployment Ready** – Execute
  `deploy/workflow_optimizer_deploy.sh <config>` to run the full gate suite in
  CI/CD pipelines or production staging environments.

## Running the Workflow

1. Prepare a configuration file (YAML or JSON) describing the project and
   evidence locations. A starter file can be generated via
   `python -m workflow_optimizer.cli init --output ./workflow-templates`.
2. Populate the referenced project artifacts (metadata, plan, task graph,
   PRD/architecture, stack report, dry run snapshot, generation manifest,
   test report, metrics, compliance manifest, submission manifest).
3. Execute the workflow using either the CLI or deployment script:

```bash
python -m workflow_optimizer.cli run --config path/to/workflow.yaml
# or
./deploy/workflow_optimizer_deploy.sh path/to/workflow.yaml
```

4. Inspect the evidence directory for per-gate artifacts and consolidated
   results.

## Configuration Overview

The configuration supports gate overrides to tune thresholds and commands. For
example:

```yaml
project_root: ./_generated/project
metadata_file: ./_generated/project/docs/metadata.json
evidence_root: ./_generated/project/evidence
gate_overrides:
  coverage_threshold: 0.85
  p95_threshold_ms: 250
  max_high_vulnerabilities: 0
  test_command: ["pytest", "-q"]
```

## Testing

Automated tests in `tests/test_workflow_optimizer.py` validate successful gate
execution and failure handling. Run `pytest` to execute the suite.
