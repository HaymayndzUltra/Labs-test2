from __future__ import annotations

import json
from pathlib import Path

import pytest

from workflow_automation.config import WorkflowConfig
from workflow_automation.exceptions import GateFailedError
from workflow_automation.orchestrator import WorkflowOrchestrator


def create_project(tmp_path: Path) -> None:
    (tmp_path / "docs").mkdir()
    (tmp_path / "dist").mkdir()

    metadata = {
        "project_name": "demo",
        "industry": "saas",
        "project_type": "fullstack",
        "owners": ["qa"],
        "compliance": ["soc2", "security", "accessibility"],
    }
    (tmp_path / "docs" / "metadata.json").write_text(json.dumps(metadata), encoding="utf-8")
    (tmp_path / "docs" / "brief.md").write_text("# Brief\n\nDemo project", encoding="utf-8")

    (tmp_path / "PLAN.md").write_text("# Plan", encoding="utf-8")
    tasks = {
        "tasks": [
            {"id": "t1", "title": "Set up", "tags": ["compliance"]},
            {"id": "t2", "title": "Tests", "dependencies": ["t1"], "tags": ["testing"]},
            {"id": "t3", "title": "Deploy", "dependencies": ["t2"], "tags": ["deployment"]},
            {"id": "t4", "title": "Architecture", "dependencies": ["t2"], "tags": ["architecture"]},
        ]
    }
    (tmp_path / "PLAN.tasks.json").write_text(json.dumps(tasks), encoding="utf-8")

    (tmp_path / "PRD.md").write_text("# Product Requirements\n\n## Acceptance Criteria", encoding="utf-8")
    (tmp_path / "ARCHITECTURE.md").write_text("# Architecture Overview", encoding="utf-8")

    stack_report = {
        "frontend": "nextjs",
        "backend": "fastapi",
        "database": "postgres",
        "auth": "auth0",
        "deploy": "docker",
        "discrepancies": [],
    }
    (tmp_path / "stack_report.json").write_text(json.dumps(stack_report), encoding="utf-8")

    dryrun = {"status": "success", "modules": ["frontend", "backend", "database"]}
    (tmp_path / "dryrun_snapshot.json").write_text(json.dumps(dryrun), encoding="utf-8")

    manifest = {"files": [{"path": "README.md"}]}
    (tmp_path / "file_manifest.json").write_text(json.dumps(manifest), encoding="utf-8")

    test_results = {"status": "passed", "coverage": 95}
    (tmp_path / "test_results.json").write_text(json.dumps(test_results), encoding="utf-8")

    metrics = {"coverage": 95, "p95_latency_ms": 120, "critical_vulnerabilities": 0}
    (tmp_path / "metrics_report.json").write_text(json.dumps(metrics), encoding="utf-8")

    compliance = {"soc2": "approved", "accessibility": "approved", "security": "approved"}
    (tmp_path / "compliance_report.json").write_text(json.dumps(compliance), encoding="utf-8")

    submission_index = "# Submission\n\nAll good"
    (tmp_path / "submission_index.md").write_text(submission_index, encoding="utf-8")
    (tmp_path / "dist" / "artifact.txt").write_text("ok", encoding="utf-8")


@pytest.fixture()
def workflow_config(tmp_path: Path) -> WorkflowConfig:
    config_dict = {
        "evidence_root": "evidence",
        "metadata_file": "docs/metadata.json",
        "brief_file": "docs/brief.md",
        "gates": [
            {
                "name": "intake",
                "implementation": "workflow_automation.gates.implementations.IntakeGate",
                "settings": {
                    "metadata_file": "docs/metadata.json",
                    "brief_file": "docs/brief.md",
                    "required_fields": [
                        "project_name",
                        "industry",
                        "project_type",
                        "owners",
                        "compliance",
                    ],
                },
            },
            {
                "name": "environment",
                "implementation": "workflow_automation.gates.implementations.EnvironmentGate",
                "settings": {
                    "required_tools": [
                        {"name": "python", "command": "python3", "min_version": "3.8.0"}
                    ]
                },
            },
            {
                "name": "planning",
                "implementation": "workflow_automation.gates.implementations.PlanningGate",
                "settings": {
                    "plan_file": "PLAN.md",
                    "tasks_file": "PLAN.tasks.json",
                    "required_topics": ["compliance", "testing", "deployment", "architecture"],
                },
            },
            {
                "name": "task_graph",
                "implementation": "workflow_automation.gates.implementations.TaskGraphGate",
                "settings": {"tasks_file": "PLAN.tasks.json"},
            },
            {
                "name": "prd",
                "implementation": "workflow_automation.gates.implementations.PrdGate",
                "settings": {
                    "prd_file": "PRD.md",
                    "architecture_file": "ARCHITECTURE.md",
                    "required_sections": [
                        "# Product Requirements",
                        "## Acceptance Criteria",
                        "# Architecture Overview",
                    ],
                },
            },
            {
                "name": "stack",
                "implementation": "workflow_automation.gates.implementations.StackGate",
                "settings": {
                    "stack_file": "stack_report.json",
                    "required_keys": ["frontend", "backend", "database", "auth", "deploy"],
                },
            },
            {
                "name": "dry_run",
                "implementation": "workflow_automation.gates.implementations.DryRunGate",
                "settings": {
                    "snapshot_file": "dryrun_snapshot.json",
                    "expected_modules": ["frontend", "backend", "database"],
                },
            },
            {
                "name": "generation",
                "implementation": "workflow_automation.gates.implementations.GenerationGate",
                "settings": {"manifest_file": "file_manifest.json"},
            },
            {
                "name": "testing",
                "implementation": "workflow_automation.gates.implementations.TestingGate",
                "settings": {"results_file": "test_results.json", "minimum_coverage": 80},
            },
            {
                "name": "metrics",
                "implementation": "workflow_automation.gates.implementations.MetricsGate",
                "settings": {
                    "metrics_file": "metrics_report.json",
                    "minimum_coverage": 80,
                    "maximum_latency_ms": 400,
                    "maximum_vulnerabilities": 0,
                },
            },
            {
                "name": "compliance",
                "implementation": "workflow_automation.gates.implementations.ComplianceGate",
                "settings": {
                    "compliance_file": "compliance_report.json",
                    "requirements": [
                        {"id": "soc2"},
                        {"id": "accessibility"},
                        {"id": "security"},
                    ],
                },
            },
            {
                "name": "submission",
                "implementation": "workflow_automation.gates.implementations.SubmissionGate",
                "settings": {"checklist_file": "submission_index.md", "dist_dir": "dist"},
            },
        ],
    }
    return WorkflowConfig.from_dict(config_dict)


def test_workflow_success(tmp_path: Path, workflow_config: WorkflowConfig) -> None:
    create_project(tmp_path)
    orchestrator = WorkflowOrchestrator(workflow_config, project_root=tmp_path)
    orchestrator.run()

    evidence_manifest = tmp_path / "evidence" / "index.json"
    assert evidence_manifest.exists()
    manifest_data = json.loads(evidence_manifest.read_text(encoding="utf-8"))
    assert any(entry["category"] == "testing" for entry in manifest_data)


def test_workflow_failure(tmp_path: Path, workflow_config: WorkflowConfig) -> None:
    create_project(tmp_path)
    # Break compliance requirement to trigger failure
    (tmp_path / "compliance_report.json").write_text(json.dumps({"soc2": "approved"}), encoding="utf-8")
    orchestrator = WorkflowOrchestrator(workflow_config, project_root=tmp_path)

    with pytest.raises(GateFailedError):
        orchestrator.run()

    # Evidence manifest should still exist with partial results
    evidence_manifest = tmp_path / "evidence" / "index.json"
    assert evidence_manifest.exists()
