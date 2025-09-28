"""Template generation utilities for the workflow optimizer."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict


def _write(path: Path, data: Dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def generate_default_templates(output_dir: Path) -> None:
    """Generate universal templates for the workflow system."""

    intake_template = {
        "name": "Example Project",
        "industry": "saas",
        "project_type": "fullstack",
        "compliance": ["soc2"],
        "features": ["analytics", "collaboration"],
    }
    _write(output_dir / "intake_metadata.json", intake_template)

    evidence_schema = {
        "type": "object",
        "required": ["gate", "description", "timestamp"],
        "properties": {
            "gate": {"type": "string"},
            "description": {"type": "string"},
            "artifact_path": {"type": ["string", "null"]},
            "metadata": {"type": "object"},
            "timestamp": {"type": "string", "format": "date-time"},
        },
    }
    _write(output_dir / "evidence_schema.json", evidence_schema)

    gate_controller = {
        "version": 1,
        "gates": [
            {"name": "metadata", "description": "Validate intake metadata"},
            {"name": "environment", "description": "Verify environment readiness"},
            {"name": "planning", "description": "Validate plan artifacts"},
            {"name": "task_graph", "description": "Validate task graph"},
            {"name": "prd", "description": "Validate PRD & architecture"},
            {"name": "stack", "description": "Validate stack selection"},
            {"name": "dry_run", "description": "Validate dry run output"},
            {"name": "generation", "description": "Validate generation manifest"},
            {"name": "testing", "description": "Validate automated tests"},
            {"name": "metrics", "description": "Validate metrics thresholds"},
            {"name": "compliance", "description": "Validate compliance"},
        ],
    }
    _write(output_dir / "gate_controller.json", gate_controller)

    checklist = {
        "sections": [
            {
                "title": "Submission Readiness",
                "items": [
                    "All gates passed",
                    "Evidence manifest exported",
                    "Submission pack generated",
                    "Compliance approvals attached",
                ],
            }
        ]
    }
    _write(output_dir / "submission_checklist.json", checklist)
