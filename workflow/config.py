"""Configuration helpers for the workflow automation framework."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Optional


_DEFAULT_CONFIG_FILE = "workflow.config.json"
_DEFAULT_WORKFLOW_FILE = "workflow/workflow.json"


@dataclass(slots=True)
class ActionConfig:
    """Serializable representation of a workflow action."""

    type: str
    options: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> "ActionConfig":
        if "type" not in data:
            raise ValueError("Action configuration is missing required 'type' field")
        type_name = str(data["type"]).strip().lower()
        options = {k: v for k, v in data.items() if k != "type"}
        return cls(type=type_name, options=options)


@dataclass(slots=True)
class GateConfig:
    """Configuration describing a single workflow gate."""

    identifier: str
    name: str
    description: str
    actions: List[ActionConfig]
    required_artifacts: List[str] = field(default_factory=list)
    evidence_artifacts: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> "GateConfig":
        try:
            identifier = str(data["id"]).strip()
            name = str(data.get("name", identifier)).strip()
            description = str(data.get("description", "")).strip()
        except KeyError as exc:  # pragma: no cover - defensive guard
            raise ValueError("Gate configuration requires an 'id' field") from exc

        actions_data = data.get("actions", [])
        if not isinstance(actions_data, Iterable):
            raise ValueError(f"Gate '{identifier}' actions must be an iterable")
        actions = [ActionConfig.from_mapping(item) for item in actions_data]

        def _string_list(key: str) -> List[str]:
            raw = data.get(key, [])
            if isinstance(raw, str):
                return [raw]
            if isinstance(raw, Iterable):
                return [str(item) for item in raw]
            return []

        return cls(
            identifier=identifier,
            name=name,
            description=description,
            actions=actions,
            required_artifacts=_string_list("required_artifacts"),
            evidence_artifacts=_string_list("evidence"),
            tags=_string_list("tags"),
        )


@dataclass(slots=True)
class WorkflowConfig:
    """Represents the hydrated workflow configuration."""

    project_name: str
    industry: str
    project_type: str
    frontend: str
    backend: str
    database: str
    auth: Optional[str]
    deploy: Optional[str]
    output_root: Path
    evidence_root: Path
    gates: List[GateConfig]
    environment: Dict[str, str] = field(default_factory=dict)

    @property
    def project_dir(self) -> Path:
        return self.output_root / self.project_name

    def with_overrides(self, **overrides: Any) -> "WorkflowConfig":
        data = {
            "project_name": self.project_name,
            "industry": self.industry,
            "project_type": self.project_type,
            "frontend": self.frontend,
            "backend": self.backend,
            "database": self.database,
            "auth": self.auth,
            "deploy": self.deploy,
            "output_root": str(self.output_root),
            "evidence_root": str(self.evidence_root),
            "workflow": {"gates": [self._gate_to_dict(gate) for gate in self.gates]},
            "environment": dict(self.environment),
        }
        data.update(overrides)
        return WorkflowConfig.from_dict(data)

    @classmethod
    def _gate_to_dict(cls, gate: GateConfig) -> Dict[str, Any]:
        return {
            "id": gate.identifier,
            "name": gate.name,
            "description": gate.description,
            "actions": [{"type": action.type, **action.options} for action in gate.actions],
            "required_artifacts": list(gate.required_artifacts),
            "evidence": list(gate.evidence_artifacts),
            "tags": list(gate.tags),
        }

    @classmethod
    def load(
        cls,
        root: Path,
        config_file: Optional[Path] = None,
        workflow_file: Optional[Path] = None,
        env: Optional[Mapping[str, str]] = None,
    ) -> "WorkflowConfig":
        config_path = Path(config_file) if config_file else root / _DEFAULT_CONFIG_FILE
        workflow_path = Path(workflow_file) if workflow_file else root / _DEFAULT_WORKFLOW_FILE

        with config_path.open("r", encoding="utf-8") as fh:
            config_data = json.load(fh)
        with workflow_path.open("r", encoding="utf-8") as fh:
            workflow_data = json.load(fh)

        merged_env: Dict[str, str] = dict(os.environ)
        if env:
            merged_env.update(env)

        return cls.from_dict(
            {
                **config_data,
                "workflow": workflow_data,
                "environment": merged_env,
            }
        )

    @classmethod
    def from_dict(cls, data: Mapping[str, Any]) -> "WorkflowConfig":
        workflow_data = data.get("workflow") or {}
        gates_data = workflow_data.get("gates", [])
        gates = [GateConfig.from_mapping(item) for item in gates_data]

        output_root = Path(str(data.get("output_root") or data.get("output_root", "./_generated")))
        evidence_root = Path(
            str(
                data.get("evidence_root")
                or workflow_data.get("evidence_root")
                or "evidence"
            )
        )

        return cls(
            project_name=str(data.get("name") or data.get("project_name") or "project"),
            industry=str(data.get("industry") or "unknown"),
            project_type=str(data.get("project_type") or "unspecified"),
            frontend=str(data.get("frontend") or ""),
            backend=str(data.get("backend") or ""),
            database=str(data.get("database") or ""),
            auth=data.get("auth"),
            deploy=data.get("deploy"),
            output_root=output_root if output_root.is_absolute() else Path.cwd() / output_root,
            evidence_root=evidence_root,
            gates=gates,
            environment=dict(data.get("environment", {})),
        )

    def ensure_directories(self) -> None:
        self.project_dir.mkdir(parents=True, exist_ok=True)
        (self.project_dir / self.evidence_root).mkdir(parents=True, exist_ok=True)

    def to_environment(self) -> Dict[str, str]:
        env = dict(self.environment)
        env.update(
            {
                "NAME": self.project_name,
                "INDUSTRY": self.industry,
                "PROJECT_TYPE": self.project_type,
                "FE": self.frontend,
                "BE": self.backend,
                "DB": self.database,
            }
        )
        if self.auth:
            env["AUTH"] = self.auth
        if self.deploy:
            env["DEPLOY"] = self.deploy
        env.setdefault("OUTPUT_ROOT", str(self.output_root))
        env.setdefault("PROJECT_DIR", str(self.project_dir))
        return env


def load_default(root: Optional[Path] = None) -> WorkflowConfig:
    base = root or Path.cwd()
    return WorkflowConfig.load(base)

