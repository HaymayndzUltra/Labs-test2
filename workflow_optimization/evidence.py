"""Evidence collection utilities for the workflow optimization system."""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

ISO_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


@dataclass(slots=True)
class EvidenceRecord:
    """Represents a single captured evidence artifact."""

    gate_key: str
    check_name: str
    path: Path
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=lambda: datetime.utcnow())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "gate_key": self.gate_key,
            "check_name": self.check_name,
            "path": str(self.path),
            "metadata": self.metadata,
            "created_at": self.created_at.strftime(ISO_FORMAT),
        }


class EvidenceStore:
    """Handle storing structured evidence for workflow executions."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)
        self._records: List[EvidenceRecord] = []

    def _gate_dir(self, gate_key: str) -> Path:
        path = self.root / gate_key
        path.mkdir(parents=True, exist_ok=True)
        return path

    def record_text(
        self,
        gate_key: str,
        check_name: str,
        content: str,
        *,
        suffix: str = ".log",
        metadata: Dict[str, Any] | None = None,
    ) -> Path:
        """Write a textual evidence file and return its path."""

        gate_dir = self._gate_dir(gate_key)
        filename = f"{check_name}{suffix}"
        target = gate_dir / filename
        target.write_text(content)
        self._records.append(
            EvidenceRecord(
                gate_key=gate_key,
                check_name=check_name,
                path=target,
                metadata=metadata or {},
            )
        )
        return target

    def record_json(
        self,
        gate_key: str,
        check_name: str,
        payload: Dict[str, Any],
        *,
        metadata: Dict[str, Any] | None = None,
    ) -> Path:
        """Write a JSON evidence file."""

        gate_dir = self._gate_dir(gate_key)
        target = gate_dir / f"{check_name}.json"
        target.write_text(json.dumps(payload, indent=2, sort_keys=True))
        self._records.append(
            EvidenceRecord(
                gate_key=gate_key,
                check_name=check_name,
                path=target,
                metadata=metadata or {},
            )
        )
        return target

    def snapshot(self) -> List[Dict[str, Any]]:
        """Return a serializable view of all captured evidence records."""

        return [record.to_dict() for record in self._records]

    def write_index(self) -> Path:
        """Persist the evidence manifest index."""

        index_path = self.root / "index.json"
        payload = {
            "generated_at": datetime.utcnow().strftime(ISO_FORMAT),
            "artifacts": self.snapshot(),
        }
        index_path.write_text(json.dumps(payload, indent=2, sort_keys=True))
        return index_path
