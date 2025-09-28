"""Configuration loading utilities for the workflow automation framework."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional
import json
import logging

try:
    import yaml
except ModuleNotFoundError as exc:  # pragma: no cover - dependency issue captured in tests
    raise RuntimeError(
        "PyYAML is required to load workflow configuration files. Install it via requirements.txt."
    ) from exc

LOGGER = logging.getLogger(__name__)


@dataclass
class GateConfig:
    """Dataclass describing configuration for a single gate."""

    name: str
    implementation: str
    enabled: bool = True
    settings: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowConfig:
    """Top-level configuration for orchestrating gates."""

    gates: List[GateConfig]
    evidence_root: str = "evidence"
    metadata_file: Optional[str] = None
    brief_file: Optional[str] = None

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "WorkflowConfig":
        gates_payload = payload.get("gates")
        if not gates_payload or not isinstance(gates_payload, list):
            raise ValueError("Configuration must include a non-empty 'gates' list.")

        gates = []
        for gate in gates_payload:
            if not isinstance(gate, dict):
                raise ValueError("Each gate entry must be an object with gate metadata.")
            try:
                gate_obj = GateConfig(
                    name=gate["name"],
                    implementation=gate["implementation"],
                    enabled=gate.get("enabled", True),
                    settings=gate.get("settings", {}),
                )
            except KeyError as exc:
                raise ValueError(f"Gate configuration missing required field: {exc}") from exc
            gates.append(gate_obj)

        return cls(
            gates=gates,
            evidence_root=payload.get("evidence_root", "evidence"),
            metadata_file=payload.get("metadata_file"),
            brief_file=payload.get("brief_file"),
        )

    @classmethod
    def load(cls, path: Path) -> "WorkflowConfig":
        """Load configuration from YAML or JSON."""

        if not path.exists():
            raise FileNotFoundError(f"Configuration file not found: {path}")

        try:
            text = path.read_text(encoding="utf-8")
        except OSError as exc:
            raise RuntimeError(f"Unable to read configuration file {path}: {exc}") from exc

        try:
            if path.suffix.lower() in {".yaml", ".yml"}:
                data = yaml.safe_load(text)
            else:
                data = json.loads(text)
        except (yaml.YAMLError, json.JSONDecodeError) as exc:
            raise ValueError(f"Failed to parse configuration file {path}: {exc}") from exc

        if not isinstance(data, dict):
            raise ValueError("Configuration root must be a mapping/dictionary.")

        config = cls.from_dict(data)
        LOGGER.debug("Loaded workflow configuration: %s", config)
        return config


__all__ = ["GateConfig", "WorkflowConfig"]
