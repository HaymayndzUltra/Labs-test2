"""Configuration objects and defaults for the workflow optimization system."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

try:  # pragma: no cover - optional dependency
    import yaml  # type: ignore
except Exception:  # pragma: no cover - dependency might be missing
    yaml = None  # type: ignore

import json


class GateSeverity(str, Enum):
    """Represents the severity of a gate failure."""

    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


@dataclass(slots=True)
class CheckSpec:
    """Declarative specification describing a check executed within a gate."""

    type: str
    name: str
    description: str = ""
    command: Optional[List[str]] = None
    path: Optional[str] = None
    required_keys: Optional[List[str]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class GateDefinition:
    """Definition for a gate executed by the workflow engine."""

    key: str
    name: str
    description: str
    severity: GateSeverity = GateSeverity.CRITICAL
    checks: List[CheckSpec] = field(default_factory=list)
    producer: Optional[str] = None


@dataclass(slots=True)
class WorkflowConfig:
    """Container describing the entire workflow automation configuration."""

    evidence_root: Path
    gates: List[GateDefinition]
    output_dir: Path
    templates_dir: Path

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "WorkflowConfig":
        """Build a :class:`WorkflowConfig` from a Python dictionary."""

        evidence_root = Path(payload.get("evidence_root", "evidence"))
        output_dir = Path(payload.get("output_dir", "dist"))
        templates_dir = Path(payload.get("templates_dir", "templates"))
        raw_gates = payload.get("gates") or []
        gates = [
            GateDefinition(
                key=item["key"],
                name=item.get("name", item["key"].replace("_", " ").title()),
                description=item.get("description", ""),
                severity=GateSeverity(item.get("severity", GateSeverity.CRITICAL.value)),
                checks=[
                    CheckSpec(
                        type=check["type"],
                        name=check.get("name", check["type"]),
                        description=check.get("description", ""),
                        command=check.get("command"),
                        path=check.get("path"),
                        required_keys=check.get("required_keys"),
                        metadata=check.get("metadata") or {},
                    )
                    for check in item.get("checks", [])
                ],
                producer=item.get("producer"),
            )
            for item in raw_gates
        ]
        return cls(
            evidence_root=evidence_root,
            output_dir=output_dir,
            templates_dir=templates_dir,
            gates=gates,
        )

    def to_dict(self) -> Dict[str, Any]:
        """Serialize the configuration to a dictionary."""

        return {
            "evidence_root": str(self.evidence_root),
            "output_dir": str(self.output_dir),
            "templates_dir": str(self.templates_dir),
            "gates": [
                {
                    "key": gate.key,
                    "name": gate.name,
                    "description": gate.description,
                    "severity": gate.severity.value,
                    "producer": gate.producer,
                    "checks": [
                        {
                            "type": check.type,
                            "name": check.name,
                            "description": check.description,
                            "command": check.command,
                            "path": check.path,
                            "required_keys": check.required_keys,
                            "metadata": check.metadata,
                        }
                        for check in gate.checks
                    ],
                }
                for gate in self.gates
            ],
        }


def _build_default_gate(
    key: str,
    description: str,
    required_keys: Iterable[str],
    producer: str,
    *,
    severity: GateSeverity = GateSeverity.CRITICAL,
) -> GateDefinition:
    """Internal helper to construct standard gates."""

    checks = [
        CheckSpec(
            type="file_exists",
            name=f"{key}_artifact",
            description=f"Ensure the {key} artifact exists before progressing.",
            path=f"{key}.json",
        ),
        CheckSpec(
            type="json_keys",
            name=f"{key}_structure",
            description="Validate the artifact contains the expected keys.",
            path=f"{key}.json",
            required_keys=list(required_keys),
        ),
    ]
    return GateDefinition(
        key=key,
        name=description,
        description=description,
        severity=severity,
        checks=checks,
        producer=producer,
    )


def default_workflow_config(base_dir: Path | str = Path(".")) -> WorkflowConfig:
    """Return the default workflow configuration with all eleven gates."""

    base = Path(base_dir)
    gates = [
        _build_default_gate(
            "intake_report",
            "Metadata intake gate",
            ("project_name", "project_type", "industry", "risk_profile"),
            producer="intake",
        ),
        _build_default_gate(
            "environment_verification",
            "Environment & toolchain verification gate",
            ("python", "node", "docker", "status"),
            producer="environment",
        ),
        _build_default_gate(
            "planning_synthesis",
            "Planning synthesis gate",
            ("tasks", "coverage_summary", "exceptions"),
            producer="planning",
        ),
        _build_default_gate(
            "task_graph_integrity",
            "Task graph integrity gate",
            ("total_tasks", "isolated_nodes", "cycles"),
            producer="task_graph",
        ),
        _build_default_gate(
            "prd_and_architecture",
            "PRD & architecture gate",
            ("prd_path", "architecture_path", "validation"),
            producer="prd",
        ),
        _build_default_gate(
            "stack_selection",
            "Stack selection orchestration gate",
            ("frontend", "backend", "database", "exceptions"),
            producer="stack",
        ),
        _build_default_gate(
            "dry_run_simulation",
            "Dry-run simulation gate",
            ("expected_modules", "diff", "status"),
            producer="dry_run",
        ),
        _build_default_gate(
            "generation_execution",
            "Generation execution gate",
            ("files_generated", "template_versions", "status"),
            producer="generation",
        ),
        _build_default_gate(
            "testing_validation",
            "Dependency install & test automation gate",
            ("workspaces", "failures", "coverage"),
            producer="testing",
        ),
        _build_default_gate(
            "metrics_security",
            "Metrics & security automation gate",
            ("coverage", "performance", "vulnerabilities"),
            producer="metrics",
        ),
        _build_default_gate(
            "submission_readiness",
            "Submission readiness & compliance gate",
            ("checklist", "approvals", "artifacts"),
            producer="submission",
        ),
    ]
    return WorkflowConfig(
        evidence_root=base / "evidence",
        output_dir=base / "dist",
        templates_dir=base / "templates",
        gates=gates,
    )


def load_workflow_config(path: Path) -> WorkflowConfig:
    """Load workflow configuration from JSON or YAML."""

    text = path.read_text()
    if path.suffix.lower() in {".yaml", ".yml"}:
        if yaml is None:  # pragma: no cover - runtime guard
            raise RuntimeError(
                "PyYAML is not installed but a YAML configuration was provided. "
                "Install PyYAML or convert the file to JSON."
            )
        payload = yaml.safe_load(text)
    else:
        payload = json.loads(text)
    return WorkflowConfig.from_dict(payload)


def save_workflow_config(config: WorkflowConfig, path: Path) -> None:
    """Persist workflow configuration to JSON (default) or YAML."""

    payload = config.to_dict()
    if path.suffix.lower() in {".yaml", ".yml"} and yaml is not None:
        dumped = yaml.safe_dump(payload, sort_keys=False)
    else:
        dumped = json.dumps(payload, indent=2)
    path.write_text(dumped)
