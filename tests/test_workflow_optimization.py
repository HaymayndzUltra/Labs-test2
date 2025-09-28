from __future__ import annotations

import json
from pathlib import Path

import pytest

from workflow_optimization import RunContext, WorkflowEngine, default_workflow_config
from workflow_optimization.templates import create_universal_templates
from workflow_optimization.deployment import generate_deployment_scripts


def test_default_config_has_eleven_gates():
    config = default_workflow_config()
    assert len(config.gates) == 11
    assert all(gate.producer for gate in config.gates)


def test_workflow_engine_generates_evidence(tmp_path: Path):
    config = default_workflow_config()
    context = RunContext(
        project_name="demo",
        project_type="fullstack",
        industry="finance",
        output_dir=tmp_path,
        metadata={
            'risk_profile': 'standard',
            'plan': {
                'tasks': ['setup'],
                'coverage_summary': {'mandatory': True, 'count': 1},
                'exceptions': [],
            },
            'task_graph': {'total_tasks': 1, 'isolated_nodes': 0, 'cycles': []},
            'prd': {'prd_path': 'PRD.md', 'architecture_path': 'ARCHITECTURE.md', 'validation': {'sections': ['overview']}},
            'stack': {'frontend': 'nextjs', 'backend': 'fastapi', 'database': 'postgres', 'exceptions': []},
            'dry_run': {'expected_modules': [], 'diff': [], 'status': 'clean'},
            'generation': {'files_generated': 10, 'template_versions': {'api': '1.0.0'}, 'status': 'complete'},
            'testing': {'workspaces': ['frontend'], 'failures': [], 'coverage': {'line': 0.92, 'branch': 0.85}},
            'metrics': {'coverage': {'line': 0.95}, 'performance': {'p95_ms': 120}, 'vulnerabilities': {'critical': 0, 'high': 0}},
            'submission': {'checklist': ['evidence', 'signoff'], 'approvals': ['qa'], 'artifacts': ['submission.zip']},
        },
    )
    engine = WorkflowEngine(config)
    result = engine.run(context)

    assert result.succeeded
    summary_path = tmp_path / "workflow_run.json"
    assert summary_path.exists()
    payload = json.loads(summary_path.read_text())
    assert payload["gates"], "Gate results should be serialized"
    evidence_index = Path(payload["evidence_index"])
    assert evidence_index.exists()


def test_template_generation(tmp_path: Path):
    config = default_workflow_config()
    artifacts = create_universal_templates(tmp_path, config)
    assert "workflow_config" in artifacts
    assert artifacts["workflow_config"].exists()
    checklist = artifacts["submission_checklist"].read_text()
    assert "Submission Readiness Checklist" in checklist


def test_deployment_scripts(tmp_path: Path):
    config = default_workflow_config()
    scripts = generate_deployment_scripts(tmp_path, config)
    assert (tmp_path / "deploy_workflow.sh").exists()
    assert scripts["ci_workflow"].read_text()
    manifest = json.loads(scripts["manifest"].read_text())
    assert "scripts" in manifest


@pytest.mark.parametrize(
    "missing_key",
    ["project_name", "project_type", "industry", "risk_profile"],
)
def test_gate_failure_when_metadata_missing(tmp_path: Path, missing_key: str):
    config = default_workflow_config()
    context_metadata = {}
    if missing_key != "risk_profile":
        context_metadata["risk_profile"] = "standard"
    context = RunContext(
        project_name="demo" if missing_key != "project_name" else "",
        project_type="fullstack" if missing_key != "project_type" else "",
        industry="finance" if missing_key != "industry" else "",
        output_dir=tmp_path,
        metadata=context_metadata,
    )
    engine = WorkflowEngine(config)
    result = engine.run(context)
    assert not result.succeeded
