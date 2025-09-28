"""Workflow context shared across gates."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional
import logging

from .config import WorkflowConfig, GateConfig

LOGGER = logging.getLogger(__name__)


@dataclass
class GateOutcome:
    """Represents the result of running a gate."""

    name: str
    status: str
    details: str
    evidence: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "status": self.status,
            "details": self.details,
            "evidence": self.evidence,
        }


@dataclass
class WorkflowContext:
    """Runtime context shared by gate implementations."""

    project_root: Path
    config: WorkflowConfig
    evidence_root: Path
    metadata: Dict[str, Any] = field(default_factory=dict)
    brief: Optional[str] = None
    outcomes: List[GateOutcome] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.project_root = Path(self.project_root).resolve()
        self.evidence_root = Path(self.evidence_root).resolve()
        self.evidence_root.mkdir(parents=True, exist_ok=True)

    def add_outcome(self, outcome: GateOutcome) -> None:
        LOGGER.info("Gate %s result: %s", outcome.name, outcome.status)
        self.outcomes.append(outcome)

    def gate_config(self, gate_name: str) -> Optional[GateConfig]:
        for gate in self.config.gates:
            if gate.name == gate_name:
                return gate
        return None


__all__ = ["WorkflowContext", "GateOutcome"]
