"""Tests for the workflow automation framework."""

from __future__ import annotations

import json
from pathlib import Path

from workflow.config import WorkflowConfig
from workflow.runner import WorkflowRunner


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def test_workflow_runner_produces_manifest(tmp_path) -> None:
    config = WorkflowConfig.load(_repo_root())
    overridden = config.with_overrides(project_name="demo", output_root=str(tmp_path))
    runner = WorkflowRunner(overridden)
    executed = runner.run()

    assert len(executed) == 11

    manifest_path = overridden.project_dir / overridden.evidence_root / "evidence_manifest.json"
    assert manifest_path.exists()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert manifest["project"] == "demo"
    assert len(manifest["gates"]) == 11
    assert all(record["status"] in {"passed", "skipped"} for record in manifest["gates"])

    # verify evidence files are chained
    compliance_attestation = overridden.project_dir / "evidence" / "compliance" / "compliance_attestation.json"
    assert compliance_attestation.exists()

    submission_template = overridden.project_dir / "dist" / "submission_pack_template.md"
    assert submission_template.exists()


def test_dry_run_skips_execution(tmp_path) -> None:
    config = WorkflowConfig.load(_repo_root())
    overridden = config.with_overrides(project_name="dryrun", output_root=str(tmp_path))
    runner = WorkflowRunner(overridden, dry_run=True)
    executed = runner.run()

    assert len(executed) == 11

    manifest_path = overridden.project_dir / overridden.evidence_root / "evidence_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert all(record["status"] == "skipped" for record in manifest["gates"])
