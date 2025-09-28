from __future__ import annotations

import json
from pathlib import Path

import pytest

from workflow_optimization.automation import WorkflowEngine
from workflow_optimization.config import load_workflow_config
from workflow_optimization.exceptions import WorkflowConfigurationError


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "workflow" / "assets"
CONFIG_TEMPLATE = ROOT / "workflow" / "workflow_config.json"


def _prepare_config(tmp_path: Path) -> Path:
    data = json.loads(CONFIG_TEMPLATE.read_text(encoding="utf-8"))
    data["project"]["brief_location"] = str(ASSETS / "brief.md")
    data["planning"]["plan_documents"] = [str(ASSETS / "plan.md")]
    data["design"]["design_documents"] = [str(ASSETS / "architecture.md")]
    data["paths"]["run_root"] = str(tmp_path / "runs")
    data["paths"]["evidence_root"] = str(tmp_path / "evidence")
    data["paths"]["template_root"] = str(ROOT / "templates" / "universal")
    config_path = tmp_path / "workflow_config.json"
    config_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return config_path


def test_workflow_engine_executes_all_gates(tmp_path: Path):
    config_path = _prepare_config(tmp_path)
    engine = WorkflowEngine.from_file(config_path)
    summary = engine.run()

    assert summary.success is True
    assert summary.manifest_path.exists()
    assert summary.evidence_manifest.exists()

    manifest = json.loads(summary.manifest_path.read_text(encoding="utf-8"))
    assert len(manifest["gates"]) == 11
    evidence_manifest = json.loads(summary.evidence_manifest.read_text(encoding="utf-8"))
    assert any(record["artifact"] == "compliance_scorecard" for record in evidence_manifest)


def test_configuration_validation(tmp_path: Path):
    invalid_config = tmp_path / "invalid.json"
    invalid_config.write_text(json.dumps({"paths": {"run_root": "runs", "evidence_root": "evidence", "template_root": str(ROOT / "templates" / "universal")}}), encoding="utf-8")

    with pytest.raises(WorkflowConfigurationError):
        load_workflow_config(invalid_config)
