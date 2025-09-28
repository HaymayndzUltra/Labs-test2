"""Evidence collection helpers."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from .exceptions import EvidenceError


@dataclass
class EvidenceRecord:
    """Metadata describing an evidence artifact."""

    gate_id: str
    check_id: str
    artifact_path: Path
    description: str
    produced_at: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert the record into a serializable dictionary."""

        return {
            "gate_id": self.gate_id,
            "check_id": self.check_id,
            "artifact_path": str(self.artifact_path),
            "description": self.description,
            "produced_at": self.produced_at.isoformat() + "Z",
            "metadata": self.metadata,
        }


class EvidenceCollector:
    """Collects evidence artifacts generated during workflow execution."""

    def __init__(self, base_dir: Path) -> None:
        self.base_dir = base_dir
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self.records: List[EvidenceRecord] = []

    def add_record(
        self,
        gate_id: str,
        check_id: str,
        artifact_path: Path,
        description: str,
        metadata: Optional[Dict[str, Any]] = None,
        compute_hash: bool = True,
    ) -> EvidenceRecord:
        """Register a new evidence artifact."""

        artifact_path = artifact_path.resolve()
        if not artifact_path.exists():
            raise EvidenceError(f"Artifact not found: {artifact_path}")

        checksum = None
        if compute_hash:
            checksum = self._hash_file(artifact_path)

        record_metadata = metadata.copy() if metadata else {}
        if checksum is not None:
            record_metadata.setdefault("sha256", checksum)

        record = EvidenceRecord(
            gate_id=gate_id,
            check_id=check_id,
            artifact_path=artifact_path,
            description=description,
            metadata=record_metadata,
        )
        self.records.append(record)
        return record

    def _hash_file(self, path: Path) -> str:
        """Compute a SHA256 checksum for a file."""

        hasher = hashlib.sha256()
        with path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(8192), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def write_manifest(self, destination: Path) -> None:
        """Write a manifest for all collected evidence."""

        destination.parent.mkdir(parents=True, exist_ok=True)
        manifest = {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "artifacts": [record.to_dict() for record in self.records],
        }
        with destination.open("w", encoding="utf-8") as handle:
            json.dump(manifest, handle, indent=2)

    def clear(self) -> None:
        """Reset the collector state."""

        self.records.clear()
