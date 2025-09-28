"""Shared models for workflow optimization."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

from .gates import GateResult, GateStatus

ISO_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


@dataclass(slots=True)
class RunContext:
    """Input metadata describing the project undergoing automation."""

    project_name: str
    project_type: str
    industry: str
    output_dir: Path
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        payload = {
            "project_name": self.project_name,
            "project_type": self.project_type,
            "industry": self.industry,
            "output_dir": str(self.output_dir),
        }
        payload.update(self.metadata)
        return payload


@dataclass(slots=True)
class AutomationReport:
    """Machine-readable summary describing a full workflow execution."""

    started_at: datetime
    finished_at: datetime
    gate_results: List[GateResult]
    context: RunContext

    def to_dict(self) -> Dict[str, Any]:
        return {
            "started_at": self.started_at.strftime(ISO_FORMAT),
            "finished_at": self.finished_at.strftime(ISO_FORMAT),
            "context": self.context.to_dict(),
            "gates": [result.to_dict() for result in self.gate_results],
        }

    def succeeded(self) -> bool:
        return all(result.status is GateStatus.PASSED for result in self.gate_results)
