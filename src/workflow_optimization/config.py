"""Configuration loading utilities for the workflow optimization system."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict
import json

from .exceptions import WorkflowConfigurationError


@dataclass(slots=True)
class PathSettings:
    """Resolved path configuration for workflow runs."""

    run_root: Path
    evidence_root: Path
    template_root: Path

    def ensure_directories(self) -> None:
        """Create directories defined in the path settings if they do not exist."""

        self.run_root.mkdir(parents=True, exist_ok=True)
        self.evidence_root.mkdir(parents=True, exist_ok=True)
        self.template_root.mkdir(parents=True, exist_ok=True)


@dataclass(slots=True)
class WorkflowConfig:
    """Dataclass representing the workflow configuration file."""

    project: Dict[str, Any]
    governance: Dict[str, Any]
    planning: Dict[str, Any]
    design: Dict[str, Any]
    environment: Dict[str, Any]
    dry_run: Dict[str, Any]
    generation: Dict[str, Any]
    testing: Dict[str, Any]
    synchronization: Dict[str, Any]
    metrics: Dict[str, Any]
    compliance: Dict[str, Any]
    delivery: Dict[str, Any]
    automation: Dict[str, Any]
    paths: PathSettings
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Return a serialisable representation of the configuration."""

        return {
            "project": self.project,
            "governance": self.governance,
            "planning": self.planning,
            "design": self.design,
            "environment": self.environment,
            "dry_run": self.dry_run,
            "generation": self.generation,
            "testing": self.testing,
            "synchronization": self.synchronization,
            "metrics": self.metrics,
            "compliance": self.compliance,
            "delivery": self.delivery,
            "automation": self.automation,
            "paths": {
                "run_root": str(self.paths.run_root),
                "evidence_root": str(self.paths.evidence_root),
                "template_root": str(self.paths.template_root),
            },
            "metadata": self.metadata,
        }


_REQUIRED_TOP_LEVEL_KEYS = {
    "project",
    "governance",
    "planning",
    "design",
    "environment",
    "dry_run",
    "generation",
    "testing",
    "synchronization",
    "metrics",
    "compliance",
    "delivery",
    "automation",
    "paths",
}

_PROJECT_REQUIRED_FIELDS = {"name", "industry", "project_type", "stakeholders"}


def _resolve_path(base: Path, value: str) -> Path:
    path = Path(value)
    if not path.is_absolute():
        path = (base / path).resolve()
    return path


def load_workflow_config(path: str | Path) -> WorkflowConfig:
    """Load and validate a workflow configuration file."""

    config_path = Path(path).expanduser().resolve()
    if not config_path.exists():
        raise WorkflowConfigurationError(f"Configuration file not found: {config_path}")

    try:
        data = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise WorkflowConfigurationError(f"Invalid JSON configuration: {exc}") from exc

    missing_keys = sorted(_REQUIRED_TOP_LEVEL_KEYS - data.keys())
    if missing_keys:
        raise WorkflowConfigurationError(
            "Missing required configuration sections: " + ", ".join(missing_keys)
        )

    project = data["project"]
    missing_project_fields = sorted(_PROJECT_REQUIRED_FIELDS - project.keys())
    if missing_project_fields:
        raise WorkflowConfigurationError(
            "Project configuration missing fields: " + ", ".join(missing_project_fields)
        )

    if not isinstance(project.get("stakeholders"), list) or not project["stakeholders"]:
        raise WorkflowConfigurationError("At least one project stakeholder must be defined")

    base_dir = config_path.parent
    paths_data = data["paths"]
    path_settings = PathSettings(
        run_root=_resolve_path(base_dir, paths_data["run_root"]),
        evidence_root=_resolve_path(base_dir, paths_data["evidence_root"]),
        template_root=_resolve_path(base_dir, paths_data["template_root"]),
    )
    path_settings.ensure_directories()

    metadata = dict(data.get("metadata", {}))
    metadata.setdefault("config_dir", str(base_dir))

    return WorkflowConfig(
        project=data["project"],
        governance=data["governance"],
        planning=data["planning"],
        design=data["design"],
        environment=data["environment"],
        dry_run=data["dry_run"],
        generation=data["generation"],
        testing=data["testing"],
        synchronization=data["synchronization"],
        metrics=data["metrics"],
        compliance=data["compliance"],
        delivery=data["delivery"],
        automation=data["automation"],
        paths=path_settings,
        metadata=metadata,
    )
