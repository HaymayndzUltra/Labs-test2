"""Utilities to materialize universal templates for the workflow workflow."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict

from .config import WorkflowConfig, default_workflow_config


EVIDENCE_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Workflow Evidence Manifest",
    "type": "object",
    "required": ["generated_at", "artifacts"],
    "properties": {
        "generated_at": {"type": "string"},
        "artifacts": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["gate_key", "check_name", "path", "created_at"],
                "properties": {
                    "gate_key": {"type": "string"},
                    "check_name": {"type": "string"},
                    "path": {"type": "string"},
                    "metadata": {"type": "object"},
                    "created_at": {"type": "string"},
                },
            },
        },
    },
}


def create_universal_templates(output_dir: Path, config: WorkflowConfig | None = None) -> Dict[str, Path]:
    """Create reusable templates for workflow orchestration and evidence capture."""

    output_dir.mkdir(parents=True, exist_ok=True)
    cfg = config or default_workflow_config(output_dir)
    paths: Dict[str, Path] = {}

    workflow_template = output_dir / "workflow_config.json"
    workflow_template.write_text(json.dumps(cfg.to_dict(), indent=2))
    paths["workflow_config"] = workflow_template

    evidence_schema = output_dir / "evidence_manifest.schema.json"
    evidence_schema.write_text(json.dumps(EVIDENCE_SCHEMA, indent=2))
    paths["evidence_schema"] = evidence_schema

    checklist = output_dir / "submission_checklist.md"
    checklist.write_text(_build_checklist(cfg))
    paths["submission_checklist"] = checklist

    return paths


def _build_checklist(config: WorkflowConfig) -> str:
    lines = ["# Submission Readiness Checklist", ""]
    for gate in config.gates:
        lines.append(f"## {gate.name}")
        lines.append(f"- [ ] Evidence artifact `{gate.key}.json` captured")
        for check in gate.checks:
            lines.append(f"- [ ] Check `{check.name}` passed ({check.type})")
        lines.append("")
    return "\n".join(lines).strip() + "\n"
