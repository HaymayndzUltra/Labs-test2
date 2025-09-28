from __future__ import annotations

import json
from pathlib import Path

from workflow_optimizer.config import WorkflowConfig
from workflow_optimizer.runner import WorkflowOrchestrator


def _create_project(tmp_path: Path) -> WorkflowConfig:
    project = tmp_path / "project"
    evidence = project / "evidence"
    docs_dir = project / "docs"
    metrics_dir = project / "metrics"
    compliance_dir = project / "compliance"
    dist_dir = project / "dist"
    tests_dir = project / "tests"

    for directory in [project, evidence, docs_dir, metrics_dir, compliance_dir, dist_dir, tests_dir]:
        directory.mkdir(parents=True, exist_ok=True)

    (docs_dir / "metadata.json").write_text(
        json.dumps({"name": "Demo", "industry": "saas", "project_type": "fullstack"}),
        encoding="utf-8",
    )
    (project / "PLAN.md").write_text("# Plan\n- item", encoding="utf-8")
    (project / "PLAN.tasks.json").write_text(
        json.dumps({"tasks": [{"id": "T1", "title": "Task"}]}, indent=2),
        encoding="utf-8",
    )
    (project / "PRD.md").write_text("# PRD\ncontent", encoding="utf-8")
    (project / "ARCHITECTURE.md").write_text("# ARCH\ncontent", encoding="utf-8")
    (project / "stack_report.json").write_text(
        json.dumps({"frontend": "nextjs", "backend": "fastapi"}, indent=2),
        encoding="utf-8",
    )
    (project / "dry_run_snapshot.json").write_text(
        json.dumps({"files": ["README.md"]}, indent=2),
        encoding="utf-8",
    )
    (project / "generation_manifest.json").write_text(
        json.dumps({"generated_files": ["src/index.ts"]}, indent=2),
        encoding="utf-8",
    )
    (tests_dir / "report.json").write_text(
        json.dumps({"status": "passed", "tests": {"total": 1}}, indent=2),
        encoding="utf-8",
    )
    (metrics_dir / "metrics.json").write_text(
        json.dumps(
            {
                "coverage": {"line": 0.9},
                "performance": {"p95_ms": 250},
                "security": {"high": 0},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (compliance_dir / "compliance.json").write_text(
        json.dumps({"controls": [{"id": "SOC2-1", "status": "passed"}]}, indent=2),
        encoding="utf-8",
    )
    (dist_dir / "submission_index.json").write_text(
        json.dumps({"artifacts": ["submission.zip"]}, indent=2),
        encoding="utf-8",
    )

    config_data = {
        "project_root": str(project),
        "evidence_root": str(evidence),
        "metadata_file": str(docs_dir / "metadata.json"),
        "plan_file": str(project / "PLAN.md"),
        "tasks_file": str(project / "PLAN.tasks.json"),
        "prd_file": str(project / "PRD.md"),
        "architecture_file": str(project / "ARCHITECTURE.md"),
        "stack_report": str(project / "stack_report.json"),
        "dry_run_snapshot": str(project / "dry_run_snapshot.json"),
        "generation_manifest": str(project / "generation_manifest.json"),
        "test_report": str(tests_dir / "report.json"),
        "metrics_manifest": str(metrics_dir / "metrics.json"),
        "compliance_manifest": str(compliance_dir / "compliance.json"),
        "submission_manifest": str(dist_dir / "submission_index.json"),
        "environment": {"required_binaries": ["python3"]},
    }

    config_path = tmp_path / "workflow.json"
    config_path.write_text(json.dumps(config_data, indent=2), encoding="utf-8")
    return WorkflowConfig.from_dict(config_data)


def test_workflow_orchestrator_success(tmp_path: Path) -> None:
    config = _create_project(tmp_path)
    orchestrator = WorkflowOrchestrator(config)
    results = orchestrator.run()
    assert all(result.status.value == "passed" for result in results)
    report_path = config.evidence_root / "gates_report.json"
    assert report_path.exists()
    manifest_path = config.evidence_root / "index.json"
    assert manifest_path.exists()
    report = json.loads(report_path.read_text(encoding="utf-8"))
    assert report["results"]


def test_workflow_orchestrator_metadata_failure(tmp_path: Path) -> None:
    config = _create_project(tmp_path)
    metadata_path = config.metadata_file
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    metadata.pop("project_type")
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    orchestrator = WorkflowOrchestrator(config)
    results = orchestrator.run()
    assert results[0].status.value == "failed"
