"""Data models used by the workflow optimizer."""

from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional


class GateStatus(str, Enum):
    """Enumeration of gate execution outcomes."""

    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass(slots=True)
class EvidenceRecord:
    """Captured evidence for a particular gate execution."""

    gate: str
    description: str
    artifact_path: Optional[Path] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: str = field(
        default_factory=lambda: _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    )


@dataclass(slots=True)
class GateContext:
    """Context passed to gates during execution."""

    project_root: Path
    evidence_root: Path
    config: Dict[str, Any] = field(default_factory=dict)

    def resolve(self, *parts: str | Path) -> Path:
        """Resolve a path relative to the project root."""

        return self.project_root.joinpath(*map(str, parts))


ActionType = Callable[[GateContext], EvidenceRecord | Iterable[EvidenceRecord] | None]


@dataclass(slots=True)
class GateDefinition:
    """Description of a gate that can be executed."""

    name: str
    description: str
    action: ActionType
    optional: bool = False
    evidence_dir: Optional[str] = None
    tags: Iterable[str] = field(default_factory=list)


@dataclass(slots=True)
class GateResult:
    """Result of executing a gate."""

    definition: GateDefinition
    status: GateStatus
    message: str
    evidence: List[EvidenceRecord] = field(default_factory=list)
    duration_seconds: float = 0.0

    @property
    def name(self) -> str:
        return self.definition.name

    def as_dict(self) -> Dict[str, Any]:
        return {
            "name": self.definition.name,
            "description": self.definition.description,
            "status": self.status.value,
            "message": self.message,
            "duration_seconds": self.duration_seconds,
            "evidence": [
                {
                    "description": e.description,
                    "artifact_path": str(e.artifact_path) if e.artifact_path else None,
                    "metadata": e.metadata,
                    "timestamp": e.timestamp,
                }
                for e in self.evidence
            ],
            "tags": list(self.definition.tags),
        }
