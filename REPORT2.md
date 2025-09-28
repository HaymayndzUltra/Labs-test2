diff --git a/README.md b/README.md
index 50719e3d7394f7e48c4782034d78668f694b9d59..0b0f3cdd5a87d4cd0aadb7cbf30f022b9554d819 100644
--- a/README.md
+++ b/README.md
@@ -1,36 +1,37 @@
 # Project Generator Factory
 
 This repository houses the automation that turns an approved client brief into a production-ready software project. It contains the generator engine, stack templates, lifecycle scripts, and CI/CD workflows that implement the brief → plan → validate → generate pipeline.
 
 ## What Lives Here
 
 - **Generator core** – [`project_generator/core/generator.py`](project_generator/core/generator.py) and [`project_generator/core/validator.py`](project_generator/core/validator.py) assemble scaffolds, enforce manifests, and validate task graphs.
 - **Template packs** – [`project_generator/template-packs/`](project_generator/template-packs) provide the frontend, backend, infrastructure, documentation, and compliance assets emitted during generation.
 - **Lifecycle scripts** – [`scripts/e2e_from_brief.sh`](scripts/e2e_from_brief.sh) orchestrates the non-interactive flow; helper scripts handle planning, stack selection, installs/tests, metrics, gates, and compliance validation.
 - **Automation** – [`Makefile`](Makefile) exposes convenience targets (`lifecycle`, `pipeline-validate`) and GitHub Actions workflows manage secrets preflight, staging deploys, production promotion, and nightly health checks.
 - **Documentation** – The refreshed docs under `docs/` form the single source of truth for architecture, local workflows, deployment, and compliance expectations.
+- **Workflow optimization system** – [`workflow_optimizer`](workflow_optimizer/) provides a production-ready gate orchestration engine with evidence collection, universal templates, and deployment scripts. See [Workflow Optimization System](docs/WORKFLOW_OPTIMIZER.md).
 
 Legacy documentation for the retired AI Governor workflow has been archived under [`archive/legacy-ai-governor/`](archive/legacy-ai-governor/).
 
 ## Getting Started
 
 1. **Review the architecture** – [System Overview](docs/SYSTEM_OVERVIEW.md) explains the repository layout and primary components.
 2. **Run the lifecycle** – Follow the [Local Development Workflow](docs/LOCAL_DEV_WORKFLOW.md) to provision an isolated output directory (`../_generated/<NAME>/`) and execute the end-to-end pipeline from a client brief.
 3. **Understand automation** – The [CI/CD Overview](docs/CI_CD_OVERVIEW.md) and [Deployment Guide](docs/DEPLOYMENT.md) describe how staging, production, and nightly health checks operate.
 4. **Maintain evidence** – The [Compliance & Evidence Guide](docs/COMPLIANCE_EVIDENCE.md) outlines required artifacts, gate thresholds, and validation steps.
 
 ## Key Commands
 
 ```bash
 # Run the full lifecycle using workflow.config.json or exported environment variables
 NAME=acme INDUSTRY=enterprise PROJECT_TYPE=fullstack \
 FE=nextjs BE=fastapi DB=postgres OUTPUT_ROOT=../_generated make lifecycle
 
 # Validate remote environments (execute from the factory repo)
 make pipeline-validate ENV=staging \
   FRONTEND_URL=https://app.staging.example.com \
   API_URL=https://api.staging.example.com/health \
   DB_URL=https://api.staging.example.com/health/db
 ```
 
 All generator outputs are isolated under `../_generated/<NAME>/` (configurable with `OUTPUT_ROOT`). Do not commit generated artifacts, evidence, or metrics to this repository—`.gitignore` blocks them by default.
diff --git a/deploy/workflow_optimizer_deploy.sh b/deploy/workflow_optimizer_deploy.sh
new file mode 100755
index 0000000000000000000000000000000000000000..f9e8486a1d5e5716ee5d93f5ff3407c0fc1cbb1e
--- /dev/null
+++ b/deploy/workflow_optimizer_deploy.sh
@@ -0,0 +1,21 @@
+#!/usr/bin/env bash
+set -euo pipefail
+
+if [[ -z "${1:-}" ]]; then
+  echo "Usage: $0 <workflow-config> [output-report]" >&2
+  exit 1
+fi
+
+CONFIG_PATH="$(realpath "$1")"
+OUTPUT_PATH="${2:-}" 
+
+SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
+REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
+
+cd "${REPO_ROOT}"
+
+if [[ -n "$OUTPUT_PATH" ]]; then
+  python3 -m workflow_optimizer.cli run --config "$CONFIG_PATH" --output "$OUTPUT_PATH"
+else
+  python3 -m workflow_optimizer.cli run --config "$CONFIG_PATH"
+fi
diff --git a/docs/WORKFLOW_OPTIMIZER.md b/docs/WORKFLOW_OPTIMIZER.md
new file mode 100644
index 0000000000000000000000000000000000000000..0131d25281eb17d363d4300742abb2be40a0b585
--- /dev/null
+++ b/docs/WORKFLOW_OPTIMIZER.md
@@ -0,0 +1,67 @@
+# Workflow Optimization System
+
+This repository now includes a production-ready workflow optimization system
+that orchestrates 11 deterministic gates, captures evidence, and produces
+machine-readable reports suitable for AI or human operators.
+
+## Key Features
+
+- **Gate Orchestration** – The `WorkflowOrchestrator` executes metadata,
+  environment, planning, task graph, PRD, stack, dry run, generation, testing,
+  metrics, and compliance gates with deterministic pass/fail outcomes.
+- **Evidence Collection** – Every gate generates structured evidence that is
+  saved under the configured evidence directory with an automatically
+  maintained manifest (`evidence/index.json`) and consolidated gate summary
+  (`evidence/gates_report.json`).
+- **Automation Friendly** – The system exposes a CLI
+  (`python -m workflow_optimizer.cli`) and a thin wrapper script
+  (`scripts/run_workflow_optimizer.py`) that can be invoked by humans or AI
+  agents. Outputs are emitted as JSON for straightforward downstream
+  automation.
+- **Universal Templates** – Run
+  `python -m workflow_optimizer.cli init --output ./workflow-templates` to
+  scaffold intake metadata, evidence schema, gate controller, and submission
+  checklist templates.
+- **Deployment Ready** – Execute
+  `deploy/workflow_optimizer_deploy.sh <config>` to run the full gate suite in
+  CI/CD pipelines or production staging environments.
+
+## Running the Workflow
+
+1. Prepare a configuration file (YAML or JSON) describing the project and
+   evidence locations. A starter file can be generated via
+   `python -m workflow_optimizer.cli init --output ./workflow-templates`.
+2. Populate the referenced project artifacts (metadata, plan, task graph,
+   PRD/architecture, stack report, dry run snapshot, generation manifest,
+   test report, metrics, compliance manifest, submission manifest).
+3. Execute the workflow using either the CLI or deployment script:
+
+```bash
+python -m workflow_optimizer.cli run --config path/to/workflow.yaml
+# or
+./deploy/workflow_optimizer_deploy.sh path/to/workflow.yaml
+```
+
+4. Inspect the evidence directory for per-gate artifacts and consolidated
+   results.
+
+## Configuration Overview
+
+The configuration supports gate overrides to tune thresholds and commands. For
+example:
+
+```yaml
+project_root: ./_generated/project
+metadata_file: ./_generated/project/docs/metadata.json
+evidence_root: ./_generated/project/evidence
+gate_overrides:
+  coverage_threshold: 0.85
+  p95_threshold_ms: 250
+  max_high_vulnerabilities: 0
+  test_command: ["pytest", "-q"]
+```
+
+## Testing
+
+Automated tests in `tests/test_workflow_optimizer.py` validate successful gate
+execution and failure handling. Run `pytest` to execute the suite.
diff --git a/requirements.txt b/requirements.txt
index c0e5c60e36c75806514e9899c3d03c9d7fe359ae..ad81fa25f5501afd0a1eed547d2b5b78514b0d25 100644
--- a/requirements.txt
+++ b/requirements.txt
@@ -7,25 +7,26 @@ python-jose[cryptography]==3.3.0
 passlib[bcrypt]==1.7.4
 python-multipart==0.0.6
 sqlalchemy==2.0.23
 alembic==1.13.1
 asyncpg==0.29.0
 redis==5.0.1
 slowapi==0.1.9
 httpx==0.25.2
 
 # Testing dependencies
 pytest==7.4.3
 pytest-asyncio==0.21.1
 pytest-cov==4.1.0
 pytest-mock==3.12.0
 pytest-xdist==3.5.0
 
 # Code quality
 black==23.11.0
 isort==5.12.0
 mypy==1.7.1
 bandit==1.7.5
 flake8==6.1.0
 
 # Additional utilities
 requests==2.31.0
+PyYAML==6.0.1
diff --git a/scripts/run_workflow_optimizer.py b/scripts/run_workflow_optimizer.py
new file mode 100755
index 0000000000000000000000000000000000000000..e71692fe10541dcce5853885c45cac99a4681ad3
--- /dev/null
+++ b/scripts/run_workflow_optimizer.py
@@ -0,0 +1,12 @@
+#!/usr/bin/env python3
+"""Wrapper script to invoke the workflow optimizer CLI."""
+
+from __future__ import annotations
+
+import sys
+
+from workflow_optimizer.cli import run_cli
+
+
+if __name__ == "__main__":  # pragma: no cover
+    sys.exit(run_cli())
diff --git a/tests/test_workflow_optimizer.py b/tests/test_workflow_optimizer.py
new file mode 100644
index 0000000000000000000000000000000000000000..6430490a40025c05b7251d91880e2a4763754c9a
--- /dev/null
+++ b/tests/test_workflow_optimizer.py
@@ -0,0 +1,114 @@
+from __future__ import annotations
+
+import json
+from pathlib import Path
+
+from workflow_optimizer.config import WorkflowConfig
+from workflow_optimizer.runner import WorkflowOrchestrator
+
+
+def _create_project(tmp_path: Path) -> WorkflowConfig:
+    project = tmp_path / "project"
+    evidence = project / "evidence"
+    docs_dir = project / "docs"
+    metrics_dir = project / "metrics"
+    compliance_dir = project / "compliance"
+    dist_dir = project / "dist"
+    tests_dir = project / "tests"
+
+    for directory in [project, evidence, docs_dir, metrics_dir, compliance_dir, dist_dir, tests_dir]:
+        directory.mkdir(parents=True, exist_ok=True)
+
+    (docs_dir / "metadata.json").write_text(
+        json.dumps({"name": "Demo", "industry": "saas", "project_type": "fullstack"}),
+        encoding="utf-8",
+    )
+    (project / "PLAN.md").write_text("# Plan\n- item", encoding="utf-8")
+    (project / "PLAN.tasks.json").write_text(
+        json.dumps({"tasks": [{"id": "T1", "title": "Task"}]}, indent=2),
+        encoding="utf-8",
+    )
+    (project / "PRD.md").write_text("# PRD\ncontent", encoding="utf-8")
+    (project / "ARCHITECTURE.md").write_text("# ARCH\ncontent", encoding="utf-8")
+    (project / "stack_report.json").write_text(
+        json.dumps({"frontend": "nextjs", "backend": "fastapi"}, indent=2),
+        encoding="utf-8",
+    )
+    (project / "dry_run_snapshot.json").write_text(
+        json.dumps({"files": ["README.md"]}, indent=2),
+        encoding="utf-8",
+    )
+    (project / "generation_manifest.json").write_text(
+        json.dumps({"generated_files": ["src/index.ts"]}, indent=2),
+        encoding="utf-8",
+    )
+    (tests_dir / "report.json").write_text(
+        json.dumps({"status": "passed", "tests": {"total": 1}}, indent=2),
+        encoding="utf-8",
+    )
+    (metrics_dir / "metrics.json").write_text(
+        json.dumps(
+            {
+                "coverage": {"line": 0.9},
+                "performance": {"p95_ms": 250},
+                "security": {"high": 0},
+            },
+            indent=2,
+        ),
+        encoding="utf-8",
+    )
+    (compliance_dir / "compliance.json").write_text(
+        json.dumps({"controls": [{"id": "SOC2-1", "status": "passed"}]}, indent=2),
+        encoding="utf-8",
+    )
+    (dist_dir / "submission_index.json").write_text(
+        json.dumps({"artifacts": ["submission.zip"]}, indent=2),
+        encoding="utf-8",
+    )
+
+    config_data = {
+        "project_root": str(project),
+        "evidence_root": str(evidence),
+        "metadata_file": str(docs_dir / "metadata.json"),
+        "plan_file": str(project / "PLAN.md"),
+        "tasks_file": str(project / "PLAN.tasks.json"),
+        "prd_file": str(project / "PRD.md"),
+        "architecture_file": str(project / "ARCHITECTURE.md"),
+        "stack_report": str(project / "stack_report.json"),
+        "dry_run_snapshot": str(project / "dry_run_snapshot.json"),
+        "generation_manifest": str(project / "generation_manifest.json"),
+        "test_report": str(tests_dir / "report.json"),
+        "metrics_manifest": str(metrics_dir / "metrics.json"),
+        "compliance_manifest": str(compliance_dir / "compliance.json"),
+        "submission_manifest": str(dist_dir / "submission_index.json"),
+        "environment": {"required_binaries": ["python3"]},
+    }
+
+    config_path = tmp_path / "workflow.json"
+    config_path.write_text(json.dumps(config_data, indent=2), encoding="utf-8")
+    return WorkflowConfig.from_dict(config_data)
+
+
+def test_workflow_orchestrator_success(tmp_path: Path) -> None:
+    config = _create_project(tmp_path)
+    orchestrator = WorkflowOrchestrator(config)
+    results = orchestrator.run()
+    assert all(result.status.value == "passed" for result in results)
+    report_path = config.evidence_root / "gates_report.json"
+    assert report_path.exists()
+    manifest_path = config.evidence_root / "index.json"
+    assert manifest_path.exists()
+    report = json.loads(report_path.read_text(encoding="utf-8"))
+    assert report["results"]
+
+
+def test_workflow_orchestrator_metadata_failure(tmp_path: Path) -> None:
+    config = _create_project(tmp_path)
+    metadata_path = config.metadata_file
+    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
+    metadata.pop("project_type")
+    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
+
+    orchestrator = WorkflowOrchestrator(config)
+    results = orchestrator.run()
+    assert results[0].status.value == "failed"
diff --git a/workflow_optimizer/__init__.py b/workflow_optimizer/__init__.py
new file mode 100644
index 0000000000000000000000000000000000000000..402bfcf16be3a0371050074b349ac603256e9446
--- /dev/null
+++ b/workflow_optimizer/__init__.py
@@ -0,0 +1,12 @@
+"""Workflow optimization system for gated automation."""
+
+from .config import WorkflowConfig, load_config
+from .runner import WorkflowOrchestrator
+from .templates import generate_default_templates
+
+__all__ = [
+    "WorkflowConfig",
+    "WorkflowOrchestrator",
+    "load_config",
+    "generate_default_templates",
+]
diff --git a/workflow_optimizer/automation.py b/workflow_optimizer/automation.py
new file mode 100644
index 0000000000000000000000000000000000000000..1f294d80be8150d8a9eec9d8d200e4b062d79948
--- /dev/null
+++ b/workflow_optimizer/automation.py
@@ -0,0 +1,17 @@
+"""Programmatic helpers for executing the workflow orchestrator."""
+
+from __future__ import annotations
+
+from typing import Iterable, List
+
+from .config import load_config
+from .models import GateDefinition, GateResult
+from .runner import WorkflowOrchestrator
+
+
+def execute_workflow(config_path: str, *, gates: Iterable[GateDefinition] | None = None) -> List[GateResult]:
+    """Execute the workflow from a configuration path."""
+
+    config = load_config(config_path)
+    orchestrator = WorkflowOrchestrator(config, gates=gates)
+    return orchestrator.run()
diff --git a/workflow_optimizer/cli.py b/workflow_optimizer/cli.py
new file mode 100644
index 0000000000000000000000000000000000000000..0f8ae0b7a822dc220866afde48bf8c894b4e9b14
--- /dev/null
+++ b/workflow_optimizer/cli.py
@@ -0,0 +1,74 @@
+"""CLI entrypoint for the workflow optimizer."""
+
+from __future__ import annotations
+
+import argparse
+import json
+from pathlib import Path
+from typing import Any
+
+from .config import dump_config_template, load_config
+from .exceptions import ConfigurationError, GateExecutionError, WorkflowError
+from .runner import WorkflowOrchestrator
+from .templates import generate_default_templates
+
+
+def _parse_args() -> argparse.Namespace:
+    parser = argparse.ArgumentParser(description="Workflow optimization orchestrator")
+    subparsers = parser.add_subparsers(dest="command", required=True)
+
+    run_parser = subparsers.add_parser("run", help="Execute the workflow gates")
+    run_parser.add_argument("--config", required=True, help="Path to workflow configuration (YAML/JSON)")
+    run_parser.add_argument(
+        "--no-halt",
+        action="store_true",
+        help="Continue executing gates after failures",
+    )
+    run_parser.add_argument(
+        "--output",
+        help="Optional path to write the gate results JSON report",
+    )
+
+    template_parser = subparsers.add_parser("init", help="Generate default templates")
+    template_parser.add_argument("--output", required=True, help="Directory to write templates")
+    template_parser.add_argument(
+        "--config-path",
+        help="Optional configuration template file path (defaults to workflow.yaml in output dir)",
+    )
+
+    return parser.parse_args()
+
+
+def run_cli(argv: list[str] | None = None) -> int:
+    args = _parse_args()
+    if args.command == "run":
+        try:
+            config = load_config(args.config)
+            orchestrator = WorkflowOrchestrator(config)
+            results = orchestrator.run(halt_on_failure=not args.no_halt)
+        except (ConfigurationError, WorkflowError) as exc:
+            print(json.dumps({"status": "error", "message": str(exc)}))
+            return 1
+        payload: dict[str, Any] = {
+            "status": "ok",
+            "failed": orchestrator.any_failed(results),
+            "results": [result.as_dict() for result in results],
+            "evidence_manifest": str(orchestrator.evidence_collector.manifest_path()),
+        }
+        if args.output:
+            Path(args.output).write_text(json.dumps(payload, indent=2), encoding="utf-8")
+        print(json.dumps(payload, indent=2))
+        return 0
+    if args.command == "init":
+        output_dir = Path(args.output)
+        output_dir.mkdir(parents=True, exist_ok=True)
+        generate_default_templates(output_dir)
+        config_path = Path(args.config_path) if args.config_path else output_dir / "workflow.yaml"
+        dump_config_template(config_path)
+        print(json.dumps({"status": "ok", "templates": str(output_dir), "config": str(config_path)}))
+        return 0
+    raise RuntimeError("Unsupported command")
+
+
+if __name__ == "__main__":  # pragma: no cover
+    raise SystemExit(run_cli())
diff --git a/workflow_optimizer/config.py b/workflow_optimizer/config.py
new file mode 100644
index 0000000000000000000000000000000000000000..76f13a070fd339ad001af0502143102f18594356
--- /dev/null
+++ b/workflow_optimizer/config.py
@@ -0,0 +1,132 @@
+"""Configuration helpers for the workflow optimizer."""
+
+from __future__ import annotations
+
+import json
+from dataclasses import dataclass, field
+from pathlib import Path
+from typing import Any, Dict, Optional
+
+import yaml
+
+from .exceptions import ConfigurationError
+
+
+@dataclass(slots=True)
+class WorkflowConfig:
+    """Runtime configuration for the workflow orchestrator."""
+
+    project_root: Path
+    evidence_root: Path
+    metadata_file: Path
+    plan_file: Path
+    tasks_file: Path
+    prd_file: Path
+    architecture_file: Path
+    stack_report: Path
+    dry_run_snapshot: Path
+    generation_manifest: Path
+    test_report: Path
+    metrics_manifest: Path
+    compliance_manifest: Path
+    submission_manifest: Path
+    gate_overrides: Dict[str, Any] = field(default_factory=dict)
+    environment: Dict[str, Any] = field(default_factory=dict)
+
+    @classmethod
+    def from_dict(cls, data: Dict[str, Any], base_path: Path | None = None) -> "WorkflowConfig":
+        if base_path is None:
+            base_path = Path.cwd()
+        try:
+            root = base_path.joinpath(data["project_root"]).resolve()
+        except KeyError as exc:
+            raise ConfigurationError("`project_root` missing from workflow configuration") from exc
+        evidence_root = cls._resolve_path(base_path, data, "evidence_root", default=root / "evidence")
+        return cls(
+            project_root=root,
+            evidence_root=evidence_root,
+            metadata_file=cls._resolve_path(base_path, data, "metadata_file", root / "metadata.json"),
+            plan_file=cls._resolve_path(base_path, data, "plan_file", root / "PLAN.md"),
+            tasks_file=cls._resolve_path(base_path, data, "tasks_file", root / "PLAN.tasks.json"),
+            prd_file=cls._resolve_path(base_path, data, "prd_file", root / "PRD.md"),
+            architecture_file=cls._resolve_path(base_path, data, "architecture_file", root / "ARCHITECTURE.md"),
+            stack_report=cls._resolve_path(base_path, data, "stack_report", root / "stack_report.json"),
+            dry_run_snapshot=cls._resolve_path(base_path, data, "dry_run_snapshot", root / "dry_run_snapshot.json"),
+            generation_manifest=cls._resolve_path(base_path, data, "generation_manifest", root / "generation_manifest.json"),
+            test_report=cls._resolve_path(base_path, data, "test_report", root / "tests/report.json"),
+            metrics_manifest=cls._resolve_path(base_path, data, "metrics_manifest", root / "metrics/metrics.json"),
+            compliance_manifest=cls._resolve_path(
+                base_path, data, "compliance_manifest", root / "compliance/compliance.json"
+            ),
+            submission_manifest=cls._resolve_path(
+                base_path, data, "submission_manifest", root / "dist/submission_index.json"
+            ),
+            gate_overrides=data.get("gate_overrides", {}),
+            environment=data.get("environment", {}),
+        )
+
+    @staticmethod
+    def _resolve_path(base: Path, data: Dict[str, Any], key: str, default: Path) -> Path:
+        value = data.get(key)
+        if value is None:
+            return default
+        candidate = base.joinpath(value).resolve()
+        return candidate
+
+    def ensure_directories(self) -> None:
+        self.project_root.mkdir(parents=True, exist_ok=True)
+        self.evidence_root.mkdir(parents=True, exist_ok=True)
+
+
+def load_config(path: str | Path, overrides: Optional[Dict[str, Any]] = None) -> WorkflowConfig:
+    """Load a workflow configuration from YAML or JSON."""
+
+    config_path = Path(path).expanduser().resolve()
+    if not config_path.exists():
+        raise ConfigurationError(f"Configuration file not found: {config_path}")
+
+    raw: Dict[str, Any]
+    if config_path.suffix in {".yaml", ".yml"}:
+        with config_path.open("r", encoding="utf-8") as fh:
+            raw = yaml.safe_load(fh) or {}
+    else:
+        with config_path.open("r", encoding="utf-8") as fh:
+            raw = json.load(fh)
+
+    if overrides:
+        raw.update(overrides)
+
+    cfg = WorkflowConfig.from_dict(raw, base_path=config_path.parent)
+    cfg.ensure_directories()
+    return cfg
+
+
+def dump_config_template(path: Path, *, project_root: str = "./_project") -> None:
+    """Write a default configuration template to ``path``."""
+
+    template = {
+        "project_root": project_root,
+        "evidence_root": "./_project/evidence",
+        "metadata_file": "./_project/docs/metadata.json",
+        "plan_file": "./_project/PLAN.md",
+        "tasks_file": "./_project/PLAN.tasks.json",
+        "prd_file": "./_project/PRD.md",
+        "architecture_file": "./_project/ARCHITECTURE.md",
+        "stack_report": "./_project/evidence/stack_report.json",
+        "dry_run_snapshot": "./_project/evidence/dry_run_snapshot.json",
+        "generation_manifest": "./_project/evidence/generation_manifest.json",
+        "test_report": "./_project/tests/report.json",
+        "metrics_manifest": "./_project/metrics/metrics.json",
+        "compliance_manifest": "./_project/compliance/compliance.json",
+        "submission_manifest": "./_project/dist/submission_index.json",
+        "environment": {
+            "required_binaries": ["python3", "git"],
+        },
+    }
+    path.parent.mkdir(parents=True, exist_ok=True)
+    if path.suffix in {".yaml", ".yml"}:
+        with path.open("w", encoding="utf-8") as fh:
+            yaml.safe_dump(template, fh, sort_keys=False)
+    else:
+        with path.open("w", encoding="utf-8") as fh:
+            json.dump(template, fh, indent=2)
diff --git a/workflow_optimizer/evidence.py b/workflow_optimizer/evidence.py
new file mode 100644
index 0000000000000000000000000000000000000000..fc074182194d7fcb31460f99f675652888fd5f63
--- /dev/null
+++ b/workflow_optimizer/evidence.py
@@ -0,0 +1,52 @@
+"""Evidence collection helpers."""
+
+from __future__ import annotations
+
+import json
+from pathlib import Path
+from typing import Dict, Iterable, List
+
+from .exceptions import EvidenceError
+from .models import EvidenceRecord
+
+
+class EvidenceCollector:
+    """Collects and persists evidence records for gate executions."""
+
+    def __init__(self, root: Path) -> None:
+        self.root = root
+        self._records: List[EvidenceRecord] = []
+        self.root.mkdir(parents=True, exist_ok=True)
+
+    def record(self, evidence: EvidenceRecord) -> None:
+        """Record evidence and write to disk if it references an artifact."""
+
+        if evidence.artifact_path and not evidence.artifact_path.exists():
+            raise EvidenceError(f"Evidence artifact not found: {evidence.artifact_path}")
+        self._records.append(evidence)
+        self._write_manifest()
+
+    def extend(self, evidence_list: Iterable[EvidenceRecord]) -> None:
+        for evidence in evidence_list:
+            self.record(evidence)
+
+    def _write_manifest(self) -> None:
+        manifest = [
+            {
+                "gate": record.gate,
+                "description": record.description,
+                "artifact_path": str(record.artifact_path) if record.artifact_path else None,
+                "metadata": record.metadata,
+                "timestamp": record.timestamp,
+            }
+            for record in self._records
+        ]
+        manifest_path = self.root / "index.json"
+        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
+
+    def manifest_path(self) -> Path:
+        return self.root / "index.json"
+
+    @property
+    def records(self) -> List[EvidenceRecord]:
+        return list(self._records)
diff --git a/workflow_optimizer/exceptions.py b/workflow_optimizer/exceptions.py
new file mode 100644
index 0000000000000000000000000000000000000000..739ed1ee61a5469b9f8d98263b926dd061cd6b06
--- /dev/null
+++ b/workflow_optimizer/exceptions.py
@@ -0,0 +1,19 @@
+"""Custom exceptions for the workflow optimizer."""
+
+from __future__ import annotations
+
+
+class WorkflowError(RuntimeError):
+    """Base class for workflow related errors."""
+
+
+class ConfigurationError(WorkflowError):
+    """Raised when configuration files are invalid or incomplete."""
+
+
+class GateExecutionError(WorkflowError):
+    """Raised when a gate fails to execute successfully."""
+
+
+class EvidenceError(WorkflowError):
+    """Raised when evidence cannot be collected or persisted."""
diff --git a/workflow_optimizer/gates/__init__.py b/workflow_optimizer/gates/__init__.py
new file mode 100644
index 0000000000000000000000000000000000000000..cf0d16fce112c185fd18964d078b21bc001af8c4
--- /dev/null
+++ b/workflow_optimizer/gates/__init__.py
@@ -0,0 +1,5 @@
+"""Gate implementations exposed for orchestrator configuration."""
+
+from . import implementations
+
+__all__ = ["implementations"]
diff --git a/workflow_optimizer/gates/base.py b/workflow_optimizer/gates/base.py
new file mode 100644
index 0000000000000000000000000000000000000000..4f1faeaadf4574f2360b650e205612f270941422
--- /dev/null
+++ b/workflow_optimizer/gates/base.py
@@ -0,0 +1,70 @@
+"""Base helpers for gate implementations."""
+
+from __future__ import annotations
+
+import subprocess
+import time
+from pathlib import Path
+from typing import Iterable, Sequence
+
+from ..exceptions import GateExecutionError
+from ..models import EvidenceRecord, GateContext
+
+
+def run_command(context: GateContext, command: Sequence[str], *, timeout: int | None = None) -> EvidenceRecord:
+    """Execute a shell command and capture its output as evidence."""
+
+    start = time.monotonic()
+    try:
+        completed = subprocess.run(
+            command,
+            cwd=context.project_root,
+            check=True,
+            capture_output=True,
+            text=True,
+            timeout=timeout,
+        )
+    except subprocess.CalledProcessError as exc:
+        raise GateExecutionError(
+            f"Command {' '.join(command)} failed with exit code {exc.returncode}: {exc.stderr.strip()}"
+        ) from exc
+    except subprocess.TimeoutExpired as exc:
+        raise GateExecutionError(f"Command {' '.join(command)} timed out after {timeout}s") from exc
+
+    duration = time.monotonic() - start
+    log_path = context.evidence_root / f"{'_'.join(command[:2])}_output.log"
+    log_path.write_text(completed.stdout, encoding="utf-8")
+    metadata = {
+        "command": list(command),
+        "duration_seconds": round(duration, 3),
+        "return_code": completed.returncode,
+    }
+    return EvidenceRecord(
+        gate="command",
+        description=f"Executed command: {' '.join(command)}",
+        artifact_path=log_path,
+        metadata=metadata,
+    )
+
+
+def require_files_exist(context: GateContext, paths: Iterable[Path]) -> None:
+    missing = [str(path) for path in paths if not path.exists()]
+    if missing:
+        raise GateExecutionError(f"Missing required files: {', '.join(missing)}")
+
+
+def read_json(path: Path) -> dict:
+    import json
+
+    if not path.exists():
+        raise GateExecutionError(f"JSON file not found: {path}")
+    try:
+        return json.loads(path.read_text(encoding="utf-8"))
+    except json.JSONDecodeError as exc:
+        raise GateExecutionError(f"Invalid JSON in {path}: {exc}") from exc
+
+
+def ensure_keys(data: dict, required_keys: Iterable[str], *, file_path: Path) -> None:
+    missing = [key for key in required_keys if key not in data]
+    if missing:
+        raise GateExecutionError(f"Missing keys {missing} in {file_path}")
diff --git a/workflow_optimizer/gates/implementations.py b/workflow_optimizer/gates/implementations.py
new file mode 100644
index 0000000000000000000000000000000000000000..dfb98ac9338e71c41c74187769ce34172ad92ae5
--- /dev/null
+++ b/workflow_optimizer/gates/implementations.py
@@ -0,0 +1,258 @@
+"""Concrete gate implementations."""
+
+from __future__ import annotations
+
+import json
+import shutil
+from pathlib import Path
+from typing import List
+
+from ..exceptions import GateExecutionError
+from ..models import EvidenceRecord, GateContext
+from .base import ensure_keys, read_json, require_files_exist, run_command
+
+
+def _write_summary(path: Path, data: dict) -> Path:
+    path.parent.mkdir(parents=True, exist_ok=True)
+    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
+    return path
+
+
+def metadata_gate(context: GateContext) -> EvidenceRecord:
+    require_files_exist(context, [context.config["metadata_file"]])
+    metadata = read_json(context.config["metadata_file"])
+    ensure_keys(metadata, ["name", "industry", "project_type"], file_path=context.config["metadata_file"])
+    summary_path = _write_summary(
+        context.evidence_root / "metadata_gate.json",
+        {
+            "detected_name": metadata.get("name"),
+            "industry": metadata.get("industry"),
+            "project_type": metadata.get("project_type"),
+        },
+    )
+    return EvidenceRecord(
+        gate="metadata",
+        description="Validated metadata completeness",
+        artifact_path=summary_path,
+        metadata={"fields": sorted(metadata.keys())},
+    )
+
+
+def environment_gate(context: GateContext) -> EvidenceRecord:
+    required = context.config.get("environment", {}).get("required_binaries", [])
+    missing: List[str] = []
+    binaries: List[dict] = []
+    for binary in required:
+        path = shutil.which(binary)
+        if path:
+            binaries.append({"binary": binary, "path": path})
+        else:
+            missing.append(binary)
+    if missing:
+        raise GateExecutionError(f"Missing required binaries: {', '.join(missing)}")
+    summary_path = _write_summary(
+        context.evidence_root / "environment_gate.json",
+        {"binaries": binaries},
+    )
+    return EvidenceRecord(
+        gate="environment",
+        description="Verified required tooling is available",
+        artifact_path=summary_path,
+        metadata={"count": len(binaries)},
+    )
+
+
+def planning_gate(context: GateContext) -> EvidenceRecord:
+    plan_file = context.config["plan_file"]
+    require_files_exist(context, [plan_file])
+    content = plan_file.read_text(encoding="utf-8")
+    if "#" not in content:
+        raise GateExecutionError("PLAN.md appears to be empty or missing headings")
+    summary_path = _write_summary(
+        context.evidence_root / "planning_gate.json",
+        {"characters": len(content)},
+    )
+    return EvidenceRecord(
+        gate="planning",
+        description="Validated plan artifact",
+        artifact_path=summary_path,
+        metadata={"length": len(content)},
+    )
+
+
+def task_graph_gate(context: GateContext) -> EvidenceRecord:
+    tasks = read_json(context.config["tasks_file"])
+    entries = tasks.get("tasks") if isinstance(tasks, dict) else None
+    if not entries or not isinstance(entries, list):
+        raise GateExecutionError("PLAN.tasks.json must contain a list of tasks under `tasks`")
+    ids = {task.get("id") for task in entries if isinstance(task, dict)}
+    if None in ids:
+        raise GateExecutionError("All tasks require an `id`")
+    if len(ids) != len(entries):
+        raise GateExecutionError("Duplicate task ids detected")
+    summary_path = _write_summary(
+        context.evidence_root / "task_graph_gate.json",
+        {"task_count": len(entries)},
+    )
+    return EvidenceRecord(
+        gate="task_graph",
+        description="Validated task graph structure",
+        artifact_path=summary_path,
+        metadata={"task_count": len(entries)},
+    )
+
+
+def prd_gate(context: GateContext) -> List[EvidenceRecord]:
+    prd_file = context.config["prd_file"]
+    architecture = context.config["architecture_file"]
+    require_files_exist(context, [prd_file, architecture])
+    prd_content = prd_file.read_text(encoding="utf-8")
+    arch_content = architecture.read_text(encoding="utf-8")
+    if "#" not in prd_content or "#" not in arch_content:
+        raise GateExecutionError("PRD or ARCHITECTURE documents appear incomplete")
+    prd_summary = _write_summary(
+        context.evidence_root / "prd_gate.json",
+        {"prd_characters": len(prd_content), "architecture_characters": len(arch_content)},
+    )
+    return [
+        EvidenceRecord(
+            gate="prd",
+            description="Validated PRD and architecture assets",
+            artifact_path=prd_summary,
+            metadata={"prd_sections": prd_content.count("# "), "architecture_sections": arch_content.count("# ")},
+        )
+    ]
+
+
+def stack_gate(context: GateContext) -> EvidenceRecord:
+    stack_data = read_json(context.config["stack_report"])
+    ensure_keys(stack_data, ["frontend", "backend"], file_path=context.config["stack_report"])
+    summary_path = _write_summary(context.evidence_root / "stack_gate.json", stack_data)
+    return EvidenceRecord(
+        gate="stack",
+        description="Validated stack selection",
+        artifact_path=summary_path,
+        metadata={"frontend": stack_data["frontend"], "backend": stack_data["backend"]},
+    )
+
+
+def dry_run_gate(context: GateContext) -> EvidenceRecord:
+    snapshot = read_json(context.config["dry_run_snapshot"])
+    files = snapshot.get("files", [])
+    if not files:
+        raise GateExecutionError("Dry run snapshot missing file list")
+    summary_path = _write_summary(
+        context.evidence_root / "dry_run_gate.json",
+        {"file_count": len(files)},
+    )
+    return EvidenceRecord(
+        gate="dry_run",
+        description="Validated dry run output",
+        artifact_path=summary_path,
+        metadata={"file_count": len(files)},
+    )
+
+
+def generation_gate(context: GateContext) -> EvidenceRecord:
+    manifest = read_json(context.config["generation_manifest"])
+    generated = manifest.get("generated_files", [])
+    if not generated:
+        raise GateExecutionError("Generation manifest missing `generated_files`")
+    summary_path = _write_summary(
+        context.evidence_root / "generation_gate.json",
+        {"generated_file_count": len(generated)},
+    )
+    return EvidenceRecord(
+        gate="generation",
+        description="Validated generation manifest",
+        artifact_path=summary_path,
+        metadata={"generated_file_count": len(generated)},
+    )
+
+
+def testing_gate(context: GateContext) -> EvidenceRecord:
+    overrides = context.config.get("gate_overrides", {})
+    command = overrides.get("test_command")
+    if command:
+        evidence = run_command(context, command)
+        evidence.gate = "testing"  # type: ignore[attr-defined]
+        return evidence
+    report = read_json(context.config["test_report"])
+    status = report.get("status")
+    if status != "passed":
+        raise GateExecutionError("Test report does not indicate success")
+    summary_path = _write_summary(
+        context.evidence_root / "testing_gate.json",
+        {"status": status, "tests": report.get("tests", {})},
+    )
+    return EvidenceRecord(
+        gate="testing",
+        description="Validated automated tests",
+        artifact_path=summary_path,
+        metadata={"status": status},
+    )
+
+
+def metrics_gate(context: GateContext) -> EvidenceRecord:
+    metrics = read_json(context.config["metrics_manifest"])
+    overrides = context.config.get("gate_overrides", {})
+    coverage_threshold = overrides.get("coverage_threshold", 0.8)
+    perf_threshold = overrides.get("p95_threshold_ms", 300)
+    max_vulnerabilities = overrides.get("max_high_vulnerabilities", 0)
+
+    coverage = metrics.get("coverage", {}).get("line", 0)
+    perf = metrics.get("performance", {}).get("p95_ms", float("inf"))
+    vulnerabilities = metrics.get("security", {}).get("high", 0)
+
+    if coverage < coverage_threshold:
+        raise GateExecutionError(f"Coverage {coverage} below threshold {coverage_threshold}")
+    if perf > perf_threshold:
+        raise GateExecutionError(f"Performance P95 {perf}ms exceeds threshold {perf_threshold}ms")
+    if vulnerabilities > max_vulnerabilities:
+        raise GateExecutionError(
+            f"High vulnerabilities {vulnerabilities} exceed maximum {max_vulnerabilities}"
+        )
+
+    summary_path = _write_summary(
+        context.evidence_root / "metrics_gate.json",
+        {
+            "coverage": coverage,
+            "p95_ms": perf,
+            "high_vulnerabilities": vulnerabilities,
+        },
+    )
+    return EvidenceRecord(
+        gate="metrics",
+        description="Validated metrics and security thresholds",
+        artifact_path=summary_path,
+        metadata={
+            "coverage_threshold": coverage_threshold,
+            "p95_threshold_ms": perf_threshold,
+            "max_high_vulnerabilities": max_vulnerabilities,
+        },
+    )
+
+
+def compliance_gate(context: GateContext) -> EvidenceRecord:
+    compliance = read_json(context.config["compliance_manifest"])
+    controls = compliance.get("controls", [])
+    if not controls:
+        raise GateExecutionError("Compliance manifest missing controls")
+    failing = [ctrl for ctrl in controls if ctrl.get("status") not in {"passed", "approved"}]
+    if failing:
+        raise GateExecutionError(f"Compliance controls failing: {[c.get('id') for c in failing]}")
+    submission_manifest = read_json(context.config["submission_manifest"])
+    ensure_keys(submission_manifest, ["artifacts"], file_path=context.config["submission_manifest"])
+    summary_path = _write_summary(
+        context.evidence_root / "compliance_gate.json",
+        {
+            "controls": [ctrl.get("id") for ctrl in controls],
+            "submission_artifacts": submission_manifest.get("artifacts", []),
+        },
+    )
+    return EvidenceRecord(
+        gate="compliance",
+        description="Validated compliance controls and submission pack",
+        artifact_path=summary_path,
+        metadata={"artifact_count": len(submission_manifest.get("artifacts", []))},
+    )
diff --git a/workflow_optimizer/models.py b/workflow_optimizer/models.py
new file mode 100644
index 0000000000000000000000000000000000000000..927fd86cba9d98d52be32d81b42f0510c33072eb
--- /dev/null
+++ b/workflow_optimizer/models.py
@@ -0,0 +1,93 @@
+"""Data models used by the workflow optimizer."""
+
+from __future__ import annotations
+
+import datetime as _dt
+from dataclasses import dataclass, field
+from enum import Enum
+from pathlib import Path
+from typing import Any, Callable, Dict, Iterable, List, Optional
+
+
+class GateStatus(str, Enum):
+    """Enumeration of gate execution outcomes."""
+
+    PASSED = "passed"
+    FAILED = "failed"
+    SKIPPED = "skipped"
+
+
+@dataclass(slots=True)
+class EvidenceRecord:
+    """Captured evidence for a particular gate execution."""
+
+    gate: str
+    description: str
+    artifact_path: Optional[Path] = None
+    metadata: Dict[str, Any] = field(default_factory=dict)
+    timestamp: str = field(
+        default_factory=lambda: _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
+    )
+
+
+@dataclass(slots=True)
+class GateContext:
+    """Context passed to gates during execution."""
+
+    project_root: Path
+    evidence_root: Path
+    config: Dict[str, Any] = field(default_factory=dict)
+
+    def resolve(self, *parts: str | Path) -> Path:
+        """Resolve a path relative to the project root."""
+
+        return self.project_root.joinpath(*map(str, parts))
+
+
+ActionType = Callable[[GateContext], EvidenceRecord | Iterable[EvidenceRecord] | None]
+
+
+@dataclass(slots=True)
+class GateDefinition:
+    """Description of a gate that can be executed."""
+
+    name: str
+    description: str
+    action: ActionType
+    optional: bool = False
+    evidence_dir: Optional[str] = None
+    tags: Iterable[str] = field(default_factory=list)
+
+
+@dataclass(slots=True)
+class GateResult:
+    """Result of executing a gate."""
+
+    definition: GateDefinition
+    status: GateStatus
+    message: str
+    evidence: List[EvidenceRecord] = field(default_factory=list)
+    duration_seconds: float = 0.0
+
+    @property
+    def name(self) -> str:
+        return self.definition.name
+
+    def as_dict(self) -> Dict[str, Any]:
+        return {
+            "name": self.definition.name,
+            "description": self.definition.description,
+            "status": self.status.value,
+            "message": self.message,
+            "duration_seconds": self.duration_seconds,
+            "evidence": [
+                {
+                    "description": e.description,
+                    "artifact_path": str(e.artifact_path) if e.artifact_path else None,
+                    "metadata": e.metadata,
+                    "timestamp": e.timestamp,
+                }
+                for e in self.evidence
+            ],
+            "tags": list(self.definition.tags),
+        }
diff --git a/workflow_optimizer/runner.py b/workflow_optimizer/runner.py
new file mode 100644
index 0000000000000000000000000000000000000000..2e882af46c8e0a524d6531523bc0d2299eb976de
--- /dev/null
+++ b/workflow_optimizer/runner.py
@@ -0,0 +1,118 @@
+"""Gate orchestration for the workflow optimizer."""
+
+from __future__ import annotations
+
+import json
+import time
+from typing import Iterable, List
+
+from .config import WorkflowConfig
+from .evidence import EvidenceCollector
+from .exceptions import GateExecutionError
+from .models import EvidenceRecord, GateContext, GateDefinition, GateResult, GateStatus
+from .gates import implementations as impl
+
+
+class WorkflowOrchestrator:
+    """Executes workflow gates sequentially and collects evidence."""
+
+    def __init__(self, config: WorkflowConfig, *, gates: Iterable[GateDefinition] | None = None) -> None:
+        self.config = config
+        self.evidence_collector = EvidenceCollector(config.evidence_root)
+        self.gates: List[GateDefinition] = list(gates) if gates else self._default_gates()
+
+    def _default_gates(self) -> List[GateDefinition]:
+        return [
+            GateDefinition("metadata", "Validate intake metadata", impl.metadata_gate, tags=["intake"]),
+            GateDefinition("environment", "Verify environment readiness", impl.environment_gate, tags=["intake"]),
+            GateDefinition("planning", "Validate plan artifacts", impl.planning_gate, tags=["planning"]),
+            GateDefinition("task_graph", "Validate task graph integrity", impl.task_graph_gate, tags=["planning"]),
+            GateDefinition("prd", "Validate PRD and architecture", impl.prd_gate, tags=["design"]),
+            GateDefinition("stack", "Verify stack selection", impl.stack_gate, tags=["design"]),
+            GateDefinition("dry_run", "Check dry run output", impl.dry_run_gate, tags=["generation"]),
+            GateDefinition("generation", "Validate generation manifest", impl.generation_gate, tags=["generation"]),
+            GateDefinition("testing", "Confirm automated tests pass", impl.testing_gate, tags=["quality"]),
+            GateDefinition("metrics", "Validate metrics & security thresholds", impl.metrics_gate, tags=["quality"]),
+            GateDefinition("compliance", "Verify compliance and submission", impl.compliance_gate, tags=["compliance"]),
+        ]
+
+    def _build_context(self) -> GateContext:
+        config_map = {
+            "metadata_file": self.config.metadata_file,
+            "plan_file": self.config.plan_file,
+            "tasks_file": self.config.tasks_file,
+            "prd_file": self.config.prd_file,
+            "architecture_file": self.config.architecture_file,
+            "stack_report": self.config.stack_report,
+            "dry_run_snapshot": self.config.dry_run_snapshot,
+            "generation_manifest": self.config.generation_manifest,
+            "test_report": self.config.test_report,
+            "metrics_manifest": self.config.metrics_manifest,
+            "compliance_manifest": self.config.compliance_manifest,
+            "submission_manifest": self.config.submission_manifest,
+            "gate_overrides": self.config.gate_overrides,
+            "environment": self.config.environment,
+        }
+        return GateContext(
+            project_root=self.config.project_root,
+            evidence_root=self.config.evidence_root,
+            config=config_map,
+        )
+
+    def run(self, *, halt_on_failure: bool = True) -> List[GateResult]:
+        context = self._build_context()
+        results: List[GateResult] = []
+        for definition in self.gates:
+            start = time.monotonic()
+            try:
+                result = self._run_gate(definition, context)
+            except GateExecutionError as exc:
+                duration = time.monotonic() - start
+                gate_result = GateResult(
+                    definition=definition,
+                    status=GateStatus.FAILED,
+                    message=str(exc),
+                    duration_seconds=duration,
+                )
+                results.append(gate_result)
+                if halt_on_failure:
+                    break
+                else:
+                    continue
+            else:
+                duration = time.monotonic() - start
+                result.duration_seconds = duration
+                results.append(result)
+        self._write_gate_report(results)
+        return results
+
+    def _run_gate(self, definition: GateDefinition, context: GateContext) -> GateResult:
+        outcome = definition.action(context)
+        evidence_records: List[EvidenceRecord] = []
+        if isinstance(outcome, EvidenceRecord):
+            evidence_records = [outcome]
+        elif outcome is None:
+            evidence_records = []
+        else:
+            evidence_records = list(outcome)
+        if evidence_records:
+            for record in evidence_records:
+                record.gate = definition.name
+            self.evidence_collector.extend(evidence_records)
+        return GateResult(
+            definition=definition,
+            status=GateStatus.PASSED,
+            message="Gate passed",
+            evidence=evidence_records,
+        )
+
+    def _write_gate_report(self, results: List[GateResult]) -> None:
+        report_path = self.config.evidence_root / "gates_report.json"
+        data = {
+            "project_root": str(self.config.project_root),
+            "results": [result.as_dict() for result in results],
+        }
+        report_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
+
+    def any_failed(self, results: Iterable[GateResult]) -> bool:
+        return any(result.status is GateStatus.FAILED for result in results)
diff --git a/workflow_optimizer/templates.py b/workflow_optimizer/templates.py
new file mode 100644
index 0000000000000000000000000000000000000000..d21c7b62b2cf4181fe9fdeb385638b5cb6c1f434
--- /dev/null
+++ b/workflow_optimizer/templates.py
@@ -0,0 +1,71 @@
+"""Template generation utilities for the workflow optimizer."""
+
+from __future__ import annotations
+
+import json
+from pathlib import Path
+from typing import Dict
+
+
+def _write(path: Path, data: Dict) -> None:
+    path.parent.mkdir(parents=True, exist_ok=True)
+    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
+
+
+def generate_default_templates(output_dir: Path) -> None:
+    """Generate universal templates for the workflow system."""
+
+    intake_template = {
+        "name": "Example Project",
+        "industry": "saas",
+        "project_type": "fullstack",
+        "compliance": ["soc2"],
+        "features": ["analytics", "collaboration"],
+    }
+    _write(output_dir / "intake_metadata.json", intake_template)
+
+    evidence_schema = {
+        "type": "object",
+        "required": ["gate", "description", "timestamp"],
+        "properties": {
+            "gate": {"type": "string"},
+            "description": {"type": "string"},
+            "artifact_path": {"type": ["string", "null"]},
+            "metadata": {"type": "object"},
+            "timestamp": {"type": "string", "format": "date-time"},
+        },
+    }
+    _write(output_dir / "evidence_schema.json", evidence_schema)
+
+    gate_controller = {
+        "version": 1,
+        "gates": [
+            {"name": "metadata", "description": "Validate intake metadata"},
+            {"name": "environment", "description": "Verify environment readiness"},
+            {"name": "planning", "description": "Validate plan artifacts"},
+            {"name": "task_graph", "description": "Validate task graph"},
+            {"name": "prd", "description": "Validate PRD & architecture"},
+            {"name": "stack", "description": "Validate stack selection"},
+            {"name": "dry_run", "description": "Validate dry run output"},
+            {"name": "generation", "description": "Validate generation manifest"},
+            {"name": "testing", "description": "Validate automated tests"},
+            {"name": "metrics", "description": "Validate metrics thresholds"},
+            {"name": "compliance", "description": "Validate compliance"},
+        ],
+    }
+    _write(output_dir / "gate_controller.json", gate_controller)
+
+    checklist = {
+        "sections": [
+            {
+                "title": "Submission Readiness",
+                "items": [
+                    "All gates passed",
+                    "Evidence manifest exported",
+                    "Submission pack generated",
+                    "Compliance approvals attached",
+                ],
+            }
+        ]
+    }
+    _write(output_dir / "submission_checklist.json", checklist)
