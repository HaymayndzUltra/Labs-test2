from __future__ import annotations

import json
from pathlib import Path

import pytest

from workflow_optimization.runner import WorkflowRunner, load_workflow_definition


@pytest.fixture()
def workflow_definition() -> Path:
    return Path("workflow_system/workflow.yml")


@pytest.fixture()
def prepared_brief(tmp_path: Path) -> Path:
    brief = tmp_path / "brief.md"
    brief.write_text(
        """Title: Demo Project\nStakeholders: Demo Team\nObjectives: Deliver value\n""",
        encoding="utf-8",
    )
    return brief


def _make_project_files(project_dir: Path) -> None:
    project_dir.mkdir(parents=True, exist_ok=True)
    (project_dir / "requirements.txt").write_text("pytest\n", encoding="utf-8")
    (project_dir / "package.json").write_text("{}", encoding="utf-8")
    (project_dir / "Makefile").write_text("all:\n\t@echo done\n", encoding="utf-8")


def test_workflow_executes_all_gates(workflow_definition: Path, prepared_brief: Path, tmp_path: Path) -> None:
    project_dir = tmp_path / "project"
    evidence_dir = project_dir / "evidence"
    _make_project_files(project_dir)

    definition = load_workflow_definition(workflow_definition)
    runner = WorkflowRunner(definition)

    result = runner.run(
        context={
            "project_dir": str(project_dir),
            "evidence_dir": str(evidence_dir),
            "brief_path": str(prepared_brief),
            "project_name": "Automation Demo",
        }
    )

    assert result.status == "pass"
    assert len(result.gate_results) == 11

    manifest = evidence_dir / "manifest.json"
    assert manifest.exists()
    data = json.loads(manifest.read_text(encoding="utf-8"))
    assert data["artifacts"]


def test_workflow_stops_on_failed_gate(workflow_definition: Path, tmp_path: Path) -> None:
    project_dir = tmp_path / "project"
    evidence_dir = project_dir / "evidence"
    _make_project_files(project_dir)

    # Missing "Objectives:" line triggers the first gate failure.
    brief = tmp_path / "brief.md"
    brief.write_text("Title: Demo\nStakeholders: Team\n", encoding="utf-8")

    definition = load_workflow_definition(workflow_definition)
    runner = WorkflowRunner(definition)

    result = runner.run(
        context={
            "project_dir": str(project_dir),
            "evidence_dir": str(evidence_dir),
            "brief_path": str(brief),
            "project_name": "Automation Demo",
        }
    )

    assert result.status == "fail"
    assert len(result.gate_results) == 1
    manifest = evidence_dir / "manifest.json"
    assert manifest.exists()


def test_deployment_package(tmp_path: Path) -> None:
    from deploy.deploy_workflow import build_package

    archive = build_package(tmp_path)
    assert archive.exists()
    assert archive.suffix == ".zip"
