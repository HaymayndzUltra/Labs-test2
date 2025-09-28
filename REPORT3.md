diff --git a/Makefile b/Makefile
index cdc09e00c0996e56f29d414bb71442c7ca4451fc..e3ca63eddd02849d9901d643f6e53c30ce71dfda 100644
--- a/Makefile
+++ b/Makefile
@@ -64,25 +64,28 @@ clean:
 	rm -rf node_modules/
 	rm -rf venv/
 	rm -rf __pycache__/
 	rm -rf dist/
 	rm -rf build/
 	docker-compose down -v
 
 lifecycle:
 	@$(if $(NAME),:,echo "[lifecycle] NAME not provided; set NAME=<client> or ensure workflow.config.json has it." >&2;)
 	@$(if $(INDUSTRY),:,echo "[lifecycle] INDUSTRY not provided; set INDUSTRY=<sector> or rely on workflow.config.json." >&2;)
 	@$(if $(PROJECT_TYPE),:,echo "[lifecycle] PROJECT_TYPE not provided; set PROJECT_TYPE=<type> or rely on workflow.config.json." >&2;)
 	@$(if $(FE),:,echo "[lifecycle] FE not provided; set FE=<frontend> or rely on workflow.config.json." >&2;)
 	@$(if $(BE),:,echo "[lifecycle] BE not provided; set BE=<backend> or rely on workflow.config.json." >&2;)
 	@$(if $(DB),:,echo "[lifecycle] DB not provided; set DB=<database> or rely on workflow.config.json." >&2;)
 	@$(if $(LIFECYCLE_ENV),env $(LIFECYCLE_ENV) ,) ./scripts/e2e_from_brief.sh
 
 pipeline-validate:
 	@if [ -z "$(FRONTEND_URL)" ]; then echo "FRONTEND_URL is required" >&2; exit 1; fi
 	@if [ -z "$(API_URL)" ]; then echo "API_URL is required" >&2; exit 1; fi
 	@if [ -z "$(DB_URL)" ]; then echo "DB_URL is required" >&2; exit 1; fi
 	@mkdir -p reports
 	@python scripts/health/check_deployment.py --environment $(ENV) --frontend-url $(FRONTEND_URL) --api-url $(API_URL) --db-url $(DB_URL) --out reports/$(ENV)-pipeline-validation.json
 
 bootstrap:
 	@python3 scripts/bootstrap_project.py $(if $(NAME),--name "$(NAME)") $(if $(INDUSTRY),--industry "$(INDUSTRY)") $(if $(PROJECT_TYPE),--project-type "$(PROJECT_TYPE)") $(if $(FE),--frontend "$(FE)") $(if $(BE),--backend "$(BE)") $(if $(DB),--database "$(DB)") $(if $(AUTH),--auth "$(AUTH)") $(if $(DEPLOY),--deploy "$(DEPLOY)") $(if $(COMPLIANCE),--compliance "$(COMPLIANCE)") $(if $(CONFIG_FILE),--config-file "$(CONFIG_FILE)") $(if $(OUTPUT_ROOT),--output-root "$(OUTPUT_ROOT)") $(if $(FORCE_OUTPUT),--force) $(if $(BOOTSTRAP_UPDATE_CONFIG),--update-config)
+
+workflow-automation:
+	python scripts/run_workflow.py $(if $(CONFIG),--config "$(CONFIG)") $(if $(PROJECT_ROOT),--project-root "$(PROJECT_ROOT)")
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
diff --git a/scripts/deploy/package_workflow.py b/scripts/deploy/package_workflow.py
new file mode 100755
index 0000000000000000000000000000000000000000..c025098a85975dc13475c965671ea3ac74785b6d
--- /dev/null
+++ b/scripts/deploy/package_workflow.py
@@ -0,0 +1,52 @@
+#!/usr/bin/env python3
+"""Package workflow automation assets for deployment."""
+from __future__ import annotations
+
+import argparse
+import shutil
+from pathlib import Path
+
+ASSET_DIRS = [
+    "workflow_automation",
+    "workflow",
+    "scripts/run_workflow.py",
+    "scripts/evidence_report.py",
+]
+
+
+def package(output: Path) -> None:
+    output = output.resolve()
+    if output.exists():
+        if output.is_dir():
+            shutil.rmtree(output)
+        else:
+            output.unlink()
+    output.mkdir(parents=True, exist_ok=True)
+
+    for asset in ASSET_DIRS:
+        src = Path(asset)
+        dest = output / src.name
+        if src.is_dir():
+            shutil.copytree(src, dest)
+        else:
+            dest.parent.mkdir(parents=True, exist_ok=True)
+            shutil.copy2(src, dest)
+
+    archive_path = shutil.make_archive(str(output), "zip", root_dir=output)
+    print(f"Packaged workflow assets into {archive_path}")
+
+
+def parse_args() -> argparse.Namespace:
+    parser = argparse.ArgumentParser(description=__doc__)
+    parser.add_argument(
+        "--output",
+        type=Path,
+        default=Path("deploy/workflow_bundle"),
+        help="Directory where packaged assets will be written",
+    )
+    return parser.parse_args()
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    package(args.output)
diff --git a/scripts/evidence_report.py b/scripts/evidence_report.py
new file mode 100755
index 0000000000000000000000000000000000000000..16fad8128cdb65f0f7e6bf7707f1dd9d922c008c
--- /dev/null
+++ b/scripts/evidence_report.py
@@ -0,0 +1,39 @@
+#!/usr/bin/env python3
+"""Generate a consolidated evidence report from a workflow run."""
+from __future__ import annotations
+
+import argparse
+import json
+from pathlib import Path
+from typing import Any, Dict
+
+
+def load_manifest(path: Path) -> Dict[str, Any]:
+    if not path.exists():
+        raise FileNotFoundError(f"Evidence manifest not found: {path}")
+    return json.loads(path.read_text(encoding="utf-8"))
+
+
+def generate_report(manifest_path: Path, output: Path) -> None:
+    manifest = load_manifest(manifest_path)
+    report_lines = ["# Evidence Report", ""]
+    for entry in manifest:
+        report_lines.append(f"- **{entry['category']}**: {entry['description']} ({entry['path']})")
+    output.write_text("\n".join(report_lines), encoding="utf-8")
+
+
+def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
+    parser = argparse.ArgumentParser(description=__doc__)
+    parser.add_argument("manifest", type=Path, help="Path to evidence manifest JSON")
+    parser.add_argument(
+        "--output",
+        type=Path,
+        default=Path("evidence_report.md"),
+        help="Output markdown file",
+    )
+    return parser.parse_args(argv)
+
+
+if __name__ == "__main__":
+    args = parse_args()
+    generate_report(args.manifest, args.output)
diff --git a/scripts/run_workflow.py b/scripts/run_workflow.py
new file mode 100755
index 0000000000000000000000000000000000000000..2252bdc52e0e2b13b7e3146803c6551f22644b32
--- /dev/null
+++ b/scripts/run_workflow.py
@@ -0,0 +1,68 @@
+#!/usr/bin/env python3
+"""CLI entry point for executing the workflow automation pipeline."""
+from __future__ import annotations
+
+import argparse
+import json
+import logging
+from pathlib import Path
+import sys
+
+from workflow_automation import WorkflowConfig, WorkflowOrchestrator
+from workflow_automation.exceptions import GateFailedError, WorkflowError
+
+
+def configure_logging(verbose: bool) -> None:
+    level = logging.DEBUG if verbose else logging.INFO
+    logging.basicConfig(
+        level=level,
+        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
+    )
+
+
+def load_config(path: Path) -> WorkflowConfig:
+    return WorkflowConfig.load(path)
+
+
+def run(args: argparse.Namespace) -> int:
+    configure_logging(args.verbose)
+    try:
+        config = load_config(args.config)
+        orchestrator = WorkflowOrchestrator(config, project_root=args.project_root)
+        orchestrator.run()
+    except GateFailedError as exc:
+        logging.error("Workflow failed: %s", exc)
+        return 2
+    except WorkflowError as exc:
+        logging.error("Workflow configuration error: %s", exc)
+        return 3
+    except Exception as exc:  # pragma: no cover - defensive catch
+        logging.exception("Unexpected error running workflow")
+        return 4
+    return 0
+
+
+def parse_args(argv: list[str]) -> argparse.Namespace:
+    parser = argparse.ArgumentParser(description=__doc__)
+    parser.add_argument(
+        "--config",
+        type=Path,
+        default=Path("workflow/gate_controller.yaml"),
+        help="Path to workflow configuration file",
+    )
+    parser.add_argument(
+        "--project-root",
+        type=Path,
+        default=Path("."),
+        help="Directory containing project artifacts",
+    )
+    parser.add_argument(
+        "--verbose",
+        action="store_true",
+        help="Enable debug logging",
+    )
+    return parser.parse_args(argv)
+
+
+if __name__ == "__main__":
+    sys.exit(run(parse_args(sys.argv[1:])))
diff --git a/tests/test_workflow_orchestrator.py b/tests/test_workflow_orchestrator.py
new file mode 100644
index 0000000000000000000000000000000000000000..077bf89c7265ab0d58f99acff02044de3af03ac6
--- /dev/null
+++ b/tests/test_workflow_orchestrator.py
@@ -0,0 +1,209 @@
+from __future__ import annotations
+
+import json
+from pathlib import Path
+
+import pytest
+
+from workflow_automation.config import WorkflowConfig
+from workflow_automation.exceptions import GateFailedError
+from workflow_automation.orchestrator import WorkflowOrchestrator
+
+
+def create_project(tmp_path: Path) -> None:
+    (tmp_path / "docs").mkdir()
+    (tmp_path / "dist").mkdir()
+
+    metadata = {
+        "project_name": "demo",
+        "industry": "saas",
+        "project_type": "fullstack",
+        "owners": ["qa"],
+        "compliance": ["soc2", "security", "accessibility"],
+    }
+    (tmp_path / "docs" / "metadata.json").write_text(json.dumps(metadata), encoding="utf-8")
+    (tmp_path / "docs" / "brief.md").write_text("# Brief\n\nDemo project", encoding="utf-8")
+
+    (tmp_path / "PLAN.md").write_text("# Plan", encoding="utf-8")
+    tasks = {
+        "tasks": [
+            {"id": "t1", "title": "Set up", "tags": ["compliance"]},
+            {"id": "t2", "title": "Tests", "dependencies": ["t1"], "tags": ["testing"]},
+            {"id": "t3", "title": "Deploy", "dependencies": ["t2"], "tags": ["deployment"]},
+            {"id": "t4", "title": "Architecture", "dependencies": ["t2"], "tags": ["architecture"]},
+        ]
+    }
+    (tmp_path / "PLAN.tasks.json").write_text(json.dumps(tasks), encoding="utf-8")
+
+    (tmp_path / "PRD.md").write_text("# Product Requirements\n\n## Acceptance Criteria", encoding="utf-8")
+    (tmp_path / "ARCHITECTURE.md").write_text("# Architecture Overview", encoding="utf-8")
+
+    stack_report = {
+        "frontend": "nextjs",
+        "backend": "fastapi",
+        "database": "postgres",
+        "auth": "auth0",
+        "deploy": "docker",
+        "discrepancies": [],
+    }
+    (tmp_path / "stack_report.json").write_text(json.dumps(stack_report), encoding="utf-8")
+
+    dryrun = {"status": "success", "modules": ["frontend", "backend", "database"]}
+    (tmp_path / "dryrun_snapshot.json").write_text(json.dumps(dryrun), encoding="utf-8")
+
+    manifest = {"files": [{"path": "README.md"}]}
+    (tmp_path / "file_manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
+
+    test_results = {"status": "passed", "coverage": 95}
+    (tmp_path / "test_results.json").write_text(json.dumps(test_results), encoding="utf-8")
+
+    metrics = {"coverage": 95, "p95_latency_ms": 120, "critical_vulnerabilities": 0}
+    (tmp_path / "metrics_report.json").write_text(json.dumps(metrics), encoding="utf-8")
+
+    compliance = {"soc2": "approved", "accessibility": "approved", "security": "approved"}
+    (tmp_path / "compliance_report.json").write_text(json.dumps(compliance), encoding="utf-8")
+
+    submission_index = "# Submission\n\nAll good"
+    (tmp_path / "submission_index.md").write_text(submission_index, encoding="utf-8")
+    (tmp_path / "dist" / "artifact.txt").write_text("ok", encoding="utf-8")
+
+
+@pytest.fixture()
+def workflow_config(tmp_path: Path) -> WorkflowConfig:
+    config_dict = {
+        "evidence_root": "evidence",
+        "metadata_file": "docs/metadata.json",
+        "brief_file": "docs/brief.md",
+        "gates": [
+            {
+                "name": "intake",
+                "implementation": "workflow_automation.gates.implementations.IntakeGate",
+                "settings": {
+                    "metadata_file": "docs/metadata.json",
+                    "brief_file": "docs/brief.md",
+                    "required_fields": [
+                        "project_name",
+                        "industry",
+                        "project_type",
+                        "owners",
+                        "compliance",
+                    ],
+                },
+            },
+            {
+                "name": "environment",
+                "implementation": "workflow_automation.gates.implementations.EnvironmentGate",
+                "settings": {
+                    "required_tools": [
+                        {"name": "python", "command": "python3", "min_version": "3.8.0"}
+                    ]
+                },
+            },
+            {
+                "name": "planning",
+                "implementation": "workflow_automation.gates.implementations.PlanningGate",
+                "settings": {
+                    "plan_file": "PLAN.md",
+                    "tasks_file": "PLAN.tasks.json",
+                    "required_topics": ["compliance", "testing", "deployment", "architecture"],
+                },
+            },
+            {
+                "name": "task_graph",
+                "implementation": "workflow_automation.gates.implementations.TaskGraphGate",
+                "settings": {"tasks_file": "PLAN.tasks.json"},
+            },
+            {
+                "name": "prd",
+                "implementation": "workflow_automation.gates.implementations.PrdGate",
+                "settings": {
+                    "prd_file": "PRD.md",
+                    "architecture_file": "ARCHITECTURE.md",
+                    "required_sections": [
+                        "# Product Requirements",
+                        "## Acceptance Criteria",
+                        "# Architecture Overview",
+                    ],
+                },
+            },
+            {
+                "name": "stack",
+                "implementation": "workflow_automation.gates.implementations.StackGate",
+                "settings": {
+                    "stack_file": "stack_report.json",
+                    "required_keys": ["frontend", "backend", "database", "auth", "deploy"],
+                },
+            },
+            {
+                "name": "dry_run",
+                "implementation": "workflow_automation.gates.implementations.DryRunGate",
+                "settings": {
+                    "snapshot_file": "dryrun_snapshot.json",
+                    "expected_modules": ["frontend", "backend", "database"],
+                },
+            },
+            {
+                "name": "generation",
+                "implementation": "workflow_automation.gates.implementations.GenerationGate",
+                "settings": {"manifest_file": "file_manifest.json"},
+            },
+            {
+                "name": "testing",
+                "implementation": "workflow_automation.gates.implementations.TestingGate",
+                "settings": {"results_file": "test_results.json", "minimum_coverage": 80},
+            },
+            {
+                "name": "metrics",
+                "implementation": "workflow_automation.gates.implementations.MetricsGate",
+                "settings": {
+                    "metrics_file": "metrics_report.json",
+                    "minimum_coverage": 80,
+                    "maximum_latency_ms": 400,
+                    "maximum_vulnerabilities": 0,
+                },
+            },
+            {
+                "name": "compliance",
+                "implementation": "workflow_automation.gates.implementations.ComplianceGate",
+                "settings": {
+                    "compliance_file": "compliance_report.json",
+                    "requirements": [
+                        {"id": "soc2"},
+                        {"id": "accessibility"},
+                        {"id": "security"},
+                    ],
+                },
+            },
+            {
+                "name": "submission",
+                "implementation": "workflow_automation.gates.implementations.SubmissionGate",
+                "settings": {"checklist_file": "submission_index.md", "dist_dir": "dist"},
+            },
+        ],
+    }
+    return WorkflowConfig.from_dict(config_dict)
+
+
+def test_workflow_success(tmp_path: Path, workflow_config: WorkflowConfig) -> None:
+    create_project(tmp_path)
+    orchestrator = WorkflowOrchestrator(workflow_config, project_root=tmp_path)
+    orchestrator.run()
+
+    evidence_manifest = tmp_path / "evidence" / "index.json"
+    assert evidence_manifest.exists()
+    manifest_data = json.loads(evidence_manifest.read_text(encoding="utf-8"))
+    assert any(entry["category"] == "testing" for entry in manifest_data)
+
+
+def test_workflow_failure(tmp_path: Path, workflow_config: WorkflowConfig) -> None:
+    create_project(tmp_path)
+    # Break compliance requirement to trigger failure
+    (tmp_path / "compliance_report.json").write_text(json.dumps({"soc2": "approved"}), encoding="utf-8")
+    orchestrator = WorkflowOrchestrator(workflow_config, project_root=tmp_path)
+
+    with pytest.raises(GateFailedError):
+        orchestrator.run()
+
+    # Evidence manifest should still exist with partial results
+    evidence_manifest = tmp_path / "evidence" / "index.json"
+    assert evidence_manifest.exists()
diff --git a/workflow/gate_controller.yaml b/workflow/gate_controller.yaml
new file mode 100644
index 0000000000000000000000000000000000000000..7dc879bf216759b4db189d1126f3393f75242585
--- /dev/null
+++ b/workflow/gate_controller.yaml
@@ -0,0 +1,102 @@
+# Declarative configuration describing the 11 gates that comprise the production workflow.
+# This file is consumed by `scripts/run_workflow.py` and can be customised per-project.
+
+evidence_root: evidence
+metadata_file: docs/metadata.json
+brief_file: docs/brief.md
+
+gates:
+  - name: intake
+    implementation: workflow_automation.gates.implementations.IntakeGate
+    settings:
+      metadata_file: docs/metadata.json
+      brief_file: docs/brief.md
+      required_fields:
+        - project_name
+        - industry
+        - project_type
+        - owners
+        - compliance
+  - name: environment
+    implementation: workflow_automation.gates.implementations.EnvironmentGate
+    settings:
+      required_tools:
+        - name: python
+          command: python3
+          min_version: "3.10.0"
+        - name: node
+          command: node
+          min_version: "18.0.0"
+          version_command: node --version
+        - name: git
+          command: git
+  - name: planning
+    implementation: workflow_automation.gates.implementations.PlanningGate
+    settings:
+      plan_file: PLAN.md
+      tasks_file: PLAN.tasks.json
+      required_topics:
+        - compliance
+        - testing
+        - deployment
+        - architecture
+  - name: task_graph
+    implementation: workflow_automation.gates.implementations.TaskGraphGate
+    settings:
+      tasks_file: PLAN.tasks.json
+  - name: prd
+    implementation: workflow_automation.gates.implementations.PrdGate
+    settings:
+      prd_file: PRD.md
+      architecture_file: ARCHITECTURE.md
+      required_sections:
+        - "# Product Requirements"
+        - "## Acceptance Criteria"
+        - "# Architecture Overview"
+  - name: stack
+    implementation: workflow_automation.gates.implementations.StackGate
+    settings:
+      stack_file: stack_report.json
+      required_keys:
+        - frontend
+        - backend
+        - database
+        - auth
+        - deploy
+  - name: dry_run
+    implementation: workflow_automation.gates.implementations.DryRunGate
+    settings:
+      snapshot_file: dryrun_snapshot.json
+      expected_modules:
+        - frontend
+        - backend
+        - database
+  - name: generation
+    implementation: workflow_automation.gates.implementations.GenerationGate
+    settings:
+      manifest_file: file_manifest.json
+  - name: testing
+    implementation: workflow_automation.gates.implementations.TestingGate
+    settings:
+      results_file: test_results.json
+      minimum_coverage: 80
+  - name: metrics
+    implementation: workflow_automation.gates.implementations.MetricsGate
+    settings:
+      metrics_file: metrics_report.json
+      minimum_coverage: 80
+      maximum_latency_ms: 400
+      maximum_vulnerabilities: 0
+  - name: compliance
+    implementation: workflow_automation.gates.implementations.ComplianceGate
+    settings:
+      compliance_file: compliance_report.json
+      requirements:
+        - id: soc2
+        - id: accessibility
+        - id: security
+  - name: submission
+    implementation: workflow_automation.gates.implementations.SubmissionGate
+    settings:
+      checklist_file: submission_index.md
+      dist_dir: dist
diff --git a/workflow/templates/evidence_schema.json b/workflow/templates/evidence_schema.json
new file mode 100644
index 0000000000000000000000000000000000000000..4735ae7ac66a39a950f5c43a1769fa014b008849
--- /dev/null
+++ b/workflow/templates/evidence_schema.json
@@ -0,0 +1,23 @@
+{
+  "$schema": "http://json-schema.org/draft-07/schema#",
+  "title": "Evidence Manifest",
+  "type": "object",
+  "properties": {
+    "artifacts": {
+      "type": "array",
+      "items": {
+        "type": "object",
+        "required": ["path", "category", "description", "checksum", "created_at"],
+        "properties": {
+          "path": {"type": "string"},
+          "category": {"type": "string"},
+          "description": {"type": "string"},
+          "checksum": {"type": "string", "pattern": "^[a-f0-9]{64}$"},
+          "created_at": {"type": "string", "format": "date-time"}
+        }
+      }
+    },
+    "generated_at": {"type": "string", "format": "date-time"}
+  },
+  "required": ["artifacts", "generated_at"]
+}
diff --git a/workflow/templates/submission_checklist.md b/workflow/templates/submission_checklist.md
new file mode 100644
index 0000000000000000000000000000000000000000..172948865735fcc1c4e6320e8a91cc318fbf2164
--- /dev/null
+++ b/workflow/templates/submission_checklist.md
@@ -0,0 +1,13 @@
+# Submission Pack Checklist Template
+
+- [ ] Intake metadata snapshot included
+- [ ] Environment validation report attached
+- [ ] Planning and task manifests archived
+- [ ] Architecture and PRD reviewed and signed off
+- [ ] Stack report free of discrepancies
+- [ ] Dry-run snapshot stored
+- [ ] File manifest generated
+- [ ] Automated test results attached
+- [ ] Metrics and security scans recorded
+- [ ] Compliance report approved or waivers documented
+- [ ] Distribution artifacts packaged in `dist/`
diff --git a/workflow/templates/workflow_backend.yaml b/workflow/templates/workflow_backend.yaml
new file mode 100644
index 0000000000000000000000000000000000000000..3b9f73c720eb81fdbd495810f2e072756d05cdb3
--- /dev/null
+++ b/workflow/templates/workflow_backend.yaml
@@ -0,0 +1,38 @@
+# Universal workflow template for backend-only projects.
+workflow:
+  project_type: backend
+  gates_config: workflow/gate_controller.yaml
+  evidence_structure:
+    - intake
+    - environment
+    - planning
+    - prd
+    - stack
+    - dryrun
+    - generation
+    - testing
+    - metrics
+    - compliance
+    - submission
+  stacks:
+    backend: fastapi
+    database: postgres
+    auth: internal
+    deploy: terraform
+  compliance_matrix:
+    - id: soc2
+      description: SOC2 automation evidence
+    - id: gdpr
+      description: GDPR data handling checklist
+  readiness_checklist:
+    - Metadata confirmed
+    - Tooling verified
+    - Planning approved
+    - Architecture reviewed
+    - Stack validated
+    - Dry run captured
+    - Code generated
+    - Tests passed
+    - Metrics reviewed
+    - Compliance attested
+    - Submission packaged
diff --git a/workflow/templates/workflow_fullstack.yaml b/workflow/templates/workflow_fullstack.yaml
new file mode 100644
index 0000000000000000000000000000000000000000..b7b59802cd32718bc35d30ff4ffef4bdfd9053a3
--- /dev/null
+++ b/workflow/templates/workflow_fullstack.yaml
@@ -0,0 +1,41 @@
+# Universal workflow template for fullstack projects.
+workflow:
+  project_type: fullstack
+  gates_config: workflow/gate_controller.yaml
+  evidence_structure:
+    - intake
+    - environment
+    - planning
+    - prd
+    - stack
+    - dryrun
+    - generation
+    - testing
+    - metrics
+    - compliance
+    - submission
+  stacks:
+    frontend: nextjs
+    backend: fastapi
+    database: postgres
+    auth: auth0
+    deploy: docker
+  compliance_matrix:
+    - id: soc2
+      description: SOC2 controls validated via automation
+    - id: accessibility
+      description: WCAG AA coverage documented
+    - id: security
+      description: Security scans captured in metrics gate
+  readiness_checklist:
+    - Intake metadata validated
+    - Environments verified
+    - Planning approved
+    - PRD and architecture complete
+    - Stack selection confirmed
+    - Dry run reviewed
+    - Generation complete
+    - Tests passing
+    - Metrics thresholds satisfied
+    - Compliance attested
+    - Submission pack assembled
diff --git a/workflow_automation/__init__.py b/workflow_automation/__init__.py
new file mode 100644
index 0000000000000000000000000000000000000000..942cd46eec222cead824f6b3db9f1509c8642cf9
--- /dev/null
+++ b/workflow_automation/__init__.py
@@ -0,0 +1,11 @@
+"""Workflow automation framework providing gated execution with evidence capture."""
+
+from .config import WorkflowConfig
+from .context import WorkflowContext
+from .orchestrator import WorkflowOrchestrator
+
+__all__ = [
+    "WorkflowConfig",
+    "WorkflowContext",
+    "WorkflowOrchestrator",
+]
diff --git a/workflow_automation/config.py b/workflow_automation/config.py
new file mode 100644
index 0000000000000000000000000000000000000000..f9311550ab2dddc455e84d139a14bdb488e44b26
--- /dev/null
+++ b/workflow_automation/config.py
@@ -0,0 +1,95 @@
+"""Configuration loading utilities for the workflow automation framework."""
+from __future__ import annotations
+
+from dataclasses import dataclass, field
+from pathlib import Path
+from typing import Any, Dict, List, Optional
+import json
+import logging
+
+try:
+    import yaml
+except ModuleNotFoundError as exc:  # pragma: no cover - dependency issue captured in tests
+    raise RuntimeError(
+        "PyYAML is required to load workflow configuration files. Install it via requirements.txt."
+    ) from exc
+
+LOGGER = logging.getLogger(__name__)
+
+
+@dataclass
+class GateConfig:
+    """Dataclass describing configuration for a single gate."""
+
+    name: str
+    implementation: str
+    enabled: bool = True
+    settings: Dict[str, Any] = field(default_factory=dict)
+
+
+@dataclass
+class WorkflowConfig:
+    """Top-level configuration for orchestrating gates."""
+
+    gates: List[GateConfig]
+    evidence_root: str = "evidence"
+    metadata_file: Optional[str] = None
+    brief_file: Optional[str] = None
+
+    @classmethod
+    def from_dict(cls, payload: Dict[str, Any]) -> "WorkflowConfig":
+        gates_payload = payload.get("gates")
+        if not gates_payload or not isinstance(gates_payload, list):
+            raise ValueError("Configuration must include a non-empty 'gates' list.")
+
+        gates = []
+        for gate in gates_payload:
+            if not isinstance(gate, dict):
+                raise ValueError("Each gate entry must be an object with gate metadata.")
+            try:
+                gate_obj = GateConfig(
+                    name=gate["name"],
+                    implementation=gate["implementation"],
+                    enabled=gate.get("enabled", True),
+                    settings=gate.get("settings", {}),
+                )
+            except KeyError as exc:
+                raise ValueError(f"Gate configuration missing required field: {exc}") from exc
+            gates.append(gate_obj)
+
+        return cls(
+            gates=gates,
+            evidence_root=payload.get("evidence_root", "evidence"),
+            metadata_file=payload.get("metadata_file"),
+            brief_file=payload.get("brief_file"),
+        )
+
+    @classmethod
+    def load(cls, path: Path) -> "WorkflowConfig":
+        """Load configuration from YAML or JSON."""
+
+        if not path.exists():
+            raise FileNotFoundError(f"Configuration file not found: {path}")
+
+        try:
+            text = path.read_text(encoding="utf-8")
+        except OSError as exc:
+            raise RuntimeError(f"Unable to read configuration file {path}: {exc}") from exc
+
+        try:
+            if path.suffix.lower() in {".yaml", ".yml"}:
+                data = yaml.safe_load(text)
+            else:
+                data = json.loads(text)
+        except (yaml.YAMLError, json.JSONDecodeError) as exc:
+            raise ValueError(f"Failed to parse configuration file {path}: {exc}") from exc
+
+        if not isinstance(data, dict):
+            raise ValueError("Configuration root must be a mapping/dictionary.")
+
+        config = cls.from_dict(data)
+        LOGGER.debug("Loaded workflow configuration: %s", config)
+        return config
+
+
+__all__ = ["GateConfig", "WorkflowConfig"]
diff --git a/workflow_automation/context.py b/workflow_automation/context.py
new file mode 100644
index 0000000000000000000000000000000000000000..d63c86935c3454e00638795b2a559693b61d3880
--- /dev/null
+++ b/workflow_automation/context.py
@@ -0,0 +1,59 @@
+"""Workflow context shared across gates."""
+from __future__ import annotations
+
+from dataclasses import dataclass, field
+from pathlib import Path
+from typing import Any, Dict, List, Optional
+import logging
+
+from .config import WorkflowConfig, GateConfig
+
+LOGGER = logging.getLogger(__name__)
+
+
+@dataclass
+class GateOutcome:
+    """Represents the result of running a gate."""
+
+    name: str
+    status: str
+    details: str
+    evidence: List[str] = field(default_factory=list)
+
+    def to_dict(self) -> Dict[str, Any]:
+        return {
+            "name": self.name,
+            "status": self.status,
+            "details": self.details,
+            "evidence": self.evidence,
+        }
+
+
+@dataclass
+class WorkflowContext:
+    """Runtime context shared by gate implementations."""
+
+    project_root: Path
+    config: WorkflowConfig
+    evidence_root: Path
+    metadata: Dict[str, Any] = field(default_factory=dict)
+    brief: Optional[str] = None
+    outcomes: List[GateOutcome] = field(default_factory=list)
+
+    def __post_init__(self) -> None:
+        self.project_root = Path(self.project_root).resolve()
+        self.evidence_root = Path(self.evidence_root).resolve()
+        self.evidence_root.mkdir(parents=True, exist_ok=True)
+
+    def add_outcome(self, outcome: GateOutcome) -> None:
+        LOGGER.info("Gate %s result: %s", outcome.name, outcome.status)
+        self.outcomes.append(outcome)
+
+    def gate_config(self, gate_name: str) -> Optional[GateConfig]:
+        for gate in self.config.gates:
+            if gate.name == gate_name:
+                return gate
+        return None
+
+
+__all__ = ["WorkflowContext", "GateOutcome"]
diff --git a/workflow_automation/evidence.py b/workflow_automation/evidence.py
new file mode 100644
index 0000000000000000000000000000000000000000..6400d8b79ae06644c4ca6874a462cd7bd70ed38b
--- /dev/null
+++ b/workflow_automation/evidence.py
@@ -0,0 +1,94 @@
+"""Evidence management utilities."""
+from __future__ import annotations
+
+from dataclasses import dataclass, field
+from datetime import datetime
+import hashlib
+import json
+import logging
+from pathlib import Path
+from typing import Any, Dict, List, Optional
+
+LOGGER = logging.getLogger(__name__)
+
+
+@dataclass
+class EvidenceRecord:
+    """Represents an evidence artifact stored on disk."""
+
+    path: Path
+    category: str
+    description: str
+    checksum: str
+    created_at: str
+
+    def to_dict(self) -> Dict[str, Any]:
+        return {
+            "path": str(self.path),
+            "category": self.category,
+            "description": self.description,
+            "checksum": self.checksum,
+            "created_at": self.created_at,
+        }
+
+
+@dataclass
+class EvidenceManager:
+    """Helper class for writing evidence artifacts and maintaining the manifest."""
+
+    root: Path
+    manifest: List[EvidenceRecord] = field(default_factory=list)
+
+    def __post_init__(self) -> None:
+        self.root = Path(self.root)
+        self.root.mkdir(parents=True, exist_ok=True)
+
+    def _write_text(self, path: Path, content: str) -> None:
+        path.parent.mkdir(parents=True, exist_ok=True)
+        path.write_text(content, encoding="utf-8")
+        LOGGER.debug("Wrote text evidence to %s", path)
+
+    def _write_json(self, path: Path, payload: Dict[str, Any]) -> None:
+        path.parent.mkdir(parents=True, exist_ok=True)
+        path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
+        LOGGER.debug("Wrote JSON evidence to %s", path)
+
+    def _record(self, path: Path, category: str, description: str) -> None:
+        checksum = hashlib.sha256(path.read_bytes()).hexdigest()
+        record = EvidenceRecord(
+            path=path.relative_to(self.root),
+            category=category,
+            description=description,
+            checksum=checksum,
+            created_at=datetime.utcnow().isoformat() + "Z",
+        )
+        self.manifest.append(record)
+        LOGGER.debug("Recorded evidence %s", record)
+
+    def write_json(self, relative_path: str, payload: Dict[str, Any], *, category: str, description: str) -> Path:
+        path = self.root / relative_path
+        self._write_json(path, payload)
+        self._record(path, category, description)
+        return path
+
+    def write_text(self, relative_path: str, content: str, *, category: str, description: str) -> Path:
+        path = self.root / relative_path
+        self._write_text(path, content)
+        self._record(path, category, description)
+        return path
+
+    def finalize(self, *, manifest_name: str = "index.json") -> Path:
+        payload = [record.to_dict() for record in sorted(self.manifest, key=lambda r: r.path)]
+        manifest_path = self.root / manifest_name
+        manifest_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
+        LOGGER.info("Wrote evidence manifest containing %s artifacts", len(payload))
+        return manifest_path
+
+    def summary(self) -> Dict[str, Any]:
+        return {
+            "artifacts": [record.to_dict() for record in self.manifest],
+            "generated_at": datetime.utcnow().isoformat() + "Z",
+        }
+
+
+__all__ = ["EvidenceManager", "EvidenceRecord"]
diff --git a/workflow_automation/exceptions.py b/workflow_automation/exceptions.py
new file mode 100644
index 0000000000000000000000000000000000000000..361ec2060e859ebf2bb4f5b9b0e241550c7c5cd4
--- /dev/null
+++ b/workflow_automation/exceptions.py
@@ -0,0 +1,17 @@
+"""Custom exceptions raised by workflow automation components."""
+from __future__ import annotations
+
+
+class WorkflowError(RuntimeError):
+    """Base error for workflow orchestration issues."""
+
+
+class GateFailedError(WorkflowError):
+    """Raised when a gate fails its validation criteria."""
+
+
+class GateExecutionError(WorkflowError):
+    """Raised when an unexpected error occurs during gate execution."""
+
+
+__all__ = ["WorkflowError", "GateFailedError", "GateExecutionError"]
diff --git a/workflow_automation/gates/__init__.py b/workflow_automation/gates/__init__.py
new file mode 100644
index 0000000000000000000000000000000000000000..67bcec6e1feeee830ed3e6ccfb741dc8bd2ea951
--- /dev/null
+++ b/workflow_automation/gates/__init__.py
@@ -0,0 +1,33 @@
+"""Gate implementations for the workflow automation framework."""
+from .base import Gate, GateResult
+from .implementations import (
+    ComplianceGate,
+    DryRunGate,
+    EnvironmentGate,
+    GenerationGate,
+    IntakeGate,
+    MetricsGate,
+    PlanningGate,
+    PrdGate,
+    StackGate,
+    SubmissionGate,
+    TaskGraphGate,
+    TestingGate,
+)
+
+__all__ = [
+    "Gate",
+    "GateResult",
+    "IntakeGate",
+    "EnvironmentGate",
+    "PlanningGate",
+    "TaskGraphGate",
+    "PrdGate",
+    "StackGate",
+    "DryRunGate",
+    "GenerationGate",
+    "TestingGate",
+    "MetricsGate",
+    "ComplianceGate",
+    "SubmissionGate",
+]
diff --git a/workflow_automation/gates/base.py b/workflow_automation/gates/base.py
new file mode 100644
index 0000000000000000000000000000000000000000..97941a146000f7aa782bf87e436fe28758094d31
--- /dev/null
+++ b/workflow_automation/gates/base.py
@@ -0,0 +1,73 @@
+"""Base gate infrastructure."""
+from __future__ import annotations
+
+from abc import ABC, abstractmethod
+from dataclasses import dataclass
+from typing import Any, Dict, List
+import logging
+
+from ..context import GateOutcome, WorkflowContext
+from ..evidence import EvidenceManager
+from ..exceptions import GateExecutionError, GateFailedError
+
+LOGGER = logging.getLogger(__name__)
+
+
+@dataclass
+class GateResult:
+    """Result object returned by gate execution."""
+
+    passed: bool
+    details: str
+    evidence: List[str]
+
+
+class Gate(ABC):
+    """Abstract base class for all workflow gates."""
+
+    def __init__(
+        self,
+        *,
+        name: str,
+        settings: Dict[str, Any],
+        evidence_manager: EvidenceManager,
+    ) -> None:
+        self.name = name
+        self.settings = settings
+        self.evidence_manager = evidence_manager
+
+    @abstractmethod
+    def execute(self, context: WorkflowContext) -> GateResult:
+        """Execute gate logic returning a result."""
+
+    def run(self, context: WorkflowContext) -> GateOutcome:
+        LOGGER.info("Running gate %s", self.name)
+        try:
+            result = self.execute(context)
+        except GateFailedError as exc:
+            outcome = GateOutcome(
+                name=self.name,
+                status="failed",
+                details=str(exc),
+                evidence=[],
+            )
+            context.add_outcome(outcome)
+            raise
+        except Exception as exc:  # pragma: no cover - defensive programming
+            LOGGER.exception("Unexpected error executing gate %s", self.name)
+            raise GateExecutionError(f"Gate {self.name} encountered an unexpected error: {exc}") from exc
+
+        status = "passed" if result.passed else "failed"
+        outcome = GateOutcome(
+            name=self.name,
+            status=status,
+            details=result.details,
+            evidence=result.evidence,
+        )
+        context.add_outcome(outcome)
+        if not result.passed:
+            raise GateFailedError(result.details)
+        return outcome
+
+
+__all__ = ["Gate", "GateResult"]
diff --git a/workflow_automation/gates/implementations.py b/workflow_automation/gates/implementations.py
new file mode 100644
index 0000000000000000000000000000000000000000..3c09b1976db711fe124e1740d24b9968fc05a0fb
--- /dev/null
+++ b/workflow_automation/gates/implementations.py
@@ -0,0 +1,495 @@
+"""Gate implementations for workflow automation."""
+from __future__ import annotations
+
+import json
+import logging
+import re
+import shutil
+import subprocess
+from pathlib import Path
+from typing import Any, Dict, Iterable, List, Set, Tuple
+
+from ..context import WorkflowContext
+from ..exceptions import GateFailedError
+from .base import Gate, GateResult
+
+LOGGER = logging.getLogger(__name__)
+
+
+def _load_json(path: Path) -> Dict[str, Any]:
+    if not path.exists():
+        raise GateFailedError(f"Required file missing: {path}")
+    try:
+        return json.loads(path.read_text(encoding="utf-8"))
+    except json.JSONDecodeError as exc:
+        raise GateFailedError(f"Failed to parse JSON from {path}: {exc}") from exc
+
+
+class IntakeGate(Gate):
+    """Validates project intake metadata and brief."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        metadata_rel = self.settings.get("metadata_file") or context.config.metadata_file or "metadata.json"
+        brief_rel = self.settings.get("brief_file") or context.config.brief_file or "brief.md"
+        required_fields: Iterable[str] = self.settings.get("required_fields", [])
+
+        metadata_path = context.project_root / metadata_rel
+        metadata = _load_json(metadata_path)
+
+        missing = [field for field in required_fields if field not in metadata]
+        if missing:
+            raise GateFailedError(
+                f"Metadata file {metadata_path} is missing required fields: {', '.join(missing)}"
+            )
+
+        context.metadata = metadata
+        brief_path = context.project_root / brief_rel
+        if not brief_path.exists():
+            raise GateFailedError(f"Brief file not found: {brief_path}")
+        context.brief = brief_path.read_text(encoding="utf-8")
+
+        evidence_paths = [
+            str(
+                self.evidence_manager.write_json(
+                    "intake/metadata_snapshot.json",
+                    metadata,
+                    category="intake",
+                    description="Intake metadata snapshot",
+                ).relative_to(self.evidence_manager.root)
+            ),
+            str(
+                self.evidence_manager.write_text(
+                    "intake/brief_excerpt.md",
+                    context.brief[:1000],
+                    category="intake",
+                    description="Brief excerpt captured during intake gate",
+                ).relative_to(self.evidence_manager.root)
+            ),
+        ]
+        return GateResult(True, "Intake metadata validated", evidence_paths)
+
+
+class EnvironmentGate(Gate):
+    """Ensures required tools are available with acceptable versions."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        required_tools: Iterable[Dict[str, Any]] = self.settings.get("required_tools", [])
+        missing_tools: List[str] = []
+        tool_reports: List[Dict[str, Any]] = []
+
+        def parse_version(raw: str) -> Tuple[int, ...]:
+            try:
+                return tuple(int(part) for part in raw.split("."))
+            except ValueError:
+                raise GateFailedError(f"Unable to parse semantic version '{raw}'")
+
+        for tool in required_tools:
+            name = tool.get("name")
+            command = tool.get("command", name)
+            min_version = tool.get("min_version")
+            if not name or not command:
+                raise GateFailedError("Each required tool must include a name and command")
+
+            executable = shutil.which(command)
+            if executable is None:
+                missing_tools.append(name)
+                tool_reports.append({"name": name, "status": "missing"})
+                continue
+
+            version_command = tool.get("version_command", f"{command} --version")
+            try:
+                completed = subprocess.run(
+                    version_command.split(),
+                    capture_output=True,
+                    text=True,
+                    check=False,
+                )
+                version_output = completed.stdout.strip() or completed.stderr.strip()
+            except OSError as exc:
+                raise GateFailedError(f"Unable to execute version command for {name}: {exc}") from exc
+
+            status = "available"
+            if min_version:
+                version_match = re.search(r"(\d+\.\d+\.\d+)", version_output)
+                if version_match:
+                    detected_version = version_match.group(1)
+                    if parse_version(detected_version) < parse_version(min_version):
+                        status = "version_too_low"
+                        missing_tools.append(f"{name} >= {min_version}")
+                else:
+                    status = "unknown_version"
+            tool_reports.append(
+                {
+                    "name": name,
+                    "command": command,
+                    "status": status,
+                    "output": version_output,
+                }
+            )
+
+        if missing_tools:
+            raise GateFailedError(
+                "Environment checks failed for: " + ", ".join(sorted(missing_tools))
+            )
+
+        evidence_path = self.evidence_manager.write_json(
+            "environment/tool_report.json",
+            {"tools": tool_reports},
+            category="environment",
+            description="Tool availability report",
+        )
+        return GateResult(True, "Environment validation passed", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class PlanningGate(Gate):
+    """Validates planning artifacts and ensures tasks cover required domains."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        plan_file = context.project_root / self.settings.get("plan_file", "PLAN.md")
+        tasks_file = context.project_root / self.settings.get("tasks_file", "PLAN.tasks.json")
+        required_topics: Iterable[str] = self.settings.get("required_topics", [])
+
+        if not plan_file.exists():
+            raise GateFailedError(f"Planning document missing: {plan_file}")
+
+        tasks_data = _load_json(tasks_file)
+        tasks = tasks_data.get("tasks")
+        if not isinstance(tasks, list) or not tasks:
+            raise GateFailedError("Task plan must include a non-empty 'tasks' array")
+
+        coverage_topics: Set[str] = set()
+        for task in tasks:
+            if "id" not in task or "title" not in task:
+                raise GateFailedError("Each task must include 'id' and 'title'")
+            tags = task.get("tags", [])
+            for tag in tags:
+                if isinstance(tag, str):
+                    coverage_topics.add(tag.lower())
+
+        missing_topics = [topic for topic in required_topics if topic.lower() not in coverage_topics]
+        if missing_topics:
+            raise GateFailedError(
+                "Planning artifacts missing coverage for topics: " + ", ".join(missing_topics)
+            )
+
+        evidence_paths = [
+            str(
+                self.evidence_manager.write_json(
+                    "planning/tasks_snapshot.json",
+                    tasks_data,
+                    category="planning",
+                    description="Task plan snapshot",
+                ).relative_to(self.evidence_manager.root)
+            ),
+        ]
+        return GateResult(True, "Planning artifacts validated", evidence_paths)
+
+
+class TaskGraphGate(Gate):
+    """Ensures the task graph is structurally valid."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        tasks_file = context.project_root / self.settings.get("tasks_file", "PLAN.tasks.json")
+        tasks_data = _load_json(tasks_file)
+        tasks = tasks_data.get("tasks", [])
+        ids = [task.get("id") for task in tasks]
+        if len(ids) != len(set(ids)):
+            raise GateFailedError("Duplicate task IDs detected in task graph")
+
+        dependency_map = {task["id"]: task.get("dependencies", []) for task in tasks}
+
+        for task_id, deps in dependency_map.items():
+            for dep in deps:
+                if dep not in dependency_map:
+                    raise GateFailedError(f"Task {task_id} references unknown dependency {dep}")
+
+        visited: Set[str] = set()
+        stack: Set[str] = set()
+
+        def visit(node: str) -> None:
+            if node in stack:
+                raise GateFailedError("Cycle detected in task graph")
+            if node in visited:
+                return
+            stack.add(node)
+            for dep in dependency_map.get(node, []):
+                visit(dep)
+            stack.remove(node)
+            visited.add(node)
+
+        for node in dependency_map:
+            visit(node)
+
+        evidence_path = self.evidence_manager.write_json(
+            "planning/task_graph_validation.json",
+            {"validated_tasks": len(tasks)},
+            category="planning",
+            description="Task graph validation report",
+        )
+        return GateResult(True, "Task graph validated", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class PrdGate(Gate):
+    """Validates PRD and architecture documentation."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        prd_file = context.project_root / self.settings.get("prd_file", "PRD.md")
+        architecture_file = context.project_root / self.settings.get("architecture_file", "ARCHITECTURE.md")
+        required_sections: Iterable[str] = self.settings.get(
+            "required_sections", ["# Product Requirements", "# Architecture Overview"]
+        )
+
+        missing_files = [str(path) for path in (prd_file, architecture_file) if not path.exists()]
+        if missing_files:
+            raise GateFailedError("PRD gate missing files: " + ", ".join(missing_files))
+
+        prd_content = prd_file.read_text(encoding="utf-8")
+        architecture_content = architecture_file.read_text(encoding="utf-8")
+
+        for section in required_sections:
+            if section not in prd_content and section not in architecture_content:
+                raise GateFailedError(f"Required section '{section}' not found in PRD or architecture docs")
+
+        evidence_paths = [
+            str(
+                self.evidence_manager.write_text(
+                    "prd/prd_hash.txt",
+                    f"PRD checksum: {hash(prd_content)}\nARCH checksum: {hash(architecture_content)}\n",
+                    category="documentation",
+                    description="PRD and architecture verification hashes",
+                ).relative_to(self.evidence_manager.root)
+            )
+        ]
+        return GateResult(True, "PRD and architecture assets validated", evidence_paths)
+
+
+class StackGate(Gate):
+    """Verifies stack selection and compatibility details."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        stack_file = context.project_root / self.settings.get("stack_file", "stack_report.json")
+        stack_data = _load_json(stack_file)
+        required_keys: Iterable[str] = self.settings.get(
+            "required_keys", ["frontend", "backend", "database"]
+        )
+
+        missing = [key for key in required_keys if key not in stack_data]
+        if missing:
+            raise GateFailedError("Stack report missing keys: " + ", ".join(missing))
+
+        discrepancies = stack_data.get("discrepancies", [])
+        if discrepancies:
+            raise GateFailedError("Stack discrepancies unresolved: " + ", ".join(discrepancies))
+
+        evidence_path = self.evidence_manager.write_json(
+            "stack/stack_report.json",
+            stack_data,
+            category="stack",
+            description="Stack selection validation",
+        )
+        return GateResult(True, "Stack selection validated", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class DryRunGate(Gate):
+    """Validates dry-run scaffolding results."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        snapshot_file = context.project_root / self.settings.get("snapshot_file", "dryrun_snapshot.json")
+        snapshot = _load_json(snapshot_file)
+        status = snapshot.get("status")
+        if status != "success":
+            raise GateFailedError(f"Dry-run reported non-success status: {status}")
+
+        expected_modules = set(self.settings.get("expected_modules", []))
+        actual_modules = set(snapshot.get("modules", []))
+        missing_modules = expected_modules - actual_modules
+        if missing_modules:
+            raise GateFailedError("Dry-run missing modules: " + ", ".join(sorted(missing_modules)))
+
+        evidence_path = self.evidence_manager.write_json(
+            "dryrun/snapshot.json",
+            snapshot,
+            category="generation",
+            description="Dry-run snapshot",
+        )
+        return GateResult(True, "Dry-run snapshot validated", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class GenerationGate(Gate):
+    """Validates generated file manifests."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        manifest_file = context.project_root / self.settings.get("manifest_file", "file_manifest.json")
+        manifest = _load_json(manifest_file)
+        files = manifest.get("files", [])
+        if not files:
+            raise GateFailedError("Generation manifest must include at least one file entry")
+
+        duplicate_paths = set()
+        seen_paths = set()
+        for entry in files:
+            path = entry.get("path")
+            if not path:
+                raise GateFailedError("File manifest entries must include a 'path'")
+            if path in seen_paths:
+                duplicate_paths.add(path)
+            seen_paths.add(path)
+
+        if duplicate_paths:
+            raise GateFailedError("Duplicate files detected in manifest: " + ", ".join(sorted(duplicate_paths)))
+
+        evidence_path = self.evidence_manager.write_json(
+            "generation/file_manifest.json",
+            manifest,
+            category="generation",
+            description="Generated file manifest",
+        )
+        return GateResult(True, "Generation manifest validated", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class TestingGate(Gate):
+    """Validates automated test results."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        results_file = context.project_root / self.settings.get("results_file", "test_results.json")
+        results = _load_json(results_file)
+        status = results.get("status")
+        if status != "passed":
+            raise GateFailedError(f"Automated tests did not pass: {status}")
+
+        coverage = float(results.get("coverage", 0))
+        minimum_coverage = float(self.settings.get("minimum_coverage", 0))
+        if coverage < minimum_coverage:
+            raise GateFailedError(
+                f"Coverage {coverage} below minimum threshold {minimum_coverage}"
+            )
+
+        evidence_path = self.evidence_manager.write_json(
+            "testing/test_results.json",
+            results,
+            category="testing",
+            description="Automated test results",
+        )
+        return GateResult(True, "Automated tests validated", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class MetricsGate(Gate):
+    """Aggregates metrics, security scans, and ensures thresholds."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        metrics_file = context.project_root / self.settings.get("metrics_file", "metrics_report.json")
+        metrics = _load_json(metrics_file)
+
+        coverage_threshold = float(self.settings.get("minimum_coverage", 0))
+        perf_threshold = float(self.settings.get("maximum_latency_ms", 0))
+        max_vulnerabilities = int(self.settings.get("maximum_vulnerabilities", 0))
+
+        coverage = float(metrics.get("coverage", 0))
+        latency = float(metrics.get("p95_latency_ms", 0))
+        vulnerabilities = int(metrics.get("critical_vulnerabilities", 0))
+
+        if coverage < coverage_threshold:
+            raise GateFailedError(
+                f"Coverage metric {coverage} below required threshold {coverage_threshold}"
+            )
+        if perf_threshold and latency > perf_threshold:
+            raise GateFailedError(
+                f"Performance latency {latency} exceeds maximum allowed {perf_threshold}"
+            )
+        if vulnerabilities > max_vulnerabilities:
+            raise GateFailedError(
+                f"Detected {vulnerabilities} critical vulnerabilities (limit {max_vulnerabilities})"
+            )
+
+        evidence_path = self.evidence_manager.write_json(
+            "metrics/metrics_report.json",
+            metrics,
+            category="metrics",
+            description="Aggregated metrics report",
+        )
+        return GateResult(True, "Metrics thresholds satisfied", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class ComplianceGate(Gate):
+    """Validates compliance attestations against requirements matrix."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        compliance_file = context.project_root / self.settings.get("compliance_file", "compliance_report.json")
+        compliance = _load_json(compliance_file)
+        requirements = self.settings.get("requirements", [])
+
+        failures = []
+        for requirement in requirements:
+            req_id = requirement.get("id")
+            if not req_id:
+                raise GateFailedError("Compliance requirements must include an 'id'")
+            status = compliance.get(req_id)
+            if status not in {"approved", "waived"}:
+                failures.append(req_id)
+
+        if failures:
+            raise GateFailedError(
+                "Compliance requirements not satisfied: " + ", ".join(sorted(failures))
+            )
+
+        evidence_path = self.evidence_manager.write_json(
+            "compliance/compliance_report.json",
+            compliance,
+            category="compliance",
+            description="Compliance attestation snapshot",
+        )
+        return GateResult(True, "Compliance requirements satisfied", [str(evidence_path.relative_to(self.evidence_manager.root))])
+
+
+class SubmissionGate(Gate):
+    """Ensures submission pack is ready for delivery."""
+
+    def execute(self, context: WorkflowContext) -> GateResult:
+        checklist_file = context.project_root / self.settings.get("checklist_file", "submission_index.md")
+        dist_dir = context.project_root / self.settings.get("dist_dir", "dist")
+
+        if not checklist_file.exists():
+            raise GateFailedError(f"Submission checklist missing: {checklist_file}")
+        if not dist_dir.exists():
+            raise GateFailedError(f"Distribution directory missing: {dist_dir}")
+
+        artifacts = list(dist_dir.glob("**/*"))
+        files = [str(path.relative_to(dist_dir)) for path in artifacts if path.is_file()]
+        if not files:
+            raise GateFailedError("Submission package contains no files")
+
+        evidence_paths = [
+            str(
+                self.evidence_manager.write_json(
+                    "submission/dist_manifest.json",
+                    {"files": files},
+                    category="submission",
+                    description="Submission package manifest",
+                ).relative_to(self.evidence_manager.root)
+            ),
+            str(
+                self.evidence_manager.write_text(
+                    "submission/checklist.md",
+                    checklist_file.read_text(encoding="utf-8"),
+                    category="submission",
+                    description="Submission readiness checklist",
+                ).relative_to(self.evidence_manager.root)
+            ),
+        ]
+        return GateResult(True, "Submission package validated", evidence_paths)
+
+
+__all__ = [
+    "IntakeGate",
+    "EnvironmentGate",
+    "PlanningGate",
+    "TaskGraphGate",
+    "PrdGate",
+    "StackGate",
+    "DryRunGate",
+    "GenerationGate",
+    "TestingGate",
+    "MetricsGate",
+    "ComplianceGate",
+    "SubmissionGate",
+]
diff --git a/workflow_automation/orchestrator.py b/workflow_automation/orchestrator.py
new file mode 100644
index 0000000000000000000000000000000000000000..f35d47a56a08ac1720507fcd8aa2d86a55689daf
--- /dev/null
+++ b/workflow_automation/orchestrator.py
@@ -0,0 +1,85 @@
+"""Workflow orchestrator coordinating gate execution."""
+from __future__ import annotations
+
+import importlib
+import logging
+from pathlib import Path
+from typing import List
+
+from .config import WorkflowConfig
+from .context import WorkflowContext
+from .evidence import EvidenceManager
+from .exceptions import GateFailedError, WorkflowError
+from .gates.base import Gate
+
+LOGGER = logging.getLogger(__name__)
+
+
+def _load_class(path: str):
+    module_name, _, class_name = path.rpartition(".")
+    if not module_name:
+        raise WorkflowError(f"Invalid implementation path '{path}'")
+    module = importlib.import_module(module_name)
+    try:
+        return getattr(module, class_name)
+    except AttributeError as exc:
+        raise WorkflowError(f"Module '{module_name}' does not define '{class_name}'") from exc
+
+
+class WorkflowOrchestrator:
+    """Coordinates gate execution and evidence capture."""
+
+    def __init__(self, config: WorkflowConfig, *, project_root: Path) -> None:
+        self.config = config
+        self.project_root = Path(project_root)
+        self.evidence_manager = EvidenceManager(self.project_root / self.config.evidence_root)
+        self.context = WorkflowContext(
+            project_root=self.project_root,
+            config=config,
+            evidence_root=self.evidence_manager.root,
+        )
+
+    def _initialize_gates(self) -> List[Gate]:
+        gates: List[Gate] = []
+        for gate_config in self.config.gates:
+            if not gate_config.enabled:
+                LOGGER.info("Skipping disabled gate %s", gate_config.name)
+                continue
+            implementation_cls = _load_class(gate_config.implementation)
+            gate: Gate = implementation_cls(
+                name=gate_config.name,
+                settings=gate_config.settings,
+                evidence_manager=self.evidence_manager,
+            )
+            gates.append(gate)
+        return gates
+
+    def run(self) -> None:
+        gates = self._initialize_gates()
+        failures = []
+        for gate in gates:
+            try:
+                gate.run(self.context)
+            except GateFailedError as exc:
+                LOGGER.error("Gate %s failed: %s", gate.name, exc)
+                failures.append((gate.name, str(exc)))
+                break
+
+        # Persist gate report regardless of success/failure
+        gates_report = [outcome.to_dict() for outcome in self.context.outcomes]
+        self.evidence_manager.write_json(
+            "gates/gates_report.json",
+            {"results": gates_report},
+            category="gates",
+            description="Gate execution report",
+        )
+        self.evidence_manager.finalize()
+
+        if failures:
+            failed_gate, reason = failures[0]
+            raise GateFailedError(f"Workflow halted at gate '{failed_gate}': {reason}")
+
+        LOGGER.info("Workflow completed successfully")
+
+
+__all__ = ["WorkflowOrchestrator"]
diff --git a/workflow_automation/templates/__init__.py b/workflow_automation/templates/__init__.py
new file mode 100644
index 0000000000000000000000000000000000000000..9b72db555c5d98f03d93ee075b376721e8ad0cd1
--- /dev/null
+++ b/workflow_automation/templates/__init__.py
@@ -0,0 +1,17 @@
+"""Template utilities for workflow automation."""
+from __future__ import annotations
+
+from importlib import resources
+from pathlib import Path
+from typing import List
+
+
+def list_templates() -> List[str]:
+    return [name for name in resources.contents(__package__) if not name.startswith("__")]
+
+
+def read_text(name: str) -> str:
+    return resources.read_text(__package__, name)
+
+
+__all__ = ["list_templates", "read_text"]
