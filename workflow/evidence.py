"""Evidence management utilities."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

ISO_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


def utc_now() -> str:
    return datetime.now(tz=timezone.utc).strftime(ISO_FORMAT)


@dataclass(slots=True)
class EvidenceEntry:
    """Individual evidence artifact metadata."""

    path: str
    description: str = ""
    hash: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        payload = {"path": self.path}
        if self.description:
            payload["description"] = self.description
        if self.hash:
            payload["hash"] = self.hash
        return payload


@dataclass(slots=True)
class GateRecord:
    """Stores execution metadata for a single gate."""

    gate_id: str
    name: str
    status: str
    started_at: str
    completed_at: str
    notes: str = ""
    artifacts: List[EvidenceEntry] = field(default_factory=list)
    actions: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "gate_id": self.gate_id,
            "name": self.name,
            "status": self.status,
            "started_at": self.started_at,
            "completed_at": self.completed_at,
            "notes": self.notes,
            "artifacts": [artifact.to_dict() for artifact in self.artifacts],
            "actions": list(self.actions),
        }


@dataclass(slots=True)
class EvidenceManifest:
    """Aggregated execution results for an entire workflow run."""

    project_name: str
    generated_at: str
    records: List[GateRecord] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)

    def add_record(self, record: GateRecord) -> None:
        self.records.append(record)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "project": self.project_name,
            "generated_at": self.generated_at,
            "context": dict(self.context),
            "gates": [record.to_dict() for record in self.records],
        }

    def write(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as handle:
            json.dump(self.to_dict(), handle, indent=2)


class EvidenceCollector:
    """Convenience helper that accumulates evidence throughout a run."""

    def __init__(self, project_name: str, manifest_path: Path, context: Optional[Dict[str, Any]] = None) -> None:
        self.manifest = EvidenceManifest(project_name=project_name, generated_at=utc_now())
        if context:
            self.manifest.context.update(context)
        self.manifest_path = manifest_path

    def register(
        self,
        gate_id: str,
        name: str,
        status: str,
        started_at: str,
        completed_at: str,
        *,
        notes: str = "",
        artifacts: Optional[Iterable[EvidenceEntry]] = None,
        actions: Optional[List[Dict[str, Any]]] = None,
    ) -> None:
        record = GateRecord(
            gate_id=gate_id,
            name=name,
            status=status,
            started_at=started_at,
            completed_at=completed_at,
            notes=notes,
        )
        if artifacts:
            record.artifacts.extend(list(artifacts))
        if actions:
            record.actions.extend(actions)
        self.manifest.add_record(record)
        self.manifest.write(self.manifest_path)

    def finalize(self) -> None:
        self.manifest.generated_at = utc_now()
        self.manifest.write(self.manifest_path)

